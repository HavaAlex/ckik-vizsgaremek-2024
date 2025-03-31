export type Assignment = {
    ID?: number, 
    Groups: any[],
    Description: string,
    DeadLine: Date,
    UploadDate: Date,
  };
  

export type FileList = {
    List: FormData[]
}

export type OpenAssignment = {
    ID: number,
    deadline: Date,
    desc: string,
    teacherID: number,
    uploadDate: Date
}

export type OpenCompletedAssignment = {
    ID: number,
    assignmentID: number,
    date: Date,
    status: string,
    studentID: number,
    textAnswer: string
}

export type THEULTIMATEASSIGNMENTTYPE = {
    assignment: OpenAssignment,
    answer: OpenCompletedAssignment
}
export type CompletedAssignmentInstance = {
    ID: number,
    assignmentID: Date,
    status: string,
    studentID: number,
    textAnswer
}

export type CompletedAssignmentInstance = {
    ID: number;
    assignmentID: number; 
    status: string;
    studentID: number;
    textAnswer: string;
};
