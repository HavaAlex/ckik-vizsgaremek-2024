export type MarkAttribute = {
    StudentId: number,
    subject:string,
    mark: number,
    markmultiplier:  number,
}

export type MarksInAllSubjects = {
    StudentId: number,
    StudentName: string,
    class: string,
    AllMarks: []
}

export type Marks = { //belemegy a MarksInAllSubjects
    data:Mark[]
}

export type Mark = {
    ID: number,
    teacherID: number,
    studentID: number,
    Value: number,
    Multiplier: number,
    subjectName: string,
    date:string
}

export type NamedMark = {
    ID: number,
    teacherID: number,
    studentID: number,
    Value: number,
    Multiplier: number,
    subjectName: string,
    date:string
    studentName:string
}

export type NewMark = { 
    StudentId: number,
    subject: string,
    mark: number,
    markmultiplier:  number,
}   

export type DeleteMark = {
    MarkId: number,
}

export type ModifyMark = {
    MarkId: number,
    NewValue: number,
    newModifier: number,
}

export type GroupMark ={
    groupName:string,
    marks:Mark[][],
    tantargyak:Array
}

export type GroupMember ={
    ID:string,
    name:string,
    DoB:string,
    address:string,
    phone:string,
    email:string,
    userId:number
}

export type GroupMembers ={
    groupName:string,
    members:GroupMember[],
}

export type Lesson ={
    
    ID:number,
    groupID:number,
    teacherID:number,
    start_Hour:number,
    start_Minute:number,
    length:number,
    day:string,
    subjectName:string,
}