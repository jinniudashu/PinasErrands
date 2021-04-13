import { auth } from '@/firebase'
import store from '@/store'

// Logout
export const logout = () => {
  auth
    .signOut()
    .then(() => {
      store.commit('user/setUser', null)
      return true
    })
    .catch((error) => {
      console.log(error.message)
      return false
    })
}

// 更新用户Profile信息
export const updateUserProfile = async (payload) => {
  var user = auth.currentUser
  return await user
    .updateProfile(payload)
    .then(() => {
      store.commit('user/setUser', user)
      console.log('updateUserProfile ok: ', user)
      return true
    })
    .catch((error) => {
      console.log(error.message)
      return false
    })
}

// Sign in with an email and a password
export const signinWithEmail = (payload) => {
  auth
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then((result) => {
      store.commit('user/setUser', result.user)
      return true
    })
    .catch((error) => {
      console.log(error)
      alert('Oops. ' + error.message)
      return false
    })
}

// 用Google账户登录
export const loginWithGoogle = () => {
  const provider = new auth.GoogleAuthProvider()
  auth
    .signInWithPopup(provider)
    .then((result) => {
      store.commit('user/setUser', result.user)
      return true
    })
    .catch((error) => {
      console.log(error.message)
      alert('Oops. ' + error.message)
      return false
    })
}

// Sign up with an email and password
export const signUpWithEmail = (payload) => {
  auth
    .createUserWithEmailAndPassword(payload.email, payload.password)
    .then((result) => {
      store.commit('user/setUser', result.user)
      return true
    })
    .catch((error) => {
      console.log(error)
      alert('Oops. ' + error.message)
      return false
    })
}
