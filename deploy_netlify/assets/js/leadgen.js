/**
 * NexusAI — Lead Generation Frontend Controller
 * Pure UI rendering + API communication only.
 * Backend: api/leads_api.php
 */

// ─── State ─────────────────────────────────────────────────────────────
let activeLeads = [];
let totalScraped = 846;
let genStats = {
  1: { scraped: 48, qualified: 14 },
  2: { scraped: 62, qualified: 9 },
  3: { scraped: 38, qualified: 11 },
  4: { scraped: 19, qualified: 7 }
};

// ─── API Helper ────────────────────────────────────────────────────────
const API_BASE = 'api/leads_api.php';

async function fetchAPI(action, params = {}) {
  const url = new URL(API_BASE, window.location.origin + window.location.pathname.replace(/[^/]*$/, ''));
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error [${action}]:`, err);
    return null;
  }
}

// ─── Initialize: Load data from backend ────────────────────────────────
async function initLeadGen() {
  // Fetch leads from backend
  const leadsRes = await fetchAPI('list');
  if (leadsRes && leadsRes.success) {
    activeLeads = leadsRes.data.leads || [];
    totalScraped = leadsRes.data.total_scraped || 846;
  }

  // Fetch generator stats
  const genRes = await fetchAPI('generators');
  if (genRes && genRes.success && Array.isArray(genRes.data)) {
    genRes.data.forEach(g => {
      genStats[g.id] = { scraped: g.scraped, qualified: g.qualified };
    });
  }

  // Fetch dashboard summary
  const dashRes = await fetchAPI('dashboard');
  if (dashRes && dashRes.success) {
    updateDashboardStats(dashRes.data);
  }

  renderLeadTable();
  updateGenCards();
  addActivityLog("System", "Lead Generation Center initialized. All 4 generators are LIVE.");
}

// ─── Dashboard Stats Update ────────────────────────────────────────────
function updateDashboardStats(data) {
  const el = (id) => document.getElementById(id);
  if (el('statTotal')) el('statTotal').textContent = data.total_scraped || totalScraped;
  if (el('statHot')) el('statHot').textContent = data.hot_leads || activeLeads.filter(l => l.score >= 80).length;
  if (el('statValue')) el('statValue').textContent = data.pipeline_value_formatted || '₹6.35L';
  if (el('pipelineCount')) el('pipelineCount').textContent = data.total_scraped || totalScraped;
}

// ─── Render Lead Table ─────────────────────────────────────────────────
function renderLeadTable() {
  const tbody = document.getElementById('leadTableBody');
  if (!tbody) return;

  tbody.innerHTML = activeLeads.map((lead, i) => {
    // Generator badge class
    const genClass = lead.genType.includes('Sales Lead Gen 1') ? 'badge-sales1' :
                     lead.genType.includes('Sales Lead Gen 2') ? 'badge-sales2' :
                     lead.genType.includes('Project Lead Gen 1') ? 'badge-proj1' : 'badge-proj2';

    // Score class
    const scoreClass = lead.score >= 90 ? 'hot' : lead.score >= 80 ? 'warm' : 'cold';

    // Status badge class
    const statusClass = lead.status === 'Qualified' ? 'status-qualified' :
                        lead.status === 'Proposal Sent' ? 'status-proposal' :
                        lead.status === 'In Sprint' ? 'status-sprint' :
                        lead.status === 'Extracted' ? 'status-extracted' :
                        lead.status.includes('Assigned') ? 'status-assigned' : 'status-scraped';

    // Short gen label
    const genLabel = lead.genType.replace('Sales ', 'S-').replace('Project ', 'P-');

    return `<tr class="${i === 0 && activeLeads.length > 4 ? 'new-row' : ''}" title="${lead.desc}">
      <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-sub);">${lead.id}</td>
      <td>
        <div class="lead-title">${lead.title}</div>
        <div class="lead-industry">${lead.industry}</div>
      </td>
      <td><span class="lead-gen-badge ${genClass}">${genLabel}</span></td>
      <td class="lead-budget">${lead.budget}</td>
      <td>
        <div class="score-cell">
          <div class="score-bar-bg"><div class="score-bar-fill ${scoreClass}" style="width: ${lead.score}%;"></div></div>
          <span class="score-num ${scoreClass}">${lead.score}</span>
        </div>
      </td>
      <td><span class="status-badge ${statusClass}">${lead.status}</span></td>
      <td style="font-size: 0.78rem; color: var(--text-muted);">${lead.assignee.split(' ')[0]}</td>
    </tr>`;
  }).join('');

  // Update hot leads count
  const hotCount = activeLeads.filter(l => l.score >= 80).length;
  const totalVal = activeLeads.reduce((sum, l) => sum + (l.budgetNum || 0), 0);
  const el = (id) => document.getElementById(id);
  if (el('statHot')) el('statHot').textContent = hotCount;
  if (el('statValue')) el('statValue').textContent = '₹' + (totalVal / 100000).toFixed(2) + 'L';
}

// ─── Render Lead List (for main office sidebar) ────────────────────────
function renderLeadList() {
  const container = document.getElementById('leadListContainer');
  if (!container) return;

  container.innerHTML = activeLeads.slice(0, 5).map(lead => `
    <div class="lead-box">
      <div class="lead-box-title">${lead.genType}</div>
      <div style="font-weight: 700; color: var(--text-main); font-size: 0.85rem;">${lead.title}</div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.3rem; font-size: 0.78rem;">
        <span style="color: var(--accent-green); font-weight: 700;">${lead.budget}</span>
        <span style="background: rgba(99,102,241,0.2); padding: 0.1rem 0.4rem; border-radius: 4px; color: var(--primary-light);">Score ${lead.score}</span>
      </div>
    </div>
  `).join('');
}

// ─── Trigger Lead Generator (calls backend) ────────────────────────────
async function triggerGen(genId) {
  // Call backend API
  const res = await fetchAPI('trigger', { gen_id: genId });

  if (res && res.success) {
    const newLead = res.data.lead;
    const updatedGen = res.data.generator;

    // Add lead to local state
    activeLeads.unshift(newLead);
    totalScraped++;

    // Update generator stats
    genStats[genId] = {
      scraped: updatedGen.scraped,
      qualified: updatedGen.qualified
    };

    // Update all UI
    const el = (id) => document.getElementById(id);
    if (el('statTotal')) el('statTotal').textContent = totalScraped;
    if (el('pipelineCount')) el('pipelineCount').textContent = totalScraped;
    updateGenCards();

    // Log & toast
    addActivityLog(newLead.genType, `New lead: "${newLead.title}" — Budget: ${newLead.budget}, Score: ${newLead.score}/100`);
    showToast(`${newLead.genType} found: ${newLead.title}`, 'success');

    // Re-render
    renderLeadTable();
    renderLeadList();
  } else {
    showToast('Lead generation failed. Check backend.', 'error');
  }
}

// ─── Legacy trigger for main office (backward compatible) ──────────────
function triggerLeadGenerator(genId) {
  triggerGen(genId);
}

// ─── Update Generator Cards UI ─────────────────────────────────────────
function updateGenCards() {
  for (let id = 1; id <= 4; id++) {
    const stats = genStats[id];
    if (!stats) continue;
    const sEl = document.getElementById(`gen${id}Scraped`);
    const qEl = document.getElementById(`gen${id}Qualified`);
    if (sEl) sEl.textContent = stats.scraped;
    if (qEl) qEl.textContent = stats.qualified;
  }
}

// ─── Activity Log ──────────────────────────────────────────────────────
function addActivityLog(sender, msg) {
  const log = document.getElementById('activityLog');
  if (!log) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const item = document.createElement('div');
  item.className = 'log-item';
  item.innerHTML = `<div class="log-time">${time}</div><div class="log-msg"><strong>${sender}:</strong> ${msg}</div>`;

  // Insert after title
  const title = log.querySelector('.section-title');
  if (title && title.nextSibling) {
    log.insertBefore(item, title.nextSibling);
  } else {
    log.appendChild(item);
  }

  // Keep max 15 items
  const items = log.querySelectorAll('.log-item');
  if (items.length > 15) items[items.length - 1].remove();
}

// ─── Toast Notifications ───────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
  container.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 4000);
}

// ─── Auto-init when on leadgen page ────────────────────────────────────
if (document.getElementById('leadTableBody')) {
  initLeadGen();
}
