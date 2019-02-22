<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{ user.name }}</a>

      <a href="#">
        <img :src="user.avatar" alt class="avatar-large">
      </a>

      <p class="desktop-only text-small">{{ userPostsCount }} posts</p>
    </div>

    <div class="post-content">
      <div>{{ post.text }}</div>
    </div>

    <div class="post-date text-faded">
      <AppDate :timestamp="post.publishedAt"/>
    </div>

  </div>
</template>

<script>
import sourceData from '@/data'

export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    user () {
      return sourceData.users[this.post.userId]
    },
    userPostsCount () {
      const postIds = this.user.posts
      const postIdsArray = Object.keys(postIds)
      return postIdsArray.length
    }
  }
}
</script>

<style>
</style>
