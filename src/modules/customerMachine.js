import { createMachine, send, sendParent } from 'xstate'
import { initMyOrders } from './utils/handleData'
import router from '@/router'

export const customerMachine = createMachine({
  id: 'customer',
  initial: 'idle',
  context: {
    user: {
      uid: '',
    },
    orders: null,
  },
  states: {
    idle: {
      invoke: {
        id: 'initMyOrders',
        src: (ctx) => {
          initMyOrders(ctx.user.uid)
          router.replace('/customerhome')
        },
      },
      on: {
        CREATE_ERRAND_ORDER: 'editErrand',
        VIEW_ORDER_STATUS: 'viewErrand',
        LOGOUT: 'stop',
      },
    },
    editErrand: {
      entry: () => {
        router.push('/order'), console.log('routed new order')
      },
    },
    viewErrand: {},
    stop: {
      type: 'final',
    },
  },
})

// 创建订单
const customerEditErrandMachine = createMachine(
  {
    id: 'customerEditErrand',
    initial: 'editOrder',
    context: {
      order: undefined,
    },
    states: {
      editOrder: {
        on: {
          CONFIRM_ORDER: {
            actions: ['createOrder'],
            target: 'finished',
          },
          CLICK_ITEM: 'editItem',
          GO_BACK: '#customerHome.home',
        },
      },
      editItem: {
        on: {
          EDIT_ITEM: {
            actions: ['updateItem'],
          },
          CONFIRM_ITEM: 'editOrder',
          CLICK_LOCATION: 'editLocation',
          GO_BACK: 'editOrder',
        },
      },
      editLocation: {
        on: {
          EDIT_LOCATION: {
            actions: ['updateLocation'],
          },
          CONFIRM_LOCATION: 'editItem',
          GO_BACK: 'editItem',
        },
      },
      finished: { type: 'final' },
    },
  },
  {
    actions: {
      createOrder: () => {
        console.log('Create a new order')
      },
      updateItem: () => {
        console.log('Update contex.item')
      },
      updateLocation: () => {
        console.log('Update contex.location')
      },
    },
  },
)

// 查看订单状态
const customerViewErrandMachine = createMachine(
  {
    id: 'customerViewErrand',
    initial: 'unknown',
    context: {
      orderState: 'riderWorking',
    },
    entry: ['enterCurrentState'],
    states: {
      unknown: {
        on: {
          '': [
            { target: 'lookingForRider', cond: 'LookingRider' },
            { target: 'riderIsWorking', cond: 'riderWorking' },
            { target: 'riderIsComing', cond: 'riderComing' },
            { target: 'waitingReview', cond: 'orderCompleted' },
            { target: 'orderClosed', cond: 'orderClosed' },
          ],
        },
      },
      lookingForRider: {
        on: {
          RIDER_OK: 'riderIsWorking',
        },
      },
      riderIsWorking: {
        on: {
          RIDER_CONFIRMED: 'riderIsComing',
        },
      },
      riderIsComing: {
        on: {
          ERRAND_COMPLETED: 'waitingReview',
        },
      },
      waitingReview: {
        on: {
          CUSTOMER_REVIEWED: 'orderClosed',
        },
      },
      orderClosed: {
        entry: sendParent('GO_BACK'),
      },
    },
  },
  {
    actions: {
      enterCurrentState: () => {
        console.log('Get current order state and enter it')
      },
    },
    guards: {
      LookingRider: (context) => {
        return context.orderState === 'LookingRider'
      },

      riderWorking: (context) => {
        return context.orderState === 'riderWorking'
      },

      riderComing: (context) => {
        return context.orderState === 'riderComing'
      },

      orderCompleted: (context) => {
        return context.orderState === 'orderCompleted'
      },

      orderClosed: (context) => {
        return context.orderState === 'orderClosed'
      },
    },
  },
)

export const customerHomeMachine = createMachine(
  {
    id: 'customerHome',
    initial: 'home',
    context: {
      orders: undefined,
    },
    states: {
      home: {
        entry: ['loadOrders'],
        on: {
          CREATE_ORDER: 'editErrand',
          VIEW_ORDER: 'viewErrand',
        },
      },
      editErrand: {
        invoke: {
          id: 'customerEditErrand',
          src: customerEditErrandMachine,
          onDone: 'viewErrand',
        },
      },
      viewErrand: {
        invoke: {
          id: 'customerViewErrand',
          src: customerViewErrandMachine,
          onDone: 'home',
        },
      },
      on: {
        CHANGE_STATE: {
          actions: send((_, event) => event, {
            to: 'customerViewErrand',
          }),
          // actions: forwardTo("customerViewErrand"),
        },
        GO_BACK: 'home',
      },
    },
  },
  {
    actions: {
      initialMenu: () => {
        console.log('Initial Menu')
      },
      loadOrders: () => {
        console.log('Load history orders')
      },
    },
  },
)
