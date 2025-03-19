import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { child } from '@/api/szulo/szulo'
import { useGetChildren } from '@/api/szulo/szuloQuery'

export const useGyerekStore = defineStore('gyerekStore', () => {
  const children = ref<child[]>([])
  function addChild(data:child) {
    children.value.push(data)
    console.log(children)
  }
  function clearChildren(){
    children.value = []
  }

  return { addChild,clearChildren,children }
})
