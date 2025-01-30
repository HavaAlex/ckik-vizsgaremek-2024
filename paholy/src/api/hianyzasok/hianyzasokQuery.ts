import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { HianyzasValasz } from "./hianyzasok";
import queryClient from "@/lib/queryClient";

const getHianyzasok = async (): Promise<HianyzasValasz> => {
    console.log("LEFUTOK")
    const config = {
        headers: { Authorization: `Bearer ${document.cookie}` }
    };
    //console.log(`localhost:3000/uzenetek/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/paholy/hianyzasok`,config) // ${document.cookie}
    console.log(response)
    console.log(response.data)  
    return response
}
export const useGetHianyzasok = () => {
    return useQuery( 
        {
            queryKey: [QUERY_KEYS.getHianyzasok], 
            queryFn: getHianyzasok,
        }
    )
}