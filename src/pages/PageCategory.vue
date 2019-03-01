<template>
  <div v-if="category" class="col-full">
    <h1>{{ category.name }}</h1>
    <CategoryListItem :category="category"/>
  </div>
</template>

<script>
    import CategoryListItem from '@/components/CategoryListItem'
    import { mapActions } from 'vuex'
    export default {
      components: {
        CategoryListItem
      },
      props: {
        id: {
          required: true,
          type: String
        }
      },
      computed: {
        category () {
          return this.$store.state.categories[this.id]
        }
      },
      methods: {
        ...mapActions(['fetchCategory', 'fetchForums'])
      },
      created () {
        this.fetchCategory({id: this.id})
          .then(category => {
            this.fetchForums({ids: category.forums})
          })
      }
    }
</script>

<style scoped>
</style>
