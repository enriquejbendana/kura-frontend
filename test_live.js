import handler from './api/live-search.js';
const req = { method: 'GET', query: { q: 'ibuprofeno' } };
const res = { status: (c) => ({ json: (d) => console.log(JSON.stringify(d, null, 2)) }) };
handler(req, res).then(() => process.exit(0));
