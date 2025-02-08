const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset'
}

const ORAREND_KEYS = {
    getOrarend: 'getOrarend',
}

const UZENETEK_KEYS = {
    getUzenetek: 'getUzenetek',
    getPotentialReceivers: 'getPotentialReceivers'
}

const HIANYZASOK_KEYS = {
    getHianyzasok: 'getHianyzasok',
}
const JEGYEK_KEYS = {
    getMarks: 'getMarks',
}
export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...ORAREND_KEYS,
    ...UZENETEK_KEYS,
    ...HIANYZASOK_KEYS,
    ...JEGYEK_KEYS,
} as const 