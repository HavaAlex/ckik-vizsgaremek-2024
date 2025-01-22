import axiosClient from "@/lib/axios"
import type { MarkAttribute, MarksInSubject, NewMark } from "./jegyek"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import queryClient from "@/lib/queryClient"



const getMarks = async () : Promise<MarksInSubject[]> => {
    let config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
    }
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/projects`,config)
    return response.data
}

export const useGetMarks = () => {
    return useQuery(
        {
            
            queryKey: [QUERY_KEYS.getMarks],
            queryFn: getMarks,
        }
    )
}

const addMark = async (data : NewMark) : Promise<MarkAttribute> => {
    let config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
    }
    const response = await axiosClient.post(`http://172.22.1.219/api/v1/projects`, data,config)
    return response.data.data
}

export const useAddMark = () => {
    
    return useMutation(
        {
            mutationFn: addMark,
            onSuccess(data) {
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getMarks]})
            },
        }
    )
}
