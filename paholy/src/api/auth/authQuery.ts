import axiosClient from "@/lib/axios"
import type { LoginData, ResetPasswordData, SetPasswordData, SetPasswordResponse,changePasswordData } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { getUserStatusFromLocalStorage, setUserStatusToLocalStorage} from '@/localstorage/localStorageManagment.ts';
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"
import { registerTS } from "vue/compiler-sfc"
 
const Login = async (data: LoginData) : Promise<string> => {
    const response = await axiosClient.post('http://localhost:3000/login/', data)
    return response.data
} 
export const useLogin = (data: LoginData) => {
    const { push } = useRouter();
    return useMutation({
        mutationFn: Login,
        mutationKey: [QUERY_KEYS.Login, data],
        onSuccess(data) {
            const { setBaseTime, setCookie } = useCookieHandler();
            const decoded: JwtPayload = jwtDecode(data); 

            if (decoded.exp !== undefined) {
                const d = new Date(0);
                d.setUTCSeconds(decoded.exp);
                setCookie("alap", data, d);
                setBaseTime(Math.floor((decoded.exp * 1000 - Date.now()) / 1000));
            } else {
                console.warn("JWT token does not contain an expiration field.");
            }

            push({
                path: "/orarend/" + decoded.userData.role + 
                    (decoded.userData.role === "szulo" ? `/${decoded.userData.children?.[0]?.ID || ''}` : ''),
            });
        },
        onError(error) {
            const { setError } = useErrorHandler();
            setError(error);
        }
    });
};


const ChangePassword = async (passwordData:changePasswordData)=>{
    const response = await axiosClient.post('http://localhost:3000/login/changePassword/', passwordData)
    return response.data
}

export const useChangePassword = (passwordData:changePasswordData) =>{
    const {push} = useRouter()
    return useMutation({
        mutationFn:ChangePassword,
        mutationKey: [QUERY_KEYS.ChangePassword, passwordData],
        onSuccess(){

            push({name: 'login'})
            
        },
        onError(error){
            const {setError} = useErrorHandler()
            setError(error)
        }
    })
}