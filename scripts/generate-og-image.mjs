import sharp from 'sharp';
import yaml from 'js-yaml';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const W = 1200;
const H = 630;

const policyDir = 'policies';
const files = readdirSync(policyDir).filter(f => f.endsWith('.policy.yaml'));

const allPolicies = files.map(file => {
  const slug = file.replace('.policy.yaml', '');
  const data = yaml.load(readFileSync(join(policyDir, file), 'utf8'));
  return { slug, meta: data.meta };
});

// Per-policy OG images
for (const { slug, meta } of allPolicies) {
  const { title, subtitle, scope, background_image } = meta;

  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)"/>
  <text x="80" y="240" font-family="serif" font-size="72" font-weight="700" fill="#f7f6f4" letter-spacing="-1">
    ${title}
  </text>
  <text x="80" y="320" font-family="serif" font-size="42" font-weight="400" font-style="italic" fill="rgba(247,246,244,0.65)">
    ${subtitle}
  </text>
  <text x="80" y="400" font-family="monospace" font-size="20" letter-spacing="5" fill="rgba(247,246,244,0.4)">
    ${scope.toUpperCase()}
  </text>
  <rect x="80" y="550" width="140" height="2" fill="rgba(247,246,244,0.2)"/>
</svg>`;

  const bgPath = background_image?.startsWith('/')
    ? `public${background_image}`
    : background_image;

  if (bgPath) {
    await sharp(bgPath)
      .resize(W, H, { fit: 'cover' })
      .modulate({ brightness: 0.3 })
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 85 })
      .toFile(`public/og-${slug}.jpg`);

    console.log(`Generated public/og-${slug}.jpg`);
  }
}

// Combined homepage OG image — split into columns, one per policy
const colW = Math.floor(W / allPolicies.length);
const composites = [];

for (let i = 0; i < allPolicies.length; i++) {
  const { meta } = allPolicies[i];
  const bgPath = meta.background_image?.startsWith('/')
    ? `public${meta.background_image}`
    : meta.background_image;

  if (bgPath) {
    const col = await sharp(bgPath)
      .resize(colW, H, { fit: 'cover' })
      .modulate({ brightness: 0.3 })
      .toBuffer();

    composites.push({ input: col, top: 0, left: i * colW });
  }
}

// Build text overlay — vertically centered layout
const blockHeight = allPolicies.length * 100 + 40; // titles + label
const startY = Math.floor((H - blockHeight) / 2) + 30;

const titleLines = allPolicies.map((p, i) => {
  const y = startY + 60 + i * 100;
  return `
    <text x="100" y="${y}" font-family="serif" font-size="52" font-weight="700" fill="#f7f6f4" letter-spacing="-1">
      ${p.meta.title}
    </text>
    <text x="100" y="${y + 38}" font-family="serif" font-size="24" font-weight="400" font-style="italic" fill="rgba(247,246,244,0.5)">
      ${p.meta.subtitle}
    </text>`;
}).join('');

const homeSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)"/>
  <text x="100" y="${startY}" font-family="monospace" font-size="13" letter-spacing="6" fill="rgba(247,246,244,0.35)">
    POLICY PROPOSALS
  </text>
  <rect x="100" y="${startY + 14}" width="60" height="1" fill="rgba(247,246,244,0.15)"/>
  ${titleLines}
  <rect x="100" y="${H - 60}" width="80" height="1" fill="rgba(247,246,244,0.12)"/>
</svg>`;

composites.push({ input: Buffer.from(homeSvg), top: 0, left: 0 });

await sharp({ create: { width: W, height: H, channels: 3, background: '#1a1917' } })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile('public/og-index.jpg');

console.log('Generated public/og-index.jpg');
