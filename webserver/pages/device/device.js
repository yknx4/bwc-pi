function save(item) {
  axios
    .post("/devices", this.user)
    .then(function(response) {
      window.location = "/dash";
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function update(item) {
  axios({
    method: "PUT",
    url: "/devices/" + item.id,
    data: this.user
  })
    .then(function(response) {
      window.location = "/dash";
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

var app = new Vue({
  el: "#app",
  methods: {
    toggleState: function(id, state) {}
  },
  methods: {
    save: save,
    update: update
  },
  data: {
    user: {}
  },
  computed: {
    saveHandler: function() {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("id")) {
        return this.update;
      }
      return this.save;
    },
    title: function() {
      var urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.has("id") ||
        (this.user.name != null && this.user.name !== "")
      ) {
        return this.user.name;
      }
      return "New User";
    }
  },
  mounted() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      axios
        .get("/devices/" + urlParams.get("id"))
        .then(response => {
          this.user = response.data;
        })
        .catch(() => {
          window.location = "/dash";
        });
    }
  }
});
