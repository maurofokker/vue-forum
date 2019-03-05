import firebase from 'firebase'

export default {
  createPost ({commit, state}, post) {
    const postId = firebase.database().ref('posts').push().key // it is sync and will generate an ID
    // post['.key'] = postId <-- added in the mutation
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const updates = {} // object that will contain references to update
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    firebase.database().ref().update(updates)
      .then(() => {
        commit('setItem', {resource: 'posts', item: post, id: postId})
        commit('appendPostToThread', {parentId: post.threadId, childId: postId})
        commit('appendContributorToThread', {parentId: post.threadId, childId: post.userId})
        commit('appendPostToUser', {parentId: post.userId, childId: postId})
        return Promise.resolve(state.posts[postId])
      })
  },

  initAuthentication ({dispatch, commit, state}) {
    // we need to unsubscribe bc every time we visit a page creates a new observer
    // so we need to turn off the current observer before creating a new one
    // unsubscribe observer if already listening
    if (state.unsubscribeAuthObserver) {
      state.unsubscribeAuthObserver()
    }
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        console.log('👣 the user has changed')
        if (user) {
          dispatch('fetchAuthUser')
            // is a good practice to wait for the authenticated user to be fetched from db before resolve the nav
            // so we know that we always have a user in the page component
            // resolve the user coming from the db
            .then(dbUser => resolve(dbUser))
        } else {
          resolve(null) // if no user then resolve null
        }
      })
      commit('setUnsubscribeAuthObserver', unsubscribe)
    })
  },

  createThread ({commit, state, dispatch}, {text, title, forumId}) {
    return new Promise((resolve, reject) => {
      // const threadId = 'greatThread' + Math.random()
      const threadId = firebase.database().ref('threads').push().key
      const postId = firebase.database().ref('posts').push().key
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = {
        title,
        forumId,
        userId,
        publishedAt,
        firstPostId: postId,
        posts: {}
      }
      thread.posts[postId] = postId
      const post = {text, publishedAt, threadId, userId}

      const updates = {}
      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId

      updates[`posts/${postId}`] = post
      updates[`users/${userId}/posts/${postId}`] = postId

      firebase.database().ref().update(updates)
        .then(() => {
          // update thread
          commit('setItem', {resource: 'threads', id: threadId, item: thread})
          commit('appendThreadToForum', {parentId: forumId, childId: threadId})
          commit('appendThreadToUser', {parentId: userId, childId: threadId})
          // update post
          commit('setItem', {resource: 'posts', item: post, id: postId})
          commit('appendPostToThread', {parentId: post.threadId, childId: postId})
          commit('appendPostToUser', {parentId: post.userId, childId: postId})
          resolve(state.threads[threadId])  // resolve returning the whole new thread object
        })
    })
  },

  createUser ({state, commit}, {id, email, name, username, avatar = null}) {
    return new Promise((resolve, reject) => {
      const registeredAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {avatar, email, name, username, usernameLower, registeredAt}
      console.log('uid: ', id, 'user -> ', user)
      // const userId = firebase.database().ref('users').push().key
      // firebase.database().ref('users').child(userId).set(user)
      // will use id passed from the component that is the firebase user uid auth
      firebase.database().ref('users').child(id).set(user)
        .then(() => {
          commit('setItem', {resource: 'users', id: id, item: user})
          resolve(state.users[id])
        })
    })
  },

  registerUserWithEmailAndPassword ({dispatch}, {email, name, username, password, avatar = null}) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (response) {
        const user = response.user
        return dispatch('createUser', {id: user.uid, email, name, username, password, avatar})
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
            return dispatch('createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL})
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

  updateThread ({state, commit, dispatch}, {title, text, id}) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id]
      const post = state.posts[thread.firstPostId]

      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = {}
      updates[`posts/${thread.firstPostId}/text`] = text
      updates[`posts/${thread.firstPostId}/edited`] = edited
      updates[`threads/${id}/title`] = title

      firebase.database().ref().update(updates)
        .then(() => {
          commit('setThread', {thread: {...thread, title}, threadId: id})
          commit('setPost', {postId: thread.firstPostId, post: {...post, text, edited}})
          resolve(post)
        })
    })
  },

  updatePost ({state, commit}, {id, text}) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id]
      const edited = { // to add edited timestamp
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }
      const updates = {text, edited}
      firebase.database().ref('posts').child(id).update(updates) // same as ref('posts/${id}')
        .then(() => {
          commit('setPost', {postId: id, post: {...post, text, edited}})
          resolve(post)
        })
    })
  },

  updateUser ({commit}, user) {
    commit('setUser', {userId: user['.key'], user})
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
          return dispatch('fetchUser', {id: userId})
            .then(user => {
              commit('setAuthId', userId)
              resolve(user)
            })
        } else {
          resolve(null)
        }
      })
    })
  },

  fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: '🏷'}),
  fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id, emoji: '🌧'}),
  fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id, emoji: '📄'}),
  fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id, emoji: '💬'}),
  fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id, emoji: '🙋'}),

  fetchCategories: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'categories', ids, emoji: '🏷'}),
  fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'forums', ids, emoji: '🌧'}),
  fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids, emoji: '🌧'}),
  fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', ids, emoji: '💬'}),
  fetchUsers: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'users', ids, emoji: '🙋'}),

  fetchAllCategories ({state, commit}) {
    console.log('🔥', '🏷', 'all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('setItem', {resource: 'categories', id: categoryId, item: category})
        })
        resolve(Object.values(state.categories))
      })
    })
  },

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
