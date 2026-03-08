import sharp from 'sharp';
import yaml from 'js-yaml';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const W = 1200;
const H = 630;

const policyDir = 'policies';
const files = readdirSync(policyDir).filter(f => f.endsWith('.policy.yaml'));

for (const file of files) {
  const slug = file.replace('.policy.yaml', '');
  const policy = yaml.load(readFileSync(join(policyDir, file), 'utf8'));
  const { title, subtitle, scope, background_image } = policy.meta;

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
