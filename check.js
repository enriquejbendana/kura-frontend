fetch('https://kura-frontend.vercel.app')
  .then(r => r.text())
  .then(html => {
    const m = html.match(/src=\"(\/assets\/index-[^\"]+\.js)\"/);
    if (m) {
      fetch('https://kura-frontend.vercel.app' + m[1])
        .then(r => r.text())
        .then(js => {
          console.log('Bundle:', m[1]);
          console.log('Has Buscando resultados:', js.includes('Buscando resultados...'));
          console.log('Has Sincronizando:', js.includes('Sincronizando con los sistemas'));
        });
    }
  });
