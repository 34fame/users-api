const functions = require('firebase-functions')

const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

const collection = 'tenants'

module.exports = functions.firestore
   .document(`${collection}/{id}`)
   .onCreate(async (snap, context) => {
      try {
         const id = context.params.id
         const data = snap.data()

         log.addAuditEvent({
            target: {
               type: 'tenant',
               id: id,
            },
            operation: 'create',
            payload: data,
            context,
         })

         // TODO Send email with activation code

         await firestore
            .collection(collection)
            .doc(id)
            .set({ created: new Date().valueOf() }, { merge: true })
      } catch (error) {
         log.addErrorEvent({
            file: `${__filename}`,
            message: error.message,
         })
         throw new Error(error)
      }
   })
