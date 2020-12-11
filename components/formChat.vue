<template>
  <v-text-field
    v-model="text"
    :label="label"
    :shaped="shaped"
    :outlined="outlined"
    :rounded="rounded"
    :single-line="singleLine"
    @keydown.enter="send"
  ></v-text-field>
</template>
<script>
export default {
  data: () => ({
    text: "",
    label: "Press enter to send",
    shaped: true,
    outlined: true,
    rounded: true,
    singleLine: true
  }),
  methods: {
    send() {
      this.$socket.emit(
        "createMessage",
        {
          text: this.text,
          id: this.$store.state.user.id
        },
        data => {
          if (typeof data === "string") {
            console.error(data);
          } else {
            this.text = "";
          }
        }
      );
    }
  }
};
</script>
