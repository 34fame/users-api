const { firestore } = require('../../../services/firebase')
const verify = require('../../../lib/verifyMiddleware')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      await verify(req, res, { ownerOnly: true })
      const snapshot = await firestore.collection(req.collection).get()
      let docs = []
      snapshot.docs.forEach((doc) => {
         docs.push({
            ...doc.data(),
            id: doc.id,
         })
      })
      res.status(200).send(docs)
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Get failed')
   }
}
