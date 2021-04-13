import { createMachine } from 'xstate'
import router from '@/router'
import { initRiderOrder, getOrderById } from './utils/handleData'

export const riderMachine = createMachine({
  id: 'rider',
  initial: 'loading',
  context: {
    user: { uid: '' },
    orderNotifies: null,
    order: null,
    data: null,
  },
  states: {
    loading: {
      invoke: {
        id: 'getRider',
        // 返回骑手状态
        src: (ctx) => {
          return async (callback) => {
            let rider = ctx.user.rider
            let order = null
            console.log(ctx.user.uid, rider)
            if (rider.status === 'busy') {
              // 获取rider当前执行的订单
              order = await getOrderById(rider.currentOrderId)
              console.log(ctx.user.uid, order)
              // TODO: 在store中处理handleCurrentOrder
              initRiderOrder(true, rider.currentOrderId)
              switch (order?.status) {
                case 'assigned':
                  callback({ type: 'ASSIGNED', rider, order })
                  break
                case 'confirmed':
                  callback({ type: 'CONFIRMED', rider, order })
                  break
              }
            } else if (rider?.status === 'idle') {
              callback({ type: 'IDLE', rider, order })
            } else {
              callback({ type: 'OFF_DUTY', rider, order })
            }
          }
        },
      },
      on: {
        IDLE: {
          target: 'idle',
        },
        ASSIGNED: {
          target: 'assigned',
        },
        CONFIRMED: {
          target: 'confirmed',
        },
        OFF_DUTY: {
          target: 'offDuty',
        },
      },
    },
    idle: {
      invoke: {
        id: 'initNewOrderNotifies',
        src: () => {
          console.log('idle')
          router.replace('/riderhome')
        },
      },
      on: {
        ASSIGNED: {
          target: 'assigned',
        },
        OFF_DUTY: {
          target: 'offDuty',
        },
      },
    },
    assigned: {
      invoke: {
        src: () => {
          console.log('assigned')
          router.push('/riderontheway')
        },
      },
      on: {
        CONFIRMED: {
          target: 'confirmed',
        },
      },
    },
    confirmed: {
      invoke: {
        src: () => {
          console.log('confirmed')
          router.push('/ridererrandcompleted')
        },
      },
      on: {
        COMPLETED: {
          target: 'idle',
        },
      },
    },
    offDuty: {
      invoke: {
        src: () => {
          console.log('offDuty')
          router.replace('/riderhome')
        },
      },
      on: {
        ON_DUTY: {
          target: 'idle',
        },
      },
    },
    stop: {
      type: 'final',
    },
  },
})
