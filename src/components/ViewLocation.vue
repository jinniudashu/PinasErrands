<template>
  <section ref="mapview" class="absolute inset-0"></section>
</template>

<script>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { initGetRiderLocation } from '@/modules/utils/handleData'
import { loader, renderRoutes } from '@/modules/utils/handleGoogleMap'

export default {
  props: { targets: Array },
  setup(props) {
    const store = useStore()
    const mapview = ref(null)
    const riderId = store.state.orders.currentOrder.riderId
    var handle, riderMarker

    onMounted(async () => {
      if (!handle) handle = initGetRiderLocation(riderId)
      await loader.load()
      // 1、创建map对象,以items[0]的坐标为初始坐标
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(mapview.value, {
        // eslint-disable-next-line no-undef
        center: new google.maps.LatLng(
          props?.targets[0].lat,
          props?.targets[0].lng,
        ),
        zoom: 13,
        // eslint-disable-next-line no-undef
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      })

      // 2、在items[n]位置放置Marker
      props.targets.forEach((item) => {
        putMarker(map, item, 'customer')
      })
      // 画出路径
      console.log('porps:', props.targets)
      let locations = []
      for (let i = 0; i < props.targets.length - 1; i++) {
        let location = {
          origin: { lat: props.targets[i].lat, lng: props.targets[i].lng },
          destination: {
            lat: props.targets[i + 1].lat,
            lng: props.targets[i + 1].lng,
          },
        }
        locations.push(location)
      }
      renderRoutes(map, locations)

      // 3、监听并刷新Rider位置和路径
      watchEffect(() => {
        if (store.state.rider.riderLocation?.location) {
          let location = store.state.rider.riderLocation.location
          // 画当前位置
          if (riderMarker) riderMarker.setMap(null)
          riderMarker = putMarker(map, location)
        } else {
          console.log('riderMarker', store.state.rider.riderLocation?.location)
        }
      })
    })

    onUnmounted(() => {
      if (handle) handle()
    })

    function putMarker(map, location, iconType) {
      let icon = null
      if (iconType === 'customer') icon = require('@/assets/pin.png')
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
