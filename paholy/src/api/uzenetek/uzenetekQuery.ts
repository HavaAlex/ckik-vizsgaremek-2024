import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Message } from "./uzenetek";

const getUzenetek = async (): Promise<Message> => {
    console.log("LEFUTOK")
    const config = {
        headers: { Authorization: `Bearer ${document.cookie}` }
    };
    //console.log(`localhost:3000/uzenetek/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/paholy/uzenetek`,config) // ${document.cookie}
    console.log(response)
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