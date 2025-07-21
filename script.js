document.addEventListener("DOMContentLoaded", () => {
  let comicPages = [];
  let currentPage = 0;
  const viewer = document.getElementById("comicViewer");
  const deck = document.getElementById("comicDeck");
  const audio = document.getElementById("kaia-audio");
  const wowAudio = document.getElementById("wow-audio");
  const target = document.querySelector('#portfolio-header');
  const floatingIcons = document.querySelector('.floating-icons');

  if (target && floatingIcons) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        floatingIcons.style.display = entry.isIntersecting ? 'none' : 'flex';
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
  }
  
window.copyEmail = function(element) {
  const email = "ttien39169@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    element.classList.add("show-note");
    setTimeout(() => {
      element.classList.remove("show-note");
    }, 2000);
  }).catch(err => {
    console.error("Lỗi khi copy email:", err);
  });
};

  window.addEventListener("scroll", () => {
  const floating = document.querySelector(".floating-icons");
  const mainIcons = document.querySelector(".icons");

  if (!floating || !mainIcons) return;

  const mainIconsBottom = mainIcons.getBoundingClientRect().bottom;

  if (mainIconsBottom < 0) {
    floating.classList.add("visible");
  } else {
    floating.classList.remove("visible");
  }
});
  
  const wrapper = document.querySelector('.images-wrapper');
  const maxMargin = window.innerHeight * 1.2; // 120vh
  const minMargin = 32; // 2em ≈ 32px

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Tính toán margin mới – giảm dần theo cuộn
    const newMargin = Math.max(minMargin, maxMargin - scrollY);
    
    wrapper.style.marginTop = `${newMargin}px`;
  });
  
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
    setTimeout(() => {
      zoomedImg.style.transform = 'scale(1)';
    }, 10);

    overlay.appendChild(zoomedImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  };

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
  
    // ✅ Preload toàn bộ ảnh truyện (WOW, KAYA, AVA)
  const preloadImages = [
    // WOW
    "WOW/01.webp", "WOW/02.webp", "WOW/03.webp",
    "WOW/04.webp", "WOW/05.webp", "WOW/06.webp",

    // KAYA
    "KAYA/01.webp", "KAYA/02.webp", "KAYA/03.webp",
    "KAYA/04.webp", "KAYA/05.webp",

    // AVA
    "AVA/01.webp", "AVA/02.webp", "AVA/03.webp", "AVA/04.webp",
    "AVA/05.webp", "AVA/06.webp", "AVA/07.webp", "AVA/08.webp",
    "AVA/09.webp", "AVA/10.webp", "AVA/11.webp"
  ];

  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
  
});
