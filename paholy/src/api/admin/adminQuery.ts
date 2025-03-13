import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import type { Teacher } from '@/api/admin/admin';
import { useCookieHandler } from "@/stores/cookieHandler";

//import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";


const addTeacherUsers = async (teachers: Teacher[]) : Promise<Teacher[]> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addTeacherUsers`,teachers,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const useaaddTeacherUsers= () => {
    return useMutation( 
        {
            mutationFn: addTeacherUsers,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.addTeacherUsers]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}