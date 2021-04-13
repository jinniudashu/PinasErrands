<template>
  <section ref="mapview" class="absolute inset-0"></section>
</template>

<script>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { initGetRiderLocation } from '@/modules/utils/handleData'

export default {
  props: { targets: Array },
  setup(props) {
    const store = useStore()
    const mapview = ref(null)
    const riderId = store.state.orders.currentOrder.riderId
    var handle, riderMarker
    onMounted(async () => {
      if (!handle) {
        handle = initGetRiderLocation(riderId)
      }
      console.log('currentOrder:', store.state.orders.currentOrder)
      // 1、创建map对象,以items[0]的坐标为初始坐标
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(mapview.value, {
        // eslint-disable-next-line no-undef
        center: new google.maps.LatLng(
          props?.targets[0].lat,
          props?.targets[0].lng,
        ),
        zoom: 14,
        // eslint-disable-next-line no-undef
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      })

      // 2、在items[n]位置放置Marker
      props.targets.forEach((item) => putMarker(map, item, 'customer'))

      // 3、监听并刷新Rider位置
      watchEffect(() => {
        if (store.state.rider.riderLocation?.location) {
          let location = store.state.rider.riderLocation.location
          console.log('riderLocation watchEffect', location)
          // 画当前位置和路径
          if (riderMarker) {
            riderMarker.setMap(null)
          }
          riderMarker = putMarker(map, location)
        }
      })
    })

    onUnmounted(() => {
      if (handle) {
        handle()
        console.log('initGetRiderLocation OFF')
      }
    })

    function putMarker(map, location, iconType) {
      let icon = null
      if (iconType === 'customer') {
        icon = require('@/assets/pin.png')
      }
      console.log('putMarker:', location)
      // eslint-disable-next-line no-undef
      let position = new google.maps.LatLng(location?.lat, location?.lng)
      // eslint-disable-next-line no-undef
      return new google.maps.Marker({
        position: position,
        map: map,
        title: location?.address,
        icon: icon,
      })
    }

    return { mapview }
  },
}
</script>
