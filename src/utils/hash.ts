import argon2 from "argon2"

export async function check_password(password: string, hash: string): Promise<boolean> {
  const charset = process.env.PEPPER as string
  const hash_verifications = []
  for (let char of charset) {
    hash_verifications.push(argon2.verify(hash, password + char))
  }
  const results = await Promise.all(hash_verifications)
  return results.indexOf(true) > -1
}

export async function generate_hash(password: string): Promise<string> {
  return argon2.hash(password + get_random_pepper(), { type: argon2.argon2id })
}

function get_random_pepper() {
  const charset = process.env.PEPPER as string
  return charset[Math.floor(Math.random() * charset.length)]
}
