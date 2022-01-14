<template>
  <div class="form">
    <span>Token transfer</span>
    <b-input-group append="Recipient Address" class="mt-3">
      <b-form-input v-model="recipientAddress" />
    </b-input-group>
    <b-input-group append="Amount" class="mt-1">
      <b-form-input v-model="tokenAmount" />
    </b-input-group>
    <button :disabled="isDisabledButton" class="btn btn-primary mt-2" @click="tokenTransfer">
      Transfer
    </button>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  computed: {
    isDisabledButton (): any {
      return !(this.recipientAddress && this.tokenAmount)
    }
  }
})
export default class Form extends Vue {
  private recipientAddress = ''

  private tokenAmount = ''

  private tokenTransfer (): any {
    const payload = {
      tokenAddress: this.options.value,
      recipientAddress: this.recipientAddress,
      tokenAmount: this.tokenAmount

    }
    this.$store.dispatch('web3/tokenTransfer', payload)
  }

  @Prop(Object) readonly options: Record<string, string> | undefined
}
</script>

<style scoped lang="scss">
.form {
  margin-top: 50px;
}
</style>
