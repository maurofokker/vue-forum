<template>
  <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
          v-model="text"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
  </form>
</template>

<script>
export default {
  props: {
    threadId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }
      // this.$store.state.posts[postId] = post    // done in this way the data will not be reactive (will not have reactive getter and setters)
      // this.thread.posts[postId] = postId // done in this way the data will not be reactive (will not have reactive getter and setters)

      // because is reactive after adding the post in the posts and thread will clean textarea nc is bounding with v-model
      this.text = ''

      // this is how we pass an event to the parent so it is the parent who handle the logic
      // first parameter is the name of the event and the rest are other params
      // it is better to wrap it in an object (using es6 where key and value are the same)
      this.$emit('save', {post}) // event is good here in case parent component need to do something on save like hide the editor
      // dispatch can be done here since it wont add a lot of complexity to the save method
      this.$store.dispatch('createPost', post)
    }
  }
}
</script>

<style>

</style>
