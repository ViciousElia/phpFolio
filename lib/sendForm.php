<?php

$errors = [];

if (!empty($_POST)) {
  $uname = $_POST['uname'];
  $uemail = $_POST['uemail'];
  $usubj = $_POST['usubj'];
  $umess = $_POST['umess'];
 
  if (empty($uname)) {
      $errors[] = 'Name is empty';
  }

  if (empty($uemail)) {
      $errors[] = 'Email is empty';
  } else if (!filter_var($uemail, FILTER_VALIDATE_EMAIL)) {
      $errors[] = 'Email is invalid';
  }

  if (empty($usubj)) {
      $errors[] = 'Subject is empty';
  }

  if (empty($umess)) {
      $errors[] = 'Message is empty';
  }

  if (empty($errors)) {
    $recipient = "contact@fruitfolio.com";
    $subject   = "[Message] $usubj";
    $message   = wordwrap($umess, 70, "\r\n");
    $headers   = 'From: admin@fruitfolio.com' . "\r\n" . 'Reply-To:' . $uemail . "\r\n" . 'X-Mailer: PHP/' . phpversion();
    mail( $recipient, $subject, $message, $headers );
  } else {
  // Display errors
        echo "The form contains the following errors:<br>";
        foreach ($errors as $error) {
            echo "- $error<br>";
        }
  }
}

header('Location: https://fruitfolio.com/contact/');
die();
?>