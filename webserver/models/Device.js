const storage = require("node-persist");
const uuid = require("uuid");
const invariant = require("invariant");

class Device {
  constructor(id, name, mac, ssid, enabled) {
    this.$id = id || uuid();
    this.$name = name;
    this.$mac = mac;
    this.$ssid = ssid;
    this.$enabled = enabled === undefined ? true : enabled;
  }
  get enabled() {
    return this.$enabled;
  }
  get ssid() {
    return this.$ssid;
  }
  get serialized() {
    const {
      $id: id,
      $name: name,
      $mac: mac,
      $ssid: ssid,
      $enabled: enabled
    } = this;
    return {
      id,
      name,
      mac,
      ssid,
      enabled,
      type: "Device"
    };
  }
  update(key, value) {
    if (this[`$${key}`] != null && value != null) {
      this[`$${key}`] = value;
    }
  }
  async save() {
    const { $id } = this;
    await storage.setItem(`Device:${$id}`, this.serialized);
    return $id;
  }
  static deserialize(item) {
    const { id, name, mac, ssid, enabled, type } = item;
    invariant(type === "Device", `${id} is not a Device`);
    return new Device(id, name, mac, ssid, enabled);
  }
  static async get(id) {
    console.log(`Getting Device:${id}`);
    console.log(storage.keys());
    const item = await storage.getItem(`Device:${id}`);
    return item != null ? Device.deserialize(item) : null;
  }
  static getAll() {
    return storage.valuesWithKeyMatch("Device").map(Device.deserialize);
  }
}

Device.type = "Device";

module.exports = Device;
