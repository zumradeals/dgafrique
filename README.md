# DG Afrique

Site vitrine statique HTML/CSS/JS avec formulaire PHP natif pour DG Afrique.

## Structure

- `index.html` : accueil
- `a-propos.html` : vision, mission, histoire
- `activites.html` : six domaines d'intervention
- `presence.html` : prÃ©sence internationale
- `partenariat.html` : formulaire de demande
- `contact.html` : coordonnÃ©es et carte
- `contact.php` : traitement JSON du formulaire
- `lang/fr.json` et `lang/en.json` : traductions

## DÃ©ploiement O2Switch/cPanel

1. Ouvrir FileZilla ou le gestionnaire de fichiers cPanel.
2. Envoyer tout le contenu du dossier du projet dans `public_html/`.
3. VÃ©rifier que `.htaccess`, `contact.php`, `robots.txt` et `sitemap.xml` sont bien prÃ©sents.
4. Confirmer que le domaine pointe vers `https://dgafrique.com`.
5. Tester les pages HTML puis le switch FR/EN.

## Formulaire

`contact.php` utilise la fonction PHP native `mail()` et envoie les demandes Ã  `contact@dgafrique.com`.

Ã€ vÃ©rifier cÃ´tÃ© hÃ©bergement :

- l'envoi email PHP est activÃ© ;
- l'adresse d'expÃ©dition du domaine est autorisÃ©e ;
- les emails ne sont pas classÃ©s en spam ;
- un test POST depuis `partenariat.html` retourne `{"success":true}`.

## Images Ã  remplacer si besoin

- `assets/images/logo-dg-afrique.png` : logo officiel DG Afrique.
- `assets/images/hero-commerce.png` : visuel hero gÃ©nÃ©rÃ©.
- `assets/images/og-image.jpg` : visuel Open Graph dÃ©rivÃ©.

## Blog futur

Pour ajouter un blog WordPress sÃ©parÃ©, installer WordPress dans `public_html/blog/` et conserver le site vitrine Ã  la racine. Le menu pourra ensuite pointer vers `/blog/` sans mÃ©langer les fichiers statiques et l'installation WordPress.

