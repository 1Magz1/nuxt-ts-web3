<template>
  <div class="header">
    <button class="btn btn-primary" @click="connectWallet">
      <span v-if="isConnected">{{ userAddress }}</span>
      <span v-else>Connect Wallet</span>
    </button>
  </div>
</template>

<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters('web3', {
      userAddress: 'getUserAddress',
      isConnected: 'getIsConnected'
    })
  }
})
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
