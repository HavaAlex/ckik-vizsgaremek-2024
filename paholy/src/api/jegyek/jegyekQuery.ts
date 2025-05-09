import axiosClient from "@/lib/axios"
import type { MarkAttribute, Mark, NewMark, GroupMark, Lesson, GroupMembers } from "./jegyek"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import queryClient from "@/lib/queryClient"
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"
import { useStatusHandler } from "@/stores/statusHandler"

const getMarks = async () : Promise<Mark[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/jegy/`,config)
    return response.data
}

export const fetchMarks = async (): Promise<Mark[]> => {
    try {
        return await getMarks();
    } catch (error) {
        console.error("Lekérdezési hiba:", error);
        throw error;
    }
}

export const useGetMarks = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getJegyek],
        queryFn: getMarks,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getTeacherGroups = async () : Promise<Mark[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/csoport/tanarcsoport`,config)
    return response.data
}

export const useGetTeacherGroups = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getTeacherGroups],
        queryFn: getTeacherGroups,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getGroupMarks = async () : Promise<GroupMark[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/jegy/csoportjegy/`,config)
    return response.data
}

export const useGetGroupMarks = () => {
   const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getGroupMarks],
        queryFn: getGroupMarks,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getGroupMembers = async () : Promise<GroupMembers[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/csoport/csoporttag`,config)
    return response.data
}

export const useGetGroupMembers = () => {

    const query = useQuery({
        queryKey: [QUERY_KEYS.getMembers],
        queryFn: getGroupMembers,
    })
    return query
}

const getSubjects = async () : Promise<Lesson[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/tanar/tantargy`,config)
    return response.data
}

export const useGetSubjects = () => {

    const query = useQuery({
        queryKey: [QUERY_KEYS.getSubjects],
        queryFn: getSubjects,
    })
    return query
}

const addMarks = async (data : Mark) : Promise<MarkAttribute> => {
    const {getCookie} = useCookieHandler()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + getCookie("alap")
        }
    } 
    const response = await axiosClient.post(`http://localhost:3000/jegy/`, data,config)
    return response.data.data
}

export const useAddMark = () => {  
     
    return useMutation(
        {
            mutationFn: addMarks,
            onSuccess(data) {
                queryClient.invalidateQueries({queryKey:[QUERY_KEYS.getGroupMarks]})
                const {setStatus} = useStatusHandler()
                setStatus("Sikeres jegy felvitel!")
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}
