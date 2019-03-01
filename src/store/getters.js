import {countObjectProperties} from '@/utils'

export default {
  authUser (state) {
    return state.users[state.authId]
    // return {}
  },

  userThreadsCount: state => id => countObjectProperties(state.users[id].threads),  // hof to pass params to getter
  userPostsCount: state => id => countObjectProperties(state.users[id].posts),
  threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
}
