const { default: mongoose } = require("mongoose");



const transactionSchema= new mongoose.Schema({
    transactionId:{
        type:String
    },
    userId:{
                type:String

    },
    groupId:{
                type:String

    },
    title:{
                type:String

    },
    type:{
        type:String,
        enum:["income","expense"]
    },
    isShared:{
          type:Boolean,
          default:false
    },
    paidBy:{
                type:String

    },
    month:{
                type:String

    },
    createdAt:{
                type:Date.now 

    },
      amount: { type: Number, required: true },
})
module.exports=mongoose.model("transactions",transactionSchema)