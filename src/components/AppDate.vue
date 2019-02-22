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

<style>

</style>
