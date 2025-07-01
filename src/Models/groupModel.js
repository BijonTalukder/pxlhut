const { default: mongoose } = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupId:{
        type:String
    },
    name:{
                type:String

    },
    createdBy:{
                type:String

    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    month:{
                type:String

    },
    totalMember:{
                type:Number

    }

})

module.exports=mongoose.model("groups",groupSchema)