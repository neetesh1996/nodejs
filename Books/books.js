const express=require('express');
const app =express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

app.use(bodyParser.json());
require('./Book');
const Book=mongoose.model('Book');
mongoose.connect('mongodb+srv://user_10:8476828634@cluster0-ka7jt.mongodb.net/bookservices?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true  },()=>{
    console.log('connected to database');
});
app.get('/',(req,res)=>{
    res.send('this is books services');
});

app.post("/book",(req,res)=>{
   var newBook={
       title:req.body.title,
       author:req.body.author,
       numberPages:req.body.numberPages,
       publisher:req.body.publisher,
   }
   var book= new Book(newBook);

   book.save().then(()=>{
       console.log('new book created!');
   }).catch((err)=>{
       console.log(err);
   })
   res.send('new book created!')
})
app.get('/books',(req,res)=>{
    Book.find().then(books=>{
res.json(books);
    })
});
app.get('/book/:id',(req,res)=>{
    Book.findById(req.params.id).then(book=>{
        if(book){
            res.json(book);
        }
        else{
            res.sendStatus(404);
        }
    }).catch(err=>{
        console.log(err);
    })
});

app.delete('/book/:id',(req,res)=>{
    Book.findOneAndRemove(req.params.id).then(()=>{
        res.send('book removed');
    }).catch(err=>{console.log(err)});
})

app.listen(4000,()=>{
    console.log('server is listening on port 4000');
});