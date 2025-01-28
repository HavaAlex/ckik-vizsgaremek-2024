import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Message } from "./uzenetek";

const getUzenetek = async (): Promise<Message> => {
    const response = await axiosClient.get(`localhost:3000/uzenetek/`+document.cookie)
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