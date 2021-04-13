// 计算两点之间的距离
// 使用了DistanceMatrixService Promise beta版本，在index.html中声明：‘v=beta’
export const getDistance = async (start, end) => {
  // eslint-disable-next-line no-undef
  const origin = new google.maps.LatLng(start.lat, start.lng)
  // eslint-disable-next-line no-undef
  const final = new google.maps.LatLng(end.lat, end.lng)
  // eslint-disable-next-line no-undef
  const service = new google.maps.DistanceMatrixService()
  const result = await service.getDistanceMatrix({
    origins: [origin],
    destinations: [final],
    travelMode: 'DRIVING',
  })
  let distance = result.rows[0].elements[0].distance?.value
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
