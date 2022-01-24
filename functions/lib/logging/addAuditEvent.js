const { uid } = require('uid')

const { firestore } = require('../../services/firebase')
const getReadableTimestamp = require('../getReadableTimestamp')
const log = require('./')

module.exports = (props) => {
   try {
      const { target, operation, success = true, ...rest } = props
      if (!target || !operation) {
         return
      }

      const timestamp = new Date().valueOf()
      const id = `${String(timestamp)}-${uid(5)}`
      let entry = {
         target,
         operation,
         success,
         timestamp: timestamp,
         readableTimestamp: getReadableTimestamp(timestamp),
         ...rest,
      }

      firestore.collection('audit').doc(id).set(entry)
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      throw new Error(error)
   }
}
