import { post } from './db'

const className = 'user'

export function addUser(user) {
  return post(className, user)
}

export function login(user) {
  let addr = className + '/login'
  return post(addr, user)
}