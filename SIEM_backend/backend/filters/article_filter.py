# Dans un nouveau fichier: backend/filters/article_filter.py

import re
from typing import Dict, List, Tuple

class CloudPermissionArticleFilter:
    
    # Mots-clés OBLIGATOIRES (au moins 1 doit être présent)
    CORE_KEYWORDS = {
        # Providers cloud
        'aws', 'azure', 'gcp', 'google cloud', 'amazon web services', 'microsoft azure',
        
        # Permissions & IAM
        'iam', 'permissions', 'access control', 'rbac', 'abac', 'policy', 'policies',
        'authorization', 'privilege', 'role', 'identity',
        
        # Cloud security
        'cloud security', 'cloud permission', 'cloud access', 'cloud iam',
    }
    
    # Mots-clés HAUTEMENT pertinents (score élevé)
    HIGH_RELEVANCE_KEYWORDS = {
        # CIEM et outils
        'ciem', 'cloud infrastructure entitlement management', 'wiz', 'orca', 'prisma cloud',
        'crowdstrike', 'tenable', 'lacework', 'ermetic', 'sonrai', 'cloudknox',
        
        # Permissions excessives
        'least privilege', 'excessive permission', 'overprivileged', 'permission creep',
        'privilege escalation', 'over-permissioned', 'unused permission',
        
        # IAM spécifique cloud
        'iam role', 'iam policy', 'service account', 'managed identity', 'assume role',
        'sts', 'workload identity', 'federated identity',
        
        # Risques liés aux permissions
        'permission misconfiguration', 'access misconfiguration', 'iam misconfiguration',
        'orphaned permission', 'shadow admin', 'toxic combination',
    }
    
    # Mots-clés MOYENNEMENT pertinents
    MEDIUM_RELEVANCE_KEYWORDS = {
        # Services cloud IAM
        's3 bucket policy', 'kms key policy', 'resource policy', 'scp', 'service control policy',
        'azure ad', 'entra id', 'conditional access', 'pim', 'privileged identity management',
        'gcp organization policy', 'workload identity federation',
        
        # Concepts de sécurité
        'zero trust', 'just-in-time access', 'jit', 'pam', 'privileged access management',
        'identity governance', 'entitlement management', 'access review',
        
        # Attaques et menaces
        'cloud attack', 'cloud breach', 'lateral movement', 'cloud misconfiguration',
        'data exposure', 'credential theft', 'token hijacking',
        
        # Conformité
        'compliance', 'audit', 'governance', 'posture management', 'cspm',
    }
    
    # Mots-clés de CONTEXTE (apportent du poids si combinés)
    CONTEXT_KEYWORDS = {
        'best practice', 'vulnerability', 'cve', 'security incident', 'data breach',
        'recommendation', 'hardening', 'remediation', 'mitigation',
        'monitoring', 'detection', 'threat', 'risk assessment',
    }
    
    # Seuils de score
    MINIMUM_SCORE = 10  # Score minimum pour considérer l'article pertinent
    
    def __init__(self):
        """Initialise le filtre avec les patterns regex compilés"""
        self.core_patterns = self._compile_patterns(self.CORE_KEYWORDS)
        self.high_patterns = self._compile_patterns(self.HIGH_RELEVANCE_KEYWORDS)
        self.medium_patterns = self._compile_patterns(self.MEDIUM_RELEVANCE_KEYWORDS)
        self.context_patterns = self._compile_patterns(self.CONTEXT_KEYWORDS)
    
    def _compile_patterns(self, keywords: set) -> List[re.Pattern]:
        """Compile les mots-clés en patterns regex (insensible à la casse)"""
        return [re.compile(r'\b' + re.escape(kw) + r'\b', re.IGNORECASE) for kw in keywords]
    
    def _count_matches(self, text: str, patterns: List[re.Pattern]) -> int:
        """Compte le nombre de correspondances uniques dans le texte"""
        matches = set()
        for pattern in patterns:
            if pattern.search(text):
                matches.add(pattern.pattern)
        return len(matches)
    
    def calculate_score(self, article: Dict) -> Tuple[int, Dict[str, int]]:
        """
        Calcule le score de pertinence d'un article
        
        Args:
            article: Dict contenant 'title', 'description', 'content', 'summary'
        
        Returns:
            Tuple (score_total, détails_scores)
        """
        # Combiner tous les textes de l'article (avec pondération par zone)
        title = article.get('title', '') or ''
        description = article.get('description', '') or ''
        content = article.get('content', '') or ''
        summary = article.get('summary', '') or ''
        
        # Le titre et le résumé ont plus de poids
        weighted_text = f"{title} {title} {summary} {summary} {description} {content}"
        
        # Vérifier d'abord les mots-clés OBLIGATOIRES
        core_matches = self._count_matches(weighted_text, self.core_patterns)
        
        if core_matches == 0:
            # Si aucun mot-clé obligatoire, l'article n'est pas pertinent
            return 0, {
                'core': 0,
                'high': 0,
                'medium': 0,
                'context': 0,
                'reason': 'Aucun mot-clé cloud/IAM/permission trouvé'
            }
        
        # Calculer les scores par catégorie
        high_matches = self._count_matches(weighted_text, self.high_patterns)
        medium_matches = self._count_matches(weighted_text, self.medium_patterns)
        context_matches = self._count_matches(weighted_text, self.context_patterns)
        
        # Calcul du score total avec pondération
        score = (
            core_matches * 3 +        # Mots-clés core: 3 points chacun
            high_matches * 5 +        # Haute pertinence: 5 points
            medium_matches * 2 +      # Moyenne pertinence: 2 points
            context_matches * 1     # Contexte: 1 point
        )
        
        details = {
            'core': core_matches,
            'high': high_matches,
            'medium': medium_matches,
            'context': context_matches,
            'total': score
        }
        
        return score, details
    
    def is_relevant(self, article: Dict) -> bool:
        """
        Détermine si un article est pertinent pour le sujet
        
        Args:
            article: Dict contenant les informations de l'article
        
        Returns:
            True si l'article est pertinent, False sinon
        """
        score, _ = self.calculate_score(article)
        return score >= self.MINIMUM_SCORE
    
    def filter_articles(self, articles: List[Dict]) -> Tuple[List[Dict], List[Dict]]:
        """
        Filtre une liste d'articles
        
        Args:
            articles: Liste d'articles à filtrer
        
        Returns:
            Tuple (articles_pertinents, articles_rejetés_avec_raisons)
        """
        relevant = []
        rejected = []
        
        for article in articles:
            score, details = self.calculate_score(article)
            
            if score >= self.MINIMUM_SCORE:
                # Ajouter le score aux métadonnées de l'article
                article['relevance_score'] = score
                article['score_details'] = details
                relevant.append(article)
            else:
                article['relevance_score'] = score
                article['score_details'] = details
                article['rejection_reason'] = f"Score insuffisant: {score}/{self.MINIMUM_SCORE}"
                rejected.append(article)
        
        return relevant, rejected


# Fonction utilitaire pour l'intégration
def filter_cloud_permission_articles(articles: List[Dict]) -> List[Dict]:
    """
    Fonction helper pour filtrer les articles
    
    Args:
        articles: Liste d'articles à filtrer
    
    Returns:
        Liste des articles pertinents uniquement
    """
    filter_instance = CloudPermissionArticleFilter()
    relevant_articles, _ = filter_instance.filter_articles(articles)
    return relevant_articles