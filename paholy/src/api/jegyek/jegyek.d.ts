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

export type MarksInSubject = { //belemegy a MarksInAllSubjects
    subject:string,
    marks:[
        {
            value: number,
            multiplier: number,
        }
    ]
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