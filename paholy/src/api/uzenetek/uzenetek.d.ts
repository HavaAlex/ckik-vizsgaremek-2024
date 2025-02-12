export type Message = {
    message: string,
    date: Date,
    receiverlist: Array,
    receiverGrouplist: Array
}

export type newMessage = {
    message: string,
    date: Date,
    receivers: FormData
}

export type PotentialReceiver = {
    ID: number,
    name: string,
    type: PotentialReciever, 
}

export type ChoosenReceivers = {
    ID:number
}