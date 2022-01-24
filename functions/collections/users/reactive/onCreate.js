const functions = require('firebase-functions')

const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

const collection = 'users'

module.exports = functions.firestore
   .document(`${collection}/{id}`)
   .onCreate(async (snap, context) => {
      try {
         const id = context.params.id
         const data = snap.data()

         log.addAuditEvent({
            target: {
               type: 'user',
               id: id,
            },
            operation: 'create',
            payload: data,
            context,
         })

         await firestore
            .collection(collection)
            .doc(id)
            .set({ created: new Date().valueOf() }, { merge: true })
      } catch (error) {
         throw new Error(error)
      }
   })
