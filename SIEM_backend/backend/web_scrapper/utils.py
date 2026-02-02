from backend.models import Article, Vulnerabilite, Categorie, Type_Vulnerabilite, Source
from datetime import datetime
import logging
from backend.views.utils import send_email
from backend.models import Utilisateur
from django.conf import settings

logger = logging.getLogger('backend')

# =======================
# ARTICLES
# =======================
def filter_new_articles(rss_items):
    """Keep only articles whose URL is not yet in the DB or duplicated in the list"""
    existing_links = set(Article.objects.values_list('url_article', flat=True))
    seen_links = set()  # track duplicates in the incoming list

    new_articles = []
    for item in rss_items:
        link = item.get('link')
        if link and link not in existing_links and link not in seen_links:
            new_articles.append(item)
            seen_links.add(link)
    return new_articles


def save_articles_to_database(articles):
    """
    Save a list of articles to the database
    Returns: List of IDs of newly created articles
    """
    new_article_ids = []
    
    for item in articles:
        pub_date = item.get('publication_date')
        if pub_date:
            try:
                pub_date = datetime.fromisoformat(pub_date).date()
            except ValueError:
                pub_date = None

        # extract the source
        source_name = item.get('source')
        source, _ = Source.objects.get_or_create(
            nom_source=source_name,
            defaults={
                "flux_rss": item.get('rss_url', '')  # if you have it
            }
        )

        try:
            article = Article.objects.create(
                titre_article=item.get('title', ''),
                url_article=item.get('link', ''),
                description_article=item.get('description', ''),
                contenu_article=item.get('content', ''),
                summary_article=item.get('summary', ''),
                date_publication=pub_date,
                thumbnail=item.get('thumbnail', ''),
                source_id=source.id_source
            )
            
            # Add categories if present
            categories = item.get('categories', [])
            if categories:
                # Get or create category objects
                category_objects = []
                for cat_name in categories:
                    cat_obj, _ = Categorie.objects.get_or_create(
                        nom_categorie=cat_name.strip().lower()
                    )
                    category_objects.append(cat_obj)
                
                # Link categories to article
                article.categories.set(category_objects)
            
            new_article_ids.append(article.id_article)
            logger.info(f"Article sauvegardé: {article.titre_article[:50]}...")
            
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde de l'article {item.get('title', 'Sans titre')}: {str(e)}")
            continue
    
    logger.info(f"Total d'articles sauvegardés: {len(new_article_ids)}")
    return new_article_ids


# =======================
# CATEGORIES
# =======================
def filter_new_categories(categories):
    """Keep only categories not already in DB or duplicates in the list"""
    existing_categories = set(name.lower() for name in Categorie.objects.values_list('nom_categorie', flat=True))
    seen_categories = set()
    new_categories = []

    for cat in categories:
        normalized = cat.strip().lower()
        if normalized and normalized not in existing_categories and normalized not in seen_categories:
            new_categories.append(normalized)
            seen_categories.add(normalized)

    return new_categories


def save_categories_to_database(categories):
    """Save new categories to DB"""
    for cat_name in categories:
        Categorie.objects.get_or_create(nom_categorie=cat_name.lower())


# =======================
# VULNERABILITIES
# =======================
def filter_new_vulnerabilities(vuls_list):
    """Keep only vulnerabilities not yet in DB or duplicates in the list"""
    existing_vuls = set(Vulnerabilite.objects.values_list('cve_id', flat=True))
    seen_vuls = set()
    new_vuls = []

    for vul in vuls_list:
        cve_id = vul.get('cve_id')
        if cve_id and cve_id not in existing_vuls and cve_id not in seen_vuls:
            new_vuls.append(vul)
            seen_vuls.add(cve_id)

    return new_vuls


def save_vulnerabilites_to_database(vulnerabilites):
    """
    Save new vulnerabilities and link their types only if CWEs exist in DB
    Returns: List of CVE IDs of newly created vulnerabilities
    """
    new_vulns = filter_new_vulnerabilities(vulnerabilites)
    new_vuln_ids = []

    for vul in new_vulns:
        # Get list of CWE IDs for this vulnerability
        cwe_ids = vul.get('types_vuln', [])

        # Check if all CWEs exist in Type_Vulnerabilite
        existing_cwes = Type_Vulnerabilite.objects.filter(cwe_id__in=cwe_ids).values_list('cwe_id', flat=True)
        existing_cwes_set = set(existing_cwes)

        # If any CWE is missing, skip this vulnerability
        if cwe_ids and not all(cwe in existing_cwes_set for cwe in cwe_ids):
            logger.warning(f"Vulnérabilité {vul.get('cve_id')} ignorée: CWEs manquants")
            continue

        # Parse publication date
        pub_date = vul.get('date_publication')
        if pub_date:
            try:
                pub_date = datetime.fromisoformat(pub_date).date()
            except ValueError:
                pub_date = None

        # Ensure severity is set, default to 'unknown'
        severity = vul.get('severite') or 'unknown'

        try:
            vuln_obj = Vulnerabilite.objects.create(
                cve_id=vul.get('cve_id'),
                description_vuln=vul.get('description_vuln', ''),
                severite=severity,
                score_cvss=vul.get('score_cvss'),
                date_publication=pub_date
            )

            # Link the existing CWEs
            for cwe_id in cwe_ids:
                try:
                    type_obj = Type_Vulnerabilite.objects.get(cwe_id=cwe_id)
                    vuln_obj.types_vuln.add(type_obj)
                except Type_Vulnerabilite.DoesNotExist:
                    logger.warning(f"Type de vulnérabilité {cwe_id} introuvable pour {vuln_obj.cve_id}")
            
            new_vuln_ids.append(vuln_obj.cve_id)
            logger.info(f"Vulnérabilité sauvegardée: {vuln_obj.cve_id} ({severity})")
            
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde de la vulnérabilité {vul.get('cve_id')}: {str(e)}")
            continue
    
    logger.info(f"Total de vulnérabilités sauvegardées: {len(new_vuln_ids)}")
    return new_vuln_ids



def send_scraping_notification_email(utilisateur: Utilisateur, context: dict):
    """
    Envoie une notification de veille à un utilisateur
    
    Args:
        utilisateur: Instance de Utilisateur
        context: Dictionnaire contenant les données pour le template
    """
    username = utilisateur.email_utilisateur
    
    # Créer le sujet personnalisé
    subject_parts = []
    if context.get('has_vulnerabilities'):
        vuln_count = context.get('vulnerabilities_count', 0)
        critical_count = len(context.get('critical_vulns', []))
        if critical_count > 0:
            subject_parts.append(f"{critical_count} vulnérabilité(s) critique(s)")
        else:
            subject_parts.append(f"{vuln_count} nouvelle(s) vulnérabilité(s)")
    
    if context.get('total_articles', 0) > 0:
        subject_parts.append(f"{context['total_articles']} nouvel(aux) article(s)")
    
    subject = f"🔔 Veille de sécurité : {' | '.join(subject_parts)}" if subject_parts else "🔔 Veille de sécurité"
    
    try:
        send_email(
            subject=subject,
            context=context,
            to_email=username,
            template_name='scraping_notification'
        )
        logger.info(f"Notification de veille envoyée à {username}")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de la notification à {username}: {e}")


def send_scraping_notifications_to_all_users(new_vulnerabilities_ids, new_articles_ids):
    """
    Envoie des notifications par email à tous les utilisateurs actifs
    
    Args:
        new_vulnerabilities_ids: Liste des IDs (cve_id) des nouvelles vulnérabilités
        new_articles_ids: Liste des IDs des nouveaux articles
    """
    from backend.models import Vulnerabilite, Article
    from datetime import date
    
    # Récupérer les nouvelles vulnérabilités
    new_vulnerabilities = Vulnerabilite.objects.filter(
        cve_id__in=new_vulnerabilities_ids
    ).prefetch_related('types_vuln') if new_vulnerabilities_ids else Vulnerabilite.objects.none()
    
    # Récupérer les nouveaux articles
    new_articles = Article.objects.filter(
        id_article__in=new_articles_ids
    ).select_related('source').prefetch_related('categories') if new_articles_ids else Article.objects.none()
    
    # S'il n'y a rien de nouveau, ne pas envoyer de notifications
    if not new_vulnerabilities.exists() and not new_articles.exists():
        logger.info("Aucune nouvelle vulnérabilité ou article. Pas de notification envoyée.")
        return
    
    # Récupérer tous les utilisateurs actifs
    utilisateurs = Utilisateur.objects.filter(is_active=True).prefetch_related('categories_suivies')
    
    if not utilisateurs.exists():
        logger.warning("Aucun utilisateur actif trouvé pour l'envoi de notifications.")
        return
    
    notifications_sent = 0
    notifications_failed = 0
    
    logger.info(f"Envoi de notifications à {utilisateurs.count()} utilisateur(s)...")
    
    for utilisateur in utilisateurs:
        try:
            # Filtrer les articles par catégories suivies par l'utilisateur
            user_categories = list(utilisateur.categories_suivies.all())
            
            relevant_articles_by_category = {}
            
            if user_categories:
                for article in new_articles:
                    article_categories = article.categories.all()
                    for cat in article_categories:
                        if cat in user_categories:
                            if cat not in relevant_articles_by_category:
                                relevant_articles_by_category[cat] = []
                            # Éviter les doublons si un article a plusieurs catégories suivies
                            if article not in relevant_articles_by_category[cat]:
                                relevant_articles_by_category[cat].append(article)
            
            # Envoyer l'email seulement s'il y a des vulnérabilités OU des articles pertinents
            if new_vulnerabilities.exists() or relevant_articles_by_category:
                # Préparer le contexte pour le template
                context = {
                    'utilisateur': utilisateur,
                    'nom_utilisateur': utilisateur.nom_utilisateur,
                    'has_vulnerabilities': new_vulnerabilities.exists(),
                    'vulnerabilities_count': new_vulnerabilities.count(),
                    'critical_vulns': list(new_vulnerabilities.filter(severite='critical')),
                    'high_vulns': list(new_vulnerabilities.filter(severite='high')),
                    'medium_vulns': list(new_vulnerabilities.filter(severite='medium')),
                    'low_vulns': list(new_vulnerabilities.filter(severite='low')),
                    'relevant_categories': relevant_articles_by_category,
                    'total_articles': sum(len(articles) for articles in relevant_articles_by_category.values()),
                    'date': date.today(),
                    'frontend_url': settings.FRONTEND_URL
                }
                
                send_scraping_notification_email(utilisateur, context)
                notifications_sent += 1
            else:
                logger.info(f"Aucun contenu pertinent pour {utilisateur.email_utilisateur}, email non envoyé.")
        
        except Exception as e:
            notifications_failed += 1
            logger.error(f"Erreur lors de l'envoi de la notification à {utilisateur.email_utilisateur}: {str(e)}")
    
    logger.info(f"Notifications envoyées: {notifications_sent}/{utilisateurs.count()} (échecs: {notifications_failed})")
    return {
        'sent': notifications_sent,
        'failed': notifications_failed,
        'total': utilisateurs.count()
    }