import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { Message,PotentialReciever } from "./uzenetek";
import queryClient from "@/lib/queryClient";



const getUzenetek = async (): Promise<Message> => {
    console.log("LEFUTOK: getUzenetek")
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

const getPotentialReceivers = async (): Promise<PotentialReciever> =>{
    console.log("LEFUTOK: getPotentialRecievers")
    const config = {
        headers: { Authorization: `Bearer ${document.cookie}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/uzenetekreceivers`,config)
    console.log(response)
    return response.data
}
export const usegetPotentialReceivers = () => {
    return useQuery (
        {
            queryKey: [QUERY_KEYS.getPotentialReceivers], 
            queryFn: getPotentialReceivers,
        }
    )
}

const addMessage = async (data: Message) : Promise<Message> =>{
    console.log("LEFUTOK: addMessage")
    let config = {
        headers: { Authorization: `Bearer ${document.cookie}` }
    }
    const response = await axiosClient.post(`http://localhost:3000/paholy/uzenetek`,data,config) // ${document.cookie}
    console.log("SIKERÜÜÜÜLT")
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