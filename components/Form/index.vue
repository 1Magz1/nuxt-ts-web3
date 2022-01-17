<template>
  <div class="form">
    <span>Token transfer</span>
    <span v-if="allowance">Allowance {{ allowance }}</span>
    <b-input-group append="Recipient Address" class="mt-3">
      <b-form-input v-model="recipientAddress" />
    </b-input-group>
    <b-input-group append="Amount" class="mt-1">
      <b-form-input v-model="tokenAmount" />
    </b-input-group>
    <button :disabled="isDisabledButton" class="btn btn-primary mt-2" @click="getAllowance">
      Allowance
    </button>
    <button :disabled="isDisabledButton" class="btn btn-primary mt-2" @click="getApprove">
      Approve
    </button>
    <button class="btn btn-primary mt-2" @click="tokenTransfer">
      Transfer
    </button>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component
export default class Form extends Vue {
  // Data
  private recipientAddress = ''

  private tokenAmount = ''

  private allowance = ''

  // Props
  @Prop(Object) readonly options: Record<string, string> | undefined

  // Getters
  get isDisabledButton (): any {
    return !(this.recipientAddress && this.tokenAmount)
  }

  // Methods
  private async getAllowance (): Promise<any> {
    const payload = {
      tokenAddress: this.options?.value,
      recipientAddress: this.recipientAddress
    }
    this.allowance = await this.$store.dispatch('web3/getAllowance', payload)
  }

  private async getApprove (): Promise<any> {
    const payload = {
      tokenAddress: this.options?.value,
      recipientAddress: this.recipientAddress
    }
    this.allowance = await this.$store.dispatch('web3/getApprove', payload)
  }

  private async tokenTransfer (): Promise<any> {
    const payload = {
      tokenAddress: this.options?.value,
      recipientAddress: this.recipientAddress,
      tokenAmount: this.tokenAmount
    }
    let res
    try {
      res = await this.$store.dispatch('web3/tokenTransfer', payload)
    } catch (err) {
      console.log('tokenTransfer', err)
    }

    if (res && res.status) {
      this.updateTokenBalance()
    }
  }

  // Emit
  @Emit()
  updateTokenBalance (): boolean {
    return true
  }
}
</script>

<style scoped lang="scss">
.form {
  margin-top: 50px;
}
</style>
