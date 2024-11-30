// Import the framework and instantiate it
import Fastify from 'fastify'
import fastifyWebsocket from "@fastify/websocket"

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyWebsocket)

fastify.register(async function (fastify) {
  fastify.get('/web-socket', { websocket: true }, (socket, req) => {
    console.log('Client connected');
  
    // Interval for sending messages every 2 seconds
    const interval = setInterval(() => {
      const message = { timestamp: new Date(), message: 'Hello from server!' };
      socket.send(JSON.stringify(message));
    }, 2000);
  
    // Handle incoming messages
    socket.on('message', (msg) => {
      console.log('Received from client:', msg.toString());
    });
  
    // Cleanup on disconnect
    socket.on('close', () => {
      console.log('Client disconnected');
      clearInterval(interval);
    });
  });
})


// // Declare a route
// fastify.get('/', async function handler (request, reply) {
//   return { hello: 'world' }
// })

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}