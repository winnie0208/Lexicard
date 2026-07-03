// Generates simple solid-color placeholder PWA icons (public/pwa-192x192.png, public/pwa-512x512.png).
// Replace with real app icon artwork before shipping (Phase 9 PWA/RWD polish).
const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')

const BG = [170, 59, 255] // #aa3bff, matches manifest theme_color
const FG = [255, 255, 255]

function crc32(buf) {
  let c
  const table =
    crc32.table ||
    (crc32.table = (() => {
      const t = new Uint32Array(256)
      for (let n = 0; n < 256; n++) {
        c = n
        for (let k = 0; k < 8; k++) {
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        }
        t[n] = c
      }
      return t
    })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function generatePng(size) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: RGB
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const margin = Math.round(size * 0.22)
  const raw = Buffer.alloc(size * (1 + size * 3))
  let offset = 0
  for (let y = 0; y < size; y++) {
    raw[offset++] = 0 // filter type: none
    const inLetter = y >= margin && y < size - margin
    for (let x = 0; x < size; x++) {
      const inLetterX = x >= margin && x < size - margin
      const color = inLetter && inLetterX ? FG : BG
      raw[offset++] = color[0]
      raw[offset++] = color[1]
      raw[offset++] = color[2]
    }
  }

  const idat = zlib.deflateSync(raw)
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = path.join(__dirname, '..', 'public')
for (const size of [192, 512]) {
  const png = generatePng(size)
  const outPath = path.join(outDir, `pwa-${size}x${size}.png`)
  fs.writeFileSync(outPath, png)
  console.log(`wrote ${outPath}`)
}
