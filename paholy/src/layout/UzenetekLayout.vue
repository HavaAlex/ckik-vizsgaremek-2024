<script setup lang="ts">
import type { Message } from '@/api/uzenetek/uzenetek';
import { useGetUzenetek, usegetAllUzenetek , usedeleteMessage } from '@/api/uzenetek/uzenetekQuery';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCookieHandler } from '@/stores/cookieHandler';
import { jwtDecode } from 'jwt-decode';
import { storeToRefs } from 'pinia';

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

// New reactive variables and functions for deletion
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

// Reactive variable for switching views: received ("kapott"), sent ("elkuldott") or all ("osszes")
const messageView = ref<'kapott' | 'elkuldott' | 'osszes'>('kapott');

// Sorting state
const sortKey = ref<string>(''); // e.g. 'sender', 'date', or 'message'
const sortAsc = ref<boolean>(true);

const sortListBy = (key: string) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

// Computed sorted array for received messages (beérkezett) using SentAndReceivedMessages.kapott
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

// Computed sorted array for sent messages (elküldött) using SentAndReceivedMessages.elkuldott
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

// Computed sorted array for all messages (összes) using allMessages data (for admin only)
const sortedOsszes = computed(() => {
  if (!allMessages.value) return [];
  let list = [...allMessages.value];
  if (sortKey.value === 'sender') {
    list.sort((a, b) => {
      const aSender = a.senderUserName
        ? a.senderUserName.username
        : (a.sender ? a.sender.username : 'Én');
      const bSender = b.senderUserName
        ? b.senderUserName.username
        : (b.sender ? b.sender.username : 'Én');
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

function formatDate(dateString: Date | string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); // Add one hour
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
  <main class="main">

    <div v-if="isPortrait">
      <v-card class="conainerCard">
        <v-card-title style="border-radius: 10px; border: 1px; margin-bottom: 10px;">
          <h1 style="padding: 10px;" class="bg-title">Üzenetek</h1>
        </v-card-title>
        
        <v-card-text>
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
          
          <!-- Incoming Messages -->
          <div v-if="messageView==='kapott'">
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
                  <tr v-for="uzenet in sortedKapott" :key="uzenet.id">
                    <td style="width: 15vw;">{{ uzenet.sender.username }}</td>
                    <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                    <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                    <td style="width: 15vw;">
                      <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Popup Modal for incoming messages -->
              <v-dialog v-model="dialog" max-width="80vw">
                <v-card max-width="80vw">
                  <v-card-title>Üzenet részletei</v-card-title>
                  <v-card-text>
                    <p><strong>Feladó:</strong> {{ selectedMessage?.sender.username }}</p>
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
          
          <!-- Outgoing Messages -->
          <div v-else-if="messageView==='elkuldott'">
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
                  <tr v-for="uzenet in sortedElkuldott" :key="uzenet.id">
                    <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                    <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                    <td style="width: 15vw;">
                      <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Popup Modal for outgoing messages -->
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
          
          <!-- All Messages (Admin only) -->
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
                  <tr v-for="uzenet in sortedOsszes" :key="uzenet.id">
                    <td style="width: 15vw;">
                      {{ uzenet.sender ? uzenet.sender.username : (uzenet.senderUserName ? uzenet.senderUserName.username : 'Én') }}
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

              <!-- Popup Modal for all messages -->
              <v-dialog v-model="dialog" max-width="80vw">
                <v-card max-width="80vw">
                  <v-card-title>Üzenet részletei</v-card-title>
                  <v-card-text>
                    <p>
                      <strong>Feladó:</strong>
                      {{ selectedMessage?.sender ? selectedMessage.sender.username : (selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : 'Én') }}
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


        <!-- Delete Confirmation Popup -->
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


    <!--                     -->


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
            
            <!-- Incoming Messages -->
            <div v-if="messageView==='kapott'">
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
                    <tr v-for="uzenet in sortedKapott" :key="uzenet.id">
                      <td style="width: 15vw;">{{ uzenet.sender.username }}</td>
                      <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                      <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                      <td style="width: 15vw;">
                        <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- Popup Modal for incoming messages -->
                <v-dialog v-model="dialog" max-width="50vw">
                  <v-card max-width="50vw">
                    <v-card-title>Üzenet részletei</v-card-title>
                    <v-card-text>
                      <p><strong>Feladó:</strong> {{ selectedMessage?.sender.username }}</p>
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
            
            <!-- Outgoing Messages -->
            <div v-else-if="messageView==='elkuldott'">
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
                    <tr v-for="uzenet in sortedElkuldott" :key="uzenet.id">
                      <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                      <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                      <td style="width: 15vw;">
                        <v-btn color="primary" @click="openDialog(uzenet)">Megtekintés</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- Popup Modal for outgoing messages -->
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
            
            <!-- All Messages (Admin only) -->
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
                    <tr v-for="uzenet in sortedOsszes" :key="uzenet.id">
                      <td style="width: 15vw;">
                        {{ uzenet.sender ? uzenet.sender.username : (uzenet.senderUserName ? uzenet.senderUserName.username : 'Én') }}
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

                <!-- Popup Modal for all messages -->
                <v-dialog v-model="dialog" max-width="50vw">
                  <v-card max-width="50vw">
                    <v-card-title>Üzenet részletei</v-card-title>
                    <v-card-text>
                      <p>
                        <strong>Feladó:</strong>
                        {{ selectedMessage?.sender ? selectedMessage.sender.username : (selectedMessage?.senderUserName ? selectedMessage.senderUserName.username : 'Én') }}
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



        <!-- Delete Confirmation Popup -->
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
/* Landscape mode */
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