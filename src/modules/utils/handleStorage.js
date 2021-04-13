import { storage } from '@/firebase'

export const uploadImage = async (file, ops) => {
  let path =
    ops === 'avatars'
      ? process.env.VUE_APP_FIREBASE_STORAGE_AVATARS_PATH
      : process.env.VUE_APP_FIREBASE_STORAGE_ATTACHMENTS_PATH
  var storageRef = storage.ref(path + file.name)
  return await storageRef.put(file).then(async () => {
    return await storageRef.getDownloadURL()
  })
}

export const deleteImage = async (imgUrl) => {
  return await storage
    .refFromURL(imgUrl)
    .delete()
    .then(() => {
      console.log('image deleted')
      return true
    })
    .catch((error) => {
      console.log(error.message)
      return false
    })
}
