const audio       = document.getElementById('audio');
const playBtn     = document.getElementById('play-btn');
const iconPlay    = playBtn.querySelector('.icon-play');
const iconPause   = playBtn.querySelector('.icon-pause');
const progressBar = document.getElementById('progress-bar');
const progressCon = document.getElementById('progress-container');
const currentTime = document.getElementById('current-time');
const durationEl  = document.getElementById('duration');
const rewindBtn   = document.getElementById('rewind-btn');
const forwardBtn  = document.getElementById('forward-btn');
const volumeSlider= document.getElementById('volume');
const trackName   = document.getElementById('track-name');
const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('file-input');

function loadFile(file) {
  if (!file || !file.type.startsWith('audio/')) return;
  const url = URL.createObjectURL(file);
  audio.src = url;
  trackName.textContent = file.name;
  durationEl.textContent = '0:00';
  currentTime.textContent = '0:00';
  progressBar.style.width = '0%';
  audio.load();
  audio.play();
}

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) loadFile(fileInput.files[0]);
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  loadFile(e.dataTransfer.files[0]);
});

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

playBtn.addEventListener('click', () => {
  if (audio.paused) { audio.play(); } else { audio.pause(); }
});

audio.addEventListener('play', () => {
  iconPlay.style.display  = 'none';
  iconPause.style.display = '';
});

audio.addEventListener('pause', () => {
  iconPlay.style.display  = '';
  iconPause.style.display = 'none';
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = pct + '%';
  currentTime.textContent = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = fmt(audio.duration);
  // Show the filename from the first <source>
  const src = audio.querySelector('source')?.src || audio.src;
  if (src) trackName.textContent = decodeURIComponent(src.split('/').pop());
});

audio.addEventListener('ended', () => {
  iconPlay.style.display  = '';
  iconPause.style.display = 'none';
  progressBar.style.width = '0%';
  currentTime.textContent = '0:00';
});

progressCon.addEventListener('click', e => {
  if (!audio.duration) return;
  const rect = progressCon.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

rewindBtn.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardBtn.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});
