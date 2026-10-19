/**
 * NexusAI - Owner Command Center, Emergency Controls & Multi-Agent Directive Controller
 * Auto-detects Hindi/English and responds in the same language.
 * Aura speaks all responses via Web Speech API (voice.js).
 */

document.addEventListener('DOMContentLoaded', () => {
  initCommandCenter();
});

function initCommandCenter() {
  const form  = document.getElementById('ownerCommandForm');
  const input = document.getElementById('ownerCommandInput');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const prompt = input.value.trim();
      if (!prompt) return;
      processOwnerCommand(prompt);
      input.value = '';
    });
  }

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.innerText.replace(/^"|"$/g, '');
      processOwnerCommand(text);
    });
  });
}

// ─── Language Detection ──────────────────────────────────────────────────────
function detectLang(text) {
  // Devanagari range = Hindi
  return /[\u0900-\u097F]/.test(text) ? 'hi' : 'en';
}

// ─── Emergency AI Controls ───────────────────────────────────────────────────
function toggleEmergencyPause() {
  isAiPaused = !isAiPaused;
  const btn = document.getElementById('pauseAiBtn');

  if (isAiPaused) {
    if (btn) {
      btn.innerHTML = '▶️ RESUME ALL AI';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
    addAgentLogMessage("Avinash (Owner / CEO)", "⚠️ EMERGENCY PAUSE ACTIVATED: All autonomous AI agent activities, movement & external actions FROZEN.", "#f43f5e");
    setAuraLanguage('en');
    auraSpeak("Emergency pause activated. All AI agent operations and employee movement are now frozen. Awaiting your command to resume.");
    showToast("EMERGENCY PAUSE: All AI Agents Frozen", "error");
  } else {
    if (btn) {
      btn.innerHTML = '⏸️ PAUSE ALL AI';
      btn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
    }
    addAgentLogMessage("Avinash (Owner / CEO)", "▶️ AI RESUMED: Company operations and employee movement restarted.", "#10b981");
    setAuraLanguage('en');
    auraSpeak("All systems are now resumed. Company operations and autonomous employee activities are fully restored.");
    showToast("AI Operations Resumed", "success");
  }
}

// ─── Main Command Router ─────────────────────────────────────────────────────
function processOwnerCommand(cmd) {
  if (isAiPaused) {
    showToast("AI System is currently PAUSED. Click RESUME to execute commands.", "error");
    auraSpeak("Main abhi pause mein hun. Kripya pehle AI resume karein.");
    return;
  }

  const lang  = detectLang(cmd);
  setAuraLanguage(lang);   // tell voice engine which language to use

  addAgentLogMessage("Avinash (Owner / CEO)", `"${cmd}"`, "#f8fafc");
  const lower = cmd.toLowerCase();

  // ── Hindi/English keywords
  const isMeetingCmd   = /meeting|मीटिंग|bulao|conference|all hands|sabhi employee|call meeting/.test(lower);
  const isEmployeeCmd  = /rohan|priya|aarav|kunal|aura|employee|agent|se baat|update from|talk to/.test(lower);
  const hindiReport    = /report|रिपोर्ट|कंपनी|status|स्टेटस/.test(lower);
  const hindiProject   = /project|प्रोजेक्ट|website|वेबसाइट|client|क्लाइंट|banao|बनाओ|build|shuru/.test(lower);
  const hindiSales     = /sales|सेल्स|target|टार्गेट|lakh|लाख|revenue|रेवेन्यू/.test(lower);
  const hindiDelay     = /delay|delayed|देरी|रुकावट|bottleneck|blocked|रुका/.test(lower);
  const hindiLeads     = /lead|लीड|hot|गर्म|prospects|prospect/.test(lower);
  const hindiHire      = /hire|recruitment|भर्ती|हायर|employee|एम्प्लॉई|कर्मचारी/.test(lower);

  const isFireCmd      = /fire|terminate|dismiss|sack|हटाओ|निकालो|फायर|बरखास्त|निकाला/.test(lower);

  // Check if a specific employee Name or Post/Title was addressed
  const targeted = typeof findAgentByNameOrPost === 'function' ? findAgentByNameOrPost(cmd) : null;
  const isHireCmd = /hire|recruitment|भर्ती|हायर/.test(lower);

  if (isMeetingCmd) {
    if (typeof launchAllHandsMeeting === 'function') {
      launchAllHandsMeeting();
    }
  } else if (isFireCmd) {
    executeFireWorkflow(cmd, lang, targeted);
    return;
  } else if (targeted && !isHireCmd) {
    // Open THAT employee's view and let ONLY THAT targeted employee talk!
    if (typeof openEmployeeModal === 'function') {
      openEmployeeModal(targeted.key);
    }
    const reply = generateHinglishAgentResponse(targeted.agent, cmd);
    addAgentLogMessage(targeted.agent.name, reply, targeted.agent.color || "#6366f1");
    if (typeof auraSpeak === 'function') {
      auraSpeak(reply, targeted.key || targeted.agent);
    }
    showToast(`Connected to ${targeted.agent.name} (${targeted.agent.title}) 💬`, "success");
    return;
  } else if (hindiHire)         executeHireWorkflow(cmd, lang);
  else if (hindiReport)  executeCompanyReportWorkflow(lang);
  else if (hindiProject) executeNewProjectWorkflow(cmd, lang);
  else if (hindiSales)   executeSalesTargetWorkflow(cmd, lang);
  else if (hindiDelay)   executeDelayAuditWorkflow(lang);
  else if (hindiLeads)   executeHotLeadsWorkflow(lang);
  else                   executeGenericCommandWorkflow(cmd, lang);
}

// ─── Workflow: Fire / Terminate AI Employee ──────────────────────────────────
function executeFireWorkflow(cmd, lang, targeted) {
  if (targeted) {
    if (targeted.key === 'owner' || targeted.agent.role === 'executive' || targeted.key === 'head_manager' || targeted.agent.id === 'agent-hm') {
      const resp = lang === 'hi'
        ? "माफ़ कीजिये सर Avinash! आप CEO या Head Manager Aura Sharma को फायर नहीं कर सकते।"
        : "Security restriction: You cannot terminate CEO Avinash or Head Manager Aura Sharma.";
      addAgentLogMessage("Aura Sharma (Head Manager AI)", `⚠️ ${resp}`, "#f87171");
      if (typeof auraSpeak === 'function') auraSpeak(resp);
      showToast(resp, "error");
      return;
    }

    if (typeof openFireModal === 'function') {
      openFireModal(targeted.key);
    } else if (typeof fireEmployee === 'function') {
      fireEmployee(targeted.key, "Voice/Command Directive");
    }
  } else {
    const resp = lang === 'hi'
      ? "सर, आप किस कर्मचारी को फायर करना चाहते हैं? कृपया नाम बताएं (जैसे: 'Fire Rohan' या 'Neha ko fire kar do')।"
      : "Sir, which employee would you like to terminate? Please specify the name, e.g. 'Fire Rohan' or select their desk.";
    addAgentLogMessage("Aura Sharma (Head Manager AI)", `🤖 ${resp}`, "#f87171");
    if (typeof auraSpeak === 'function') auraSpeak(resp);
    showToast(resp, "info");
  }
}

// ─── Workflow: Hire AI Employee ──────────────────────────────────────────────
function executeHireWorkflow(cmd, lang) {
  const lower = cmd.toLowerCase();

  let presetKey = null;
  if (/mobile|app|flutter|android|ios/.test(lower)) presetKey = 'mobile';
  else if (/cyber|security|audit|hacker|vulnerability/.test(lower)) presetKey = 'cyber';
  else if (/content|copywriter|seo|writer|blogs/.test(lower)) presetKey = 'content';
  else if (/data|analytics|machine learning|bi/.test(lower)) presetKey = 'data';
  else if (/support|customer|chat|ticket/.test(lower)) presetKey = 'support';

  const msgs = {
    en: {
      opening: "Opening NexusAI Recruitment Portal to hire a new AI employee.",
      voice: "Opening recruitment portal Sir. You can select skill presets or customize details to hire your new AI employee."
    },
    hi: {
      opening: "जी सर! मैं नए AI कर्मचारी को भर्ती (Hire) करने का पोर्टल खोल रही हूँ।",
      voice: "जी सर! नया AI एम्प्लॉई हायर करने के लिए पोर्टल खोल दिया गया है। आप कोई भी स्पेशल रोल चुनकर तुरंत टीम में शामिल कर सकते हैं।"
    }
  };

  const m = msgs[lang];
  addAgentLogMessage("Aura Sharma (Head Manager AI)", m.opening, "#10b981");
  auraSpeak(m.voice);

  openHireModal();

  if (presetKey) {
    applyHirePreset(presetKey);
  }
}

// ─── Workflow: Company Report ─────────────────────────────────────────────────
function executeCompanyReportWorkflow(lang) {
  const msgs = {
    en: {
      thinking: "Synthesizing Daily Company Report across all departments. One moment please.",
      report:   "📊 TODAY'S COMPANY REPORT:\n• Closed Revenue: ₹12.4L (Target 85% achieved)\n• Active Projects: 18 (16 on schedule, 2 delayed)\n• Hot Leads Today: 32 (Score 80+)\n• Active AI Employees: 14\n• System Efficiency: 94.8%",
      voice:    "Today's company report. Closed revenue: 12.4 lakh rupaye, 85 percent of target achieved. 18 active projects, 32 hot leads, 14 AI employees running at 94.8 percent efficiency.",
      toast:    "Daily Company Report generated by Aura ✅"
    },
    hi: {
      thinking: "जी सर! मैं सभी विभागों से आज की कंपनी रिपोर्ट तैयार कर रही हूँ। एक पल दीजिए।",
      report:   "📊 आज की कंपनी रिपोर्ट:\n• बंद रेवेन्यू: ₹12.4L (लक्ष्य का 85% हासिल)\n• सक्रिय प्रोजेक्ट्स: 18 (16 समय पर, 2 देरी से)\n• आज के हॉट लीड्स: 32 (स्कोर 80+)\n• सक्रिय AI कर्मचारी: 14\n• सिस्टम दक्षता: 94.8%",
      voice:    "जी सर। आज की रिपोर्ट यह है। बंद रेवेन्यू 12 पॉइंट 4 लाख रुपए है। लक्ष्य का 85 प्रतिशत हासिल हो चुका है। 18 प्रोजेक्ट चल रहे हैं। 32 हॉट लीड्स मिले हैं। और 14 AI कर्मचारी पूरी क्षमता से काम कर रहे हैं।",
      toast:    "Aura ने हिंदी में रिपोर्ट दी ✅"
    }
  };

  const m = msgs[lang];
  setTimeout(() => {
    addAgentLogMessage("Aura (Head Manager AI)", m.thinking, "#6366f1");
    auraSpeak(m.thinking);
  }, 500);
  setTimeout(() => {
    addAgentLogMessage("Aura (Head Manager AI)", m.report, "#6366f1");
    auraSpeak(m.voice);
    showToast(m.toast, "success");
  }, 2200);
}

// ─── Workflow: New Project ────────────────────────────────────────────────────
function executeNewProjectWorkflow(cmd, lang) {
  const msgs = {
    en: {
      dispatch: "Directive received: New project for Client ABC. Dispatching Project Manager Aarav Verma and dev team to Conference Room A.",
      done:     "Client ABC project allocated. Sprint planned — ₹80,000 budget, 20 day timeline. Milestone 1 delivery in 5 days.",
      voice1:   "Understood Sir. I am dispatching Project Manager Aarav Verma and the development team to Conference Room A immediately.",
      voice2:   "Sprint planning complete. Client A B C project has been assigned with a budget of 80 thousand rupees and 20 day timeline.",
      toast:    "Client ABC Project assigned to Project Bay ✅"
    },
    hi: {
      dispatch: "जी सर! मैं प्रोजेक्ट मैनेजर Aarav Verma और डेवलपमेंट टीम को Conference Room A में भेज रही हूँ।",
      done:     "स्प्रिंट प्लानिंग पूरी हुई। Client ABC प्रोजेक्ट शुरू हो गया — बजट ₹80,000, टाइमलाइन 20 दिन। पहला माइलस्टोन 5 दिन में।",
      voice1:   "जी सर। मैं अभी प्रोजेक्ट मैनेजर और टीम को मीटिंग रूम भेज रही हूँ।",
      voice2:   "स्प्रिंट प्लानिंग पूरी हो गई। Client ABC का प्रोजेक्ट 80 हजार रुपए के बजट में 20 दिन के लिए शुरू हो चुका है।",
      toast:    "Client ABC प्रोजेक्ट Project Bay को दिया गया ✅"
    }
  };

  const m = msgs[lang];
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", m.dispatch, "#6366f1");
    auraSpeak(m.voice1);
    moveEmployeeToZone("pm_manager",   "conference_room", "IN_MEETING");
    moveEmployeeToZone("dev_lead",     "conference_room", "IN_MEETING");
    moveEmployeeToZone("dev_frontend", "conference_room", "IN_MEETING");
  }, 800);
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", m.done, "#6366f1");
    auraSpeak(m.voice2);
    moveEmployeeToDesk("pm_manager");
    moveEmployeeToDesk("dev_lead");
    moveEmployeeToDesk("dev_frontend");
    showToast(m.toast, "success");
  }, 5000);
}

// ─── Workflow: Sales Target ───────────────────────────────────────────────────
function executeSalesTargetWorkflow(cmd, lang) {
  const msgs = {
    en: {
      sending:  "Transmitting new Monthly Sales Target to Sales Manager Priya Sharma.",
      accepted: "🎯 Sales Target ₹10L accepted! SDR team re-allocated to close 8 WARM B2B deals.",
      voice1:   "Understood Sir. Transmitting the new monthly sales target of 10 lakh rupees to Priya Sharma now.",
      voice2:   "Sales target confirmed by Priya Sharma. The team is now focused on closing 8 warm B2B deals.",
      toast:    "Monthly Sales Target set ✅"
    },
    hi: {
      sending:  "जी सर! मैं Sales Manager Priya Sharma को नया मासिक बिक्री लक्ष्य भेज रही हूँ।",
      accepted: "🎯 10 लाख का टार्गेट Priya Sharma ने मान लिया! टीम अब 8 B2B डील बंद करने में लगी है।",
      voice1:   "जी सर। मैं Priya Sharma को 10 लाख रुपए का सेल्स टार्गेट अभी भेज रही हूँ।",
      voice2:   "सेल्स टार्गेट Priya Sharma ने स्वीकार कर लिया है। पूरी टीम अब 8 बिज़नेस डील बंद करने में लगी है।",
      toast:    "सेल्स टार्गेट ₹10 लाख सेट हुआ ✅"
    }
  };

  const m = msgs[lang];
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", m.sending, "#6366f1");
    auraSpeak(m.voice1);
  }, 600);
  setTimeout(() => {
    addAgentLogMessage("Priya Sharma (Sales Mgr)", m.accepted, "#10b981");
    auraSpeak(m.voice2);
    showToast(m.toast, "info");
  }, 2200);
}

// ─── Workflow: Delay Audit ────────────────────────────────────────────────────
function executeDelayAuditWorkflow(lang) {
  const msgs = {
    en: {
      auditing: "Running a full deadline & blocker audit with PM Aarav Verma. Please standby.",
      result:   "⚠️ 1 task blocked: TSK-8905 (SaaS Quotation) — awaiting Owner's budget approval. All other 17 projects on track.",
      voice1:   "Running a full delay audit with Project Manager Aarav Verma. Please standby.",
      voice2:   "Audit complete. One task is blocked: Task 8905, SaaS Quotation. It needs your budget approval Sir. All other 17 projects are on schedule.",
      toast:    "1 task awaiting Owner Approval"
    },
    hi: {
      auditing: "जी सर! मैं Project Manager Aarav Verma के साथ पूरी देरी की जाँच कर रही हूँ। एक पल।",
      result:   "⚠️ 1 काम रुका है: TSK-8905 (SaaS Quotation) — Owner की बजट मंजूरी का इंतजार है। बाकी 17 प्रोजेक्ट समय पर हैं।",
      voice1:   "जी सर। मैं PM Aarav Verma के साथ देरी की जाँच कर रही हूँ।",
      voice2:   "जाँच पूरी हुई। एक काम रुका है। Task 8905, SaaS Quotation प्रोजेक्ट को आपकी बजट मंजूरी चाहिए सर। बाकी 17 प्रोजेक्ट समय पर चल रहे हैं।",
      toast:    "1 काम Owner Approval का इंतजार कर रहा है"
    }
  };

  const m = msgs[lang];
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", m.auditing, "#6366f1");
    auraSpeak(m.voice1);
  }, 600);
  setTimeout(() => {
    addAgentLogMessage("Aarav Verma (PM)", m.result, "#f43f5e");
    auraSpeak(m.voice2);
    showToast(m.toast, "info");
  }, 2200);
}

// ─── Workflow: Hot Leads ──────────────────────────────────────────────────────
function executeHotLeadsWorkflow(lang) {
  const msgs = {
    en: {
      fetching: "Fetching HOT Leads (Score 80-100) from 4 Autonomous Lead Generators.",
      leads:    "🔥 HOT LEADS:\n1. Apex Logistics Ltd (Score: 96 | ₹2.5L)\n2. RealEstate Portal (Score: 93 | ₹1.8L)\n3. FinTech Chatbot (Score: 90 | ₹1.2L)",
      voice1:   "Fetching today's hottest leads. One moment.",
      voice2:   "Here are today's top 3 hot leads. Number one: Apex Logistics, score 96, budget 2.5 lakh. Number two: Real Estate Portal, score 93, budget 1.8 lakh. Number three: FinTech Chatbot, score 90, budget 1.2 lakh.",
      toast:    "Fetched 3 HOT Leads ✅"
    },
    hi: {
      fetching: "जी सर! मैं 4 Lead Generator एजेंट्स से आज के HOT Leads निकाल रही हूँ।",
      leads:    "🔥 आज के हॉट लीड्स:\n1. Apex Logistics Ltd (स्कोर: 96 | बजट: ₹2.5L)\n2. RealEstate Portal (स्कोर: 93 | बजट: ₹1.8L)\n3. FinTech Chatbot (स्कोर: 90 | बजट: ₹1.2L)",
      voice1:   "जी सर। मैं आज के सबसे गर्म लीड्स निकाल रही हूँ।",
      voice2:   "सर, आज के टॉप 3 हॉट लीड्स यह हैं। पहला: Apex Logistics, स्कोर 96, बजट 2 लाख 50 हजार। दूसरा: RealEstate Portal, स्कोर 93, बजट 1 लाख 80 हजार। तीसरा: FinTech Chatbot, स्कोर 90, बजट 1 लाख 20 हजार। क्या मैं सेल्स टीम को इनसे संपर्क करने का निर्देश दूँ?",
      toast:    "3 हॉट लीड्स मिले ✅"
    }
  };

  const m = msgs[lang];
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", m.fetching, "#6366f1");
    auraSpeak(m.voice1);
  }, 600);
  setTimeout(() => {
    addAgentLogMessage("Priya Sharma (Sales Mgr)", m.leads, "#10b981");
    auraSpeak(m.voice2);
    showToast(m.toast, "success");
  }, 2200);
}

// ─── Workflow: Generic Command & Dynamic Task Delegation ───────────────────────
function executeGenericCommandWorkflow(cmd, lang) {
  const lower = cmd.toLowerCase();

  // 1. Check if this is an actionable directive
  const isDirective = typeof isTaskDirective === 'function' ? isTaskDirective(cmd) : true;

  if (isDirective) {
    // Resolve best specialist employee
    let targetKey = 'dev_lead';
    if (/frontend|react|next|ui|css|component|button|navbar|dark mode|theme|layout|checkout/.test(lower)) {
      targetKey = 'dev_frontend';
    } else if (/design|figma|wireframe|mockup|color|icon|svg|prototype/.test(lower)) {
      targetKey = 'designer_lead';
    } else if (/test|qa|cypress|bug|load test|quality|testing|audit/.test(lower)) {
      targetKey = 'qa_lead';
    } else if (/sales|deal|client|pitch|call|close|quotation|proposal|revenue/.test(lower)) {
      targetKey = 'sales_manager';
    } else if (/marketing|ads|meta|google ads|campaign|social|seo|instagram|linkedin/.test(lower)) {
      targetKey = 'marketing_manager';
    } else if (/project|sprint|timeline|deliverable|milestone|scrum/.test(lower)) {
      targetKey = 'pm_manager';
    } else if (/backend|api|server|database|node|redis|auth|webhook|mongodb|sql/.test(lower)) {
      targetKey = 'dev_lead';
    }

    const assigned = typeof assignTaskToAgent === 'function' ? assignTaskToAgent(targetKey, cmd) : null;
    const agent = assigned ? assigned.agent : (AGENT_HIERARCHY[targetKey] || AGENT_HIERARCHY['head_manager']);
    const taskName = assigned ? assigned.cleanTask : cmd;

    const msgs = {
      en: {
        response: `Directive Delegated: Assigned "${taskName}" to ${agent.name} (${agent.title}). Execution in progress.`,
        voice:    `Understood Sir. I have assigned the task "${taskName}" to ${agent.name.split(' ')[0]}. They are executing it now.`,
        toast:    `Task assigned to ${agent.name} 🚀`
      },
      hi: {
        response: `जी सर! निर्देश "${taskName}" को ${agent.name} (${agent.title}) को सौंप दिया गया है। काम तुरंत शुरू हो गया है।`,
        voice:    `जी सर! मैंने यह काम ${agent.name.split(' ')[0]} को सौंप दिया है। उन्होंने इस पर काम शुरू कर दिया है।`,
        toast:    `टास्क ${agent.name.split(' ')[0]} को असाइन हुआ 🚀`
      }
    };

    const m = msgs[lang] || msgs.en;
    setTimeout(() => {
      addAgentLogMessage("Aura Sharma (Head Manager AI)", m.response, "#6366f1");
      auraSpeak(m.voice);
      showToast(m.toast, "success");
    }, 600);
    return;
  }

  const msgs = {
    en: {
      response: `Command processed: "${cmd}". Re-aligning department priorities.`,
      voice:    "Understood Sir. Your command has been received and processed. I am re-aligning all department priorities.",
      toast:    "Head Manager Aura updated directives"
    },
    hi: {
      response: `जी सर। आपका निर्देश "${cmd}" प्राप्त हो गया। सभी विभागों की प्राथमिकताएँ अपडेट हो रही हैं।`,
      voice:    "जी सर। आपका निर्देश मिल गया। मैं सभी विभागों को अपडेट कर रही हूँ।",
      toast:    "Aura ने निर्देश अपडेट किया ✅"
    }
  };

  const m = msgs[lang] || msgs.en;
  setTimeout(() => {
    addAgentLogMessage("Aura Sharma (Head Manager AI)", m.response, "#6366f1");
    auraSpeak(m.voice);
    showToast(m.toast, "info");
  }, 800);
}
