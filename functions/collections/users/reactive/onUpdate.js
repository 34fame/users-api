const functions = require('firebase-functions')

const { firestore } = require('../../../services/firebase')
const compare = require('../../../lib/compareObjects')
const log = require('../../../lib/logging')

const collection = 'users'

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
               type: 'user',
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

         // TODO If user is tenant owner & email address has changed, update the tenant "ownerEmail" value
      } catch (error) {
         throw new Error(error)
      }
   })
