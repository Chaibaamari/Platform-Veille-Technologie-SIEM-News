from backend.models import Article, Vulnerabilite, Categorie, Type_Vulnerabilite, Source
from datetime import datetime

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
    """Save a list of articles to the database"""
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

        Article.objects.create(
            titre_article=item.get('title', ''),
            url_article=item.get('link', ''),
            description_article=item.get('description', ''),
            contenu_article=item.get('content', ''),
            summary_article=item.get('summary', ''),
            date_publication=pub_date,
            thumbnail=item.get('thumbnail', ''),
            source_id=source.id_source
        )

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
    """Save new vulnerabilities and link their types only if CWEs exist in DB"""
    new_vulns = filter_new_vulnerabilities(vulnerabilites)

    for vul in new_vulns:
        # Get list of CWE IDs for this vulnerability
        cwe_ids = vul.get('types_vuln', [])

        # Check if all CWEs exist in Type_Vulnerabilite
        existing_cwes = Type_Vulnerabilite.objects.filter(cwe_id__in=cwe_ids).values_list('cwe_id', flat=True)
        existing_cwes_set = set(existing_cwes)

        # If any CWE is missing, skip this vulnerability
        if not all(cwe in existing_cwes_set for cwe in cwe_ids):
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

        vuln_obj = Vulnerabilite.objects.create(
            cve_id=vul.get('cve_id'),
            description_vuln=vul.get('description_vuln', ''),
            severite=severity,
            score_cvss=vul.get('score_cvss'),
            date_publication=pub_date
        )

        # Link the existing CWEs
        for cwe_id in cwe_ids:
            type_obj = Type_Vulnerabilite.objects.get(cwe_id=cwe_id)
            vuln_obj.types_vuln.add(type_obj)
