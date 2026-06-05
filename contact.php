<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
    exit;
}

function clean_field(string $key): string
{
    $value = $_POST[$key] ?? '';
    if (is_array($value)) {
        return '';
    }

    return trim(htmlspecialchars(strip_tags((string) $value), ENT_QUOTES, 'UTF-8'));
}

$name = clean_field('name');
$company = clean_field('company');
$email = clean_field('email');
$country = clean_field('country');
$sector = clean_field('sector');
$collaboration = clean_field('collaboration');
$message = clean_field('message');

if ($name === '' || $country === '' || $sector === '' || $collaboration === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Veuillez remplir tous les champs requis.']);
    exit;
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Adresse email invalide.']);
    exit;
}

$to = 'contact@dgafrique.com';
$subject = sprintf('[DG Afrique] Demande de partenariat — %s (%s)', $name, $country);
$body = implode("\n", [
    'Nouvelle demande de partenariat DG Afrique',
    '',
    'Nom complet : ' . $name,
    'Entreprise : ' . ($company !== '' ? $company : 'Non renseignée'),
    'Email : ' . ($email !== '' ? $email : 'Non renseigné'),
    'Pays : ' . $country,
    "Secteur d'activité : " . $sector,
    'Type de collaboration : ' . $collaboration,
    '',
    'Message :',
    $message,
    '',
    '---',
    'Formulaire envoyé depuis www.dgafrique.com'
]);

$headers = [
    'From: DG Afrique <contact@dgafrique.com>',
    'Content-Type: text/plain; charset=UTF-8'
];

if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => "L'envoi de l'email a échoué."]);
    exit;
}

echo json_encode(['success' => true]);
