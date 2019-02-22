<template>

  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <ForumList :forums="forums" />
  </div>
</template>

<script>
// using from '@/data' would work bc '@' means 'src' directory
import sourceData from '../data.json'
import ForumList from '../components/ForumList'
console.log(sourceData)

export default {
  components: {
    ForumList
  },
  data () {
    // bind data to component data and can be used in the template to render data
    // this can be watched in the vue extension of chrome/firefox
    return {
      forums: Object.values(sourceData.forums),
      posts: sourceData.posts,
      users: sourceData.users
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

