<?php
/**
 * NexusAI Office API Configuration
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

function sendJsonResponse($status, $message, $data = null) {
    echo json_encode([
        "success" => $status,
        "message" => $message,
        "timestamp" => date("c"),
        "data" => $data
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
