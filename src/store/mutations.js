import Vue from 'vue'

export default {
  // Vue.set(object_to_add_new_prop, the_prop_name, the_value_of_the_prop)
  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource].items, id, item)
  }
}
