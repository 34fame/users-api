const admin = require('firebase-admin')
let projectId

if (process.env.APP_ENV === 'local') {
   projectId = 'fame-users-api'
   admin.initializeApp({ projectId })
} else {
   const serviceAccount = require('./service-account.json')
   projectId = serviceAccount.project_id
   admin.initializeApp()
}

exports.firestore = admin.firestore()
exports.dbFieldValue = admin.firestore.FieldValue
