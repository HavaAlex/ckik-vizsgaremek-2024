import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useCookieHandler = defineStore('cookieHandler', () => {
  function hasValidCookie() {
    if(document.cookie == undefined || document.cookie == null || document.cookie == ''){
      console.log("Nincs cookie")
      return false
    }
    const decoded = jwtDecode(document.cookie)
    if (Date.now() >= decoded.exp * 1000)
    {
      console.log("Cookie lejárt")
      return false
    }
    return true
  }

  return { hasValidCookie }
})
