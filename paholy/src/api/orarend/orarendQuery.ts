import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Group } from "./orarend";


const getGroup = async (): Promise<Group> => {
    const config = {
        headers: { Authorization: `Bearer ${document.cookie.split(";")[0]}` }
    };
    //console.log(`http://localhost:3000/paholy/orarend/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/paholy/orarend`,config) // ${document.cookie}
    //console.log(response.data)  
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
                console.log(error)
            },
        }
    )
}


