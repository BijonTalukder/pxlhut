const { default: mongoose } = require("mongoose");

const transactionSharedByUserModel= new mongoose.Schema({
    id:{
        type:String
    },
    transactionId:{
                type:String

    },
    userId:{
                type:String

    }

})

module.exports= mongoose.model("transaction_shared_by_users",transactionSharedByUserModel)