import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";

import type { Hianyzas, Lesson, Teacher } from "./hianyzasok";
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
