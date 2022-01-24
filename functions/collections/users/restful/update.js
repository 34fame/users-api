const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      const id = req.params.id
      const data = req.body
      const ref = firestore.collection('users').doc(id)
      let user = await ref.get()
      if (!user.exists) {
         res.sendStatus(404)
         return
      }
      await ref.update(data)
      user = await ref.get()
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
