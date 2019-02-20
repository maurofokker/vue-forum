# vue-forum

> vuejs forum

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Notes

### Creating project

- Vue client [installation](https://cli.vuejs.org/guide/installation.html)
- Scafolding project with vue
```bash
  ➜ vue init vueschool/webpack-template vue-forum
	? Project name vue-forum
	? Project description vuejs forum
	? Author Mauro
	? Vue build standalone
	? Install vue-router? Yes
	? Use ESLint to lint your code? Yes
	? Pick an ESLint preset Standard
	? Setup unit tests with Karma + Mocha? No
	? Setup e2e tests with Nightwatch? No

	   vue-cli · Generated "vue-forum".

	   To get started:
	     cd vue-forum
	     npm install
	     npm run dev
   Documentation can be found at https://vuejs-templates.github.io/webpack
   ➜ cd vue-forum
   ➜ npm install
```
- Initializing project after dependencies installed
```bash
➜ npm run dev | yarn dev
```

### Applications components

- Fake data model can be found in `src/data.json` this will be changed later to use firebase
- Vue app starting point at `main.js`
  ```jsx
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
  ```
  - Vue instance recibe an options object [Full list of options](https://vuejs.org/v2/api/#Options-Data)
  - `el` provide the Vue instance an existing DOM element to mount on
  - `components` a hash of components to be made available to the Vue instance
  - `template` to be used as the markup for the Vue instance, it will replace the mounted element
  - `router` attach the router to the Vue instance
- Declare de `App` vue instance
  ```jsx
  <template>
    <div id="app">
      <!-- -->
    </div>
  </template>

  <script>
  export default {
    name: 'app'
  }
  </script>

  <style>
  //...
  </style>
  ```
- Declaring a component in the application (in this case is `HelloWorld.vue`)
- To load data in a component can use the `data() {..}` function in the exported component and bind it to component data
  ```js
  export default {
    name: 'HelloWorld',
    data () {
      // bind data to component data and can be used in the template to render data
      // this can be watched in the vue extension of chrome/firefox
      return {
        threads: sourceData.threads,
        posts: sourceData.posts,
        users: sourceData.users
      }
    }
  }
  ```
- To render the data you can use the `<template>` present in the component
  ```jsx
  <template>
    <div>
      <h2>Welcome to the Forum</h2>
      <div v-for="thread in threads">
        <h2>{{ thread.title }}</h2>
        <div v-for="postId in thread.posts">
          <p>{{ users[posts[postId].userId].name }}</p>
          <p>{{ posts[postId].text }}</p>
        </div>
      </div>
    </div>
  </template>
  ```
  - `v-for` is a directive to render a list of items based on an array [reference](https://vuejs.org/v2/guide/list.html)
- Applying style to the **_app/component_**
  1. If it will be used in the whole app and not just the component the style can go globally in the `assets` directory in order to get handled by webpack (minified) (`src/assets/css/style.css`)
  2. Styles can go scoped by components and be declared inside of them
  3. To import a style globally do it in `App.vue` at the end of the file
  ```jsx
  <style>
    @import "assets/css/style.css";
  </style>
  ```
  4. When you want to import from node modules use `~` provided by the `css-loader` (`import "~bootstrap/css/bootstrap.css"`) this apply for _SASS_ and _LESS_ too
  5. Apply style to the application container `App.vue`
  ```jsx
  <template>
    <div id="app">
      <img src="./assets/logo.png">
      <div class="container">
        <router-view/>
      </div>
    </div>
  </template>
  ```
    - `<router-view>` renders the content of the matched component for given path [reference](https://router.vuejs.org/api/#router-view)
  6. Apply styles to html elements in component
  ```jsx
  <template>
    <div>
      <div v-for="thread in threads"
          class="col-large push-top">

        <h1>{{ thread.title }}</h1>

        <div class="post-list">
          <div v-for="postId in thread.posts" class="post">
            <div class="user-info">
              <a href="#" class="user-name">{{ users[posts[postId].userId].name }}</a>

              <a href="#">
                <img :src="users[posts[postId].userId].avatar" alt="" class="avatar-large">
              </a>

              <p class="desktop-only text-small">107 posts</p>
            </div>

            <div class="post-content">
              <div>
                {{ posts[postId].text }}
              </div>
            </div>

            <div class="post-date text-faded">
                {{ posts[postId].publishedAt }}
            </div>

          </div>
        </div>
      </div>
    </div>
  </template>
  ```

### Routing

Using the official _VueJS_ router plugin `vue-router` allows to create _SPA_ mapping components to routes

- Router is included by _vue cli_ when we generated the application and selected that option in the template
- _vue cli_ template create for `src/router/index.js`
  ```jsx
  import Vue from 'vue'
  import Router from 'vue-router'
  import HelloWorld from '@/components/HelloWorld'

  Vue.use(Router)

  export default new Router({
    routes: [
      {
        path: '/',
        name: 'Hello',
        component: HelloWorld
      }
    ],
    mode: 'history'
  })
  ```
  - imports `vue` and `vue-router`
  - export an instance of `Router` with some options
  - declares an array of `routes` objects that match a component to a path:
    - _path_: declares a path _/_ (root)
    - _name_: identify route with a name [named routes](https://router.vuejs.org/guide/essentials/named-routes.html)
    - _component_: match declared path to a component
  - `mode: 'history'` will remove the hashtag (http://localhost:8080/#/threads -> http://localhost:8080/threads) in the url to allow history navigation btw components

- If we recall the `main.js` file the router is passed as an option to the `Vue` instance
- All application components will aware of the router and it gives access to special components like the `<router-view>` declared in `src/App.vue`

#### Steps to create a new component and declaring a dynamic route to it

1. Create the component inside `src/components` folder
  ```jsx
  <template>
    <div class="col-large push-top">
      <h1>{{ thread.title }}</h1>

      <div class="post-list">
        <div v-for="postId in thread.posts" class="post">
          <div class="user-info">
            <a href="#" class="user-name">{{ users[posts[postId].userId].name }}</a>

            <a href="#">
              <img :src="users[posts[postId].userId].avatar" alt class="avatar-large">
            </a>

            <p class="desktop-only text-small">107 posts</p>
          </div>

          <div class="post-content">
            <div>{{ posts[postId].text }}</div>
          </div>

          <div class="post-date text-faded">{{ posts[postId].publishedAt }}</div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import sourceData from '@/data'

  export default {
    props: {
      id: {
        required: true,
        type: String
      }
    },
    data () {
      return {
        thread: sourceData.threads[this.id],
        posts: sourceData.posts,
        users: sourceData.users
      }
    }
  }
  </script>
  ```
  - Component can contain `<template>`, `<script>` (this is required) and `<styles>` [reference](https://vuejs.org/v2/guide/components.html)
  - `<template>` is what it is rendered by the component
  - Inside `<script>` is declared the _vue component_
    - Component defines a property called `props` when expect one or more of thems. _Props_ are the way components can accept data from components that include them (parent components) [reference 1](https://vuejs.org/v2/guide/components-props.html), [reference 2](https://flaviocopes.com/vue-props/)
2. Import the component into `src/router/index.js` where routes are declared
  ```jsx
  import Vue from 'vue'
  import Router from 'vue-router'
  import HelloWorld from '@/components/HelloWorld'
  import ThreadShow from '@/components/ThreadShow'

  Vue.use(Router)

  export default new Router({
    routes: [
      {
        path: '/',
        name: 'Hello',
        component: HelloWorld
      },
      {
        path: '/threads/:id',
        name: 'threadShow',
        component: ThreadShow,
        props: true
      }
    ],
    mode: 'history'
  })
  ```
  - `path` declares a path to a specific thread using dynamic segment (_:[dynamic_segment]_)
  - `props: true` allows the router to pass params to components as properties this is because by default route expose dynamic segments in components with *_this.$route.params.[dynamic_segment]_* but this is not ideal because the component will be tightly coupled to the router
3. Now the new component can be accessed with the route `http://localhost:8080/threads/:id` -> `http://localhost:8080/threads/-KsjpzIeFTdcsBIPvUfP`
