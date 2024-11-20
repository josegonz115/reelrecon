import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIO } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Redirect `/` to a random room with a UUID
    if (parsedUrl.pathname === "/") {
      const roomId = uuidV4();
      res.writeHead(302, { Location: `/${roomId}` });
      res.end();
      return;
    }

    // Next.js handles all other requests
    handle(req, res, parsedUrl);
  });

  // Attach socket.io to server
  const io = new SocketIO(server, { path: "/socket.io" });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("User connected");

    // Join room
    socket.on("join-room", (roomId, userId) => {
      // connect
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      socket.to(roomId).emit("user-connected", userId);

      // disconnect
      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected`);
        socket.to(roomId).emit("user-disconnected", userId);
      });
    });
  });

  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
