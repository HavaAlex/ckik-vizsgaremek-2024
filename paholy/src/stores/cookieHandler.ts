import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

export const useCookieHandler = defineStore('cookieHandler', () => {
  console.log(document.cookie)
  const utolsoDecoded = ref<JwtPayload>()
  function hasValidCookie() {
    if(document.cookie == undefined || document.cookie == null || document.cookie == ''){
      console.log("Nincs cookie")
      return false
    }
    const decoded = jwtDecode(document.cookie.split(";")[0])
    if (decoded?.exp&& Date.now() >= decoded.exp * 1000)
    {
      console.log("Cookie lejárt")
      return false
    }
    utolsoDecoded.value = decoded;
    return true
  }

  const baseTime = ref(1800)
  const timeValue = ref(1800);
  const time = ref("00:00")

  let timer: ReturnType<typeof setInterval> | null = null;

  function startTimer(){
    const decoded = jwtDecode(document.cookie.split(";")[0])
    /*console.log("!!!!!!!!!!!!!!!!!!!!")
    console.log(Date.now())
    console.log(decoded.exp*1000)*/
    if(decoded.exp)
    {
      baseTime.value = Math.floor(Math.abs(Date.now() - (decoded.exp*1000))/1000)
      timeValue.value = baseTime.value
    }
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

  function setCookie(cname:string, cvalue:string, date:Date) {
    let expires = "expires="+date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname:string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function deleteCookie(cname:string) {
    const d = new Date()
    d.setUTCFullYear(1970,1,1)
    setCookie(cname,"",d)
  }

  return { hasValidCookie,startTimer,resetTimer,time,setBaseTime,setCookie,getCookie,deleteCookie,utolsoDecoded }
})
