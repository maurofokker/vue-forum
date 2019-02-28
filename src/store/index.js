import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import {countObjectProperties} from '@/utils'

Vue.use(Vuex)

const makeAppendChildToParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default new Vuex.Store({

  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3' // '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },

  getters: {
    authUser (state) {
      // return state.users[state.authId]
      return {}
    },

    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),  // hof to pass params to getter
    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },

  actions: {
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

    fetchThread ({state, commit}, {id}) {
      console.log('🔥 📄', id)
      return new Promise((resolve, reject) => {
        firebase.database().ref('threads').child(id).once('value', snapshot => {
          const thread = snapshot.val()
          commit('setThread', {threadId: snapshot.key, thread: {...thread, '.key': snapshot.key}})
          resolve(state.threads[id])
        })
      })
    },

    fetchUser ({state, commit}, {id}) {
      console.log('🔥 🙋‍', id)
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(id).once('value', snapshot => {
          const user = snapshot.val()
          commit('setUser', {userId: snapshot.key, user: {...user, '.key': snapshot.key}})
          resolve(state.users[id])
        })
      })
    },

    fetchPost ({state, commit}, {id}) {
      console.log('🔥 💬‍', id)
      return new Promise((resolve, reject) => {
        firebase.database().ref('posts').child(id).once('value', snapshot => {
          const post = snapshot.val()
          commit('setPost', {postId: snapshot.key, post: {...post, '.key': snapshot.key}})
          resolve(state.posts[id])
        })
      })
    }
  },

  mutations: {
    setPost (state, {post, postId}) { // Vue.set(object_to_add_new_prop, the_prop_name, the_value_of_the_prop)
      Vue.set(state.posts, postId, post)
    },

    setUser (state, {user, userId}) {
      Vue.set(state.users, userId, user)
    },

    setThread (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },

    // appendPostToThread (state, {postId, threadId}) {
    //   // Vue.set(this.thread.posts, postId, postId)
    //   const thread = state.threads[threadId]
    //   // util in case of new threads bc they dont have a post property
    //   // We need to make sure the post object exist before adding the postId
    //   if (!thread.posts) {
    //     Vue.set(thread, 'posts', {})
    //   }
    //   Vue.set(thread.posts, postId, postId)
    // },
    appendPostToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),

    appendPostToUser: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),

    appendThreadToForum: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'}),

    appendThreadToUser: makeAppendChildToParentMutation({parent: 'users', child: 'threads'})

  }
})
