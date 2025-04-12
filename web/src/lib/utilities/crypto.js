const enc = new TextEncoder('utf-8')

const SALT = 'ACHAT_STATIC_SALT_ADD487ADB854794A269B1DDFCDE8792CA82FBE6FA7D45956A8E2EF0839609D71'

export const HEX = buffer => Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()

export function random (l) {
  const a = new Uint8Array(l)
  window.crypto.getRandomValues(a)
  return HEX(a)
}

export const sha256 = str => window.crypto.subtle.digest('SHA-256', enc.encode(str + SALT)).then(HEX)

