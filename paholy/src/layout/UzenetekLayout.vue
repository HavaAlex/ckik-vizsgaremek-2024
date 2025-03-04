<script setup lang="ts">
import type { Message } from '@/api/uzenetek/uzenetek';
import { useGetUzenetek } from '@/api/uzenetek/uzenetekQuery';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const { data } = useGetUzenetek();
const selectedMessage = ref<Message | null>(null);
const dialog = ref(false);

const openDialog = (uzenet: Message) => {
  selectedMessage.value = uzenet;
  dialog.value = true;
};

const Beerkezett = ref(true);
const ChangeBeerkezett = () => {
  Beerkezett.value = !Beerkezett.value;
};

// Sorting reactive state
const sortKey = ref<string>(''); // e.g., 'sender', 'date', or 'message'
const sortAsc = ref<boolean>(true);

const sortListBy = (key: string) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value; // toggle direction if same key clicked
  } else {
    sortKey.value = key;
    sortAsc.value = true; // default to ascending for new key
  }
};

// Computed sorted arrays for incoming (kapott) messages
const sortedKapott = computed(() => {
  if (!data.value || !data.value.kapott) return [];
  let list = [...data.value.kapott];
  if (sortKey.value === 'sender') {
    list.sort((a, b) => sortAsc.value
      ? a.senderUserName.username.localeCompare(b.senderUserName.username)
      : b.senderUserName.username.localeCompare(a.senderUserName.username));
  } else if (sortKey.value === 'date') {
    list.sort((a, b) => sortAsc.value
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortKey.value === 'message') {
    list.sort((a, b) => sortAsc.value
      ? a.message.localeCompare(b.message)
      : b.message.localeCompare(a.message));
  }
  return list;
});

// Computed sorted arrays for outgoing (elkuldott) messages
const sortedElkuldott = computed(() => {
  if (!data.value || !data.value.elkuldott) return [];
  let list = [...data.value.elkuldott];
  // Note: Outgoing messages don't have a sender column
  if (sortKey.value === 'date') {
    list.sort((a, b) => sortAsc.value
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortKey.value === 'message') {
    list.sort((a, b) => sortAsc.value
      ? a.message.localeCompare(b.message)
      : b.message.localeCompare(a.message));
  }
  return list;
});

function formatDate(dateString: Date | string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

// Orientation handling
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});
</script>

<template>
  <main class="main">
    <v-card style="border-radius: 10px; border: 1px; margin-bottom: 10px;">
      <h1 style="padding: 10px;" class="bg-title">Üzenetek</h1>
    </v-card>
    <v-card class="conainerCard">
      <div style="display:flex; flex-direction: row; justify-content: left; align-items: center">
        <v-btn class="switchBtn" id="switchBtn1" :disabled="Beerkezett" @click="ChangeBeerkezett()">Beérkezett üzenetek</v-btn>
        <v-btn class="switchBtn" id="switchBtn2" :disabled="!Beerkezett" @click="ChangeBeerkezett()">Elküldött üzenetek</v-btn>
      </div>
      <div v-if="Beerkezett">
        <div v-if="!data?.kapott || data.kapott.length === 0">
          <p>Még nem érkezett üzenete</p>
          <v-table fixed-header style="border-radius: 3%;" class="messageTable">
            <thead>
              <tr>
                <th class="text-center" style="width: 15vw;" @click="sortListBy('sender')">Feladó</th>
                <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                <th class="text-center" style="width: 15vw;">Interakció</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </v-table>
        </div>
        <div v-else>
          <v-table fixed-header style="border-radius: 3%;" class="messageTable">
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
                <td style="width: 15vw;">{{ uzenet.senderUserName.username }}</td>
                <td style="width: 15vw;">{{ formatDate(uzenet.date) }}</td>
                <td id="szoveg" style="width: 15vw;">{{ uzenet.message }}</td>
                <td style="width: 15vw;">
                  <v-btn @click="openDialog(uzenet)">Megtekintés</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Popup Modal -->
          <v-dialog v-model="dialog" max-width="50vw" >
            <v-card max-width="50vw">
              <v-card-title>Üzenet részletei</v-card-title>
              <v-card-text>
                <p><strong>Feladó:</strong> {{ selectedMessage?.senderUserName.username }}</p>
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
      <div v-else>
        <div v-if="!data?.elkuldott || data.elkuldott.length === 0">
          <p>Még nem küldött üzeneteket</p>
          <v-table  fixed-header style="border-radius: 3%;" class="messageTable">
            <thead>
              <tr>
                <th class="text-center" style="width: 15vw;" @click="sortListBy('date')">Dátum</th>
                <th class="text-center" style="width: 15vw;" @click="sortListBy('message')">Üzenet</th>
                <th class="text-center" style="width: 15vw;">Interakció</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </v-table>
        </div>
        <div v-else>
          <v-table  fixed-header style="border-radius: 3%;" class="messageTable">
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
                  <v-btn @click="openDialog(uzenet)">Megtekintés</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Popup Modal -->
          <v-dialog v-model="dialog" max-width="50vw" >
            <v-card max-width="50vw">
              <v-card-title>Üzenet részletei</v-card-title>
              <v-card-text>
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
    </v-card>
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
    width: 50vw !important;
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
