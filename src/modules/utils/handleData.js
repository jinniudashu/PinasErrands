/* API 目录
本Data服务包括了数据库服务和全局Store访问服务

2. initMyOrders：用uid获取订单集快照后更新Store

3.0 setRiderWordStatus: 设置Rider工作状态

3.1 initRiderOrder：用orderId获取订单快照后更新Store

4. initOrderNotifies：获取订单通知快照，更新Store

5. getUserRoleById：用uid获取用户身份role

6. createNewOrder：创建订单：新增一条订单记录 & 新增一条订单通知

7. riderGetOrder：骑手获取一个订单

8. updateOrderStatus：仅更新订单状态

9. completeOrder：骑手完成订单

10. reviewOrder：用户评价订单

11. updateOrder：更新一条订单记录

12. getOrderById：获取一条订单信息

13. getRider：获取骑手状态

14. filterOrderByOrderId：用DocId从Store中过滤一条订单记录

15. updateRiderStatus: 设置骑手工作状态

*/
import { auth, db, serverTimestamp } from '@/firebase'
import { myLocation } from './handleGoogleMap'
import store from '@/store'

// 用DocId从Store中过滤一条订单记录
export const filterOrderByOrderId = (id) => {
  const orders = store.state.orders.orders.filter((item) => item.id === id)
  return orders[0]
}

// 创建订单：新增一条订单记录 & 新增一条订单通知
export const createNewOrder = async (order) => {
  const user = store.state.user?.user
  //构造订单客户信息
  order.userId = user.uid
  order.userName = user.displayName
  order.userPhone = user.phoneNumber
  order.productPrice = 0
  // 构造订单状态记录
  order.status = 'apply'
  order.statusLog = []
  order.timestamp = serverTimestamp

  console.log('createNewOrder:', order)
  // 开始批处理
  var batch = db.batch()
  // Add a new order with a generated id.
  var newOrderRef = db.collection('orders').doc()
  batch.set(newOrderRef, order)
  // 构造订单时间戳
  // batch.update(newOrderRef, {
  //   timestamp: serverTimestamp,
  // })

  // 增加一条新订单通知
  var orderNotifiesRef = db.collection('orderNotifies').doc()
  batch.set(orderNotifiesRef, { orderId: newOrderRef.id })
  // Commit the batch
  await batch
    .commit()
    .then(() => {
      console.log('BATCH: newOrderRef:', newOrderRef.id)
      console.log('BATCH: orderNotifiesRef:', orderNotifiesRef.id)
    })
    .catch((error) => console.log('err', error))
}

// 骑手获取一个订单
export const riderGetOrder = async (orderId, notifyId) => {
  const user = store?.state?.user?.user
  var orderRef = db.collection('orders').doc(orderId)
  return await db
    .runTransaction((transaction) => {
      // 更新订单状态为'assigned' & 添加骑手信息
      return transaction.get(orderRef).then((doc) => {
        if (doc.data().status === 'apply') {
          transaction.update(orderRef, { status: 'assigned' })
          transaction.update(orderRef, { riderId: user.uid })
          transaction.update(orderRef, { riderName: user.displayName })
          transaction.update(orderRef, { riderPhoneNumber: user.phoneNumber })
        } else {
          throw false
        }
      })
    })
    .then(async () => {
      let batch = db.batch()
      //删除新订单通知记录
      var orderNotifiesRef = db.collection('orderNotifies').doc(notifyId)
      batch.delete(orderNotifiesRef)
      //更新骑手状态'busy'
      var ridersRef = db.collection('riders').doc(user.uid)
      batch.update(ridersRef, { status: 'busy', currentOrderId: orderId })
      return await batch.commit()
    })
    .then(() => {
      console.log('Ok: Delete orderNotifies & Update riders.status to busy')
      return true
    })
    .catch((error) => {
      console.log('Transaction failed: ', error)
      return false
    })
}

// 仅更新订单状态
export const updateOrderStatus = (orderId, payload) => {
  var orderRef = db.collection('orders').doc(orderId)
  return orderRef
    .update(payload)
    .then(() => {
      console.log('Status successfully update!')
      return true
    })
    .catch((error) => {
      console.log(error.message)
      return false
    })
}

// 骑手完成订单
export const completeOrder = async (orderId) => {
  const user = store?.state?.user?.user
  let batch = db.batch()
  // 置骑手状态为:'idle'
  let ridersRef = db.collection('riders').doc(user.uid)
  batch.update(ridersRef, {
    status: 'idle',
    currentOrderId: null,
  })

  // 置订单状态为:'completed'
  let orderRef = db.collection('orders').doc(orderId)
  let order = store.state.orders.currentOrder
  order.status = 'completed'
  batch.set(orderRef, order)

  return await batch.commit().then(() => {
    console.log('completeOrder: Status successfully update!')
    // 更新rider's rides
    updateRiderRides(user.uid)
    return true
  })
}

// 更新rider.rides
export const updateRiderRides = async (uid) => {
  const riderRef = db.collection('riders').doc(uid)
  try {
    const res = await db.runTransaction(async (t) => {
      const doc = await t.get(riderRef)
      const newRides = doc.data().rides + 1
      await t.update(riderRef, { rides: newRides })
      return `Update rides to ${newRides}`
    })
    console.log('Transaction success', res)
  } catch (e) {
    console.log('Transaction failure:', e)
  }
}

// 用户评价订单
export const reviewOrder = async (orderId) => {
  let batch = db.batch()
  // 在completed-orders增加订单记录，置订单状态为:'reviewed'
  let completedOrdersRef = db.collection('completed-orders').doc(orderId)
  let order = store.state.orders.currentOrder
  let lastReview = order.review.rider
  let riderId = order.riderId
  console.log('reviewOrder:', order)
  order.status = 'reviewed'
  batch.set(completedOrdersRef, order)
  // 删除orders的订单
  let orderRef = db.collection('orders').doc(orderId)
  batch.delete(orderRef)
  return await batch.commit().then(() => {
    console.log('reviewOrder: Status successfully update!')
    // 更新rider.reviews
    updateRiderReviews(riderId, lastReview)
    return true
  })
}

// 更新rider.reviews
export const updateRiderReviews = async (riderId, lastReview) => {
  const riderRef = db.collection('riders').doc(riderId)
  try {
    const res = await db.runTransaction(async (t) => {
      const doc = await t.get(riderRef)
      let reviews = doc.data().reviews
      let rides = doc.data().rides
      let newReviews = (reviews * (rides - 1) + lastReview) / rides
      await t.update(riderRef, { reviews: newReviews })
      return `Update reviews to ${newReviews}`
    })
    console.log('Transaction success', res)
  } catch (e) {
    console.log('Transaction failure:', e)
  }
}

// 更新一条订单记录
export const updateOrder = (orderId, order) => {
  db.collection('orders')
    .doc(orderId)
    .set(order)
    .then(() => {
      console.log('Document successfully written!')
      return true
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
      return false
    })
}

// 获取一条订单信息
export const getOrderById = async (orderId) => {
  var docRef = db.collection('orders').doc(orderId)
  return await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data()
      } else {
        console.log('No such document!')
        return null
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error)
      return null
    })
}

// 获取骑手状态
export const getRider = async (uid) => {
  if (uid) {
    var docRef = db.collection('riders').doc(uid)
    return await docRef
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // 将骑手信息加入全局用户信息
          let rider = doc.data()
          let user = store.state.user.user
          user.rider = rider
          store.commit('user/setUser', user)
          return rider
        } else {
          throw 'no this rider, uid: ' + uid
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error)
        return null
      })
  } else {
    return null
  }
}

// 用uid获取骑手信息
export const getUserRoleById = async (uid) => {
  let docRef = db.collection('riders').doc(uid)
  // 如果在riders表中找到hired为true的记录，则身份为rider,否则为customer
  return await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().hired) return doc.data()
      }
      return null
    })
    .catch((error) => {
      console.log('Error getting document:', error)
      return null
    })
}

// 用uid获取订单集快照后更新Store.orders
export const initMyOrders = (uid) => {
  return db
    .collection('orders')
    .where('userId', '==', uid)
    .onSnapshot((querySnapshot) => {
      let orders = []
      let order = null
      querySnapshot.forEach((doc) => {
        order = doc.data()
        order.id = doc.id
        orders.push(order)
      })
      store.commit('orders/setOrders', orders)
      console.log('initMyOrders ON', orders)
    })
}

// 用orderId获取订单快照后更新Store.currentOrder
export const initRiderOrder = (orderId) => {
  const handle = db
    .collection('orders')
    .doc(orderId)
    .onSnapshot((doc) => {
      let order = doc.data()
      order.id = orderId
      store.commit('orders/setCurrentOrder', order)
      console.log('initRiderOrder ON', order)
      // 订单状态为'completed'时清除监听
      if (order.status === 'completed') handle()
      return
    })
  return handle
}

// 设置骑手状态监听器
export function initRiderStatus(uid) {
  // 监听器句柄
  var handleRiderStatus, handleNotifies, handleTimer, handleRiderOrder
  // Logout时清除各个监听器
  auth.onAuthStateChanged((user) => {
    if (!user) {
      // 停止位置定时发送
      if (handleTimer) {
        clearInterval(handleTimer)
        console.log('clear Interval:', handleTimer)
        handleTimer = null
      }
      // 停止订单通知监听
      if (handleNotifies) {
        handleNotifies()
        handleNotifies = null
      }
      // 停止骑手订单状态监听
      if (handleRiderOrder) {
        handleRiderOrder()
        handleRiderOrder = null
      }
    }
  })

  handleRiderStatus = db
    .collection('riders')
    .doc(uid)
    .onSnapshot((doc) => {
      // 将骑手信息加入全局用户信息
      let rider = doc.data()
      let user = store.state.user.user
      user.role = 'rider'
      user.rider = rider
      store.commit('user/setUser', user)
      console.log('initRiderStatus: user', store.state.user.user)

      switch (rider.status) {
        case 'idle':
          // 启动订单通知监听
          if (!handleNotifies) handleNotifies = initOrderNotifies()
          // 启动位置定时发送
          if (!handleTimer) handleTimer = initUpdateRiderLocation(user.uid)
          break
        case 'offDuty':
          // 停止位置定时发送
          if (handleTimer) {
            clearInterval(handleTimer)
            console.log('clear Interval:', handleTimer)
            handleTimer = null
          }
          // 停止订单监听通知
          if (handleNotifies) {
            handleNotifies()
            handleNotifies = null
          }
          break
        case 'busy':
          // 启动骑手订单状态监听器
          handleRiderOrder = initRiderOrder(rider.currentOrderId)
          // 启动位置定时发送
          if (!handleTimer) handleTimer = initUpdateRiderLocation(user.uid)
          // 清除订单通知监听
          if (handleNotifies) {
            handleNotifies()
            handleNotifies = null
          }
      }
      return
    })

  return handleRiderStatus
}

// rider向数据库定时更新位置信息
export const initUpdateRiderLocation = (uid) => {
  var myDate = new Date()
  var savedLocation = {
    lat: null,
    lng: null,
  }
  var riderId = uid
  return setInterval(async () => {
    // 获取当前位置
    const location = await myLocation().then((result) => {
      return {
        lat: result.latitude,
        lng: result.longitude,
      }
    })
    // 模拟位置变化
    // t = t + 0.0001
    // location.lat = location.lat + t
    // location.lng = location.lng + t

    // 若有位置变化，update to riders.location
    if (
      !(
        location.lat === savedLocation.lat && location.lng === savedLocation.lng
      )
    ) {
      db.collection('riderLocations')
        .doc(riderId)
        .update({ location: location })
        .then(() => {
          savedLocation = location
          console.log(
            'Location successfully written!',
            location,
            myDate.toLocaleTimeString(),
          )
          return true
        })
        .catch((error) => {
          console.error('Error writing document: ', error)
          return false
        })
    }
  }, 3000)
}

// 设置骑手位置监听，更新Store.rider
export const initGetRiderLocation = (riderId) => {
  return db
    .collection('riderLocations')
    .doc(riderId)
    .onSnapshot((doc) => {
      let location = doc.data()
      store.commit('rider/setRiderLocation', location)
      console.log('initGetRiderLocation', location)
    })
}

// 获取订单通知快照，更新Store.orders
export const initOrderNotifies = () => {
  return db.collection('orderNotifies').onSnapshot((querySnapshot) => {
    let orderNotifies = []
    let notify = null
    querySnapshot.forEach((doc) => {
      notify = doc.data()
      notify.id = doc.id
      orderNotifies.push(notify)
    })
    store.commit('orders/setOrderNotifies', orderNotifies)
    console.log('initOrderNotifies ON', orderNotifies)
  })
}

// 设置骑手工作状态
export const updateRiderStatus = async (uid, onDuty) => {
  // set riders status to 'idle'/'offDuty'
  let status = onDuty ? 'idle' : 'offDuty'
  var docRef = db.collection('riders').doc(uid)
  return await docRef
    .update({ status: status })
    .then(() => {
      console.log('Status successfully written!', status)
      return true
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
      return false
    })
}

// 登录成功后根据权限数据生成动态路由和菜单
// export function initDynamicRoutes() {}

// import router from "@/router"
