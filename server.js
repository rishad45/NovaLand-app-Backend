const express = require('express');
const http = require('http');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://coruscating-licorice-29ec4b.netlify.app',
    methods: ['GET', 'POST'],
  },
});
const connectToDB = require('./Config/dbConnect');
const allowedOrigins = require('./Config/allowedOrigins');
const transporter = require('./Config/nodemailer');

connectToDB();

// cors
app.use(cors(
  {
    origin: allowedOrigins, // allow the server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  },
));

// running socket
const NEW_CHAT_MESSAGE_EVENT = 'newMessageChat';

console.log('socket running');
io.on('error', (error) => {
  console.log(`Error: ${error}`);
});

io.on('connection', (socket) => {
  console.log(`user Connected ${socket.id}`);
  // Join in a chat
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // leave the room
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} leaved the chatroom`);
    socket.leave(roomId);
  });
});

// Setting up middlewares to parse request body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('files'));

// API routes
const userRoute = require('./routes/userRouter');
const adminRoute = require('./routes/adminRouter');
const sendRoute = require('./routes/emailRoute');
const chatRoute = require('./routes/ChatRoute');
// routes as middleware app.use
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/email', sendRoute);
app.use('/chats', chatRoute);
transporter.verify((err, success) => {
  // eslint-disable-next-line no-unused-expressions
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://taupe-kangaroo-a4f2a8.netlify.app');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

server.listen(5000, () => {
  console.log('server started on 5000');
});

app.get('/', (req, res) => {
  res.write('hello dev mm');
  res.end();
});

module.exports = app;
