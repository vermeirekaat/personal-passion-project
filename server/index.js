import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId });
  };

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getOneUser = (socketId) => {
    return onlineUsers.find((user) => user.username === username);
}

io.on("connection", (socket) => {
    console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
        console.log(onlineUsers)
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log(onlineUsers);
    })
});

io.listen(5000);