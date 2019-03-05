import firebase from 'firebase'
export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    // with rootState we can access other module using rootState.[modules_name]
    authUser (state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null
    }
  },

  actions: {
    initAuthentication ({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        // unsubscribe observer if already listening
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('👣 the user has changed')
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbUser => resolve(dbUser))
          } else {
            resolve(null)
          }
        })
        commit('setUnsubscribeAuthObserver', unsubscribe)
      })
    },

    // to trigger an action from another module it is necessary to prefix the namespace [module_namespace]/action
    // and as a third parameter add {root: true} to begin namespace from the root -> users/createUser
    // if not will look from the current modul auth/users/createUser
    registerUserWithEmailAndPassword ({dispatch}, {email, name, username, password, avatar = null}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          return dispatch('users/createUser', {id: user.uid, email, name, username, password, avatar}, {root: true})
        })
        .then(() => dispatch('fetchAuthUser'))
    },

    // here we dont need to worry to update the state manually because we have a listener to
    // onAuthStateChange observable that handle the same
    signInWithEmailAndPassword (context, {email, password}) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    signInWithGoogle ({dispatch}) {
      // instance of the provider
      const provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
        .then(data => {
          // get the user
          const user = data.user
          // check if user already exists in our db
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (!snapshot.exists()) { // false if the user registered now
              // create the user
              return dispatch('users/createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL}, {root: true})
                .then(() => dispatch('fetchAuthUser'))
            }
          })
        })
    },

    signOut ({commit}) {
      return firebase.auth().signOut()
        .then(() => {
          commit('setAuthId', null)
        })
    },

    // we need to be sure that the user is fetched before updating the authId
    // this is accomplished bc we subscribe to the onAuthStateChanged observable in main.js
    fetchAuthUser ({dispatch, commit}) {
      // we assume user is signed in with firebase
      const userId = firebase.auth().currentUser.uid
      // observer will fetch user only when sign in
      return new Promise((resolve, reject) => {
        // check if user exists in the db
        firebase.database().ref('users').child(userId).once('value', snapshot => {
          if (snapshot.exists()) {
            return dispatch('users/fetchUser', {id: userId}, {root: true})
              .then(user => {
                commit('setAuthId', userId)
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })
      })
    }
  },

  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },

    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  }
}
