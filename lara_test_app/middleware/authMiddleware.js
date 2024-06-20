const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    // Step 1: Check presence of token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Step 2: Check JWT token format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return res.status(401).json({ message: 'Invalid token format.' });
    }

    const token = tokenParts[1];

    // Step 3: Verify the token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        // console.log("Token: ", token);
        // console.log("Error: ", err);
        // console.log("Decoded: ", decoded);
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }

        // Attach the Student ID to the request object
        req.student_id = decoded.student_id;
        // console.log("Token extracted ID: ", req.student_id);
        // Proceed to the next middleware
        next();
    });
};

module.exports = verifyToken;
 