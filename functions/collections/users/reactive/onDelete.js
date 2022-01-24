const functions = require('firebase-functions')

const log = require('../../../lib/logging')

const collection = 'users'

module.exports = functions.firestore
   .document(`${collection}/{id}`)
   .onDelete(async (snap, context) => {
      try {
         const id = context.params.id
         const data = snap.data()

         log.addAuditEvent({
            target: {
               type: 'user',
               id: id,
            },
            operation: 'delete',
            payload: data,
            context,
         })
      } catch (error) {
         log.addErrorEvent({
            file: `${__filename}`,
            message: error.message,
         })
         throw new Error(error)
      }
   })
