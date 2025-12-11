import Account from "../models/account.js"


export const allAccount=async(req,res)=>{
    try {
         const userId = req.user._id; 
        const allAccount=await Account.find({userId})
        return res.status(200).json({data:allAccount})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'server error'})
    }
}

export const newAccount=async(req,res)=>{
    try {
        const{amount,name}=req.body 
        if(!amount||!name){
            return res.status(400).json({error:"all fields are required"})
        }
        const userId = req.user._id;
        const addAccount=await Account.create({amount,name,userId})
        return res.status(200).json({data:addAccount})
    } catch (error) {
         res.status(500).json({error:'server error'})
    }
}

export const editAccount=async(req,res)=>{
    try {
        const{id}=req.params 
        if(!id){
            return res.status(404).json({error:'id is not found'})
        }
        const updateAcc=await Account.findByIdAndUpdate({_id:id},req.body,{new:true})
        return res.status(200).json({data:updateAcc})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'server error'})
    }
}

export const getEditAccount=async(req,res)=>{
    try {
        const{id}=req.params 
        if(!id){
            return res.status(404).json({error:'id is not found'})
        }
        const fetchUpdateAcc=await Account.findById({_id:id})
        return res.status(200).json({data:fetchUpdateAcc})
    } catch (error) {
         res.status(500).json({error:'server error'})
    }
}

export const deleteAccount=async(req,res)=>{
    try {
        const{id}=req.params 
        if(!id){
            return res.status(404).json({error:'id is not found'})
        }
        await Account.findByIdAndDelete({_id:id},req.body)
        return res.status(200).json({message:'delete account successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'server error'})
    }
}