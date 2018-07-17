import { get, getById, post, put, del, getRelation, batch } from './db'

const className = 'project'
const colName = 'matter'
const defaultPro = {
  archive: false,
  bgImg: '0.jpg',
  matter: []
}
const defaultMatter = {
  complete: false,
  archive: false,
  predict: 0,
  fulfill: 0
}

// 获取所有项目
export function getAllPro(filter) {
  let str = JSON.stringify(filter)
  return get(className, str)
}

// 获取某个具体项目
export function getPro(id, filter) {
  return getById(className, id, filter)
}

// 获取某个项目中的事项
export function getMattersOfPro(id) {
  return getRelation(className, id, colName)
}

// 添加事项到某个项目中
export function addMatterToPro(id, matter) {
  matter = Object.assign({}, defaultMatter, matter)
  let addMatter = {
    method: 'post',
    path: `/mcm/api/${className}/${id}/${colName}`,
    body: matter
  }
  let activePro = {
    method: 'put',
    path: `/mcm/api/${className}/${id}`,
    body: {
      archive: false
    }
  }
  let requests = Array.of(addMatter, activePro)
  console.log('requests', requests)
  return batch(requests)
}

// 添加项目
export function addPro(pro) {
  pro = Object.assign({}, defaultPro, pro)
  return post(className, pro)
}

// 更新项目
export function updatePro(id, pro) {
  put(className, id, pro)
}

// 删除项目及所有事项
export function deletePro (id) {
  return del(className, id)
}

// 删除项目 及 所有事项
export function batchDelPro (id) {
  let requests = []
  let matterRequest = {
    method: 'delete',
    path: `/mcm/api/${className}/${id}/${colName}`
  }
  let proRequest = {
    method: 'delete',
    path: `/mcm/api/${className}/${id}`
  }
  requests.push(matterRequest, proRequest)
  return batch(requests)
}

// 归档项目 及 所有事项
export function batchArchivePro (id, matterIds, pro) {
  let requests = []
  matterIds.map(item => {
    let reqPlan = {
      method: 'delete',
      path: `/mcm/api/matter/${item}/plan`
    }
    let reqMatter = {
      method: 'put',
      path: `/mcm/api/${colName}/${item}`,
      body: {
        archive: true
      }
    }
    requests.push(reqPlan, reqMatter)
  })
  let proRequest = {
    method: 'put',
    path: `/mcm/api/${className}/${id}`,
    body: pro
  }
  requests.push(proRequest)
  return batch(requests)
}
