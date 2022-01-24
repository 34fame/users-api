const { uid } = require('uid')

const { firestore } = require('../../../services/firebase')
const verify = require('../../../lib/verifyMiddleware')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      await verify(req, res)
      let data = req.body

      const ref = firestore.collection(req.collection)

      const snapshot = await ref.where('email', '==', data.email).get()
      if (!snapshot.empty) {
         res.status(400).send('Email already in use')
         return
      }

      const userId = uid()
      const doc = await firestore
         .collection(req.collection)
         .doc(userId)
         .set({
            tenantId: req.tenantId,
            ...data,
         })
      res.status(201).send({ userId: doc.id })
   } catch (error) {
      log.addErrorEvent({
         file: `${__filename}`,
         message: error.message,
      })
      res.status(500).send('Create failed')
   }
}
