<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>

    <ThreadEditor ref="editor" @save="save" @cancel="cancel" />
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

  mixins: [asyncDataStatus],

  props: {
    forumId: {
      required: true,
      type: String
    }
  },

  data () {
    return {
      saved: false
    }
  },

  computed: {
    forum () {
      return this.$store.state.forums[this.forumId]
    },
    // check if any of the thread information is set and the thread has not been saved
    hasUnsavedChanges () {
      // to improve ux we can validate if user has writen something, if data is in a child component
      // we can access through _refs_ as a property passed to the component
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
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
        this.saved = true // in order to avoid leaving confirmation
        this.$router.push({name: 'threadShow', params: {id: thread['.key']}})
      })
    },

    cancel () {
      this.$router.push({name: 'Forum', params: {id: this.forum['.key']}})
    }
  },
  created () {
    this.fetchForum({id: this.forumId})
      .then(() => { this.asyncDataStatus_fetched() })
  },

  // to confirm before leave page in case user is doing something
  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost.')
      if (confirmed) {
        next()  // perform navigation normally
      } else {
        next(false) // if not abort and stay in page
      }
    } else {
      next()
    }
  }
}
</script>

<style>
</style>
