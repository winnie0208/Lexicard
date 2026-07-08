// One-off illustration generator for empty-state artwork. Run manually
// (`node scripts/generate-illustrations.mjs`) when artwork needs updating;
// requires the `sharp` devDependency, which is not needed at app runtime.
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220">
  <g transform="rotate(-9 150 115)">
    <rect x="90" y="35" width="120" height="150" rx="20" fill="#eae1cb" stroke="#d9cdb2" stroke-width="2" />
  </g>
  <g transform="rotate(6 150 112)">
    <rect x="90" y="35" width="120" height="150" rx="20" fill="#fffdf8" stroke="#d9cdb2" stroke-width="2" />
  </g>
  <g>
    <rect x="90" y="35" width="120" height="150" rx="20" fill="#b3431f" />
    <rect x="112" y="86" width="76" height="9" rx="4.5" fill="#f1ded0" />
    <rect x="112" y="106" width="56" height="9" rx="4.5" fill="#f1ded0" opacity="0.85" />
    <rect x="112" y="126" width="66" height="9" rx="4.5" fill="#f1ded0" opacity="0.7" />
    <rect x="112" y="146" width="40" height="9" rx="4.5" fill="#f1ded0" opacity="0.55" />
  </g>
  <circle cx="205" cy="48" r="24" fill="#b1802a" stroke="#f5f0e3" stroke-width="4" />
  <rect x="197" y="46" width="16" height="4" rx="2" fill="#fffdf8" />
  <rect x="203" y="40" width="4" height="16" rx="2" fill="#fffdf8" />
</svg>
`

const outPath = path.join(__dirname, '..', 'src', 'assets', 'empty-library.png')

await sharp(Buffer.from(svg), { density: 288 }).resize(600, 440).png().toFile(outPath)

console.log(`wrote ${outPath}`)
