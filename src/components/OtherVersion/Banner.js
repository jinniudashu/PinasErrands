import { defineComponent } from 'vue'
import img from '../assets/on-the-way.svg'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="flex justify-between items-end bg-yellow-100 h-32 shadow-md">
          <div class="flex-col space-y-6 ml-8 mb-4 text-gray-800">
            <div class="mt-5 text-base font-semibold">
              <p>Want something done?</p>
              <p>We can do it for you!</p>
            </div>
            <div class=" text-xs text-right">Find out how it works ...</div>
          </div>
          <div class="mr-5 mb-4">
            <img src={img} alt="Errunds logo" class="w-40" />
          </div>
        </div>
      )
    }
  },
})
