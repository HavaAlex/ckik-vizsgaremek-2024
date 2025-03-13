import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import type { Teacher , Student, Guardian} from '@/api/admin/admin';
import { useCookieHandler } from "@/stores/cookieHandler";

//import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";


const addTeacherUsers = async (teachers: Teacher[]) : Promise<Teacher[]> =>{
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addTeacherUsers`,teachers,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const useaaddTeacherUsers= () => {
    return useMutation( 
        {
            mutationFn: addTeacherUsers,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.addTeacherUsers]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const addStudentUsers = async (students: Student[]) : Promise<Student[]> =>{
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/paholy/addStudentUsers`,students,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const useaddStudentUsers= () => {
    return useMutation( 
        {
            mutationFn: addStudentUsers,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.addStudentUsers]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const addGuardianUsers = async (guardians: Guardian[]) : Promise<Guardian[]> =>{
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/paholy/addGuardianUsers`,guardians,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const useaddGuardianUsers= () => {
    return useMutation( 
        {
            mutationFn: addGuardianUsers,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.addStudentUsers]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const modifyUser = async (modifiedUser : any) => {
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.put(`http://localhost:3000/paholy/modifyUser`,modifiedUser,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const usemodifyUser= () => {
    return useMutation( 
        {
            mutationFn: modifyUser,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.modifyUser]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const getUsers = async () => {
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/getAllUsers`,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const usegetUsers = () => {
    const {setError} = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getUsers],
        queryFn: getUsers,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

export const getUser = async (userID: number) => {
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`}
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/getUser/${userID}`,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const usegetUser = () => {
    const {setError} = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getUser],
        queryFn: getUser,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}


export const deleteUser = async (userID: number) => {
    const {getCookie} = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`}
    };
    const response = await axiosClient.delete(`http://localhost:3000/paholy/deleteUser/${userID}`,config) // ${document.cookie}
    console.log("admin response: \n",response);
    console.log("admin response data: \n",response.data)
    return response.data
}

export const usedeleteUser = () => {
    return useMutation( 
        {
            mutationFn: deleteUser,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.deleteUser]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}
