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

// to define global guards in the router file we need to define router instance
// we store router in a variable instead exported directly the instance
const router = new Router({
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
      meta: {requiresAuth: true}//, introduce meta that allow to identify the route and take actions
      // protecting route using per-route guard
      // beforeEnter (to, from, next) {
      //   if (store.state.authId) {
      //     next()
      //   } else {
      //     next({name: 'Home'})
      //   }
      // }
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

// protecting route with global nav guard and meta field to identify route
router.beforeEach((to, from, next) => {
  console.log(`Navigating to ${to.name} from ${from.name}`)
  // check meta in route this will not work for nested routes i.e /me/nested
  // if (to.meta.requiresAuth) {
  // to make it work with nested data we use _.matched_ this will look all routes that match /me and /me/nested
  // and if we use the _some_ function we can look for the meta field and now we are protected in nested routes
  if (to.matched.some(route => route.meta.requiresAuth)) {
    // protected route
    if (store.state.authId) {
      next()
    } else {
      next({name: 'Home'})
    }
  } else {
    next() // to resolve the navigation, nor forget it
  }
})

export default router
