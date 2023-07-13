const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  const user = users.find((user) => user.userId === userId);
  return user || null;
};

//when user connected
io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("wellcome", "hello i am getnet");

  //take userId nd socketId form user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });

  
  //send text and recived message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnected
  socket.on("disconnect", () => {
    console.log("a user disconneted!");
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});
