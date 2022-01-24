const express = require('express')
const router = express.Router()

const getById = require('./getById')
const getAll = require('./getAll')
const create = require('./create')
const update = require('./update')
const del = require('./delete')

router.use(async (req, res, next) => {
   req.collection = 'users'
   req.tenantId = req.headers['x-org-id']
   req.apiKey = req.headers['x-api-key']
   next()
})

router.get('/:id', getById)
router.get('/', getAll)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', del)

module.exports = router
