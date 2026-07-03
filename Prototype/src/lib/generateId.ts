// crypto.randomUUID() only works in a secure context (HTTPS or localhost).
// This app is tested over plain HTTP on a LAN IP (iPad), which is not a
// secure context, so we build a UUID v4 from crypto.getRandomValues()
// instead — that API has no such restriction.
export function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
