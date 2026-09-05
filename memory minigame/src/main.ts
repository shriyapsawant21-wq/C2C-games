import './style.css';

type Phase = 'ready' | 'showing' | 'playing' | 'complete' | 'failed';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('App container is missing');
const root = app;

let level = 1;
let phase: Phase = 'ready';
let pattern = new Set<number>();
let selected = new Set<number>();
let timer: number | undefined;
let completedLevels = 0;
let bestLevel = Number(localStorage.getItem('memory-grid-best') ?? 0);
let lives = 3;
let wrongTile: number | null = null;

// Keep a square board, enlarging it every four levels:
// 3×3 → 4×4 → 5×5 → …
const gridSize = () => Math.min(10, 3 + Math.floor((level - 1) / 4));
const targetCount = () => Math.min(cellCount(), 3 + Math.floor((level - 1) ** 0.72));
const cellCount = () => gridSize() ** 2;

function makePattern() {
  const spaces = Array.from({ length: cellCount() }, (_, index) => index);
  for (let i = spaces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spaces[i], spaces[j]] = [spaces[j], spaces[i]];
  }
  return new Set(spaces.slice(0, Math.min(targetCount(), spaces.length)));
}

function message() {
  if (phase === 'ready') return 'Memorize the squares.';
  if (phase === 'showing') return 'Memorize the highlighted squares…';
  if (phase === 'playing') return `${targetCount() - selected.size} square${targetCount() - selected.size === 1 ? '' : 's'} remaining`;
  if (phase === 'complete') return 'Correct!';
  return `You reached level ${Math.max(1, level)}.`;
}

function render() {
  const boardVisible = phase !== 'ready' && phase !== 'failed';
  const shownLevel = phase === 'complete' ? level - 1 : level;
  root.innerHTML = boardVisible ? `
    <section class="board-screen" aria-live="polite">
      <div class="game-status"><span class="level-badge">Level ${shownLevel}</span><span class="lives-label"><span class="lives-text">Lives</span>${Array.from({ length: 3 }, (_, i) => `
        <span class="heart ${i < lives ? 'active' : 'empty'}" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="heart-svg" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
      `).join('')}</span></div>
      <div class="memory-board" style="--columns:${gridSize()}" role="grid" aria-label="Memory squares">
          ${Array.from({ length: cellCount() }, (_, index) => {
            const isLit = phase === 'showing' && pattern.has(index);
            const isPicked = selected.has(index);
            const isWrong = wrongTile === index;
            return `<button class="cell ${isLit ? 'lit' : ''} ${isPicked ? 'picked' : ''} ${isWrong ? 'wrong' : ''}" data-cell="${index}" aria-label="Square ${index + 1}" ${phase !== 'playing' ? 'disabled' : ''}></button>`;
          }).join('')}</div>
      <button class="leave-button" id="exit">Leave Game</button>
    </section>
  ` : `
    <section class="game-shell" aria-live="polite">
      <header class="topbar"><a class="brand" href="#">MEMORY<span>GRID</span></a><div class="score">BEST <strong>${bestLevel}</strong></div></header>
      <div class="content">
        <p class="eyebrow">VISUAL MEMORY</p>
        <h1>${phase === 'failed' ? 'Game over' : 'Memory challenge'}</h1>
        <p class="instruction">${phase === 'failed' ? message() : 'Memorize the squares, then click them in any order.'}</p>
        <div class="intro-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <button class="action" id="action">${phase === 'failed' ? 'Try again' : 'Start game'}</button>
      </div>
    </section>`;

  document.querySelector<HTMLButtonElement>('#action')?.addEventListener('click', start);
  document.querySelector<HTMLButtonElement>('#exit')?.addEventListener('click', leave);
  document.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach(cell => {
    cell.addEventListener('click', () => select(Number(cell.dataset.cell)));
  });
}

function start() {
  window.clearTimeout(timer);
  if (phase === 'failed') {
    level = 1;
    completedLevels = 0;
    lives = 3;
  }
  pattern = makePattern();
  selected = new Set();
  wrongTile = null;
  phase = 'showing';
  render();
  timer = window.setTimeout(() => {
    phase = 'playing';
    render();
  }, Math.max(900, 1800 - level * 35));
}

function select(index: number) {
  if (phase !== 'playing') return;
  if (!pattern.has(index)) {
    lives--;
    wrongTile = index;
    phase = 'showing';
    render();
    timer = window.setTimeout(() => {
      wrongTile = null;
      if (lives === 0) {
        phase = 'failed';
        render();
        return;
      }
      selected = new Set();
      render();
      timer = window.setTimeout(() => { phase = 'playing'; render(); }, 800);
    }, 450);
    return;
  }
  selected.add(index);
  if (selected.size === pattern.size) {
    phase = 'complete';
    completedLevels = level;
    bestLevel = Math.max(bestLevel, completedLevels);
    localStorage.setItem('memory-grid-best', String(bestLevel));
    level++;
    render();
    timer = window.setTimeout(start, 850);
    return;
  }
  render();
}

function leave() {
  window.clearTimeout(timer);
  level = 1;
  completedLevels = 0;
  lives = 3;
  pattern = new Set();
  selected = new Set();
  wrongTile = null;
  phase = 'ready';
  render();
}

render();
