import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";



const getUzenetek = async (): Promise<Message> => {
    //console.log("LEFUTOK: getUzenetek")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    //console.log(`localhost:3000/uzenetek/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/uzenet/`,config) // ${document.cookie}
    console.log(response)
    console.log(response.data)  
    return response.data
}
export const useGetUzenetek = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getUzenetek],
        queryFn: getUzenetek,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }

    return query
}
 
const getAllUzenetek = async (): Promise<Message> => {
    //console.log("LEFUTOK: getUzenetek")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    //console.log(`localhost:3000/uzenetek/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/uzenet/all`,config) // ${document.cookie}
    return response.data
}
export const usegetAllUzenetek = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getAllUzenetek],
        queryFn: getAllUzenetek,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }

    return query
}
const getPotentialReceivers = async (): Promise<PotentialReceiver> =>{
    console.log("LEFUTOK: getPotentialReceivers")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/uzenet/uzenetekreceivers`,config)
    console.log("anyád:")
    console.log(response)
    console.log(response.data)
    return response.data
}
export const usegetPotentialReceivers = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getPotentialReceivers],
        queryFn: getPotentialReceivers,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query  
}

const addMessage = async (data: Message) : Promise<Message> =>{
    data.date = new Date(); //aktuális dátum hozzáadása
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    const response = await axiosClient.post(`http://localhost:3000/uzenet/`,data,config) // ${document.cookie}
    return response.data
}

export const useaddMessage = () => {
    return useMutation( 
        {
            mutationFn: addMessage,
            onSuccess(data){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getUzenetek]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const deleteMessage = async (ID: Number)=>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    console.log("ŐŐŐŐŐŐŐŐ ", ID)
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteMessage/${ID}`,config) // ${document.cookie}
    return response.data
}

export const usedeleteMessage = () => {
    return useMutation( 
        {
            mutationFn: deleteMessage,
            onSuccess(data){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getAllUzenetek]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}