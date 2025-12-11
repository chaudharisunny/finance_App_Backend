import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true }, // ✅ Fixed
  
}, { timestamps: true });


 userSchema.pre("save",async function (next) {
    try {
        if(!this.isModified("password")) return next() 
            const saltRounds=10; 
            this.password=await bcrypt.hash(this.password,saltRounds)
            next()
    } catch (error) {
        next(error)
    }
 })
 userSchema.methods.comparePassword=async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password);
 }

 const User = mongoose.model('User', userSchema);
 export default User;
