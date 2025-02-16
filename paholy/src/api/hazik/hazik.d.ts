export type Assignment = {
    Groups: Array,
    Description: string,
    DeadLine: Date,
}

export type HaziSender = {
    HaziId: number,
    ClassId: number,
    DeadLine: Date,
    Subject:string,
    Title: string,
    Description: string,
}