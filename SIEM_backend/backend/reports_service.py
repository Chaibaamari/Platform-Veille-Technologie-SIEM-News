"""
Service de génération de rapports PDF et Excel
"""
from io import BytesIO
from datetime import datetime, timedelta
from django.db.models import Count
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from .models import Article, Vulnerabilite


class ReportGenerator:
    """Générateur de rapports PDF et Excel"""
    
    @staticmethod
    def generate_articles_pdf(days=30):
        """Génère un rapport PDF des articles"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
        styles = getSampleStyleSheet()
        story = []
        
        # En-tête
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1f4788'),
            spaceAfter=12,
            alignment=1
        )
        story.append(Paragraph("Rapport des Articles", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Infos du rapport
        report_date = datetime.now().strftime("%d/%m/%Y %H:%M")
        story.append(Paragraph(f"<b>Date du rapport :</b> {report_date}", styles['Normal']))
        story.append(Paragraph(f"<b>Période :</b> Derniers {days} jours", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Récupérer les articles
        from_date = datetime.now().date() - timedelta(days=days)
        articles = Article.objects.filter(
            date_publication__gte=from_date
        ).order_by('-date_publication')
        
        # Stats
        story.append(Paragraph(f"<b>Total d'articles :</b> {articles.count()}", styles['Normal']))
        
        # Tableau des articles
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph("<b>Articles détaillés :</b>", styles['Heading2']))
        story.append(Spacer(1, 0.1*inch))
        
        data = [['Date', 'Titre', 'Source', 'Catégories']]
        for article in articles[:50]:  # Limiter à 50 pour la lisibilité
            categories = ', '.join([c.nom_categorie for c in article.categories.all()])
            data.append([
                article.date_publication.strftime("%d/%m/%Y"),
                article.titre_article[:40] + '...' if len(article.titre_article) > 40 else article.titre_article,
                article.source.nom_source[:20] if article.source else 'N/A',
                categories[:30] + '...' if len(categories) > 30 else categories
            ])
        
        table = Table(data, colWidths=[1*inch, 2.5*inch, 1.5*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f4788')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
        ]))
        story.append(table)
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_vulnerabilities_pdf(days=30):
        """Génère un rapport PDF des vulnérabilités"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
        styles = getSampleStyleSheet()
        story = []
        
        # En-tête
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#d32f2f'),
            spaceAfter=12,
            alignment=1
        )
        story.append(Paragraph("Rapport des Vulnérabilités", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Infos du rapport
        report_date = datetime.now().strftime("%d/%m/%Y %H:%M")
        story.append(Paragraph(f"<b>Date du rapport :</b> {report_date}", styles['Normal']))
        story.append(Paragraph(f"<b>Période :</b> Derniers {days} jours", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Récupérer les vulnérabilités
        from_date = datetime.now().date() - timedelta(days=days)
        vulns = Vulnerabilite.objects.filter(
            date_publication__gte=from_date
        ).order_by('-score_cvss')
        
        # Stats par sévérité
        stats = vulns.values('severite').annotate(count=Count('cve_id'))
        story.append(Paragraph("<b>Résumé par sévérité :</b>", styles['Heading3']))
        for stat in stats:
            severity = stat['severite']
            count = stat['count']
            story.append(Paragraph(f"• {severity.capitalize()} : {count}", styles['Normal']))
        
        # Total
        story.append(Paragraph(f"<b>Total vulnérabilités :</b> {vulns.count()}", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Tableau des vulnérabilités critiques/élevées
        critical_high = vulns.filter(severite__in=['critical', 'high'])
        if critical_high.exists():
            story.append(Paragraph("<b>Vulnérabilités Critiques & Élevées :</b>", styles['Heading2']))
            story.append(Spacer(1, 0.1*inch))
            
            data = [['CVE ID', 'Sévérité', 'CVSS Score', 'Date']]
            for vuln in critical_high[:30]:
                severity_color = 'Critique' if vuln.severite == 'critical' else 'Élevée'
                data.append([
                    vuln.cve_id,
                    severity_color,
                    str(vuln.score_cvss) if vuln.score_cvss else 'N/A',
                    vuln.date_publication.strftime("%d/%m/%Y")
                ])
            
            table = Table(data, colWidths=[1.5*inch, 1.5*inch, 1.2*inch, 1.2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d32f2f')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ffebee')),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            story.append(table)
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_articles_excel(days=30):
        """Génère un rapport Excel des articles"""
        wb = Workbook()
        ws = wb.active
        ws.title = "Articles"
        
        # Styles
        header_fill = PatternFill(start_color="1f4788", end_color="1f4788", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # En-tête
        ws['A1'] = "RAPPORT DES ARTICLES"
        ws['A1'].font = Font(bold=True, size=14, color="1f4788")
        ws.merge_cells('A1:E1')
        
        ws['A2'] = f"Généré le : {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        ws['A3'] = f"Période : Derniers {days} jours"
        
        # En-têtes du tableau
        headers = ['Date', 'Titre', 'Source', 'Catégories', 'URL']
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=5, column=col)
            cell.value = header
            cell.fill = header_fill
            cell.font = header_font
            cell.border = border
            cell.alignment = Alignment(horizontal='center')
        
        # Données
        from_date = datetime.now().date() - timedelta(days=days)
        articles = Article.objects.filter(
            date_publication__gte=from_date
        ).order_by('-date_publication')
        
        for row, article in enumerate(articles, 6):
            categories = ', '.join([c.nom_categorie for c in article.categories.all()])
            
            data = [
                article.date_publication.strftime("%d/%m/%Y"),
                article.titre_article,
                article.source.nom_source if article.source else 'N/A',
                categories,
                article.url_article
            ]
            
            for col, value in enumerate(data, 1):
                cell = ws.cell(row=row, column=col)
                cell.value = value
                cell.border = border
                cell.alignment = Alignment(wrap_text=True, vertical='top')
        
        # Ajuster les largeurs de colonnes
        ws.column_dimensions['A'].width = 12
        ws.column_dimensions['B'].width = 30
        ws.column_dimensions['C'].width = 20
        ws.column_dimensions['D'].width = 20
        ws.column_dimensions['E'].width = 35
        
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_vulnerabilities_excel(days=30):
        """Génère un rapport Excel des vulnérabilités"""
        wb = Workbook()
        ws = wb.active
        ws.title = "Vulnérabilités"
        
        # Styles
        header_fill = PatternFill(start_color="d32f2f", end_color="d32f2f", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        
        critical_fill = PatternFill(start_color="ffcdd2", end_color="ffcdd2", fill_type="solid")
        high_fill = PatternFill(start_color="ffe0b2", end_color="ffe0b2", fill_type="solid")
        
        border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # En-tête
        ws['A1'] = "RAPPORT DES VULNÉRABILITÉS"
        ws['A1'].font = Font(bold=True, size=14, color="d32f2f")
        ws.merge_cells('A1:D1')
        
        ws['A2'] = f"Généré le : {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        ws['A3'] = f"Période : Derniers {days} jours"
        
        # En-têtes du tableau
        headers = ['CVE ID', 'Sévérité', 'CVSS Score', 'Date']
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=5, column=col)
            cell.value = header
            cell.fill = header_fill
            cell.font = header_font
            cell.border = border
            cell.alignment = Alignment(horizontal='center')
        
        # Données
        from_date = datetime.now().date() - timedelta(days=days)
        vulns = Vulnerabilite.objects.filter(
            date_publication__gte=from_date
        ).order_by('-score_cvss')
        
        for row, vuln in enumerate(vulns, 6):
            data = [
                vuln.cve_id,
                vuln.severite.capitalize(),
                str(vuln.score_cvss) if vuln.score_cvss else 'N/A',
                vuln.date_publication.strftime("%d/%m/%Y")
            ]
            
            for col, value in enumerate(data, 1):
                cell = ws.cell(row=row, column=col)
                cell.value = value
                cell.border = border
                cell.alignment = Alignment(horizontal='center')
                
                # Colorer selon la sévérité
                if vuln.severite == 'critical':
                    cell.fill = critical_fill
                elif vuln.severite == 'high':
                    cell.fill = high_fill
        
        # Ajouter un sheet de statistiques
        ws_stats = wb.create_sheet("Statistiques")
        
        stats_title = ws_stats['A1']
        stats_title.value = "STATISTIQUES"
        stats_title.font = Font(bold=True, size=12, color="d32f2f")
        
        # Stats par sévérité
        ws_stats['A3'] = "Sévérité"
        ws_stats['B3'] = "Nombre"
        for header in ['A3', 'B3']:
            ws_stats[header].fill = header_fill
            ws_stats[header].font = header_font
        
        severity_stats = vulns.values('severite').annotate(count=Count('cve_id'))
        row = 4
        for stat in severity_stats:
            ws_stats[f'A{row}'] = stat['severite'].capitalize()
            ws_stats[f'B{row}'] = stat['count']
            row += 1
        
        ws_stats.column_dimensions['A'].width = 20
        ws_stats.column_dimensions['B'].width = 15
        
        # Largeurs de colonnes
        ws.column_dimensions['A'].width = 15
        ws.column_dimensions['B'].width = 15
        ws.column_dimensions['C'].width = 12
        ws.column_dimensions['D'].width = 12
        
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_comprehensive_report_pdf(days=30):
        """Génère un rapport complet PDF avec articles et vulnérabilités"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
        styles = getSampleStyleSheet()
        story = []
        
        # Titre principal
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#1f4788'),
            spaceAfter=12,
            alignment=1
        )
        story.append(Paragraph("Rapport Général SIEM", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Infos du rapport
        report_date = datetime.now().strftime("%d/%m/%Y %H:%M")
        story.append(Paragraph(f"<b>Date du rapport :</b> {report_date}", styles['Normal']))
        story.append(Paragraph(f"<b>Période :</b> Derniers {days} jours", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Section 1 : Articles
        story.append(Paragraph("Articles", styles['Heading2']))
        from_date = datetime.now().date() - timedelta(days=days)
        articles = Article.objects.filter(date_publication__gte=from_date)
        story.append(Paragraph(f"Total : {articles.count()} articles", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Section 2 : Vulnérabilités
        story.append(Paragraph("Vulnérabilités", styles['Heading2']))
        vulns = Vulnerabilite.objects.filter(date_publication__gte=from_date)
        story.append(Paragraph(f"Total : {vulns.count()} vulnérabilités", styles['Normal']))
        
        severity_stats = vulns.values('severite').annotate(count=Count('cve_id'))
        for stat in severity_stats:
            story.append(Paragraph(
                f"• {stat['severite'].capitalize()} : {stat['count']}", 
                styles['Normal']
            ))
        
        story.append(Spacer(1, 0.3*inch))
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def _calculate_reading_time(text):
        """Calcule le temps de lecture estimé (en minutes)"""
        if not text:
            return 0
        words = len(text.split())
        reading_time = max(1, words // 200)  # 200 mots par minute
        return reading_time
    
    @staticmethod
    def generate_single_article_pdf(article_id):
        """Génère un rapport PDF pour un article unique"""
        try:
            article = Article.objects.get(id_article=article_id)
        except Article.DoesNotExist:
            raise ValueError(f"Article avec l'ID {article_id} non trouvé")
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
        styles = getSampleStyleSheet()
        story = []
        
        # Titre de l'article
        title_style = ParagraphStyle(
            'ArticleTitle',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=colors.HexColor('#1f4788'),
            spaceAfter=12,
            alignment=0
        )
        story.append(Paragraph(article.titre_article, title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Infos principales
        info_style = ParagraphStyle(
            'Info',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            spaceAfter=6
        )
        
        story.append(Paragraph(f"<b>Source :</b> {article.source.nom_source if article.source else 'N/A'}", info_style))
        story.append(Paragraph(f"<b>Date de publication :</b> {article.date_publication.strftime('%d/%m/%Y')}", info_style))
        
        # Temps de lecture
        reading_time = ReportGenerator._calculate_reading_time(article.contenu_article)
        story.append(Paragraph(f"<b>Temps de lecture estimé :</b> {reading_time} minutes", info_style))
        
        # Catégories
        if article.categories.exists():
            categories = ', '.join([c.nom_categorie for c in article.categories.all()])
            story.append(Paragraph(f"<b>Catégories :</b> {categories}", info_style))
        
        # URL
        story.append(Paragraph(f"<b>URL :</b> <a href='{article.url_article}'>{article.url_article[:60]}...</a>", info_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Résumé
        if article.summary_article:
            story.append(Paragraph("<b>Résumé :</b>", styles['Heading3']))
            summary_style = ParagraphStyle(
                'Summary',
                parent=styles['Normal'],
                fontSize=10,
                textColor=colors.HexColor('#444444'),
                spaceAfter=12,
                alignment=4
            )
            story.append(Paragraph(article.summary_article[:1000], summary_style))
            story.append(Spacer(1, 0.2*inch))
        
        # Contenu
        if article.contenu_article:
            story.append(Paragraph("<b>Contenu complet :</b>", styles['Heading3']))
            content_style = ParagraphStyle(
                'Content',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.HexColor('#333333'),
                spaceAfter=12
            )
            # Limiter à 3000 caractères pour le PDF
            content = article.contenu_article[:3000]
            if len(article.contenu_article) > 3000:
                content += "..."
            story.append(Paragraph(content, content_style))
            story.append(Spacer(1, 0.3*inch))
        
        # Articles connexes de la même source
        related_articles = Article.objects.filter(
            source=article.source
        ).exclude(id_article=article.id_article).order_by('-date_publication')[:5]
        
        if related_articles.exists():
            story.append(Paragraph("<b>Articles connexes de la même source :</b>", styles['Heading3']))
            story.append(Spacer(1, 0.1*inch))
            
            data = [['Date', 'Titre']]
            for related in related_articles:
                data.append([
                    related.date_publication.strftime("%d/%m/%Y"),
                    related.titre_article[:50] + '...' if len(related.titre_article) > 50 else related.titre_article
                ])
            
            table = Table(data, colWidths=[1*inch, 4.5*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f4788')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f0f0')),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            story.append(table)
            story.append(Spacer(1, 0.3*inch))
        
        # Vulnérabilités connexes
        vuln_categories = article.categories.all()
        related_vulns = Vulnerabilite.objects.none()
        
        if vuln_categories.exists():
            # Chercher les vulnérabilités publiées dans le mois précédent l'article
            from_date = article.date_publication - timedelta(days=30)
            to_date = article.date_publication + timedelta(days=30)
            related_vulns = Vulnerabilite.objects.filter(
                date_publication__range=[from_date, to_date]
            ).order_by('-score_cvss')[:10]
        
        if related_vulns.exists():
            story.append(Paragraph("<b>Vulnérabilités connexes :</b>", styles['Heading3']))
            story.append(Spacer(1, 0.1*inch))
            
            data = [['CVE ID', 'Sévérité', 'CVSS Score', 'Date']]
            for vuln in related_vulns:
                data.append([
                    vuln.cve_id,
                    vuln.severite.capitalize(),
                    str(vuln.score_cvss) if vuln.score_cvss else 'N/A',
                    vuln.date_publication.strftime("%d/%m/%Y")
                ])
            
            table = Table(data, colWidths=[1.2*inch, 1.2*inch, 1*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d32f2f')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ffebee')),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            story.append(table)
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_single_article_excel(article_id):
        """Génère un rapport Excel pour un article unique"""
        try:
            article = Article.objects.get(id_article=article_id)
        except Article.DoesNotExist:
            raise ValueError(f"Article avec l'ID {article_id} non trouvé")
        
        wb = Workbook()
        
        # Sheet 1 : Infos principales
        ws = wb.active
        ws.title = "Article"
        
        # Styles
        header_fill = PatternFill(start_color="1f4788", end_color="1f4788", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # Titre
        ws['A1'] = "RAPPORT D'ARTICLE"
        ws['A1'].font = Font(bold=True, size=14, color="1f4788")
        ws.merge_cells('A1:B1')
        
        # Infos principales
        row = 3
        info_data = [
            ('Titre', article.titre_article),
            ('Source', article.source.nom_source if article.source else 'N/A'),
            ('Date publication', article.date_publication.strftime("%d/%m/%Y")),
            ('URL', article.url_article),
            ('Temps de lecture', f"{ReportGenerator._calculate_reading_time(article.contenu_article)} minutes"),
        ]
        
        if article.categories.exists():
            categories = ', '.join([c.nom_categorie for c in article.categories.all()])
            info_data.append(('Catégories', categories))
        
        for label, value in info_data:
            cell_label = ws.cell(row=row, column=1)
            cell_label.value = label
            cell_label.font = Font(bold=True)
            cell_label.fill = PatternFill(start_color="e8f0f8", end_color="e8f0f8", fill_type="solid")
            cell_label.border = border
            
            cell_value = ws.cell(row=row, column=2)
            cell_value.value = value
            cell_value.border = border
            cell_value.alignment = Alignment(wrap_text=True, vertical='top')
            
            row += 1
        
        # Descriptions et contenu
        row += 1
        
        if article.description_article:
            ws.cell(row=row, column=1).value = "Description"
            ws.cell(row=row, column=1).font = Font(bold=True, size=11)
            row += 1
            ws.cell(row=row, column=1).value = article.description_article
            ws.merge_cells(f'A{row}:B{row}')
            ws.cell(row=row, column=1).alignment = Alignment(wrap_text=True, vertical='top')
            row += 2
        
        if article.summary_article:
            ws.cell(row=row, column=1).value = "Résumé"
            ws.cell(row=row, column=1).font = Font(bold=True, size=11)
            row += 1
            ws.cell(row=row, column=1).value = article.summary_article
            ws.merge_cells(f'A{row}:B{row}')
            ws.cell(row=row, column=1).alignment = Alignment(wrap_text=True, vertical='top')
            row += 2
        
        if article.contenu_article:
            ws.cell(row=row, column=1).value = "Contenu"
            ws.cell(row=row, column=1).font = Font(bold=True, size=11)
            row += 1
            ws.cell(row=row, column=1).value = article.contenu_article
            ws.merge_cells(f'A{row}:B{row}')
            ws.cell(row=row, column=1).alignment = Alignment(wrap_text=True, vertical='top')
        
        ws.column_dimensions['A'].width = 20
        ws.column_dimensions['B'].width = 60
        
        # Sheet 2 : Articles connexes
        related_articles = Article.objects.filter(
            source=article.source
        ).exclude(id_article=article.id_article).order_by('-date_publication')[:10]
        
        if related_articles.exists():
            ws_related = wb.create_sheet("Articles connexes")
            
            headers = ['Date', 'Titre', 'Catégories']
            for col, header in enumerate(headers, 1):
                cell = ws_related.cell(row=1, column=col)
                cell.value = header
                cell.fill = header_fill
                cell.font = header_font
                cell.border = border
                cell.alignment = Alignment(horizontal='center')
            
            for row_idx, related in enumerate(related_articles, 2):
                categories = ', '.join([c.nom_categorie for c in related.categories.all()])
                data = [
                    related.date_publication.strftime("%d/%m/%Y"),
                    related.titre_article,
                    categories
                ]
                
                for col, value in enumerate(data, 1):
                    cell = ws_related.cell(row=row_idx, column=col)
                    cell.value = value
                    cell.border = border
                    cell.alignment = Alignment(wrap_text=True, vertical='top')
            
            ws_related.column_dimensions['A'].width = 15
            ws_related.column_dimensions['B'].width = 40
            ws_related.column_dimensions['C'].width = 30
        
        # Sheet 3 : Vulnérabilités connexes
        vuln_categories = article.categories.all()
        related_vulns = Vulnerabilite.objects.none()
        
        if vuln_categories.exists():
            from_date = article.date_publication - timedelta(days=30)
            to_date = article.date_publication + timedelta(days=30)
            related_vulns = Vulnerabilite.objects.filter(
                date_publication__range=[from_date, to_date]
            ).order_by('-score_cvss')[:20]
        
        if related_vulns.exists():
            ws_vulns = wb.create_sheet("Vulnérabilités")
            
            headers = ['CVE ID', 'Sévérité', 'CVSS Score', 'Date']
            for col, header in enumerate(headers, 1):
                cell = ws_vulns.cell(row=1, column=col)
                cell.value = header
                cell.fill = header_fill
                cell.font = header_font
                cell.border = border
                cell.alignment = Alignment(horizontal='center')
            
            for row_idx, vuln in enumerate(related_vulns, 2):
                data = [
                    vuln.cve_id,
                    vuln.severite.capitalize(),
                    str(vuln.score_cvss) if vuln.score_cvss else 'N/A',
                    vuln.date_publication.strftime("%d/%m/%Y")
                ]
                
                for col, value in enumerate(data, 1):
                    cell = ws_vulns.cell(row=row_idx, column=col)
                    cell.value = value
                    cell.border = border
                    cell.alignment = Alignment(horizontal='center')
            
            ws_vulns.column_dimensions['A'].width = 15
            ws_vulns.column_dimensions['B'].width = 15
            ws_vulns.column_dimensions['C'].width = 12
            ws_vulns.column_dimensions['D'].width = 12
        
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer

