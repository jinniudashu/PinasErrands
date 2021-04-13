<template>
  <div
    class="flex flex-row justify-between space-x-1 bg-gray-800 text-gray-200 rounded-lg shadow-lg mx-4 mt-6 px-2 py-1 w-auto"
  >
    <svg-icon :name="'pin'" />
    <input
      ref="location"
      type="text"
      v-model="location.address"
      class="h-auto w-full rounded-sm"
    />
    <svg-icon :name="'goto'" />
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect, onMounted } from 'vue'
export default {
  name: 'InputLocation',
  props: {
    item: Object,
  },
  setup(props) {
    const state = reactive({
      location: {
        address: '',
        lat: null,
        lng: null,
      },
    })
    // const location = ref(null)

    onMounted(() => {
      const initLocation = JSON.parse(process.env.VUE_APP_INITLOCATION)
      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(state.location, {
        // eslint-disable-next-line no-undef
        bounds: new google.maps.LatLngBounds(
          // eslint-disable-next-line no-undef
          new google.maps.LatLng(initLocation.lat, initLocation.lng),
        ),
      })
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        state.location.address = `${place.name}, ${place.vicinity}`
        state.location.lat = place.geometry.location.lat()
        state.location.lng = place.geometry.location.lng()
      })
    })

    watchEffect(() => {
      if (props.item) {
        state.location.address = props.item.address
        state.location.lat = props.item.lat
        state.location.lng = props.item.lng
      }
    })

    // TODO: 新窗口选择地点
    function chooseLocation() {}

    return { ...toRefs(state), chooseLocation }
  },
}
</script>
