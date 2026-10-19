/**
 * NexusAI - Hyper-Clear AI Employee Voice Engine
 * Features:
 * - High-Definition Natural / Neural Voice Selection (Swara, Madhur, Neerja, Prabhat, Jenny, Guy, Google Hindi/English)
 * - Distinct Employee Voice Profiles (Custom Pitch, Rate & Timbre for Aura, Rohan, Priya, Aarav, Neha, Arjun, etc.)
 * - Phonetic Hinglish & Tech Acronym Cleanser (Pronounces API, UI/UX, PR, ₹ Lakhs, percentages naturally without stutter)
 * - Subtle Audio Activation Chime via Web Audio API
 */

let voiceEnabled = true;
let currentLang = 'hi'; // 'hi' or 'en'
let isListening = false;
let speechSynth = window.speechSynthesis;

// Cached Voice Pools
let naturalVoices = {
  hiFemale: [],
  hiMale: [],
  enInFemale: [],
  enInMale: [],
  enFemale: [],
  enMale: []
};

// ─── High-Definition Voice Matcher ──────────────────────────────────────────

function loadVoices() {
  if (!speechSynth) return;
  const voices = speechSynth.getVoices();
  if (!voices || voices.length === 0) return;

  // Reset pools
  naturalVoices = {
    hiFemale: [],
    hiMale: [],
    enInFemale: [],
    enInMale: [],
    enFemale: [],
    enMale: []
  };

  voices.forEach(v => {
    const name = v.name.toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    const isNatural = name.includes('natural') || name.includes('online') || name.includes('neural') || name.includes('google');

    // 1. Hindi Voices
    if (lang.startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी')) {
      const isMale = name.includes('madhur') || name.includes('hemant') || name.includes('male');
      if (isMale) {
        if (isNatural) naturalVoices.hiMale.unshift(v);
        else naturalVoices.hiMale.push(v);
      } else {
        if (isNatural) naturalVoices.hiFemale.unshift(v);
        else naturalVoices.hiFemale.push(v);
      }
    }

    // 2. Indian English Voices
    else if (lang === 'en-in' || name.includes('india') || name.includes('neerja') || name.includes('prabhat') || name.includes('veena') || name.includes('heera')) {
      const isMale = name.includes('prabhat') || name.includes('ravi') || name.includes('male');
      if (isMale) {
        if (isNatural) naturalVoices.enInMale.unshift(v);
        else naturalVoices.enInMale.push(v);
      } else {
        if (isNatural) naturalVoices.enInFemale.unshift(v);
        else naturalVoices.enInFemale.push(v);
      }
    }

    // 3. Global English Voices
    else if (lang.startsWith('en')) {
      const isFemale = name.includes('female') || name.includes('zira') || name.includes('jenny') || name.includes('aria') || name.includes('sonia') || name.includes('samantha') || name.includes('karen');
      const isMale = name.includes('male') || name.includes('david') || name.includes('guy') || name.includes('ryan') || name.includes('george') || name.includes('alex') || name.includes('daniel');

      if (isFemale) {
        if (isNatural) naturalVoices.enFemale.unshift(v);
        else naturalVoices.enFemale.push(v);
      } else if (isMale) {
        if (isNatural) naturalVoices.enMale.unshift(v);
        else naturalVoices.enMale.push(v);
      }
    }
  });
}

if (speechSynth) {
  speechSynth.onvoiceschanged = loadVoices;
  loadVoices();
}

// ─── Per-Agent Distinct Voice Persona Profiles ────────────────────────────────

const AGENT_VOICE_PERSONAS = {
  head_manager: {
    name: "Aura Sharma",
    gender: "female",
    pitch: 1.02, // Crisp, authoritative & clear
    rate: 1.0,
    preferredVoiceNames: ['swara', 'neerja', 'jenny', 'google हिन्दी', 'zira']
  },
  pm_manager: {
    name: "Aarav Verma",
    gender: "male",
    pitch: 0.96, // Clear, composed & professional
    rate: 1.0,
    preferredVoiceNames: ['madhur', 'prabhat', 'guy', 'david']
  },
  sales_manager: {
    name: "Priya Sharma",
    gender: "female",
    pitch: 1.06, // Energetic, bright & persuasive
    rate: 1.02,
    preferredVoiceNames: ['swara', 'neerja', 'aria', 'google हिन्दी']
  },
  marketing_manager: {
    name: "Kunal Mehta",
    gender: "male",
    pitch: 0.98, // Dynamic & confident
    rate: 1.02,
    preferredVoiceNames: ['prabhat', 'madhur', 'ryan', 'david']
  },
  dev_lead: {
    name: "Rohan Gupta",
    gender: "male",
    pitch: 0.94, // Deep, focused tech lead
    rate: 0.98,
    preferredVoiceNames: ['madhur', 'prabhat', 'guy', 'david']
  },
  dev_frontend: {
    name: "Neha Kapoor",
    gender: "female",
    pitch: 1.08, // Cheerful, clear & fast
    rate: 1.02,
    preferredVoiceNames: ['swara', 'neerja', 'sonia', 'zira']
  },
  qa_lead: {
    name: "Arjun Kumar",
    gender: "male",
    pitch: 0.95, // Methodical & sharp
    rate: 0.98,
    preferredVoiceNames: ['madhur', 'prabhat', 'daniel', 'david']
  },
  designer_lead: {
    name: "Kavya Sharma",
    gender: "female",
    pitch: 1.1, // Warm & expressive
    rate: 1.0,
    preferredVoiceNames: ['swara', 'neerja', 'aria', 'jenny']
  },
  sales_rep1: {
    name: "Aditya Joshi",
    gender: "male",
    pitch: 0.98,
    rate: 1.04,
    preferredVoiceNames: ['madhur', 'prabhat', 'david']
  },
  sales_rep2: {
    name: "Sneha Patel",
    gender: "female",
    pitch: 1.06,
    rate: 1.02,
    preferredVoiceNames: ['swara', 'neerja', 'zira']
  }
};

// ─── Select Best Voice for Agent ─────────────────────────────────────────────

function getBestVoiceForAgent(agentKey, isHindiText) {
  const allVoices = speechSynth ? speechSynth.getVoices() : [];
  if (!allVoices.length) return null;

  const persona = AGENT_VOICE_PERSONAS[agentKey] || {
    gender: typeof getAgentGender === 'function' ? getAgentGender(agentKey) : 'female',
    preferredVoiceNames: []
  };

  const isFemale = persona.gender === 'female';

  // 1. Try matching preferred voice names
  if (persona.preferredVoiceNames && persona.preferredVoiceNames.length > 0) {
    for (const pref of persona.preferredVoiceNames) {
      const matched = allVoices.find(v => v.name.toLowerCase().includes(pref.toLowerCase()));
      if (matched) return matched;
    }
  }

  // 2. Select from categorized pool
  if (isHindiText) {
    if (isFemale && naturalVoices.hiFemale.length) return naturalVoices.hiFemale[0];
    if (!isFemale && naturalVoices.hiMale.length) return naturalVoices.hiMale[0];
    if (naturalVoices.enInFemale.length && isFemale) return naturalVoices.enInFemale[0];
    if (naturalVoices.enInMale.length && !isFemale) return naturalVoices.enInMale[0];
  } else {
    if (isFemale) {
      if (naturalVoices.enInFemale.length) return naturalVoices.enInFemale[0];
      if (naturalVoices.enFemale.length) return naturalVoices.enFemale[0];
    } else {
      if (naturalVoices.enInMale.length) return naturalVoices.enInMale[0];
      if (naturalVoices.enMale.length) return naturalVoices.enMale[0];
    }
  }

  // Fallback to any matching language voice
  const langMatch = allVoices.find(v => isHindiText ? (v.lang.startsWith('hi') || v.lang === 'en-IN') : v.lang.startsWith('en'));
  return langMatch || allVoices[0];
}

// ─── Phonetic Hinglish & Tech Acronym Cleanser ────────────────────────────────

function cleanTextForCrispSpeech(rawText) {
  if (!rawText) return "";

  let t = rawText
    // Remove employee speaker prefix like "Rohan says:" or "Priya says:" so it doesn't sound awkward
    .replace(/^[A-Za-z\s]+ says:\s*/i, '')
    .replace(/^[A-Za-z\s]+ bol rahe hain:\s*/i, '')
    
    // Remove Markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, 'link')
    
    // Convert Indian Currencies & Numbers
    .replace(/₹\s*([0-9,]+)\s*(?:lakh|lakhs|L)/gi, '$1 lakh rupaye')
    .replace(/₹\s*([0-9,]+)/g, '$1 rupaye')
    
    // Expand Common Tech Acronyms for crystal-clear audio
    .replace(/\bAPI\b/g, 'A P I')
    .replace(/\bAPIs\b/g, 'A P Is')
    .replace(/\bUI\/UX\b/gi, 'U I and U X')
    .replace(/\bUI\b/g, 'U I')
    .replace(/\bUX\b/g, 'U X')
    .replace(/\bPR\s*#?([0-9]+)/gi, 'Pull Request $1')
    .replace(/\bQA\b/g, 'Q A')
    .replace(/\bCEO\b/g, 'C E O')
    .replace(/\bAI\b/g, 'A I')
    .replace(/\bCRM\b/g, 'C R M')
    .replace(/\bSDR\b/g, 'S D R')
    .replace(/\bE2E\b/gi, 'End to End')
    .replace(/\bAuth\b/gi, 'Authentication')
    .replace(/\bdev\b/gi, 'development')
    .replace(/\bperf\b/gi, 'performance')
    .replace(/%/g, ' percent ')
    .replace(/&/g, ' and ')
    
    // Remove all emojis
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    
    // Fix punctuation spacing for natural breathing pauses
    .replace(/\n+/g, '. ')
    .replace(/[:|•]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return t;
}

function isHindi(text) {
  return /[\u0900-\u097F]/.test(text) || /\b(karein|karo|raha|rahi|hain|hai|kaam|shuru|kripya|sab|bhi|hoga|gaya|gayi|baat|boss)\b/i.test(text);
}

function setAuraLanguage(lang) {
  currentLang = lang;
}

// ─── Subtle Audio Chime for Instant Audio Feedback ───────────────────────────

function playChimeAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08); // E6 note

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Ignore audio context error if restricted
  }
}

// ─── Master High-Definition Speech Function ──────────────────────────────────

function auraSpeak(text, agentOrKey = null, opts = {}) {
  if (!voiceEnabled || !speechSynth) return;

  // Cancel any previous stuck utterance
  speechSynth.cancel();

  const cleanText = cleanTextForCrispSpeech(text);
  if (!cleanText) return;

  // Extract agent key
  let agentKey = "head_manager";
  if (typeof agentOrKey === "string") {
    agentKey = agentOrKey;
  } else if (agentOrKey && typeof agentOrKey === "object") {
    agentKey = agentOrKey.id ? (agentOrKey.id.replace('agent-', '') === 'hm' ? 'head_manager' : (agentOrKey.id.replace('agent-', '') === 'pm' ? 'pm_manager' : (agentOrKey.id.replace('agent-', '') === 'sm' ? 'sales_manager' : (agentOrKey.id.replace('agent-', '') === 'mm' ? 'marketing_manager' : agentOrKey.id.replace('agent-', ''))))) : "head_manager";
  }

  const persona = AGENT_VOICE_PERSONAS[agentKey] || AGENT_VOICE_PERSONAS.head_manager;
  const isHindiText = isHindi(cleanText) || currentLang === 'hi';

  const utter = new SpeechSynthesisUtterance(cleanText);
  const selectedVoice = getBestVoiceForAgent(agentKey, isHindiText);

  if (selectedVoice) {
    utter.voice = selectedVoice;
    utter.lang = selectedVoice.lang || (isHindiText ? 'hi-IN' : 'en-IN');
  } else {
    utter.lang = isHindiText ? 'hi-IN' : 'en-US';
  }

  // Clear & Natural Pitch and Rate Settings
  utter.pitch = opts.pitch ?? (persona.pitch || 1.0);
  utter.rate = opts.rate ?? (persona.rate || 1.0);
  utter.volume = opts.volume ?? 1.0;

  // Visual Speaker Indicators
  utter.onstart = () => {
    playChimeAudio();
    setAuraSpeakingBadge(true);
    highlightSpeakerAvatar(agentKey, true);
  };

  utter.onend = () => {
    setAuraSpeakingBadge(false);
    highlightSpeakerAvatar(agentKey, false);
  };

  utter.onerror = () => {
    setAuraSpeakingBadge(false);
    highlightSpeakerAvatar(agentKey, false);
  };

  speechSynth.speak(utter);
}

function highlightSpeakerAvatar(agentKey, isSpeaking) {
  // If in boardroom, highlight the specific seat
  if (typeof currentBoardroomSpeakerKey !== 'undefined') {
    const seat = document.getElementById(`seat-${agentKey}`);
    if (seat) {
      if (isSpeaking) seat.classList.add('speaking');
      else seat.classList.remove('speaking');
    }
  }
}

function setAuraSpeakingBadge(speaking) {
  const badge = document.getElementById('auraSpeakingBadge');
  if (!badge) return;
  badge.style.display = speaking ? 'inline-flex' : 'none';
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const btn = document.getElementById('voiceToggleBtn');
  if (!btn) return;

  if (voiceEnabled) {
    btn.innerHTML = '🔊 Voice: ON';
    btn.style.background = 'rgba(16, 185, 129, 0.2)';
    btn.style.borderColor = 'rgba(16, 185, 129, 0.5)';
    btn.style.color = '#10b981';
    showToast('Ultra-Clear AI Voice Enabled 🔊', 'success');
    auraSpeak("Voice audio enabled. All AI employees are ready to communicate clearly.", "head_manager");
  } else {
    if (speechSynth) speechSynth.cancel();
    btn.innerHTML = '🔇 Voice: OFF';
    btn.style.background = 'rgba(244, 63, 94, 0.15)';
    btn.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    btn.style.color = '#f43f5e';
    showToast('AI Voice Muted 🔇', 'info');
  }
}

// ─── Speech-to-Text (Owner Speaks via Mic with Noise Tolerance) ──────────────

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startVoiceInput() {
  if (!SpeechRecognition) {
    showToast("Speech Recognition not supported in this browser. Chrome ya Edge use karein!", "error");
    return;
  }

  if (isListening) {
    isListening = false;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = 'hi-IN';

  const input = document.getElementById('ownerCommandInput');
  const micBtn = document.getElementById('micBtn');
  const badge = document.getElementById('listeningBadge');

  isListening = true;
  let accumulatedText = '';
  let silenceTimer = null;
  const SILENCE_MS = 2000;

  function resetSilenceTimer() {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      recognition.stop();
    }, SILENCE_MS);
  }

  if (micBtn) {
    micBtn.style.background = 'rgba(244, 63, 94, 0.3)';
    micBtn.style.borderColor = '#f43f5e';
    micBtn.style.color = '#f43f5e';
    micBtn.innerHTML = '🔴 Listening...';
  }
  if (badge) badge.style.display = 'block';
  if (input) input.placeholder = '🎤 Bol rahe hain... poori baat boliye...';

  recognition.onresult = (event) => {
    accumulatedText = '';
    for (let i = 0; i < event.results.length; i++) {
      accumulatedText += event.results[i][0].transcript + ' ';
    }
    accumulatedText = accumulatedText.trim();
    if (input) input.value = accumulatedText;
    resetSilenceTimer();
  };

  recognition.onend = () => {
    clearTimeout(silenceTimer);
    isListening = false;

    if (micBtn) {
      micBtn.style.background = 'rgba(99,102,241,0.2)';
      micBtn.style.borderColor = 'rgba(99,102,241,0.5)';
      micBtn.style.color = '#818cf8';
      micBtn.innerHTML = '🎤';
    }
    if (badge) badge.style.display = 'none';
    if (input) input.placeholder = 'Type ya 🎤 Mic se bolo — Hindi ya English dono chalega...';

    const finalText = (input ? input.value : accumulatedText).trim();
    if (finalText) {
      showToast(`🎤 "${finalText}"`, "info");
      processOwnerCommand(finalText);
      if (input) input.value = '';
    }
  };

  recognition.onerror = (event) => {
    clearTimeout(silenceTimer);
    isListening = false;
    if (micBtn) {
      micBtn.style.background = 'rgba(99,102,241,0.2)';
      micBtn.style.borderColor = 'rgba(99,102,241,0.5)';
      micBtn.style.color = '#818cf8';
      micBtn.innerHTML = '🎤';
    }
    if (badge) badge.style.display = 'none';
    if (input) input.placeholder = 'Type ya 🎤 Mic se bolo...';

    if (event.error === 'no-speech') {
      showToast("Koi awaaz nahi suni. Dobara mic click karein 🎤", "error");
    } else if (event.error === 'not-allowed') {
      showToast("Mic permission required! Browser setting me Mic allow karein.", "error");
    }
  };

  recognition.start();
  showToast("🎤 Listening... Boliye Sir!", "info");
}

/**
 * Reusable Voice Recognition for Modal Input Fields (Employee Modal & Boardroom Modal)
 */
function startTargetedVoiceInput(inputId, submitCallback, badgeId, micBtnId) {
  if (!SpeechRecognition) {
    showToast("Speech Recognition not supported. Chrome ya Edge use karein!", "error");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = 'hi-IN';

  const inputEl = document.getElementById(inputId);
  const micBtnEl = micBtnId ? document.getElementById(micBtnId) : null;
  const badgeEl = badgeId ? document.getElementById(badgeId) : null;

  let accumulatedText = '';
  let silenceTimer = null;
  const SILENCE_MS = 2000;

  function resetSilenceTimer() {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      recognition.stop();
    }, SILENCE_MS);
  }

  if (micBtnEl) {
    micBtnEl.style.background = 'rgba(244, 63, 94, 0.3)';
    micBtnEl.style.borderColor = '#f43f5e';
    micBtnEl.style.color = '#f43f5e';
    micBtnEl.innerHTML = '🔴 Sun raha hun...';
    micBtnEl.onclick = () => { clearTimeout(silenceTimer); recognition.stop(); micBtnEl.onclick = null; };
  }
  if (badgeEl) badgeEl.style.display = 'block';
  if (inputEl) {
    inputEl.placeholder = '🎤 Poori baat boliye...';
    inputEl.value = '';
  }

  recognition.onresult = (event) => {
    accumulatedText = '';
    for (let i = 0; i < event.results.length; i++) {
      accumulatedText += event.results[i][0].transcript + ' ';
    }
    accumulatedText = accumulatedText.trim();
    if (inputEl) inputEl.value = accumulatedText;
    resetSilenceTimer();
  };

  recognition.onend = () => {
    clearTimeout(silenceTimer);

    if (micBtnEl) {
      micBtnEl.style.background = '';
      micBtnEl.style.borderColor = '';
      micBtnEl.style.color = '';
      micBtnEl.innerHTML = '🎤 Mic';
    }
    if (badgeEl) badgeEl.style.display = 'none';
    if (inputEl) inputEl.placeholder = 'Type ya mic se bolo...';

    const text = accumulatedText.trim() || (inputEl ? inputEl.value.trim() : '');
    if (text && typeof submitCallback === 'function') {
      showToast(`🎤 "${text}"`, "info");
      submitCallback();
    }
  };

  recognition.onerror = (event) => {
    clearTimeout(silenceTimer);
    if (micBtnEl) {
      micBtnEl.style.background = '';
      micBtnEl.style.borderColor = '';
      micBtnEl.style.color = '';
      micBtnEl.innerHTML = '🎤 Mic';
    }
    if (badgeEl) badgeEl.style.display = 'none';
    if (inputEl) inputEl.placeholder = 'Type ya mic se bolo...';
  };

  recognition.start();
  showToast("🎤 Sun raha hun... Poori baat boliye!", "info");
}
