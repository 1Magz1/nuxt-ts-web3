<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__header">
        <Header />
      </div>
      <div class="template__content">
        <nuxt />
      </div>
    </div>
    <base-modal-container />
    <loader-screen />
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MainVue from '~/mixins/MainVue'

import Header from '@/components/Header/index.vue'
@Component({
  components: {
    Header
  }
})
export default class Default extends Mixins(MainVue) {
  mounted (): void {
    this.SetLoader(true)
    setTimeout(() => {
      this.SetLoader(false)
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  overflow-y: auto;
  &__template {
    height: 100%;
    display: grid;
    grid-template-rows: 100px 1fr auto;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }
}
.template {
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
