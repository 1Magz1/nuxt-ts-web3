<template>
  <div v-if="transactionList.length" class="transaction-list">
    <span class="mb-3">Transaction List</span>
    <div class="transaction-list__wrap">
      <a v-for="item in transactionList" :key="item.transactionHash" :href="`https://rinkeby.etherscan.io/tx/${item.transactionHash}`" target="_blank">{{ item.transactionHash }} {{ item.event }}</a>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TransactionList extends Vue {
  // Getters
  get transactionList (): [] {
    return this.$store.getters['web3/getTransactionList']
  }
}
</script>

<style scoped lang="scss">
.transaction-list {
  margin-top: 50px;
  &__wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
