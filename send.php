<?php
// Приём формы записи. Письмо уходит на почту Марины.
header('Content-Type: application/json; charset=utf-8');
$TO = 'marinaandreeva.psy@yandex.ru';
$FROM = 'noreply@marinaandreeva.ru';
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !empty($_POST['website'])) { echo json_encode(['ok' => false]); exit; }
$rows = [];
foreach (['Имя', 'Телефон', 'Куда лучше написать/позвонить?', 'Удобное время'] as $k) {
  $key = str_replace([' ', '/', '?'], '_', $k);
  $v = $_POST[$k] ?? $_POST[$key] ?? '';
  $rows[] = $k . ': ' . mb_substr(trim(strip_tags($v)), 0, 1000);
}
$body = "Новая заявка с сайта\n\n" . implode("\n", $rows) . "\n";
$headers = "From: $FROM\r\nContent-Type: text/plain; charset=utf-8";
$ok = mail($TO, '=?UTF-8?B?' . base64_encode('Заявка с сайта') . '?=', $body, $headers);
echo json_encode(['ok' => (bool)$ok]);
