const functions = require('firebase-functions')

const { firestore } = require('../../../services/firebase')
const compare = require('../../../lib/compareObjects')
const log = require('../../../lib/logging')

const collection = 'tenants'

module.exports = functions.firestore
   .document(`${collection}/{id}`)
   .onUpdate(async (change, context) => {
      try {
         const id = context.params.id
         const before = change.before.data()
         const after = change.after.data()
         const diff = compare(after, before)

         if (Object.keys(diff).length === 1 && diff.updated) {
            return
         }

         log.addAuditEvent({
            target: {
               type: 'tenant',
               id: id,
            },
            operation: 'update',
            payload: diff,
            context,
         })

         await firestore
            .collection(collection)
            .doc(id)
            .set({ updated: new Date().valueOf() }, { merge: true })
      } catch (error) {
         log.addErrorEvent({
            file: `${__filename}`,
            message: error.message,
         })
         throw new Error(error)
      }
   })
