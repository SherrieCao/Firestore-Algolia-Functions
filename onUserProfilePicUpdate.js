const functions = require('firebase-functions')

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

exports.onUserProfilePicUpdate = functions.firestore
  .document('users/{userID}')
  .onUpdate((change, context) => {
    const data = change.after.data()
    const previousData = change.before.data()
    const updates = {}
    updates['updatedAt'] = admin.firestore.FieldValue.serverTimestamp()
    if (data.imageURL != previousData.imageURL) {
      const threadsQuery = db
        .collection('thread_definitions')
        .where(`members.${previousData.id}`, '!=', false)
      threadsQuery.get().then((response) => {
        let batch = db.batch()
        response.docs.forEach((doc) => {
          const docRef = db.collection('thread_definitions').doc(doc.id)
          batch.update(docRef, {['members.'+ previousData.id +'.image']: data.imageURL})
        })
        batch.commit()
      })
      return change.after.ref.update(updates)
    } else {
      return null
    }
  })
