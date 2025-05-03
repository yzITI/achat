// 20250415

import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://localhost')
const dbName = 'achat'

async function init () {
  try {
    await client.db(dbName).command({ ping: 1 })
    console.log('# Mongodb Ready')
  } catch {
    console.log('# Mongodb Failed')
    await client.close()
  }
}
init()

export const model = col => {
  const collection = client.db(dbName).collection(col)
  return {
    raw: () => collection,
    async insert (doc) {
      try {
        const res = Array.isArray(doc) ? await collection.insertMany(doc) : await collection.insertOne(doc)
        return res.insertedId || res.insertedIds
      } catch { return 0 }
    },
    async del (filter) {
      const res = await collection.deleteMany(filter)
      return res.acknowledged && res // 1 for success
    },
    async get (filter, opt = {}) {
      return await collection.findOne(filter, opt)
    },
    async find (filter, opt = {}) {
      return await collection.find(filter, opt).toArray()
    },
    async put (filter, replace, upsert = true) {
      const res = await collection.replaceOne(filter, replace, { upsert })
      return res.acknowledged && res
    },
    async update (filter, update, upsert = false) {
      const res = await collection.updateMany(filter, { $set: update }, { upsert })
      return res.acknowledged && res
    },
    count: (filter, opt = {}) => collection.countDocuments(filter, opt)
  }
}

export const M = model('message')

export default model
