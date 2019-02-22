<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <PostList :posts="posts" />
    <PostEditor @save="addPost" :threadId="id" />

  </div>
</template>

<script>
import sourceData from '@/data'
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
      thread: sourceData.threads[this.id]
    }
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(sourceData.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  },
  methods: {
    addPost (eventData) {
      console.log(eventData)
      const post = eventData.post
      const postId = eventData.post['.key']
      // to make data reactive we need to use Vue.set(obj, propertyName, value)
      // we can use the instance alias this.$set to not import Vue in the component
      this.$set(sourceData.posts, postId, post)
      this.$set(this.thread.posts, postId, postId)

      // add post to the user so the counter of post will be reflected with this new post
      this.$set(sourceData.users[post.userId].posts, postId, postId)
    }
  }
}
</script>
