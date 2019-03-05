<template>
  <div id="app">
    <TheNavbar />
    <div class="container">
      <router-view :key="$route.path" v-show="showPage" @ready="pageReady"/>
      <AppSpinner v-show="!showPage"></AppSpinner>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'
export default {
  components: {
    TheNavbar,
    AppSpinner
  },
  methods: {
    pageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  data () {
    return {
      showPage: false
    }
  },
  created () {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    NProgress.start()
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      NProgress.start()
      next()
    })
  }
}
</script>

<style>

  @import "assets/css/style.css";
  @import "~nprogress/nprogress.css"; // ~ look in the node_modules

  #nprogress .bar {
    background: #57AD8D;
  }
</style>
