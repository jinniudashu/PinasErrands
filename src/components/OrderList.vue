<template>
  <div v-for="(order, index) in orders" :key="index">
    <div class="mt-5 mx-2 px-4 py-3 bg-gray-200 rounded-2xl shadow-lg">
      <router-link :to="`/orderstatus/${order.id}`">
        <div v-for="(item, index) in order.items" :key="index">
          <div
            v-if="index === 0 && order.status === 'completed'"
            class="bg-yellow-400 p-1 rounded-md shadow-md h-6 text-xs fixed -mt-6"
          >
            <p>Review</p>
          </div>
          <div
            v-if="index === order.items.length - 1"
            class="flex flex-row justify-start items-center space-x-4 px-2"
          >
            <svg-icon :name="'verticalconnection'" />
            <svg-icon :name="'line'" />
          </div>
          <div class="flex flex-row justify-between">
            <div
              class="flex flex-row justify-start items-center my-1 space-x-2"
            >
              <img
                class="w-5"
                :src="
                  index === order.items.length - 1
                    ? require('@/assets/delivery.png')
                    : require('@/assets/pickup.png')
                "
                alt=""
              />
              <p class="text-xs font-semibold whitespace-nowrap">
                {{ index === order.items.length - 1 ? 'Delivery' : 'Pick Up' }}
              </p>
              <p class="text-xs truncate">
                {{ item.location.address }}
              </p>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: { orders: Array },
}
</script>

<style></style>
