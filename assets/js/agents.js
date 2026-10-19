/**
 * NexusAI - Multi-Agent Hierarchy & Employee Database Engine
 */

const AGENT_HIERARCHY = {
  owner: {
    id: "agent-owner",
    name: "Avinash (Owner / CEO)",
    title: "Company Owner",
    avatar: "👤",
    role: "executive",
    dept: "Executive Suite",
    gender: "male",
    reportsTo: null
  },
  head_manager: {
    id: "agent-hm",
    name: "Aura Sharma (Head Manager AI)",
    title: "Chief Operating Officer",
    avatar: "🤖",
    role: "head_manager",
    gender: "female",
    status: "Active Orchestrating",
    progress: 88,
    currentTask: "Orchestrating 4 projects & evaluating Lead Gen pipeline",
    reportsTo: "Avinash (Owner / CEO)",
    color: "#6366f1"
  },

  // Department Managers
  pm_manager: {
    id: "agent-pm",
    name: "Aarav Verma (Project Manager AI)",
    title: "VP of Product & Engineering",
    avatar: "👨‍💻",
    role: "manager",
    dept: "Project Bay",
    gender: "male",
    status: "Managing Sprints",
    progress: 75,
    currentTask: "E-Commerce portal UI & API sprint review",
    reportsTo: "Aura Sharma (Head Manager AI)",
    subordinates: ["dev_lead", "dev_frontend", "qa_lead", "designer_lead"],
    color: "#06b6d4"
  },
  sales_manager: {
    id: "agent-sm",
    name: "Priya Sharma (Sales Manager AI)",
    title: "VP of Global Sales",
    avatar: "💼",
    role: "manager",
    dept: "Sales Hub",
    gender: "female",
    status: "Closing Enterprise Deals",
    progress: 82,
    currentTask: "Qualified 14 B2B leads from Sales Lead Gen 1",
    reportsTo: "Aura Sharma (Head Manager AI)",
    subordinates: ["sales_rep1", "sales_rep2", "crm_bot"],
    color: "#10b981"
  },
  marketing_manager: {
    id: "agent-mm",
    name: "Kunal Mehta (Marketing Manager AI)",
    title: "VP of Growth & Marketing",
    avatar: "📢",
    role: "manager",
    dept: "Marketing Studio",
    gender: "male",
    status: "Campaign Launch",
    progress: 90,
    currentTask: "Google Ads campaign optimizing at ₹1.2L pipeline",
    reportsTo: "Aura Sharma (Head Manager AI)",
    subordinates: ["social_media", "ads_specialist", "content_lead"],
    color: "#a855f7"
  },

  // Project Bay Sub-Team
  dev_lead: {
    id: "agent-dev1",
    name: "Rohan Gupta (Backend Architect AI)",
    title: "Senior Node.js Developer",
    avatar: "💻",
    role: "employee",
    dept: "Project Bay",
    gender: "male",
    status: "Writing APIs",
    progress: 85,
    currentTask: "RESTful Authentication & Payment Gateway Microservice",
    reportsTo: "Aarav Verma (PM)",
    color: "#38bdf8"
  },
  dev_frontend: {
    id: "agent-dev2",
    name: "Neha Kapoor (Frontend Engineer AI)",
    title: "React & Next.js Specialist",
    avatar: "🖥️",
    role: "employee",
    dept: "Project Bay",
    gender: "female",
    status: "Building Components",
    progress: 70,
    currentTask: "Cart & Checkout Glassmorphic Layout",
    reportsTo: "Aarav Verma (PM)",
    color: "#38bdf8"
  },
  qa_lead: {
    id: "agent-qa",
    name: "Arjun Kumar (QA Specialist AI)",
    title: "Automation Testing Engineer",
    avatar: "🧪",
    role: "employee",
    dept: "Project Bay",
    gender: "male",
    status: "Running Test Suites",
    progress: 60,
    currentTask: "End-to-End Cypress Integration & Load Testing",
    reportsTo: "Aarav Verma (PM)",
    color: "#f43f5e"
  },
  designer_lead: {
    id: "agent-des",
    name: "Kavya Sharma (UI/UX Designer AI)",
    title: "Lead Visual Designer",
    avatar: "🎨",
    role: "employee",
    dept: "Project Bay",
    gender: "female",
    status: "Design Specs",
    progress: 95,
    currentTask: "Figma Design Tokens & Dashboard Wireframes",
    reportsTo: "Aarav Verma (PM)",
    color: "#fbbf24"
  },

  // Sales Hub Sub-Team
  sales_rep1: {
    id: "agent-sr1",
    name: "Aditya Joshi (Outreach Rep AI)",
    title: "Enterprise SDR",
    avatar: "📞",
    role: "employee",
    dept: "Sales Hub",
    gender: "male",
    status: "Follow-ups",
    progress: 78,
    currentTask: "Sent 45 proposal emails for SaaS deals",
    reportsTo: "Priya Sharma (Sales Mgr)",
    color: "#34d399"
  },
  sales_rep2: {
    id: "agent-sr2",
    name: "Ananya Singh (Account Exec AI)",
    title: "Deal Closer",
    avatar: "🤝",
    role: "employee",
    dept: "Sales Hub",
    gender: "female",
    status: "Negotiating Quotes",
    progress: 88,
    currentTask: "Preparing ₹2.5L proposal for FinTech client",
    reportsTo: "Priya Sharma (Sales Mgr)",
    color: "#34d399"
  },

  // Marketing Studio Sub-Team
  social_media: {
    id: "agent-sm1",
    name: "Divya Roy (Social Media Mgr AI)",
    title: "Brand Engagement Lead",
    avatar: "📱",
    role: "employee",
    dept: "Marketing Studio",
    gender: "female",
    status: "Publishing Posts",
    progress: 92,
    currentTask: "LinkedIn & Instagram growth campaign live",
    reportsTo: "Kunal Mehta (Marketing Mgr)",
    color: "#c084fc"
  },
  ads_specialist: {
    id: "agent-ads",
    name: "Aditya Malhotra (Ads Manager AI)",
    title: "PPC & Meta Ads Lead",
    avatar: "🎯",
    role: "employee",
    dept: "Marketing Studio",
    gender: "male",
    status: "Optimizing ROI",
    progress: 84,
    currentTask: "Scaling Meta Ads CTR to 4.2%",
    reportsTo: "Kunal Mehta (Marketing Mgr)",
    color: "#c084fc"
  },

  // 4 Independent Lead Generators
  lead_gen1: {
    id: "agent-lg1",
    name: "Sales Lead Gen 1 (B2B Hunter)",
    title: "Corporate B2B Scraper",
    avatar: "🔍",
    role: "lead_gen",
    dept: "Lead Gen Center",
    status: "Scanning LinkedIn/Crunchbase",
    progress: 94,
    currentTask: "Identified 48 high-budget enterprise leads",
    reportsTo: "Priya Sharma (Sales Mgr)"
  },
  lead_gen2: {
    id: "agent-lg2",
    name: "Sales Lead Gen 2 (SME Radar)",
    title: "E-Commerce & Retail Finder",
    avatar: "📡",
    role: "lead_gen",
    dept: "Lead Gen Center",
    status: "Scraping Shopify/WooCommerce Stores",
    progress: 88,
    currentTask: "Extracted 62 e-commerce store leads",
    reportsTo: "Priya Sharma (Sales Mgr)"
  },
  project_gen1: {
    id: "agent-pg1",
    name: "Project Lead Gen 1 (Tech Finder)",
    title: "Web/App RFP Hunter",
    avatar: "🚀",
    role: "lead_gen",
    dept: "Lead Gen Center",
    status: "Scanning Freelance/Upwork/GitHub RFPs",
    progress: 91,
    currentTask: "Discovered ₹1.8L React+Node SaaS build project",
    reportsTo: "Aarav Verma (PM)"
  },
  project_gen2: {
    id: "agent-pg2",
    name: "Project Lead Gen 2 (AI Automation)",
    title: "AI & Custom Software Finder",
    avatar: "🤖",
    role: "lead_gen",
    dept: "Lead Gen Center",
    status: "Analyzing Tech Stack Demands",
    progress: 86,
    currentTask: "Scraped 19 AI Chatbot & Automation requirements",
    reportsTo: "Aarav Verma (PM)"
  }
};

// Global Stream Messages Log
let agentStreamLogs = [
  {
    sender: "Aura Sharma (Head Manager AI)",
    msg: "System initialized. All 14 AI employees online across Project, Sales, Marketing, and 4 Lead Generation units.",
    time: "10:00 AM",
    color: "#6366f1"
  },
  {
    sender: "Sales Lead Gen 1",
    msg: "Found 12 qualified B2B enterprise leads in FinTech sector. Pushing to Sales Manager Priya Sharma.",
    time: "10:02 AM",
    color: "#10b981"
  },
  {
    sender: "Priya Sharma (Sales Mgr)",
    msg: "Received 12 leads from Sales Lead Gen 1. Assigned Ananya Singh for proposal creation.",
    time: "10:04 AM",
    color: "#10b981"
  },
  {
    sender: "Aarav Verma (PM)",
    msg: "Project Lead Gen 1 sent new E-Commerce requirement (Budget ₹80,000). Sprint milestone scheduled.",
    time: "10:05 AM",
    color: "#06b6d4"
  }
];

function addAgentLogMessage(sender, msg, color = "#6366f1") {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const logItem = { sender, msg, time, color };
  agentStreamLogs.unshift(logItem);
  renderStreamLogs();
}

function renderStreamLogs() {
  const listContainer = document.getElementById('agentStreamLogs');
  if (!listContainer) return;

  listContainer.innerHTML = agentStreamLogs.slice(0, 25).map(log => `
    <div class="log-item" style="border-left-color: ${log.color || '#6366f1'};">
      <div class="log-sender" style="color: ${log.color || '#818cf8'};">
        <span>🤖</span> ${log.sender}
      </div>
      <div class="log-msg">${log.msg}</div>
      <div class="log-time">${log.time}</div>
    </div>
  `).join('');
}

// Active Custom Task Execution Timers Map
const activeTaskTimers = {};

function cleanTaskInstruction(text, agentName = '') {
  if (!text) return 'Executing Assigned Directive';
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^["']|["']$/g, '');
  if (agentName) {
    const fn = agentName.split(' ')[0];
    const regex = new RegExp(`^(hey|hello|hi|namaste)?\\s*(${fn}|${agentName})\\s*[,:\\-–]?\\s*`, 'i');
    cleaned = cleaned.replace(regex, '');
  }
  cleaned = cleaned.replace(/^(please|kripya|bhai|sir|boss|aap|tum|ko bolo ki|ko bolo|is|iss|ek|yeh|ye)\s+/i, '');
  return cleaned.trim() || text.trim();
}

/**
 * Assigns a real dynamic task to an employee and triggers real-time progress updates across the UI
 */
function assignTaskToAgent(agentKeyOrId, rawTaskText, origin = 'command') {
  let foundKey = agentKeyOrId;
  let agent = null;
  for (const k in AGENT_HIERARCHY) {
    if (k === agentKeyOrId || AGENT_HIERARCHY[k].id === agentKeyOrId) {
      foundKey = k;
      agent = AGENT_HIERARCHY[k];
      break;
    }
  }

  if (!agent) return null;

  const cleanTask = cleanTaskInstruction(rawTaskText, agent.name);
  const shortActivity = cleanTask.length > 22 ? cleanTask.slice(0, 20) + '...' : cleanTask;

  // Clear any existing active execution timer for this agent
  if (activeTaskTimers[foundKey]) {
    clearTimeout(activeTaskTimers[foundKey]);
    delete activeTaskTimers[foundKey];
  }

  // Update Agent Live State
  agent.currentTask = cleanTask;
  agent.activity = `⚡ ${shortActivity}`;
  agent.progress = 20;
  agent.customTask = {
    task: cleanTask,
    startTime: Date.now(),
    inProgress: true
  };

  // Re-render UI Floor & Open Modal immediately
  if (typeof renderOfficeFloor === 'function') {
    renderOfficeFloor();
  }
  if (typeof refreshOpenEmployeeModalData === 'function') {
    refreshOpenEmployeeModalData(foundKey);
  }

  // Initial Log
  addAgentLogMessage(
    agent.name,
    `🚀 [TASK ACCEPTED]: "${cleanTask}" — Execution started by ${agent.name}. Priority: HIGH.`,
    agent.color || "#6366f1"
  );

  // Multi-stage autonomous progress updates
  // Stage 1 (3.5s): 55%
  activeTaskTimers[foundKey] = setTimeout(() => {
    if (typeof isAiPaused !== 'undefined' && isAiPaused) return;
    agent.progress = 55;
    agent.activity = `🔨 Working: ${shortActivity}`;
    if (typeof renderOfficeFloor === 'function') renderOfficeFloor();
    if (typeof refreshOpenEmployeeModalData === 'function') refreshOpenEmployeeModalData(foundKey);

    addAgentLogMessage(
      agent.name,
      `⚙️ [IN PROGRESS (55%)]: ${agent.name} is executing "${cleanTask}" — Core logic implemented.`,
      agent.color || "#6366f1"
    );

    // Stage 2 (7.5s): 85%
    activeTaskTimers[foundKey] = setTimeout(() => {
      if (typeof isAiPaused !== 'undefined' && isAiPaused) return;
      agent.progress = 85;
      agent.activity = `🔍 Testing: ${shortActivity}`;
      if (typeof renderOfficeFloor === 'function') renderOfficeFloor();
      if (typeof refreshOpenEmployeeModalData === 'function') refreshOpenEmployeeModalData(foundKey);

      addAgentLogMessage(
        agent.name,
        `⚡ [VALIDATING (85%)]: ${agent.name} running tests on "${cleanTask}". Almost ready!`,
        agent.color || "#6366f1"
      );

      // Stage 3 (11.5s): 100% Completed
      activeTaskTimers[foundKey] = setTimeout(() => {
        if (typeof isAiPaused !== 'undefined' && isAiPaused) return;
        agent.progress = 100;
        agent.activity = `✅ Done: ${shortActivity}`;
        if (typeof renderOfficeFloor === 'function') renderOfficeFloor();
        if (typeof refreshOpenEmployeeModalData === 'function') refreshOpenEmployeeModalData(foundKey);

        addAgentLogMessage(
          agent.name,
          `🎉 [TASK COMPLETED]: ${agent.name} has successfully delivered "${cleanTask}"! ✅`,
          "#10b981"
        );

        if (typeof showToast === 'function') {
          showToast(`✅ ${agent.name.split(' ')[0]} delivered: "${cleanTask}"!`, "success");
        }

        if (agent.customTask) {
          agent.customTask.inProgress = false;
        }

        delete activeTaskTimers[foundKey];
      }, 4000);

    }, 4000);

  }, 3500);

  return { agent, cleanTask, key: foundKey };
}

function isTaskDirective(query) {
  const q = (query || '').toLowerCase().trim();
  const taskPatterns = [
    /karo|kare|karna|kardo|kariye|kijiye/,
    /banao|bana do|banae|create|build|develop/,
    /fix|theek karo|sudharo|resolve|patch/,
    /add|jodo|daal do|dalo|lagao|implement|integrate/,
    /change|badlo|modify|update|redesign/,
    /test|check|audit|inspect|verify|run/,
    /call|outreach|close|sell|deal|pitch/,
    /design|wireframe|figma|prototype/,
    /delete|hatao|remove|clean/,
    /optimize|speed up|fast karo|scale/,
    /write|likho|draft|publish|post/
  ];

  return taskPatterns.some(p => p.test(q));
}

/**
 * Generates an authentic Hinglish / English live response for any employee agent
 */
function generateHinglishAgentResponse(agent, userQuery) {
  const query = (userQuery || '').toLowerCase();
  const name = agent.name.split(' ')[0];
  const role = agent.role;

  // 1. Check if user is assigning a real task/instruction
  if (isTaskDirective(query)) {
    const assigned = assignTaskToAgent(agent.id, userQuery, 'chat');
    const taskName = assigned ? assigned.cleanTask : userQuery;
    const isHindi = /[\u0900-\u097F]|karo|banao|hai|hoon|kare|ji|sir|karna/.test(query);

    if (isHindi) {
      return `Ji Boss! Main abhi <strong>"${taskName}"</strong> par kaam shuru kar raha hoon. Task priority HIGH set ho chuki hai (${agent.progress}% complete). Main step-by-step update deta rahunga!`;
    } else {
      return `Understood Boss! I am now executing <strong>"${taskName}"</strong> right away. Priority is set to HIGH (${agent.progress}%). I will keep you posted with live updates!`;
    }
  }

  const currentTask = agent.currentTask || 'Executing directives';
  const progress = agent.progress || 80;

  const isProjectQuery = /project|dikhao|show|kya bana|kya chal|kaam|deliverable|update|status|progress|report|current|abhi|latest|kya hai|batao|describe|detail/.test(query);
  const isTargetQuery  = /sales|target|revenue|money|lead|lakh|deal|paise/.test(query);

  // ── 1. Rohan Gupta — Backend Architect
  if (agent.id === 'dev_lead' || name.toLowerCase() === 'rohan') {
    if (isProjectQuery) {
      return `Sir, main Rohan Gupta, Backend Architect. Abhi <strong>"${currentTask}"</strong> par kaam chal raha hai — ${progress}% complete. Status: ${agent.activity || 'Active'}.<br>👉 Live App Link: <a href="project_preview.html?id=PROJ-001" target="_blank" style="color: #38bdf8; text-decoration: underline; font-weight: 700;">http://localhost:8000/project_preview.html?id=PROJ-001 🔗</a>`;
    }
    return `Sir, main Rohan Gupta, Backend Architect. Mera current task: "<strong>${currentTask}</strong>" — ${progress}% complete chal raha hai!`;
  }

  // ── 2. Priya Sharma — VP Sales
  if (agent.id === 'sales_manager' || name.toLowerCase() === 'priya') {
    if (isProjectQuery) {
      return `Namaste Boss! Main Priya Sharma, Sales Manager. Abhi <strong>"${currentTask}"</strong> par actively kaam kar rahi hun (${progress}% done). Revenue this quarter: ₹12.4 Lakhs closed!`;
    }
    return `Namaste Boss! Main Priya Sharma. Current task: "<strong>${currentTask}</strong>" — ${progress}% progress par hai!`;
  }

  // ── 3. Aarav Verma — Project Manager
  if (agent.id === 'pm_manager' || name.toLowerCase() === 'aarav') {
    if (isProjectQuery) {
      return `Hello Boss! Main Aarav Verma, PM. Current task: "<strong>${currentTask}</strong>" (${progress}% done).<br>🔵 <strong>E-Commerce Portal</strong> ➔ <a href="project_preview.html?id=PROJ-001" target="_blank" style="color: #38bdf8; text-decoration: underline; font-weight: 700;">http://localhost:8000/project_preview.html?id=PROJ-001 🔗</a>`;
    }
    return `Hello Boss! Main Aarav Verma, PM. Current deliverable: "<strong>${currentTask}</strong>" — ${progress}% complete!`;
  }

  // ── 4. Neha Kapoor — Frontend Engineer
  if (agent.id === 'dev_frontend' || name.toLowerCase() === 'neha') {
    if (isProjectQuery) {
      return `Ji Sir! Main Neha Kapoor, Frontend Engineer. Abhi <strong>"${currentTask}"</strong> par kaam chal raha hai (${progress}% complete).<br>👉 Live App Link: <a href="project_preview.html?id=PROJ-001" target="_blank" style="color: #38bdf8; text-decoration: underline; font-weight: 700;">http://localhost:8000/project_preview.html?id=PROJ-001 🔗</a>`;
    }
    return `Ji Sir! Main Neha Kapoor, Frontend Engineer. Current task: "<strong>${currentTask}</strong>" — ${progress}% done!`;
  }

  // ── 5. Kavya Sharma — UI/UX Designer
  if (agent.id === 'designer_lead' || name.toLowerCase() === 'kavya') {
    return `Hello Boss! Main Kavya Sharma, Designer. Current deliverable: "<strong>${currentTask}</strong>" — ${progress}% complete!`;
  }

  // ── 6. Kunal Mehta — Marketing Manager
  if (agent.id === 'marketing_manager' || name.toLowerCase() === 'kunal') {
    return `Hey Boss! Main Kunal Mehta, Marketing. Current focus: "<strong>${currentTask}</strong>" (${progress}% done). ROAS 4.2x chal raha hai!`;
  }

  // ── 7. Ananya Singh — Account Executive
  if (agent.id === 'sales_rep2' || name.toLowerCase() === 'ananya') {
    return `Boss, main Ananya Singh. Current task: "<strong>${currentTask}</strong>" — ${progress}% complete hai!`;
  }

  // ── 8. Arjun Kumar — QA Specialist
  if (agent.id === 'qa_lead' || name.toLowerCase() === 'arjun') {
    return `Sir, main Arjun Kumar, QA. Current deliverable: "<strong>${currentTask}</strong>" (${progress}% complete, test suites active).`;
  }

  // ── 9. Divya Roy — Social Media Manager
  if (agent.id === 'social_media' || name.toLowerCase() === 'divya') {
    return `Boss, main Divya Roy, Social Media. Current task: "<strong>${currentTask}</strong>" — ${progress}% progress!`;
  }

  // ── 10. Aditya Joshi — Sales SDR
  if (agent.id === 'sales_rep1' || name.toLowerCase() === 'aditya') {
    return `Sir, main Aditya Joshi, SDR. Current task: "<strong>${currentTask}</strong>" — ${progress}% done!`;
  }

  // ── 11. Head Manager Aura Sharma
  if (role === 'head_manager' || name.toLowerCase() === 'aura') {
    if (isProjectQuery) {
      return `Boss Avinash! Main Aura Sharma, Head Manager. Abhi company me active task: "<strong>${currentTask}</strong>". System efficiency 96.4% hai!`;
    }
    if (isTargetQuery) {
      return `Boss Avinash, total revenue ₹12.4 Lakhs closed hai aur Lead Gen pipeline me 846 leads scanned hain.`;
    }
    return `Ji Boss! Main Aura Sharma, Head Manager AI. Current task: "<strong>${currentTask}</strong>" (${progress}%). Sabhi departments actively synchronize ho rahe hain!`;
  }

  // Generic fallback
  return `Sir, main ${agent.name} (${agent.title}). Current task: "<strong>${currentTask}</strong>" — ${progress}% done. Status: ${agent.activity || 'Working'}!`;
}

/**
 * Find exact agent by Name or Title/Post matching
 */
function findAgentByNameOrPost(queryText) {
  if (!queryText) return null;
  const q = queryText.toLowerCase().trim();

  // 1. Direct Name check against all agents
  for (const key in AGENT_HIERARCHY) {
    if (key === 'owner') continue;
    const agent = AGENT_HIERARCHY[key];
    const nameLower = (agent.name || '').toLowerCase();
    const firstName = nameLower.split(' ')[0]; // e.g. 'rohan', 'priya', 'aarav', 'kunal', 'neha', 'aura'
    
    if (q.includes(firstName) || q.includes(nameLower)) {
      return { key, agent };
    }
  }

  // 2. Title / Post / Specialization check
  if (q.includes('backend') || q.includes('architect') || q.includes('node') || q.includes('database') || q.includes('mongo') || q.includes('sql') || q.includes('api')) {
    return { key: 'dev_lead', agent: AGENT_HIERARCHY['dev_lead'] };
  }
  if (q.includes('frontend') || q.includes('react') || q.includes('next.js') || q.includes('ui developer') || q.includes('button') || q.includes('navbar') || q.includes('dark mode')) {
    return { key: 'dev_frontend', agent: AGENT_HIERARCHY['dev_frontend'] };
  }
  if (q.includes('project manager') || q.includes('pm') || q.includes('sprint leader') || q.includes('timeline')) {
    return { key: 'pm_manager', agent: AGENT_HIERARCHY['pm_manager'] };
  }
  if (q.includes('sales manager') || q.includes('sales lead') || q.includes('vp sales') || q.includes('deals') || q.includes('revenue')) {
    return { key: 'sales_manager', agent: AGENT_HIERARCHY['sales_manager'] };
  }
  if (q.includes('marketing manager') || q.includes('marketing lead') || q.includes('growth') || q.includes('ads') || q.includes('campaign')) {
    return { key: 'marketing_manager', agent: AGENT_HIERARCHY['marketing_manager'] };
  }
  if (q.includes('head manager') || q.includes('coo') || q.includes('chief manager') || q.includes('aura')) {
    return { key: 'head_manager', agent: AGENT_HIERARCHY['head_manager'] };
  }
  if (q.includes('qa') || q.includes('testing') || q.includes('quality analyst') || q.includes('bug') || q.includes('test case')) {
    return { key: 'qa_lead', agent: AGENT_HIERARCHY['qa_lead'] };
  }
  if (q.includes('designer') || q.includes('ui/ux') || q.includes('figma') || q.includes('wireframe') || q.includes('mockup')) {
    return { key: 'designer_lead', agent: AGENT_HIERARCHY['designer_lead'] };
  }
  if (q.includes('sdr') || q.includes('outreach') || q.includes('cold call') || q.includes('email')) {
    return { key: 'sales_rep1', agent: AGENT_HIERARCHY['sales_rep1'] };
  }

  // 3. Sub-string match on title/post field
  for (const key in AGENT_HIERARCHY) {
    if (key === 'owner') continue;
    const agent = AGENT_HIERARCHY[key];
    const titleLower = (agent.title || '').toLowerCase();

    if (titleLower && q.includes(titleLower)) {
      return { key, agent };
    }
  }

  return null;
}

/**
 * Detects whether an agent or name is Female or Male
 */
function getAgentGender(agentOrName) {
  if (!agentOrName) return "female";
  
  if (typeof agentOrName === "object") {
    if (agentOrName.gender) return agentOrName.gender;
    agentOrName = agentOrName.name || "";
  }

  const str = String(agentOrName).toLowerCase();
  const femaleNames = [
    "aura", "priya", "neha", "kavya", "ananya", "divya", "simran", "pooja", 
    "riya", "sneha", "shreya", "tanya", "tanvi", "swati", "isha", "sonia",
    "aditi", "kiran", "shruti", "sakshi", "megha", "anjali", "nisha", "radha",
    "female", "woman", "girl", "she", "her", "madam", "miss"
  ];

  for (const fn of femaleNames) {
    if (str.includes(fn)) return "female";
  }

  return "male";
}



