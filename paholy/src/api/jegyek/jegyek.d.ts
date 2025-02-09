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