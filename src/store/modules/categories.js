import firebase from 'firebase'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    fetchAllCategories ({state, commit}) {
      console.log('🔥', '🏷', 'all')
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            commit('setItem', {resource: 'categories', id: categoryId, item: category}, {root: true})
          })
          resolve(Object.values(state.items))
        })
      })
    },

    // fetchItem and fetchItems are global actions so we dont put any prefix and set root: true
    fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: '🏷'}, {root: true}),
    fetchCategories: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'categories', ids, emoji: '🏷'}, {root: true})
  }
}
