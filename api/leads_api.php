<?php
/**
 * NexusAI — Lead Generation Backend API
 * Handles: lead list, lead stats, trigger new lead generation
 */
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';

// ─── Lead Database (in production, this would be MySQL) ─────────────────
$leadsDB = [
    [
        "id" => "LEAD-101",
        "genType" => "Sales Lead Gen 1",
        "title" => "Apex Logistics Ltd",
        "industry" => "Enterprise Supply Chain",
        "budget" => "₹2,50,000",
        "budgetNum" => 250000,
        "score" => 96,
        "status" => "Qualified",
        "assignee" => "Priya Sharma (Sales Mgr)",
        "desc" => "ERP automation & Custom Fleet Tracking System."
    ],
    [
        "id" => "LEAD-102",
        "genType" => "Sales Lead Gen 2",
        "title" => "Urban Fashion Store",
        "industry" => "D2C E-Commerce",
        "budget" => "₹85,000",
        "budgetNum" => 85000,
        "score" => 88,
        "status" => "Proposal Sent",
        "assignee" => "Ananya Singh (Sales)",
        "desc" => "Shopify to Custom Next.js web app migration."
    ],
    [
        "id" => "PROJ-201",
        "genType" => "Project Lead Gen 1",
        "title" => "HealthPulse Telemedicine App",
        "industry" => "Healthcare / Web App",
        "budget" => "₹1,80,000",
        "budgetNum" => 180000,
        "score" => 92,
        "status" => "In Sprint",
        "assignee" => "Aarav Verma (PM)",
        "desc" => "Doctor booking platform with WebRTC video consultation."
    ],
    [
        "id" => "PROJ-202",
        "genType" => "Project Lead Gen 2",
        "title" => "FinTech Support AI Chatbot",
        "industry" => "AI / Automation",
        "budget" => "₹1,20,000",
        "budgetNum" => 120000,
        "score" => 90,
        "status" => "Requirements Scraped",
        "assignee" => "Aarav Verma (PM)",
        "desc" => "WhatsApp & Web AI Assistant with banking API integration."
    ]
];

// ─── Generator Configuration ────────────────────────────────────────────
$generators = [
    1 => [
        "name" => "Sales Lead Gen 1",
        "type" => "B2B Enterprise",
        "description" => "B2B enterprise lead scraper — LinkedIn, Crunchbase, AngelList",
        "scraped" => 48,
        "qualified" => 14,
        "companies" => ["NexGen Cloud", "Vanguard Financial", "Starlight Media", "Titan Retail"],
        "industry" => "Enterprise Corporate",
        "budgetMin" => 150000,
        "budgetMax" => 350000,
        "scoreMin" => 90,
        "scoreMax" => 98,
        "status" => "Qualified",
        "assignee" => "Priya Sharma (Sales Mgr)",
        "idPrefix" => "LEAD"
    ],
    2 => [
        "name" => "Sales Lead Gen 2",
        "type" => "SME Retail",
        "description" => "SME & E-Commerce store scraper — Shopify, WooCommerce",
        "scraped" => 62,
        "qualified" => 9,
        "companies" => ["Glow Organics", "Kraft Artisan", "Zest Electronics", "Neo Athletics"],
        "industry" => "SME Retail",
        "budgetMin" => 60000,
        "budgetMax" => 120000,
        "scoreMin" => 84,
        "scoreMax" => 95,
        "status" => "Extracted",
        "assignee" => "Aditya Joshi (Sales SDR)",
        "idPrefix" => "LEAD"
    ],
    3 => [
        "name" => "Project Lead Gen 1",
        "type" => "Web & Mobile App",
        "description" => "Web/App RFP hunter — Upwork, Freelancer, GitHub RFPs",
        "scraped" => 38,
        "qualified" => 11,
        "companies" => ["RealEstate Portal & CRM", "EdTech Learning Platform", "Logistics Dashboard", "Restaurant SaaS"],
        "industry" => "Web & Mobile App",
        "budgetMin" => 120000,
        "budgetMax" => 220000,
        "scoreMin" => 88,
        "scoreMax" => 96,
        "status" => "Assigned to PM",
        "assignee" => "Aarav Verma (PM)",
        "idPrefix" => "PROJ"
    ],
    4 => [
        "name" => "Project Lead Gen 2",
        "type" => "AI Software",
        "description" => "AI & SaaS automation finder — tech stack demand analysis",
        "scraped" => 19,
        "qualified" => 7,
        "companies" => ["Legal AI Document Summarizer", "HR Automation Bot", "AI Invoice Parser", "Smart Inventory AI"],
        "industry" => "AI Software",
        "budgetMin" => 140000,
        "budgetMax" => 230000,
        "scoreMin" => 90,
        "scoreMax" => 99,
        "status" => "Scraped RFP",
        "assignee" => "Aarav Verma (PM)",
        "idPrefix" => "PROJ"
    ]
];

// ─── Action: List all leads ─────────────────────────────────────────────
if ($action === 'list') {
    sendJsonResponse(true, "Leads fetched successfully", [
        "leads" => $leadsDB,
        "total_scraped" => 846,
        "pipeline_value" => 635000,
        "conversion_rate" => 14.2
    ]);
}

// ─── Action: Get generator stats ────────────────────────────────────────
else if ($action === 'generators') {
    $genStats = [];
    foreach ($generators as $id => $gen) {
        $genStats[] = [
            "id" => $id,
            "name" => $gen["name"],
            "type" => $gen["type"],
            "description" => $gen["description"],
            "scraped" => $gen["scraped"],
            "qualified" => $gen["qualified"],
            "status" => "LIVE"
        ];
    }
    sendJsonResponse(true, "Generator stats fetched", $genStats);
}

// ─── Action: Trigger a generator (generate new lead) ────────────────────
else if ($action === 'trigger') {
    $genId = intval($_GET['gen_id'] ?? $_POST['gen_id'] ?? 1);

    if (!isset($generators[$genId])) {
        sendJsonResponse(false, "Invalid generator ID. Use 1-4.");
        exit;
    }

    $gen = $generators[$genId];
    $company = $gen["companies"][array_rand($gen["companies"])];
    $budget = rand($gen["budgetMin"], $gen["budgetMax"]);
    $score = rand($gen["scoreMin"], $gen["scoreMax"]);

    // Format title
    $titleSuffix = ($genId <= 2) ? " Tech Solutions" : "";
    if ($genId === 2) $titleSuffix = " E-Store";

    $newLead = [
        "id" => $gen["idPrefix"] . "-" . rand(100, 999),
        "genType" => $gen["name"],
        "title" => $company . $titleSuffix,
        "industry" => $gen["industry"],
        "budget" => "₹" . number_format($budget, 0, '.', ','),
        "budgetNum" => $budget,
        "score" => $score,
        "status" => $gen["status"],
        "assignee" => $gen["assignee"],
        "desc" => "Auto-generated lead from {$gen['name']} pipeline scan."
    ];

    // Updated generator stats
    $updatedGen = [
        "id" => $genId,
        "name" => $gen["name"],
        "scraped" => $gen["scraped"] + rand(2, 6),
        "qualified" => $gen["qualified"] + 1
    ];

    sendJsonResponse(true, "Lead generated by {$gen['name']}", [
        "lead" => $newLead,
        "generator" => $updatedGen
    ]);
}

// ─── Action: Get dashboard summary ──────────────────────────────────────
else if ($action === 'dashboard') {
    $totalBudget = 0;
    $hotLeads = 0;
    foreach ($leadsDB as $lead) {
        $totalBudget += $lead["budgetNum"];
        if ($lead["score"] >= 80) $hotLeads++;
    }

    sendJsonResponse(true, "Dashboard data fetched", [
        "total_leads" => count($leadsDB),
        "total_scraped" => 846,
        "hot_leads" => $hotLeads,
        "pipeline_value" => $totalBudget,
        "pipeline_value_formatted" => "₹" . number_format($totalBudget / 100000, 2) . "L",
        "conversion_rate" => 14.2,
        "generators_live" => 4
    ]);
}

// ─── Unknown action ─────────────────────────────────────────────────────
else {
    sendJsonResponse(false, "Unknown action. Supported: list, generators, trigger, dashboard");
}
