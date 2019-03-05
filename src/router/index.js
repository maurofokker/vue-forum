import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/PageHome'
import Profile from '@/pages/PageProfile'
import Register from '@/pages/PageRegister'
import SignIn from '@/pages/PageSignIn'
import ThreadShow from '@/pages/PageThreadShow'
import ThreadCreate from '@/pages/PageThreadCreate'
import ThreadEdit from '@/pages/PageThreadEdit'
import NotFound from '@/pages/PageNotFound'
import Forum from '@/pages/PageForum'
import Category from '@/pages/PageCategory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forums/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/threads/create/:forumId',  // this one goes first bc the next one is a dynamic segment and it is evaluated top to bottom
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true
    },
    {
      path: '/threads/:id',
      name: 'threadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/threads/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true,
      beforeEnter (to, from, next) {
        if (store.state.authId) {
          next()
        } else {
          next({name: 'Home'})
        }
      }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: {edit: true}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/logout',
      name: 'SignOut',
      beforeEnter (to, from, next) {
        store.dispatch('signOut')
          .then(() => next({name: 'Home'}))
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})
