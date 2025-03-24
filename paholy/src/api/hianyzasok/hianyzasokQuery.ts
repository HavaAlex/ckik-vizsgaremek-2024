import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { Hianyzas, Lesson, Teacher, GroupMembers } from "./hianyzasok";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";

const getHianyzasok = async (): Promise<Hianyzas> => {
    console.log("LEFUTOK")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    //console.log(`localhost:3000/uzenetek/${document.cookie}`)
    const response = await axiosClient.get(`http://localhost:3000/hianyzas/`,config)
    return response
}
export const useGetHianyzasok =  () => {
    const {setError} = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getHianyzasok],
        queryFn: getHianyzasok,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getLessons = async (): Promise<Lesson> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };

    const response = await axiosClient.get(`http://localhost:3000/orarend/getLessons`,config)

    return response.data
}
export const useGetLessons = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getLessons],
        queryFn: () => getLessons(),
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}


const getTeachers = async (): Promise<Teacher> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/orarend/getTeachers`,config)
    console.log(response.data)
    return response.data
}
export const useGetTeachers = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getTeachers],
        queryFn: getTeachers,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query  
}


const getStudentsInGroup = async (groupID: number): Promise<Lesson[]> => {
    console.log("Itt kellene Indulnia2")
    const { getCookie } = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/hianyzas/getStudentsInGroup/${groupID}`, config);


    console.log("Itt kellene lennie de nincs")
    console.log(response.data)

    return response.data
}

export const useGetStudentsInGroup = (groupID: number) => {
    console.log("Itt kellene Indulnia1")
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getAllUzenetek, groupID],
        queryFn: () => {
            console.log("Itt kellene meghívódnia a queryFn-nek")
            return getStudentsInGroup(groupID)
        },
        enabled: !!groupID, // Prevents running when groupID is undefined
        retry: 0, // Disable automatic retries to see errors clearly
        staleTime: 0, // Forces React Query to refetch every time
    })

    if (query.error?.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }

    return query
}

