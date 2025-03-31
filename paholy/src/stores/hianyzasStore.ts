import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Lesson } from '@/api/orarend/orarend'
import { fetchOrarend as simaFetch } from '@/api/orarend/orarendQuery'
import { fetchOrarend as szuloFetch } from '@/api/szulo/szuloQuery'
import { useCookieHandler } from './cookieHandler'

export const useHianyzasStore = defineStore('hianyzasSotre', () => {
    
    const lessons = ref<Lesson[]>([]);
    
    async function orarendfeltolt(weekStart: string) {
        const cookieHandler = useCookieHandler()
        const valasz = cookieHandler.hasValidCookie()
        if(valasz == false)
        {
            return
        }
        const role = cookieHandler.utolsoDecoded?.userData.role
        if(role=="szulo")
        {   
            lessons.value = await szuloFetch(weekStart);
        }
        else
        {
            lessons.value = await simaFetch(weekStart);
        }
    }
    return {orarendfeltolt,lessons}
})
