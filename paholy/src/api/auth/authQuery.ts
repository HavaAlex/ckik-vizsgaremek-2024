import axiosClient from "@/lib/axios"
import type { LoginData, LoginResponse, ResetPasswordData, SetPasswordData, SetPasswordResponse } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { getUserStatusFromLocalStorage, setUserStatusToLocalStorage} from '@/localstorage/localStorageManagment.ts';

const getSetPassword = async (): Promise<SetPasswordResponse> => {
    const {params} = useRoute()
    const response = await axiosClient.get(`localhost:3000/login/${params.token}`)//megnemlyóóóóóó
    return response.data
}
export const useGetSetPassword = () => {
    return useQuery( 
        {
            queryKey: [QUERY_KEYS.setPassword],  //setPassword
            queryFn: getSetPassword,
        }
    )
}
const putSetPassword = async (token: string, data: SetPasswordData) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/set-password/${token}`, data)
    return response.data
}
export const usePutSetPassword = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: ({token, data} : { token: string, data: SetPasswordData }) => putSetPassword(token, data),
            onSuccess() {
                push({name:'login'})
            },
        }
    )
} 
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
            document.cookie = data
            console.log("Token elmentve!")
            console.log(data)
            const decoded = jwtDecode(data)
            console.log(decoded)
            console.log(decoded.userData)
            push({name:decoded.userData.role+'orarend'})
        },
        onError(error)
        {
            console.log(error)
            
        }
    })
}
const postPasswordReset = async ( data: ResetPasswordData) => {
    const response = await axiosClient.post(`http://172.22.1.219/api/v1/password-reset`, data)
    return response.data.data
}
export const usePostPasswordReset = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: postPasswordReset,
            onSuccess(data) {
                push({name: 'password-reset', params: {token: data.token}})
            },
        }
    )
}
const getPasswordReset = async () : Promise<SetPasswordResponse> => {
    const {params} = useRoute()
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/password-reset/${params.token}`)
    return response.data
}
export const useGetPasswordReset = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.passwordReset],
            queryFn: getPasswordReset,
        }
    )
}
const putPasswordReset = async (token: string, data: SetPasswordData) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/password-reset/${token}`, data)
    return response.data
}
export const usePutPasswordReset = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: ({token, data} : { token: string, data: SetPasswordData }) => putPasswordReset(token, data),
            onSuccess() {
                push({name:'login'})
            },
        }
    )
}
const Logout  = async (token: string, data: SetPasswordData) => {
    const response = await axiosClient.post(`http://172.22.1.219/api/v1/logout/`, data)
    return response.data
}

export const useLogout = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn: Logout,
        onSuccess(data){
            localStorage.removeItem("token")
            push({name: "home"})
        }
    })
}