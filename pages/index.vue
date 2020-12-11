<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-card min-width="400">
        <v-card-title>Chat Project</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Your nickname"
              required
            ></v-text-field>

            <v-text-field v-model="room" :rules="roomRules" label="Room number" required></v-text-field>

            <v-btn :disabled="!valid" color="primary" class="mr-4" @click="submit">Log in</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex"; //we received a mutation and now we can use it like normally method
export default {
  layout: "empty",
  head: {
    title: "Welcome to my chatroom"
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  },
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "Nickname is required",
      v => (v && v.length <= 16) || "Name must be less than 16 characters"
    ],
    room: "",
    roomRules: [v => !!v || "Write a room code"]
  }),
  methods: {
    ...mapMutations(["setUser"]), //calls mutation for store
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          //creates user
          name: this.name,
          room: this.room
        };
        this.$socket.emit("newUser", user, data => {
          if (typeof data == "string") {
            console.log(data);
          } else {
            user.id = data.userId;
            this.setUser(user); // Sends user to sever
            this.$router.push("/chat"); //Redirects to chat page
          }
        });
      }
    }
  }
};
</script>