import firebase from 'firebase'

export default {
  createPost ({commit, state}, post) {
    const postId = 'greatPost' + Math.random()
    post['.key'] = postId
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    commit('setPost', {post, postId})
    // commit('appendPostToThread', {threadId: post.threadId, postId})
    // commit('appendPostToUser', {userId: post.userId, postId})
    commit('appendPostToThread', {parentId: post.threadId, childId: postId})
    commit('appendPostToUser', {parentId: post.userId, childId: postId})
    return Promise.resolve(state.posts[postId])
  },

  createThread ({commit, state, dispatch}, {text, title, forumId}) {
    return new Promise((resolve, reject) => {
      const threadId = 'greatThread' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = {
        '.key': threadId,
        title,
        forumId,
        userId,
        publishedAt
      }
      commit('setThread', {thread, threadId})
      commit('appendThreadToForum', {parentId: forumId, childId: threadId})
      commit('appendThreadToUser', {parentId: userId, childId: threadId})

      dispatch('createPost', {text, threadId}) // is the post object destructured
        .then(post => {
          // this will handle the case when we want edit a newly created thread
          // so we update the thread after create the post
          commit('setThread', {threadId, thread: {...thread, firstPostId: post['.key']}})
        })
      resolve(state.threads[threadId])  // resolve returning the whole new thread object
    })
  },

  updateThread ({state, commit, dispatch}, {title, text, id}) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id]
      // const post = state.posts[thread.firstPostId] // <-- done in updatePost action

      const newThread = {...thread, title}
      // const newPost = {...post, text} // <-- done in updatePost action
      commit('setThread', {thread: newThread, threadId: id})
      // commit('setPost', {post: newPost, postId: thread.firstPostId}) // <-- done in updatePost action

      dispatch('updatePost', {id: thread.firstPostId, text})
        .then(() => {
          resolve(newThread)  // now we can resolve the promise bc dispatch is async
        })
    })
  },

  updatePost ({state, commit}, {id, text}) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id]
      commit('setPost', {
        postId: id,
        post: {
          ...post,
          text,
          edited: { // to add edited timestamp
            at: Math.floor(Date.now() / 1000),
            by: state.authId
          }
        }
      })

      resolve(post)
    })
  },

  updateUser ({commit}, user) {
    commit('setUser', {userId: user['.key'], user})
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
        resolve(state[resource][id])
      })
    })
  },

  fetchItems ({dispatch}, {ids, resource, emoji}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})))
  }
}
