import yaml from 'js-yaml';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const distHtml = readFileSync('dist/index.html', 'utf8');
const policyDir = 'policies';
const files = readdirSync(policyDir).filter(f => f.endsWith('.policy.yaml'));

for (const file of files) {
  const slug = file.replace('.policy.yaml', '');
  const policy = yaml.load(readFileSync(join(policyDir, file), 'utf8'));
  const { title, subtitle, scope } = policy.meta;

  const ogTitle = title;
  const ogDesc = `${subtitle} — ${scope}`;
  const ogImage = `/og-${slug}.jpg`;
  const pageTitle = `${title} — ${subtitle}`;

  let html = distHtml;

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);

  // Replace OG tags
  html = html.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${ogTitle}"`);
  html = html.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${ogDesc}"`);
  html = html.replace(/property="og:image" content="[^"]*"/, `property="og:image" content="${ogImage}"`);

  // Replace Twitter tags
  html = html.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${ogTitle}"`);
  html = html.replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${ogDesc}"`);
  html = html.replace(/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${ogImage}"`);

  const dir = join('dist', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`Generated dist/${slug}/index.html`);
}
