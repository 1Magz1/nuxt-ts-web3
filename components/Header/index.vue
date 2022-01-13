<template>
  <div class="header">
    <button class="btn btn-primary" @click="connectWallet">
      connect wallet
    </button>
  </div>
</template>

<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Header extends Vue {
  public connectWallet (): void {
    this.$store.dispatch('web3/connectWallet')
  }
}
</script>

<style scoped lang="scss">
.header {

}
</style>
