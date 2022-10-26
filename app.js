const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/wikiDB');


const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);
app.route('/articles')
.get( (req, res) => {

    Article.find((error, data)=>{
     if(!error) res.status(200).send(data);
     else res.status(400).send("error occured, try again later");
    })

})
.post((req, res)=>{

    const title = req.body.title;
    const content = req.body.content;
    //console.log(title);
    const newArticle = new Article({
        title,
        content
    });

    newArticle.save((error)=>{
        if(!error) res.status(200).send("Article added successfully");
        else res.status(400).send("Failed to add article, try again");
    });


})
.delete((req, res) => {
Article.deleteMany((error)=>{
if(!error)res.status(200).send("Successfully deleted all articles");
else res.status(400).send("Failed to delete article, try again later");
})
});


app.route('/articles/:articleTitle')
.get((req, res) => {
   const param = req.params.articleTitle;
   Article.findOne({title:param}, (error, data) => {
   if(!error) res.status(200).send(data);
   else res.status(400).send("error occurred try again later");
   });
}).put((req, res) => {
    const param = req.params.articleTitle;
    const title = req.body.title;
    const content = req.body.content
    Article.replaceOne({title:param}, {title, content}, {overwrite: true}, (err, result) => {
        if(!err) res.status(201).send(result);
        else{
            console.log(err)
            res.status(400).send(err)
        };
    })
}).patch((req, res) => {
    const param = req.params.articleTitle;
    const title = req.body.title;
    const content = req.body.content
    Article.updateOne({title:param}, {title , content}, (err, result) => {
        if(!err) res.status(201).send(result);
        else{
            console.log(err)
            res.status(400).send(err)
        };
    });
}).delete((req, res) => {
    const title = req.params.articleTitle;
    Article.deleteOne({title}, (err) => {
        if(!err) res.status(200).send('Article deleted successfully');
        else res.send('Failed to delete article, try again later');
    })
})

app.listen(3000, () => console.log("Listening on port 3000"));