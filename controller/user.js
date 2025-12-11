import User from '../models/user.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { createToken } from '../middleware/createToken.js'

// Ensure /tmp/uploads exists
const uploadPath = '/tmp/uploads'
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

export const upload = multer({ storage: storage })

export const newUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const image = req.file?.filename // multer attaches file object to req.file

        if (!username || !email || !password || !image) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const addUser = await User.create({ username, email, password, image })

        return res.status(201).json({ message: "New user created", data: addUser })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPassword = await user.comparePassword(password);
        if (!isPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Include _id in token
       const token=createToken(user)

        return res.status(200).json({
            message: "User login successful",
            user: {
                _id: user._id,          // ✅ use _id
                username: user.username,
                email: user.email,
                image: user.image
            },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};



export const logoutUser=async(req,res)=>{
    res.clearCookie("token");
    return res.status(200).json({message:"logout successfull"})
}
export const editUser=async(req,res)=>{
    try {
        const {id}=req.params 
        if(!id){
           return res.status(400).json({error:"id not found"})
        }
        const updateUser=await User.findByIdAndUpdate(id,req.body,{new:true})
         await updateUser.save()
       
         if(!updateUser){
            return res.status(404).json({error:"user not found"})
         }
         return res.status(200).json({data:updateUser})
    } catch (error) {
        res.status(500).json({error:"server error"})
    }
}  