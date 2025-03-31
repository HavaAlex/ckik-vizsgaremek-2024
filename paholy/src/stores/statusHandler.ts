import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useStatusHandler = defineStore('statusHandler', () => {
  const currentStatus = ref<string>();

  const showStatus = ref<boolean>(false)

  function setStatus(status:string){
    currentStatus.value = status
    showStatus.value = true
  }

  return {currentStatus,showStatus,setStatus }
})
