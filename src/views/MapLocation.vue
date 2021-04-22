<template>
  <navigation-bar />
  <section
    ref="mapDiv"
    class="absolute top-11 right-0 bottom-0 left-0"
  ></section>
  <div class="flex justify-center top-14 z-10 absolute w-full">
    <input
      class="bg-gray-50 w-5/6 h-10 px-2 text-xs rounded-lg shadow-lg"
      type="text"
      placeholder="Input address"
      v-model="address"
      ref="autocompleteRefs"
      @focus="$event.currentTarget.select()"
    />
  </div>
  <div class="flex justify-center bottom-10 z-10 absolute w-full">
    <button
      class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 w-5/6"
      @click="submitLocation"
    >
      CONFIRM
    </button>
  </div>
  <!-- 附近地址列表 -->
  <!-- <div class="bg-yellow-50 h-40 overflow-auto">
      <div
        class="px-2 py-2 w-full h-8 text-gray-700"
        v-for="address in addresses"
        :key="address.place_id"
        @click.prevent="location = address.formatted_address"
      >
        <p class="truncate ...">
          {{ address.formatted_address }}
        </p>
        <hr />
      </div>
    </div> -->
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const mapDiv = ref(null)
    const autocompleteRefs = ref(null)
    const state = reactive({
      addresses: [],
      location: '',
      address: '',
    })

    onMounted(async () => {
      // 获取系统默认初始位置
      const initLocation = JSON.parse(process.env.VUE_APP_INITLOCATION)
      // 1、获得本机位置，失败则用系统默认初始位置initLocation
      try {
        const location =
          store.state.orders.tmpSubmitedLocation || (await myLocation())
        initLocation.lat = location.lat
        initLocation.lng = location.lng
      } catch (err) {
        console.log(err.message)
      }

      // 2、创建map对象/geocoder对象/获得初始地址列表
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(mapDiv.value, {
        // eslint-disable-next-line no-undef
        center: new google.maps.LatLng(initLocation.lat, initLocation.lng),
        zoom: 16,
        // eslint-disable-next-line no-undef
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      })

      // eslint-disable-next-line no-undef
      const geocoder = new google.maps.Geocoder()
      getAddresses(initLocation)

      // 3、在中心位置放置Marker
      const icon = require('@/assets/pin.png')
      // eslint-disable-next-line no-undef
      const marker = new google.maps.Marker({
        position: map.getCenter(),
        map,
        icon: icon,
        title: 'Target',
        draggable: true,
      })

      // 4、为map设置中心改变监听、拖动完成监听，重置marker位置
      map.addListener('center_changed', () => {
        marker.setPosition(map.getCenter())
      })
      map.addListener('dragend', () => {
        let location = map.getCenter()
        marker.setPosition(location)
        getAddresses(location)
        map.setZoom(18)
      })
      marker.addListener('dragend', () => {
        let location = marker.getPosition()
        map.setCenter(location)
        getAddresses(location)
        map.setZoom(18)
      })

      // google map自动完成服务设置
      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteRefs.value,
        {
          // eslint-disable-next-line no-undef
          bounds: new google.maps.LatLngBounds(
            // eslint-disable-next-line no-undef
            new google.maps.LatLng(initLocation.lat, initLocation.lng),
          ),
        },
      )
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace()
        if (place) {
          state.address = place.formatted_address
          state.location = place
          map.setCenter(place.geometry.location)
          marker.setPosition(place.geometry.location)
        }
      })

      // 获取当前位置地址列表
      function getAddresses(location) {
        geocoder.geocode({ location: location }, (results, status) => {
          if (status === 'OK') {
            if (results) {
              state.addresses = []
              state.addresses = results
              state.location = results[0]
              state.address = results[0].formatted_address
            } else {
              window.alert('No results found')
            }
          } else {
            window.alert('Geocoder failed due to: ' + status)
          }
        })
      }
    })

    // 获取本机坐标，如果失败，使用系统默认的初始坐标 ==> 这是一个Promise
    function myLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              })
            },
            (error) => {
              reject(error)
            },
          )
        } else {
          reject(
            new Error(
              'Your browser does not support geolocation API, use system initLocation.',
            ),
          )
        }
      })
    }

    function submitLocation() {
      let location = {
        address: state.location.formatted_address,
        lat: state.location.geometry.location.lat(),
        lng: state.location.geometry.location.lng(),
      }
      store.commit('orders/setTmpSubmitedLocation', location)
      console.log('submit:', store.state.orders.tmpSubmitedLocation)
      router.go(-1)
    }

    return {
      mapDiv,
      ...toRefs(state),
      autocompleteRefs,
      submitLocation,
    }
  },
}
</script>
