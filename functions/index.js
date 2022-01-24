const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

/* RESTful API route handlers */
const tenantRoutes = require('./collections/tenants/restful')
app.use('/tenants', tenantRoutes)

const userRoutes = require('./collections/users/restful')
app.use('/users', userRoutes)

app.use(function (req, res) {
   res.status(404).send({ url: req.originalUrl + ' not found' })
})

exports.api = functions.https.onRequest(app)
/* end RESTful API route handlers */

/* Firestore reactive handlers */
const tenantsReactive = require('./collections/tenants/reactive')
exports.tenantsReactive = tenantsReactive

const usersReactive = require('./collections/users/reactive')
exports.usersReactive = usersReactive
/* end Firestore reactive handlers */
