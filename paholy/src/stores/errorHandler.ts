import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'

export const useErrorHandler = defineStore('errorHandler', () => {
  const currentErrorStatus = ref<Error>();

  const showError = ref<boolean>(false)

  function setError(error:Error){
    console.log("ERROR")
    console.log(error)
    currentErrorStatus.value = error
    showError.value = true
  }

  return {currentErrorStatus,showError,setError }
})
