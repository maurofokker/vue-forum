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
        <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
        <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit post'}}</button>
      </div>
  </form>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      threadId: {
        required: false
      },
      post: {
        type: Object,
        // custom prop validater pass the prop value
        validator: obj => {
          const keyIsValid = typeof obj['.key'] === 'string'
          const textIsValid = typeof obj.text === 'string'
          const valid = keyIsValid && textIsValid
          if (!keyIsValid) {
            console.log('the post prop object must include a `.key` attribute')
          }
          if (!textIsValid) {
            console.log('the post prop object must include a `text` attribute')
          }
          return valid
        }
      }
    },

    data () {
      return {
        text: this.post ? this.post.text : ''
      }
    },

    computed: {
      isUpdate () {
        return !!this.post
      }
    },

    methods: {
      ...mapActions('posts', ['createPost', 'updatePost']),
      save () {
        this.persist()
          .then(post => {
            this.$emit('save', {post})
          })
      },

      create () {
        const post = {
          text: this.text,
          threadId: this.threadId
        }
        this.text = ''

        // dispatch can be done here since it wont add a lot of complexity to the save method
        return this.createPost(post)
      },

      update () {
        const payload = {
          id: this.post['.key'],
          text: this.text
        }
        return this.updatePost(payload)
      },

      persist () {
        // this will return a promise
        return this.isUpdate ? this.update() : this.create()
      },

      cancel () {
        this.$emit('cancel')
      }
    }
  }
</script>

<style>

</style>
