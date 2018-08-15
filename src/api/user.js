import { post } from './db'

const className = 'user'

export function addUser(user) {
  return post(className, user)
}