import string
import secrets
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from backend.models import Utilisateur
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import logging

logger = logging.getLogger('backend')

def paginate_queryset(queryset, request, page_size=20):
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', page_size)

    paginator = Paginator(queryset, page_size)

    try:
        page_obj = paginator.page(page)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    return {
        'items': page_obj.object_list,
        'pagination': {
            'page': page_obj.number,
            'page_size': int(page_size),
            'total_pages': paginator.num_pages,
            'total_items': paginator.count,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        }
    }

def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

def send_email(subject, to_email, template_name, context=None):
    """
    Send an email using a template.
    
    :param subject: Email subject
    :param to_email: Recipient email (string)
    :param template_name: Template file name inside emails folder
    :param context: Dictionary with variables for template
    """
    if context is None:
        context = {}

    # Render HTML and plain text versions
    html_content = render_to_string(f'emails/{template_name}.html', context)
    text_content = render_to_string(f'emails/{template_name}.txt', context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_password_reset_email(utilisateur: Utilisateur, token):
    """Envoie un email de réinitialisation de mot de passe"""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token.token}"
    username = utilisateur.email_utilisateur
    
    subject = 'Réinitialisation de votre mot de passe'
    context = {
        'username': username,
        'url': reset_url
    }

    try:
        send_email(
            subject=subject,
            context=context,
            to_email=username,
            template_name='forgot_email'
        )
        logger.info(f"L'email de récupération d'email a été envoyé à l'utilisateur {username}")

    except Exception as e:
        logger.error(f"L'email n'a pas été envoyé à l'utilisateur {username}: {e}")


def send_login_credentials_to_user(utilisateur: Utilisateur, generated_password: str = None):
    username = utilisateur.email_utilisateur

    # Generate password if not provided
    if generated_password is None:
        generated_password = generate_random_password()

    context = {
        'username': username,
        'password': generated_password,
        'url': f'{settings.FRONTEND_URL}/login'
    }

    subject = "Bienvenue dans notre équipe!"

    try:
        send_email(
            subject=subject,
            context=context,
            to_email=username,
            template_name='auth_email'
        )
        logger.info(f"L'email d'authentification a été envoyé à l'utilisateur {username}")

    except Exception as e:
        logger.error(f"L'email n'a pas été envoyé à l'utilisateur {username}: {e}")


from bs4 import BeautifulSoup

def clean_html_for_pdf(html_content: str) -> str:
    """
    Clean HTML for reportlab PDF Paragraph:
    - Remove unsupported tags
    - Remove empty paragraphs
    - Convert <br> and <p> to newlines
    - Keep simple formatting: bold, italic
    """
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove empty tags
    for tag in soup.find_all():
        if tag.name in ["p", "div", "span"] and not tag.get_text(strip=True):
            tag.decompose()

    # Only keep tags supported by reportlab
    for tag in soup.find_all():
        if tag.name not in ["b", "strong", "i", "em", "u", "a", "br"]:
            tag.unwrap()

    # Convert paragraphs to text + line breaks
    for p in soup.find_all("p"):
        p.insert_before("\n")  # Add newline before paragraph
        p.insert_after("\n")   # Add newline after paragraph
        p.unwrap()

    # Convert <br> to newline
    for br in soup.find_all("br"):
        br.replace_with("\n")

    # Return cleaned text
    return soup.get_text()
