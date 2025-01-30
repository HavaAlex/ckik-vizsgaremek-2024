import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { Message } from "./uzenetek";
import queryClient from "@/lib/queryClient";

const getUzenetek = async (): Promise<Message> => {
    console.log("LEFUTOK")
    const config = {
        headers: { Authorization: `Bearer ${document.cookie}` }
    };
    //console.log(`localhost:3000/uzenetek/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/paholy/uzenetek`,config) // ${document.cookie}
    console.log(response)
    console.log(response.data)  
    return response.data
}
export const useGetUzenetek = () => {
    return useQuery( 
        {
            queryKey: [QUERY_KEYS.getUzenetek], 
            queryFn: getUzenetek,
        }
    )
}

const addMessage = async (data: Message) : Promise<Message> =>{
    let config = {
        headers: {
            'Authorization': 'Bearer' + localStorage.token
        }
    }
    const response = await axiosClient.post(`http://localhost:3000/paholy/uzenetek`,config) // ${document.cookie}
    console.log(response)
    console.log(response.data)  
    return response.data
}

export const useaddMessage = () => {
    return useMutation( 
        {
            mutationFn: addMessage,
            onSuccess(data){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getUzenetek]})
            }
        }
    )
}