<script setup lang="ts">
import { ref, computed} from 'vue'
import type { Message } from '@/api/uzenetek/uzenetek';
import { useaddMessage, usegetPotentialReceivers } from '@/api/uzenetek/uzenetekQuery';
//import { useToast } from 'vuetify/lib/framework'; // Assuming Vuetify's built-in toast

const dialog = ref(false);
const successDialog = ref(false);
const { mutate: addMessage, isPending } = useaddMessage();
const { data } = usegetPotentialReceivers();

const MessageDataRef = ref<Message>({
  message: '',
  date: new Date("0000-12-12"),
  receiverlist: [],
  receiverGrouplist: []
});

// Function to handle message sending
const sendMessage = () => {
  addMessage(MessageDataRef.value, {
    onSuccess: () => {
      // Reset input fields
      MessageDataRef.value = {
        message: '',
        date: new Date("0000-12-12"),
        receiverlist: [],
        receiverGrouplist: []
      };
      
      // Show success popup
      successDialog.value = true;
      
      // Close the message dialog
      dialog.value = false;
    }
  });
};
</script>

<template>
  <main>
    <!-- Message Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" color="surface-variant" text="Üzenet írása" variant="flat"></v-btn>
      </template>

      <v-card title="Üzenet">
        <p>Címzettek:</p>
        <v-list-item 
          v-for="(cuccli, index) in MessageDataRef.receiverlist" 
          :key="index" 
          @click="MessageDataRef.receiverlist.splice(index, 1)"
        >
          {{ cuccli.name + " (" + cuccli.role + ") (kattintson az eltávolításhoz)" }}
        </v-list-item>

        <v-list-item 
          v-for="(cuccli, index) in MessageDataRef.receiverGrouplist" 
          :key="index" 
          @click="MessageDataRef.receiverGrouplist.splice(index, 1)"
        >
          {{ cuccli.name + " (csoport)" }}
        </v-list-item>

        <v-menu class="appnavbarmenubtn">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="appnavbarmenubtn">Címzettek hozzáadása:</v-btn>
          </template>
          <v-list>
            <v-list class="targetelement" v-for="elem in data?.singleUsers" 
              @click="MessageDataRef.receiverlist.push(elem)">
              {{ elem.name + " (" + elem.role + ")" }}
            </v-list>
            <v-list class="targetelement" v-for="elem in data?.groups" 
              @click="MessageDataRef.receiverGrouplist.push(elem)">
              {{ elem.name + " (csoport)" }}
            </v-list>
          </v-list>
        </v-menu>

        <v-card-text>
          <v-textarea label="Az üzenet szövege" v-model="MessageDataRef.message"></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Mégse" @click="dialog = false"></v-btn>
          <v-btn text="Üzenet elküldése" @click="sendMessage" :loading="isPending "></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card title="Siker!">
        <v-card-text>Az üzenetet sikeresen elküldted.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="OK" @click="successDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<style lang="css">
.targetelement:hover {
  cursor: pointer;
}
</style>
