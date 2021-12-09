const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const register = async (req, res) => {
// Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send({message: "User Already Exist. Please Login"});
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword
        });

        user.access_token = jwt.sign(
            {user_id: user._id, email},
            'Acesso123#',
            {
                expiresIn: "2h",
            }
        );

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }

}

const login = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send({message: "All input is required"});
        }
        // Validate if user exist in our database
        let user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            let access_token = await jwt.sign(
                {
                    user_id: user._id,
                    first_name: user.first_name,
                    email
                },
                "Acesso123#",
                {
                    expiresIn: "2h",
                }
            );

            const response = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                access_token
            };

            return res.status(200).json(response);
        }

        return res.status(400).send({message: "Invalid Credentials"});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    register,
    login
}
