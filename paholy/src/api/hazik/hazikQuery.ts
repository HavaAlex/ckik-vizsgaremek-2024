import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode } from "jwt-decode";
import type { Assignment , OpenCompletedAssignment} from '@/api/hazik/hazik';
import { useCookieHandler } from "@/stores/cookieHandler";

//import type { Message,PotentialReceiver,newMessage } from "./uzenetek";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";

const getAssignmentsTeacher = async ()  =>{
    //console.log("LEFUTOK: getGroups")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/haziktanar`,config)
    console.log("általa kiküldött assignmentek:::")
    console.log(response)
    console.log(response.data)
    console.log("AZ első eleme természetesen nem més mint : ")
    console.log(response.data[0])
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

const getAssignmentsStudent = async ()  =>{
    //console.log("LEFUTOK: getGroups")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/hazikdiak`,config)
    console.log("általa kiküldött assignmentek:::")
    console.log(response)
    console.log(response.data)
    console.log("AZ első eleme természetesen nem més mint : ")
    console.log(response.data[0])
    return response.data
}
export const usegetAssignmentsStudent = () => {
    const {setError} = useErrorHandler()
    const query = useQuery({
        queryKey: [QUERY_KEYS.getAssignmentsStudent],
        queryFn: getAssignmentsStudent,
    })

    if (query.error.value) {
        console.error("Lekérdezési hiba:", query.error)
        setError(query.error.value)
    }
    return query
}

/*
const getAssignmentFiles = async ()  =>{
    //console.log("LEFUTOK: getGroups")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/hazikfileoktanar`,config)
    return response.data
}
export const usegetAssignmentFiles = () => {
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
}*/


const getGroups = async ()  =>{
    //console.log("LEFUTOK: getGroups")
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get(`http://localhost:3000/paholy/hazikGroups`,config)
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
    console.log("ÚJVERZIÓ ")
    console.log(completedassignment)
    console.log(completedassignment.date)
    const response = await axiosClient.patch(`http://localhost:3000/paholy/modifycompletedassignment`,completedassignment,config) // ${document.cookie}
    return response.data
}

export const usemodifyCompletedAssignment = () => {
    return useMutation( 
        {
            mutationFn: modifyCompletedAssignment,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.modifyCompletedAssignment]})
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
    console.log("GROPS_")
    console.log(assignment.Groups)
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/paholy/newassignment`,assignment,config) // ${document.cookie}
    console.log("resposééééééé_")
    console.log(response)
    return response.data
}

export const useaddAssignment = () => {
    return useMutation( 
        {
            mutationFn: addAssignment,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.postAssignment]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const uploadFiles = async ({
    files,
    assignmentId,
  }: {
    files: File[];
    assignmentId: string;
  }): Promise<void> => {
    const formData = new FormData();

  // Now we can loop over `files` directly
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

  await axiosClient.post(`http://localhost:3000/paholy/uploadassignmentfiles`, formData, config);
}

export const useUploadFiles = () => {
    return useMutation( 
        {
            mutationFn: uploadFiles,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.postAssignment]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    ) 
};
