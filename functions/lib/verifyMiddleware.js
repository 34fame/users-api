const { firestore } = require('../services/firebase')

const refTenant = firestore.collection('tenants')
const refUser = firestore.collection('users')

module.exports = async (req, res, options) => {
   return new Promise(async (resolve, reject) => {
      try {
         let owner, message
         ownerTenantId = process.env.OWNER_ORGID
         ownerApiKey = process.env.OWNER_APIKEY
         req.tenantId = req.headers['x-org-id']
         req.apiKey = req.headers['x-api-key']

         // Disallow all requests missing tenantId or apiKey headers
         if (!req.tenantId || !req.apiKey) {
            message = 'Unauthorized: Missing mandatory headers'
            res.status(401).send(message)
            return reject(message)
         }

         // Validate actions marked as "ownerOnly"
         if (options?.ownerOnly) {
            // Disallow when provided data doesn't match owner data
            if (req.apiKey !== ownerApiKey || req.tenantId !== ownerTenantId) {
               message = 'Unauthorized: Access denied'
               res.status(401).send(message)
               return reject(message)
            }

            // Allow verified owner
            return resolve()
         }

         // Retrieve tenant from database
         const doc = await firestore.collection('tenants').doc(req.tenantId).get()

         // Disallow when tenant not found
         if (!doc.exists) {
            message = 'Unauthorized: Tenant not found'
            res.status(401).send(message)
            return reject(message)
         }
         const tenant = doc.data()

         // Always allow orgOwner
         if (req.apiKey === ownerApiKey && req.tenantId === ownerTenantId) {
            return resolve()
         }

         // Disallow when API key doesn't match tenant
         if (tenant.apiKey !== req.apiKey) {
            message = 'Unauthorized: Invalid API key'
            res.status(401).send(message)
            return reject(message)
         }

         // Disallow when tenant is inactive
         if (!tenant.active) {
            message = 'Unauthorized: Tenant is inactive'
            res.status(401).send(message)
            return reject(message)
         }

         // Allow when API key matches tenant key
         return resolve()
      } catch (error) {
         res.sendStatus(500)
         reject(`Error: ${error.message}`)
      }
   })
}
