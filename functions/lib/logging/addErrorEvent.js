const { uid } = require('uid')

const { firestore } = require('../../services/firebase')
const getReadableTimestamp = require('../getReadableTimestamp')

module.exports = (props) => {
   try {
      let { file, message } = props
      if (!file || !message) {
         return
      }

      const rootIndex = file.indexOf('/functions')
      const timestamp = new Date().valueOf()
      const id = `${String(timestamp)}-${uid(5)}`

      const entry = {
         message,
         timestamp,
         readableTimestamp: getReadableTimestamp(timestamp),
         file: file.substring(rootIndex),
      }

      console.error(entry)

      firestore.collection('error').doc(id).set(entry)
   } catch (error) {
      throw new Error(error)
   }
}
