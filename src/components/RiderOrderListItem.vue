<template>
  <div class="bg-gray-50 mt-3 p-2 w-full rounded-xl shadow-lg text-sm">
    <p class="font-semibold">{{ order?.items[0]?.contactName }}</p>
    <p>Contact Number: {{ order?.items[0]?.contactPhone }}</p>
    <p class="truncate font-semibold">
      Errnd Request: {{ order?.items[0]?.request }}
    </p>
    <div v-for="(item, index) in order?.items" :key="index">
      <p class="truncate">
        {{ index === order?.items.length - 1 ? 'Delivery' : 'Pick Up' }}:
        {{ item.location.address }}
      </p>
    </div>
    <p>Delivery Fee: P{{ order?.bills.totalAmount }}</p>
  </div>
</template>

<script>
export default {
  props: { order: Object },
}
</script>

<style></style>
