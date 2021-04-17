import { onMounted, onUnmounted, ref } from 'vue'

// 计算两点之间的距离
// 使用了DistanceMatrixService Promise beta版本，在index.html中声明：‘v=beta’
export const getDistance = async (start, end) => {
  // eslint-disable-next-line no-undef
  const origin = new google.maps.LatLng(start.lat, start.lng)
  // eslint-disable-next-line no-undef
  const final = new google.maps.LatLng(end.lat, end.lng)
  // eslint-disable-next-line no-undef
  const service = new google.maps.DistanceMatrixService()
  // const result =
  const result = await service.getDistanceMatrix({
    origins: [origin],
    destinations: [final],
    travelMode: 'DRIVING',
  })
  let distance = result?.rows[0].elements[0].distance?.value
  let duration = result?.rows[0].elements[0].duration?.text
  console.log('distance:', distance)
  console.log('duration:', duration)
  return { distance: distance, duration: duration }
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
      watcher = navigator.geolocation.watchPosition((position) => {
        coords.value = position.coords
        console.log('useGeolocation:', coords.value)
      })
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
  locations.forEach((location) =>
    directionsService.route(
      {
        origin: location.origin,
        destination: location.destination,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          // eslint-disable-next-line no-undef
          new google.maps.DirectionsRenderer({
            suppressMarkers: true, //hide Marker
            directions: response,
            map: map,
            polylineOptions: {
              strokeColor: '#19eb70',
              strokeWeight: 8,
            },
          })
        } else {
          console.log('status:', status, locations)
        }
      },
    ),
  )
}
