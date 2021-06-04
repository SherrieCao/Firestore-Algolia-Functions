//!!! Make sure school name is recorded in dictionary.js

const index_dic = require('./dictionary/dictionary_users')
const { config, firestore } = require('firebase-functions')

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

const algoliasearch = require('algoliasearch')

const ALGOLIA_ID = config().algolia.appid
const ALGOLIA_ADMIN_KEY = config().algolia.apikey
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

exports.onWrite_User = firestore
  .document(`users/{userID}`)
  .onWrite(async (change, _context) => {
    // get data before and after the change
    const oldData = change.before
    const newData = change.after
    // Read new data
    const userInfo = newData.data()
    const schoolID = userInfo['school'][0]
    const { firstName, lastName, email, imageURL, bio } = userInfo
    const id = newData.id // <-- prop name is important
    const objectID = id
    // Generate data to write
    const userIndex = {
      firstName,
      lastName,
      email,
      imageURL,
      bio,
      id,
    }
    //Get index name from dictionary
    const algolisIndexName = index_dic[schoolName][ALGOLIA_INDEX_NAME]
    const index = client.initIndex(algolisIndexName)

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
          userIndex
        )
      )
    }
  })

  
