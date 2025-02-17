import axiosClient from "@/lib/axios"
import type { MarkAttribute, Mark, NewMark, GroupMark, GroupMember, Lesson, GroupMembers } from "./jegyek"
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

const getGroupMembers = async () : Promise<GroupMembers[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/tanar/csoporttagok`,config)
    console.log("IIIT VVV")
    console.log(response.data)
    return response.data
}

export const useGetGroupMembers = () => {
    return useQuery(
        {
            
            queryKey: [QUERY_KEYS.getMembers],
            queryFn: getGroupMembers,
        }
    )
}

const getSubjects = async () : Promise<Lesson[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/tanar/tantargyak`,config)
    console.log("IIIT VVV")
    console.log(response.data)
    return response.data
}

export const useGetSubjects = () => {
    return useQuery(
        {
            
            queryKey: [QUERY_KEYS.getSubjects],
            queryFn: getSubjects,
        }
    )
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
    const response = await axiosClient.post(`http://localhost:3000/tanar/jegy`, data,config)
    return response.data.data
}

export const useAddMark = () => {  
     
    return useMutation(
        {
            mutationFn: addMarks,
            onSuccess(data) {
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.postJegyek]})
                console.log(data)
                alert("Sikeres adat felvitel!")
            },
        }
    )
}
