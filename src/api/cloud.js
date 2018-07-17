import { db } from 'api/config'

const baseUrl = 'https://d.apicloud.com/mcm/api'
const Resource = require('APICloud').Resource
const client = new Resource(db.appId, db.appKsy, baseUrl)

export default client
