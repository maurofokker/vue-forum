<template>
  <div v-if="forum" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>

    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import {mapActions} from 'vuex'

export default {

  components: {
    ThreadEditor
  },

  props: {
    forumId: {
      required: true,
      type: String
    }
  },

  computed: {
    forum () {
      return this.$store.state.forums[this.forumId]
    }
  },

  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    save ({title, text}) {
      // dispatch action
      this.createThread({
        forumId: this.forum['.key'],
        title,
        text
      }).then(thread => {
        this.$router.push({name: 'threadShow', params: {id: thread['.key']}})
      })
    },

    cancel () {
      this.$router.push({name: 'Forum', params: {id: this.forum['.key']}})
    }
  },
  created () {
    this.fetchForum({id: this.forumId})
  }
}
</script>

<style>
</style>
