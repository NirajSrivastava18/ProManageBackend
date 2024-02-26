const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
const taskRoute = require('./routes/taskRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/', userRoute);
app.use('/api/', taskRoute);

app.get('/', (req, res) => {
  let time = new Date().toLocaleTimeString();
  res.json({
    time: time,
    app: 'ProManage Backend',
    state: 'Active',
    message: 'All good!',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  connectDB();
  console.log(`Server is running on PORT ${PORT}`);
});
