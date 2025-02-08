<script setup lang="ts">
  import { ref } from 'vue'
  import type {Message } from '@/api/uzenetek/uzenetek';
  import {/*useGetUzenetek,*/useaddMessage,usegetPotentialReceivers} from '@/api/uzenetek/uzenetekQuery';
const dialog = ref(false)

const{mutate: addMessage, isPending} = useaddMessage()

const MessageDataRef = ref<Message>({
  senderUserID: 2,
  message: '',
  date: new Date("0000-12-12"),
})

//const {data} = useGetUzenetek()
const {data} = usegetPotentialReceivers()

</script>

<template>
  <main>

      <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          color="surface-variant"
          text="Üzenet írása"
          variant="flat"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Üzenet">
          <v-menu class="appnavbarmenubtn"><!--itt lehet majd kiválasztani a "célpontokat"-->
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="appnavbarmenubtn">
                Címzettek:
              </v-btn>
            </template>
            <v-list>
              <v-list v-for="elem in data">{{ elem.name + " (" + elem.role + ")"  }}</v-list>
              <!--itt lesznek kilistázva-->
            </v-list>
              
          </v-menu>

          <v-card-text>
            <v-textarea label="Az üzenet szövege" v-model="MessageDataRef.message"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Mégse"
              @click="isActive.value = false"
            ></v-btn>
            <v-btn
              text="Űzenet elküldése"
              
              @click="() => {
                addMessage(MessageDataRef)
              }" :loading="isPending"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

  </main>
</template>