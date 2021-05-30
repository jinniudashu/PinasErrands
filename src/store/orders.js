import { getOrderById } from '@/modules/utils/handleData'
import { getDeliveryBills } from '@/modules/businessEntity'

export default {
  namespaced: true,
  state: {
    // 当前用户的所有在执行订单
    orders: [],

    // 当前订单
    currentOrder: {
      items: [
        {
          location: {
            address: '',
            lat: 0,
            lng: 0,
          },
          contactName: '',
          contactPhone: '',
          request: '',
          attachment: [],
          sideTrips: [],
          schedule: {
            isScheduled: false,
            time: null,
          },
        },
        {
          location: {
            address: '',
            lat: 0,
            lng: 0,
          },
          contactName: '',
          contactPhone: '',
          request: '',
          attachment: [],
          sideTrips: [],
          schedule: {
            isScheduled: false,
            time: null,
          },
        },
      ],
      bills: {
        totalAmount: 0,
        totalDistance: 0,
        details: [],
      },
    },

    // 当前订单项目
    currentItem: {
      location: {
        address: '',
        lat: 0,
        lng: 0,
      },
      contactName: '',
      contactPhone: '',
      request: '',
      attachment: [],
      sideTrips: [],
      schedule: {
        isScheduled: false,
        time: null,
      },
    },

    // 订单通知
    orderNotifies: [],
  },

  // 根据 items[i].location.lat/lng 计算 bills
  getters: {
    // 计算账单
    async summaryBills(state) {
      // 生成坐标数组
      let locations = state.currentOrder.items.map((item) => {
        let lat = item.location.lat
        let lng = item.location.lng
        return { lat, lng }
      })

      let sideTripsCounter = state.currentOrder.items
        .map((item) => item.sideTrips.length)
        .reduce((acc, cur) => acc + cur)

      // 生成账单明细
      let details = await getDeliveryBills(locations, sideTripsCounter)

      // 总价
      let totalAmount = details
        .map((item) => item.amount)
        .reduce((acc, cur) => acc + cur)

      // 总里程
      let totalDistance = details
        .map((item) => item.distance)
        .reduce((acc, cur) => acc + cur)
      return {
        totalAmount,
        totalDistance,
        details,
      }
    },

    // 用通知中orderId获取新订单信息
    async getNewOrders(state) {
      return await Promise.all(
        state.orderNotifies.map(async (item) => {
          let order = await getOrderById(item.orderId)
          order.id = item.orderId
          order.notifyId = item.id
          return order
        }),
      )
    },
  },

  mutations: {
    setOrders(state, payload) {
      state.orders = payload
    },
    setCurrentOrder(state, payload) {
      state.currentOrder = payload
    },
    setCurrentOrderItems(state, payload) {
      // id:-1 插入一个新Item
      if (payload.id == -1) {
        state.currentOrder.items.splice(
          state.currentOrder.items.length - 1,
          0,
          payload.item,
        )
      } else {
        // 正常更新Item
        state.currentOrder.items[payload.id] = payload.item
      }
    },
    setCurrentOrderBills(state, payload) {
      state.currentOrder.bills.totalAmount = payload.totalAmount
      state.currentOrder.bills.totalDistance = payload.totalDistance
      state.currentOrder.bills.details = payload.details
    },
    setCurrentItemLocation(state, location) {
      if (location) {
        state.currentItem.location = location
      }
    },
    setCurrentItem(state, payload) {
      state.currentItem = payload
    },
    setOrderNotifies(state, payload) {
      state.orderNotifies = payload
    },
  },

  actions: {},
}
