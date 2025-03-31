import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'

export const useErrorHandler = defineStore('errorHandler', () => {
  const currentErrorStatus = ref<Error|unknown>();

  const showError = ref<boolean>(false)

  function setError(error:Error|unknown){
    currentErrorStatus.value = error
    showError.value = true
  }

  return {currentErrorStatus,showError,setError }
})
