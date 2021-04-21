<template>
  <navigation-bar>
    <p class="text-gray-800 text-base font-semibold">Errand</p>
    &nbsp;
    <p class="text-yellow-400 text-base font-semibold">Details</p>
  </navigation-bar>
  <hr />
  <div class="w-auto mx-4">
    <!-- Location -->
    <router-link to="/maplocation">
      <display-location :item="location" />
    </router-link>

    <!-- Contacts -->
    <div class="text-gray-800 mt-4 ">
      <label class="text-sm font-semibold" for="contactName"
        >Name of Person / Establishment</label
      >
      <input
        class="background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-800 border-2"
        id="contactName"
        type="text"
        v-model="contactName"
      />
    </div>
    <div class="text-gray-800 mt-4">
      <label class="text-sm font-semibold" for="contactPhone"
        >Mobile Number ({{
          isDeliveryLocation ? 'Required' : 'Optional'
        }})</label
      >
      <div
        class="flex flex-row justify-between items-center background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-800 border-2"
      >
        <div class="text-gray-400 pr-2 border-r-2">+63</div>
        <input
          class="w-full mx-2"
          id="contactPhone"
          type="tel"
          v-model="contactPhone"
        />
        <div class="border-l-2 pl-1">
          <svg-icon :name="'contacts'" />
        </div>
      </div>
    </div>

    <!-- Request -->
    <div class="text-gray-800 mt-4">
      <label class="text-sm font-semibold" for="request">{{
        isDeliveryLocation ? 'Landmark' : 'Errand Request'
      }}</label>
      <textarea
        class="background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-800 border-2"
        name="request"
        id="request"
        cols="30"
        rows="4"
        v-model="request"
      ></textarea>
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
      <button
        class="flex flex-row justify-start items-center space-x-2 mt-8 py-2 text-sm font-semibold bg-yellow-100 rounded-xl shadow-lg w-auto pl-2"
        @click="onAddSideTrip"
      >
        <p>Side Trip:</p>
        <p>{{ sideTripsCounter }}</p>
        <svg-icon :name="'circleplus'" />
      </button>
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

    <!-- Scheduled -->
    <!-- <div>
      <input
        type="radio"
        id="doNow"
        v-model="schedule.isScheduled"
        value="false"
        checked
      />
      <label for="doNow">Do Now</label>
    </div>
    <div>
      <input
        type="radio"
        id="schedule"
        v-model="schedule.isScheduled"
        value="true"
      />
      <label for="schedule">Schedule</label>
      <input
        type="time"
        id="scheduleTime"
        v-model="schedule.time"
        min="08:00"
        max="22:00"
        required
      />
    </div> -->

    <button
      v-if="!status"
      class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-6 w-full"
      @click="submitItem"
    >
      CONFIRM
    </button>
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import DisplayLocation from '../components/DisplayLocation'
import Attachment from '../components/Attachment'

export default {
  name: 'ItemEdit',
  components: {
    DisplayLocation,
    Attachment,
  },
  props: {
    id: Number,
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const item = computed(
      () =>
        store.state.orders.currentOrder.items[props.id] || {
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
    )
    const isDeliveryLocation = computed(
      () => store.state.orders.currentOrder.items.length - 1 == props.id,
    )

    const state = reactive({
      location: item.value.location,
      contactName: item.value.contactName,
      contactPhone: item.value.contactPhone,
      request: item.value.request,
      attachment: item.value.attachment,
      sideTrips: item.value.sideTrips,
      schedule: item.value.schedule,
    })
    const sideTripsCounter = computed(() => state.sideTrips.length)
    const status = computed(() => store.state.orders.currentOrder.status)

    onMounted(() => {
      console.log(
        'ItemEdit:',
        props.id,
        store.state.orders.currentOrder.items.length - 1,
        isDeliveryLocation.value,
      )
    })

    watchEffect(() => {
      if (store.state.orders.tmpSubmitedLocation) {
        state.location = store.state.orders.tmpSubmitedLocation
      }
    })

    function onAddSideTrip() {
      console.log(state.sideTrips)
      state.sideTrips.push({ notes: '' })
    }

    function submitItem() {
      let item = state
      let id = props.id
      // 构造订单项目信息
      store.commit('orders/setCurrentOrderItems', { item, id })
      router.go(-1)
    }

    return {
      ...toRefs(state),
      submitItem,
      status,
      onAddSideTrip,
      sideTripsCounter,
      isDeliveryLocation,
    }
  },
}
</script>
