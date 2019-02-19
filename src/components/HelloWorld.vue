<template>

  <div>
    <div v-for="thread in threads"
        class="col-large push-top">

      <h1>{{ thread.title }}</h1>

      <div class="post-list">
        <div v-for="postId in thread.posts" class="post">
          <div class="user-info">
            <a href="#" class="user-name">{{ users[posts[postId].userId].name }}</a>

            <a href="#">
              <img :src="users[posts[postId].userId].avatar" alt="" class="avatar-large">
            </a>

            <p class="desktop-only text-small">107 posts</p>
          </div>

          <div class="post-content">
            <div>
              {{ posts[postId].text }}
            </div>
          </div>

          <div class="post-date text-faded">
              {{ posts[postId].publishedAt }}
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// using from '@/data' would work bc '@' means 'src' directory
import sourceData from '../data.json'
console.log(sourceData)

export default {
  name: 'HelloWorld',
  data () {
    // bind data to component data and can be used in the template to render data
    // this can be watched in the vue extension of chrome/firefox
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

