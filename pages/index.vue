<template>
  <div v-if="isConnected" class="example">
    <b-form-select v-model="selected" :options="options" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters('web3', {
      isConnected: 'getIsConnected'
    })
  }
})
export default class Index extends Vue {
  private selected = 'a'

  private options: Array<any> = [
    {
      value: '0x4b107a23361770534bd1839171bbf4b0eb56485c',
      text: 'first'
    },
    {
      value: '0xc13da4146d381c7032ca1ed6050024b4e324f4ef',
      text: 'second'
    },
    {
      value: '0x8d0c36c8842d1dc9e49fbd31b81623c1902b7819',
      text: 'third'
    },
    {
      value: '0xa364f66f40b8117bbdb772c13ca6a3d36fe95b13',
      text: 'four'
    }
  ]

  @Watch('isConnected')
  async isConnectedChanged (newVal: boolean): Promise<any> {
    if (newVal === false) { return }

    const address = this.options.map(item => item.value)

    const options = await Promise.all(address.map(async tokenAddress => await this.$store.dispatch('web3/getTokenData', tokenAddress)))
    this.options = options.map((item, index) => {
      item.value = address[index]
      item.text = item.name
      return item
    })
  }
}

</script>
<style lang="scss" scoped>
.example {
  @include container;
}
</style>
