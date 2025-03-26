import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import type { Teacher , Student, Guardian,CreatedGroup } from '@/api/admin/admin';
import { useCookieHandler } from "@/stores/cookieHandler";

//import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";


//Tanárok feltöltése
const addTeacherUsers = async (teachers: Teacher[]) : Promise<Teacher[]> => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addTeacherUsers`, teachers, config)
    return response.data
}

export const useaaddTeacherUsers = () => {
    return useMutation({
        mutationFn: addTeacherUsers,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//Diákok feltöltése
const addStudentUsers = async (students: Student[]) : Promise<Student[]> => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addStudentUsers`, students, config)
    return response.data
}

export const useaddStudentUsers = () => {
    return useMutation({
        mutationFn: addStudentUsers,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//Szülők/gondviselők feltöltése
const addGuardianUsers = async (guardians: Guardian[]) : Promise<Guardian[]> => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addGuardianUsers`, guardians, config)
    return response.data
}

export const useaddGuardianUsers = () => {
    return useMutation({
        mutationFn: addGuardianUsers,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//Felhasználó utólagos módosítása, adminra, studentre, teacherre és guardiannre egyaránt működik
const modifyUser = async (modifiedUser: any) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.put(`http://localhost:3000/admin/modifyUser`, modifiedUser, config)
    return response.data
}

export const usemodifyUser = () => {
    return useMutation({
        mutationFn: modifyUser,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//Összes felhasználó lekérése
const getUsers = async () => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getAllUsers`, config)
    return response.data
}

export const usegetUsers = () => {
    const { setError } = useErrorHandler()
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
// egy felhasználó lekérése
export const getUser = async (userID: number) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getUser/${userID}`, config)
    return response.data
}

export const usegetUser = () => {
    const { setError } = useErrorHandler()
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
//Felhasználó törlése
export const deleteUser = async (userID: number) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteUser/${userID}`, config)
    return response.data
}

export const usedeleteUser = () => {
    return useMutation({
        mutationFn: deleteUser,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//csoportok lekérése, a benne lévő studentekkel együtt
const getGroups = async () => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getAllGroupsWithStudents`, config)
    return response.data
}

export const usegetGroups = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getGroups],
        queryFn: getGroups,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}
//Csoport létrehozása, diákokkal együtt történik
const CreateGroup = async (newGroup: CreatedGroup)  => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/createGroup`, newGroup, config)
    return response.data
}

export const useCreateGroup = () => {
    return useMutation({
        mutationFn: CreateGroup,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getGroups] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}


//Felhasználók utólagos hozzáadása a csoporhoz
const AddUsersToGroup = async (newUsers: any) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addStudentsToGroup`, newUsers, config)
    return response.data
}

export const useAddUsersToGroup = () => {
    return useMutation({
        mutationFn: AddUsersToGroup,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getGroups] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//diákok utólagos hozzáadása a szülőhöz
const AddStudentsToGuardians = async (newStudentOMIDs: any) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    console.log("§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§")
    console.log(newStudentOMIDs.value)
    console.log("§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§")

    const response = await axiosClient.post(`http://localhost:3000/admin/addStudentsToGuardian`, newStudentOMIDs.value, config)
    return response.data
}

export const useAddStudentsToGuardians = () => {
    return useMutation({
        mutationFn: AddStudentsToGuardians,
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}

//Diák eltávolítása a csoportból (nem törli ki a felhasználót)
const deleteStudentGroup = async (ID: Number)=>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteStudentGroup/${ID}`,config) // ${document.cookie}
    return response.data
}

export const usedeleteStudentGroup = () => {
    return useMutation( 
        {
            mutationFn: deleteStudentGroup,
            onSuccess(data){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getGroups]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

//Csoport törlése (Nem törli ki a felhasználókat, de a kapcsolótábla adatait igen)
const deleteGroup = async (ID: Number)=>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteGroup/${ID}`,config) // ${document.cookie}
    return response.data
}

export const usedeleteGroup = () => {
    return useMutation( 
        {
            mutationFn: deleteGroup,
            onSuccess(data){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getGroups]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

//csoporthoz tartozó házifeladatok lekérése
export const getGroupAsignments = async (GroupID: Number) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getGroupAsignments/${GroupID}`, config)
    return response.data
}

export const usegetGroupAsignments = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getGroupAsignments],
        queryFn: getGroupAsignments,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}