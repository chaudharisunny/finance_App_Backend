import Transaction from '../models/transaction.js'

export const allTransaction = async (req, res) => {
  try {
    const userId = req.user._id;

    const allTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "All transactions fetched successfully",
      data: allTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Server error" });
  }
};



export const newTransaction = async (req, res) => {
  try {
    const { item, category, payment,transactionType, amount, date } = req.body;

    if (!item || !category || !payment ||!transactionType|| !amount || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
     const userId = req.user._id;
    let formattedDate;
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      formattedDate = new Date(`${year}-${month}-${day}`);
    } else {
      formattedDate = new Date(date);
    }
    
    const newTransaction = await Transaction.create({
      item,
      category,
      payment,
      amount,
      transactionType,
      date: formattedDate,
      userId
    });

    res.status(201).json({
      message: 'New transaction added',
      data: newTransaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTransaction=async(req,res)=>{
    try {
        const{id}=req.params 
        if(!id){
            res.status(401).json({error:'id is not found'})
        }
        const updateTransaction=await Transaction.findByIdAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json({message:'update data'},updateTransaction)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({error:"server error"})
    }
}
// PUT /update-account-amount
export const updateAccountAmount = async (req, res) => {
  try {
    const { accountName, amount, type } = req.body;

    const account = await Accounts.findOne({ name: accountName });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (type === "income") {
      account.amount += Number(amount);
    } else if (type === "expense") {
      account.amount -= Number(amount);
    }

    await account.save();

    res.status(200).json({ message: "Account updated successfully", account });
  } catch (err) {
    res.status(500).json({ message: "Error updating account amount", err });
  }
};

  export const deleteTransaction=async(req,res)=>{
    try{
        const{id}=req.params 
        if(!id){
            res.status(401).json({error:'id is not found'})
        }
        const deleteTransaction=await Transaction.findByIdAndDelete(id)
        res.status(200).json({message:'delete this data'},deleteTransaction)
    }catch(error){
        res.status(500).json({error:'server error'})
    }
 }

 export const transactionSummary=async(req,res)=>{
  try {
    const transactions=await Transaction.find({userId:req.user._id})
    const totalIncome = transactions
      .filter(t => t.transactionType === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter(t => t.transactionType === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({error:'server error'})
  }
 }
