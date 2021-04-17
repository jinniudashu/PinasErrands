<template>
  <div class="fixed w-full mt-32 flex justify-center">
    <div
      class="bg-green-400 text-gray-800 shadow-lg rounded-lg  h-20 text-center w-2/3 flex flex-row justify-center items-center space-x-2"
    >
      <div>
        <svg-icon name="error" />
      </div>
      <div class=" font-emibold ">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
