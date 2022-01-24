const { uid } = require('uid')

const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   let tenantId
   try {
      const { name, email, organization, ...rest } = req.body
      if (!name || !email || !organization) {
         res.status(400).send('Missing mandatory fields')
         return
      }

      tenantId = uid()
      const userId = uid()

      const tenant = {
         apiKey: uid(32),
         activationCode: uid(8),
         active: false,
         ownerEmail: email,
         ownerId: userId,
         ...rest,
      }

      const user = {
         tenantId,
         name,
         email,
      }

      const refTenant = firestore.collection(req.collection)
      const refUser = firestore.collection('users')
      const snapshot = await refTenant.where('ownerEmail', '==', email).get()
      if (!snapshot.empty) {
         res.status(400).send('Tenant already exists')
         return
      }

      await refTenant.doc(tenantId).set(tenant)
      await refUser.doc(userId).set(user)

      res.status(201).send({
         tenantId,
         apiKey: tenant.apiKey,
      })
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Create failed')
   }
}
