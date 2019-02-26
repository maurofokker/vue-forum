<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <p>
      By <a href="" class="link-unstyled">Robin</a>, <AppDate :timestamp="thread.publishedAt" />.
      <span style="float:right; margin-top: 2px" class="hide-mobile text-faded text-small">
        3 replies by contributors
      </span>
    </p>

    <PostList :posts="posts" />
    <PostEditor @save="addPost" :threadId="id" />

  </div>
</template>

<script>

import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'

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
  data () {
    return {
      thread: this.$store.state.threads[this.id]
    }
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  },
  methods: {
    // using object destructuring of eventData.post to post
    addPost ({post}) {
      const postId = post['.key']
      // to make data reactive we need to use Vue.set(obj, propertyName, value)
      // we can use the instance alias this.$set to not import Vue in the component
      this.$set(this.$store.state.posts, postId, post)
      this.$set(this.thread.posts, postId, postId)

      // add post to the user so the counter of post will be reflected with this new post
      this.$set(this.$store.state.users[post.userId].posts, postId, postId)
    }
  }
}
</script>
