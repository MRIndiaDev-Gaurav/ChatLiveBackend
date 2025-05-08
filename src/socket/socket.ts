import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { prisma } from "../app";

const room: Record<string, string[]> = {};

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return next(new Error("Authentication error"));
    }

    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(socket.id, "A user connected");
  socket.emit("User connected", socket.id);

  let roomId = socket.handshake.query.room;
  console.log(roomId);
  console.log(room);

  // Ensure the roomId is a single string
  if (Array.isArray(roomId)) {
    roomId = roomId[0];
  }
  if (typeof roomId === "string") {
    // Check that the room exists
    if (!room[roomId]) {
      room[roomId] = [];
      room[roomId].push(socket.id);
      socket.join(roomId);
      console.log(socket.id, "Joined room", roomId);
    } else {
      console.log(socket.id, "User already in room", roomId);
    }
  }

  socket.on("message", (message) => {
    console.log(socket.id, "User sent message", message);
    socket.broadcast.emit("message", message);
  });

  socket.on("is typing", (data) => {
    console.log(socket.id, "User is typing", data);
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "User disconnected");
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

server.listen(8080, () => {
  console.log("Socket is also running I am complied");
});
