// Pre-publish checks for the static site. No dependencies: node scripts/check.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', 'public');
const problems = [];
const walk = (dir) => fs.readdirSync(dir, {withFileTypes: true}).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(root);
const rel = (f) => path.relative(root, f);

// Static assets resolve the same way Cloudflare does: "/" → index.html, "/x" → x.html.
function exists(url) {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  const candidates = clean.endsWith('/') ? [clean + 'index.html'] : [clean, clean + '.html', clean + '/index.html'];
  return candidates.some((c) => fs.existsSync(path.join(root, c)) && fs.statSync(path.join(root, c)).isFile());
}

for (const file of files.filter((f) => /\.(html|css|xml|txt)$/.test(f))) {
  const text = fs.readFileSync(file, 'utf8');
  const name = rel(file);
  if (file.endsWith('.html')) {
    if (!/<title>[^<]+<\/title>/.test(text)) problems.push(`${name}: missing <title>`);
    if (!/<html[^>]*\slang="/.test(text)) problems.push(`${name}: missing <html lang>`);
  }
  // Local references (absolute paths and same-folder relative paths) must exist.
  for (const [, url] of text.matchAll(/(?:href|src)="([^"]+)"|url\(['"]?([^'")]+)['"]?\)/g)) {
    if (!url || /^(https?:|mailto:|data:|#|javascript:)/.test(url)) continue;
    const target = url.startsWith('/') ? url : '/' + path.posix.join(path.posix.dirname(name), url);
    if (!exists(target)) problems.push(`${name}: broken reference ${url}`);
  }
  // Public repository hygiene: no personal email addresses or credentials in shipped files.
  for (const [m] of text.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) problems.push(`${name}: email address ${m}`);
  for (const re of [/gh[opsu]_[A-Za-z0-9]{30,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./, /sb_secret_[A-Za-z0-9_-]{10,}/])
    if (re.test(text)) problems.push(`${name}: looks like a credential (${re.source.slice(0, 20)}…)`);
}

// The homepage is bilingual: every Chinese span needs an English partner.
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const zh = (home.match(/class="zh"/g) || []).length, en = (home.match(/class="en"/g) || []).length;
if (zh !== en) problems.push(`index.html: ${zh} zh spans vs ${en} en spans`);
for (const [, s] of home.matchAll(/<span class="en">([^<]*)<\/span>/g)) if (/[一-鿿]/.test(s)) problems.push(`index.html: Chinese text inside an English span: ${s}`);

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`OK: ${files.length} files, ${zh} bilingual pairs, all local references resolve.`);
