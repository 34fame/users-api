const { firestore } = require('../../../services/firebase')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      const id = req.params.id
      const user = await firestore.collection('users').doc(id).get()
      if (user.exists) {
         res.status(200).send(user.data())
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
