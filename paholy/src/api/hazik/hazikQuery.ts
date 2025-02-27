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
    console.log("általa kapott assignmentek:::")
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


const getAssignmentFiles = async (assignmentId:number) : Promise<number> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`/*,assignmentID:assignmentId*/ }
    };
    const response = await axiosClient.post(`http://localhost:3000/paholy/getAssignmentFiles`,{assignmentId} ,config)
    console.log("getAssignmentFiles RESPONSEEEEEEEEEEEE: ", response)
    return response.data
}
export const usegetAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: getAssignmentFiles,
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

const getCompletedAssignmentFiles = async (assignmentId:any[]) : Promise<any[]> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/paholy/getCompletedAssignmentFiles`,{assignmentId} ,config)
    console.log("getCompletedAssignmentFiles RESPONSEEEEEEEEEEEE: ", response)
    return response.data
}
export const usegetCompletedAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: getCompletedAssignmentFiles,
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
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.post(`http://localhost:3000/paholy/newassignment`,assignment,config) // ${document.cookie}
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

const uploadAssignmentFiles = async ({
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

export const useuploadAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: uploadAssignmentFiles,
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
    completedAssignmentId: any;
  }): Promise<void> => {
    const formData = new FormData();
  // Now we can loop over `files` directly
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
  await axiosClient.post(`http://localhost:3000/paholy/uploadcompletedassignmentfiles`, formData, config);
}

export const useuploadCompletedAssignmentFiles = () => {
    return useMutation( 
        {
            mutationFn: uploadCompletedAssignmentFiles,
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
