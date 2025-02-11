import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useCookieHandler = defineStore('cookieHandler', () => {
  console.log(document.cookie)
  function hasValidCookie() {
    if(document.cookie == undefined || document.cookie == null || document.cookie == ''){
      console.log("Nincs cookie")
      return false
    }
    const decoded = jwtDecode(document.cookie.split(";")[0])
    if (Date.now() >= decoded.exp * 1000)
    {
      console.log("Cookie lejárt")
      return false
    }
    return true
  }

  const baseTime = ref(1800)
  const timeValue = ref(1800);
  const time = ref("00:00")

  let timer: ReturnType<typeof setInterval> | null = null;

  function startTimer(){
    timeValue.value = baseTime.value
    if (!timer) {
      timer = setInterval(() => {
        //console.log(timeValue.value)
        timeValue.value--;

        const perc = Math.floor(timeValue.value/60)
        const masodperc = timeValue.value%60
        let kiirandano = ""
        if(perc<10){
          kiirandano+= "0"+perc+":"
        }
        else
        {
          kiirandano+= perc+":"
        }
        if(masodperc<10){
          kiirandano+= "0"+ masodperc
        }
        else
        {
          kiirandano+= masodperc
        }
        time.value = kiirandano

        if (timeValue.value == 0){
          stopTimer()
        }
      }, 1000);
    }
  };

  function stopTimer(){
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  function resetTimer(){
    stopTimer();
    timeValue.value = baseTime.value;
  };

  function setBaseTime(newTime:number){
    console.log("SET")
    baseTime.value = newTime
  };

  return { hasValidCookie,startTimer,resetTimer,time,setBaseTime }
})
