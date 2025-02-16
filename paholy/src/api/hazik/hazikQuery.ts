import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

//import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";

const getGroups = async ()  =>{
    //console.log("LEFUTOK: getGroups")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/hazikGroups`,config)
    /*console.log("apád:")
    console.log(response)
    console.log(response.data)*/
    return response.data
}
export const usegetGroups = () => {
    return useQuery (
        {
            queryKey: [QUERY_KEYS.getGroups], 
            queryFn: getGroups,
        }
    )
}