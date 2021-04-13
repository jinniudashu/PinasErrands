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
      <router-link :to="`/itemedit/${index}`">
        <div class="border-gray-800 border-t-2">
          <div
            class="flex flex-row justify-start items-center my-1 pl-1 space-x-1 "
          >
            <svg-icon :name="index === 0 ? 'pickup' : 'delivery'" />
            <p class="text-sm font-semibold">
              {{ index === 0 ? 'Pick Up Details' : 'Delivery Details' }}
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
      </router-link>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  props: { items: Object },
}
</script>

<style></style>
