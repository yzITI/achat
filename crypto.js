import crypto from 'crypto'

export const random = l => crypto.randomBytes(l).toString('hex').toUpperCase()

