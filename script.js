/* ==========================================================================
   THE ROYAL WEDDING INVITATION - JAVASCRIPT ENGINE
   Interactive, Fun, Engaging Indian Wedding Web Experience
   Celebration: Shraddha weds Pranay
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Auto-refresh stale localStorage if it still had the old placeholder names
  if (localStorage.getItem('bride_name') === 'Ananya') {
    localStorage.removeItem('bride_name');
    localStorage.removeItem('groom_name');
    localStorage.removeItem('wedding_date');
    localStorage.removeItem('wedding_venue');
    localStorage.removeItem('haldi_date');
    localStorage.removeItem('pooja_date');
    localStorage.removeItem('wedding_blessings_list');
  }
  localStorage.removeItem('pooja_date');

  // ==========================================
  // 1. STATE & LOCAL STORAGE MANAGEMENT
  // ==========================================
  const weddingState = {
    brideName: localStorage.getItem('bride_name') || 'Shraddha',
    groomName: localStorage.getItem('groom_name') || 'Pranay',
    weddingDate: localStorage.getItem('wedding_date') || 'Sunday, 13th December 2026',
    weddingVenue: localStorage.getItem('wedding_venue') || 'Amrith Garden',
    haldiDate: localStorage.getItem('haldi_date') || 'Saturday, 12th December 2026 • Rotary Club Manipal',
    haldiDabs: 0,
    blessingsCount: parseInt(localStorage.getItem('wedding_blessings_tally') || '1248', 10),
    diyaLit: false
  };

  function updatePageDetails() {
    const brideElem = document.getElementById('displayBrideName');
    const groomElem = document.getElementById('displayGroomName');
    const weddingDateElem = document.getElementById('displayWeddingDate');
    const weddingVenueElem = document.getElementById('displayWeddingVenue');
    const haldiDateElem = document.getElementById('displayHaldiDate');

    if (brideElem) brideElem.textContent = weddingState.brideName;
    if (groomElem) groomElem.textContent = weddingState.groomName;
    if (weddingDateElem) weddingDateElem.textContent = weddingState.weddingDate;
    if (weddingVenueElem) weddingVenueElem.textContent = weddingState.weddingVenue;
    if (haldiDateElem) haldiDateElem.textContent = weddingState.haldiDate;
  }
  updatePageDetails();

  // ==========================================
  // 2. SUBTLE CELEBRATION CHIME AUDIO
  // ==========================================
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playBellChime(freq = 523.25, duration = 1.0) {
    try {
      initAudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio playback silently ignored if not supported
    }
  }

  // ==========================================
  // 3. FALLING MARIGOLD & ROSE PETALS ENGINE
  // ==========================================
  const canvas = document.getElementById('petalCanvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PETAL_COUNT = 38;
  const petals = [];

  class Petal {
    constructor(isBurst = false, burstX = width / 2, burstY = height / 2) {
      this.reset(isBurst, burstX, burstY);
    }

    reset(isBurst = false, burstX = width / 2, burstY = height / 2) {
      if (isBurst) {
        this.x = burstX;
        this.y = burstY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.8 + 1.2;
      }

      this.size = Math.random() * 12 + 10;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 2 - 1;
      this.oscillation = Math.random() * 2;
      this.oscSpeed = Math.random() * 0.03 + 0.01;

      // Varieties: 0 = Pure White Jasmine/Rose, 1 = Soft Blush Pink, 2 = Ivory Cream, 3 = Champagne Gold Sparkle
      const typeRand = Math.random();
      if (typeRand < 0.45) {
        this.type = 'jasmine-white';
        this.color = '#ffffff';
        this.colorAccent = '#f7f2ea';
      } else if (typeRand < 0.75) {
        this.type = 'blush-rose';
        this.color = '#fed7e2';
        this.colorAccent = '#f687b3';
      } else if (typeRand < 0.90) {
        this.type = 'ivory-cream';
        this.color = '#faf5ee';
        this.colorAccent = '#e2d7c5';
      } else {
        this.type = 'gold-spark';
        this.color = '#d4af37';
        this.colorAccent = '#eed885';
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.oscillation) * 0.8;
      this.oscillation += this.oscSpeed;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      // Draw petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(this.size / 2, -this.size / 1.5, this.size, 0);
      ctx.quadraticCurveTo(this.size / 2, this.size / 1.5, 0, 0);

      const grad = ctx.createRadialGradient(
        this.size / 2, 0, 1,
        this.size / 2, 0, this.size
      );
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, this.colorAccent);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize petals
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function triggerPetalBurst(count = 35, x = width / 2, y = height / 3) {
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(true, x, y));
    }
    // Limit max petals to avoid memory overload
    if (petals.length > 120) {
      petals.splice(0, petals.length - 120);
    }
    playBellChime(659.25, 0.8);
  }

  function animatePetals() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  // Petal burst button
  const petalBurstBtn = document.getElementById('petalBurstBtn');
  if (petalBurstBtn) {
    petalBurstBtn.addEventListener('click', (e) => {
      triggerPetalBurst(40, width / 2, height / 2);
    });
  }

  // ==========================================
  // 4. ROYAL ENVELOPE OPENING CEREMONY
  // ==========================================
  const envelopeModal = document.getElementById('envelopeModal');
  const royalEnvelope = document.getElementById('royalEnvelope');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const openInviteDirectBtn = document.getElementById('openInviteDirectBtn');
  const reopenEnvelopeBtn = document.getElementById('reopenEnvelopeBtn');

  function openEnvelope() {
    if (royalEnvelope) royalEnvelope.classList.add('unflapping');
    playBellChime(587.33, 1.2);
    triggerPetalBurst(50, width / 2, height / 2);

    setTimeout(() => {
      if (envelopeModal) {
        envelopeModal.classList.add('opened');
      }
      document.body.classList.remove('envelope-active');
    }, 700);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openEnvelope);
  if (royalEnvelope) royalEnvelope.addEventListener('click', openEnvelope);
  if (openInviteDirectBtn) openInviteDirectBtn.addEventListener('click', openEnvelope);

  if (reopenEnvelopeBtn) {
    reopenEnvelopeBtn.addEventListener('click', () => {
      if (envelopeModal) {
        envelopeModal.classList.remove('opened');
        if (royalEnvelope) royalEnvelope.classList.remove('unflapping');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 5. LIVE COUNTDOWN TIMER
  // Target: Sunday, 13th December 2026, 10:00 AM (Auspicious Muhurtham)
  // ==========================================
  function updateCountdown() {
    const targetDate = new Date('2026-12-13T10:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysElem = document.getElementById('daysCount');
    const hoursElem = document.getElementById('hoursCount');
    const minsElem = document.getElementById('minsCount');
    const secsElem = document.getElementById('secsCount');

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysElem) daysElem.textContent = String(days).padStart(2, '0');
      if (hoursElem) hoursElem.textContent = String(hours).padStart(2, '0');
      if (minsElem) minsElem.textContent = String(mins).padStart(2, '0');
      if (secsElem) secsElem.textContent = String(secs).padStart(2, '0');
    } else {
      if (daysElem) daysElem.textContent = '00';
      if (hoursElem) hoursElem.textContent = '00';
      if (minsElem) minsElem.textContent = '00';
      if (secsElem) secsElem.textContent = '00';
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 6. MESSAGES FROM THE LOVED ONES
  // ==========================================
  const defaultBlessings = [
    {
      author: "Rahul Bhaiya & Family",
      text: "To our princess sister Shraddha, you deserve all the love and happiness in the universe. Pranay, you're officially welcomed to the family! Infinite joy and blessings! ❤️",
      time: "Just now"
    },
    {
      author: "Manipal Cousin Squad",
      text: "Haldi outfits for Rotary Club are ready and Amrith Garden will be legendary! We can't wait to dance our hearts out for Shraddha & Pranay!",
      time: "2 hours ago"
    },
    {
      author: "Dadi & Dadaji",
      text: "सदा सुहागन रहो, आयुष्मान भव। May the almighty shower divine health, prosperity, and perpetual happiness on Shraddha & Pranay's sacred journey.",
      time: "Yesterday"
    }
  ];

  let storedBlessings = [];
  try {
    storedBlessings = JSON.parse(localStorage.getItem('wedding_blessings_list') || 'null');
  } catch (err) {
    storedBlessings = null;
  }
  if (!storedBlessings || storedBlessings.length === 0) {
    storedBlessings = defaultBlessings;
  }

  const blessingsWallGrid = document.getElementById('blessingsWallGrid');
  const blessingForm = document.getElementById('blessingForm');

  function renderBlessings() {
    if (!blessingsWallGrid) return;
    blessingsWallGrid.innerHTML = storedBlessings
      .map(
        (b) => `
      <div class="blessing-card">
        <div class="blessing-card-header">
          <div class="author-wrap">
            <span class="card-sticker">💌</span>
            <div class="card-author-name">${escapeHTML(b.author)}</div>
          </div>
          <span class="card-timestamp">${b.time}</span>
        </div>
        <p class="card-message-text">${escapeHTML(b.text)}</p>
      </div>
    `
      )
      .join('');
  }
  renderBlessings();

  if (blessingForm) {
    blessingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('blessingAuthor');
      const textInput = document.getElementById('blessingText');

      if (!authorInput || !textInput) return;

      const newBlessing = {
        author: authorInput.value.trim(),
        text: textInput.value.trim(),
        time: "Just now"
      };

      storedBlessings.unshift(newBlessing);
      try {
        localStorage.setItem('wedding_blessings_list', JSON.stringify(storedBlessings));
      } catch (err) {}

      // Reset form & re-render
      authorInput.value = '';
      textInput.value = '';
      renderBlessings();

      triggerPetalBurst(30, width / 2, height / 2);
      playBellChime(659.25, 0.8);
    });
  }

  // Helper escape
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }



  // ==========================================
  // 12. ADD TO CALENDAR (.ICS FILE GENERATION)
  // ==========================================
  window.downloadIcs = function(eventName, startIsoStr, venue, desc) {
    const startDate = new Date(startIsoStr);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours

    function formatDate(d) {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    }

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Shraddha weds Pranay Wedding//Antigravity//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${eventName} - Shraddha & Pranay Wedding
DESCRIPTION:${desc}
LOCATION:${venue}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventName.replace(/\s+/g, '_')}_Shraddha_Pranay.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playBellChime(523.25, 0.4);
  };

  // ==========================================
  // 13. VENUE DIRECTIONS / MAP MODAL
  // ==========================================
  const mapModal = document.getElementById('mapModal');
  const mapModalAddress = document.getElementById('mapModalAddress');
  const googleMapsExternalLink = document.getElementById('googleMapsExternalLink');

  window.openMapModal = function(venueName, customMapUrl) {
    if (mapModalAddress) mapModalAddress.textContent = venueName;
    if (googleMapsExternalLink) {
      if (customMapUrl) {
        googleMapsExternalLink.href = customMapUrl;
      } else {
        googleMapsExternalLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName)}`;
      }
    }
    if (mapModal) mapModal.classList.remove('hidden');
  };

  window.closeMapModal = function() {
    if (mapModal) mapModal.classList.add('hidden');
  };

  // ==========================================
  // 14. CUSTOMIZATION / PERSONALIZER MODAL
  // ==========================================
  const customizeBtn = document.getElementById('customizeBtn');
  const customizeModal = document.getElementById('customizeModal');
  const customizeForm = document.getElementById('customizeForm');

  if (customizeBtn && customizeModal) {
    customizeBtn.addEventListener('click', () => {
      // Pre-fill inputs with current state
      document.getElementById('inputBrideName').value = weddingState.brideName;
      document.getElementById('inputGroomName').value = weddingState.groomName;
      document.getElementById('inputWeddingDate').value = weddingState.weddingDate;
      document.getElementById('inputWeddingVenue').value = weddingState.weddingVenue;
      document.getElementById('inputHaldiDate').value = weddingState.haldiDate;

      customizeModal.classList.remove('hidden');
    });
  }

  window.closeCustomizeModal = function() {
    if (customizeModal) customizeModal.classList.add('hidden');
  };

  if (customizeForm) {
    customizeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      weddingState.brideName = document.getElementById('inputBrideName').value.trim() || 'Shraddha';
      weddingState.groomName = document.getElementById('inputGroomName').value.trim() || 'Pranay';
      weddingState.weddingDate = document.getElementById('inputWeddingDate').value.trim();
      weddingState.weddingVenue = document.getElementById('inputWeddingVenue').value.trim();
      weddingState.haldiDate = document.getElementById('inputHaldiDate').value.trim();

      // Persist in localStorage
      localStorage.setItem('bride_name', weddingState.brideName);
      localStorage.setItem('groom_name', weddingState.groomName);
      localStorage.setItem('wedding_date', weddingState.weddingDate);
      localStorage.setItem('wedding_venue', weddingState.weddingVenue);
      localStorage.setItem('haldi_date', weddingState.haldiDate);

      updatePageDetails();
      closeCustomizeModal();
      triggerPetalBurst(40, width / 2, height / 2);
    });
  }

});
