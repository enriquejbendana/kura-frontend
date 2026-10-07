
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('dist/index.html', 'utf8');
const jsFiles = fs.readdirSync('dist/assets').filter(f => f.endsWith('.js'));

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });

dom.window.addEventListener('error', (event) => {
  console.error('CRITICAL RUNTIME ERROR:', event.error);
});
dom.window.addEventListener('unhandledrejection', (event) => {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

// Polyfills
dom.window.fetch = () => Promise.resolve({ json: () => Promise.resolve([]) });
dom.window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });

// Load scripts
jsFiles.forEach(file => {
  const code = fs.readFileSync('dist/assets/' + file, 'utf8');
  try {
    dom.window.eval(code);
  } catch(e) {
    console.error('Error evaluating ' + file + ':', e);
  }
});

setTimeout(() => {
  const root = dom.window.document.getElementById('root');
  console.log('Root HTML length:', root ? root.innerHTML.length : 'No root');
  console.log('App loaded successfully without crash if no errors above.');
}, 1000);

