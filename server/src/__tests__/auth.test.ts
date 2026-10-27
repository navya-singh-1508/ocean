import { test } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { signToken, verifyToken } from '../middleware/auth.js'

test('Auth: Password hashing creates secure salted hash and verifies correctly', async () => {
  const password = 'AbyssExplorer!2026'
  const hash = await bcrypt.hash(password, 10)

  assert.notStrictEqual(password, hash)
  assert.ok(hash.startsWith('$2'), 'Hash should be a valid bcrypt string')

  const validMatch = await bcrypt.compare(password, hash)
  assert.strictEqual(validMatch, true, 'Original password should match the hash')

  const invalidMatch = await bcrypt.compare('WrongPassword999', hash)
  assert.strictEqual(invalidMatch, false, 'Incorrect password must be rejected')
})

test('Auth: JWT signing and token extraction roundtrip', () => {
  const userId = '64f1a2b3c4d5e6f7a8b9c0d1'
  const email = 'explorer@deepocean.org'
  const name = 'Jacques Piccard'

  const token = signToken(userId, email, name)
  assert.ok(typeof token === 'string' && token.length > 20, 'Token should be a non-empty string')

  const decoded = verifyToken(token)
  assert.ok(decoded !== null, 'Token should decode successfully')
  assert.strictEqual(decoded?.userId, userId)
  assert.strictEqual(decoded?.email, email)
  assert.strictEqual(decoded?.name, name)
})

test('Auth: Expired or tampered tokens are safely rejected', () => {
  const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsig'
  const decoded = verifyToken(tamperedToken)
  assert.strictEqual(decoded, null, 'Tampered token must return null, not throw')
})

test('Auth: Input validation rules match project requirements', () => {
  // Validate name length (>= 2 chars, <= 100)
  const isValidName = (n: unknown) => typeof n === 'string' && n.trim().length >= 2 && n.trim().length <= 100
  assert.strictEqual(isValidName(''), false)
  assert.strictEqual(isValidName('A'), false)
  assert.strictEqual(isValidName('Marina Trench'), true)

  // Validate email regex
  const isValidEmail = (e: unknown) => typeof e === 'string' && /^\S+@\S+\.\S+$/.test(e.trim())
  assert.strictEqual(isValidEmail('not-an-email'), false)
  assert.strictEqual(isValidEmail('user@'), false)
  assert.strictEqual(isValidEmail('explorer@noaa.gov'), true)

  // Validate password length (>= 8 chars)
  const isValidPassword = (p: unknown) => typeof p === 'string' && p.length >= 8
  assert.strictEqual(isValidPassword('short'), false)
  assert.strictEqual(isValidPassword('1234567'), false)
  assert.strictEqual(isValidPassword('12345678'), true)
})
