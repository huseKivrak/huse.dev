// A sealed file behind the riddle on Artemis's nose. Only a salt and a check value live here:
// the answer is never stored, and the file, name and all, can't be read without it.

const SEALED = '/nose/f54f9a9f7ef7.bin'
const SALT = '2c9ac889a98a10636f8b3bc6c39b130a'
const CHECK = '5dddab236830110b893da21d6905613576ce8198ed6ef855bb226171714af2c0'
const ROUNDS = 200_000

// Answers are compared letters only, lowercased, with repeats collapsed, so however
// many of each letter someone types, it's the same answer.
function canon(answer: string): string {
  return answer
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/(.)\1+/g, '$1')
}

const bytes = (hex: string) => Uint8Array.from(hex.match(/../g)!, (b) => parseInt(b, 16))
const hex = (data: Uint8Array) => Array.from(data, (b) => b.toString(16).padStart(2, '0')).join('')

// The file and its name, or null if the answer is wrong. The sealed file is only
// fetched once the answer is known to be right.
export async function open(answer: string): Promise<{ name: string; blob: Blob } | null> {
  const word = canon(answer)
  if (!word) return null
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(word), 'PBKDF2', false, ['deriveBits'])
  const bits = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: bytes(SALT), iterations: ROUNDS },
      base,
      512
    )
  )
  if (hex(bits.subarray(32)) !== CHECK) return null

  const key = await crypto.subtle.importKey('raw', bits.subarray(0, 32), 'AES-GCM', false, ['decrypt'])
  const sealed = new Uint8Array(await (await fetch(SEALED)).arrayBuffer())
  const plain = new Uint8Array(
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv: sealed.subarray(0, 12) }, key, sealed.subarray(12))
  )
  const length = (plain[0] << 8) | plain[1]
  return {
    name: new TextDecoder().decode(plain.subarray(2, 2 + length)),
    blob: new Blob([plain.subarray(2 + length)], { type: 'application/zip' }),
  }
}
