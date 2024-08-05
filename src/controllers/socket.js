import { insertData, readData } from './Api.js';

export function pollData(io) {
  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on('insert', async (data, pollId) => {
      try {
        await insertData(data, pollId);
        socket.emit('insertResponse', { status: 'success' });
      } catch (error) {
        socket.emit('insertResponse', { status: 'error' });
        console.error('Error inserting data:', error);
      }
    });

    socket.on('userinfo', (userid) => {
      const fetchData = async () => {
        try {
          const result = await readData(userid); 
          socket.emit("pollData", result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 3000);
      socket.on('disconnect', () => {
        clearInterval(intervalId);
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  });
}

