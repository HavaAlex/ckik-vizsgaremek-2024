
export type SingleUserReceiver = {
    ID: number,
    username:string,
    role:string
}

export type GroupReceiver ={
    ID: number,
    name: string,
    studentList: number[]
}
export type PotentialReceivers = {
    groups: GroupReceiver[],
    singleUsers: SingleUserReceiver[]
}


export type Message={
    sender: any
    ID: number,
    date: Date,
    message: string,
    receivers:UserWithUserName[]
    senderUserName: UserWithUserName
    senderUserID: number
}
export type UserWithUserName ={
    ID: number,
    username:string
}

export type sentAndReceivedMessages = {
    elkuldott: Message[],
    kapott: Message[]
}

export type NewMessage={
    message: string,
    date: Date,
    receiverlist: Array
    receiverGrouplist: Array
}