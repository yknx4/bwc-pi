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
    },
    volume: function(val) {
      const v = parseInt(2000 * Math.log(Math.abs(101 - val) / 100));
      if (v > 0) return 0;
      if (v < -2000) return -2000;
      return v;
    },
    existsSsid(ssid) {
      return this.networks.some(e => e.ssid === ssid);
    },
    existsMac(mac) {
      return this.networks.some(e => e.mac === mac);
    }
  },
  data: {
    users: [],
    networks: []
  },
  mounted() {
    axios.get("/devices").then(response => {
      this.users = response.data.data;
    });
    setInterval(() => {
      axios
        .get("/networks")
        .then(n => {
          this.networks = n.data;
        })
        .catch(console.error.bind(console));
    }, 1000);
  }
});
