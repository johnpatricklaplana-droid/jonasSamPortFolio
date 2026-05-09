<?php

function getDBConnection() {
    $host = "localhost";
    $db   = "jonassamportfolio";
    $user = "root";
    $pass = "123456789";

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        die("DB Connection failed: " . $conn->connect_error);
    }

    return $conn;
}