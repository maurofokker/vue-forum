<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>Editing <i>{{thread.title}}</i></h1>

    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel" />
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
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },
    // first post of the thread text
    text () {
      const post = this.$store.state.posts[this.thread.firstPostId]
      return post ? post.text : null
    }
  },

  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),
    save ({title, text}) {
      // dispatch action
      this.updateThread({
        id: this.id,
        title,
        text
      }).then(thread => {
        this.$router.push({name: 'threadShow', params: {id: this.id}})
      })
    },

    cancel () {
      console.log('FORUM', this.thread)
      this.$router.push({name: 'threadShow', params: {id: this.id}})
    }
  },

  created () {
    this.fetchThread({id: this.id})
      .then(thread => this.fetchPost({id: thread.firstPostId}))
  }
}
</script>

<style>
</style>
