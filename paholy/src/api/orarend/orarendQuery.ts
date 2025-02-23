import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Lesson } from "./orarend";
import { useErrorHandler } from "@/stores/errorHandler";

const getOrarend = async (): Promise<Lesson[]> => {
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
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey:[QUERY_KEYS.getOrarend],
        queryFn:getOrarend
    })
    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}


