var host = "http://localhost:8000";
var app = new Vue({
  el: "#app",
  methods: {
    toggleState: function(id, state) {
      axios({
        method: "PUT",
        url: host + "/devices/" + id,
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
    axios.get(host + "/devices").then(response => {
      this.users = response.data.data;
    });
  }
});
