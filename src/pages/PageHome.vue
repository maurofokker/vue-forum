<template>

  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <ThreadList :threads="threads" />
  </div>
</template>

<script>
// using from '@/data' would work bc '@' means 'src' directory
import sourceData from '../data.json'
import ThreadList from '../components/ThreadList'
console.log(sourceData)

export default {
  components: {
    ThreadList
  },
  data () {
    // bind data to component data and can be used in the template to render data
    // this can be watched in the vue extension of chrome/firefox
    return {
      threads: Object.values(sourceData.threads),
      posts: sourceData.posts,
      users: sourceData.users
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

