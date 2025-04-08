import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { Message,PotentialReceivers,sentAndReceivedMessages,NewMessage} from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";



const getUzenetek = async (): Promise<sentAndReceivedMessages> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/uzenet/`,config) // ${document.cookie}
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
 
const getAllUzenetek = async (): Promise<Message[]> => {
    const { getCookie } = useCookieHandler();
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const decoded = jwtDecode(getCookie("alap"));
    const role = decoded.userData.role;

    if (role === 'admin') {
        const response = await axiosClient.get(`http://localhost:3000/admin/allMessage`, config);
        return response.data;
    } else {
        // meglepi annak aki keménynek hiszi magát
        const dummyMessage: Message = {
            ID: 0,
            date: new Date(),
            message: "Ez egy példa üzenet. ",
            sender: { ID: 0, username: "example_sender" },
            senderUserID: 0,
            senderUserName: { ID: 0, username: "example_sender" },
            receivers: [
                {
                    ID: 1,
                    username: "example_receiver"
                }
            ]
        };
        return [dummyMessage];
    }
};

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
const getPotentialReceivers = async (): Promise<PotentialReceivers> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/uzenet/uzenetekreceivers`,config)
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

const addMessage = async (data: NewMessage) : Promise<NewMessage> =>{
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
//Üzenet törlése (Kizárólag rendszergazdák számára) (kitörli a kapcsolótábla adatait is)
const deleteMessage = async (ID: Number)=>{ 
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteMessage/${ID}`,config) // ${document.cookie}
    return response.data
}

export const usedeleteMessage = () => {
    return useMutation( 
        {
            mutationFn: deleteMessage,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getAllUzenetek]})
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getUzenetek]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}