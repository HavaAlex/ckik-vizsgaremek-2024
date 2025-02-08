import type { EnumType } from "typescript"
enum PotentialTypes {
    group,
    tanar,
    diak,
    tanar,
    szulo
}
export type Message = {
    senderUserID: number,
    message: string,
    date: Date,
}

export type PotentialReciever = {
    ID: number,
    name: string,
    type: PotentialReciever, 
}