import crypto from 'crypto'

const SALT = 'ACHAT_STATIC_SALT_ADD487ADB854794A269B1DDFCDE8792CA82FBE6FA7D45956A8E2EF0839609D71'

export const random = l => crypto.randomBytes(l).toString('hex').toUpperCase()

export const sha256 = t => crypto.createHash('sha256').update(t + SALT).digest('hex').toUpperCase()
