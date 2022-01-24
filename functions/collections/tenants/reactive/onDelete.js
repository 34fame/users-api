const functions = require('firebase-functions')

const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

const collection = 'tenants'

module.exports = functions.firestore
   .document(`${collection}/{id}`)
   .onDelete(async (snap, context) => {
      try {
         const id = context.params.id
         const data = snap.data()

         log.addAuditEvent({
            target: {
               type: 'tenant',
               id: id,
            },
            operation: 'delete',
            payload: data,
            context
         })

         const snapshot = await firestore
            .collection('users')
            .where('tenantId', '==', id)
            .get()

         if (!snapshot.empty) {
            snapshot.forEach((doc) => {
               firestore.collection('users').doc(doc.id).delete()
            })
         }
      } catch (error) {
         log.addErrorEvent({
            file: `${__filename}`,
            message: error.message,
         })
         throw new Error(error)
      }
   })
