<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Editing <i>{{thread.title}}</i></h1>

    <ThreadEditor
      ref="editor"
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import {mapActions} from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

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

  mixins: [asyncDataStatus],

  computed: {
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    // first post of the thread text
    text () {
      const post = this.$store.state.posts.items[this.thread.firstPostId]
      return post ? post.text : null
    },
    hasUnsavedChanges () {
      // this.saved is not required in this implementation because `this.thread.title` and `this.text` are reactive
      // Thus `hasUnsavedChanges` will automatically become false when the thread is updated
      return this.$refs.editor.form.title !== this.thread.title || this.$refs.editor.form.text !== this.text
    }
  },

  methods: {
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    ...mapActions('posts', ['fetchPost']),
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
      .then(() => { this.asyncDataStatus_fetched() })
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Any unsaved changes will be lost!')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style>
</style>
