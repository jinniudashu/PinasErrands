import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyDbuJFNMjH25SNuG-ILTsV0Tlw1_A8Tu90',
  authDomain: 'pinaserrunds-61a7a.firebaseapp.com',
  databaseURL: 'https://pinaserrunds-61a7a.firebaseio.com',
  projectId: 'pinaserrunds-61a7a',
  storageBucket: 'pinaserrunds-61a7a.appspot.com',
  messagingSenderId: '302344936557',
  appId: '1:302344936557:web:37fc0b170b6c65de3df364',
}

firebase.initializeApp(config)

export const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()

export const auth = firebase.auth()

export const storage = firebase.storage()

export default firebase
