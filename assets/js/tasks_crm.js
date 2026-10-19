/**
 * NexusAI - Task Kanban Management, Sales CRM Pipeline & Approvals System
 */

// Initial Kanban Tasks Database
let systemTasks = [
  {
    id: "TSK-8901",
    title: "E-Commerce Checkout API & Payment Gateway",
    project: "E-Commerce Web Portal",
    dept: "Project Bay",
    assignee: "Rohan Gupta (Backend)",
    priority: "HIGH",
    status: "IN_PROGRESS",
    progress: 85
  },
  {
    id: "TSK-8902",
    title: "Glassmorphic Product Grid Components",
    project: "E-Commerce Web Portal",
    dept: "Project Bay",
    assignee: "Neha Kapoor (Frontend)",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    progress: 70
  },
  {
    id: "TSK-8903",
    title: "End-to-End Cypress Integration Test Suite",
    project: "E-Commerce Web Portal",
    dept: "Project Bay",
    assignee: "Arjun Kumar (QA)",
    priority: "HIGH",
    status: "UNDER_REVIEW",
    progress: 90
  },
  {
    id: "TSK-8904",
    title: "Figma UI Token System & Design Specs",
    project: "Mobile Banking App",
    dept: "Project Bay",
    assignee: "Kavya Sharma (UI/UX)",
    priority: "MEDIUM",
    status: "COMPLETED",
    progress: 100
  },
  {
    id: "TSK-8905",
    title: "SaaS Enterprise Proposal Quotation",
    project: "Apex Logistics Deal",
    dept: "Sales Hub",
    assignee: "Priya Sharma (Sales Mgr)",
    priority: "CRITICAL",
    status: "BLOCKED",
    progress: 50
  }
];

// Sales CRM Deals Database
let salesDeals = [
  {
    id: "DEAL-301",
    company: "Apex Logistics Ltd",
    value: "₹2,50,000",
    stage: "PROPOSAL",
    rep: "Priya Sharma (Sales Mgr)",
    probability: "85%"
  },
  {
    id: "DEAL-302",
    company: "Urban Fashion Store",
    value: "₹85,000",
    stage: "QUALIFIED",
    rep: "Ananya Singh (Sales SDR)",
    probability: "70%"
  },
  {
    id: "DEAL-303",
    company: "NexGen Cloud Systems",
    value: "₹4,20,000",
    stage: "NEGOTIATION",
    rep: "Aditya Joshi (Outreach Rep)",
    probability: "90%"
  },
  {
    id: "DEAL-304",
    company: "HealthPulse Telemedicine",
    value: "₹1,80,000",
    stage: "WON",
    rep: "Priya Sharma (Sales Mgr)",
    probability: "100%"
  }
];

// Pending Owner Approvals
let pendingApprovals = [
  {
    id: "APP-501",
    title: "Google Ads Monthly Budget Expansion",
    requester: "Kunal Mehta (Marketing Mgr)",
    amount: "₹45,000",
    reason: "Scale Meta & Google Ads campaign generating 340+ hot leads",
    status: "PENDING"
  },
  {
    id: "APP-502",
    title: "Enterprise Client Quotation Discount",
    requester: "Priya Sharma (Sales Mgr)",
    amount: "₹2,50,000",
    reason: "Approved 10% volume discount for Apex Logistics deal",
    status: "PENDING"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderKanbanBoard();
  renderCrmPipeline();
  renderApprovalsList();
});

function renderKanbanBoard() {
  const container = document.getElementById('kanbanContainer');
  if (!container) return;

  const statuses = ['TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'];
  let html = '';

  statuses.forEach(status => {
    const tasks = systemTasks.filter(t => t.status === status || (status === 'IN_PROGRESS' && t.status === 'BLOCKED'));
    html += `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <span>${status.replace('_', ' ')}</span>
          <span class="badge" style="background: rgba(255,255,255,0.08); color: var(--text-main);">${tasks.length}</span>
        </div>
        <div class="kanban-card-list">
          ${tasks.map(task => `
            <div class="kanban-card">
              <div style="font-size: 0.75rem; color: var(--primary-light); font-weight: 700;">${task.id} • ${task.project}</div>
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin: 0.35rem 0;">${task.title}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted);">
                <span>👤 ${task.assignee.split(' ')[0]}</span>
                <span class="badge ${task.priority === 'CRITICAL' || task.priority === 'HIGH' ? 'bg-purple' : 'bg-cyan'}">${task.priority}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderCrmPipeline() {
  const container = document.getElementById('crmContainer');
  if (!container) return;

  container.innerHTML = salesDeals.map(deal => `
    <div class="crm-deal-card glass-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-weight: 800; color: var(--text-main); font-size: 0.95rem;">${deal.company}</span>
        <strong style="color: var(--accent-green); font-size: 1.05rem;">${deal.value}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
        <span>Stage: <strong style="color: var(--secondary);">${deal.stage}</strong></span>
        <span>Probability: <strong style="color: var(--accent-gold);">${deal.probability}</strong></span>
      </div>
    </div>
  `).join('');
}

function renderApprovalsList() {
  const container = document.getElementById('approvalsContainer');
  if (!container) return;

  if (pendingApprovals.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-sub); padding: 1rem;">No pending approval requests.</div>`;
    return;
  }

  container.innerHTML = pendingApprovals.map(app => `
    <div class="approval-card glass-card" style="padding: 1rem; margin-bottom: 0.85rem; border-left: 3px solid var(--accent-gold);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
        <h5 style="font-size: 0.9rem; color: var(--text-main);">${app.title}</h5>
        <span style="color: var(--accent-green); font-weight: 700;">${app.amount}</span>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">Requester: ${app.requester} — ${app.reason}</p>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-success btn-sm" onclick="approveRequest('${app.id}')">✓ Approve</button>
        <button class="btn btn-danger btn-sm" onclick="rejectRequest('${app.id}')">✕ Reject</button>
      </div>
    </div>
  `).join('');
}

function approveRequest(appId) {
  pendingApprovals = pendingApprovals.filter(a => a.id !== appId);
  renderApprovalsList();
  addAgentLogMessage("Avinash (Owner / CEO)", `APPROVED Request ${appId}. Head Manager notified to execute.`, "#10b981");
  showToast(`Approval Request ${appId} Approved!`, "success");
}

function rejectRequest(appId) {
  pendingApprovals = pendingApprovals.filter(a => a.id !== appId);
  renderApprovalsList();
  addAgentLogMessage("Avinash (Owner / CEO)", `REJECTED Request ${appId}.`, "#f43f5e");
  showToast(`Approval Request ${appId} Rejected.`, "error");
}
