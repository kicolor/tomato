import { get, getById, post, batch, put, del, postRelation } from './db'

const className = 'matter'
const colName = 'plan'
const defaultPlan = {
  isComplete: false,
  fulfill: 0
}
const defaultMatter = {
  complete: false,
  archive: false,
  predict: 0,
  fulfill: 0
}

// 获取所有事项
export function getAllMatter (filter, limit = 500) {
  // *** 懒加载
  filter.limit = limit
  let str = JSON.stringify(filter)
  return get(className, str)
}
// 获取某个具体事项
export function getMatter (id) {
  return getById(className, id)
}

// 添加事项
export function addMatter (matter) {
  matter = Object.assign({}, defaultMatter, matter)
  return post(className, matter)
}

// 删除事项 及 所有计划
export function batchDelMatter (id) {
  let planRequest = {
    method: 'delete',
    path: `/mcm/api/${className}/${id}/${colName}`
  }
  let matterRequest = {
    method: 'delete',
    path: `/mcm/api/${className}/${id}`
  }
  let requests = Array.of(planRequest, matterRequest)
  return batch(requests)
}

// 更新事项 并 删除所有计划
export function batchUpdateMatter (id, matter) {
  let planRequest = {
    method: 'delete',
    path: `/mcm/api/${className}/${id}/${colName}`
  }
  let matterRequest = {
    method: 'put',
    path: `/mcm/api/matter/${id}`,
    body: matter
  }
  let requests = Array.of(planRequest, matterRequest)
  return batch(requests)
}

// 获取事项
// export function getMatter (id) {
//   return get(className, {}, id)
// }

// 更新事项
export function updateMatter (id, matter) {
  return put(className, id, matter)
}

// 删除事项及所有计划
export function deleteMatter (id) {
  return del(className, id)
}

// 添加计划到事项中
export function addPlanToMatter(id, plan) {
  plan = Object.assign({}, defaultPlan, plan)
  return postRelation(className, id, colName, plan)
}
