<template>
  <div class="header">
    <span v-if="isConnected">Network {{ networkName }}</span>
    <button class="btn btn-primary" @click="connectWallet">
      <span v-if="isConnected">{{ SubstrString(userAddress, 0, 7) + '...' + SubstrString(userAddress, userAddress.length - 4, 4) }}</span>
      <span v-else>Connect Wallet</span>
    </button>
  </div>
</template>

<script  lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import MainVue from '~/mixins/MainVue'

@Component({
  computed: {
    ...mapGetters('web3', {
      userAddress: 'getUserAddress',
      isConnected: 'getIsConnected',
      networkName: 'getNetworkName'
    })
  }
})
export default class Header extends Mixins(MainVue) {
  public connectWallet (): void {
    this.$store.dispatch('web3/connectWallet')
  }
}
</script>

<style scoped lang="scss">
.header {

}
</style>
