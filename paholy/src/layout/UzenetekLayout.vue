<script setup lang="ts">
import type { Message } from '@/api/uzenetek/uzenetek';
import { useGetUzenetek, usegetAllUzenetek , usedeleteMessage } from '@/api/uzenetek/uzenetekQuery';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCookieHandler } from '@/stores/cookieHandler';
import { jwtDecode } from 'jwt-decode';
import { storeToRefs } from 'pinia';
import {useRouter} from 'vue-router'
const Router = useRouter()
const { mutate: deleteMessage } = usedeleteMessage();

const cookieHandler = useCookieHandler();
const { time } = storeToRefs(cookieHandler);

const cookieStatus = cookieHandler.hasValidCookie();
let role: string = '';
if (cookieStatus === true) {
  const decoded = jwtDecode(document.cookie);
  role = decoded.userData.role;
}

const { data: SentAndReceivedMessages } = useGetUzenetek();
const { data: allMessages } = usegetAllUzenetek();
console.log("Alllll: ", allMessages)
const selectedMessage = ref<Message | null>(null);
const dialog = ref(false);

const openDialog = (uzenet: Message) => {
  selectedMessage.value = uzenet;
  dialog.value = true;
};


const deleteDialog = ref(false);
const messageToDelete = ref<any | null>(null);

const openDeleteDialog = (message: any) => {
  messageToDelete.value = message;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (messageToDelete.value) {
    await deleteMessage(messageToDelete.value.ID);
    deleteDialog.value = false;
    messageToDelete.value = null;
  }
};

const messageView = ref<'kapott' | 'elkuldott' | 'osszes'>('kapott');


const sortKey = ref<string>(''); // 'sender' v 'date', v 'message'
const sortAsc = ref<boolean>(true);

const sortListBy = (key: string) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};


const sortedKapott = computed(() => {
  if (!SentAndReceivedMessages.value || !SentAndReceivedMessages.value.kapott) return [];
  let list = [...SentAndReceivedMessages.value.kapott];
  if (sortKey.value === 'sender') {
    list.sort((a, b) =>
      sortAsc.value
        ? a.senderUserName.username.localeCompare(b.senderUserName.username)
        : b.senderUserName.username.localeCompare(a.senderUserName.username)
    );
  } else if (sortKey.value === 'date') {
    list.sort((a, b) =>
      sortAsc.value
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else if (sortKey.value === 'message') {
    list.sort((a, b) =>
      sortAsc.value
        ? a.message.localeCompare(b.message)
        : b.message.localeCompare(a.message)
    );
  }
  return list;
});


const sortedElkuldott = computed(() => {
  if (!SentAndReceivedMessages.value || !SentAndReceivedMessages.value.elkuldott) return [];
  let list = [...SentAndReceivedMessages.value.elkuldott];
  if (sortKey.value === 'date') {
    list.sort((a, b) =>
      sortAsc.value
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else if (sortKey.value === 'message') {
    list.sort((a, b) =>
      sortAsc.value
        ? a.message.localeCompare(b.message)
        : b.message.localeCompare(a.message)
    );
  }
  return list;
});


const sortedOsszes = computed(() => {
  if (!allMessages.value) return [];
  let list = [...allMessages.value];
  if (sortKey.value === 'sender') {
    list.sort((a, b) => {
      const aSender = a.senderUserName.username;
      const bSender = b.senderUserName.username;
      return sortAsc.value
        ? aSender.localeCompare(bSender)
        : bSender.localeCompare(aSender);
    });
  } else if (sortKey.value === 'date') {
    list.sort((a, b) =>
      sortAsc.value
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else if (sortKey.value === 'message') {
    list.sort((a, b) =>
      sortAsc.value
        ? a.message.localeCompare(b.message)
        : b.message.localeCompare(a.message)
    );
  }
  return list;
});


function formatDate(dateString: Date | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); 
  return date.toISOString().slice(0, 19).replace("T", " ");
}


function formatReceivers(receivers: any) {
  if (!receivers || !Array.isArray(receivers)) return "";
  return receivers.map((receiver: any) => receiver.username).join(', ');
}




//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});//itt ér véget
</script>

<template>
  <main class="main">
    <!--Mobil nézet-->
    <div v-if="isPortrait">
      <v-card >
        <v-card-title style="border-radius: 10px; border: 1px; margin-bottom: 10px;">
          <h1 style="padding: 10px;" class="bg-title">Üzenetek</h1>
        </v-card-title>
        
        <v-card-text>
           <!--Mobil üzenet választó-->
          <div style="display:flex; flex-direction: row; justify-content: left; align-items: center">
            <v-btn class="switchBtn" id="switchBtn1" :disabled="messageView==='kapott'" @click="messageView = 'kapott'">
              Beérkezett <br> üzenetek
            </v-btn>
            <v-btn class="switchBtn" id="switchBtn2" :disabled="messageView==='elkuldott'" @click="messageView = 'elkuldott'">
              Elküldött <br> üzenetek
            </v-btn>
            <v-btn class="switchBtn" id="switchBtn3" v-if="role==='admin'" :disabled="messageView==='osszes'" @click="messageView = 'osszes'">
              Összes <br> üzenet
            </v-btn>
          </div>
          
           <!--Mobil nézet kapott üzenetek-->
          <div v-if="messageView==='kapott'">
            <div v-if="!SentAndReceivedMessages?.kapott || SentAndReceivedMessages.kapott.length === 0">
              <p>Még nem érkezett üzenete</p>
            </div>
            <div v-else>
              <v-list style="height: 80vw; overflow-y: auto;">
                <v-list-item v-for="uzenet in sortedKapott" :key="uzenet.ID">
                    <strong>Feladó: </strong>{{ uzenet.senderUserName.username }} <br>
                    <strong>Küldés dátuma: </strong>{{ formatDate(uzenet.date) }} <br>
                    <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 80vw;display: inline-block;"><strong >Üzenet: </strong>{{ uzenet.message }}</div> <br>
                    <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                  </v-list-item>
              </v-list>
               
            <!--Mobil nézet kapott üzenet dialog-->
              <v-dialog v-model="dialog" max-width="80vw">
                <v-card max-width="80vw">
                  <v-card-title>Üzenet részletei</v-card-title>
                  <v-card-text>
                    <p><strong>Feladó:</strong> {{ selectedMessage?.senderUserName.username }}</p>
                    <p><strong>Címzettek:</strong> {{ formatReceivers(selectedMessage?.receivers) }}</p>
                    <p><strong>Dátum:</strong> {{ formatDate(selectedMessage?.date) }}</p>
                    <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
          
           <!--Mobil nézet küldött üzenet-->
          <div v-else-if="messageView==='elkuldott'">
            <div v-if="!SentAndReceivedMessages?.elkuldott || SentAndReceivedMessages.elkuldott.length === 0">
              <p>Még nem nem küldött üzenetet</p>
            </div>
            <div v-else>
              <v-list style="height: 80vw; overflow-y: auto;">
                <v-list-item v-for="uzenet in sortedElkuldott" :key="uzenet.ID">
                    <strong>Küldés dátuma: </strong>{{ formatDate(uzenet.date) }} <br>
                    <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 80vw;display: inline-block;"><strong >Üzenet: </strong>{{ uzenet.message }}</div> <br>
                    <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                  </v-list-item>
              </v-list>
               <!--Mobil nézet küldött üzenet dialog-->
              <v-dialog v-model="dialog" max-width="80vw">
                <v-card max-width="80vw">
                  <v-card-title>Üzenet részletei</v-card-title>
                  <v-card-text>
                    <p><strong>Dátum:</strong> {{ formatDate(selectedMessage?.date) }}</p>
                    <p><strong>Címzettek:</strong> {{ formatReceivers(selectedMessage?.receivers) }}</p>
                    <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
          
           <!--Mobil nézet összes üzenet-->
          <div v-else-if="messageView==='osszes'">
            <div v-if="sortedOsszes.length === 0">
              <p>Nincsenek üzenetek</p>
              <v-table fixed-header class="messageTable">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 15vw;" @click="sortListBy('sender')">Feladó</th>
                    <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                    <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                    <th class="text-center" style="width: 15vw;">Interakció</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </v-table>
            </div>
            <div v-else>
              <v-list style="height: 80vw; overflow-y: auto;">
                <v-list-item v-for="uzenet in sortedOsszes" :key="uzenet.ID">
                    <strong>Küldés dátuma: </strong>{{ formatDate(uzenet.date) }} <br>
                    <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 80vw;display: inline-block;"><strong >Üzenet: </strong>{{ uzenet.message }}</div> <br>
                    <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                    <v-btn color="error" @click="openDeleteDialog(uzenet)">Törlés</v-btn>
                  </v-list-item>
              </v-list>
              
              <!--Mobil nézet összes üzenet dialog-->
               <v-dialog v-model="dialog" max-width="80vw">
                <v-card max-width="80vw">
                  <v-card-title>Üzenet részletei</v-card-title>
                  <v-card-text>
                    <p>
                      <strong>Feladó:</strong>
                      {{ selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : (selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : 'Én') }}
                    </p>
                    <p><strong>Címzettek:</strong> {{ formatReceivers(selectedMessage?.receivers) }}</p>
                    <p><strong>Dátum:</strong> {{ formatDate(selectedMessage?.date) }}</p>
                    <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </v-card-text>
        
      </v-card>


       <!--Mobil nézet törlés dialog-->
      <v-dialog v-model="deleteDialog" max-width="80vw">
        <v-card max-width="80vw">
          <v-card-title>Törlés megerősítése</v-card-title>
          <v-card-text>
            <p>Biztosan törli az üzenetet?</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" @click="confirmDelete">Törlés</v-btn>
            <v-btn @click="deleteDialog = false">Mégsem</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!--asztali helyzet-->
    <div v-else>
      <v-container>
        <v-card class="conainerCard" style="max-height: 35vw;">
          <v-card-title style="border-radius: 10px; border: 1px; margin-bottom: 10px;">
            <h1 style="padding: 10px;" class="bg-title">Üzenetek</h1>
          </v-card-title>
          
          <v-card-text>
            <div style="display:flex; flex-direction: row; justify-content: left; align-items: center">
              <v-btn class="switchBtn" id="switchBtn1" :disabled="messageView==='kapott'" @click="messageView = 'kapott'">
                Beérkezett üzenetek
              </v-btn>
              <v-btn class="switchBtn" id="switchBtn2" :disabled="messageView==='elkuldott'" @click="messageView = 'elkuldott'">
                Elküldött üzenetek
              </v-btn>
              <v-btn class="switchBtn" id="switchBtn3" v-if="role==='admin'" :disabled="messageView==='osszes'" @click="messageView = 'osszes'">
                Összes üzenet
              </v-btn>
            </div>
            
            <!--Asztali kapott üzenetek-->
            <div v-if="messageView==='kapott'">
              <!--Asztali kapott üzenetek üres-->
              <div v-if="!SentAndReceivedMessages?.kapott || SentAndReceivedMessages.kapott.length === 0">
                <p>Még nem érkezett üzenete</p>
                <v-table class="messageTable">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('sender')">Feladó</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                      <th class="text-center" style="width: 15vw;">Interakció</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </v-table>
              </div>
              <!--Asztali kapott üzenetek teli-->
              <div v-else>
                <v-table fixed-header class="messageTable">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('sender')">Feladó</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                      <th class="text-center" style="width: 15vw;">Interakció</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="uzenet in sortedKapott" :key="uzenet.ID">
                      <td style="width: 15vw;">{{ uzenet.senderUserName.username }}</td>
                      <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                      <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                      <td style="width: 15vw;">
                        <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <v-dialog v-model="dialog" max-width="50vw">
                  <v-card max-width="50vw">
                    <v-card-title>Üzenet részletei</v-card-title>
                    <v-card-text>
                      <p><strong>Feladó:</strong> {{ selectedMessage?.senderUserName.username }}</p>
                      <p><strong>Címzettek:</strong> {{ formatReceivers(selectedMessage?.receivers) }}</p>
                      <p><strong>Dátum:</strong> {{ formatDate(selectedMessage?.date) }}</p>
                      <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </div>
            
            <!--Asztali küldott üzenetek-->
            <div v-else-if="messageView==='elkuldott'">
              <!--Asztali küldott üzenetek üres-->
              <div v-if="!SentAndReceivedMessages?.elkuldott || SentAndReceivedMessages.elkuldott.length === 0">
                <p>Még nem küldött üzeneteket</p>
                <v-table class="messageTable">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                      <th class="text-center" style="width: 15vw;">Interakció</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </v-table>
              </div>
              <!--Asztali küldott üzenetek teli-->
              <div v-else>
                <v-table fixed-header class="messageTable">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                      <th class="text-center" style="width: 15vw;">Interakció</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="uzenet in sortedElkuldott" :key="uzenet.ID">
                      <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                      <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                      <td style="width: 15vw;">
                        <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>


                <v-dialog v-model="dialog" max-width="50vw">
                  <v-card max-width="50vw">
                    <v-card-title>Üzenet részletei</v-card-title>
                    <v-card-text>
                      <p><strong>Dátum:</strong> {{ formatDate(selectedMessage?.date) }}</p>
                      <p><strong>Címzettek:</strong> {{ formatReceivers(selectedMessage?.receivers) }}</p>
                      <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </div>
            
              <!--Asztali üzenetek összes-->
            <div v-else-if="messageView==='osszes'">
              <!--Asztali üzenetek összes üres-->
              <div v-if="sortedOsszes.length === 0">
                <p>Nincsenek üzenetek</p>
                <v-table fixed-header class="messageTable">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('sender')">Feladó</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                      <th class="text-center" style="width: 15vw;">Interakció</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </v-table>
              </div>
              <!--Asztali üzenetek összes teli-->
              <div v-else>
                <v-table fixed-header class="messageTable">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('sender')">Feladó</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                      <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                      <th class="text-center" style="width: 15vw;">Interakció</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="uzenet in sortedOsszes" :key="uzenet.ID">
                      <td style="width: 15vw;">
                        {{ selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : (selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : 'Én') }}
                      </td>
                      <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                      <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                      <td style="width: 15vw;">
                        <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                        <v-btn color="error" @click="openDeleteDialog(uzenet)">Törlés</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>


                <v-dialog v-model="dialog" max-width="50vw">
                  <v-card max-width="50vw">
                    <v-card-title>Üzenet részletei</v-card-title>
                    <v-card-text>
                      <p>
                        <strong>Feladó:</strong>
                        {{ selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : (selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : 'Én') }}
                      </p>
                      <p><strong>Címzettek:</strong> {{ formatReceivers(selectedMessage?.receivers) }}</p>
                      <p><strong>Dátum:</strong> {{ formatDate(selectedMessage?.date) }}</p>
                      <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </div>
          </v-card-text>
          
        </v-card>
      </v-container>




      <v-dialog v-model="deleteDialog" max-width="50vw">
        <v-card max-width="50vw">
          <v-card-title>Törlés megerősítése</v-card-title>
          <v-card-text>
            <p>Biztosan törli az üzenetet?</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" @click="confirmDelete">Törlés</v-btn>
            <v-btn @click="deleteDialog = false">Mégsem</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <RouterView></RouterView>
  </main>
</template>

<style lang="css">
#szoveg {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 15vw;
  display: inline-block;
}
.conainerCard {
  align-content: center!important;
}
.switchBtn {
  align-content: center!important;
}
@media (orientation: portrait) {
  .messageTable {
    height: 90vw !important;
    width: 95vw !important;
  }
  .switchBtn {
    width: 30vw !important;
    height: 20vw !important;
  }
  .navigationdrawer {
    width: 20vw !important;
    height: 90vw !important;
  }
}
@media (orientation: landscape) {
  .messageTable {
    height: 30vw !important;
    width: 95vw !important;
  }
  .switchBtn {
    width: 15vw !important;
    height: 3vw !important;
    font-size: 1vw;
  }
  .navigationdrawer {
    width: 15vw !important;
    height: 40vw !important;
  }
}
</style>