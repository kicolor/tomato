import { db } from './config'

const sha1 = require('sha1')
const axios = require('axios')

const appId = db.appId
const appKey = db.appKey

const request = axios.create({
  baseURL: 'https://d.apicloud.com/mcm/api'
})

// 错误信息
const createError = (code, resp) => {
  console.log('code', code)
  console.log('resp', resp)
  const err = new Error(resp.message)
  err.code = code
  return err
}

// 处理请求返回结果
const handleRequest = ({ status, data, ...rest }) => {
  console.log('handleRequest')
  if (status === 200) {
    console.log('handleRequest', data)
    return {
      code: 0,
      data
    }
  } else if (status === 202 || status === 401) {
    return {
      code: 1,
      data
    }
  } else {
    throw createError(status, rest)
  }
}

// 处理请求头
const getHeaders = () => {
  const now = Date.now()
  return {
    'X-APICloud-AppId': appId,
    'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${now}`)}.${now}`
  }
}

// 创建对象
export const post = async function (className, data) {
  console.log('className', className)
  console.log('data', data)
  return handleRequest(await request.post(
    `/${className}`,
    data,
    { headers: getHeaders() }
  ))
}

// 创建对象，并对关联对象进行操作
export const batch = async function (requests) {
  return handleRequest(await request.post(
    `/batch`,
    {
      requests
    },
    {
      headers: getHeaders()
    }
  ))
}

// 查询对象
export const get = async function (className, filter) {
  let path = `/${className}`
  if (filter) {
    path = `/${className}/?filter=${filter}`
  }
  return handleRequest(await request.get(
    path,
    {
      headers: getHeaders()
    }
  ))
}

// 查询某个对象，id
export const getById = async function (className, id, filter) {
  let path = `/${className}/${id}`
  if (filter) {
    path = `/${className}/${id}/?filter=${filter}`
  }
  return handleRequest(await request.get(
    path,
    {
      headers: getHeaders()
    }
  ))
}

// 更新对象
export const put = async function (className, id, data) {
  return handleRequest(await request.put(
    `/${className}/${id}`,
    data,
    { headers: getHeaders() }
  ))
}

// 删除对象
export const del = async function (className, id) {
  return handleRequest(await request.delete(
    `/${className}/${id}`,
    { headers: getHeaders() }
  ))
}

// 判断对象是否存在
export const exists = async function (className, id) {
  return handleRequest(await request.get(
    `/${className}/${id}/exists`,
    { headers: getHeaders() }
  ))
}

// 获取关联对象
export const getRelation = async function (className, id, relationColName) {
  return handleRequest(await request.get(
    `/${className}/${id}/${relationColName}`,
    { headers: getHeaders() }
  ))
}

// 创建关联对象
export const postRelation = async function (className, id, relationColName, data) {
  return handleRequest(await request.post(
    `/${className}/${id}/${relationColName}`,
    data,
    { headers: getHeaders() }
  ))
}

// 删除所有的关联对象
export const delRelation = async function (className, id, relationColName) {
  return handleRequest(await request.delete(
    `/${className}/${id}/${relationColName}`,
    { headers: getHeaders() }
  ))
}
