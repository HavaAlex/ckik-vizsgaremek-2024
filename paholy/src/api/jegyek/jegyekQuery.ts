import axiosClient from "@/lib/axios"
import type { MarkAttribute, Mark, NewMark, GroupMark } from "./jegyek"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import queryClient from "@/lib/queryClient"
import { useCookieHandler } from "@/stores/cookieHandler"

const getMarks = async () : Promise<Mark[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/jegyek`,config)
    return response.data
}

export const useGetMarks = () => {
    return useQuery(
        {
            
            queryKey: [QUERY_KEYS.getJegyek],
            queryFn: getMarks,
        }
    )
}

const getTeacherGroups = async () : Promise<Mark[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/tanar/csoportok`,config)
    return response.data
}

export const useGetTeacherGroups = () => {
    return useQuery(
        {
            
            queryKey: [QUERY_KEYS.getTeacherGroups],
            queryFn: getTeacherGroups,
        }
    )
}

const getGroupMarks = async () : Promise<GroupMark[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/tanar/csoportjegyek`,config)
    console.log("IIIT VVV")
    console.log(response.data)
    return response.data
}

export const usegetGroupMarks = () => {
    return useQuery(
        {
            
            queryKey: [QUERY_KEYS.getGroupMarks],
            queryFn: getGroupMarks,
        }
    )
}

const addMark = async (data : NewMark) : Promise<MarkAttribute> => {
    const {getCookie} = useCookieHandler()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + getCookie("alap")
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
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getJegyek]})
            },
        }
    )
}
