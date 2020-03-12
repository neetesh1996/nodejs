const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose =require('mongoose');
const axios=require('axios')

app.use(bodyParser.json());
require('./Order');
var Order=mongoose.model('Order');
mongoose.connect('mongodb+srv://user_10:8476828634@cluster0-ka7jt.mongodb.net/orderservices?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true  },()=>{
    console.log('connected to database-ordes');
});
app.post('/orders',(req,res)=>{
    var newOrders={
        CustomerID:mongoose.Types.ObjectId(req.body.CustomerID),
        BookId:mongoose.Types.ObjectId(req.body.BookId),
        initialDate:req.body.initialDate,
        deliverDate:req.body.deliverDate,

    }
    var orders=new Order(newOrders);
    orders.save().then(()=>{
        res.send('order created');
    }).catch(err=>console.log(err));
});
app.get('/orders',(req,res)=>{
    Order.find().then((order)=>{
        res.json(order);
    }).catch(err=>console.log(err));

});

app.get('/order/:id',(req,res)=>{
    Order.findById(req.params.id).then((order)=>{
        if(order){
            console.log("book",order.BookId);
            console.log("cuxstomer",order.CustomerID);
            axios.get("http://localhost:5000/customer/"+order.CustomerID).then((response)=>{
                var orderObject={customerName:response.data.name, bookTitle:""}

                axios.get("http://localhost:4000/book/"+order.BookId).then((response)=>{
                    orderObject.bookTitle=response.data.title
                    res.json(orderObject);
                })
            })
        }else{
            res.statusCode(404);
        }
    }).catch(err=>console.log(err));
});
app.delete('/order/:id',(req,res)=>{
    Order.findOneAndRemove(req.params.id).then(()=>{
        res.send('order removed');
    }).catch(err=>console.log(err));
});


app.listen(6000,()=>{
    console.log('orders are running on port 6000');
})
