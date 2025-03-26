import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Lesson } from '@/api/orarend/orarend'
import { fetchMarks as simaFetch } from '@/api/jegyek/jegyekQuery'
import { fetchMarks as szuloFetch } from '@/api/szulo/szuloQuery'
import { useCookieHandler } from './cookieHandler'
import type { Mark } from '@/api/jegyek/jegyek'

export const useJegyStore = defineStore('jegyStore', () => {
    
    const marks = ref<Mark[]>([]);
    
    async function jegyFeltolt() { //MÁSOLANDÓ
        const cookieHandler = useCookieHandler()
        const valasz = cookieHandler.hasValidCookie()
        if(valasz == false)
        {
            return
        }
        const role = cookieHandler.utolsoDecoded?.userData.role
        if(role=="szulo")
        {   
            marks.value = await szuloFetch();
        }
        else
        {
            marks.value = await simaFetch();
        }
    }
    return {jegyFeltolt,marks}
})
