<template>
  <div class="home">
    <b-form-select v-model="selected" :options="options" />
    <div v-if="selectedTokenInfo.symbol" class="balance">
      <span>{{ selectedTokenInfo.text }} balance is {{ selectedTokenBalance }}</span>
    </div>
    <Form />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Form from '~/components/Form/index.vue'

@Component({
  components: {
    Form
  },
  computed: {
    ...mapGetters('web3', {
      isConnected: 'getIsConnected'
    })
  }
})
export default class Index extends Vue {
  private selected = '0x4b107a23361770534bd1839171bbf4b0eb56485c'

  private options: Array<any> = [
    {
      value: '0x4b107a23361770534bd1839171bbf4b0eb56485c',
      text: 'CFi'
    },
    {
      value: '0xc13da4146d381c7032ca1ed6050024b4e324f4ef',
      text: 'VEE'
    },
    {
      value: '0x8d0c36c8842d1dc9e49fbd31b81623c1902b7819',
      text: 'USDT'
    },
    {
      value: '0xa364f66f40b8117bbdb772c13ca6a3d36fe95b13',
      text: 'DLD'
    }
  ]

  private selectedTokenInfo = {}

  private selectedTokenBalance =''

  private async getTokenInfo (options: Array<any>, selectedToken: string): Promise<any> {
    this.selectedTokenInfo = options.filter(address => address.value === selectedToken)[0]
    this.selectedTokenBalance = await this.$store.dispatch('web3/getTokenBalance', this.selectedTokenInfo)
  }

  @Watch('isConnected')
  async isConnectedChanged (newVal: boolean): Promise<any> {
    if (!newVal) { return }

    const address = this.options.map(item => item.value)

    const options = await Promise.all(address.map(async tokenAddress => await this.$store.dispatch('web3/getTokenData', tokenAddress)))
    this.options = options.map((item, index) => {
      item.value = address[index]
      item.text = item.symbol
      return item
    })
    await this.getTokenInfo(this.options, this.selected)
  }

  @Watch('selected')
  async selectedChanged (selected: string): Promise<any> {
    if (!this.isConnected) { return }
    await this.getTokenInfo(this.options, selected)
  }
}

</script>
<style lang="scss" scoped>
.home {
  @include container;
}
</style>
