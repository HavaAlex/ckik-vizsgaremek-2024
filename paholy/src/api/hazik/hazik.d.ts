export type Assignment = {
    Groups: Array,
    Description: string,
    DeadLine: Date,
    UploadDate: Date,
}

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

export type CompletedAssignmentInstance = {
    ID: number,
    assignmentID: Date,
    status: string,
    studentID: number,
    textAnswer
}
