<template>
  <div class="bg-yellow-200 min-h-screen p-4">
    <!-- Menu -->
    <menu-button />

    <div class="mx-6 mt-6">
      <div
        class="bg-gray-50 py-3 pl-2 rounded-xl shadow-lg flex flex-row justify-start space-x-2"
      >
        <p class="font-semibold">DELIVER FEE: P {{ deliveryFee }}</p>
      </div>
    </div>
    <div class="mx-6 mt-6">
      <div
        class="bg-gray-50 py-3 pl-2 rounded-xl shadow-lg flex flex-row justify-start space-x-2"
      >
        <p class="font-semibold">PRODUCT TOTAL: P</p>
        <input
          type="number"
          v-model="productPrice"
          class="w-20 border-gray-800 border-b-2"
        />
      </div>
    </div>

    <!-- Attachment -->
    <div class="mx-6 mt-3">
      <attachment
        :attachment="attachment"
        :userMode="'riderInput'"
        @uploadImg="(url) => attachment.push(url)"
        @delImg="(index) => attachment.splice(index, 1)"
      />
    </div>

    <div class="mx-6 mt-6">
      <div
        class="bg-gray-50 py-3 pl-2 rounded-xl shadow-lg flex flex-row justify-start space-x-2"
      >
        <p class="font-semibold">GRAND TOTAL: P {{ grandTotal }}</p>
      </div>
      <button
        class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold mt-6 px-2 py-2 w-full"
        @click="onClickConfirm"
      >
        CONFIRM
      </button>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { updateOrderStatus } from '@/modules/utils/handleData'
import Attachment from '../components/Attachment.vue'
import MenuButton from '../components/MenuButton'

export default {
  components: { Attachment, MenuButton },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      productPrice: 0,
      attachment: [],
    })
    const deliveryFee = computed(
      () => store.state.orders.currentOrder.bills.totalAmount,
    )
    const grandTotal = computed(
      () => parseInt(deliveryFee.value) + parseInt(state.productPrice),
    )

    async function onClickConfirm() {
      let orderId = store.state.orders.currentOrder.id
      let payload = {
        status: 'confirmed',
        productPrice: state.productPrice,
        riderAttachments: state.attachment,
      }
      await updateOrderStatus(orderId, payload)
      router.push('/riderordercomplete')
    }

    return {
      ...toRefs(state),
      deliveryFee,
      grandTotal,
      onClickConfirm,
    }
  },
}
</script>

<style></style>
