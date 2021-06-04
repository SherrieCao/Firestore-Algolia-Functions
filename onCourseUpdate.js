const functions = require('firebase-functions')

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

exports.onCourseUpdate = functions.firestore
  .document([YOUR_DOC_LOC])
  .onUpdate((change, context) => {
    // Retrieve the current and previous value
    const data = change.after.data()
    const previousData = change.before.data()
    // We'll only update if desired fields have changed.
    // This is crucial to prevent infinite loops.
    if (
      data.Title == previousData.Title &&
      data.Course == previousData.Course
    ) {
      return null
    }
    
    // Mark the number of updates and most recent update date
    const updates = {}
    let count = data.total_update_count
    if (!count) {
      count = 0
    }
    updates['total_update_count'] = count + 1
    updates['updatedAt'] = admin.firestore.FieldValue.serverTimestamp()

    // Write {Title, Course} to collection users
    const previousCourseBasicInfo = {
      Course: previousData.Course,
      Title: previousData.Title,
      id: previousData.id || context.params.classId,
    }
    const newCourseBasicInfo = {
      Course: data.Course,
      Title: data.Title,
      id: context.params.classId || previousData.id,
    }
    const usersQuery = db
      .collection('users')
      .where('courses', 'array-contains', previousCourseBasicInfo)

    usersQuery.get().then((response) => {
      let batch = db.batch()
      response.docs.forEach((doc) => {
        const docRef = db.collection('users').doc(doc.id)
        //Add new course info to [courses]
        batch.update(docRef, {
          courses: admin.firestore.FieldValue.arrayUnion(newCourseBasicInfo),
        })
        //Remove old course info
        batch.update(docRef, {
          courses: admin.firestore.FieldValue.arrayRemove(previousCourseBasicInfo),
        })
      })
      batch.commit()
    })
    return change.after.ref.update(updates)
  })
