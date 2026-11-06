<?php
// Приём заявки с формы и отправка письма Марине.
header('Content-Type: application/json; charset=utf-8');
$TO = 'marinaandreeva.psy@yandex.ru';           // куда слать заявки
$FROM = 'noreply@marinaandreeva.ru';            // адрес отправителя на домене сайта

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
if (!empty($_POST['website'])) { echo '{"ok":true}'; exit; }   // ловушка для ботов
if (empty($_POST['agree'])) { echo '{"ok":false}'; exit; }

function clean($k, $max) {
  $v = isset($_POST[$k]) ? trim((string)$_POST[$k]) : '';
  $v = str_replace(["\r", "\0"], '', $v);
  return mb_substr($v, 0, $max);
}
$name = clean('name', 200); $phone = clean('phone', 40);
$contact = clean('contact', 500); $time = clean('time', 200);
if ($name === '' || $phone === '' || $contact === '' || $time === '') { echo '{"ok":false}'; exit; }

$body = "Новая заявка с сайта\n\nИмя: $name\nТелефон: $phone\nКуда написать/позвонить: $contact\nУдобное время: $time\n"
      . "\nСогласие на обработку ПД: да\nДата: " . date('d.m.Y H:i') . "\n";
$headers = "From: $FROM\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта marinaandreeva.ru') . '?=';
$sent = mail($TO, $subject, $body, $headers);
echo $sent ? '{"ok":true}' : '{"ok":false}';
