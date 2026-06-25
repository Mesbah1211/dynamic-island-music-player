const seekBar = document.getElementById('seek-bar');
const progressFill = seekBar?.querySelector('i');
const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('total-time');
const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
const themeMap = {
  violet: 'violet',
  orange: 'orange',
  gray: 'gray',
  'smokey-black': 'smokey-black',
};

const durationSeconds = 238;
let currentSeconds = 102;

function formatTime(seconds) {
  const value = Math.max(0, Math.min(durationSeconds, Math.round(seconds)));
  const minutes = Math.floor(value / 60);
  const remainder = String(value % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function renderProgress() {
  const percent = (currentSeconds / durationSeconds) * 100;
  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }
  if (currentTime) {
    currentTime.textContent = formatTime(currentSeconds);
  }
  if (seekBar) {
    seekBar.setAttribute('aria-valuenow', String(Math.round(currentSeconds)));
  }
  if (totalTime) {
    totalTime.textContent = formatTime(durationSeconds);
  }
}

function seekFromClientX(clientX) {
  if (!seekBar) return;
  const rect = seekBar.getBoundingClientRect();
  const offset = clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, offset / rect.width));
  currentSeconds = ratio * durationSeconds;
  renderProgress();
}

if (seekBar) {
  seekBar.addEventListener('click', (event) => {
    seekFromClientX(event.clientX);
  });

  seekBar.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 15 : 5;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      currentSeconds -= step;
      renderProgress();
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      currentSeconds += step;
      renderProgress();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      currentSeconds = 0;
      renderProgress();
    }
    if (event.key === 'End') {
      event.preventDefault();
      currentSeconds = durationSeconds;
      renderProgress();
    }
  });
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  themeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.theme === theme);
    button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
  });
}

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = themeMap[button.dataset.theme];
    if (theme) {
      setTheme(theme);
    }
  });
});

setTheme('smokey-black');
renderProgress();
