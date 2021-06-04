//!!! Make sure school name is recorded in dictionary.js

const school = 'Rochester'

const index_dic = require('./dictionary/dictionary_courses')
import { config, firestore } from 'firebase-functions'

// The Firebase Admin SDK to access Cloud Firestore.
import { initializeApp } from 'firebase-admin'
initializeApp()

import algoliasearch from 'algoliasearch'

//Set up config variables with Algolia keys: $ firebase functions:config:set algolia.appid="YOUR_APP_ID" algolia.apikey="YOUR_API_KEY"
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
