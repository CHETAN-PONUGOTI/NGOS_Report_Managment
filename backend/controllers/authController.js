const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const login = (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: ADMIN_API_KEY,
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }
};

module.exports = { login };