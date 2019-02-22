<template>

  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
// using from '@/data' would work bc '@' means 'src' directory
import sourceData from '@/data'
import CategoryList from '@/components/CategoryList'
console.log(sourceData)

export default {
  components: {
    CategoryList
  },
  data () {
    // bind data to component data and can be used in the template to render data
    // this can be watched in the vue extension of chrome/firefox
    return {
      categories: Object.values(sourceData.categories)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

