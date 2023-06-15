//import bcrypt from "bcrypt";
const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

const getSalt = () => {
    return process.env.SALT_USER_KEY;
};

const hashPassword = (password, salt = getSalt()) => {
    const hash = crypto.createHash("sha256");
    hash.update(password + salt);
    return hash.digest("hex");
};

const comparePasswords = (password, hashedPassword, salt = getSalt()) => {
    const newHashedPassword = hashPassword(password, salt);
    return newHashedPassword === hashedPassword;
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser)
            return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await comparePasswords(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign(
            {
                email: existingUser.email,
                id: existingUser._id,
            },
            "test",
            { expiresIn: "1h" }
        );

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong.",
            error: error,
        });
        console.error("ERROR: ", error);
    }
};

const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.status(400).json({ message: "User already exist." });

        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." });

        //const hashedPassword = await bcrypt.hash(password, 12);
        const hashedPassword = await hashPassword(password);

        const result = await User.create({
            email,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                email: result.email,
                id: result._id,
            },
            "test",
            { expiresIn: "1h" }
        );

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong.",
            error: error,
        });
        console.log("ERROR: ", error);
        console.error("ERROR: ", error);
    }
};

module.exports = { signin, signup };
