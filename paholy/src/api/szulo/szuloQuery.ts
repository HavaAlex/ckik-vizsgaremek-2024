import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { useCookieHandler } from "@/stores/cookieHandler";
import type { child } from "./szulo";
import { useErrorHandler } from "@/stores/errorHandler";
import { useGyerekStore } from "@/stores/gyerekStore";
import type { Lesson } from "../orarend/orarend";
import type { Mark } from "../jegyek/jegyek";

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

const getOrarend = async (weekStart: string): Promise<Lesson[]> => {
    const { getCookie } = useCookieHandler()
    const {params} = useRoute()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/orarend/${params.id}/?weekStart=${weekStart}`, config)
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

const getMarks = async () : Promise<Mark[]> => {
    const {getCookie} = useCookieHandler()
    const {params} = useRoute()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/jegy/${params.id}`,config)
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