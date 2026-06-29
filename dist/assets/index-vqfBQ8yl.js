(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#app`);e&&(e.innerHTML=`
    <main class="app-shell">
      <header class="app-header">
        <h1>Clima</h1>
      </header>

      <section class="search-area" aria-label="Busca de cidade">
        <input type="text" placeholder="Digite o nome da cidade" aria-label="Nome da cidade" />
        <button type="button">Buscar</button>
      </section>

      <section class="weather-card" aria-label="Previsão do tempo">
        <aside class="weather-sidebar" aria-label="Resumo do tempo">
          <div class="sidebar-content" data-sidebar="content"></div>
        </aside>
        <section class="weather-main" aria-label="Detalhes do tempo">
          <div class="main-content" data-main="content"></div>
        </section>
      </section>
    </main>
  `);