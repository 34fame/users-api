const { firestore } = require('../../../services/firebase')
const verify = require('../../../lib/verifyMiddleware')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      await verify(req, res)
      const id = req.params.id
      const data = req.body
      await firestore.collection(req.collection).doc(id).update(data)
      const user = await firestore.collection(req.collection).doc(id).get()
      res.status(200).send({
         ...user.data(),
         id: user.id,
      })
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Update failed')
   }
}
