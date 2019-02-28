# vue-forum

> vuejs forum

## Build Setup

```bash
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

### Vue instance lifecycle hooks

- [Full reference](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks)
- Gives the opportunity to add code at specific stages
- Each hook are colled with their `this` context pointing to the Vue instance invoking it. Don't use `arrow functions` because their are bounded to the parent context then `this` will not be bounded to the Vue instance

#### Lifecycle

- [component-lifecycle](https://alligator.io/vuejs/component-lifecycle/)

- `beforeCreate` hook before injections and reacitivity
- `created` hook can be used to run code after an instance is created
- `beforeMount`
- `mounted`
- `beforeUpdate`
- `updated`
- `beforeDestroy`
- `destroyed`

### Applications components

- Fake data model can be found in `src/data.json` this will be changed later to use firebase
- Vue app starting point at `main.js`
  ```jsx
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  });
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
    data() {
      // bind data to component data and can be used in the template to render data
      // this can be watched in the vue extension of chrome/firefox
      return {
        threads: sourceData.threads,
        posts: sourceData.posts,
        users: sourceData.users
      };
    }
  };
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
  <style>@import "assets/css/style.css";</style>
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

### Components

#### Components, props and computed properties

It is a good design to split components into smaller ones and pass resources between them using props

- In this example 2 new components were created [`ThreadList` and `ThreadListItem`] in order to list the items and to display the item content
- The parent component `HelloWorld.vue` will use `ThreadList` component passing _threads_ as props and will import the child component

  ```jsx
  <template>
    <div class="col-full">
      <h1>Welcome to the forum</h1>
      <ThreadList :threads="threads" />
    </div>
  </template>

  <script>
  import sourceData from '../data.json'
  import ThreadList from './ThreadList'

  export default {
    name: 'HelloWorld',
    components: {
      ThreadList
    },
    data () {
      return {
        threads: Object.values(sourceData.threads), // return an array of values
        posts: sourceData.posts,
        users: sourceData.users
      }
    }
  }
  </script>
  ```

  - `:threads` is the props passed to the `ThreadList` child component

- The parent component `ThreadList.vue` will use `ThreadListItem` component passing props and using `v-for` directive to display threads passed by its parent component `HelloWorld`

  ```jsx
  <template>
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <ThreadListItem
        v-for="thread in threads"
        :thread="thread"
        :key="thread['.key']"
      />
    </div>
  </template>

  <script>
  import ThreadListItem from './ThreadListItem'

  export default {
    components: {
      ThreadListItem
    },

    props: {
      threads: {
        required: true,
        type: Array
      }
    }
  }
  </script>
  ```

  - `:thread` property passed to `ThreadListItem` child component
  - When generating multiple sub components is mandatory to have a `:key` property
  - `components: {}` object declare components loaded
  - `props: {}` declare properties passed from parent component

- Component `ThreadListItem.vue` will display data passed from parent component in the properties

```jsx
<template>
  <div class="thread">
    <div>
      <p>
        <a href="#">{{ thread.title }}</a>
      </p>
      <p class="text-faded text-xsmall">By
        <a href="#">{{ user.name }}</a>,{{ thread.publishedAt }}
      </p>
    </div>

    <div class="activity">
      <p class="replies-count">{{ repliesCount }} replies</p>

      <!-- <img src="http://" alt class="avatar-medium">

      <span>
        <a href="#" class="text-xsmall">John Dow</a>
        <p class="text-faded text-xsmall">1 month ago</p>
      </span> -->
    </div>
  </div>
</template>

<script>
import sourceData from '@/data'

export default {
  props: {
    thread: {
      required: true,
      type: Object
    }
  },
  computed: {
    repliesCount () {
      return Object.keys(this.thread.posts).length - 1
    },
    user () {
      return sourceData.users[this.thread.userId]
    }
  }
}
</script>
```

- `computed () {}` refers to computed properties that are component functions that performs transformations or calculations and they are evaluated every time it dependency changes
  - When to use `methods`, they are also functions and they performs actions like storing some data, so if a function has side effects should be a method
  - When to use `computed properties`, when you need to transform data like counting elements in a list, formating a string or filtering an array, also they are great for usability

#### Naming components

- Components that are used for presenting and not other things use the prefix `Page` like `PageHome` this helps to separate it from the others components with the eye
- Keep pages in their own root directory like `src/pages`
- When importing you can use `@/components/..` the _@_ refers to an alias to the `src` directory, you can find it in `build/webpack.base.conf.js` so it resolves the absolute path

#### Binding data and using component methods

```jsx
<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <PostList :posts="posts" />
    <form @submit.prevent="addPost">
      <div class="form-group">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
          v-model="newPostText"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
import sourceData from '@/data'
import PostList from '@/components/PostList'

export default {
  components: {
    PostList
  },
  data () {
    return {
      thread: sourceData.threads[this.id],
      newPostText: ''
    }
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(sourceData.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  },
  methods: {
    addPost () {
      const postId = 'greatPost' + Math.random()    // to be changed later
      const post = {
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2',
        '.key': postId
      }
      this.$set(sourceData.posts, postId, post)
      this.$set(this.thread.posts, postId, postId)
      this.$set(sourceData.users[post.userId].posts, postId, postId)
      this.newPostText = ''
    }
  }
}
</script>
```
- `<PostList :posts="posts" />` it will pass _*posts* array_ in the props _:posts_ to _PostList_ child component
- Two-way binding can be done using `v-model` in the view and will be bound to a data property in the component
  - Another way to create a two-way binding is using a binding from component to view with `:value="newPostText"` and then binding from view to component using `@input="newPostText = $event.target.value"` (_@input_ === _v-on:input_)
- `@submit.prevent`: will submit the form and prevent browser reload and will call component method `addPost` declared in the component `methods: { addPost () {} }`
  - `component methods` performs actions in the component
- It is necessary to make our data reactive in order to be reflected immediately in the browser, we can do this using `Vue.set(obj, propertyName, value)`
  - To not import _Vue_ in the component we can use the instance alias this.$set
  - In the code `sourceData` is our storage so using `this.$set(sourceData.posts, postId, post)` will add the new post into the posts array with a key of _postId_

#### Communicate between components

- A child component can communicate to a parent component emitting events with `this.$emit(nameOfEvent, params)`
- Parent component will listen the event using directive `@nameOfEvent`
- Child component
  ```jsx
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
        const postId = 'greatPost' + Math.random()    // to be changed later
        const post = {
          text: this.text,
          publishedAt: Math.floor(Date.now() / 1000),
          threadId: this.threadId,
          userId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2',
          '.key': postId
        }
        this.text = ''
        this.$emit('save', {post})
      }
    }
  }
  </script>
  ```

- Parent component
  ```jsx
  <template>
    <div class="col-large push-top">
      <PostEditor @save="addPost" :threadId="id" />
    </div>
  </template>

  <script>
  export default {
    components: {
      PostEditor
    },
    props: {
      id: {
        required: true,
        type: String
      }
    },
    methods: {
      // component method to handle logic
      addPost (eventData) {
        console.log(eventData)
        //  code that handle the event
      }
    }
  }
  </script>
  ```

#### Using filters

- You can use filters that can be used to apply text formating like dates
- Yo use a filter you must use a pipe _|_ appended at the end of the js expression
- filters are chained
- [Vue filter reference](https://vuejs.org/v2/guide/filters.html)
- Creating a filter to format dates with [moment.js](https://momentjs.com/)
  ```jsx
  <template>
    <div class="post">
      <div
        class="post-date text-faded"
        :title="post.publishedAt | humanFriendlyDate"
      >
      {{ post.publishedAt | diffForHumans }}
      </div>
    </div>
  </template>

  <script>
  import moment from 'moment'

  export default {
    // ... props and computed options
    filters: {
      humanFriendlyDate (date) {
        return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
      },
      diffForHumans (date) {
        return moment.unix(date).fromNow()
      }
    }
  }
  </script>
  ```
  - You can apply format or transformation using `computer properties` if you have just one property to transform
  - If you have more than one property then it is better to use `filters` or `component methods` because they can receive parameters

#### Base Components

When some parts of your code will be used in different places of your application you should extract it in a new component, in these cases it is a good practice to create them as [base components](https://vuejs.org/v2/style-guide/#Base-component-names-strongly-recommended) and when the list of base components is large a good thing to avoid including all of thems in differents components is to [register them globally](https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components)

- Example of `AppDate.vue` as a base component to separate the date formating filter
  ```jsx
  <template>
    <span :title="timestamp | humanFriendlyDate">{{ timestamp | diffForHumas }}</span>
  </template>

  <script>
  import moment from 'moment'

  export default {
    props: {
      timestamp: {
        required: true,
        type: Number
      }
    },
    filters: {
      humanFriendlyDate (date) {
        return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
      },
      diffForHumas (date) {
        return moment.unix(date).fromNow()
      }
    }

  }
  </script>
  ```
  - look that there is no style applyed
  - receives a _timestamp_ prop that will be formated using the filter
- Now it is possible to use the new base component as usual
  ```jsx
  <template>
    <div class="post">

      <div class="post-date text-faded">
        <AppDate :timestamp="post.publishedAt"/>
      </div>

    </div>
  </template>
  ```
  - To avoid importing the base component this can be register globally
- Register `AppDate.vue` base component in the global scope
  - `Vue.component(tagName, options)` will register a component in the global scope
  - This can be done in any component that is loaded in the first use but since `src/main.js` is loaded first than everything it is better do it there
    ```js
    import Vue from 'vue'
    import App from './App'
    import router from './router'
    import AppDate from '@/components/AppDate'

    Vue.component('AppDate', AppDate)

    Vue.config.productionTip = false

    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
    ```
  - Now you can use `<AppDate :timestamp=".." />` in any component without import it

#### Single-Instance components

 - It doesn't mean it is going to be used in a single page
 - It means it will be used once per page
 - They don't accept props
 - They should use the `The` prefix in their names (_TheNavbar_, _TheSidebar_, _TheFooter_, _TheHeading_)

#### Toggle between components

 - We can share page components to let the user toggle between two of them, one to edit data and the other to just view the data
 - This can be done using a router path to each component and difference between them by a boolean prop

 ```js
 // router
 export default new Router({
  routes: [
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: {edit: true}
    }
  ],
  mode: 'history'
})
 ```
 - In path `/me/edit` we are passing directly a prop object with value true that will help to toggle btw components
 - We are using the same component

  ```jsx
  // PageProfile.vew aka component: 'Profile'
  <template>
    <div class="flex-grid">

      <UserProfileCard
        v-if="!edit"
        :user="user"
        :userPostsCount="userPostsCount"
        :userThreadsCount="userThreadsCount" />

      <UserProfileCardEditor
        v-else
        :user="user"
        :userPostsCount="userPostsCount"
        :userThreadsCount="userThreadsCount" />

    </div>
  </template>
  <script>
  import UserProfileCard from '@/components/UserProfileCard'
  import UserProfileCardEditor from '@/components/UserProfileCardEditor'

  export default {

    components: {
      UserProfileCard,
      UserProfileCardEditor
    },

    props: {
      edit: {
        type: Boolean,
        default: false
      }
    }

  }
  </script>
  ```
  - Toggle between components based on the property pased

- To navigate to an specific component we can push the route like this `this.$router.push({name: 'Profile'})` see `UserProfileCardEditor.vue` file for reference

### Routing

Using the official _VueJS_ router plugin `vue-router` allows to create _SPA_ mapping components to routes

- Router is included by _vue cli_ when we generated the application and selected that option in the template
- _vue cli_ template create for `src/router/index.js`

  ```jsx
  import Vue from 'vue';
  import Router from 'vue-router';
  import HelloWorld from '@/components/HelloWorld';

  Vue.use(Router);

  export default new Router({
    routes: [
      {
        path: '/',
        name: 'Hello',
        component: HelloWorld
      }
    ],
    mode: 'history'
  });
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
  import Vue from 'vue';
  import Router from 'vue-router';
  import HelloWorld from '@/components/HelloWorld';
  import ThreadShow from '@/components/ThreadShow';

  Vue.use(Router);

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
  });
  ```
  - `path` declares a path to a specific thread using dynamic segment (_:[dynamic_segment]_)
  - `props: true` allows the router to pass params to components as properties this is because by default route expose dynamic segments in components with _*this.\$route.params.[dynamic_segment]*_ but this is not ideal because the component will be tightly coupled to the router
3. Now the new component can be accessed with the route `http://localhost:8080/threads/:id` -> `http://localhost:8080/threads/-KsjpzIeFTdcsBIPvUfP`.

#### Using router-link component

- Allows to prevent the browser from reloading the page in comparison of the use of the `<a>` tag
- Is available in `router-aware` components
- The router is already injected in the root Vue instance

```jsx
  <router-link :to="{ name: 'ThreadShow', params: {id: thread['.key']}}">{{ thread.title }}</router-link>
```
  - allows to create a link in the component passing a `to:` property that can be a string with the path or an object
  - `<router-link :to="`/thread/${thread['.key']}`">` path as a string
  - `<router-link :to="{ name: 'threadShow', params: {id: thread['.key']}}">` path as an object with name and params declared in the route at `src/router/index.js`. The benefit of using the named router instead of the path is that we can change route's path in `src/router/index.js` without having to update and refactor the app

#### Handling 404 pages

- create a presentation page `PageNotFound.vue` (using vetur plugin in vscode write _scaffold_ to have a vue template)
  ```jsx
  <template>
    <div class="col-full">
      <h1>Not Found</h1>
      <p>Ooops, we couldn't find what you are looking for. Why don't you
        <router-link :to="{ name: 'Home' }">go home instead?</router-link>
      </p>
    </div>
  </template>

  <script>
  export default {

  }
  </script>

  <style scoped>
  h1 {
    font-size: 100px;
  }
  p {
    font-size: 50px;
    font-weight: 100;
  }
  div {
    text-align: center;
  }
  </style>
  ```
  - the `<style scoped>` means that the style apply in the scope of the current component
- add a new route to handle routes not associated to components and import component created above
  ```jsx
  import NotFound from '@/pages/PageNotFound'

  Vue.use(Router)

  export default new Router({
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/threads/:id',
        name: 'threadShow',
        component: ThreadShow,
        props: true
      },
      {
        path: '*',
        name: 'NotFound',
        component: NotFound
      }
    ],
    mode: 'history'
  })
  ```

### CSS Modules

- Theme and Scoped CSS Styling is essential in a scalable Vue application
- Using CSS Modules with Webpack allows to have uniques class selectors styles
- Class selectors are faster than elements selectors because are more specific
- It is recommended to use class selectors specially in large apps
- Refactor of scoped css style in `PageNotFound.vue` to css modules
  ```jsx
  <template>
    <div class="col-full" :class="$style.centered">
      <h1 :class="$style.headingLarge">Not Found</h1>
      <p :class="$style.textLarge">Ooops, we couldn't find what you are looking for. Why don't you
        <router-link :to="{ name: 'Home' }">go home instead?</router-link>
      </p>
    </div>
  </template>

  <script>
  export default {

  }
  </script>

  <style module>
  .headingLarge {
    font-size: 100px;
  }
  .textLarge {
    font-size: 50px;
    font-weight: 100;
  }
  .centered {
    text-align: center;
  }
  </style>
  ```
  - style switched scoped to `module` in this way Vue will create the special `$style` property which is an object that contains the classes defined in the `style` tag
  - change styles to class selectors using camelCase to use dot operator when used in template or if the class names contains dashes you will need to use brackets `$style.textLarge` -> `$style[text-large]`
  - now in `template` it is possible to _bind_ a class to an element using the *_v-bind_* directive that is the same to write in short using the colon *_:_* so *_v-bind:class_* is the same as *_:class_*
- At the end Vue will create hashes for the classes names that are unique in the app, you can watch them in the Vue extension (chrome and firefox)
