import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { useCookieHandler } from "@/stores/cookieHandler";
import type { Lesson, Teacher } from "./orarend";
import { useErrorHandler } from "@/stores/errorHandler";

const getOrarend = async (weekStart: string): Promise<Lesson[]> => {
    const { getCookie } = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/orarend?weekStart=${weekStart}`, config)

    return response.data
}

export const useGetOrarend = (weekStart: string) => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getOrarend, weekStart],
        queryFn: () => getOrarend(weekStart),
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

export const fetchOrarend = async (weekStart: string): Promise<Lesson[]> => {
    try {
        return await getOrarend(weekStart);
    } catch (error) {
        console.error("Lekérdezési hiba:", error);
        throw error;
    }
}


const getTeachers = async (): Promise<Teacher[]> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/orarend/getTeachers`,config)
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
