// Webhook server

const { createWebhookModule } = require("sipgateio");

const webhookServerPort = process.env.SIPGATE_WEBHOOK_SERVER_PORT || 8080;

const webhookModule = createWebhookModule();

webhookModule
  .createServer({
    port: webhookServerPort,
    serverAddress: undefined,
  })
  .then((webhookServer) => {
    console.log(`Webhook server running\n` + "Ready for calls 📞");

    webhookServer.onNewCall((newCallEvent) => {
      if (newCallEvent.users.includes("voicemail")) {
        return;
      }

      const rawCallerPhonenumber = newCallEvent.from;
      const callerPhonenumber =
        rawCallerPhonenumber === "anonymous"
          ? rawCallerPhonenumber
          : "+" + rawCallerPhonenumber;

      findCaller(callerPhonenumber).then(emitCaller).catch(console.error);
    });
  });

// Database

const path = require("path");
const { Database } = require("sqlite3").verbose();

const database = new Database(path.join(__dirname, "../database.db"));

const findCaller = (phonenumber) => {
  const query = `SELECT *
		FROM callers
		WHERE phonenumber = ?`;

  return new Promise((resolve, reject) => {
    database.get(query, [phonenumber], (err, row) => {
      err ? reject(err.message) : resolve(row || { phonenumber });
    });
  });
};

// Frontend delivery

const express = require("express");

const app = express();

app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

const frontendPort = process.env.FRONTEND_PORT || 3000;
const server = app.listen(frontendPort, () => {
  console.log(`Frontend running at http://localhost:${frontendPort}\n`);
});

// Websocket connection

const socketIo = require("socket.io");

const websocketServer = socketIo(server, {
  serveClient: true,
  origins: "*:*",
});

const emitCaller = (callerData) => {
  websocketServer.emit("caller", callerData);
};
