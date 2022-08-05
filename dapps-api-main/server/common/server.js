import express from "express";
import Mongoose from "mongoose";
import * as http from "http";
import * as path from "path";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import WebSocket from "websocket";
import apiErrorHandler from "../helper/apiErrorHandler";
import chatController from "../api/v1/controllers/socket/controller";
import notificationController from "../api/v1/controllers/notification/controller";

const app = new express();
const server = http.createServer(app);
import socket from "socket.io";
const io = socket(server);
const root = path.normalize(`${__dirname}/../..`);
const WebSocketServer = WebSocket.server;
const WebSocketClient = WebSocket.client;
const client = new WebSocketClient();
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
  maxReceivedFrameSize: 64 * 1024 * 1024, // 64MiB
  maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
  fragmentOutgoingMessages: false,
  keepalive: false,
  disableNagleAlgorithm: false,
});
class ExpressServer {
  constructor() {
    app.use(express.json({ limit: "2000mb" }));

    app.use(express.urlencoded({ extended: true, limit: "2000mb" }));

    app.use(morgan("dev"));

    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
  }
  router(routes) {
    routes(app);
    return this;
  }

  configureSwagger(swaggerDefinition) {
    const options = {
      // swaggerOptions : { authAction :{JWT :{name:"JWT", schema :{ type:"apiKey", in:"header", name:"Authorization", description:""}, value:"Bearer <JWT>"}}},
      swaggerDefinition,
      apis: [
        path.resolve(`${root}/server/api/v1/controllers/**/*.js`),
        path.resolve(`${root}/api.yaml`),
      ],
    };

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(options))
    );
    return this;
  }

  handleError() {
    app.use(apiErrorHandler);

    return this;
  }

  configureDb(dbUrl) {
    return new Promise((resolve, reject) => {
      Mongoose.connect(
        dbUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        (err) => {
          if (err) {
            console.log(`Error in mongodb connection ${err.message}`);
            return reject(err);
          }
          console.log("Mongodb connection established");
          return resolve(this);
        }
      );
    });
  }

  listen(port) {
    server.listen(port, () => {
      console.log(
        `secure app is listening @port ${port}`,
        new Date().toLocaleString()
      );
    });
    return app;
  }
}

//*********** socket io************** */
//************ connection ********************** */
var userCount = 0,
  onlineUsers = [];
io.sockets.on("connection", (socket) => {
  userCount++;

  //**********************online user event call**************/
  socket.on("onlineUser", async () => {
    io.sockets.emit("onlineUser");
  });

  //************* send Chat one to one ****************** */
  socket.on("oneToOneChat", async (data) => {
    let chatSend = await chatController.oneToOneChat(data);
    var socketUser = [data.senderId, data.receiverId];
    let sendingRequest = false,
      chatHistory = [];
    chatHistory = chatSend.chatHistory ? chatSend.chatHistory : [];
    onlineUsers.map((e) => {
      if (socketUser.includes(e.userId)) {
        sendingRequest = true;
        if (chatSend.response_code == 200) {
          chatSend.chatHistory = e.userId == data.receiverId ? chatHistory : [];
        }
        io.sockets.in(e.socketId).emit("oneToOneChat", chatSend);
      }
    });
    if (sendingRequest == false || onlineUsers.length == 0) {
      io.sockets.in(socket.id).emit("oneToOneChat", chatSend);
    }
  });

  //...............................................chat History..............................................//

  socket.on("chatHistory", async (data) => {
    let chatData = await chatController.ChattingHistory(data);
    io.sockets.in(socket.id).emit("chatHistory", chatData);
  });

  // //...............................................clear chat..............................................//

  socket.on("clearChat", async (data) => {
    let chatData = await chatController.clearChat(data);
    io.sockets.in(socket.id).emit("clearChat", chatData);
  });

  //...............................................viewChat History.........//

  socket.on("viewChat", async (data) => {
    let chatData = await chatController.viewChat(data);
    io.sockets.in(socket.id).emit("viewChat", chatData);
  });

  //*****************************disconnect ****************//

  socket.on("disconnect", async () => {
    userCount--;
    console.log("disconnected socketId", userCount, socket.id);

    console.log(
      "in disconnected online user>>>> >>>>>",
      +JSON.stringify(onlineUsers)
    );

    if (onlineUsers.length > 0) {
      onlineUsers.map((e, index2) => {
        if (e.socketId == socket.id) {
          console.log(
            "remove ejabbered with socket id>>>>>",
            e.socketId,
            socket.id
          );
          delete onlineUsers[index2];
          return;
        }
      });
    }

    onlineUsers = onlineUsers.filter(Boolean);
    console.log(
      "After remove socket Id , available online user ===>",
      JSON.stringify(onlineUsers)
    );
  });
});

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection = request.accept("", request.origin);
  connection.on("message", function (message) {
    var type = JSON.parse(message.utf8Data);
    if (type.token) {
      connection.sendUTF(getNotificationList(type.token));
    }

    if (type.user_token) {
      connection.sendUTF(messageReceiveUserCount(type.user_token));
    }

    if (type.type === "ChatHistory") {
      connection.sendUTF(chatHistory(type));
    }
  });

  async function getNotificationList(token) {
    if (connection.connected) {
      try {
        let result = await notificationController.getNotificationList(token);
        if (result) {
          var data = JSON.stringify(result.responseResult);
          connection.sendUTF(data);
        }
        setTimeout(() => {
          getNotificationList(token);
        }, 5000);
      } catch (_err) {
        console.log("Cannot send notification list")
      }
    }
  }

  async function messageReceiveUserCount(token) {
    if (connection.connected) {
      let result = await chatController.messageReceiveUserCount(token);
      if (result) {
        var data = JSON.stringify(result.responseResult);
        connection.sendUTF(data);
      }
      setTimeout(() => {
        messageReceiveUserCount(token);
      }, 3000);
    }
  }

  async function chatHistory(requestData) {
    if (connection.connected) {
      let result = await chatController.chatHistoryWebSocket(requestData);
      if (result) {
        var data = JSON.stringify(result);
        connection.sendUTF(data);
      }
      setTimeout(() => {
        chatHistory(requestData);
      }, 3000);
    }
  }

  connection.on("close", function () {
    console.log(
      new Date() +
        " Peer " +
        connection.remoteAddress +
        " Client has disconnected."
    );
  });

  connection.on("connectFailed", function (error) {
    console.log("Connect Error: " + error.toString());
  });
});

client.on("connect", function (connection) {
  console.log(new Date() + " WebSocket Client Connected");

  connection.on("error", function (error) {
    console.log("Connection Error: " + error.toString());
  });

  connection.on("close", function () {
    console.log("echo-protocol Connection Closed");
  });
});

// client.connect('ws://182.72.203.245:1865/', '');
client.connect("ws://localhost:1865/", "");

export default ExpressServer;

function originIsAllowed() {
  return true;
}
