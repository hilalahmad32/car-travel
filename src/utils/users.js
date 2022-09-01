const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const hmset = promisify(client.hmset).bind(client);
const del = promisify(client.del).bind(client);
const hgetall = promisify(client.hgetall).bind(client);
const hget = promisify(client.hget).bind(client);

const express = require("express");
const router = express.Route();
class Users {
  createRoom(user, other) {
    return user > other ? user + "" + other : other + "" + user;
  }

  async addUser(id, phone, room, status = 1, lastseen = Date.now()) {
    try {
      var resp = await hmset("userdata", {
        [`user_${phone}`]: JSON.stringify({
          "id": id,
          "phone": phone,
          "room": room,
          "status": status,
          "lastseen": lastseen,
        }),
      });
      console.log(resp);
    } catch (e) {
      console.error(e);
      return;
    }
  }
  async getAllUserList() {
    var data = await hgetall("userdata");
    var resp = [];

    for (let k of Object.values(data)) {
      resp.push(JSON.parse(k));
    }

    return resp;
  }
  catch(e) {
    console.error(e);
    return [];
  }

  async getUserList(room) {
    try {
      var data = await hgetall("userdata");
      var resp = [];

      for (let k of Object.values(data)) {
        var user = JSON.parse(k);
        if (user.room === room) {
          resp.push(user);
        }
      }

      return resp;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getUser(phone) {
    try {
      var data = await hget("userdata", `user_${phone}`);
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async updateUserRoom(id, phone, room = "") {
    try {
      await this.addUser(id, phone, room); // this will update the room if user already exists
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async setOffline(id) {
    try {
      var data = await hgetall("userdata");

      for (let k of Object.values(data)) {
        var user = JSON.parse(k);
        if (user.id === id) {
          this.addUser(id, user.phone, "", 0, Date.now());
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async removeUser(phone) {
    try {
      let chatUser = this.getUser(phone);
      await client.del(`user_${phone}`);
      return chatUser;
    } catch (e) {
      console.error(e);
      return;
    }
  }
}

module.exports = { Users };

// create user
// async function addUser(id, phone, room, status = 1, lastseen = Date.now()) {
//   try {
//     var resp = await hmset("userdata", {
//       [`user_${phone}`]: JSON.stringify({
//         "id": id,
//         "phone": phone,
//         "room": room,
//         "status": status,
//         "lastseen": lastseen,
//       }),
//     });
//     console.log(resp);
//   } catch (e) {
//     console.error(e);
//     return;
//   }
// }

// module.exports = { addUser };
