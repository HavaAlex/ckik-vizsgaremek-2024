import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Lesson } from '@/api/orarend/orarend'
import { fetchOrarend as simaFetch } from '@/api/orarend/orarendQuery'
import { fetchOrarend as szuloFetch } from '@/api/szulo/szuloQuery'
import { fetchOrarend as adminFetch } from '@/api/admin/adminQuery'
import { useCookieHandler } from './cookieHandler'

export const useOrarendStore = defineStore('orarendStore', () => {
    
    const lessons = ref<Lesson[]>([]);
    
    async function orarendfeltolt(weekStart: string) { //MÁSOLANDÓ
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
    async function orarendfeltoltAdmin(weekStart: string,csoportID:number) { //MÁSOLANDÓ
        const cookieHandler = useCookieHandler()
        const valasz = cookieHandler.hasValidCookie()
        if(valasz == false)
        {
            return
        }
        lessons.value = await adminFetch(weekStart,csoportID);
    }
    return {orarendfeltolt,orarendfeltoltAdmin,lessons}
})
