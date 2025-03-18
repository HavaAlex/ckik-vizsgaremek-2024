import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import type { child } from "./szulo";
import { useErrorHandler } from "@/stores/errorHandler";
import { useGyerekStore } from "@/stores/gyerekStore";

const getChildren = async (): Promise<child[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/szulo/gyerek`,config) // ${document.cookie}
    return response.data
}

export const useGetChildren = () => {
    return useMutation(
        {
            mutationFn: getChildren,
            onSuccess(data) {
                console.log("FASU")
                console.log(data)
                const gyerekStore = useGyerekStore()
                gyerekStore.clearChildren()
                data.forEach(element => {
                    gyerekStore.addChild(element)
                });
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}


