<?php
// Simple PHP redirect handler for RSVP links
// This file handles backend RSVP URLs and redirects to frontend

// Get the event ID from the URL path
$path = $_SERVER['REQUEST_URI'];
$pathParts = explode('/', trim($path, '/'));
$eventId = end($pathParts);

// Get query parameters
$status = $_GET['status'] ?? 'going';
$contactId = $_GET['contact_id'] ?? 'unknown';

// Construct frontend URL
$frontendUrl = "http://localhost:5174/events/{$eventId}/rsvp?status={$status}&contact_id={$contactId}";

// Redirect to frontend
header("Location: {$frontendUrl}");
exit();
?>
