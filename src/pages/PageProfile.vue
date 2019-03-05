<template>
  <div class="flex-grid">
    <UserProfileCard
      v-if="!edit"
      :user="user" />

    <UserProfileCardEditor
      v-else
      :user="user" />

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{user.username}} recent activity</span>
        <a href="#">See only started threads?</a>
      </div>

      <hr>

      <PostList :posts="userPosts" />
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import { mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {

  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },

  mixins: [asyncDataStatus],

  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      'user': 'authUser'  // user maps to authUser getter in the store
    }),

    userPosts () {
      return this.$store.getters.userPosts(this.user['.key'])
    }
  },

  created () {
    // fetch the user posts before emit the ready event
    this.$store.dispatch('fetchPosts', {ids: this.user.posts})
      .then(() => this.asyncDataStatus_fetched())
  }

}
</script>

<style>
</style>
