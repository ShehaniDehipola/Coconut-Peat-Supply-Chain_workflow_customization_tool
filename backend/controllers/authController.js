const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Assuming MongoDB/Mongoose

// const PROTO_PATH = './user.proto';
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
// const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// // Register User function
// const registerUser = async (call, callback) => {
//     const { username, email, password } = call.request;

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return callback(null, { message: 'User already exists' });
//         }

//         // Create new user
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username, email, password: hashedPassword });
//         await user.save();

//         callback(null, { message: 'User registered successfully' });
//     } catch (err) {
//         callback({
//             code: grpc.status.INTERNAL,
//             message: 'Server error: ' + err.message,
//         });
//     }
// };

// // Login User function
// const loginUser = async (call, callback) => {
//     const { email, password } = call.request;

//     try {
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return callback({
//                 code: grpc.status.INVALID_ARGUMENT,
//                 message: 'Invalid credentials',
//             });
//         }

//         // Check if the password matches
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return callback({
//                 code: grpc.status.INVALID_ARGUMENT,
//                 message: 'Invalid credentials',
//             });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         callback(null, {
//             token,
//             user: {
//                 id: user._id.toString(),
//                 username: user.username,
//                 email: user.email,
//             },
//         });
//     } catch (err) {
//         callback({
//             code: grpc.status.INTERNAL,
//             message: 'Server error: ' + err.message,
//         });
//     }
// };

// // Set up and start the gRPC server
// const server = new grpc.Server();
// server.addService(userProto.UserService.service, {
//     RegisterUser: registerUser,
//     LoginUser: loginUser,
// });
// server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
//     console.log('Server running at http://0.0.0.0:50051');
//     server.start();
// });

