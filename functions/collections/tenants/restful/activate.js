const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      const { id, code } = req.params

      console.log(id, code)

      const doc = await firestore.collection(req.collection).doc(id).get()
      if (!doc.exists) {
         res.sendStatus(404)
         return
      }

      let user = doc.data()
      if (user.active) {
         res.status(200).send('Tenant is active')
         return
      }

      if (code !== user.activationCode) {
         res.sendStatus(401)
         return
      }

      await firestore.collection(req.collection).doc(id).update({ active: true })
      res.status(200).send('Tenant is active')
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Update failed')
   }
}
