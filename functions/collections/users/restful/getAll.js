const { firestore } = require('../../../services/firebase')
const verify = require('../../../lib/verifyMiddleware')
const log = require('../../../lib/logging')

module.exports = async (req, res) => {
   try {
      await verify(req, res)
      let ref = firestore.collection(req.collection)

      if (req.tenantId !== process.env.OWNER_ORGID) {
         ref = ref.where('tenantId', '==', req.tenantId)
      }

      const snapshot = await ref.get()
      let docs = []
      snapshot.docs.forEach((doc) => {
         docs.push({
            id: doc.id,
            ...doc.data(),
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
