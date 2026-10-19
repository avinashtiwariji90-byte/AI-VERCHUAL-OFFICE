<?php
/**
 * NexusAI Company Live Server - Tunnel API
 * Starts/Stops a real localtunnel to expose local server to public internet.
 * Owner: Avinash Tiwari (Owner & CEO)
 */

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// File to store tunnel process info
$tunnelStateFile = __DIR__ . '/../tunnel_state.json';
$tunnelLogFile   = __DIR__ . '/../tunnel_output.log';

/**
 * ACTION: start_tunnel
 * Starts a localtunnel process in the background.
 */
if ($action === 'start_tunnel') {
    $port = intval($_GET['port'] ?? $_POST['port'] ?? 8000);
    if ($port < 1 || $port > 65535) $port = 8000;

    // Kill any existing tunnel first
    killExistingTunnel($tunnelStateFile);

    // Clear old log
    file_put_contents($tunnelLogFile, '');

    // Check if npx/node is available
    $npxPath = findExecutable('npx');
    if (!$npxPath) {
        sendJsonResponse(false, 'npx (Node.js) not found. Please install Node.js to use live tunneling.');
    }

    // Start localtunnel in background
    // The command writes its output (which includes the URL) to a log file
    $cmd = "npx -y localtunnel --port $port";
    
    // Windows background process
    $descriptorspec = [
        0 => ['pipe', 'r'],   // stdin
        1 => ['file', $tunnelLogFile, 'w'], // stdout -> log file
        2 => ['file', $tunnelLogFile, 'a'], // stderr -> log file
    ];

    $process = proc_open($cmd, $descriptorspec, $pipes, null, null, ['bypass_shell' => false]);

    if (!is_resource($process)) {
        sendJsonResponse(false, 'Failed to start localtunnel process.');
    }

    $status = proc_get_status($process);
    $pid = $status['pid'];

    // Save tunnel state
    $state = [
        'pid'        => $pid,
        'port'       => $port,
        'started_at' => date('c'),
        'status'     => 'starting'
    ];
    file_put_contents($tunnelStateFile, json_encode($state, JSON_PRETTY_PRINT));

    // Wait up to 15 seconds for the URL to appear in the log
    $tunnelUrl = '';
    $maxWait = 15;
    for ($i = 0; $i < $maxWait; $i++) {
        sleep(1);
        $logContent = @file_get_contents($tunnelLogFile);
        if ($logContent) {
            // localtunnel outputs: "your url is: https://xxxxx.loca.lt"
            if (preg_match('/your url is:\s*(https?:\/\/[^\s]+)/i', $logContent, $matches)) {
                $tunnelUrl = trim($matches[1]);
                break;
            }
            // Also check for direct URL patterns
            if (preg_match('/(https?:\/\/[a-z0-9\-]+\.loca\.lt)/i', $logContent, $matches)) {
                $tunnelUrl = trim($matches[1]);
                break;
            }
        }
    }

    if ($tunnelUrl) {
        $state['status'] = 'live';
        $state['url'] = $tunnelUrl;
        file_put_contents($tunnelStateFile, json_encode($state, JSON_PRETTY_PRINT));

        sendJsonResponse(true, 'Tunnel is LIVE!', [
            'url'  => $tunnelUrl,
            'port' => $port,
            'pid'  => $pid
        ]);
    } else {
        // Tunnel may still be starting (npm install on first run takes time)
        // Return starting status - client can poll
        $state['status'] = 'starting';
        file_put_contents($tunnelStateFile, json_encode($state, JSON_PRETTY_PRINT));

        $logContent = @file_get_contents($tunnelLogFile) ?: 'No output yet...';

        sendJsonResponse(true, 'Tunnel is starting... (first-time npm install may take 30-60s)', [
            'status' => 'starting',
            'port'   => $port,
            'pid'    => $pid,
            'log'    => substr($logContent, 0, 500)
        ]);
    }
}

/**
 * ACTION: check_tunnel
 * Checks if tunnel is running and returns current URL.
 */
else if ($action === 'check_tunnel') {
    if (!file_exists($tunnelStateFile)) {
        sendJsonResponse(true, 'No tunnel running', ['status' => 'stopped']);
    }

    $state = json_decode(file_get_contents($tunnelStateFile), true);
    
    // If status was 'starting', check log again for URL
    if (($state['status'] ?? '') === 'starting') {
        $logContent = @file_get_contents($tunnelLogFile) ?: '';
        if (preg_match('/your url is:\s*(https?:\/\/[^\s]+)/i', $logContent, $matches)) {
            $state['status'] = 'live';
            $state['url'] = trim($matches[1]);
            file_put_contents($tunnelStateFile, json_encode($state, JSON_PRETTY_PRINT));
        } else if (preg_match('/(https?:\/\/[a-z0-9\-]+\.loca\.lt)/i', $logContent, $matches)) {
            $state['status'] = 'live';
            $state['url'] = trim($matches[1]);
            file_put_contents($tunnelStateFile, json_encode($state, JSON_PRETTY_PRINT));
        }
    }

    // Verify process is still running
    if (isset($state['pid'])) {
        $isRunning = isProcessRunning($state['pid']);
        if (!$isRunning && $state['status'] === 'live') {
            $state['status'] = 'stopped';
            file_put_contents($tunnelStateFile, json_encode($state, JSON_PRETTY_PRINT));
        }
    }

    $logContent = @file_get_contents($tunnelLogFile) ?: '';

    sendJsonResponse(true, 'Tunnel status', [
        'status' => $state['status'] ?? 'unknown',
        'url'    => $state['url'] ?? null,
        'port'   => $state['port'] ?? null,
        'pid'    => $state['pid'] ?? null,
        'log'    => substr($logContent, 0, 500)
    ]);
}

/**
 * ACTION: stop_tunnel
 * Stops the running tunnel process.
 */
else if ($action === 'stop_tunnel') {
    $result = killExistingTunnel($tunnelStateFile);
    
    // Clean up
    @unlink($tunnelStateFile);
    @file_put_contents($tunnelLogFile, '');

    sendJsonResponse(true, 'Tunnel stopped successfully.', [
        'status' => 'stopped',
        'killed' => $result
    ]);
}

else {
    sendJsonResponse(false, 'Unknown action. Supported: start_tunnel, check_tunnel, stop_tunnel');
}


// ── Helper Functions ──────────────────────────────────────────────

function findExecutable($name) {
    $output = [];
    $code = 0;
    exec("where $name 2>&1", $output, $code);
    if ($code === 0 && !empty($output[0]) && stripos($output[0], 'not find') === false) {
        return trim($output[0]);
    }
    // Check common paths
    $paths = [
        "C:\\Program Files\\nodejs\\$name.cmd",
        "C:\\Program Files (x86)\\nodejs\\$name.cmd",
        getenv('APPDATA') . "\\npm\\$name.cmd",
    ];
    foreach ($paths as $p) {
        if (file_exists($p)) return $p;
    }
    return null;
}

function killExistingTunnel($stateFile) {
    if (!file_exists($stateFile)) return false;
    
    $state = json_decode(file_get_contents($stateFile), true);
    if (!$state || !isset($state['pid'])) return false;

    $pid = intval($state['pid']);
    if ($pid > 0) {
        // Kill the process tree on Windows
        exec("taskkill /F /T /PID $pid 2>&1", $output, $code);
        return $code === 0;
    }
    return false;
}

function isProcessRunning($pid) {
    $pid = intval($pid);
    if ($pid <= 0) return false;
    
    exec("tasklist /FI \"PID eq $pid\" 2>&1", $output);
    $outputStr = implode("\n", $output);
    return stripos($outputStr, (string)$pid) !== false && stripos($outputStr, 'No tasks') === false;
}
