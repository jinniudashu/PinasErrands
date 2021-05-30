<template>
  <div>
    <navigation-bar>
      <p class="text-gray-800 text-base font-semibold">
        {{ isDeliveryLocation ? 'Delivery' : 'Pick Up' }}
      </p>
      &nbsp;
      <p class="text-yellow-400 text-base font-semibold">Details</p>
    </navigation-bar>
    <div class="w-auto mx-4">
      <!-- Location -->
      <div @click="editLocation">
        <display-location :item="location" />
      </div>
      <div v-if="!locationValidity" class="text-red-400">
        Location is required
      </div>
      <!-- Contacts -->
      <div class="text-gray-800 mt-4 ">
        <label class="text-sm font-semibold" for="contactName"
          >CONTACT PERSON / ESTABLISHMENT ADDRESS</label
        >
        <input
          class="background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-800 border-2 focus: outline-none"
          id="contactName"
          type="text"
          v-model="contactName"
        />
      </div>
      <div v-if="!contactNameValidity" class="text-red-400">
        Contact infomation is required
      </div>

      <div class="text-gray-800 mt-4">
        <label class="text-sm font-semibold" for="contactPhone"
          >PICKUP CONTACT INFORMATION ({{
            isDeliveryLocation ? 'REQUIRED' : 'OPTIONAL'
          }})</label
        >
        <div
          class="flex flex-row justify-between items-center background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-800 border-2"
        >
          <div class="text-gray-400 pr-2 border-r-2">+63</div>
          <input
            class="w-full mx-2 focus: outline-none"
            id="contactPhone"
            type="tel"
            v-model="contactPhone"
          />
          <div class="border-l-2 pl-1">
            <svg-icon :name="'contacts'" />
          </div>
        </div>
      </div>
      <div v-if="!contactPhoneValidity" class="text-red-400">
        Contact infomation is required
      </div>

      <!-- Request -->
      <div class="text-gray-800 mt-4">
        <label class="text-sm font-semibold" for="request">{{
          isDeliveryLocation ? 'Landmark' : 'Errand Request'
        }}</label>
        <textarea
          class="background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-800 border-2 focus: outline-none"
          name="request"
          id="request"
          cols="30"
          rows="4"
          v-model="request"
        ></textarea>
      </div>
      <div v-if="!requestValidity" class="text-red-400">
        <span>{{ isDeliveryLocation ? 'Landmark' : 'Errand Request' }}</span>
        is required
      </div>

      <!-- Attachment -->
      <attachment
        :attachment="attachment"
        :userMode="'customerInput'"
        @uploadImg="(url) => attachment.push(url)"
        @delImg="(index) => attachment.splice(index, 1)"
      />
      <!-- SideTrip -->
      <div v-if="!isDeliveryLocation">
        <div class="flex flex-col justify-start space-y-3 mt-8 ">
          <p class="text-xs text-gray-600">
            Want anything done for you within 100 meters of the pick up address?
          </p>
          <button
            class="flex flex-row justify-center items-center space-x-2 py-2 text-sm font-semibold bg-yellow-100 rounded-xl shadow-lg w-auto pl-2 focus: border-none outline-none"
            @click="onAddSideTrip"
          >
            <svg-icon :name="'circleplus'" />
            <p>Side Trip:</p>
            <p>{{ sideTripsCounter }}</p>
          </button>
        </div>
        <div v-for="(item, index) in sideTrips" :key="index">
          <div class="flex flex-row justify-start items-center mt-3">
            <p class="mr-2 mt-1 text-base">{{ index + 1 }}.</p>
            <textarea
              class="background-gray-100 rounded-lg shadow-md mt-2 px-2 py-1 w-full border-gray-800 border-2"
              v-model="item.notes"
              name="sidetrip"
              id="sidetrip"
              cols="30"
              rows="2"
            ></textarea>
            <button
              type="button"
              @click="(index) => sideTrips.splice(index, 1)"
              class="rounded-full hover:bg-gray-600 hover:bg-opacity-25 p-2 focus:outline-none text-gray-600 transition duration-200"
            >
              <svg-icon name="x" class="h-6 w-6 -space-x-3" />
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="!status"
        @click="submitItem"
        class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-6 w-full"
      >
        CONFIRM
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import DisplayLocation from '../components/DisplayLocation'
import Attachment from '../components/Attachment'

export default {
  name: 'ItemEdit',
  components: {
    DisplayLocation,
    Attachment,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const id = route.query.id
    const isDeliveryLocation = computed(
      () => store.state.orders.currentOrder.items.length - 1 == id,
    )

    const state = reactive({
      location: store.state.orders.currentItem.location,
      contactName: store.state.orders.currentItem.contactName,
      contactPhone: store.state.orders.currentItem.contactPhone,
      request: store.state.orders.currentItem.request,
      attachment: store.state.orders.currentItem.attachment,
      sideTrips: store.state.orders.currentItem.sideTrips,
      schedule: store.state.orders.currentItem.schedule,
    })

    const validity = reactive({
      locationValidity: true,
      contactNameValidity: true,
      contactPhoneValidity: true,
      requestValidity: true,
    })

    const sideTripsCounter = computed(() => state.sideTrips.length)
    const status = computed(() => store.state.orders.currentOrder.status)

    watchEffect(() => {
      if (store.state.orders.currentItem.location.address) {
        state.location = store.state.orders.currentItem.location
      }
      state.contactName = store.state.orders.currentItem.contactName
      state.contactPhone = store.state.orders.currentItem.contactPhone
      state.request = store.state.orders.currentItem.request
      state.attachment = store.state.orders.currentItem.attachment
      state.sideTrips = store.state.orders.currentItem.sideTrips
      state.schedule = store.state.orders.currentItem.schedule
    })

    // 非空检查
    watch(
      [
        () => state.location.address,
        () => state.contactName,
        () => state.contactPhone,
        () => state.request,
      ],
      (
        [newLocation, newContactName, newContactPhone, newRequest],
        [oldLocation, oldContactName, oldContactPhone, oldRequest],
      ) => {
        // 检查地址
        if (!(newLocation === oldLocation)) {
          validity.locationValidity = newLocation ? true : false
        }
        // 检查联系人
        if (!(newContactName === oldContactName)) {
          validity.contactNameValidity = newContactName ? true : false
        }
        // 检查联系电话
        if (!(newContactPhone === oldContactPhone) && isDeliveryLocation.value)
          validity.contactPhoneValidity = newContactPhone ? true : false
        // 检查服务需求
        if (!(newRequest === oldRequest))
          validity.requestValidity = newRequest ? true : false
      },
    )

    function onAddSideTrip() {
      console.log(state.sideTrips)
      state.sideTrips.push({ notes: '' })
    }

    function editLocation() {
      store.state.orders.currentItem.contactName = state.contactName
      store.state.orders.currentItem.contactPhone = state.contactPhone
      store.state.orders.currentItem.request = state.request
      store.state.orders.currentItem.attachment = state.attachment
      store.state.orders.currentItem.sideTrips = state.sideTrips
      store.state.orders.currentItem.schedule = state.schedule

      router.push({ path: '/maplocation' })
    }

    function submitItem() {
      // 校验
      if (itemVerify()) {
        // 构造订单项目信息
        let item = {
          location: state.location,
          contactName: state.contactName,
          contactPhone: state.contactPhone,
          request: state.request,
          attachment: state.attachment,
          sideTrips: state.sideTrips,
          schedule: state.schedule,
        }
        store.commit('orders/setCurrentOrderItems', {
          item: item,
          id: id,
        })
        initState()
        router.go(-1)
      }
    }

    function itemVerify() {
      validity.locationValidity = state.location.address ? true : false
      validity.contactNameValidity = state.contactName ? true : false
      if (isDeliveryLocation.value) {
        validity.contactPhoneValidity = state.contactPhone ? true : false
      }
      validity.requestValidity = state.request ? true : false

      let isVerified = false
      if (
        validity.locationValidity &&
        validity.contactNameValidity &&
        validity.contactPhoneValidity &&
        validity.requestValidity
      ) {
        isVerified = true
      }

      return isVerified
    }

    function initState() {
      state.location = {
        address: '',
        lat: 0,
        lng: 0,
      }
      state.contactName = ''
      state.contactPhone = ''
      state.request = ''
      state.attachment = []
      state.sideTrips = []
      state.schedule = {
        isScheduled: false,
        time: null,
      }
    }

    return {
      ...toRefs(state),
      ...toRefs(validity),
      submitItem,
      status,
      onAddSideTrip,
      sideTripsCounter,
      isDeliveryLocation,
      editLocation,
    }
  },
}
</script>
