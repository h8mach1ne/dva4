<template>
  <!-- App.vue -->

  <v-app app>
    <v-navigation-drawer app v-model="drawer">
      <v-list subheader>
        <v-subheader>List of users in this room</v-subheader>
        <v-list-item v-for="u in users" :key="u.id" @click.prevent>
          <v-list-item-content>
            <v-list-item-title>{{u.name}}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon :color="u.id === user.id ? 'primary' : 'grey'">mdi-chat</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app right>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-10">Chatroom {{user.room}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="ma-2" @click="exit">Exit</v-btn>
    </v-app-bar>
    <v-content>
      <!-- Message -->
      <div class="chat-wrap" style="height: 100%">
        <div class="chat" ref="visible">
          <message
            v-for="m in messages"
            :name="m.name"
            :key="m.text"
            :text="m.text"
            :owner="m.id === user.id"
          />
        </div>
        <div class="chat-form">
          <formChat />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import message from "@/components/message.vue";
import formChat from "@/components/formChat.vue";
export default {
  data: () => ({
    drawer: false
  }),
  computed: mapState(["user", "messages", "users"]),
  components: { message, formChat },
  methods: {
    /* Deletes user data and redirects to login form*/
    ...mapMutations(["clearData"]),
    exit() {
      this.$socket.emit("userLeft", this.user.id, () => {
        this.$router.push("/");
        this.clearData();
      });
    }
  },
  middleware: ["chat"],
  head() {
    /* Drawer tittle */
    return {
      title: `Room ${this.user.room}`
    };
  },
  watch: {
    messages() {
      /* Scrolls to the last message*/
      setTimeout(() => {
        this.$refs.visible.scrollTop = this.$refs.visible.scrollHeight;
      });
    }
  }
};
</script>

<style  scoped>
.chat-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.chat-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
  background: #212121;
}
.chat {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
</style>