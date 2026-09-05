(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))d(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&d(u)}).observe(document,{childList:!0,subtree:!0});function a(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function d(t){if(t.ep)return;t.ep=!0;const r=a(t);fetch(t.href,r)}})();const w=document.querySelector("#app");if(!w)throw new Error("App container is missing");const L=w;let o=1,e="ready",m=new Set,l=new Set,c,g=0,p=Number(localStorage.getItem("memory-grid-best")??0),f=3,h=null;const b=()=>Math.min(10,3+Math.floor((o-1)/4)),v=()=>Math.min(y(),3+Math.floor((o-1)**.72)),y=()=>b()**2;function $(){const i=Array.from({length:y()},(n,a)=>a);for(let n=i.length-1;n>0;n--){const a=Math.floor(Math.random()*(n+1));[i[n],i[a]]=[i[a],i[n]]}return new Set(i.slice(0,Math.min(v(),i.length)))}function q(){return e==="ready"?"Memorize the squares.":e==="showing"?"Memorize the highlighted squares…":e==="playing"?`${v()-l.size} square${v()-l.size===1?"":"s"} remaining`:e==="complete"?"Correct!":`You reached level ${Math.max(1,o)}.`}function s(){var a,d;const i=e!=="ready"&&e!=="failed",n=e==="complete"?o-1:o;L.innerHTML=i?`
    <section class="board-screen" aria-live="polite">
      <div class="game-status"><span class="level-badge">Level ${n}</span><span class="lives-label"><span class="lives-text">Lives</span>${Array.from({length:3},(t,r)=>`
        <span class="heart ${r<f?"active":"empty"}" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="heart-svg" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
      `).join("")}</span></div>
      <div class="memory-board" style="--columns:${b()}" role="grid" aria-label="Memory squares">
          ${Array.from({length:y()},(t,r)=>{const u=e==="showing"&&m.has(r),S=l.has(r);return`<button class="cell ${u?"lit":""} ${S?"picked":""} ${h===r?"wrong":""}" data-cell="${r}" aria-label="Square ${r+1}" ${e!=="playing"?"disabled":""}></button>`}).join("")}</div>
      <button class="leave-button" id="exit">Leave Game</button>
    </section>
  `:`
    <section class="game-shell" aria-live="polite">
      <header class="topbar"><a class="brand" href="#">MEMORY<span>GRID</span></a><div class="score">BEST <strong>${p}</strong></div></header>
      <div class="content">
        <p class="eyebrow">VISUAL MEMORY</p>
        <h1>${e==="failed"?"Game over":"Memory challenge"}</h1>
        <p class="instruction">${e==="failed"?q():"Memorize the squares, then click them in any order."}</p>
        <div class="intro-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <button class="action" id="action">${e==="failed"?"Try again":"Start game"}</button>
      </div>
    </section>`,(a=document.querySelector("#action"))==null||a.addEventListener("click",M),(d=document.querySelector("#exit"))==null||d.addEventListener("click",z),document.querySelectorAll("[data-cell]").forEach(t=>{t.addEventListener("click",()=>T(Number(t.dataset.cell)))})}function M(){window.clearTimeout(c),e==="failed"&&(o=1,g=0,f=3),m=$(),l=new Set,h=null,e="showing",s(),c=window.setTimeout(()=>{e="playing",s()},Math.max(900,1800-o*35))}function T(i){if(e==="playing"){if(!m.has(i)){f--,h=i,e="showing",s(),c=window.setTimeout(()=>{if(h=null,f===0){e="failed",s();return}l=new Set,s(),c=window.setTimeout(()=>{e="playing",s()},800)},450);return}if(l.add(i),l.size===m.size){e="complete",g=o,p=Math.max(p,g),localStorage.setItem("memory-grid-best",String(p)),o++,s(),c=window.setTimeout(M,850);return}s()}}function z(){window.clearTimeout(c),o=1,g=0,f=3,m=new Set,l=new Set,h=null,e="ready",s()}s();
