let comicPages = [];
let currentPage = 0;
const viewer = document.getElementById("comicViewer");
const deck = document.getElementById("comicDeck");

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

    if (i === currentPage) {
      img.classList.add("active");
    } else if (i === currentPage - 1) {
      img.classList.add("left");
    } else if (i === currentPage + 1) {
      img.classList.add("right");
    }

    deck.appendChild(img);
  });
}

function openComicGallery() {
  currentPage = 0;
  viewer.style.display = "flex";
  renderDeck();
}

function closeComicGallery() {
  viewer.style.display = "none";
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

viewer.addEventListener("click", handleClick);
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

viewer.addEventListener("touchstart", handleTouchStart, false);
viewer.addEventListener("touchend", handleTouchEnd, false);

let xDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
}

function handleTouchEnd(evt) {
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
}

function zoomImage(img) {
  const overlay = document.createElement('div');
  overlay.classList.add('comic-viewer');
  const zoomed = document.createElement('img');
  zoomed.src = img.src;
  zoomed.style.maxWidth = '90vw';
  zoomed.style.maxHeight = '90vh';
  zoomed.style.borderRadius = '8px';
  overlay.appendChild(zoomed);
  overlay.addEventListener('click', () => document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}

const preload = new Image();
preload.src = comicPages[0];

document.getElementById("btn-read-wow").addEventListener("click", () => {
  comicPages = [
    "WOW/01.webp", "WOW/02.webp", "WOW/03.webp",
    "WOW/04.webp", "WOW/05.webp", "WOW/06.webp"
  ];
  openComicGallery();
});

document.getElementById("btn-read-kaia").addEventListener("click", () => {
  comicPages = [
    "KAYA/01.webp", "KAYA/02.webp", "KAYA/03.webp",
    "KAYA/04.webp", "KAYA/05.webp"
  ];
  openComicGallery();
});

document.getElementById("btn-read-ava").addEventListener("click", () => {
  comicPages = [
    "AVA/01.webp", "AVA/02.webp", "AVA/03.webp", "AVA/04.webp",
    "AVA/05.webp", "AVA/06.webp", "AVA/07.webp", "AVA/08.webp",
    "AVA/09.webp", "AVA/10.webp", "AVA/11.webp"
  ];
  openComicGallery();
});
