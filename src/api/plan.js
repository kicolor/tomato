import { get, getById, post, put, del } from './db'

const className = 'plan'

// 获取所有任务
export function getAllPlan (filter, limit = 500) {
  // *** 懒加载
  filter.limit = limit
  let str = JSON.stringify(filter)
  return get(className, str)
}

// 添加任务
export function addPlan (plan) {
  console.log('addPlan', plan)
  return post(className, plan)
}

// 获取任务
export function getPlan (id) {
  return getById(className, id)
}

// 更新任务
export function updatePlan (id, plan) {
  return put(className, id, plan)
}

// 删除任务
export function deletePlan (id) {
  return del(className, id)
}
