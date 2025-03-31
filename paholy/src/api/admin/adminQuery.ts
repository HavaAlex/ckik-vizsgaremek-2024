import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import type { Teacher , Student, Guardian,CreatedGroup, Disruption, User,SelectedUser } from '@/api/admin/admin';
import { useCookieHandler } from "@/stores/cookieHandler";

//import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";
import type { Group, Lesson } from "../orarend/orarend";
import { useStatusHandler } from "@/stores/statusHandler";


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
        mutationKey: [QUERY_KEYS.addTeacherUsers],
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getUsers] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}

//Összes diák lekérése a hiányzások igazolásához
const getStudents = async () => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getAllStudents`, config)
    return response.data
}

export const useGetStudents = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getStudents],
        queryFn: getStudents,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
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
        mutationKey: [QUERY_KEYS.addStudentUsers],
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
        mutationKey: [QUERY_KEYS.addGuardianUsers],
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
        mutationKey: [QUERY_KEYS.modifyUser],
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
const getUsers = async (): Promise<User[]> => {

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
// egy felhasználó adatainak lekérése
export const getUser = async (userID: number): Promise<SelectedUser> => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getUser/${userID}`, config)
    return response.data
}

export const usegetUser = (userID: number) => {
    const { setError } = useErrorHandler();
    const query = useQuery({
        queryKey: [QUERY_KEYS.getUser, userID],
        queryFn: () => getUser(userID),
    });

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error);
        setError(query.error.value);
    }
    return query;
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
        mutationKey: [QUERY_KEYS.deleteUser],
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
        mutationKey: [QUERY_KEYS.CreateGroup],
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
        mutationKey: [QUERY_KEYS.AddUsersToGroup],
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
    const response = await axiosClient.post(`http://localhost:3000/admin/addStudentsToGuardian`, newStudentOMIDs.value, config)
    return response.data
}

export const useAddStudentsToGuardians = () => {
    return useMutation({
        mutationFn: AddStudentsToGuardians,
        mutationKey: [QUERY_KEYS.AddStudentsToGuardians],
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
            mutationKey: [QUERY_KEYS.deleteStudentGroup],
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
            mutationKey: [QUERY_KEYS.deleteGroup],
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

export const usegetGroupAsignments = (GroupID: number) => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryFn: () => getGroupAsignments(GroupID),
        queryKey: [QUERY_KEYS.getGroupAsignments],

    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getOrarend = async (weekStart: string,groupID:number): Promise<Lesson[]> => {
    const { getCookie } = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/timetable/${groupID}?weekStart=${weekStart}`, config)

    return response.data
}

export const useGetOrarend = (weekStart: string,groupID:number) => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getTimetable],
        queryFn: () => getOrarend(weekStart,groupID),
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

export const fetchOrarend = async (weekStart: string,groupID:number): Promise<Lesson[]> => {
    try {
        return await getOrarend(weekStart,groupID);
    } catch (error) {
        console.error("Lekérdezési hiba:", error);
        throw error;
    }
}

const getAllGroups = async (): Promise<Group[]> => {
    const { getCookie } = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };

    const response = await axiosClient.get(`http://localhost:3000/admin/allgroups`, config)

    return response.data
}

export const useGetAllGroups = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getAllGroups],
        queryFn: () => getAllGroups(),
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

//órák feltöltése
const addLessons = async (lessons: Lesson[]) : Promise<Lesson[]> => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/addLessons`, lessons, config)
    return response.data
}

export const useAddLessons = () => {
    return useMutation({
        mutationFn: addLessons,
        mutationKey: [QUERY_KEYS.addLessons],
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getTimetable] })
            const {setStatus} = useStatusHandler()
            setStatus("Sikeres óra felvitel!")
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}

const getAllTeachers = async (): Promise<Teacher[]> => {
    const { getCookie } = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/allteachers`, config)

    return response.data
}

export const useGetAllTeachers = () => {
    const { setError } = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getAllTeachers],
        queryFn: () => getAllTeachers(),
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

//Óra törlése
const deleteLesson = async (ID: Number)=>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteLesson/${ID}`,config) // ${document.cookie}
    return response.data
}

export const useDeleteLesson = () => {
    return useMutation( 
        {
            mutationFn: deleteLesson,
            mutationKey: [QUERY_KEYS.deleteLesson],
            onSuccess(data){
                queryClient.invalidateQueries({queryKey:[QUERY_KEYS.getTimetable]})
                const {setStatus} = useStatusHandler()
                setStatus("Sikeres óra törlés!")
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const modifyLesson = async (modifedLesson: Lesson) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/admin/modifyLesson`, modifedLesson, config)
    return response.data
}

export const useModifyLesson = () => {
    return useMutation({
        mutationFn: modifyLesson,
        mutationKey: [QUERY_KEYS.modifyLesson],
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getTimetable] })
            const {setStatus} = useStatusHandler()
            setStatus("Sikeres óra módosítás!")
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}
//helyettesítés beírása
const addDisruption = async (disruption: Disruption) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.put(`http://localhost:3000/admin/addDisruption`, disruption, config)
    return response.data
}

export const useAddDisruption = () => {
    return useMutation({
        mutationFn: addDisruption,
        mutationKey: [QUERY_KEYS.addDisruption],
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getTimetable] })
            const {setStatus} = useStatusHandler()
            setStatus("Sikeres óra módosítás!")
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}

export const getAbsences = async () => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/admin/getAbsences`, config)
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


export const deleteAbsence = async (absenceID: number) => {

    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.delete(`http://localhost:3000/admin/deleteAbsence/${absenceID}`, config)
    return response.data
}

export const useDeleteAbsence = () => {
    return useMutation({
        mutationFn: deleteAbsence,
        mutationKey: [QUERY_KEYS.useDeleteAbsence],
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.deleteAbsence] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}


const modifyAbsence = async (absenceToBeModified: any) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.put(`http://localhost:3000/admin/modifyAbsence`, absenceToBeModified, config)

    return response.data
}

export const useModifyAbsence = () => {
    return useMutation({
        mutationFn: modifyAbsence,
        mutationKey: [QUERY_KEYS.useModifyAbsence],
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.modifyAbsence] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}