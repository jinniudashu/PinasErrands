<template>
  <div v-for="(order, index) in orders" :key="index">
    <div class="mt-5 mx-2 px-4 py-3 bg-gray-200 rounded-2xl shadow-lg">
      <router-link :to="`/orderstatus/${order.id}`">
        <div v-for="(item, index) in order.items" :key="index">
          <div
            v-if="index === 0 && order.status === 'completed'"
            class="bg-yellow-400 p-1 rounded-md shadow-md h-6 text-xs fixed -mt-6"
          >
            <router-link to="/review">
              <p>Review</p>
            </router-link>
          </div>
          <div class="flex flex-row justify-between">
            <div
              class="flex flex-row justify-start items-center my-1 space-x-2"
            >
              <img
                class="w-5"
                :src="
                  index === 0
                    ? require('@/assets/pickup.png')
                    : require('@/assets/delivery.png')
                "
                alt=""
              />
              <p class="text-xs font-semibold whitespace-nowrap">
                {{ index === 0 ? 'Pick Up' : 'Delivery' }}
              </p>
              <p class="text-xs truncate">
                {{ item.location.address }}
              </p>
            </div>
          </div>
          <div
            v-if="index === 0"
            class="flex flex-row justify-start items-center space-x-4 px-2"
          >
            <svg-icon :name="'verticalconnection'" />
            <svg-icon :name="'line'" />
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
