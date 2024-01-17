const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://1234567890:NuBIvjNKN8GbN3ez@cluster0.pmkgfqw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

const messageSchema = new mongoose.Schema({
  content: String,
});

// const UserSchema = new mongoose.Schema({
//   Name: String,
//   email: String,
//   password: String,
// });
const Message = mongoose.model('Message', messageSchema);
// const User = mongoose.model('User', UserSchema);
// app.post('/api/User', async (req, res) => {
//   const { Name,email,password } = req.body;
//   const newUser = new newUser({ Name,email,password});
//   await newUser.save();
//   res.json(newUser);
// });

// API endpoint to get messages
app.get('http://clipboard-backend.vercel.app/api/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// API endpoint to post a message
app.post('http://clipboard-backend.vercel.app/api/messages', async (req, res) => {
  const { content } = req.body;
  const newMessage = new Message({ content });
  await newMessage.save();
  res.json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  

app.delete('http://clipboard-backend.vercel.app/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  await Message.findByIdAndDelete(id);
  res.json({ message: 'Message deleted successfully' });
});
app.put('http://clipboard-backend.vercel.app/api/messages/:id', async (req, res) => {
  const messageId = req.params.id;
  const updatedData = req.body;

  try {
    const message = await Message.findByIdAndUpdate(messageId, updatedData, { new: true });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error updating message' });
  }
});

