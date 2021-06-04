//!!! Make sure school name is recorded in dictionary.js

const school = 'Rochester'

const index_dic = require('./dictionary/dictionary_courses')
import { config, firestore } from 'firebase-functions'

// The Firebase Admin SDK to access Cloud Firestore.
import { initializeApp } from 'firebase-admin'
initializeApp()

import algoliasearch from 'algoliasearch'

const ALGOLIA_ID = config().algolia.appid
const ALGOLIA_ADMIN_KEY = config().algolia.apikey
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

const algolisIndexName = index_dic[school]['ALGOLIA_INDEX_NAME']
const index = client.initIndex(algolisIndexName)

const schoolFirestoreID = index_dic[school]['FIRESTORE_INDEX_ID']

export const onWrite_Rochester = firestore
  .document(`schools/${schoolFirestoreID}/classes/{classId}`)
  .onWrite(async (change, _context) => {
    // get data before and after the change
    const oldData = change.before
    const newData = change.after
    // Read new data
    const courseInfo = newData.data()
    const course = courseInfo['Course']
    const courseTitle = courseInfo['Title']
    const courseCRN = courseInfo['CRN']
    const courseDays = courseInfo['Days']
    const courseTimes = courseInfo['Times']
    const objectID = newData.id // <-- prop name is important

    const courseIndex = {
      course,
      courseTitle,
      courseCRN,
      courseDays,
      courseTimes,
    }

    // Update to the algolia index
    if (!newData.exists && oldData.exists) {
      // deleting
      return index.deleteObject(objectID)
    } else {
      // creating & updating
      return index.saveObject(
        Object.assign(
          {},
          {
            objectID,
          },
          courseIndex
        )
      )
    }
  })

/*exports.algoliaSyncTest = functions.firestore
  .document(`schools/{doc}`)
  .onWrite(async (change, _context) => {
    const oldData = change.before
    const newData = change.after
    const data = newData.data()
    const objectID = newData.id // <-- prop name is important

    if (!newData.exists && oldData.exists) {
      // deleting
      return index.deleteObject(objectID)
    } else {
      // creating & updating
      return index.saveObject(
        Object.assign(
          {},
          {
            objectID,
          },
          data
        )
      )
    }
  })*/
// Update the search index every time a blog post is written.
/*exports.onSchoolCreated = functions.firestore
  .document('schools/0npNiozV4EhrEgbf9yKp/classes/{classId}')
  .onCreate((snap, context) => {
    // Get the note document
    const courseInfo = snap.data()
    const course = courseInfo['Course']
    const courseTitle = courseInfo['Title']
    const courseCRN = courseInfo['CRN']
    const courseDays = courseInfo['Days']
    const courseTimes = courseInfo['Times']

    const courseIndex = {
      objectID: context.params.classId,
      course,
      courseTitle,
      courseCRN,
      courseDays,
      courseTimes,
    }

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME)
    return index.saveObject(courseIndex)
  })*/
