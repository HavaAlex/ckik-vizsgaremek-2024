import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import type { AlapOrarend } from "./orarend"
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Group } from "./orarend";


const getGroup = async (): Promise<Group> => {
    const config = {
        headers: { Authorization: `Bearer ${document.cookie}` }
    };
    console.log(`http://localhost:3000/paholy/orarend/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/paholy/orarend`,config) // ${document.cookie}
    console.log(response.data)  
    return response.data
}

export const useGetOrarend = () => {
    return useQuery( 
        {
            queryKey: [QUERY_KEYS.getOrarend], 
            queryFn: getGroup,
        }
    )
}