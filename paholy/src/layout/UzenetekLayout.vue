<script setup lang="ts">
import type { Message } from '@/api/uzenetek/uzenetek';
import { useGetUzenetek } from '@/api/uzenetek/uzenetekQuery';
import { ref } from 'vue';

const { data } = useGetUzenetek();
const selectedMessage = ref<Message | null>(null);
const dialog = ref(false);

const openDialog = (uzenet: Message) => {
  selectedMessage.value = uzenet;
  dialog.value = true;
};
</script>

<template>
  <main>
    <h1>Beérkezett üzenetek</h1>

    <v-table theme="dark" height="40vw" width="60vw" fixed-header style="border-radius: 3%;">
      <thead>
        <tr>
          <th class="text-center">Feladó</th>
          <th class="text-center">Dátum</th>
          <th class="text-center">Üzenet</th>
          <th class="text-center">Interakció</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="uzenet in data" :key="uzenet.id">
          <td style="width: 15vw;">{{ uzenet.senderUserID }}</td>
          <td style="width: 15vw;">{{ uzenet.date }}</td>
          <td id="szoveg">{{ uzenet.message }}</td>
          <td>
            <v-btn @click="openDialog(uzenet)">Megtekintés</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Popup Modal -->
    <v-dialog v-model="dialog" max-width="50 vw" theme = "dark">
      <v-card max-width="50 vw">
        <v-card-title>Üzenet részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladó:</strong> {{ selectedMessage?.senderUserID }}</p>
          <p><strong>Dátum:</strong> {{ selectedMessage?.date }}</p>
          <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <RouterView />
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
</style>
