var app = new Vue({
  el: "#app",
  methods: {
    toggleState: function(id, state) {
      axios({
        method: "PUT",
        url: "/devices/" + id,
        data: {
          enabled: !state
        }
      });
    }
  },
  data: {
    users: []
  },
  mounted() {
    axios.get("/devices").then(response => {
      this.users = response.data.data;
    });
    setInterval(function() {
      axios.get("/networks").then(console.log.bind(console));
    }, 1000);
  }
});
