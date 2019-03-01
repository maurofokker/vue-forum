import Vue from 'vue'

const makeAppendChildToParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default {
  setPost (state, {post, postId}) { // Vue.set(object_to_add_new_prop, the_prop_name, the_value_of_the_prop)
    Vue.set(state.posts, postId, post)
  },

  setUser (state, {user, userId}) {
    Vue.set(state.users, userId, user)
  },

  setThread (state, {thread, threadId}) {
    Vue.set(state.threads, threadId, thread)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
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
