<template>
  <div class="flex-grid">
    <h1>My Profile</h1>
    <!--<UserProfileCard-->
    <!--v-if="!edit"-->
      <!--:user="user" />-->

    <!--<UserProfileCardEditor-->
      <!--v-else-->
      <!--:user="user" />-->

    <!--<div class="col-7 push-top">-->
      <!--<div class="profile-header">-->
        <!--<span class="text-lead">{{user.username}} recent activity</span>-->
        <!--<a href="#">See only started threads?</a>-->
      <!--</div>-->

      <!--<hr>-->

      <!--<PostList :posts="userPosts" />-->
    <!--</div>-->
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {

  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },

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
      if (this.user.posts) {
        return Object.values(this.$store.state.posts)
          .filter(post => post.userId === this.user['.key'])
      }
      return []
    }
  },

  /*
  to: is the route navigating to
  from: is the route we are navigating away
  next: function we have to run to resolve the navigation
   */
  beforeRouteEnter (to, from, next) {
    // we can't use this.$store... bc at this point the component is not created yet
    // so we don't have access to _this_ and we need to import the store (the current not new instance)
    if (store.state.authId) { // if user authenticated continue
      next()
    } else {  // redirect to home page if user is not authenticated
      next({name: 'Home'})
    }
  },

  created () {
    this.$emit('ready')
  }

}
</script>

<style>
</style>
