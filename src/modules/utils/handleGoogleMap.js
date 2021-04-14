import { onMounted, onUnmounted, ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

export const loader = new Loader({
  apiKey: process.env.VUE_APP_GOOGLEAPIKEY,
  libraries: ['places'],
})

// 计算两点之间的距离
// 使用了DistanceMatrixService Promise beta版本，在index.html中声明：‘v=beta’
export const getDistance = async (start, end) => {
  await loader.load()
  // eslint-disable-next-line no-undef
  const origin = new google.maps.LatLng(start.lat, start.lng)
  // eslint-disable-next-line no-undef
  const final = new google.maps.LatLng(end.lat, end.lng)
  // eslint-disable-next-line no-undef
  const service = new google.maps.DistanceMatrixService()
  console.log('hi getDistanceMatrix')
  const result = await service.getDistanceMatrix({
    origins: [origin],
    destinations: [final],
    travelMode: 'DRIVING',
  })
  console.log('distance result:', result)
  let distance = result?.rows[0].elements[0].distance?.value
  return distance
}

// 获取本机坐标，如果失败，使用系统默认的初始坐标 ==> 这是一个Promise
export function myLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords)
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

// 获取本机坐标
export const useGeolocation = () => {
  const coords = ref({ latitude: 0, longitude: 0 })
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  let watcher = null
  onMounted(() => {
    if (isSupported)
      watcher = navigator.geolocation.watchPosition(
        (position) => (coords.value = position.coords),
      )
  })
  onUnmounted(() => {
    if (watcher) navigator.geolocation.clearWatch(watcher)
  })
  return { coords, isSupported }
}

// 画出路径
export const renderRoutes = async (map, locations) => {
  // eslint-disable-next-line no-undef
  const directionsService = new google.maps.DirectionsService()
  directionsService.route(
    {
      origin: locations[0].origin.address,
      destination: locations[0].destination.address,
      travelMode: 'DRIVING',
    },
    (response, status) => {
      if (status === 'OK') {
        // eslint-disable-next-line no-undef
        new google.maps.DirectionsRenderer({
          suppressMarkers: false, //Keep Marker
          directions: response,
          map: map,
          polylineOptions: {
            // strokeColor: this.$store.state.renderRoutes.color,
            strokeWeight: 8,
          },
        })
      }
    },
  )
}
