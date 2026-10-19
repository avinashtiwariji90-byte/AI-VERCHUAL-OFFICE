/**
 * NexusAI - Interactive Office Environment Controller
 * Includes Coffee Machine Routine, Meeting Room, Printing Hub, & Dynamic Office Life Simulation
 */

// Active Office State
let coffeeCupsServed = 48;
let meetingsHeld = 6;
let documentsPrinted = 112;

document.addEventListener('DOMContentLoaded', () => {
  fetchCompanyStatusFromApi();
  renderOfficeFloor();
  renderStreamLogs();
  renderLeadList();
  initModals();
  startOfficeLifeCycleScheduler();
});

function fetchCompanyStatusFromApi() {
  fetch('api/office_api.php?action=company_status')
    .then(res => res.json())
    .then(data => {
      if (data && data.success && data.data) {
        console.log('✅ Company Status loaded from Backend API:', data.data);
      }
    })
    .catch(err => console.log('API connection fallback to offline mode'));
}

function renderOfficeFloor() {
  const container = document.getElementById('officeFloorGrid');
  if (!container) return;

  const depts = {};

  for (const key in AGENT_HIERARCHY) {
    if (key === 'owner' || AGENT_HIERARCHY[key].role === 'lead_gen') continue;
    const agent = AGENT_HIERARCHY[key];
    const deptName = agent.dept || "Executive Suite";
    if (!depts[deptName]) depts[deptName] = [];
    depts[deptName].push(agent);
  }

  let html = '';

  // Render Work Bays
  for (const [deptName, agents] of Object.entries(depts)) {
    html += `
      <div class="dept-zone">
        <div class="dept-zone-title">
          <span>🏢</span> ${deptName} (${agents.length})
        </div>
        <div class="desk-grid">
          ${agents.map(agent => renderDeskCard(agent)).join('')}
        </div>
      </div>
    `;
  }

  // Render Special Office Facilities: Pantry, Conference Room, Resource Hub
  html += `
    <!-- ☕ Pantry & Coffee Lounge -->
    <div class="dept-zone pantry-zone">
      <div class="dept-zone-title" style="color: #fbbf24;">
        <span>☕</span> Pantry & Coffee Lounge
      </div>
      <div class="coffee-machine-box">
        <div>
          <div style="font-weight: 700; font-size: 0.85rem; color: #fbbf24; display: flex; align-items: center; gap: 0.35rem;">
            <span>☕ Smart Espresso Bar</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Cups Brewed Today: <strong style="color: #fff;" id="coffeeCounter">${coffeeCupsServed}</strong></div>
        </div>
        <div class="brewing-anim" title="Coffee Machine Active"></div>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-sub); text-align: center;">
        Fresh Cappuccino, Cold Brew & Snacks available for all AI employees.
      </div>
    </div>

    <!-- 🤝 Conference Room -->
    <div class="dept-zone meeting-zone">
      <div class="dept-zone-title" style="color: var(--primary-light);">
        <span>🤝</span> Conference Room A
      </div>
      <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(99,102,241,0.3); border-radius: 10px; padding: 0.75rem; text-align: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.78rem; color: var(--primary-light); font-weight: 700;">📊 Strategy Table</span>
        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;" id="meetingStatusText">Ready for Team Huddle</div>
      </div>
      <div style="font-size: 0.72rem; color: var(--text-sub); text-align: center;">Meetings Held: <strong style="color: #fff;" id="meetingCounter">${meetingsHeld}</strong></div>
    </div>

    <!-- 🖨️ Resource & Print Hub -->
    <div class="dept-zone resource-zone">
      <div class="dept-zone-title" style="color: var(--secondary);">
        <span>🖨️</span> Print & Resource Room
      </div>
      <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(6,182,212,0.3); border-radius: 10px; padding: 0.75rem; text-align: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.78rem; color: var(--secondary); font-weight: 700;">📄 High-Speed Laser Printer</span>
        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">Paper Tray: 100% Full</div>
      </div>
      <div style="font-size: 0.72rem; color: var(--text-sub); text-align: center;">Pages Printed: <strong style="color: #fff;" id="printCounter">${documentsPrinted}</strong></div>
    </div>
  `;

  container.innerHTML = html;
}

function renderDeskCard(agent) {
  const activity = agent.activity || "Coding Microservice API";
  const isCoffee = activity.includes("Coffee") || activity.includes("Pantry");
  const isMeeting = activity.includes("Meeting");
  const isPrinting = activity.includes("Print");

  let badgeClass = "badge-working";
  let statusColor = "#10b981";
  let statusText = "ONLINE • CODING";

  if (isCoffee) {
    badgeClass = "badge-coffee";
    statusColor = "#fbbf24";
    statusText = "BREAK • PANTRY";
  } else if (isMeeting) {
    badgeClass = "badge-meeting";
    statusColor = "#818cf8";
    statusText = "HUDDLE • MEETING";
  } else if (isPrinting) {
    badgeClass = "badge-printing";
    statusColor = "#38bdf8";
    statusText = "RESOURCE • PRINT";
  }

  // Realistic Desk Monitor Simulated View
  const isDev = agent.dept === 'Project Bay';
  const isSales = agent.dept === 'Sales Hub';
  const isMkt = agent.dept === 'Marketing Studio';

  return `
    <div class="employee-desk realistic-workstation" onclick="openEmployeeModal('${agent.id}')">
      <!-- 🖥️ Realistic Workstation Mini Setup Header -->
      <div class="workstation-desk-top">
        <div class="mini-dual-monitors">
          <div class="mini-screen ${isDev ? 'screen-code' : (isSales ? 'screen-crm' : 'screen-mkt')}">
            <span class="screen-glare"></span>
          </div>
          <div class="mini-screen screen-analytics">
            <span class="screen-glare"></span>
          </div>
        </div>
        <div class="mini-desk-accessories">
          <span class="mini-keyboard"></span>
          <span class="mini-coffee-mug">☕</span>
        </div>
      </div>

      <!-- Employee Realistic Avatar & Badge -->
      <div class="workstation-emp-row">
        <div class="employee-avatar realistic-avatar-frame" style="border-color: ${agent.color || '#6366f1'};">
          <span style="font-size: 1.5rem;">${agent.avatar}</span>
          <div class="status-ring ${isCoffee ? 'status-coffee' : (isMeeting ? 'status-meeting' : 'status-active')}"></div>
        </div>
        
        <div style="flex: 1; min-width: 0;">
          <div class="employee-name" style="font-size: 0.88rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${agent.name}
          </div>
          <div class="employee-role" style="color: ${agent.color || '#38bdf8'}; font-weight: 700; font-size: 0.72rem; text-transform: uppercase;">
            ${agent.title}
          </div>
        </div>
      </div>
      
      <!-- Live Task & Monitor Output -->
      <div class="workstation-live-task">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <span style="font-size: 0.65rem; color: ${statusColor}; font-weight: 800; letter-spacing: 0.05em;">
            ● ${statusText}
          </span>
          <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700;">
            ${agent.progress || 82}%
          </span>
        </div>
        
        <div class="activity-badge ${badgeClass}" style="margin: 0; width: 100%; text-align: left; padding: 0.35rem 0.6rem; font-size: 0.72rem;">
          ${activity}
        </div>
      </div>

      <!-- Task Progress Bar -->
      <div class="task-progress-bar" style="margin-top: 0.5rem; height: 5px;">
        <div class="task-progress-fill" style="width: ${agent.progress || 82}%; background: linear-gradient(90deg, ${agent.color || '#6366f1'}, #38bdf8);"></div>
      </div>
    </div>
  `;
}

// ─── Autonomous Real Work Updates & Sprint Execution Engine ─────────────────

const ROLE_WORK_UPDATES = {
  dev_lead: [
    { action: "🚀 Merged PR #142: Implemented OAuth2 & Redis session cluster with automated token revocation. 12 unit tests passing.", activity: "⚡ Auth Microservice", taskNext: "Stripe & Razorpay Payment Webhook Microservice" },
    { action: "⚡ Optimized MongoDB aggregation on `/api/orders`; reduced average query latency from 380ms to 24ms.", activity: "⚡ Database Indexing", taskNext: "GraphQL Schema Federation & Caching" },
    { action: "🔒 Configured HMAC SHA256 signature verification for incoming enterprise webhooks; replay attack prevention active.", activity: "🔒 Security Webhook", taskNext: "Docker Containerization & Kubernetes Deployment" },
    { action: "📦 Deployed Node.js microservices build v2.4.1 to staging with zero-downtime healthcheck passing.", activity: "📦 Production Staging", taskNext: "Redis Cache Layer & Rate Limiting" }
  ],
  dev_frontend: [
    { action: "🎨 Built responsive Glassmorphic Checkout flow with instant client-side form validation and Tailwind tokens.", activity: "🎨 Glass Checkout UI", taskNext: "Product Filter & Search UI Component" },
    { action: "⚡ Optimized React state re-renders using Zustand; Lighthouse Web Vitals score reached 99/100.", activity: "⚡ Frontend Perf 99", taskNext: "Dark Mode Multi-theme Tokens" },
    { action: "🛒 Integrated Cart state with Backend Stripe API; real-time currency conversion operational.", activity: "🛒 Stripe Cart Sync", taskNext: "Mobile Touch Gesture Animations" },
    { action: "✨ Deployed client portal dashboard components to Vercel preview branch for QA regression testing.", activity: "✨ Vercel Preview", taskNext: "Micro-interactions & Toast Alerts" }
  ],
  qa_lead: [
    { action: "🧪 Completed automated Cypress test run: 48/48 test assertions passed with 0 critical regressions.", activity: "🧪 Cypress E2E 100%", taskNext: "API Load Testing with k6" },
    { action: "🔍 Ran k6 load test simulating 5,000 concurrent virtual users; API maintained 99.98% uptime under load.", activity: "🔍 5K Load Test Pass", taskNext: "Mobile Viewport Regression Audit" },
    { action: "🐞 Found and patched edge-case race condition in checkout coupon validator; marked ticket RESOLVED.", activity: "🐞 Bug Fixed #809", taskNext: "Security Vulnerability Scan" },
    { action: "✅ Formally approved Sprint Release Candidate v2.4.0 for live client deployment.", activity: "✅ Sprint Signoff", taskNext: "Automated CI/CD Pipeline Audit" }
  ],
  designer_lead: [
    { action: "✨ Exported complete Figma Design System with 140+ interactive components and auto-layouts.", activity: "✨ Figma Tokens", taskNext: "Mobile App Wireframes v2" },
    { action: "🎯 Delivered user journey wireframes for AI voice directive interface to frontend engineering.", activity: "🎯 Wireframes v2", taskNext: "3D Glassmorphic Mockups" },
    { action: "🎨 Crafted high-fidelity vector icons and branded dark-theme SVG assets for marketing landing page.", activity: "🎨 Branded SVGs", taskNext: "Interactive Prototype Testing" }
  ],
  pm_manager: [
    { action: "📋 Conducted daily sprint review: 16 tasks on schedule, sprint velocity increased by 18%.", activity: "📋 Sprint Review", taskNext: "Sprint 5 Architecture Planning" },
    { action: "🎯 Re-aligned dev milestones with Client ABC timeline; Milestone 1 ready 2 days ahead of schedule.", activity: "🎯 Milestone Sync", taskNext: "Resource Allocation Review" },
    { action: "🚀 Unblocked Backend team on cloud database provisioning; sprint backlog prioritized.", activity: "🚀 Backlog Pruned", taskNext: "Client Deliverable Signoff" }
  ],
  sales_manager: [
    { action: "💼 Completed technical demo call with Apex Logistics CTO; ₹2.5L enterprise license proposal accepted.", activity: "💼 Closed ₹2.5L Deal", taskNext: "Contract Finalization" },
    { action: "📊 Qualified 14 B2B leads from Lead Gen 1; 6 high-value prospects assigned to SDR closing pipeline.", activity: "📊 Qualified 14 B2B", taskNext: "Enterprise Pricing Strategy" },
    { action: "🤝 Negotiated annual SLA agreement with RealEstate Portal team; closing targeted for Friday.", activity: "🤝 SLA Closing", taskNext: "Q3 Sales Pipeline Forecast" }
  ],
  sales_rep1: [
    { action: "📞 Completed 24 outbound discovery calls; scheduled 4 enterprise product demonstrations for this week.", activity: "📞 24 Calls Done", taskNext: "Follow-up Email Sequences" },
    { action: "📬 Dispatched 60 personalized LinkedIn Sales Navigator outreach notes; open rate reached 68%.", activity: "📬 LinkedIn SDR", taskNext: "Inbound Lead Qualification" }
  ],
  sales_rep2: [
    { action: "📄 Sent customized SaaS proposal deck to FinTech Chatbot client (deal size: ₹1.2L).", activity: "📄 Sent Proposal", taskNext: "Contract Follow-up" },
    { action: "🎯 Successfully closed deal with Urban Fashion Store (₹85,000 ARR); customer onboarding scheduled.", activity: "🎯 Won ₹85K Deal", taskNext: "Enterprise Quote Drafts" }
  ],
  marketing_manager: [
    { action: "📈 Meta & Google Ads optimization live: CPA reduced to ₹220/lead; 92 high-intent leads generated.", activity: "📈 CPA Optimized", taskNext: "Q3 Ad Budget Allocation" },
    { action: "🎯 Scaled search ads targeting 'Autonomous AI Virtual Office'; CTR boosted to 5.4%.", activity: "🎯 5.4% CTR Scale", taskNext: "Conversion Funnel Audit" }
  ],
  social_media: [
    { action: "📱 Published technical breakdown on LinkedIn & Twitter; generated 3,200+ impressions and 28 leads.", activity: "📱 3.2K Impressions", taskNext: "Case Study Thread" },
    { action: "🚀 Launched product update showcase video; engagement rate up 44% week-over-week.", activity: "🚀 Video Launch", taskNext: "Developer Community Outreach" }
  ],
  ads_specialist: [
    { action: "🎯 A/B tested 3 landing page hero variants; variant B generated 41% higher sign-up conversions.", activity: "🎯 A/B Test +41%", taskNext: "Dynamic Retargeting Ads" },
    { action: "⚡ Set up automated negative keyword filtering on Google Ads; saved ₹12,000 in ad spend waste.", activity: "⚡ Ad ROI Boost", taskNext: "Meta Lookalike Audience" }
  ],
  head_manager: [
    { action: "🤖 Orchestrated inter-departmental operations: 18 active projects executing at 96.4% efficiency.", activity: "🤖 Operations 96%", taskNext: "Company Milestone Audit" },
    { action: "📊 Cross-referenced Lead Gen throughput with Sales capacity; pipeline value reached ₹14.8 Lakhs.", activity: "📊 Pipeline Sync", taskNext: "Executive Resource Plan" }
  ]
};

let roleUpdateIndices = {};

// Dynamic Office Real Work Life Cycle Scheduler
function startOfficeLifeCycleScheduler() {
  const agentKeys = Object.keys(AGENT_HIERARCHY).filter(k => k !== 'owner' && AGENT_HIERARCHY[k].role !== 'lead_gen');

  setInterval(() => {
    if (typeof isAiPaused !== 'undefined' && isAiPaused) return;

    // Pick random active employee
    const randomKey = agentKeys[Math.floor(Math.random() * agentKeys.length)];
    const agent = AGENT_HIERARCHY[randomKey];
    if (!agent) return;

    // If agent is currently executing a custom user-assigned task, let their custom task timer advance them
    if (agent.customTask && agent.customTask.inProgress) return;

    if (!roleUpdateIndices[randomKey]) roleUpdateIndices[randomKey] = 0;

    // 85% Real Work Deliverables, 15% Short Natural Breaks
    const isRealWork = Math.random() < 0.85;

    if (isRealWork) {
      // 1. Advance Employee Task Progress
      agent.progress = (agent.progress || 50) + Math.floor(Math.random() * 12) + 6;

      const updates = ROLE_WORK_UPDATES[randomKey] || [
        { action: `💻 Working on ${agent.currentTask}: milestone phase active.`, activity: "💻 Coding / Executing", taskNext: "Next Sprint Phase" }
      ];

      const updateIdx = roleUpdateIndices[randomKey] % updates.length;
      const curUpdate = updates[updateIdx];

      agent.activity = curUpdate.activity;

      if (agent.progress >= 100) {
        // Milestone Completed!
        agent.progress = 30; // reset for next milestone
        const prevTask = agent.currentTask;
        agent.currentTask = curUpdate.taskNext;
        roleUpdateIndices[randomKey]++;

        addAgentLogMessage(
          agent.name,
          `✅ [MILESTONE COMPLETED] Finished: "${prevTask}". Starting next deliverable: "${agent.currentTask}".`,
          agent.color || "#10b981"
        );

        // Sync with Kanban System if available
        if (typeof syncTaskCompletionWithKanban === 'function') {
          syncTaskCompletionWithKanban(agent.name, prevTask, agent.currentTask, agent.dept);
        }
      } else {
        // Regular High-Value Work Update
        addAgentLogMessage(
          agent.name,
          curUpdate.action,
          agent.color || "#6366f1"
        );
      }
    } else {
      // Natural Occasional Quick Moment
      const breaks = [
        { name: "☕ Quick Espresso Refill", log: "☕ Refilled double-shot espresso from the Smart Bar. Back at workstation delivering tasks.", color: "#fbbf24", counter: "coffee" },
        { name: "🤝 Quick Sprint Sync", log: "🤝 Synced with Head Manager Aura on API contract & milestone delivery timeline.", color: "#a855f7", counter: "meeting" },
        { name: "🖨️ Architecture Print", log: "🖨️ Sent system architecture diagram and quotation sheets to the Resource Room printer.", color: "#06b6d4", counter: "print" }
      ];
      const b = breaks[Math.floor(Math.random() * breaks.length)];
      agent.activity = b.name;

      if (b.counter === "coffee") {
        coffeeCupsServed++;
        const el = document.getElementById('coffeeCounter');
        if (el) el.innerText = coffeeCupsServed;
      } else if (b.counter === "meeting") {
        meetingsHeld++;
        const el = document.getElementById('meetingCounter');
        if (el) el.innerText = meetingsHeld;
      } else if (b.counter === "print") {
        documentsPrinted += 2;
        const el = document.getElementById('printCounter');
        if (el) el.innerText = documentsPrinted;
      }

      addAgentLogMessage(agent.name, b.log, b.color);
    }

    renderOfficeFloor();
  }, 7000);
}

function syncTaskCompletionWithKanban(assigneeName, completedTitle, nextTitle, dept) {
  if (typeof systemTasks === 'undefined') return;

  // Find or complete existing task
  const existing = systemTasks.find(t => t.assignee && t.assignee.includes(assigneeName.split(' ')[0]));
  if (existing) {
    existing.status = 'COMPLETED';
    existing.progress = 100;
  }

  // Add new in-progress task
  const newTask = {
    id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
    title: nextTitle,
    project: dept === "Sales Hub" ? "Enterprise Sales Pipeline" : dept === "Marketing Studio" ? "Growth & Acquisition" : "E-Commerce Web & Cloud App",
    dept: dept,
    assignee: assigneeName,
    priority: "HIGH",
    status: "IN_PROGRESS",
    progress: 35
  };

  systemTasks.unshift(newTask);
  if (systemTasks.length > 12) systemTasks.pop();

  if (typeof renderKanbanBoard === 'function') {
    renderKanbanBoard();
  }
}

// Office Environment Action Bar Triggers
function triggerCoffeeBreakForAll() {
  coffeeCupsServed += 14;
  document.getElementById('coffeeCounter').innerText = coffeeCupsServed;

  for (const key in AGENT_HIERARCHY) {
    if (key !== 'owner') {
      AGENT_HIERARCHY[key].activity = "☕ Coffee Lounge";
    }
  }
  renderOfficeFloor();
  addAgentLogMessage("Avinash (Owner / CEO)", "☕ Ordered an ALL-OFFICE COFFEE BREAK! All 14 AI employees are enjoying fresh coffee in the pantry lounge.", "#fbbf24");
  showToast("☕ Coffee Break triggered for all 14 employees!", "success");

  setTimeout(() => {
    for (const key in AGENT_HIERARCHY) {
      if (key !== 'owner') {
        AGENT_HIERARCHY[key].activity = "⚡ Energized & Coding";
      }
    }
    renderOfficeFloor();
  }, 6000);
}

function triggerTeamMeeting() {
  meetingsHeld++;
  document.getElementById('meetingCounter').innerText = meetingsHeld;
  document.getElementById('meetingStatusText').innerText = "🔴 Meeting in Progress";

  for (const key in AGENT_HIERARCHY) {
    if (key === 'head_manager' || key === 'pm_manager' || key === 'sales_manager' || key === 'marketing_manager') {
      AGENT_HIERARCHY[key].activity = "🤝 In Conference Room A";
    }
  }
  renderOfficeFloor();
  addAgentLogMessage("Aarav Verma (PM)", "🤝 Called EMERGENCY TEAM MEETING in Conference Room A for sprint alignment.", "#a855f7");
  showToast("🤝 Team Meeting in progress in Conference Room A!", "info");

  setTimeout(() => {
    document.getElementById('meetingStatusText').innerText = "Ready for Team Huddle";
    for (const key in AGENT_HIERARCHY) {
      if (key !== 'owner') {
        AGENT_HIERARCHY[key].activity = "💻 Executing Sprint";
      }
    }
    renderOfficeFloor();
  }, 6000);
}

function triggerPizzaParty() {
  for (const key in AGENT_HIERARCHY) {
    if (key !== 'owner') {
      AGENT_HIERARCHY[key].activity = "🍕 Eating Pizza";
    }
  }
  renderOfficeFloor();
  addAgentLogMessage("Avinash (Owner / CEO)", "🍕 Ordered a PIZZA PARTY in the Pantry for celebrating milestones! Team morale +100%.", "#f43f5e");
  showToast("🍕 Pizza Party delivered to the Pantry Lounge!", "success");

  setTimeout(() => {
    for (const key in AGENT_HIERARCHY) {
      if (key !== 'owner') {
        AGENT_HIERARCHY[key].activity = "🚀 High Performance";
      }
    }
    renderOfficeFloor();
  }, 6000);
}

function triggerPrintJob() {
  documentsPrinted += 15;
  document.getElementById('printCounter').innerText = documentsPrinted;
  addAgentLogMessage("Priya Sharma (Sales Mgr)", "🖨️ Printed 15 copies of Enterprise Client Quotations & Specs in the Resource Room.", "#06b6d4");
  showToast("🖨️ Print Job completed: 15 pages printed!", "info");
}

let currentOpenAgentKey = null;

function openEmployeeModal(agentKey) {
  let agent = null;
  let foundKey = agentKey;
  for (const key in AGENT_HIERARCHY) {
    if (AGENT_HIERARCHY[key].id === agentKey || key === agentKey) {
      agent = AGENT_HIERARCHY[key];
      foundKey = key;
      break;
    }
  }

  if (!agent) return;
  currentOpenAgentKey = foundKey;

  const modal = document.getElementById('employeeModal');
  const details = document.getElementById('employeeModalDetails');
  if (!modal || !details) return;

  const initialGreeting = generateHinglishAgentResponse(agent, "work update status");

  details.innerHTML = `
    <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.25rem;">
      <div style="width: 64px; height: 64px; border-radius: 50%; font-size: 2.2rem; display: flex; align-items: center; justify-content: center; background: rgba(99, 102, 241, 0.15); border: 2px solid ${agent.color || '#6366f1'}; flex-shrink: 0;">
        ${agent.avatar}
      </div>
      <div>
        <h3 style="font-size: 1.35rem; color: var(--text-main);">${agent.name}</h3>
        <div style="font-size: 0.9rem; color: ${agent.color || 'var(--primary-light)'}; font-weight: 600;">${agent.title}</div>
        <div style="font-size: 0.78rem; color: var(--text-sub);">Department: <strong>${agent.dept || 'Executive Suite'}</strong> | Reports to: ${agent.reportsTo || 'Avinash (Owner / CEO)'}</div>
      </div>
    </div>

    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: 12px; padding: 0.85rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
        <span style="font-size: 0.78rem; color: var(--text-sub); text-transform: uppercase; font-weight: 700;">Current Active Deliverable</span>
        <span id="modalAgentActivity" style="font-size: 0.78rem; color: #fbbf24; font-weight: 700;">${agent.activity || 'Executing Sprint'}</span>
      </div>
      <div id="modalAgentTask" style="font-weight: 600; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.5rem;">${agent.currentTask}</div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
        <span>Milestone Velocity</span>
        <strong id="modalAgentProgressText" style="color: ${agent.color || '#6366f1'};">${agent.progress || 80}% Complete</strong>
      </div>
      <div class="task-progress-bar" style="height: 6px; margin-top: 0.35rem;">
        <div id="modalAgentProgressBar" class="task-progress-fill" style="width: ${agent.progress || 80}%; background: ${agent.color || '#6366f1'};"></div>
      </div>
    </div>

    <!-- Live Hinglish Chat Container with Employee -->
    <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-sub); text-transform: uppercase; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
      <span>💬 Direct Hinglish / English Chat</span>
      <div style="display: flex; gap: 0.4rem; align-items: center;">
        <button class="btn btn-coffee btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.72rem;" onclick="sendCoffeeToAgent('${agent.name}')">☕ Coffee</button>
        ${agent.role !== 'executive' && agent.id !== 'agent-hm' && foundKey !== 'owner' && foundKey !== 'head_manager' ? `
          <button class="btn btn-sm" style="padding: 0.2rem 0.65rem; font-size: 0.72rem; background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700;" onclick="openFireModal('${foundKey}')">
            🔥 Fire Employee
          </button>
        ` : ''}
      </div>
    </div>

    <div class="chat-messages-box" id="agentDirectChatBox">
      <div class="chat-bubble chat-bubble-agent">
        <div class="chat-author-label" style="color: ${agent.color || '#818cf8'};">${agent.avatar} ${agent.name}</div>
        ${initialGreeting}
      </div>
    </div>

    <form onsubmit="sendDirectChatToAgent(event)" style="display: flex; gap: 0.5rem;">
      <input type="text" id="agentChatInput" class="form-input" placeholder="${agent.name.split(' ')[0]} se bolo ya koi naya task assign karo..." required>
      <button type="button" id="agentMicBtn" onclick="startTargetedVoiceInput('agentChatInput', () => sendDirectChatToAgent(), null, 'agentMicBtn')" class="btn btn-primary" style="background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.5); color: #818cf8; white-space: nowrap;">
        🎤 Mic
      </button>
      <button type="submit" class="btn btn-primary" style="white-space: nowrap;">
        💬 Send Task
      </button>
    </form>
  `;

  modal.classList.add('active');
}

function refreshOpenEmployeeModalData(agentKey) {
  let agent = null;
  for (const k in AGENT_HIERARCHY) {
    if (k === agentKey || AGENT_HIERARCHY[k].id === agentKey) {
      agent = AGENT_HIERARCHY[k];
      break;
    }
  }
  if (!agent) return;

  const actEl = document.getElementById('modalAgentActivity');
  const taskEl = document.getElementById('modalAgentTask');
  const progTextEl = document.getElementById('modalAgentProgressText');
  const progBarEl = document.getElementById('modalAgentProgressBar');

  if (actEl) actEl.innerText = agent.activity || 'Active';
  if (taskEl) taskEl.innerText = agent.currentTask || 'Executing Sprint';
  if (progTextEl) progTextEl.innerText = `${agent.progress || 0}% Complete`;
  if (progBarEl) progBarEl.style.width = `${agent.progress || 0}%`;
}

function sendDirectChatToAgent(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('agentChatInput');
  const chatBox = document.getElementById('agentDirectChatBox');
  if (!input || !chatBox || !currentOpenAgentKey) return;

  const userMsg = input.value.trim();
  if (!userMsg) return;

  const agent = AGENT_HIERARCHY[currentOpenAgentKey];
  if (!agent) return;

  chatBox.innerHTML += `
    <div class="chat-bubble chat-bubble-user">
      <div class="chat-author-label" style="color: #6366f1;">👑 Avinash (Owner / CEO)</div>
      ${userMsg}
    </div>
  `;
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    const reply = generateHinglishAgentResponse(agent, userMsg);
    chatBox.innerHTML += `
      <div class="chat-bubble chat-bubble-agent">
        <div class="chat-author-label" style="color: ${agent.color || '#818cf8'};">${agent.avatar} ${agent.name}</div>
        ${reply}
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    // Refresh modal header deliverable if updated
    refreshOpenEmployeeModalData(currentOpenAgentKey);

    addAgentLogMessage(agent.name, reply, agent.color || "#6366f1");
    if (typeof auraSpeak === 'function') {
      auraSpeak(reply, agent.key || agent);
    }
  }, 500);
}

function sendCoffeeToAgent(agentName) {
  closeModal('employeeModal');
  coffeeCupsServed++;
  const cEl = document.getElementById('coffeeCounter');
  if (cEl) cEl.innerText = coffeeCupsServed;
  addAgentLogMessage("Avinash (Owner / CEO)", `☕ Sent a fresh cup of Cappuccino to ${agentName}. Focus boosted to 100%!`, "#fbbf24");
  showToast(`Sent Coffee to ${agentName}! ☕`, "success");
}

function launchAllHandsMeeting() {
  meetingsHeld++;
  const mCounter = document.getElementById('meetingCounter');
  if (mCounter) mCounter.innerText = meetingsHeld;

  const mStatus = document.getElementById('meetingStatusText');
  if (mStatus) mStatus.innerText = "🔴 EMERGENCY ALL-HANDS MEETING LIVE";

  // Stop any previous voice speech
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  for (const key in AGENT_HIERARCHY) {
    if (key !== 'owner') {
      AGENT_HIERARCHY[key].activity = "🤝 All-Hands Meeting";
    }
  }
  renderOfficeFloor();

  const seatsContainer = document.getElementById('boardroomSeatsContainer');
  if (seatsContainer) {
    let html = '';
    for (const key in AGENT_HIERARCHY) {
      if (key === 'owner') continue;
      const agent = AGENT_HIERARCHY[key];
      const isSelected = key === currentBoardroomSpeakerKey;
      html += `
        <div class="boardroom-seat-card ${isSelected ? 'speaking' : ''}" id="seat-${key}" onclick="selectBoardroomSpeaker('${key}')" title="Click karke ${agent.name} se direct baat karo" style="cursor: pointer;">
          <div class="boardroom-avatar" style="border-color: ${agent.color || '#6366f1'};">
            ${agent.avatar}
          </div>
          <div style="font-size: 0.78rem; font-weight: 700; color: #fff;">${agent.name.split(' ')[0]} ${agent.name.split(' ')[1] ? agent.name.split(' ')[1][0] + '.' : ''}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${agent.dept ? agent.dept.split(' ')[0] : 'Exec'}</div>
          <div style="font-size: 0.65rem; color: ${agent.gender === 'female' ? '#f472b6' : '#60a5fa'}; font-weight: 600; margin-top: 2px;">${agent.gender === 'female' ? '👩 Female' : '👨 Male'}</div>
        </div>
      `;
    }
    seatsContainer.innerHTML = html;
  }

  const modal = document.getElementById('teamMeetingModal');
  if (modal) modal.classList.add('active');

  const activeAgent = AGENT_HIERARCHY[currentBoardroomSpeakerKey] || AGENT_HIERARCHY['head_manager'];
  const label = document.getElementById('currentMeetingSpeakerName');
  if (label) {
    label.innerHTML = `${activeAgent.avatar} ${activeAgent.name} <span style="font-size:0.75rem; color:var(--text-sub);">(${activeAgent.title})</span>`;
  }

  const chatBox = document.getElementById('boardroomChatBox');
  if (chatBox) {
    chatBox.innerHTML = `
      <div class="chat-bubble chat-bubble-agent" style="border-left: 3px solid #6366f1;">
        <div class="chat-author-label" style="color: #818cf8;">🤖 Aura Sharma (Head Manager AI)</div>
        Boss Avinash, Conference Room A me sabhi 14 employees ready hain! Aap <strong>jis employee ka name bolein ya unke card par click karein—sirf wahi aapse baat karega!</strong>
      </div>
    `;
  }

  addAgentLogMessage("Avinash (Owner / CEO)", "🚨 ALL-HANDS BOARDROOM MEETING LIVE in Conference Room A!", "#a855f7");
  showToast("🤝 Boardroom Live! Click any employee or speak their name to talk.", "success");

  // Initial welcome from Aura
  setTimeout(() => {
    if (typeof auraSpeak === 'function') {
      auraSpeak("Boss Avinash, conference room me sabhi employees ready hain. Aap jis employee ka name lenge, sirf wahi aapse baat karega.", AGENT_HIERARCHY['head_manager']);
    }
  }, 400);
}

let currentBoardroomSpeakerKey = 'head_manager';

function selectBoardroomSpeaker(agentKey) {
  currentBoardroomSpeakerKey = agentKey;
  const agent = AGENT_HIERARCHY[agentKey];
  if (!agent) return;

  // Highlight selected seat
  document.querySelectorAll('.boardroom-seat-card').forEach(c => c.classList.remove('speaking'));
  const seat = document.getElementById(`seat-${agentKey}`);
  if (seat) seat.classList.add('speaking');

  // Update target speaker label
  const label = document.getElementById('currentMeetingSpeakerName');
  if (label) {
    label.innerHTML = `${agent.avatar} ${agent.name} <span style="font-size:0.75rem; color:var(--text-sub);">(${agent.title})</span>`;
  }

  const input = document.getElementById('boardroomInput');
  if (input) {
    input.placeholder = `${agent.name.split(' ')[0]} (${agent.title}) se poocho ya bolo...`;
  }

  showToast(`🎯 Target Speaker: ${agent.name} (${agent.title})`, "info");
}

function sendBoardroomDirective(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('boardroomInput');
  const chatBox = document.getElementById('boardroomChatBox');
  if (!input || !chatBox) return;

  const directive = input.value.trim();
  if (!directive) return;

  // Immediately cancel any previous speech
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  chatBox.innerHTML += `
    <div class="chat-bubble chat-bubble-user">
      <div class="chat-author-label" style="color: #6366f1;">👑 Avinash (Owner / CEO)</div>
      ${directive}
    </div>
  `;
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // 1. Resolve targeted agent strictly by Name or Post/Title in speech
  const targeted = typeof findAgentByNameOrPost === 'function' ? findAgentByNameOrPost(directive) : null;
  const respondingAgentKey = targeted ? targeted.key : (currentBoardroomSpeakerKey || 'head_manager');
  const agent = AGENT_HIERARCHY[respondingAgentKey] || AGENT_HIERARCHY['head_manager'];

  // Update target speaker label & seat highlight
  currentBoardroomSpeakerKey = respondingAgentKey;
  const label = document.getElementById('currentMeetingSpeakerName');
  if (label) {
    label.innerHTML = `${agent.avatar} ${agent.name} <span style="font-size:0.75rem; color:var(--text-sub);">(${agent.title})</span>`;
  }

  document.querySelectorAll('.boardroom-seat-card').forEach(c => c.classList.remove('speaking'));
  const seat = document.getElementById(`seat-${respondingAgentKey}`);
  if (seat) seat.classList.add('speaking');

  setTimeout(() => {
    const reply = generateHinglishAgentResponse(agent, directive);

    chatBox.innerHTML += `
      <div class="chat-bubble chat-bubble-agent" style="border-left: 3px solid ${agent.color || '#6366f1'};">
        <div class="chat-author-label" style="color: ${agent.color || '#818cf8'};">${agent.avatar} ${agent.name} (${agent.title})</div>
        ${reply}
      </div>
    `;

    // If project query, render a mini project status card below the reply
    const isProjectQ = /project|dikhao|show|kya bana|kya chal|kaam|deliverable|update|status|progress|current|abhi|batao/.test(directive.toLowerCase());
    if (isProjectQ && typeof activeProjects !== 'undefined' && activeProjects.length > 0) {
      // Pick the most relevant project for this agent
      const agentDept = (agent.dept || '').toLowerCase();
      const proj = activeProjects.find(p =>
        agentDept.includes('project') || agentDept.includes('tech') ||
        (agent.role === 'head_manager') || agentDept.includes('sales')
      ) || activeProjects[0];

      const completedPhases = proj.phases.filter(ph => ph.status === 'completed').length;

      chatBox.innerHTML += `
        <div style="margin: 0.4rem 0 0.75rem 0; background: rgba(14,20,34,0.9); border: 1px solid ${proj.color || '#6366f1'}44; border-radius: 12px; padding: 0.85rem; font-size: 0.78rem;">
          <div style="font-weight: 800; color: ${proj.color || '#6366f1'}; margin-bottom: 0.4rem;">📁 ${proj.title}</div>
          <div style="color: var(--text-muted); margin-bottom: 0.5rem;">👤 ${proj.client} &nbsp;•&nbsp; 💰 ${proj.budget} &nbsp;•&nbsp; 🛠 ${proj.stack.split(' ')[0]}</div>
          <div style="background: rgba(0,0,0,0.3); border-radius: 20px; height: 6px; margin-bottom: 0.35rem; overflow: hidden;">
            <div style="height: 100%; width: ${proj.progress}%; background: linear-gradient(90deg, ${proj.color || '#6366f1'}, #38bdf8); border-radius: 20px;"></div>
          </div>
          <div style="color: var(--text-muted); margin-bottom: 0.45rem;">${completedPhases}/${proj.phases.length} phases &nbsp;•&nbsp; ${proj.progress}% complete</div>
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            ${proj.phases.slice(0, 4).map(ph => `
              <span style="font-size: 0.68rem; padding: 0.12rem 0.45rem; border-radius: 20px;
                background: ${ph.status === 'completed' ? 'rgba(16,185,129,0.15)' : ph.status === 'in-progress' ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${ph.status === 'completed' ? 'rgba(16,185,129,0.4)' : ph.status === 'in-progress' ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'};
                color: ${ph.status === 'completed' ? '#34d399' : ph.status === 'in-progress' ? '#38bdf8' : '#64748b'};">
                ${ph.status === 'completed' ? '✅' : ph.status === 'in-progress' ? '⚡' : '⬜'} ${ph.name.replace(/^[^\s]+\s/, '').split('(')[0].trim()}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
    addAgentLogMessage(agent.name, `[BOARDROOM] ${reply}`, agent.color || "#6366f1");
    if (typeof auraSpeak === 'function') {
      auraSpeak(reply, agent.key || agent);
    }
  }, 400);
}

function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('close-btn')) {
        closeModal(modal.id);
      }
    });
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>ℹ️</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ─── Hire AI Employee Portal Functions ────────────────────────────────────────

function openHireModal() {
  const modal = document.getElementById('hireModal');
  if (modal) modal.classList.add('active');
}

function applyHirePreset(type) {
  const presets = {
    mobile: {
      name: "Siddharth Malhotra (Mobile Lead AI)",
      avatar: "📱",
      title: "Senior Flutter & React Native Architect",
      dept: "Project Bay",
      salary: "₹45,000 / mo",
      task: "Building cross-platform iOS & Android mobile applications"
    },
    cyber: {
      name: "Vikram Rathore (Security Analyst AI)",
      avatar: "🛡️",
      title: "Chief AI Security & Compliance Auditor",
      dept: "Executive Suite",
      salary: "₹50,000 / mo",
      task: "Auditing cloud servers, API gateways & vulnerability scans"
    },
    content: {
      name: "Ananya Roy (Content Strategist AI)",
      avatar: "✍️",
      title: "Lead SEO Copywriter & Content Creator",
      dept: "Marketing Studio",
      salary: "₹30,000 / mo",
      task: "Writing high-converting landing page copy & blog posts"
    },
    data: {
      name: "Rishi Kapoor (Data Scientist AI)",
      avatar: "📊",
      title: "Business Intelligence & Machine Learning Lead",
      dept: "Project Bay",
      salary: "₹55,000 / mo",
      task: "Predictive revenue analytics & custom LLM fine-tuning"
    },
    support: {
      name: "Pooja Hegde (Customer Success AI)",
      avatar: "🎧",
      title: "24/7 Enterprise Support Specialist",
      dept: "Support & Operations",
      salary: "₹28,000 / mo",
      task: "Handling client tickets, live support chat & SLA tracking"
    }
  };

  const p = presets[type];
  if (!p) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setVal('hireName', p.name);
  setVal('hireAvatar', p.avatar);
  setVal('hireTitle', p.title);
  setVal('hireDept', p.dept);
  setVal('hireSalary', p.salary);
  setVal('hireTask', p.task);

  showToast(`Applied preset for ${p.title}! ✨`, "info");
}

function submitHireEmployeeForm(e) {
  e.preventDefault();

  const name = document.getElementById('hireName').value.trim();
  const avatar = document.getElementById('hireAvatar').value;
  const title = document.getElementById('hireTitle').value.trim();
  const dept = document.getElementById('hireDept').value;
  const salary = document.getElementById('hireSalary').value.trim();
  const task = document.getElementById('hireTask').value.trim();

  if (!name || !title) {
    showToast("Please enter Employee Name and Title", "error");
    return;
  }

  const newEmp = {
    id: `agent_hired_${Date.now()}`,
    name: name,
    title: title,
    avatar: avatar,
    role: "employee",
    dept: dept,
    gender: typeof getAgentGender === 'function' ? getAgentGender(name) : 'female',
    status: "Active Deployed",
    progress: 100,
    currentTask: task,
    activity: "🚀 Onboarding Complete",
    salary: salary,
    reportsTo: "Aura Sharma (Head Manager AI)",
    color: dept === "Sales Hub" ? "#10b981" : dept === "Marketing Studio" ? "#a855f7" : dept === "Executive Suite" ? "#fbbf24" : "#06b6d4"
  };

  addNewEmployeeToHierarchy(newEmp);
  closeModal('hireModal');

  // Reset Form
  const form = document.getElementById('hireEmployeeForm');
  if (form) form.reset();
}

function addNewEmployeeToHierarchy(newEmp) {
  const empKey = `hired_${Date.now()}`;
  AGENT_HIERARCHY[empKey] = newEmp;

  // 1. Update UI count
  updateActiveAgentCountUI();

  // 2. Re-render HTML Floor grid & sidebar tree
  renderOfficeFloor();
  renderSidebarHierarchy();

  // 3. Re-initialize 2D Canvas spatial employees if function exists
  if (typeof setupCanvasEmployees === 'function') {
    setupCanvasEmployees();
  }

  // 4. Re-spawn 3D Employees if Three.js is active
  if (typeof spawnDeluxeEmployees === 'function' && typeof scene !== 'undefined') {
    spawnDeluxeEmployees();
  }

  // 5. Add Log Stream Message & Aura Voice Notification
  addAgentLogMessage("Avinash (Owner / CEO)", `✨ HIRED NEW AI EMPLOYEE: Welcome ${newEmp.name} (${newEmp.title}) to the ${newEmp.dept}!`, "#10b981");

  const auraMsg = `Welcome to NexusAI, ${newEmp.name}! Sir Avinash has appointed you as ${newEmp.title} in ${newEmp.dept}.`;
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", `🤖 ${auraMsg}`, "#6366f1");
    if (typeof auraSpeak === 'function') {
      auraSpeak(auraMsg);
    }
  }, 1000);

  showToast(`🎉 ${newEmp.name} hired and deployed to ${newEmp.dept}!`, "success");

  // 6. Persist with Backend API
  fetch('api/office_api.php?action=hire_agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(newEmp)
  }).then(res => res.json())
    .then(data => console.log('API Hire agent response:', data))
    .catch(err => console.log('Backend sync offline fallback active'));
}

// ─── Fire / Terminate AI Employee Functions ──────────────────────────────────

function onFireAgentSelectChange(selectedKey) {
  const agent = AGENT_HIERARCHY[selectedKey];
  if (!agent) return;

  const avatarEl = document.getElementById('firePreviewAvatar');
  const nameEl = document.getElementById('firePreviewName');
  const titleEl = document.getElementById('firePreviewTitle');
  const deptEl = document.getElementById('firePreviewDept');
  const formEl = document.getElementById('fireEmployeeForm');

  if (avatarEl) avatarEl.innerHTML = agent.avatar || '👤';
  if (nameEl) nameEl.innerText = agent.name;
  if (titleEl) titleEl.innerText = agent.title;
  if (deptEl) deptEl.innerHTML = `Department: <strong>${agent.dept || 'Project Bay'}</strong> | Salary: ${agent.salary || '₹40,000 / mo'}`;
  if (formEl) {
    formEl.onsubmit = function(e) {
      submitFireEmployeeForm(e, selectedKey);
    };
  }
}

function openFireModal(agentKey) {
  // Collect all eligible fireable employees
  const fireable = [];
  for (const k in AGENT_HIERARCHY) {
    const a = AGENT_HIERARCHY[k];
    if (k !== 'owner' && a.role !== 'executive' && k !== 'head_manager' && a.id !== 'agent-hm') {
      fireable.push({ key: k, agent: a });
    }
  }

  if (fireable.length === 0) {
    showToast("No fireable AI employees currently deployed in the office!", "info");
    return;
  }

  // Determine initial selection
  let selectedKey = agentKey;
  if (!selectedKey || !AGENT_HIERARCHY[selectedKey]) {
    selectedKey = fireable[0].key;
  }

  let agent = AGENT_HIERARCHY[selectedKey];

  if (selectedKey === 'owner' || agent.role === 'executive' || selectedKey === 'head_manager' || agent.id === 'agent-hm') {
    showToast("⚠️ Security Notice: CEO and Head Manager cannot be fired!", "error");
    if (typeof auraSpeak === 'function') {
      auraSpeak("Sir Avinash, executive leadership cannot be terminated.");
    }
    return;
  }

  const modal = document.getElementById('fireModal');
  const body = document.getElementById('fireModalBody');
  if (!modal || !body) {
    if (confirm(`⚠️ TERMINATE CONTRACT:\n\nAre you sure you want to fire ${agent.name} (${agent.title}) from ${agent.dept}?`)) {
      fireEmployee(selectedKey, "Direct CEO Termination Order");
    }
    return;
  }

  // Build employee dropdown options
  const optionsHtml = fireable.map(item => {
    const isSel = item.key === selectedKey ? 'selected' : '';
    return `<option value="${item.key}" ${isSel}>${item.agent.avatar || '👤'} ${item.agent.name} — ${item.agent.title} (${item.agent.dept || 'Office'})</option>`;
  }).join('');

  body.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <label class="form-label" style="color: #f87171; font-weight: 700; display: block; margin-bottom: 0.4rem;">
        Select AI Employee to Terminate (हटाने के लिए कर्मचारी चुनें):
      </label>
      <select id="fireAgentSelect" class="form-input" style="border-color: rgba(239,68,68,0.4); background: rgba(14, 19, 31, 0.9); font-size: 0.88rem; padding: 0.65rem;" onchange="onFireAgentSelectChange(this.value)">
        ${optionsHtml}
      </select>
    </div>

    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; text-align: center;">
      <div id="firePreviewAvatar" style="width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
        ${agent.avatar || '👤'}
      </div>
      <h3 id="firePreviewName" style="font-size: 1.2rem; color: #fff; margin-bottom: 0.25rem;">${agent.name}</h3>
      <div id="firePreviewTitle" style="font-size: 0.85rem; color: #f87171; font-weight: 700;">${agent.title}</div>
      <div id="firePreviewDept" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Department: <strong>${agent.dept || 'Project Bay'}</strong> | Salary: ${agent.salary || '₹40,000 / mo'}</div>
    </div>

    <form id="fireEmployeeForm" onsubmit="submitFireEmployeeForm(event, '${selectedKey}')">
      <div class="form-group" style="margin-bottom: 1rem;">
        <label class="form-label" style="color: #f87171; font-weight: 600;">Reason for Termination (कारण):</label>
        <select id="fireReasonSelect" class="form-input" style="border-color: rgba(239,68,68,0.3);">
          <option value="Performance & Sprint Velocity Issues">Low Performance / Missed Deadlines</option>
          <option value="Company Budget & Resource Optimization">Company Budget & Resource Optimization</option>
          <option value="Restructuring Department Pipeline">Department Restructuring</option>
          <option value="Direct Owner / CEO Executive Order" selected>Direct CEO Executive Directive</option>
        </select>
      </div>

      <div style="background: rgba(0,0,0,0.25); border-radius: 8px; padding: 0.75rem; font-size: 0.75rem; color: #fca5a5; margin-bottom: 1.25rem; line-height: 1.4;">
        ⚠️ <strong>Notice:</strong> Terminating this employee will immediately revoke API keys, remove their 2D/3D desk from the virtual office floor, and notify all department heads.
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button type="button" class="btn btn-sm" style="background: rgba(255,255,255,0.08);" onclick="closeModal('fireModal')">Cancel</button>
        <button type="submit" class="btn btn-sm" style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; font-weight: 800; border: none; box-shadow: 0 4px 15px rgba(239,68,68,0.4); cursor: pointer;">
          🔥 Confirm & Fire Immediately
        </button>
      </div>
    </form>
  `;

  modal.classList.add('active');
}

function submitFireEmployeeForm(e, agentKey) {
  e.preventDefault();
  const select = document.getElementById('fireReasonSelect');
  const reason = select ? select.value : "Direct CEO Executive Order";
  closeModal('fireModal');
  fireEmployee(agentKey, reason);
}

function fireEmployee(agentKey, reason = "Relieved of duties by CEO") {
  let agent = null;
  let foundKey = agentKey;
  for (const k in AGENT_HIERARCHY) {
    if (k === agentKey || AGENT_HIERARCHY[k].id === agentKey) {
      agent = AGENT_HIERARCHY[k];
      foundKey = k;
      break;
    }
  }

  if (!agent) {
    showToast("Employee not found", "error");
    return;
  }

  if (foundKey === 'owner' || agent.role === 'executive' || foundKey === 'head_manager' || agent.id === 'agent-hm') {
    showToast("⚠️ Security Notice: CEO and Head Manager cannot be terminated!", "error");
    return;
  }

  const empName = agent.name;
  const empTitle = agent.title;
  const empDept = agent.dept || "Office";

  // 1. Remove from AGENT_HIERARCHY
  delete AGENT_HIERARCHY[foundKey];

  // 2. Update UI Count
  updateActiveAgentCountUI();

  // 3. Close Employee Modal & Fire Modal if open
  closeModal('employeeModal');
  closeModal('fireModal');

  // 4. Re-render Floor & Sidebar
  renderOfficeFloor();
  renderSidebarHierarchy();

  // 5. Re-init 2D Canvas & 3D ThreeJS employees
  if (typeof setupCanvasEmployees === 'function') {
    setupCanvasEmployees();
  }
  if (typeof spawnDeluxeEmployees === 'function' && typeof scene !== 'undefined') {
    spawnDeluxeEmployees();
  }

  // 6. Broadcast Log Messages & Aura Speech
  addAgentLogMessage("Avinash (Owner / CEO)", `🔥 TERMINATED: Relieved ${empName} (${empTitle}) from ${empDept}. Reason: ${reason}`, "#ef4444");

  const auraMsg = `Attention all teams: ${empName} (${empTitle}) has been terminated and relieved of duties by CEO Avinash. Security access has been revoked.`;
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", `🤖 ${auraMsg}`, "#f87171");
    if (typeof auraSpeak === 'function') {
      auraSpeak(auraMsg);
    }
  }, 900);

  showToast(`🔥 ${empName} has been fired and removed from office!`, "error");

  // 7. Sync with Backend API
  fetch('api/office_api.php?action=fire_agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: agent.id || foundKey, name: empName, dept: empDept, reason: reason })
  }).then(res => res.json())
    .then(data => console.log('API Fire agent response:', data))
    .catch(err => console.log('Backend sync offline fallback active'));
}

function updateActiveAgentCountUI() {
  const count = Object.keys(AGENT_HIERARCHY).filter(k => k !== 'owner').length;
  const countEl = document.getElementById('activeAgentCountText');
  if (countEl) {
    countEl.innerText = `${count} Active Agents`;
  }
}

function renderSidebarHierarchy() {
  const container = document.getElementById('sidebarHierarchyContainer');
  if (!container) return;

  const depts = {};
  for (const k in AGENT_HIERARCHY) {
    const agent = AGENT_HIERARCHY[k];
    if (k === 'owner') continue;
    const dept = agent.dept || "Executive Suite";
    if (!depts[dept]) depts[dept] = 0;
    depts[dept]++;
  }

  container.innerHTML = `
    <a href="https://www.linkedin.com/in/avinash-tiwari-16011932b?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" class="tree-item active" style="text-decoration: none; display: flex; align-items: center;" title="View Avinash Tiwari's LinkedIn Profile">
      <i data-lucide="crown" style="color: #fbbf24;"></i>
      <span>Avinash (Owner / CEO)</span>
      <span class="badge bg-purple">LINKEDIN 🔗</span>
    </a>

    <div class="tree-item" style="margin-left: 0.75rem;">
      <i data-lucide="bot" style="color: var(--primary-light);"></i>
      <span>Head Manager AI</span>
      <span class="badge bg-purple">Chief</span>
    </div>

    <div class="tree-item" style="margin-left: 1.5rem;">
      <i data-lucide="code-2" style="color: var(--secondary);"></i>
      <span>Project Manager</span>
      <span class="badge bg-cyan">${depts['Project Bay'] || 4} Techs</span>
    </div>

    <div class="tree-item" style="margin-left: 1.5rem;">
      <i data-lucide="briefcase" style="color: var(--accent-green);"></i>
      <span>Sales Manager</span>
      <span class="badge bg-green">${depts['Sales Hub'] || 3} Reps</span>
    </div>

    <div class="tree-item" style="margin-left: 1.5rem;">
      <i data-lucide="megaphone" style="color: var(--accent-purple);"></i>
      <span>Marketing Manager</span>
      <span class="badge bg-gold">${depts['Marketing Studio'] || 3} Team</span>
    </div>
  `;

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 🚀 LIVE PROJECT TRACKER — Assign Project, Sprint Phases, Visual Output
// ═══════════════════════════════════════════════════════════════════════

let activeProjects = [
  {
    id: 'PROJ-001',
    title: 'Nike Air Modern E-Commerce Store',
    client: 'NexGen Retail Ltd',
    stack: 'React + Node.js + TailwindCSS',
    budget: '₹2,50,000',
    requirements: 'Product Catalogue, Glassmorphic Checkout, Razorpay Integration, Admin Panel',
    phases: [
      { name: '🎨 UI/UX Wireframes (Kavya)', status: 'completed' },
      { name: '⚛️ React Component Architecture (Neha)', status: 'completed' },
      { name: '🔧 Node.js REST API (Rohan)', status: 'in-progress' },
      { name: '💳 Razorpay Payment Integration', status: 'pending' },
      { name: '🧪 Cypress E2E Testing (Arjun)', status: 'pending' },
      { name: '🚀 Staging Deployment', status: 'pending' }
    ],
    color: '#6366f1',
    progress: 55,
    previewType: 'ecommerce'
  },
  {
    id: 'PROJ-002',
    title: 'Mobile Banking SaaS App — FinTrust',
    client: 'FinTrust Capital Pvt Ltd',
    stack: 'Flutter + Firebase + Cloud Functions',
    budget: '₹4,20,000',
    requirements: 'Biometric Login, Portfolio Tracker, AI Spending Insights, Real-time Notifications',
    phases: [
      { name: '📱 Flutter App Scaffold (Aarav)', status: 'completed' },
      { name: '🔐 Firebase Auth & Biometrics', status: 'completed' },
      { name: '📊 Portfolio Charts & Dashboard', status: 'in-progress' },
      { name: '🤖 AI Spending Analyzer (Kunal)', status: 'pending' },
      { name: '🔔 Push Notification System', status: 'pending' }
    ],
    color: '#10b981',
    progress: 40,
    previewType: 'mobile'
  }
];

// Sync with localStorage
try {
  const saved = localStorage.getItem('nexusai_projects');
  if (saved) {
    activeProjects = JSON.parse(saved);
  } else {
    localStorage.setItem('nexusai_projects', JSON.stringify(activeProjects));
  }
} catch (e) {
  console.log("LocalStorage init error:", e);
}

function persistProjectsToStorage() {
  try {
    localStorage.setItem('nexusai_projects', JSON.stringify(activeProjects));
  } catch (e) {}
}

const PROJECT_PRESETS = {
  ecommerce: {
    title: 'Modern E-Commerce Web Store',
    client: 'Nike Retail India Ltd',
    stack: 'React + Node.js + TailwindCSS',
    budget: '₹2,50,000',
    requirements: 'Product Catalogue, Glassmorphic Checkout, Razorpay / Stripe Payment, Admin Analytics Panel'
  },
  mobile: {
    title: 'SaaS Mobile App',
    client: 'FinTrust Capital Pvt Ltd',
    stack: 'Flutter + Firebase + Cloud Functions',
    budget: '₹3,80,000',
    requirements: 'User Auth, Dashboard, Push Notifications, Real-time Data Sync, Offline Mode'
  },
  ai_portal: {
    title: 'AI Customer Support Agent Bot',
    client: 'TechNova Cloud Systems',
    stack: 'Python FastAPI + OpenAI API + React',
    budget: '₹1,80,000',
    requirements: 'GPT-4 Chatbot Widget, Ticket Escalation, Admin Live Dashboard, Analytics'
  },
  realestate: {
    title: 'Real Estate Property Portal',
    client: 'Apex Luxury Living Ltd',
    stack: 'Next.js 14 + PostgreSQL + Stripe',
    budget: '₹3,20,000',
    requirements: 'Property Listings, Google Maps Integration, Virtual Tours, Booking & Enquiry System'
  },
  fitness: {
    title: 'Fitness & Gym Booking Platform',
    client: 'FitZone Health & Wellness',
    stack: 'React + Node.js + TailwindCSS',
    budget: '₹1,50,000',
    requirements: 'Class Booking, Trainer Profiles, Membership Plans, Razorpay Payment, Member Dashboard'
  },
  portfolio: {
    title: 'Avinash Tiwari — Full Stack AI Architect Portfolio',
    client: 'Avinash Tiwari (CEO / Founder)',
    stack: 'Next.js 14 + TailwindCSS + Web Speech + Node.js',
    budget: '₹1,20,000',
    requirements: 'Virtual Office OS, NeuralFlow AI Cloud, Headless Store, Crypto Terminal, Live Case Studies, Resume Download, Hire Me Contact'
  }
};

function openAssignProjectModal() {
  const modal = document.getElementById('assignProjectModal');
  if (modal) modal.classList.add('active');
}

function applyProjectPreset(presetKey) {
  const preset = PROJECT_PRESETS[presetKey];
  if (!preset) return;

  document.getElementById('projTitle').value = preset.title;
  document.getElementById('projClient').value = preset.client;
  document.getElementById('projStack').value = preset.stack;
  document.getElementById('projBudget').value = preset.budget;
  document.getElementById('projRequirements').value = preset.requirements;

  showToast(`✅ Preset "${preset.title}" applied!`, 'success');
}

function submitAssignProjectForm(e) {
  e.preventDefault();

  const title = document.getElementById('projTitle').value.trim();
  const client = document.getElementById('projClient').value.trim();
  const stack = document.getElementById('projStack').value;
  const budget = document.getElementById('projBudget').value.trim();
  const requirements = document.getElementById('projRequirements').value.trim();

  if (!title || !client) {
    showToast('Please enter Project Title and Client Name', 'error');
    return;
  }

  const newProject = {
    id: `PROJ-${Date.now().toString().slice(-4)}`,
    title,
    client,
    stack,
    budget,
    requirements,
    phases: [
      { name: '🎨 UI/UX Wireframes (Kavya)', status: 'in-progress' },
      { name: '⚛️ Frontend Component Build (Neha)', status: 'pending' },
      { name: '🔧 Backend API Design (Rohan)', status: 'pending' },
      { name: '🔐 Auth & Security Layer', status: 'pending' },
      { name: '🧪 QA Testing Suite (Arjun)', status: 'pending' },
      { name: '🚀 Staging Deployment', status: 'pending' }
    ],
    color: '#06b6d4',
    progress: 15,
    previewType: title.toLowerCase().includes('commerce') || title.toLowerCase().includes('store') ? 'ecommerce' : 'custom'
  };

  activeProjects.unshift(newProject);
  persistProjectsToStorage();
  closeModal('assignProjectModal');

  // Reset form
  document.getElementById('assignProjectForm').reset();

  // Render & switch to tab
  renderProjectTracker(newProject.id);

  // Activate Live Projects tab
  document.querySelectorAll('.view-tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('projectTrackerTab');
  if (tab) tab.style.display = 'block';
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(t => { if (t.textContent.includes('Live Projects')) t.classList.add('active'); });

  const hostUrl = `http://localhost:8000/project_preview.html?id=${newProject.id}`;
  addAgentLogMessage('Avinash (Owner / CEO)', `🚀 NEW PROJECT LAUNCHED: "${title}" for ${client} | Live URL: ${hostUrl}`, '#06b6d4');
  showToast(`🎉 Project launched! Live at ${hostUrl}`, 'success');

  if (typeof auraSpeak === 'function') {
    auraSpeak(`Boss Avinash ne naya project assign kiya hai: ${title}. Live hosting link generate ho gaya hai. Neha aur Rohan ne development shuru kar di hai!`, AGENT_HIERARCHY['head_manager']);
  }

  // Simulate progressive sprint automation
  simulateSprintProgress(newProject.id);
}

function simulateSprintProgress(projectId) {
  const proj = activeProjects.find(p => p.id === projectId);
  if (!proj) return;

  proj.phases.forEach((phase, idx) => {
    if (phase.status === 'pending') {
      setTimeout(() => {
        phase.status = idx === 1 ? 'in-progress' : (idx < 1 ? 'completed' : phase.status);
        proj.progress = Math.min(95, proj.progress + 12);
        persistProjectsToStorage();
        renderProjectTracker(projectId);
      }, idx * 4000);
    }
  });
}

function renderProjectTracker(activeProjectId = null) {
  const container = document.getElementById('activeProjectsListContainer');
  if (!container) return;

  container.innerHTML = activeProjects.map(proj => {
    const completedPhases = proj.phases.filter(p => p.status === 'completed').length;
    const isActive = !activeProjectId || proj.id === activeProjectId;
    const previewUrl = `project_preview.html?id=${proj.id}`;

    return `
      <div class="project-card ${isActive ? 'active-project' : ''}" onclick="selectActiveProject('${proj.id}')">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem;">
          <div>
            <div style="font-size: 0.92rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.15rem;">${proj.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">👤 ${proj.client} • ${proj.budget}</div>
          </div>
          <span style="font-size: 0.7rem; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.3); color: #38bdf8; padding: 0.15rem 0.5rem; border-radius: 20px; white-space: nowrap; margin-left: 0.5rem;">${proj.stack.split(' ')[0]}</span>
        </div>

        <div style="background: rgba(0,0,0,0.3); border-radius: 20px; height: 6px; margin-bottom: 0.55rem; overflow: hidden;">
          <div style="height: 100%; width: ${proj.progress}%; background: linear-gradient(90deg, ${proj.color || '#6366f1'}, #38bdf8); border-radius: 20px; transition: width 1s ease;"></div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.72rem; gap: 0.5rem;">
          <span style="color: var(--text-muted);">${completedPhases}/${proj.phases.length} phases • ${proj.progress}% complete</span>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <a href="${previewUrl}" target="_blank" onclick="event.stopPropagation()" style="background: rgba(6,182,212,0.2); border: 1px solid rgba(6,182,212,0.4); color: #38bdf8; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem;">
              🌐 Open Live App 🔗
            </a>
            <button type="button" onclick="event.stopPropagation(); deleteProject('${proj.id}')" title="Delete this Project" style="background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.35); color: #f43f5e; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; font-size: 0.72rem; cursor: pointer;">
              🗑️
            </button>
          </div>
        </div>

        <div class="project-phases-list">
          ${proj.phases.map(phase => `
            <div class="phase-item ${phase.status}">
              <span style="font-size: 1rem;">${phase.status === 'completed' ? '✅' : phase.status === 'in-progress' ? '⚡' : '⬜'}</span>
              <span>${phase.name}</span>
              ${phase.status === 'in-progress' ? '<span style="margin-left: auto; font-size: 0.68rem; color: #38bdf8; font-weight: 700; animation: pulseGlow 2s infinite;">BUILDING...</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Also render the visual output for the first / active project
  const displayProj = activeProjectId ? activeProjects.find(p => p.id === activeProjectId) : activeProjects[0];
  if (displayProj) {
    renderLiveVisualPreview(displayProj);
  } else {
    const render = document.getElementById('liveVisualPreviewRender');
    if (render) render.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">📭 No active projects. Click "🚀 Assign Project" to launch a new build!</div>`;
  }
}

function deleteProject(projectId) {
  const proj = activeProjects.find(p => p.id === projectId);
  if (!proj) return;

  const confirmDelete = confirm(`Are you sure you want to delete project "${proj.title}"?`);
  if (!confirmDelete) return;

  const deletedTitle = proj.title;
  activeProjects = activeProjects.filter(p => p.id !== projectId);
  persistProjectsToStorage();

  renderProjectTracker();

  addAgentLogMessage('Avinash (Owner / CEO)', `🗑️ PROJECT DELETED: "${deletedTitle}" was deleted from active sprint board.`, '#f43f5e');
  showToast(`🗑️ Project "${deletedTitle}" deleted successfully!`, 'info');

  if (typeof auraSpeak === 'function') {
    auraSpeak(`Project "${deletedTitle}" ko delete kar diya gaya hai Boss!`, AGENT_HIERARCHY['head_manager']);
  }
}

function selectActiveProject(projectId) {
  renderProjectTracker(projectId);
}

function renderLiveVisualPreview(proj) {
  const render = document.getElementById('liveVisualPreviewRender');
  const codeInspector = document.getElementById('liveGeneratedCodeInspector');
  const addressBar = document.getElementById('livePreviewAddressBar');
  const techBadge = document.getElementById('activeProjectTechBadge');

  const previewUrl = `project_preview.html?id=${proj.id}`;

  if (addressBar) {
    addressBar.innerHTML = `<a href="${previewUrl}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 700;">http://localhost:8000/${previewUrl} 🔗 (Click to Open Fullscreen)</a>`;
  }
  if (techBadge) techBadge.textContent = proj.stack;

  // Generate representative live preview HTML
  if (render) {
    render.innerHTML = getLivePreviewHTML(proj);
  }

  // Generate representative live code snippet
  if (codeInspector) {
    codeInspector.textContent = getLiveCodeSnippet(proj);
  }
}

function getLivePreviewHTML(proj) {
  const colorMap = { '#6366f1': '#6366f1', '#10b981': '#10b981', '#06b6d4': '#06b6d4', '#a855f7': '#a855f7' };
  const col = colorMap[proj.color] || '#6366f1';
  const previewUrl = `project_preview.html?id=${proj.id}`;
  const text = `${proj.title} ${proj.requirements || ''}`.toLowerCase();

  // 0. Developer / Designer Portfolio
  if (text.includes('portfolio') || text.includes('resume') || text.includes('cv') || text.includes('personal') || text.includes('bio') || text.includes('developer site') || text.includes('profile')) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #38bdf8); display: flex; align-items: center; justify-content: center; font-size: 1rem;">👨‍💻</div>
            <div>
              <div style="font-weight: 800; font-size: 0.95rem; color: #38bdf8;">${proj.client} — Portfolio</div>
              <div style="font-size: 0.68rem; color: #34d399;">🟢 Available for Hire</div>
            </div>
          </div>
          <a href="${previewUrl}" target="_blank" style="background: linear-gradient(135deg, #6366f1, #38bdf8); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-decoration: none;">
            🌐 Open Full Portfolio 🔗
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          ${[
            { title: 'NexusAI Virtual Office OS', price: '⭐ Featured', em: '🏢', spec: 'React + Node.js + Speech API' },
            { title: 'NeuralFlow AI Cloud Platform', price: '🤖 AI/ML', em: '🧠', spec: 'FastAPI + Vector DB + LLM' },
            { title: 'NexGen Headless Store', price: '🛒 Web App', em: '⚡', spec: 'Next.js 14 + Stripe Payments' }
          ].map(p => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 0.7rem; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.35rem;">${p.em}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #e2e8f0;">${p.title}</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">${p.spec}</div>
              <div style="font-size: 0.75rem; color: #38bdf8; font-weight: 800; margin-top: 0.25rem;">${p.price}</div>
              <a href="${previewUrl}" target="_blank" style="display: inline-block; margin-top: 0.45rem; background: rgba(99,102,241,0.25); border: 1px solid rgba(99,102,241,0.5); color: #a5b4fc; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none;">
                View Case Study ↗
              </a>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #a5b4fc;">⚡ 50+ Shipped Apps • Full Stack & Autonomous AI Swarms</div>
          <a href="${previewUrl}" target="_blank" style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-decoration: none;">● LIVE ON LOCALHOST:8000 🔗</a>
        </div>
      </div>
    `;
  }

  // 1. Real Estate / Property
  if (text.includes('real estate') || text.includes('property') || text.includes('housing') || text.includes('villa') || text.includes('apartment')) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #fbbf24;">🏢 ${proj.client} — Luxury Properties</div>
          <a href="${previewUrl}" target="_blank" style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-decoration: none;">
            🚀 Open Full Portal 🔗
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          ${[
            { title: 'The Grand Marina Penthouse', price: '₹2.45 Cr', em: '🏙️', spec: '4 BHK • Sea View' },
            { title: 'Emerald Woods Villa', price: '₹1.85 Cr', em: '🏡', spec: '5 BHK • Garden' },
            { title: 'Skyline Smart Suites', price: '₹85 Lakhs', em: '🏢', spec: '3 BHK • Automated' }
          ].map(p => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 0.7rem; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.35rem;">${p.em}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #e2e8f0;">${p.title}</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">${p.spec}</div>
              <div style="font-size: 0.75rem; color: #fbbf24; font-weight: 800; margin-top: 0.25rem;">${p.price}</div>
              <a href="${previewUrl}" target="_blank" style="display: inline-block; margin-top: 0.45rem; background: linear-gradient(135deg, #fbbf24, #d97706); color: #000; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none;">
                View Tour ↗
              </a>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 12px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #fbbf24;">🏛️ 100% RERA Approved • 0% Brokerage Assistance</div>
          <a href="${previewUrl}" target="_blank" style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-decoration: none;">● LIVE ON LOCALHOST:8000 🔗</a>
        </div>
      </div>
    `;
  }

  // 2. Healthcare / Dental / Clinic
  if (text.includes('dental') || text.includes('clinic') || text.includes('hospital') || text.includes('doctor') || text.includes('medical') || text.includes('health')) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #06b6d4;">🏥 ${proj.client} — Specialized Care</div>
          <a href="${previewUrl}" target="_blank" style="background: #06b6d4; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-decoration: none;">
            📅 Book Appointment 🔗
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          ${[
            { title: 'Invisible Teeth Aligners', price: '₹45,000', em: '🦷', spec: '18 Custom 3D Trays' },
            { title: 'Laser Root Canal + Crown', price: '₹6,500', em: '🔬', spec: 'Single Sitting Laser' },
            { title: 'Full Executive Health Scan', price: '₹3,499', em: '🩺', spec: '84 Comprehensive Tests' }
          ].map(p => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 0.7rem; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.35rem;">${p.em}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #e2e8f0;">${p.title}</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">${p.spec}</div>
              <div style="font-size: 0.75rem; color: #06b6d4; font-weight: 800; margin-top: 0.25rem;">${p.price}</div>
              <a href="${previewUrl}" target="_blank" style="display: inline-block; margin-top: 0.45rem; background: linear-gradient(135deg, #06b6d4, #0284c7); color: white; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none;">
                Book Doctor ↗
              </a>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); border-radius: 12px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #38bdf8;">👨‍⚕️ Top Senior Specialists • Digital Diagnostic Reports</div>
          <a href="${previewUrl}" target="_blank" style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-decoration: none;">● LIVE ON LOCALHOST:8000 🔗</a>
        </div>
      </div>
    `;
  }

  // 3. Restaurant / Food Delivery
  if (text.includes('food') || text.includes('restaurant') || text.includes('cafe') || text.includes('burger') || text.includes('pizza') || text.includes('bakery')) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #f43f5e;">🍔 ${proj.client} — Hot Artisan Kitchen</div>
          <a href="${previewUrl}" target="_blank" style="background: #f43f5e; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-decoration: none;">
            🛵 Order Hot Food 🔗
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          ${[
            { title: 'Truffle Angus Burger', price: '₹389', em: '🍔', spec: 'Brioche • Garlic Aioli' },
            { title: 'Woodfired Burrata Pizza', price: '₹549', em: '🍕', spec: 'San Marzano • Basil' },
            { title: 'Belgian Chocolate Shake', price: '₹249', em: '🥤', spec: 'Hazelnut Gelato Crunch' }
          ].map(p => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 0.7rem; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.35rem;">${p.em}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #e2e8f0;">${p.title}</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">${p.spec}</div>
              <div style="font-size: 0.75rem; color: #f43f5e; font-weight: 800; margin-top: 0.25rem;">${p.price}</div>
              <a href="${previewUrl}" target="_blank" style="display: inline-block; margin-top: 0.45rem; background: linear-gradient(135deg, #f43f5e, #be123c); color: white; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none;">
                Add to Meal ↗
              </a>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.3); border-radius: 12px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #fb7185;">🛵 30-Min Express Dispatch • 100% Farm Fresh Ingredients</div>
          <a href="${previewUrl}" target="_blank" style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-decoration: none;">● LIVE ON LOCALHOST:8000 🔗</a>
        </div>
      </div>
    `;
  }

  // 4. Fitness / Gym
  if (text.includes('gym') || text.includes('fitness') || text.includes('workout') || text.includes('yoga') || text.includes('trainer')) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #10b981;">💪 ${proj.client} — Elite Fitness Club</div>
          <a href="${previewUrl}" target="_blank" style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-decoration: none;">
            🏋️ View Passes 🔗
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          ${[
            { title: '1-Year VIP All-Access Pass', price: '₹18,999/yr', em: '🏆', spec: 'Gym + Pool + Sauna' },
            { title: 'Personal Coach Package', price: '₹12,500/3mo', em: '🥊', spec: '1-on-1 Body Shred' },
            { title: 'HydroWhey Isolate (2kg)', price: '₹4,299', em: '🥤', spec: '30g Pure Protein' }
          ].map(p => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 0.7rem; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.35rem;">${p.em}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #e2e8f0;">${p.title}</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">${p.spec}</div>
              <div style="font-size: 0.75rem; color: #10b981; font-weight: 800; margin-top: 0.25rem;">${p.price}</div>
              <a href="${previewUrl}" target="_blank" style="display: inline-block; margin-top: 0.45rem; background: linear-gradient(135deg, #10b981, #059669); color: white; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none;">
                Join Club ↗
              </a>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #34d399;">⚡ Olympic Equipment • Biometric Tracking • Steam Bath</div>
          <a href="${previewUrl}" target="_blank" style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-decoration: none;">● LIVE ON LOCALHOST:8000 🔗</a>
        </div>
      </div>
    `;
  }

  // 5. Default / E-Commerce Store
  return `
    <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;">
        <div style="font-weight: 800; font-size: 1.1rem; background: linear-gradient(135deg, ${col}, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🛒 ${proj.client}</div>
        <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; align-items: center;">
          <span style="background: rgba(255,255,255,0.06); padding: 0.2rem 0.6rem; border-radius: 20px;">Catalog</span>
          <a href="${previewUrl}" target="_blank" style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; text-decoration: none;">
            🚀 Open Full Web App 🔗
          </a>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
        ${['👟 Nike Air Max Pulse', '🎽 AeroSwift Vest', '⌚ Apex Smart Watch'].map((item, i) => `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 0.7rem; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.35rem;">${item.split(' ')[0]}</div>
            <div style="font-size: 0.72rem; font-weight: 600; color: #e2e8f0; margin-bottom: 0.25rem;">${item.slice(3)}</div>
            <div style="font-size: 0.7rem; color: #34d399; font-weight: 700;">₹${(1499 + i * 500).toLocaleString()}</div>
            <a href="${previewUrl}" target="_blank" style="display: inline-block; margin-top: 0.45rem; background: linear-gradient(135deg, ${col}, #4f46e5); color: white; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none;">
              Buy on Live Site ↗
            </a>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 1rem; background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(56,189,248,0.1)); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: #a5b4fc;">🎨 Built by Kavya (Designer) + Neha (Frontend) + Rohan (Backend)</div>
        <a href="${previewUrl}" target="_blank" style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-decoration: none;">● LIVE ON LOCALHOST:8000 🔗</a>
      </div>
    </div>
  `;
}

function getLiveCodeSnippet(proj) {
  const isReact = proj.stack.toLowerCase().includes('react') || proj.stack.toLowerCase().includes('next');
  const isFlutter = proj.stack.toLowerCase().includes('flutter');

  if (isFlutter) {
    return `// 📱 ${proj.title} — Flutter Generated Code
// Client: ${proj.client} | ${proj.stack}

class PortfolioDashboard extends StatefulWidget {
  @override
  _PortfolioDashboardState createState() => _PortfolioDashboardState();
}

class _PortfolioDashboardState extends State<PortfolioDashboard> {
  final double totalPortfolio = 842350.00;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF070A12),
      body: Column(
        children: [
          PortfolioCard(amount: totalPortfolio),
          AssetBreakdownGrid(),
          AIInsightsButton(),
        ],
      ),
    );
  }
}`;
  }

  return `// ⚛️ ${proj.title} — React Component (Generated by Neha Kapoor)
// Client: ${proj.client} | ${proj.stack}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </motion.div>
  );
}`;
}

// Render on page load (projectTrackerTab only renders when switched)
document.addEventListener('DOMContentLoaded', () => {
  renderProjectTracker();
});
