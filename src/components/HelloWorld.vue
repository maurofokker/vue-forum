<template>
  <div>
    <h2>Welcome to the Forum</h2>
    <div v-for="thread in threads">
      <h2>{{ thread.title }}</h2>
      <div v-for="postId in thread.posts">
        <p>{{ users[posts[postId].userId].name }}</p>
        <p>{{ posts[postId].text }}</p>
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

