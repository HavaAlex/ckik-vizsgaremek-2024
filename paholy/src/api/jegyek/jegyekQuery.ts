import axiosClient from "@/lib/axios"
import type { MarkAttribute, Mark, NewMark, GroupMark, GroupMember, Lesson, GroupMembers } from "./jegyek"
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

const getGroupMarks = async () : Promise<GroupMark[]|Error> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    try{
        const response = await axiosClient.get(`http://localhost:3000/jegy/csoportjegy`,config)
        console.log("IIIT VVV")
        console.log(response.data)
        return response.data
    }
    catch(error:any){//annyira jó a typescript hogy erre kényszerít
        return error
    }
}

export const usegetGroupMarks = () => {
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
    console.log("IIIT VVV")
    console.log(response.data)
    return response.data
}

export const useGetGroupMembers = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getMembers],
        queryFn: getGroupMembers,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getSubjects = async () : Promise<Lesson[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/tanar/tantargy`,config)
    console.log("IIIT VVV")
    console.log(response.data)
    return response.data
}

export const useGetSubjects = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getSubjects],
        queryFn: getSubjects,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }

    return query
}

const addMarks = async (data : Mark) : Promise<MarkAttribute> => {
    console.log("FELKÜLDÉS")
    //console.log(data)
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
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getJegyek]})
                console.log(data)
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
