<template>

  <div class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
// '@' means 'src' directory
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'

export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },

  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },

  created () {
    this.fetchAllCategories()
      .then(categories => {
        categories.forEach(category => this.fetchForums({ids: Object.keys(category.forums)}))
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

