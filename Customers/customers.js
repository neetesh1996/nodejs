const express =require('express');
const app=express();

const bodyParser=require('body-parser');

app.use(bodyParser.json());

const mongoose=require('mongoose')

require('./Customer');
const Customer=mongoose.model('Customer');
mongoose.connect('mongodb+srv://user_10:8476828634@cluster0-ka7jt.mongodb.net/customerservices?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true  },()=>{
    console.log('connected to database- customers');
});

app.post('/customers',(req,res)=>{
    var newCustomers={
        name:req.body.name,
        age:req.body.age,
        address:req.body.address,
    }
    var customer= new Customer(newCustomers);
    customer.save().then(()=>{
        res.send('customers created!');
    }).catch(err=>console.log(err));

});
app.get('/customers',(req,res)=>{
    Customer.find().then((customers)=>{
    res.json(customers);
    }).catch(err=>console.log(err));
});
app.get('/customer/:id',(req,res)=>{
    Customer.findById(req.params.id).then((customer)=>{
        if(customer){
            res.json(customer);
        }else{
            res.statusCode(404);
        }
    }).catch(err=>console.log(err));
});

app.delete('/customer/:id',(req,res)=>{
    Customer.findOneAndRemove(req.params.id).then(()=>{
        res.send('customer removed');
    }).catch(err=>console.log(err));
})

app.listen(5000,()=>{
    console.log('customers are listening  port 5000');
})