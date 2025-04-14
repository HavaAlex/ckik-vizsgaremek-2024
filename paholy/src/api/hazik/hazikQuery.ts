import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import {useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import type { Assignment , OpenCompletedAssignment} from '@/api/hazik/hazik';
import { useCookieHandler } from "@/stores/cookieHandler";


import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";

//házik lekérése tanár oldalról
const getAssignmentsTeacher = async ()  =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/feladat/haziktanar`,config)
    return response.data
}
export const usegetAssignmentsTeacher = () => {
    const {setError} = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getAssignmentsTeacher],
        queryFn: getAssignmentsTeacher,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}
//házik lekérése diák oldalról
const getAssignmentsStudent = async ()  =>{
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
 
    const response = await axiosClient.get(cookieHandler.utolsoDecoded?.userData.role == "szulo"?`http://localhost:3000/feladat/hazikdiak/${route.params.id}` :`http://localhost:3000/feladat/hazikdiak`,config)
    return response.data
}
export const usegetAssignmentsStudent = () => {
    const {setError} = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getAssignmentsStudent],
        queryFn:getAssignmentsStudent,})

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

const getAssignmentFiles = async (assignmentId:number) : Promise<any[]> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` ,assignmentid: assignmentId}
    };
    const response = await axiosClient.get(`http://localhost:3000/feladat/getAssignmentFiles/`,config)
    return response.data
}
export const usegetAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: getAssignmentFiles,
            mutationKey: [QUERY_KEYS.getAssignmentFiles],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getAssignmentFiles]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
};

const getCompletedAssignmentFiles = async (assignmentId: number[]) : Promise<any[]|Error> => {

    const cookieHandler= useCookieHandler()
    const vanE = cookieHandler.hasValidCookie()
    if(vanE == false)
    {
        return new Error("Lejárt a munkamenet!")
    }
    const config = {
        headers: { Authorization: `Bearer ${ cookieHandler.getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/feladat/getCompletedAssignmentFiles`,assignmentId,config)
    return response.data
}
export const usegetCompletedAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: getCompletedAssignmentFiles,
            mutationKey: [QUERY_KEYS.getCompletedAssignmentFiles],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getCompletedAssignmentFiles]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
};

const getGroups = async ()  =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/feladat/hazikGroups`,config)
    return response.data
}
export const usegetGroups = () => {
    const {setError} = useErrorHandler()
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

const modifyCompletedAssignment = async (completedassignment:OpenCompletedAssignment) : Promise<OpenCompletedAssignment> =>{
    completedassignment.date = new Date();
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.patch(`http://localhost:3000/feladat/modifycompletedassignment`,completedassignment,config) // ${document.cookie}
    return response.data
}
export const usemodifyCompletedAssignment = () => {
    return useMutation( 
        {
            mutationFn: modifyCompletedAssignment,
            mutationKey: [QUERY_KEYS.modifyCompletedAssignment],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getAssignmentsStudent]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const addAssignment = async (assignment: Assignment) : Promise<Assignment> =>{
    assignment.UploadDate = new Date();
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/feladat/newassignment`,assignment,config) // ${document.cookie}

    return response.data
}
export const useaddAssignment = () => {
    return useMutation( 
        {
            mutationFn: addAssignment,
            mutationKey: [QUERY_KEYS.addAssignment],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getAssignmentsTeacher]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const deleteAssignment = async (assignmentId: number) : Promise<number> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.delete(`http://localhost:3000/feladat/deleteAssignment/${assignmentId}`,config) // ${document.cookie} //nem jó sajna delete csak 2 vel működik
    return response.data
}
export const usedeleteAssignment = () => {
    return useMutation( 
        {
            mutationFn: deleteAssignment,
            mutationKey: [QUERY_KEYS.deleteAssignment],
            onSuccess(){
                const {getCookie} = useCookieHandler()
                const decoded = jwtDecode(getCookie("alap"));
                const role = decoded.userData.role;
                if(role === 'admin'){
                    queryClient.refetchQueries({queryKey:[QUERY_KEYS.getGroupAsignments]})
                }
                else if(role === 'tanar'){
                    queryClient.refetchQueries({queryKey:[QUERY_KEYS.getAssignmentsTeacher]})
                }
                
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const deleteAnswerFile = async (fileId: number) : Promise<number> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.delete(`http://localhost:3000/feladat/deleteAnswerFile/${fileId}`,config)
    return response.data
}
export const usedeleteAnswerFile = () => {
    return useMutation( 
        {
            mutationFn: deleteAnswerFile,
            mutationKey: [QUERY_KEYS.deleteAnswerFile],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.deleteAnswerFile]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const uploadAssignmentFiles = async ({
    files,
    assignmentId,
  }: {
    files: File[];
    assignmentId: string;
  }): Promise<void> => {
    const formData = new FormData();


  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('assignmentId', assignmentId);

  const { getCookie } = useCookieHandler();
  const config = {
    headers: { 
      Authorization: `Bearer ${getCookie("alap")}`,
      "Content-Type": "multipart/form-data"
    }
  };
  await axiosClient.post(`http://localhost:3000/feladat/uploadassignmentfiles`, formData, config);
}
export const useuploadAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: uploadAssignmentFiles,
            mutationKey: [QUERY_KEYS.uploadAssignmentFiles],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.uploadAssignmentFiles]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    ) 
};


const uploadCompletedAssignmentFiles = async ({
    files,
    completedAssignmentId,
  }: {
    files: File[];
    completedAssignmentId: string | Blob;
  }): Promise<void> => {
    const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('completedAssignmentId', completedAssignmentId);
  const { getCookie } = useCookieHandler();
  const config = {
    headers: { 
      Authorization: `Bearer ${getCookie("alap")}`,
      "Content-Type": "multipart/form-data"
    }
  };
  await axiosClient.post(`http://localhost:3000/feladat/uploadcompletedassignmentfiles`, formData, config);
}
export const useuploadCompletedAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: uploadCompletedAssignmentFiles,
            mutationKey: [QUERY_KEYS.uploadCompletedAssignmentFiles],
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.uploadCompletedAssignmentFiles]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    ) 
};
