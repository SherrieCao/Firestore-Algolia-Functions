//!!! Make sure school name is recorded in dictionary.js

const school = 'Rochester'
const index_dic = require('./functions/dictionary/dictionary_courses')

const admin = require('firebase-admin')
const firebaseConfig = require('./config.js')
const serviceAccount = require('./serviceAccountKey.json')
const data = require(index_dic[school]['DATA_LOCATION'])

const collectionKey = '/schools/0dd4CHNnhNgBBQih20AW/classes'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
})
const firestore = admin.firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

async function sendDatatoFirestore() {
  if (data && typeof data === 'object') {
    Object.keys(data).forEach((docKey) => {
      firestore
        .collection(collectionKey)
        .doc()
        .set(data[docKey])
        .then((res) => {})
        .catch((error) => {
          console.error('Error writing document: ' + docKey + ',' + error)
        })
    })
  }
}

const jsonToFirestore = async () => {
  try {
    await sendDatatoFirestore()
    console.log('Upload Success')
  } catch (error) {
    console.log(error)
  }
}

jsonToFirestore()
