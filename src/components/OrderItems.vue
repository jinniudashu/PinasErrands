<template>
  <div class="bg-gray-50 rounded-xl shadow-lg">
    <!-- Title -->
    <div class="flex flex-row justify-start items-center pl-2">
      <div class="relative -top-4">
        <svg-icon :name="'biglocationlogo'" />
      </div>
      <p class="text-gray-800 text-base font-semibold">Errand</p>
      &nbsp;
      <p class="text-yellow-400 text-base font-semibold">Details</p>
    </div>

    <!-- Items -->
    <div v-for="(item, index) in items" :key="index">
      <div class="border-gray-800 border-t-2" @click="editItem(index)">
        <div
          class="flex flex-row justify-start items-center my-1 pl-1 space-x-1 "
        >
          <img
            class="w-5"
            :src="
              index === items.length - 1
                ? require('@/assets/delivery.png')
                : require('@/assets/pickup.png')
            "
            alt=""
          />

          <p class="text-sm font-semibold">
            {{
              index === items.length - 1
                ? 'Delivery Details'
                : 'Pick Up Details'
            }}
          </p>
        </div>
        <div
          class="flex flex-row justify-start items-center my-1 pl-7 space-x-2"
        >
          <svg-icon :name="'contact'" />
          <div>
            <p class="text-base text-gray-700 font-semibold">
              {{ item.contactName }}
            </p>
            <p class="text-sm  text-gray-400 font-semibold">
              {{ item.contactPhone }}
            </p>
          </div>
        </div>
        <div
          class="flex flex-row justify-start items-center py-2 pl-7 mb-2 space-x-2 border-gray-200 border-t-4"
        >
          <svg-icon :name="'destination'" />
          <div class="text-sm  text-gray-400 font-semibold">
            {{ item.location.address }}
          </div>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  props: { items: Object },
  setup() {
    const store = useStore()
    const router = useRouter()

    function editItem(index) {
      store.commit(
        'orders/setCurrentItem',
        store.state.orders.currentOrder.items[index],
      )
      router.push({
        path: '/itemedit',
        query: {
          id: index,
        },
      })
    }

    return { editItem }
  },
}
</script>

<style></style>
