import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import type { AlapOrarend } from "./orarend"
import { useCookieHandler } from "@/stores/cookieHandler";

const getOrarend = async (): Promise<AlapOrarend> => {
    const response = await axiosClient.get(`http://localhost:3000/orarend/`+document.cookie)
    return response.data
}
export const useGetOrarend = () => {
    return useQuery( 
        {
            queryKey: [QUERY_KEYS.getOrarend], 
            queryFn: getOrarend,
        }
    )
}