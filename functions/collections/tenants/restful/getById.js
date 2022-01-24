const { firestore } = require('../../../services/firebase')
const verify = require('../../../lib/verifyMiddleware')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      await verify(req, res)
      const id = req.params.id
      const doc = await firestore.collection(req.collection).doc(id).get()
      if (doc.exists) {
         res.status(200).send({
            id: doc.id,
            ...doc.data(),
         })
      } else {
         res.sendStatus(404)
      }
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Get failed')
   }
}
