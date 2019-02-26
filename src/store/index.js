import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    ...sourceData,
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },

  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },

  actions: {
    createPost ({commit, state}, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', {post, postId})
      commit('appendPostToThread', {threadId: post.threadId, postId})
      commit('appendPostToUser', {userId: post.userId, postId})
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
        commit('appendThreadToForum', {forumId, threadId})
        commit('appendThreadToUser', {userId, threadId})

        dispatch('createPost', {text, threadId}) // is the post object destructured
        resolve(state.threads[threadId])  // resolve returning the whole new thread object
      })
    },

    updateUser ({commit}, user) {
      commit('setUser', {userId: user['.key'], user})
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

    appendPostToThread (state, {postId, threadId}) {
      // Vue.set(this.thread.posts, postId, postId)
      const thread = state.threads[threadId]
      // util in case of new threads bc they dont have a post property
      // We need to make sure the post object exist before adding the postId
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },

    appendPostToUser (state, {postId, userId}) {
      // Vue.set(this.$store.state.users[post.userId].posts, postId, postId)
      const user = state.users[userId]
      if (!user.posts) {
        Vue.set(user, 'posts', {})
      }
      Vue.set(user.posts, postId, postId)
    },

    appendThreadToForum (state, {forumId, threadId}) {
      const forum = state.forums[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    },

    appendThreadToUser (state, {threadId, userId}) {
      const user = state.users[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
    }

  }
})
