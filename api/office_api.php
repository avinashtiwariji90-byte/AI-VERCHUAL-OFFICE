<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? 'company_status';

if ($action === 'company_status') {
    $companyStatus = [
        "company_name" => "NexusAI VirtualCorp",
        "owner" => "Avinash (Owner / CEO)",
        "head_manager" => "Aura Sharma (Head Manager AI)",
        "metrics" => [
            "closed_revenue" => 1240000,
            "currency" => "INR",
            "active_projects" => 18,
            "completed_projects" => 42,
            "active_ai_employees" => 14,
            "lead_pipeline_count" => 846,
            "efficiency_score" => 94.8
        ],
        "departments" => [
            ["name" => "Project Bay", "lead" => "Aarav Verma (PM)", "active_tasks" => 12],
            ["name" => "Sales Hub", "lead" => "Priya Sharma (Sales Mgr)", "active_leads" => 48],
            ["name" => "Marketing Studio", "lead" => "Kunal Mehta (Marketing Mgr)", "active_campaigns" => 6],
            ["name" => "Lead Gen Center", "lead" => "4 Lead Generators", "daily_scraped" => 140]
        ]
    ];
    sendJsonResponse(true, "Company status fetched successfully", $companyStatus);
} else if ($action === 'agents') {
    $agents = [
        ["id" => "head_manager", "name" => "Aura Sharma", "title" => "Head Manager AI", "role" => "Chief AI Executive", "status" => "Active"],
        ["id" => "pm_manager", "name" => "Aarav Verma", "title" => "Project Manager AI", "role" => "Sprint Leader", "status" => "Active"],
        ["id" => "dev_lead", "name" => "Rohan Gupta", "title" => "Senior Full-Stack AI", "role" => "Tech Lead", "status" => "Active"],
        ["id" => "sales_manager", "name" => "Priya Sharma", "title" => "Sales Manager AI", "role" => "Revenue Lead", "status" => "Active"],
        ["id" => "marketing_manager", "name" => "Kunal Mehta", "title" => "Marketing Manager AI", "role" => "Brand Strategist", "status" => "Active"]
    ];
    sendJsonResponse(true, "Agents list fetched successfully", $agents);
} else if ($action === 'leads') {
    $leads = [
        ["company" => "Apex Logistics Ltd", "budget" => "₹2,50,000", "score" => 96, "status" => "HOT"],
        ["company" => "RealEstate Portal", "budget" => "₹1,80,000", "score" => 93, "status" => "HOT"],
        ["company" => "FinTech Chatbot", "budget" => "₹1,20,000", "score" => 90, "status" => "WARM"]
    ];
    sendJsonResponse(true, "Scraped leads fetched successfully", $leads);
} else if ($action === 'hire_agent') {
    $name   = $_POST['name'] ?? $_GET['name'] ?? 'New AI Employee';
    $title  = $_POST['title'] ?? $_GET['title'] ?? 'AI Specialist';
    $dept   = $_POST['dept'] ?? $_GET['dept'] ?? 'Project Bay';
    $avatar = $_POST['avatar'] ?? $_GET['avatar'] ?? '👨‍💻';
    $task   = $_POST['task'] ?? $_GET['task'] ?? 'Executing department tasks';
    $salary = $_POST['salary'] ?? $_GET['salary'] ?? '₹35,000 / mo';

    $agentId = 'agent_' . time() . '_' . rand(100, 999);
    $newAgent = [
        "id" => $agentId,
        "name" => $name,
        "title" => $title,
        "dept" => $dept,
        "avatar" => $avatar,
        "role" => "employee",
        "status" => "Active Deployed",
        "progress" => 100,
        "currentTask" => $task,
        "salary" => $salary,
        "reportsTo" => "Aura Sharma (Head Manager AI)"
    ];

} else if ($action === 'fire_agent') {
    $agentId = $_POST['id'] ?? $_GET['id'] ?? '';
    $name    = $_POST['name'] ?? $_GET['name'] ?? 'AI Employee';
    
    sendJsonResponse(true, "AI Employee ($name) terminated and removed successfully", [
        "id" => $agentId,
        "name" => $name,
        "status" => "Terminated",
        "timestamp" => date("Y-m-d H:i:s")
    ]);
} else {
    sendJsonResponse(false, "Unknown action parameter. Supported actions: company_status, agents, leads, execute_command, hire_agent, fire_agent");
}

