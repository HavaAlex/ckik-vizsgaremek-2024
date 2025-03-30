<script setup lang="ts">
import { ref, computed,onMounted, onUnmounted  } from 'vue'
import type { Message } from '@/api/uzenetek/uzenetek';
import { useaddMessage, usegetPotentialReceivers } from '@/api/uzenetek/uzenetekQuery';

const dialog = ref(false);
const successDialog = ref(false);
const { mutate: addMessage, isPending } = useaddMessage();
const { data } = usegetPotentialReceivers();


const searchText = ref('');


const filteredSingleUsers = computed(() => {
  if (!data.value || !data.value.singleUsers) return [];
  return data.value.singleUsers.filter(user =>
    user.username.toLowerCase().startsWith(searchText.value.toLowerCase())
  );
});


const filteredGroups = computed(() => {
  if (!data.value || !data.value.groups) return [];
  return data.value.groups.filter(group =>
    group.name.toLowerCase().startsWith(searchText.value.toLowerCase())
  );
});

const MessageDataRef = ref<Message>({
  message: '',
  date: new Date("0000-12-12"),
  receiverlist: [],
  receiverGrouplist: []
});


const sendMessage = () => {
  addMessage(MessageDataRef.value, {
    onSuccess: () => {
      
      MessageDataRef.value = {
        message: '',
        date: new Date("0000-12-12"),
        receiverlist: [],
        receiverGrouplist: []
      };
      searchText.value = '';

      
      successDialog.value = true;

      
      dialog.value = false;
    }
  });
};



//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
  if(document.cookie != ''){
    const decoded = jwtDecode(getCookie("alap"))
    push({name:decoded.userData.role+'orarend'})
  }
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});//itt ér véget
</script>

<template>
  <main>
    <div v-if="isPortrait">
        <!-- Felugró ablak -->
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="surface-variant" text="Üzenet írása" variant="flat"></v-btn>
        </template>

        <v-card title="Üzenet">
          <p>Címzettek:</p>
          <v-list>
            <v-list-item 
              v-for="(cuccli, index) in MessageDataRef.receiverlist" 
              :key="index" 
              @click="MessageDataRef.receiverlist.splice(index, 1)"
              style="max-height: 10vw;"
            >
              {{ cuccli.username + " (" + cuccli.role + ") (Nyomja meg az eltávolításhoz)" }}
            </v-list-item>

            <v-list-item 
              v-for="(cuccli, index) in MessageDataRef.receiverGrouplist" 
              :key="index" 
              @click="MessageDataRef.receiverGrouplist.splice(index, 1)"
            >
              {{ cuccli.name + " (csoport) (Nyomja meg az eltávolításhoz)" }}
            </v-list-item>
          </v-list>
          

          <!-- Hozzáadás dropdown -->
          <v-menu :close-on-content-click="false" >
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props">Címzettek hozzáadása:</v-btn>
                </template>
                <v-list style="max-height: 75vw;">
  
                  <v-text-field 
                    v-model="searchText" 
                    label="Keresés..." 
                    outlined 
                    dense 
                    hide-details
                  ></v-text-field>


                  <v-list-item 
                    v-for="(elem, index) in filteredSingleUsers" 
                    :key="index" 
                    @click="MessageDataRef.receiverlist.push(elem)"
                  >
                    {{ elem.username + " (" + elem.role + ")" }}
                  </v-list-item>


                  <v-list-item 
                    v-for="(elem, index) in filteredGroups" 
                    :key="index" 
                    @click="MessageDataRef.receiverGrouplist.push(elem)"
                  >
                    {{ elem.name + " (csoport)" }}
                  </v-list-item>


                </v-list>
              </v-menu>

          <v-card-text>
            <v-textarea label="Az üzenet szövege" v-model="MessageDataRef.message"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn text="Mégse" @click="dialog = false"></v-btn>
            <v-btn text="Üzenet elküldése" @click="sendMessage" :loading="isPending"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="successDialog" >
        <v-card title="Siker!">
          <v-card-text>Az üzenetet sikeresen elküldted.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="OK" @click="successDialog = false"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>

      <v-dialog v-model="dialog" style="max-width: 50vw; ">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" color="surface-variant" text="Üzenet írása" variant="flat"></v-btn>
            </template>

            <v-card title="Üzenet">
              <p>Címzettek:</p>
              <v-list>
                <v-list-item 
                  v-for="(cuccli, index) in MessageDataRef.receiverlist" 
                  :key="index" 
                  @click="MessageDataRef.receiverlist.splice(index, 1)"
                  style="max-height: 10vw;"
                >
                  {{ cuccli.username + " (" + cuccli.role + ") (kattintson az eltávolításhoz)" }}
                </v-list-item>

                <v-list-item 
                  v-for="(cuccli, index) in MessageDataRef.receiverGrouplist" 
                  :key="index" 
                  @click="MessageDataRef.receiverGrouplist.splice(index, 1)"
                >
                  {{ cuccli.name + " (csoport)" }}
                </v-list-item>
              </v-list>
              


              <v-menu :close-on-content-click="false" >
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props">Címzettek hozzáadása:</v-btn>
                </template>
                <v-list style="max-height: 25vw;">
  
                  <v-text-field 
                    v-model="searchText" 
                    label="Keresés..." 
                    outlined 
                    dense 
                    hide-details
                  ></v-text-field>


                  <v-list-item 
                    v-for="(elem, index) in filteredSingleUsers" 
                    :key="index" 
                    @click="MessageDataRef.receiverlist.push(elem)"
                  >
                    {{ elem.username + " (" + elem.role + ")" }}
                  </v-list-item>


                  <v-list-item 
                    v-for="(elem, index) in filteredGroups" 
                    :key="index" 
                    @click="MessageDataRef.receiverGrouplist.push(elem)"
                  >
                    {{ elem.name + " (csoport)" }}
                  </v-list-item>


                </v-list>
              </v-menu>

              <v-card-text>
                <v-textarea label="Az üzenet szövege" v-model="MessageDataRef.message"></v-textarea>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Mégse" @click="dialog = false"></v-btn>
                <v-btn text="Üzenet elküldése" @click="sendMessage" :loading="isPending"></v-btn>
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
    </div>
    
  </main>
</template>

<style lang="css">
.targetelement:hover {
  cursor: pointer;
}
</style>