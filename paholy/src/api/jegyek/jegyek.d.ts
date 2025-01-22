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
    mark: multiplier
}