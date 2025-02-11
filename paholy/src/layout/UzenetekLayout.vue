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

const Beerkezett = ref(true);

const ChangeBeerkezett = () => {
  Beerkezett.value = !Beerkezett.value;
  
};

</script>

<template>
  <main class="main">
    <v-app-bar color="grey">
      <v-btn class="switchBtn "  id="switchBtn1" :disabled="Beerkezett"@click="ChangeBeerkezett()">Beérkezett üzenetek <br> megnézése</v-btn>
      <v-btn class="switchBtn" id="switchBtn2" :disabled="!Beerkezett" @click="ChangeBeerkezett()">Elküldött üzenetek <br> megnézése</v-btn>
    </v-app-bar>

    <div v-if="Beerkezett">
      <div v-if="data.kapott==undefined">
          <p>Még nem érkezett üzenete</p>
      </div>
      <div v-else>
          <h1>Beérkezett üzenetek</h1>
          <v-table theme="dark"  fixed-header style="border-radius: 3%;" class="messageTable">
            <thead>
              <tr>
                <th class="text-center" style="width: 15vw; justify-content: center;">Feladó</th>
                <th class="text-center" style="width: 15vw; justify-content: center;">Dátum</th>
                <th class="text-center" style="width: 15vw; justify-content: center;">Üzenet</th>
                <th class="text-center" style="width: 15vw; justify-content: center;">Interakció</th>
              </tr>
            </thead>
            <tbody >
              <tr v-for="uzenet in data.kapott" ><!--:key="uzenet.id"-->
                <td style="width: 15vw; justify-content: center;">{{ uzenet.senderUserID }}</td>
                <td style="width: 15vw; justify-content: center;">{{ uzenet.date }}</td>
                <td id="szoveg" style="width: 15vw; justify-content: center;">{{ uzenet.message }}</td>
                <td style="width: 15vw; justify-content: center;">
                  <v-btn @click="openDialog(uzenet)">Megtekintés</v-btn>
                  <!--<v-btn @click="">Elrejtés</v-btn>-->
                </td>
              </tr>
            </tbody>
          </v-table>
      </div>


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
    </div>
    <div v-else>
      <div v-if="data.elkuldott == undefined">
          <p>Még nem küldött üzeneteket</p>
      </div>
      <div v-else>
        <h1>Elküldött üzenetek</h1>
      <v-table theme="dark"  fixed-header style="border-radius: 3%;" class="messageTable">
        <thead>
          <tr>
            
            <th class="text-center" style="width: 15vw; justify-content: center;">Dátum</th>
            <th class="text-center" style="width: 15vw; justify-content: center;">Üzenet</th>
            <th class="text-center" style="width: 15vw; justify-content: center;">Interakció</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="uzenet in data.elkuldott" ><!--:key="uzenet.id"-->
          
            <td style="width: 15vw; justify-content: center;">{{ uzenet.date }}</td>
            <td id="szoveg" style="width: 15vw; justify-content: center;">{{ uzenet.message }}</td>
            <td style="width: 15vw; justify-content: center;">
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
            <p><strong>Dátum:</strong> {{ selectedMessage?.date }}</p>
            <p><strong>Üzenet:</strong> {{ selectedMessage?.message }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </div>
      
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

@media (orientation: portrait) {
  .messageTable{
    height: 90vw !important;
    width: 40vw !important;
  }
  .switchBtn{
    width: 15vw !important;
    height: 20vw !important;
  }
  .navigationdrawer{
    width: 20vw !important;
    height: 90vw !important;
  }
}


/* Landscape mode */
@media (orientation: landscape) {
  .messageTable{
    height: 30vw !important;
    width: 95vw !important;
  }
  .switchBtn{
    width: 15vw !important;
    height: 20vw !important;
  }
  .navigationdrawer{
    width: 15vw !important;
    height: 40vw !important;
  }
}
</style>
