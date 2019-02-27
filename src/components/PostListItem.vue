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
      <div v-if="!editing">{{ post.text }}</div>
      <div v-else>
        <PostEditor
          :post="post"
          @save="editing = false"/>
      </div>
    </div>

    <div class="post-date text-faded">
      <AppDate :timestamp="post.publishedAt"/>
    </div>

  </div>
</template>

<script>
import { countObjectProperties } from '@/utils'
import PostEditor from '@/components/PostEditor'

export default {

  components: {
    PostEditor
  },

  props: {
    post: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      editing: false
    }
  },

  computed: {
    user () {
      return this.$store.state.users[this.post.userId]
    },
    userPostsCount () {
      return countObjectProperties(this.user.posts)
    }
  }
}
</script>

<style>
</style>
