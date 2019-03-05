import firebase from 'firebase'
import {removeEmptyProperties} from '@/utils'

export default {
  fetchItem ({state, commit}, {id, emoji, resource}) {
    console.log('🔥‍', emoji, id)
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        // setTimeout(() => resolve(state[resource][id]), 1000)
        resolve(state[resource][id])
      })
    })
  },

  fetchItems ({dispatch}, {ids, resource, emoji}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})))
  }
}
