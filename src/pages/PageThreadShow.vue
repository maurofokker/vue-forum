<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <PostList :posts="posts" />
    <form @submit.prevent="addPost">
      <div class="form-group">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
          v-model="newPostText"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
import sourceData from '@/data'
import PostList from '@/components/PostList'

export default {
  components: {
    PostList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      thread: sourceData.threads[this.id],
      newPostText: ''
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
    addPost () {
      const postId = 'greatPost' + Math.random()    // to be changed later
      const post = {
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2',
        '.key': postId
      }
      // sourceData.posts[postId] = post    // done in this way the data will not be reactive (will not have reactive getter and setters)
      // this.thread.posts[postId] = postId // done in this way the data will not be reactive (will not have reactive getter and setters)
      // to make data reactive we need to use Vue.set(obj, propertyName, value)
      // to not import Vue we can use the instance alias this.$set
      this.$set(sourceData.posts, postId, post)
      this.$set(this.thread.posts, postId, postId)

      // add post to the user so the counter of post will be reflected with this new post
      this.$set(sourceData.users[post.userId].posts, postId, postId)
      // because is reactive after adding the post in the posts and thread will clean textarea nc is bounding with v-model
      this.newPostText = ''
    }
  }
}
</script>
