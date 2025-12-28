const rooms = {}

function addUserToRoom(roomId,socketId) {
    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socketId);
}

function removeUserFromRoom(roomId, socketId) {
  if (rooms[roomId]) {
    rooms[roomId].delete(socketId);
    if (rooms[roomId].size === 0) delete rooms[roomId];
  }
}

function getRoomSize(roomId) {
  return rooms[roomId] ? rooms[roomId].size : 0;
}

module.exports = { addUserToRoom, removeUserFromRoom, getRoomSize };