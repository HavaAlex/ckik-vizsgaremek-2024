import axiosClient from "@/lib/axios"
import type { LoginData, ResetPasswordData, SetPasswordData, SetPasswordResponse } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { getUserStatusFromLocalStorage, setUserStatusToLocalStorage} from '@/localstorage/localStorageManagment.ts';
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"

const Login = async (data: LoginData) : Promise<string> => {
    console.log("login elküldve")
    const response = await axiosClient.post('http://localhost:3000/login/', data)
    console.log("eljut ide return elött")
    return response.data
} 
export const useLogin = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn:Login,
        onSuccess(data){
            const {setBaseTime,setCookie} = useCookieHandler()
            //console.log("Token elmentve!")
            //console.log(data)
            const decoded = jwtDecode(data)
            const d = new Date(0)
            d.setUTCSeconds(decoded.exp)
            setCookie("alap",data,d)
            //console.log("EXP")
            //console.log(decoded.exp*1000)
            //console.log(decoded.userData)
            //console.log(Math.floor((decoded.exp*1000-Date.now())/1000))
            setBaseTime(Math.floor((decoded.exp*1000-Date.now())/1000))
            push({name:decoded.userData.role+'orarend'})
            
        },
        onError(error){
            const {setError} = useErrorHandler()
            setError(error)
        }
    })
}