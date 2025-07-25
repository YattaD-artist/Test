document.addEventListener("DOMContentLoaded", () => {
  let comicPages = [];
  let currentPage = 0;

  // ===== DOM elements =====
  const viewer = document.getElementById("comicViewer");
  const deck = document.getElementById("comicDeck");
  const audio = document.getElementById("kaia-audio");
  const wowAudio = document.getElementById("wow-audio");
  const floatingIcons = document.querySelector('.floating-icons');
  const leftImage = document.querySelector('.side-image.left');
  const rightImage = document.querySelector('.side-image.right');
  const mainIcons = document.querySelector(".icons");
  const wrapper = document.querySelector('.images-wrapper');
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const hint = document.getElementById('themeHint');
  const sparklesContainer = document.getElementById("gold-sparkles");

  // ===== Theme + Sparkles =====
  function createSparkles() {
    if (!sparklesContainer) return;
    sparklesContainer.innerHTML = '';
    const sparkleCount = 30;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle");
      if (Math.random() < 0.5) sparkle.classList.add("faint");
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.bottom = `-10px`;
      sparkle.style.animationDuration = `${10 + Math.random() * 10}s`;
      sparkle.style.animationDelay = `${Math.random() * 20}s`;
      const size = 6 + Math.random() * 8;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparklesContainer.appendChild(sparkle);
    }
  }

  function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeIcon.classList.toggle('fa-sun', !isDark);
    themeIcon.classList.toggle('fa-moon', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      createSparkles();
    } else if (sparklesContainer) {
      sparklesContainer.innerHTML = '';
    }
  }

  // Initial theme setup
  if (toggleBtn && themeIcon) {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    setTheme(isDarkMode);
toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(!isDark);
});


    // Hide hint when user interacts
    toggleBtn.addEventListener('mouseenter', () => hint?.classList.add('hidden'));
    toggleBtn.addEventListener('touchstart', () => hint?.classList.add('hidden'), { passive: true });

    document.addEventListener('mousemove', (e) => {
  if (!toggleBtn || !hint || hint.classList.contains('hidden')) return;

  const rect = toggleBtn.getBoundingClientRect();
  const margin = 80; // phạm vi "gần"

  if (
    e.clientX > rect.left - margin &&
    e.clientX < rect.right + margin &&
    e.clientY > rect.top - margin &&
    e.clientY < rect.bottom + margin
  ) {
    hint.classList.add('hidden');
  }
});
  }

  // ===== Scroll effect =====
  const maxMargin = window.innerHeight * 1.2;
  const minMargin = 32;
  const maxScroll = 300;
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / maxScroll, 1);

    const mainIconsBottom = mainIcons?.getBoundingClientRect().bottom || 0;
    const shouldShowFloatingIcons = mainIconsBottom < 0 || scrollY > 300;

    if (shouldShowFloatingIcons) {
      floatingIcons?.classList.add("visible");
      leftImage?.classList.add("slide-out-on-icons");
      rightImage?.classList.add("slide-out-on-icons");
    } else {
      floatingIcons?.classList.remove("visible");
      leftImage?.classList.remove("slide-out-on-icons");
      rightImage?.classList.remove("slide-out-on-icons");
    }

    if (hint && Math.abs(scrollY - lastScrollY) > 10) {
      hint.classList.add('hidden');
    }
    lastScrollY = scrollY;

    const newMargin = Math.max(minMargin, maxMargin - scrollY);
    if (wrapper) wrapper.style.marginTop = `${newMargin}px`;
  });

  // ===== Copy email =====
  window.copyEmail = function(element) {
    const email = "ttien39169@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      element.classList.add("show-note");
      setTimeout(() => element.classList.remove("show-note"), 2000);
    }).catch(err => console.error("Lỗi khi copy email:", err));
  };

  // ===== Zoom ảnh =====
  window.zoomImage = function(img) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0, 0, 0, 0.85)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.cursor = 'zoom-out';
    overlay.style.zIndex = 9999;

    const zoomedImg = document.createElement('img');
    zoomedImg.src = img.src;
    zoomedImg.alt = img.alt;
    zoomedImg.style.maxWidth = '90vw';
    zoomedImg.style.maxHeight = '90vh';
    zoomedImg.style.borderRadius = '12px';
    zoomedImg.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
    zoomedImg.style.transition = 'transform 0.3s ease';
    zoomedImg.style.transform = 'scale(0.95)';
    setTimeout(() => zoomedImg.style.transform = 'scale(1)', 10);

    overlay.appendChild(zoomedImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  };

  // ===== Comic logic =====
  function renderDeck(direction = null) {
    const prevImgs = Array.from(deck.querySelectorAll("img"));
    const outgoing = prevImgs.find(img => img.classList.contains("active"));
    if (direction && outgoing) {
      outgoing.classList.remove("active");
      outgoing.classList.add(direction === "left" ? "slide-out-left" : "slide-out-right");
    }
    updateDeck();
  }

  function updateDeck() {
    deck.innerHTML = "";
    comicPages.forEach((src, i) => {
      if (i < currentPage - 1 || i > currentPage + 1) return;
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Page ${i + 1}`;
      img.className = i === currentPage ? "active" : i === currentPage - 1 ? "left" : "right";
      deck.appendChild(img);
    });
  }

  function openComicGallery() {
    currentPage = 0;
    viewer.style.display = "flex";
    renderDeck();
  }

  function fadeOutAudio(audioEl) {
    if (!audioEl || audioEl.paused) return;
    let vol = audioEl.volume;
    const fade = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        audioEl.volume = vol;
      } else {
        clearInterval(fade);
        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.volume = 1.0;
      }
    }, 40);
  }

  function closeComicGallery() {
    viewer.style.display = "none";
    fadeOutAudio(audio);
    fadeOutAudio(wowAudio);
  }

  document.querySelector(".close-btn").addEventListener("click", closeComicGallery);

  if (viewer) {
    viewer.addEventListener("click", handleClick);
  }

  function handleClick(e) {
    if (e.target === viewer || e.target.classList.contains('comic-blur-bg')) {
      closeComicGallery();
      return;
    }
    const x = e.clientX;
    const half = window.innerWidth / 2;
    if (x < half && currentPage > 0) {
      currentPage--;
      renderDeck("right");
    } else if (x >= half && currentPage < comicPages.length - 1) {
      currentPage++;
      renderDeck("left");
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && currentPage < comicPages.length - 1) {
      currentPage++;
      renderDeck("left");
    } else if (e.key === "ArrowLeft" && currentPage > 0) {
      currentPage--;
      renderDeck("right");
    } else if (e.key === "Escape") {
      closeComicGallery();
    }
  });

  let xDown = null;
  viewer.addEventListener("touchstart", evt => {
    xDown = evt.touches[0].clientX;
  }, false);
  viewer.addEventListener("touchend", evt => {
    if (!xDown) return;
    const xUp = evt.changedTouches[0].clientX;
    const xDiff = xDown - xUp;
    if (xDiff > 50 && currentPage < comicPages.length - 1) {
      currentPage++;
      renderDeck("left");
    } else if (xDiff < -50 && currentPage > 0) {
      currentPage--;
      renderDeck("right");
    }
    xDown = null;
  }, false);

  // ===== Comic button events =====
  document.getElementById("btn-read-wow").addEventListener("click", () => {
    fadeOutAudio(audio);
    fadeOutAudio(wowAudio);
    if (wowAudio) {
      wowAudio.volume = 1.0;
      wowAudio.play().catch(err => console.warn("WOW audio error:", err));
    }
    comicPages = [
      "WOW/01.webp", "WOW/02.webp", "WOW/03.webp",
      "WOW/04.webp", "WOW/05.webp", "WOW/06.webp"
    ];
    openComicGallery();
  });

  document.getElementById("btn-read-kaia").addEventListener("click", () => {
    fadeOutAudio(wowAudio);
    if (audio) {
      audio.volume = 1.0;
      audio.play().catch(err => console.warn("KAIA audio error:", err));
    }
    comicPages = [
      "KAYA/01.webp", "KAYA/02.webp", "KAYA/03.webp",
      "KAYA/04.webp", "KAYA/05.webp"
    ];
    openComicGallery();
  });

  document.getElementById("btn-read-ava").addEventListener("click", () => {
    fadeOutAudio(audio);
    fadeOutAudio(wowAudio);
    comicPages = [
      "AVA/01.webp", "AVA/02.webp", "AVA/03.webp", "AVA/04.webp",
      "AVA/05.webp", "AVA/06.webp", "AVA/07.webp", "AVA/08.webp",
      "AVA/09.webp", "AVA/10.webp", "AVA/11.webp"
    ];
    openComicGallery();
  });

  // ===== Preload images =====
  const preloadImages = [
    "WOW/01.webp", "WOW/02.webp", "WOW/03.webp", "WOW/04.webp", "WOW/05.webp", "WOW/06.webp",
    "KAYA/01.webp", "KAYA/02.webp", "KAYA/03.webp", "KAYA/04.webp", "KAYA/05.webp",
    "AVA/01.webp", "AVA/02.webp", "AVA/03.webp", "AVA/04.webp", "AVA/05.webp",
    "AVA/06.webp", "AVA/07.webp", "AVA/08.webp", "AVA/09.webp", "AVA/10.webp", "AVA/11.webp"
  ];
  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
});
