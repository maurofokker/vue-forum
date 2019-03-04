<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>{{ thread.title }}
      <router-link
        :to="{name: 'ThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="" class="link-unstyled">{{user.name}}</a>, <AppDate :timestamp="thread.publishedAt" />.
      <span style="float:right; margin-top: 2px" class="hide-mobile text-faded text-small">
        {{repliesCount}} replies by {{contributorsCount}} contributors
      </span>
    </p>

    <PostList :posts="posts" />
    <PostEditor :threadId="id" />

  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import {countObjectProperties} from '@/utils'
import {mapActions} from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    PostList,
    PostEditor
  },

  props: {
    id: {
      required: true,
      type: String
    }
  },

  mixins: [asyncDataStatus],

  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },

    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
    },

    user () {
      return this.$store.state.users[this.thread.userId]
    },

    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
      // // find the replies
      // const replies = Object.keys(this.thread.posts)
      //   .filter(postId => postId !== this.thread.firstPostId)
      //   .map(postId => this.$store.state.posts[postId])
      // // get the user ids
      // const userIds = replies.map(post => post.userId)
      // // count the unique ids
      // return userIds.filter((item, index) => index === userIds.indexOf(item)).length
    },

    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts'])
  },
  // hooks lifecycles
  created () {
    // fetch thread
    this.fetchThread({id: this.id})
      .then(thread => {
        // fetch user
        this.fetchUser({id: thread.userId})

        return this.fetchPosts({ids: Object.keys(thread.posts)})
      })
      .then(posts => {
        return Promise.all(posts.map(post => {
          this.fetchUser({id: post.userId})
        }))
      })
      .then(() => { this.asyncDataStatus_fetched() })

        // Object.keys(thread.posts).forEach(postId => {
        //   // fetch post
        //   this.$store.dispatch('fetchPost', {id: postId})
        //     .then(post => {
        //       // fetch user
        //       this.$store.dispatch('fetchUser', {id: post.userId})
        //     })
        // })
  }
}
</script>
