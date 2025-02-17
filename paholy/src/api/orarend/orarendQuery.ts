import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Group } from "./orarend";

const getGroup = async (): Promise<Group> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    //console.log(`http://localhost:3000/paholy/orarend/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/paholy/orarend`,config) // ${document.cookie}
    console.log(response.data)  
    return response.data
}

export const useGetOrarend = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: getGroup,
            onSuccess(data) {
                console.log(data)
            },
            onError(error) {
                
            },
        }
    )
}


