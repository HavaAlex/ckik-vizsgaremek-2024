import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler";
import { useStatusHandler } from "@/stores/statusHandler"
import type { Hianyzas, Lesson, Teacher, Absence, Students } from "./hianyzasok";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";
import type { Student } from "../admin/admin";

const getHianyzasok = async (): Promise<Hianyzas|Error> => {
    console.log("LEFUTOK: hianyzas")
    const cookieHandler= useCookieHandler()
    const vanE = cookieHandler.hasValidCookie()
    const route = useRoute()
    if(vanE == false)
    {
        return new Error("Lejárt a munkamenet!")
    }
    const config = {
        headers: { Authorization: `Bearer ${ cookieHandler.getCookie("alap")}` }
    };
    const response = await axiosClient.get(cookieHandler.utolsoDecoded?.userData.role == "szulo"?`http://localhost:3000/hianyzas/${route.params.id}` :`http://localhost:3000/hianyzas`,config)
    return response.data
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


const getStudentsInGroup = async (groupID: number): Promise<Students[]> => {
    console.log("Itt kellene Indulnia2")

    //tudom hogy csunya
    console.log(groupID.value)
    const { getCookie } = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/hianyzas/getStudentsInGroup/${groupID.value}`, config);

    console.log(response.data)

    return response.data
}

export const useGetStudentsInGroup = (groupID: number) => {
    console.log("Itt kellene Indulnia1")
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getStudentsInGroup, groupID],
        queryFn:() => getStudentsInGroup(groupID),
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query  
}

const addAbsence = async (data : Absence) : Promise<Absence> => {
    console.log("FELKÜLDÉS")
    const {getCookie} = useCookieHandler()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + getCookie("alap")
        }
    } 
    const response = await axiosClient.post(`http://localhost:3000/hianyzas/postAbsence`, data,config)

    console.log(response.data)
    return response.data.data
}

export const useAddAbsence = () => {  
     
    return useMutation(
        {
            mutationFn: addAbsence,
            onSuccess(data) {
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.postAbsence]})
                console.log(data)
                const {setStatus} = useStatusHandler()
                setStatus("Sikeres hiányzás felvitel!")
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}


export const getAbsences = async () => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/hianyzas/getAllAbsences`, config)
    return response.data
}

export const useGetAbsences = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getAbsences],
        queryFn: getAbsences,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

