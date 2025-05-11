const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const pluginRoutes = require('./routes/plugin');
const workflowRoutes = require('./routes/workflow');
const manufacturerRoutes = require('./routes/manufacturer');
const topicRoutes = require('./routes/topic');
const { isTokenBlacklisted } = require('./middlewares/authMiddleware');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/plugin', pluginRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/topic', topicRoutes);

// Apply blacklist check for all protected routes
app.use(isTokenBlacklisted);

// Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/api/file", fileRoutes);
// app.use("/api/plugin", pluginRoutes);
// app.use("/api/workflow", workflowRoutes);
// app.use("/api/manufacturers", manufacturerRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to default database'))
  .catch((err) => console.log(err));

// Dynamically Access portDB
const portDB = mongoose.connection.useDb('portDB');
app.set('portDB', portDB); // Store the portDB instance for use in other file

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
