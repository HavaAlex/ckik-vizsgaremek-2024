export type HaziRecievers = {
    HaziId: number,
    StudentId: number,
    DeadLine: Date,
    Subject:string,
    Sender: string,
    Title: string,
    Description: Text,
}

export type HaziSender = {
    HaziId: number,
    ClassId: number,
    DeadLine: Date,
    Subject:string,
    Title: string,
    Description: string,
}