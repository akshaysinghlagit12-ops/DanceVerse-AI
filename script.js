
const studioAvatar = document.getElementById("studioAvatar");
const heroAvatar = document.getElementById("heroAvatar");
const selectedStyle = document.getElementById("selectedStyle");
const avatarStatus = document.getElementById("avatarStatus");
const colorName = document.getElementById("colorName");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const danceVideo = document.getElementById("danceVideo");
const videoPreview = document.getElementById("videoPreview");
const fileMessage = document.getElementById("fileMessage");
const toast = document.getElementById("toast");

let isDancing = false;
let toastTimeout;

// Show a small notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// Avatar color options
const colors = {
  "#00c9e8": "Electric Cyan",
  "#00f5c4": "Neon Mint",
  "#ff6b35": "Neon Orange",
  "#ff477e": "Hot Pink",
  "#f5f7fa": "Pearl White"
};

document.querySelectorAll(".color-swatch").forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.dataset.color;

    document.documentElement.style.setProperty("--avatar-color", color);
    studioAvatar.style.setProperty("--avatar-color", color);
    heroAvatar.style.setProperty("--avatar-color", color);

    document.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.classList.remove("selected");
    });

    button.classList.add("selected");
    colorName.textContent = colors[color] || "Custom Color";

    showToast(`${colorName.textContent} selected!`);
  });
});

// Dance style selection
document.querySelectorAll(".style-card").forEach((button) => {
  button.addEventListener("click", () => {
    const style = button.dataset.style;

    document.querySelectorAll(".style-card").forEach((card) => {
      card.classList.remove("active");
    });

    button.classList.add("active");
    selectedStyle.textContent = style;

    // Change demo animation speed for each style
    if (style === "Hip-Hop") {
      studioAvatar.style.setProperty("--dance-speed", "0.65s");
    } else if (style === "Classical") {
      studioAvatar.style.setProperty("--dance-speed", "1.5s");
    } else if (style === "Freestyle") {
      studioAvatar.style.setProperty("--dance-speed", "0.85s");
    } else {
      studioAvatar.style.setProperty("--dance-speed", "1.05s");
    }

    showToast(`${style} style selected!`);
  });
});

// Start avatar animation
startButton.addEventListener("click", () => {
  isDancing = true;

  studioAvatar.classList.add("dancing");
  studioAvatar.classList.remove("paused");

  avatarStatus.textContent = "Dancing";
  startButton.textContent = "▶ Dancing...";

  showToast("Your avatar is dancing!");
});

// Pause avatar animation
pauseButton.addEventListener("click", () => {
  isDancing = false;

  studioAvatar.classList.remove("dancing");
  studioAvatar.classList.remove("paused");

  avatarStatus.textContent = "Paused";
  startButton.textContent = "▶ Start Dancing";

  showToast("Dance session paused.");
});

// Upload and preview a dance video
danceVideo.addEventListener("change", () => {
  const file = danceVideo.files[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime"
  ];

  const fileName = file.name.toLowerCase();
  const allowedExtensions = [".mp4", ".webm", ".mov"];

  const validType =
    allowedTypes.includes(file.type) ||
    allowedExtensions.some((extension) => fileName.endsWith(extension));

  if (!validType) {
    danceVideo.value = "";
    fileMessage.textContent = "Please choose an MP4, WebM or MOV video.";
    showToast("Unsupported video format.");
    return;
  }

  // Maximum size: 100 MB
  if (file.size > 100 * 1024 * 1024) {
    danceVideo.value = "";
    fileMessage.textContent = "Your video is larger than 100 MB.";
    showToast("Please choose a smaller video.");
    return;
  }

  // Release the previous preview URL, if any
  if (videoPreview.dataset.objectUrl) {
    URL.revokeObjectURL(videoPreview.dataset.objectUrl);
  }

  const videoURL = URL.createObjectURL(file);

  videoPreview.src = videoURL;
  videoPreview.dataset.objectUrl = videoURL;
  videoPreview.hidden = false;

  fileMessage.textContent =
    `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;

  showToast("Video uploaded for preview!");
});

// Mobile navigation menu
const menuButton = document.getElementById("menuButton");
const nav = document.querySelector(".navbar nav");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("open");

  const isOpen = nav.classList.contains("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "✕" : "☰";
});

// Close mobile menu after clicking a link
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
  });
});

// Stop animation when the page is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isDancing) {
    studioAvatar.classList.remove("dancing");
    avatarStatus.textContent = "Paused";
    startButton.textContent = "▶ Start Dancing";
    isDancing = false;
  }
});

// Clean up the temporary video preview URL
window.addEventListener("beforeunload", () => {
  if (videoPreview.dataset.objectUrl) {
    URL.revokeObjectURL(videoPreview.dataset.objectUrl);
  }
});

console.log("DanceVerse AI loaded successfully!");
