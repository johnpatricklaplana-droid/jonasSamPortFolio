<?php

require_once __DIR__ . '/database/getDBConnection.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === "/jonasSamPortFolio/backend/src/jonasSamindex.php/save-project") {

    if($method !== "POST") {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
    

    $project_data = json_decode($_POST['project_data'], true);
    $images = $_FILES['images'] ?? null;
    $fileName = $images['name'];

    $tmp = $images['tmp_name'];
 
    $title = $project_data['title'];
    $description = $project_data['description'];
    $date = $project_data['date'];
    $imageUrl = '/images/' . $fileName;


    if(!$project_data) {
        http_response_code(400);
        echo json_encode(['error' => 'bad request']);
        exit;
    }

    $targetPath = __DIR__ . '/images/' . $fileName;

    move_uploaded_file($tmp, $targetPath);

    $conn = getDBConnection();

    $stmt = $conn->prepare("INSERT INTO projects (title, description, date, imageUrl) VALUES(?, ?, ?, ?)");
    $stmt->bind_param("ssss", $title, $description, $date, $imageUrl);
    $stmt->execute();

    http_response_code(201);
    echo json_encode(["message" => "created one", "status" => 201]);

    $conn->close();
    exit;
}

if ($uri === "/jonasSamPortFolio/backend/src/jonasSamindex.php/get-projects") {

    $conn = getDBConnection();

    $query = "SELECT * FROM projects";
    $statement = $conn->prepare($query);

    $statement->execute();

    $result = $statement->get_result();
    $projects = $result->fetch_all(MYSQLI_ASSOC);

    header('Content-Type: application/json');

    http_response_code(200);
    echo json_encode(["data" => $projects, "status" => 200]);
    exit;
}

if ($uri === "/jonasSamPortFolio/backend/src/jonasSamindex.php/get-project") {

    $project_id = $_GET['id'];

    $conn = getDBConnection();

    $query = "SELECT * FROM projects WHERE id = ?";
    $statement = $conn->prepare($query);
    $statement->bind_param("s", $project_id);
    $statement->execute();

    $statement->execute();

    $result = $statement->get_result();
    $data = $result->fetch_assoc();

    header('Content-Type: application/json');

    http_response_code(200);
    echo json_encode(["data" => $data, "status" => 200]);
    exit;
    
}

if($uri === "/jonasSamPortFolio/backend/src/jonasSamindex.php/edit-project") {

    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
    
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    $title = $input['title'] ?? null;
    $description = $input['description'] ?? null;
    $date = $input['date'] ?? null;
    
    // You still need some way to know WHICH project to update
    $project_id = $input['project_id'] ?? null;
    
    if (!$title || !$description || !$date || !$project_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $conn = getDBConnection();
    
    $query = "UPDATE projects SET date = ?, description = ?, title = ? WHERE id = ?";
    $statement = $conn->prepare($query);
    $statement->bind_param("sssi", $date, $description, $title, $project_id);
    
    if ($statement->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Updated One", "status" => 200]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Update failed"]);
    }
    
    exit;

}

if($uri === "/jonasSamPortFolio/backend/src/jonasSamindex.php/delete-project") {

    if ($method !== "DELETE") {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        exit;
    }

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    $project_id = $data['project_id'] ?? null;

    if (!$project_id) {
        http_response_code(400);
        echo json_encode(["error" => "Super bad request"]);
        exit;
    }

    $conn = getDBConnection();

    $query = "DELETE FROM projects WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $project_id);
    $stmt->execute();

    http_response_code(200);
    echo json_encode([
        "message" => "deleted one",
        "status" => 200
    ]);
    
    exit;
    
}

echo json_encode(["error" => "Not found"]);

