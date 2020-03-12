const mongoose=require('mongoose');

mongoose.model('Order',{
CustomerID:{
    type:mongoose.SchemaTypes.ObjectId,
    required:true
},
BookId:{
    type:mongoose.SchemaTypes.ObjectId,
    required:true
},
initialDate:{
    type:Date,
    required:true
},
deliverDate:{
    type:Date,
    required:true
}
});