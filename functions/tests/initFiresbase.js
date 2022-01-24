const admin = require('firebase-admin')
admin.initializeApp({ projectId: 'fame-users-api' })

exports.firestore = admin.firestore()
exports.dbFieldValue = admin.firestore.FieldValue
