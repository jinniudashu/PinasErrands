// *****************************************************************************
// 此脚本为顶层业务逻辑，定义所有业务实体和业务逻辑关系，含用户抽象、业务服务抽象
// 下层抽象为介质作业层，包括UXAPI，全局状态服务，数据库服务，文件服务，认证服务
// *****************************************************************************
// 业务实体特指业务中的角色代理实例和服务职能实例
// 角色代理类 userAgent: 用于生成用户user、骑手rider、服务管理员admin等实例对象
// 服务职能实例：订单服务，通知服务，业务状态管理服务，业务策略服务

import { getDistance } from '@/modules/utils/handleGoogleMap'

// 业务参数
// 运费算法：2KM 79P, 3~4KM 99P, 4KM以上15P/KM；
const PICKUP_FEE = 39
const START_DISTANCE = 2
const START_PRICE = 79
const STAGE_DISTANCE = 4
const STAGE_PRICE = 99
const UNIT_PRICE = 15
const DISTANCE_CORRECTION_FACTOR = 1
const CHARGE_ITEMS = ['DeliverFee', 'PickupFee', 'SideTripFee']
const SIDETRIP_FEE = 20

// 构造运费账目明细v0.2
export const getDeliveryBills = async (locations, sideTripsCounter) => {
  // 运费账单明细：Pickup fee + Delivery fee
  const details = []

  // 生成 Pickup fee
  var pickupFeeDetail = {
    itemName: CHARGE_ITEMS[1],
    amount: PICKUP_FEE,
    distance: 0,
    income: true,
  }
  details.push(pickupFeeDetail)

  // 生成Delivery fee
  // 获取距离，累加为s
  let s = 0
  for (let i = 0; i < locations.length - 1; i++) {
    let d = await getDistance(locations[i], locations[i + 1])
    s = s + d
  }
  // 总距离公里数向上取整 + 修正系数
  s = Math.ceil(s / 1000) + DISTANCE_CORRECTION_FACTOR

  // 计算运费：2KM 79P, 3~4KM 99P, 4KM以上15P/KM；
  const deliveryFeeDetail = {
    itemName: CHARGE_ITEMS[0],
    amount: 0,
    distance: 0,
    income: true,
  }
  if (s <= START_DISTANCE) {
    deliveryFeeDetail.distance = START_DISTANCE
    deliveryFeeDetail.amount = START_PRICE
  } else if (s <= STAGE_DISTANCE) {
    deliveryFeeDetail.distance = s
    deliveryFeeDetail.amount = STAGE_PRICE
  } else {
    deliveryFeeDetail.distance = s
    deliveryFeeDetail.amount = STAGE_PRICE + (s - STAGE_DISTANCE) * UNIT_PRICE
  }
  details.push(deliveryFeeDetail)

  // 生成 side trip fee 明细
  for (let i = 0; i < sideTripsCounter; i++) {
    let sideTripFeeDetail = getSideTripFeeDetail()
    details.push(sideTripFeeDetail)
  }

  console.log('detail', details)

  return details
}

// Side trip fee 账单明细
export const getSideTripFeeDetail = () => {
  const sideTripFeeDetail = {
    itemName: CHARGE_ITEMS[2],
    amount: SIDETRIP_FEE,
    distance: 0,
    income: true,
  }
  return sideTripFeeDetail
}

// 客户端状态显示items定义
export const statusDisplayItems = {
  apply: {
    // image: require('@/assets/apply.svg'),
    image: 'apply',
    txt1: 'PLEASE WAIT...',
    txt2: 'LOOKING FOR A RIDER FOR YOU',
  },
  assigned: {
    // image: require('@/assets/assigned.svg'),
    image: 'assigned',
    txt1: 'THE RIDER IS ALREADY DOING ',
    txt2: 'THE ERRAND FOR YOU!',
  },
  confirmed: {
    // image: require('@/assets/confirmed.svg'),
    image: 'confirmed',
    txt1: 'THE RIDER IS ON HIS WAY',
    txt2: 'PLEASE PREPARE',
  },
  completed: {
    // image: require('@/assets/completed.svg'),
    image: 'completed',
    txt1: 'THANK YOU!',
    txt2: 'PLEASE LEAVE US A REVIEW!',
  },
}

// 构造运费账目明细v0.1
// export const getDeliveryBills = (distance) => {
//   const billDetail = {
//     itemName: CHARGE_ITEMS[0],
//     amount: 0,
//     distance: 0,
//     income: true,
//   }
//   // 计算运费，路程向上取整
//   let d = Math.ceil(distance / 1000)
//   // 运费算法：2KM 79P, 3~4KM 99P, 4KM以上15P/KM；
//   if (d <= START_DISTANCE) {
//     billDetail.distance = START_DISTANCE
//     billDetail.amount = START_PRICE
//   } else if (d <= STAGE_DISTANCE) {
//     billDetail.distance = d
//     billDetail.amount = STAGE_PRICE
//   } else {
//     billDetail.distance = d
//     billDetail.amount = STAGE_PRICE + (d - STAGE_DISTANCE) * UNIT_PRICE
//   }
//   return billDetail
// }

// TODO: 伪代码编程

// 客户实例
export const User = () => {}

// 骑手实例
export const rider = () => {}

// 服务管理员
export const admin = () => {}

// 订单服务
export const orderServ = () => {
  // 创建订单，修改订单状态，订单状态变更通知，订单查询
}

// 通知服务
export const notifyServ = () => {
  // 发送通知，通知管理
}

// 业务状态管理服务
export const stateServ = () => {
  // 业务状态调度：事件监听，状态更新，事件触发
}

// 业务策略服务
export const strategyServ = () => {
  // 提供业务政策，业务参数
}
