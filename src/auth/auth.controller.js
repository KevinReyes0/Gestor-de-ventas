import User from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async(req, res) => {
    const {email, password, username} = req.body;

    try {

        const user = await User.findOne({
            $or: [{email}, {username}]
        }) 

        if(!user){
            return res.status(400).json({
                msg: 'Incorrect credentials, Email does not exist in the database'
            });
        }

        if(!user.state){
            return res.status(400).json({
                msg: 'The user does not exist in the database'
            });
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'The password is incorrect'
            })
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Login successful',
            userDetails: {
                username: user.email,
                token: token
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const { email, ...data} = req.body; 

        const existingUser = await User.findOne({ email: email.trim() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: 'Email already exists'
            });
        }
        
        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: email.trim(), 
            password: encryptedPassword
        })

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "The user cannot log in",
            error: error.message
        })
    }
}



const createUserAdmin = async ( name, surname, username, email, password, role ) => {
    try {

    if (role === "ADMIN_ROLE") {
        const existAdmin = await User.findOne({ role: "ADMIN_ROLE" });
        if (existAdmin) {
            console.log("--------------------------- Error -------------------------------")
            console.log("A user with admin role already exists. Another cannot be created.");
            console.log("-----------------------------------------------------------------")
            return null;
        };
    };

    const encryptedPassword = await hash(password);

    const newUser = new User({ 
        name, 
        surname, 
        username, 
        email, 
        password: encryptedPassword, 
        role });

        await newUser.save();
        console.log("User created successfully:", newUser);
        return newUser;
        
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

createUserAdmin("Kevin", "Reyes", "kreyes","kreyes@gmail.com", "12345678", "ADMIN_ROLE");

