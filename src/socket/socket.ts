import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import helmet from "helmet";
import { timeStamp } from "console";

const room: Record<string, string[]> = {};

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.engine.use(helmet());

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

io.on("connection", async (socket) => {
  const userId = socket.data.user.id;

  try {
    const group = await prisma.group.findMany({
      where: {
        createdById: userId,
      },
    });

    group.forEach((group) => {
      socket.join(`group:${group.id}`);
      console.log(socket.id, "joined group", group.id);
    });
  } catch (error) {
    console.error(error);
  }

  socket.on("join group", async (data) => {
    try {
      const { groupId } = data;

      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });

      if (!group) {
        return console.error("Invalid group");
      }

      //   Check if the user is already a member of the group
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId: groupId,
          userId: userId,
        },
      });

      if (groupMember) {
        socket.emit("error", {
          message: "'You are already a member of this group'",
        });
      }

      await prisma.groupMember.create({
        data: {
          groupId: groupId,
          userId: userId,
        },
      });

      socket.join(`group:${groupId}`);

      //   Notify to all the members of the group that the user has joined
      io.to(`group:${group.id}`).emit("user_joined_group", {
        userId: userId,
        groupId: groupId,
        timeStamp: new Date().toLocaleString(),
      });

      socket.emit("joined_group", { groupId });
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: "Failed to join group" });
    }
  });

  socket.on("leave group", async (data) => {
    const { groupId } = data;
    try {
      const group = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            groupId: groupId,
            userId: userId,
          },
        },
      });

      if (!group) {
        socket.emit("error", { message: "Not a member of this group" });
        return console.error("Invalid group");
      }

      await prisma.groupMember.delete({
        where: {
          userId_groupId: {
            groupId: groupId,
            userId: userId,
          },
        },
      });

      socket.leave(`group:${groupId}`);
      io.to(`group:${groupId}`).emit("user_left_group", {
        userId: userId,
        groupId: groupId,
        timeStamp: new Date().toLocaleString(),
      });

      socket.emit("left_group", { groupId });
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Failed to leave group" });
    }
  });

  socket.on("group_message", async (data) => {
    const { groupId, message } = data;
    try {
      const isUserInGroup = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            groupId: groupId,
            userId: userId,
          },
        },
      });

      if (!isUserInGroup) {
        socket.emit("error", {
          message: "You are not a member of this group",
        });
        return console.error("Invalid group");
      }

      await prisma.groupMessage.create({
        data: {
          content: message,
          senderId: userId,
          groupId: groupId,
        },
      });

      io.to(`group:${groupId}`).emit("new_group_message", {
        id: message.id,
        senderId: userId,
        groupId: groupId,
        content: message.content,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("direct_message", async (data) => {
    const { message, recipientId } = data;
    try {
      const newMessage = await prisma.directMessage.create({
        data: {
          content: message,
          senderId: userId,
          recipientId: recipientId,
        },
      });

      //   Emit to the recipient if they are online
      const recipientSocket = getSocketByUserId(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket.id).emit("new_direct_message", {
          id: newMessage.id,
          senderId: userId,
          content: message,
          createdAt: newMessage.createdAt,
        });
      }

      socket.emit("message_sent", {
        id: newMessage.id,
        recipientId,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
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

function getSocketByUserId(userId: string) {
  for (let [id, socket] of io.sockets.sockets.entries()) {
    if (socket.data.user.id === userId) {
      return socket;
    }
  }
  return undefined;
}

server.listen(8080, () => {
  console.log("Socket is also running I am complied");
});
