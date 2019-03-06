import firebase from 'firebase'
import {helpers as vuelidateHelpers} from 'vuelidate/lib/validators'

export const uniqueUsername = (value) => { // async check if username is unique
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    // in firebase in order to query a "table" by the value of a child property we first order that table
    // by that property using orderByChild method
    firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

export const supportedImageFile = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  const supported = ['jpg', 'jpeg', 'gif', 'png', 'svg']
  const suffix = value.split('.').pop()
  return supported.includes(suffix)
}

export const responseOk = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    fetch(value)
      .then(response => resolve(response.ok))
      .catch(() => resolve(false))
  })
}

export const uniqueEmail = (value) => { // async check if email is unique
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}
