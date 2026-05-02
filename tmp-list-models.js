const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const contents = fs.readFileSync('.env.local', 'utf8');
const env = contents.split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
  const idx = line.indexOf('=');
  if (idx === -1) return acc;
  const key = line.slice(0, idx).trim();
  let value = line.slice(idx + 1).trim();
  if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
  acc[key] = value;
  return acc;
}, {});
const key = env.GOOGLE_GENERATIVE_AI_API_KEY || env.GEMINI_API_KEY;
if (!key) {
  console.error('no key');
  process.exit(1);
}
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(key))
  .then(r => r.text().then(t => { console.log('status', r.status); console.log(t); }))
  .catch(e => { console.error(e); process.exit(1); });
