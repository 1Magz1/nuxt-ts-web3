<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="base-modal"
      @mousedown.self="backgroundClick"
    >
      <component :is="currentModalKey" />
    </div>
  </transition>
</template>
<script lang="ts">
import { mapGetters } from 'vuex'
import MainVue from '~/mixins/MainVue'

import modals from '~/store/modals/modals'

import BaseModalStatus from '~/components/Modals/BaseModalStatus/index.vue'
import BaseModalDefault from '~/components/Modals/BaseModalDefault/index.vue'

export default MainVue.extend({
  name: 'BaseModalContainer',
  components: {
    'base-modal-status': BaseModalStatus,
    'base-modal-default': BaseModalDefault
  },
  data: () => ({
    modals
  }),
  computed: {
    ...mapGetters({
      isShow: 'modals/getIsShow',
      currentModalKey: 'modals/getCurrentModalKey',
      options: 'modals/getOptions'
    })
  },
  methods: {
    backgroundClick () {
      if (!this.options.isUnclosable) {
        this.close()
      }
    },
    close () {
      this.$store.dispatch('modals/hide')
    }
  }
})
</script>
<style lang="scss" scoped>
.base-modal {
  @include modalKit;
}
</style>
