export type MarkAttribute = {
    StudentId: string,
    subject:string,
    mark: number,
    markmultiplier:  number,
}

export type MarksInSubject = {
    StudentId: string,
    subject:string,
    class:string,
    marks: []
}

export type NewMark = { 
    StudentId: string,
    subject: string,
    mark: number,
    markmultiplier:  number
}   