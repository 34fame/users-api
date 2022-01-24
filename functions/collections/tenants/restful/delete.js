const { firestore } = require('../../../services/firebase')
const verify = require('../../../lib/verifyMiddleware')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      await verify(req, res)
      const id = req.params.id
      await firestore.collection(req.collection).doc(id).delete()
      res.sendStatus(204)
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Delete failed')
   }
}
