import type { NextApiRequest } from 'next'

// Also 1200 x 627 (same ratio, exact size varies)
export const width = 1128
export const height = 600

export const getNameFromRequest = (request: NextApiRequest) => {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')
  return name
}
