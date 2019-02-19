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

