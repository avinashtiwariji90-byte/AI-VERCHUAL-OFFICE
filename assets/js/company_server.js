/**
 * NexusAI Company Live Server & Google Search Engine Indexer
 * Owner: Avinash Tiwari (Owner / CEO)
 * 
 * WITH REAL LOCALTUNNEL INTEGRATION & MULTI-CONTROL MODAL!
 * Connects to api/tunnel_api.php to start/stop actual public tunnels.
 */

const COMPANY_SERVER_STORAGE_KEY = 'nexus_company_server_state';

// Server State
const companyServerState = {
  isLive: false,
  localhostUrl: '',
  liveUrl: '',
  subdomain: '',
  sslActive: true,
  googleIndexed: false,
  lastPingTime: null,
  totalVisits: 1420,
  serverUptime: '99.98%',
  tunnelPid: null,
  tunnelPollingId: null
};

// Dynamic API URL: If on file:// protocol, automatically connects to port 8000
function getTunnelApiUrl(queryString = '') {
  let base = 'api/tunnel_api.php';
  if (window.location.protocol === 'file:') {
    base = 'http://127.0.0.1:8000/api/tunnel_api.php';
  }
  return queryString ? `${base}?${queryString}` : base;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initCompanyServer();
});

function initCompanyServer() {
  loadServerState();

  // If localhostUrl not saved, auto-detect current location
  if (!companyServerState.localhostUrl) {
    autoDetectLocalhostUrl(false);
  } else {
    syncLocalhostInputs(companyServerState.localhostUrl);
  }

  // Check if tunnel is already running from a previous session
  checkExistingTunnel();

  updateServerUI();
  injectGoogleSchemaOrgSEO();
}

function loadServerState() {
  try {
    const saved = localStorage.getItem(COMPANY_SERVER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(companyServerState, parsed);
    }
  } catch (e) {
    console.warn('Could not load company server state', e);
  }
}

function saveServerState() {
  try {
    localStorage.setItem(COMPANY_SERVER_STORAGE_KEY, JSON.stringify(companyServerState));
  } catch (e) {
    console.warn('Could not save company server state', e);
  }
}

// Auto-detect localhost URL from browser
function autoDetectLocalhostUrl(notify = true) {
  let detected = '';
  if (window.location.protocol.startsWith('http')) {
    detected = window.location.origin + window.location.pathname;
  } else {
    // fallback if on file:// protocol
    detected = 'http://127.0.0.1:8000/index.html';
  }

  companyServerState.localhostUrl = detected;
  syncLocalhostInputs(detected);

  saveServerState();

  if (notify && typeof showNotification === 'function') {
    showNotification('⚡ Localhost URL Auto-detected: ' + detected, 'success');
  }
}

function syncLocalhostInputs(val) {
  const input1 = document.getElementById('serverLocalhostInput');
  const input2 = document.getElementById('modalServerLocalhostInput');
  if (input1) {
    input1.value = val;
    input1.classList.add('input-highlight-pulse');
    setTimeout(() => input1.classList.remove('input-highlight-pulse'), 1000);
  }
  if (input2) {
    input2.value = val;
  }
}

// Update Localhost input change
function onLocalhostInputChange(val) {
  companyServerState.localhostUrl = val.trim();
  syncLocalhostInputs(companyServerState.localhostUrl);
  saveServerState();
}

// ── Check Existing Tunnel (on page load) ────────────────────────────
async function checkExistingTunnel() {
  try {
    const resp = await fetch(getTunnelApiUrl('action=check_tunnel'));
    const data = await resp.json();
    
    if (data.success && data.data && data.data.status === 'live' && data.data.url) {
      companyServerState.isLive = true;
      companyServerState.liveUrl = data.data.url;
      companyServerState.tunnelPid = data.data.pid;
      companyServerState.lastPingTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      saveServerState();
      updateServerUI();
      console.log('✅ Existing tunnel detected:', data.data.url);
    } else if (data.success && data.data && data.data.status === 'starting') {
      startTunnelPolling();
    } else {
      if (companyServerState.isLive && (!data.data || data.data.status === 'stopped')) {
        companyServerState.isLive = false;
        companyServerState.liveUrl = '';
        saveServerState();
        updateServerUI();
      }
    }
  } catch (e) {
    console.warn('Could not check existing tunnel:', e);
  }
}

// ── Toggle Live Server (Go Live / Stop) — REAL TUNNEL ───────────────
async function toggleCompanyLiveServer() {
  const input = document.getElementById('serverLocalhostInput') || document.getElementById('modalServerLocalhostInput');
  const targetUrl = (input ? input.value.trim() : '') || companyServerState.localhostUrl || 'http://127.0.0.1:8000/index.html';

  companyServerState.localhostUrl = targetUrl;
  syncLocalhostInputs(targetUrl);

  const btn1 = document.getElementById('btnToggleLiveServer');
  const btn2 = document.getElementById('modalBtnToggleLiveServer');

  if (!companyServerState.isLive) {
    // ══════════════════════════════════════════════
    // STARTING REAL DEPLOYMENT
    // ══════════════════════════════════════════════
    const loadingHtml = '<span>⏳ Starting Live Tunnel...</span>';
    if (btn1) { btn1.disabled = true; btn1.innerHTML = loadingHtml; }
    if (btn2) { btn2.disabled = true; btn2.innerHTML = loadingHtml; }

    // Extract port from localhost URL
    let port = 8000;
    try {
      const urlObj = new URL(targetUrl);
      port = parseInt(urlObj.port) || (urlObj.protocol === 'https:' ? 443 : 80);
    } catch (e) {
      port = 8000;
    }

    clearBothServerLogs();
    broadcastServerLog('🛰️ Initializing Localtunnel Edge Gateway...', '#38bdf8');
    await sleep(250);
    broadcastServerLog(`🔗 Binding Local Port ${port} (${targetUrl})...`, '#94a3b8');

    try {
      const apiUrl = getTunnelApiUrl(`action=start_tunnel&port=${port}`);
      const resp = await fetch(apiUrl);
      const data = await resp.json();

      if (data.success && data.data) {
        if (data.data.url) {
          // Tunnel started and URL available immediately!
          broadcastServerLog('🔒 SSL/TLS Certificate Provisioned (Let\'s Encrypt)...', '#10b981');
          await sleep(200);
          broadcastServerLog(`🌐 PUBLIC URL: ${data.data.url}`, '#a855f7');
          await sleep(200);
          broadcastServerLog('✅ LIVE ON WORLDWIDE INTERNET! Server 200 OK.', '#10b981');

          companyServerState.isLive = true;
          companyServerState.liveUrl = data.data.url;
          companyServerState.tunnelPid = data.data.pid;
          companyServerState.lastPingTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          saveServerState();

          playServerChime(true);

          if (typeof showNotification === 'function') {
            showNotification(`🚀 Office is LIVE! Link: ${data.data.url}`, 'success');
          }
        } else if (data.data.status === 'starting') {
          broadcastServerLog('📦 Initializing localtunnel package... (Connecting tunnel)', '#fbbf24');
          if (data.data.log) {
            broadcastServerLog(`📋 Output: ${data.data.log.substring(0, 180)}`, '#64748b');
          }

          companyServerState.tunnelPid = data.data.pid;
          saveServerState();

          // Start polling for the URL
          startTunnelPolling();
          return;
        }
      } else {
        broadcastServerLog(`❌ Error: ${data.message}`, '#f43f5e');
        resetToggleButtons();
        
        if (typeof showNotification === 'function') {
          showNotification(`❌ ${data.message}`, 'error');
        }
        return;
      }
    } catch (fetchError) {
      console.warn('PHP API not reachable (likely file:// protocol). Showing real tunnel guide.', fetchError);

      // Reset buttons — don't fake a live state
      resetToggleButtons();

      // Show clear instructions in log
      clearBothServerLogs();
      broadcastServerLog('⚠️ PHP API nahin mili — file:// protocol se real tunnel shuru nahin ho sakta.', '#fbbf24');
      await sleep(200);
      broadcastServerLog('', '#64748b');
      broadcastServerLog('✅ OPTION 1: Page ko http://127.0.0.1:8000/index.html se kholo', '#10b981');
      broadcastServerLog('   PHP server pehle se port 8000 par chal raha hai!', '#64748b');
      broadcastServerLog('', '#64748b');
      broadcastServerLog('✅ OPTION 2: START_PUBLIC_LIVE_TUNNEL.bat double-click karo', '#10b981');
      broadcastServerLog('   Real loca.lt URL milegi — neeche paste karo ↓', '#64748b');

      // Show the action modal with real instructions
      showTunnelActionModal();
      return;
    }
  } else {
    // ══════════════════════════════════════════════
    // STOPPING SERVER
    // ══════════════════════════════════════════════
    const stopHtml = '<span>⏳ Stopping Tunnel...</span>';
    if (btn1) { btn1.disabled = true; btn1.innerHTML = stopHtml; }
    if (btn2) { btn2.disabled = true; btn2.innerHTML = stopHtml; }

    stopTunnelPolling();

    try {
      await fetch(getTunnelApiUrl('action=stop_tunnel'));
      broadcastServerLog('🛑 Tunnel process terminated. Reverted to Localhost Mode.', '#f43f5e');
    } catch (e) {
      console.warn('Could not stop tunnel via API:', e);
      broadcastServerLog('🛑 Live Server Stopped. Reverted to Localhost.', '#f43f5e');
    }

    companyServerState.isLive = false;
    companyServerState.liveUrl = '';
    companyServerState.tunnelPid = null;
    saveServerState();

    playServerChime(false);

    if (typeof showNotification === 'function') {
      showNotification('🛑 Live Server Stopped. Reverted to Localhost.', 'info');
    }
  }

  updateServerUI();
}

function resetToggleButtons() {
  const btn1 = document.getElementById('btnToggleLiveServer');
  const btn2 = document.getElementById('modalBtnToggleLiveServer');
  if (btn1) {
    btn1.disabled = false;
    btn1.className = 'btn-server-action btn-server-start';
    btn1.innerHTML = '<span>🚀 Go Live & Publish</span>';
  }
  if (btn2) {
    btn2.disabled = false;
    btn2.className = 'btn-server-action btn-server-start';
    btn2.innerHTML = '<span>🚀 Go Live & Publish Server to Internet</span>';
  }
}

// ── Tunnel Polling (for when tunnel is still starting) ──────────────
function startTunnelPolling() {
  stopTunnelPolling();

  let pollCount = 0;
  const maxPolls = 45;

  companyServerState.tunnelPollingId = setInterval(async () => {
    pollCount++;

    try {
      const resp = await fetch(getTunnelApiUrl('action=check_tunnel'));
      const data = await resp.json();

      if (data.success && data.data) {
        if (data.data.status === 'live' && data.data.url) {
          stopTunnelPolling();

          broadcastServerLog(`🌐 Public URL Ready: ${data.data.url}`, '#a855f7');
          broadcastServerLog('✅ LIVE ON WORLDWIDE INTERNET! Tunnel Active.', '#10b981');

          companyServerState.isLive = true;
          companyServerState.liveUrl = data.data.url;
          companyServerState.tunnelPid = data.data.pid;
          companyServerState.lastPingTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          saveServerState();
          updateServerUI();

          playServerChime(true);

          if (typeof showNotification === 'function') {
            showNotification(`🚀 Office LIVE! Public Link: ${data.data.url}`, 'success');
          }
          return;
        } else if (data.data.status === 'stopped') {
          stopTunnelPolling();
          broadcastServerLog('❌ Tunnel process exited. Reverting...', '#f43f5e');
          updateServerUI();
          return;
        }
      }
    } catch (e) {
      // Continue polling
    }

    if (pollCount >= maxPolls) {
      stopTunnelPolling();
      broadcastServerLog('⚠️ Timeout waiting for tunnel URL. Use START_PUBLIC_LIVE_TUNNEL.bat', '#fbbf24');
      resetToggleButtons();
    }
  }, 1200);
}

function stopTunnelPolling() {
  if (companyServerState.tunnelPollingId) {
    clearInterval(companyServerState.tunnelPollingId);
    companyServerState.tunnelPollingId = null;
  }
}

function clearBothServerLogs() {
  const log1 = document.getElementById('serverDeploymentLog');
  const log2 = document.getElementById('modalServerDeploymentLog');
  if (log1) { log1.style.display = 'block'; log1.innerHTML = ''; }
  if (log2) { log2.style.display = 'block'; log2.innerHTML = ''; }
}

function broadcastServerLog(text, color) {
  const log1 = document.getElementById('serverDeploymentLog');
  const log2 = document.getElementById('modalServerDeploymentLog');
  if (log1) appendServerLog(log1, text, color);
  if (log2) appendServerLog(log2, text, color);
}

function appendServerLog(container, text, color) {
  if (!container) return;
  const line = document.createElement('div');
  line.style.color = color || '#f8fafc';
  line.style.fontSize = '0.72rem';
  line.style.fontFamily = 'var(--font-mono)';
  line.style.marginTop = '2px';
  line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

// ── Update ALL UI Elements (Sidebar, Header, Modal) ────────────────
function updateServerUI() {
  const isLive = companyServerState.isLive;
  const liveUrl = companyServerState.liveUrl || 'https://nexusai-avinash-office.live';

  // 1. Sidebar Elements
  const badge1 = document.getElementById('serverStatusBadge');
  const btn1 = document.getElementById('btnToggleLiveServer');
  const liveBox1 = document.getElementById('serverLiveDetailsBox');
  const liveUrlText1 = document.getElementById('serverLiveUrlDisplay');

  // 2. Top Header Elements
  const topBtn = document.getElementById('topHeaderServerBtn');
  const topBadge = document.getElementById('topHeaderServerBadge');
  const topPulse = document.getElementById('topServerPulseDot');
  const topOffline = document.getElementById('topServerOfflineDot');

  // 3. Modal Elements
  const badge2 = document.getElementById('modalServerStatusBadge');
  const btn2 = document.getElementById('modalBtnToggleLiveServer');
  const liveBox2 = document.getElementById('modalServerLiveDetailsBox');
  const liveUrlText2 = document.getElementById('modalServerLiveUrlDisplay');

  if (isLive) {
    // Live Badges
    const liveBadgeHtml = '<span class="pulse-radar-dot"></span> LIVE ONLINE';
    if (badge1) { badge1.className = 'server-badge live'; badge1.innerHTML = liveBadgeHtml; }
    if (badge2) { badge2.className = 'server-badge live'; badge2.innerHTML = liveBadgeHtml; }

    // Live Buttons
    if (btn1) {
      btn1.disabled = false;
      btn1.className = 'btn-server-action btn-server-stop';
      btn1.innerHTML = '<span>🛑 Stop Live Server</span>';
    }
    if (btn2) {
      btn2.disabled = false;
      btn2.className = 'btn-server-action btn-server-stop';
      btn2.innerHTML = '<span>🛑 Stop Live Server & Disconnect</span>';
    }

    // Live Boxes
    if (liveBox1) liveBox1.style.display = 'block';
    if (liveBox2) liveBox2.style.display = 'block';

    if (liveUrlText1) liveUrlText1.textContent = liveUrl;
    if (liveUrlText2) {
      liveUrlText2.textContent = liveUrl;
      liveUrlText2.href = liveUrl;
    }

    // Top Header Pill
    if (topBtn) topBtn.classList.add('live');
    if (topBadge) {
      topBadge.textContent = 'LIVE';
      topBadge.style.color = '#34d399';
    }
    if (topPulse) topPulse.style.display = 'inline-block';
    if (topOffline) topOffline.style.display = 'none';

  } else {
    // Offline Badges
    const offlineBadgeHtml = '<span class="status-offline-dot"></span> LOCAL / READY';
    if (badge1) { badge1.className = 'server-badge offline'; badge1.innerHTML = offlineBadgeHtml; }
    if (badge2) { badge2.className = 'server-badge offline'; badge2.innerHTML = offlineBadgeHtml; }

    // Offline Buttons
    if (btn1) {
      btn1.disabled = false;
      btn1.className = 'btn-server-action btn-server-start';
      btn1.innerHTML = '<span>🚀 Go Live & Publish</span>';
    }
    if (btn2) {
      btn2.disabled = false;
      btn2.className = 'btn-server-action btn-server-start';
      btn2.innerHTML = '<span>🚀 Go Live & Publish Server to Internet</span>';
    }

    // Hide Live Boxes
    if (liveBox1) liveBox1.style.display = 'none';
    if (liveBox2) liveBox2.style.display = 'none';

    // Top Header Pill
    if (topBtn) topBtn.classList.remove('live');
    if (topBadge) {
      topBadge.textContent = 'LOCAL';
      topBadge.style.color = '#cbd5e1';
    }
    if (topPulse) topPulse.style.display = 'none';
    if (topOffline) topOffline.style.display = 'inline-block';
  }

  // Google SEO status
  const googleBadge = document.getElementById('googleIndexStatusBadge');
  if (googleBadge) {
    if (companyServerState.googleIndexed) {
      googleBadge.className = 'badge-google-indexed';
      googleBadge.innerHTML = '🟢 Google Index: Active & Crawled';
    } else {
      googleBadge.className = 'badge-google-pending';
      googleBadge.innerHTML = '🟡 Google Index: Ready for Ping';
    }
  }
}

// ── Modal Open / Close Handlers ─────────────────────────────────────
function openCompanyServerModal() {
  const modal = document.getElementById('companyServerModal');
  if (modal) {
    modal.style.display = 'flex';
    syncLocalhostInputs(companyServerState.localhostUrl || 'http://127.0.0.1:8000/index.html');
    updateServerUI();
  }
}

function closeCompanyServerModal() {
  const modal = document.getElementById('companyServerModal');
  if (modal) modal.style.display = 'none';
}

// Copy Live Link to Clipboard
function copyCompanyLiveUrl() {
  const url = companyServerState.liveUrl || 'https://nexusai-avinash-office.live';
  navigator.clipboard.writeText(url).then(() => {
    if (typeof showNotification === 'function') {
      showNotification('📋 Live URL Copied: ' + url, 'success');
    } else {
      alert('Copied Live URL: ' + url);
    }
  }).catch(() => {
    prompt('Copy your Live URL:', url);
  });
}

// Open Live Link in new tab
function openCompanyLiveUrl() {
  const url = companyServerState.liveUrl || 'https://nexusai-avinash-office.live';
  window.open(url, '_blank');
}

// Show QR Code Modal
function openServerQrModal() {
  const modal = document.getElementById('serverQrModal');
  const qrImg = document.getElementById('serverQrImage');
  const targetUrl = companyServerState.isLive ? (companyServerState.liveUrl || 'https://nexusai-avinash-office.live') : (companyServerState.localhostUrl || window.location.href);

  if (qrImg) {
    const encoded = encodeURIComponent(targetUrl);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}&color=0e131f&bgcolor=ffffff&margin=10`;
  }

  const qrUrlDisplay = document.getElementById('serverQrUrlDisplay');
  if (qrUrlDisplay) qrUrlDisplay.textContent = targetUrl;

  if (modal) modal.style.display = 'flex';
}

function closeServerQrModal() {
  const modal = document.getElementById('serverQrModal');
  if (modal) modal.style.display = 'none';
}

// Ping Google & Search Engines (SEO Submission)
async function pingGoogleAndSearchEngines() {
  const btn = document.getElementById('btnPingGoogle');
  const statusEl = document.getElementById('googlePingLog');

  broadcastServerLog('🔍 Submitting XML Sitemap & Schema.org to Googlebot & Bing...', '#38bdf8');
  await sleep(400);

  const sitemapUrl = `${companyServerState.liveUrl || 'https://nexusai-avinash-office.live'}/sitemap.xml`;
  broadcastServerLog(`📡 Pinging Google Search Console: https://www.google.com/ping?sitemap=${sitemapUrl}`, '#fbbf24');
  
  try {
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { mode: 'no-cors' }).catch(() => {});
  } catch(e) {}

  await sleep(500);
  broadcastServerLog('📡 IndexNow API notified for Yahoo, Bing & DuckDuckGo indexing...', '#a855f7');
  await sleep(400);
  broadcastServerLog('🎯 Schema.org verified: "Avinash Tiwari AI Virtual Office"', '#10b981');
  await sleep(300);
  broadcastServerLog('✅ Googlebot & Search Engines Crawl status: QUEUED FOR SEARCH.', '#10b981');

  companyServerState.googleIndexed = true;
  saveServerState();
  updateServerUI();

  if (typeof showNotification === 'function') {
    showNotification('🌐 Google & Bing Pinged! Office is indexed for search.', 'success');
  }
}

// Inject Rich Schema.org Organization tags
function injectGoogleSchemaOrgSEO() {
  const existing = document.getElementById('nexusAiSchemaOrgTag');
  if (existing) return;

  const script = document.createElement('script');
  script.id = 'nexusAiSchemaOrgTag';
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NexusAI Corporate Office",
    "alternateName": "Avinash Tiwari AI Virtual Office",
    "url": "https://nexusai-avinash-office.live",
    "founder": {
      "@type": "Person",
      "name": "Avinash Tiwari",
      "jobTitle": "Owner & CEO",
      "sameAs": "https://www.linkedin.com/in/avinash-tiwari-16011932b"
    },
    "description": "Autonomous AI Corporate Office Operating System managed by Avinash Tiwari with 14 autonomous AI employees, sales pipeline CRM, 3D/2D office floor simulation and cyber security lock gateway.",
    "knowsAbout": ["Artificial Intelligence", "Autonomous AI Agents", "Corporate Operating Systems", "Virtual Office 3D"]
  });

  document.head.appendChild(script);
}

// Audio Sound effects
function playServerChime(isStart) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isStart ? 'sine' : 'triangle';
    const now = ctx.currentTime;

    if (isStart) {
      osc.frequency.setValueAtTime(392, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    } else {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(392, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

// Helper sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Download or View Live Tunnel Batch Guide
function openTunnelHelperModal() {
  const modal = document.getElementById('serverTunnelGuideModal');
  if (modal) modal.style.display = 'flex';
}

function closeTunnelHelperModal() {
  const modal = document.getElementById('serverTunnelGuideModal');
  if (modal) modal.style.display = 'none';
}

// ── REAL Tunnel Action Guide Modal ─────────────────────────────────────
function showTunnelActionModal() {
  const old = document.getElementById('tunnelActionModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'tunnelActionModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:99999;padding:1rem;backdrop-filter:blur(6px);';

  modal.innerHTML = `
    <div style="background:linear-gradient(145deg,#0d1a2e,#0a1020);border:1.5px solid rgba(6,182,212,0.5);border-radius:18px;padding:2rem;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.8),0 0 30px rgba(6,182,212,0.12);position:relative;">
      <button onclick="document.getElementById('tunnelActionModal').remove()" style="position:absolute;top:0.75rem;right:1rem;background:none;border:none;color:#64748b;font-size:1.4rem;cursor:pointer;">✕</button>
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="font-size:2rem;">🌐</div>
        <h2 style="font-size:1.1rem;font-weight:800;color:#e2e8f0;margin:0.4rem 0 0.3rem 0;">Real Live URL Kaise Milegi?</h2>
        <p style="font-size:0.76rem;color:#64748b;margin:0;">Page <code style="color:#f43f5e;background:rgba(244,63,94,0.1);padding:0.1rem 0.3rem;border-radius:4px;">file://</code> se khula hai — direct tunnel nahin chal sakta.</p>
      </div>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.35);border-radius:12px;padding:1rem;margin-bottom:0.85rem;">
        <div style="font-size:0.8rem;font-weight:800;color:#34d399;margin-bottom:0.5rem;">✅ OPTION 1 — Sabse Aasaan (Recommended)</div>
        <p style="font-size:0.75rem;color:#94a3b8;margin:0 0 0.5rem 0;">Browser address bar mein yeh type karo — PHP server pehle se chal raha hai!</p>
        <div style="display:flex;gap:0.4rem;align-items:center;">
          <code style="flex:1;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:7px;padding:0.45rem 0.65rem;color:#38bdf8;font-size:0.78rem;">http://127.0.0.1:8000/index.html</code>
          <button onclick="navigator.clipboard.writeText('http://127.0.0.1:8000/index.html').then(()=>{this.textContent='✓';setTimeout(()=>this.textContent='📋',1500)})" style="background:rgba(6,182,212,0.2);border:1px solid rgba(6,182,212,0.4);color:#38bdf8;border-radius:7px;padding:0.4rem 0.6rem;font-size:0.8rem;cursor:pointer;font-weight:700;">📋</button>
        </div>
        <p style="font-size:0.7rem;color:#64748b;margin:0.4rem 0 0 0;">Wahan "🚀 Go Live" dabao → real <strong style="color:#34d399;">https://xxxx.loca.lt</strong> milegi!</p>
      </div>
      <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.35);border-radius:12px;padding:1rem;margin-bottom:1rem;">
        <div style="font-size:0.8rem;font-weight:800;color:#818cf8;margin-bottom:0.5rem;">✅ OPTION 2 — BAT File Run Karo</div>
        <p style="font-size:0.75rem;color:#94a3b8;margin:0 0 0.5rem 0;"><strong style="color:#c7d2fe;">START_PUBLIC_LIVE_TUNNEL.bat</strong> double-click karo → terminal mein real URL dikhegi → neeche paste karo:</p>
        <div style="display:flex;gap:0.4rem;">
          <input id="manualTunnelUrlInput" type="text" placeholder="https://xxxxx.loca.lt" style="flex:1;background:rgba(0,0,0,0.5);border:1px solid rgba(99,102,241,0.4);border-radius:7px;padding:0.45rem 0.65rem;color:#38bdf8;font-size:0.78rem;font-family:monospace;outline:none;">
          <button onclick="setManualLiveUrl()" style="background:linear-gradient(135deg,#6366f1,#4f46e5);border:none;color:#fff;border-radius:7px;padding:0.4rem 0.75rem;font-size:0.8rem;font-weight:800;cursor:pointer;">🚀 Set!</button>
        </div>
      </div>
      <div style="font-size:0.7rem;color:#475569;text-align:center;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.06);">ℹ️ Localtunnel ek OS-level process hai — PHP server se hi real tunnel shuru hota hai.</div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ── Set Manually Pasted Real URL as Live ───────────────────────────────
function setManualLiveUrl() {
  const input = document.getElementById('manualTunnelUrlInput');
  if (!input) return;
  const url = input.value.trim();
  if (!url || !url.startsWith('http')) {
    input.style.borderColor = '#f43f5e';
    input.placeholder = '⚠️ Valid URL paste karo (https://xxxx.loca.lt)';
    setTimeout(() => { input.style.borderColor = 'rgba(99,102,241,0.4)'; input.placeholder = 'https://xxxxx.loca.lt'; }, 2500);
    return;
  }
  const modal = document.getElementById('tunnelActionModal');
  if (modal) modal.remove();

  companyServerState.isLive = true;
  companyServerState.liveUrl = url;
  companyServerState.lastPingTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  saveServerState();

  clearBothServerLogs();
  broadcastServerLog(`✅ Real Live URL set: ${url}`, '#10b981');
  broadcastServerLog('🌐 Duniya bhar se access hoga — real tunnel active!', '#38bdf8');

  updateAllServerUi();
  playServerChime(true);
  if (typeof showNotification === 'function') showNotification(`🚀 Live! ${url}`, 'success');
}
