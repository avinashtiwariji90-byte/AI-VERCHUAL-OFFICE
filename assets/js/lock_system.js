/**
 * NexusAI Virtual Office - Cyber Security Lock System
 * Provides biometric-styled password protection, Web Audio SFX,
 * automatic locking on page load, header lock controls, and passcode management.
 */

(function () {
  const STORAGE_KEY_PASS = 'nexus_office_passcode';
  const STORAGE_KEY_LOCKED = 'nexus_office_locked';
  const DEFAULT_PASS = 'avinash123';

  // Initialize Web Audio Context on demand
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Futuristic Web Audio Synthesizers (No external files required)
  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'unlock') {
        // High-tech ascending harmonic chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.001, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.45);
        });
      } else if (type === 'denied') {
        // Sci-fi error buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.28);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === 'click') {
        // Subtle cyber click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      console.warn('Audio SFX not available:', e);
    }
  }

  // Get stored password or fallback
  function getStoredPassword() {
    return localStorage.getItem(STORAGE_KEY_PASS) || DEFAULT_PASS;
  }

  // Check and unlock
  window.submitOfficeUnlock = function () {
    const input = document.getElementById('lockPasscodeInput');
    const errorMsg = document.getElementById('lockErrorMessage');
    const card = document.getElementById('nexusLockCard');
    const overlay = document.getElementById('nexusLockOverlay');
    const statusText = document.getElementById('lockStatusText');

    if (!input) return;

    const entered = input.value.trim();
    const correct = getStoredPassword();

    if (entered === correct) {
      // Access Granted
      playSound('unlock');
      if (errorMsg) errorMsg.style.display = 'none';

      if (card) {
        card.classList.remove('lock-denied');
        card.classList.add('lock-granted');
      }

      if (statusText) {
        statusText.innerHTML = '🟢 <span style="color: #10b981; font-weight: bold; letter-spacing: 2px;">ACCESS GRANTED • WELCOME CEO AVINASH</span>';
      }

      setTimeout(() => {
        if (overlay) {
          overlay.classList.add('lock-hidden');
          setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
          }, 450);
        }
        localStorage.setItem(STORAGE_KEY_LOCKED, 'false');
        input.value = '';
      }, 700);
    } else {
      // Access Denied
      playSound('denied');
      if (errorMsg) {
        errorMsg.innerText = '⚠️ Access Denied: Incorrect Security Passcode!';
        errorMsg.style.display = 'block';
      }
      if (card) {
        card.classList.remove('lock-denied');
        // Trigger reflow to restart CSS animation
        void card.offsetWidth;
        card.classList.add('lock-denied');
      }
      if (statusText) {
        statusText.innerHTML = '🔴 <span style="color: #f43f5e; font-weight: bold; letter-spacing: 1px;">AUTHENTICATION FAILED • RETRY</span>';
      }
      input.focus();
      input.select();
    }
  };

  // Lock the office screen
  window.lockOfficeScreen = function () {
    const overlay = document.getElementById('nexusLockOverlay');
    const card = document.getElementById('nexusLockCard');
    const input = document.getElementById('lockPasscodeInput');
    const errorMsg = document.getElementById('lockErrorMessage');
    const statusText = document.getElementById('lockStatusText');

    if (!overlay) return;

    playSound('click');
    localStorage.setItem(STORAGE_KEY_LOCKED, 'true');

    if (card) {
      card.classList.remove('lock-granted', 'lock-denied');
    }
    if (errorMsg) errorMsg.style.display = 'none';
    if (statusText) {
      statusText.innerHTML = '🔒 <span style="color: var(--secondary);">NEXUS BIOMETRIC & SECURITY GATEWAY</span>';
    }
    if (input) input.value = '';

    overlay.classList.remove('lock-hidden');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (input) input.focus();
    }, 150);
  };

  // Toggle password eye icon
  window.toggleLockPassVisibility = function () {
    const input = document.getElementById('lockPasscodeInput');
    const eyeIcon = document.getElementById('lockEyeIcon');
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
      input.type = 'password';
      if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  };

  // Change Password Modal handling
  window.openChangePasswordModal = function () {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.style.display = 'flex';
  };

  window.closeChangePasswordModal = function () {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.style.display = 'none';
    const err = document.getElementById('changePassError');
    if (err) err.innerText = '';
  };

  window.saveNewOfficePassword = function () {
    const currentInput = document.getElementById('currPassInput');
    const newInput = document.getElementById('newPassInput');
    const confirmInput = document.getElementById('confirmPassInput');
    const err = document.getElementById('changePassError');

    const cur = (currentInput ? currentInput.value : '').trim();
    const np = (newInput ? newInput.value : '').trim();
    const conf = (confirmInput ? confirmInput.value : '').trim();

    const stored = getStoredPassword();

    if (cur !== stored) {
      if (err) {
        err.style.color = '#f43f5e';
        err.innerText = 'Current password does not match!';
      }
      return;
    }

    if (!np || np.length < 4) {
      if (err) {
        err.style.color = '#f43f5e';
        err.innerText = 'New password must be at least 4 characters!';
      }
      return;
    }

    if (np !== conf) {
      if (err) {
        err.style.color = '#f43f5e';
        err.innerText = 'New password and confirmation do not match!';
      }
      return;
    }

    localStorage.setItem(STORAGE_KEY_PASS, np);
    if (err) {
      err.style.color = '#10b981';
      err.innerText = '✅ Password successfully updated!';
    }

    setTimeout(() => {
      window.closeChangePasswordModal();
      if (currentInput) currentInput.value = '';
      if (newInput) newInput.value = '';
      if (confirmInput) confirmInput.value = '';
    }, 1200);
  };

  // Quick reset to default password helper
  window.resetOfficePasscodeToDefault = function () {
    if (confirm('Kya aap password ko default ("avinash123") par reset karna chahte hain?')) {
      localStorage.setItem(STORAGE_KEY_PASS, DEFAULT_PASS);
      alert('Password default "avinash123" par reset ho gaya hai.');
      const err = document.getElementById('lockErrorMessage');
      if (err) {
        err.style.color = '#10b981';
        err.innerText = 'Password reset to default: avinash123';
        err.style.display = 'block';
      }
    }
  };

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('lockPasscodeInput');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.submitOfficeUnlock();
        }
      });
      // Try focusing after slight delay
      setTimeout(() => input.focus(), 300);
    }

    // High security mode requested: always lock on page load
    window.lockOfficeScreen();
  });
})();
