const express=require('express');
const server=express();
require('dotenv').config();
const axios=require('axios');
const cors =require('cors');
const PORT=process.env.PORT
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`${process.env.MONGO_URL}`);
}



server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})

// http://localhost:3001

server.get('/apidata',async(req,res)=>{
    // console.log('welcome to my api');
    let ApiData=await axios.get(`https://ltuc-asac-api.herokuapp.com/allChocolateData`)
    // console.log(ApiData);
    let ApiDataList=ApiData.data.map(item=>{
        return new AllApiData(item.title,item.imageUrl)
    })
    // console.log(ApiDataList);
    res.send(ApiDataList)

})


server.post('/addedtofav',async (req,res)=>{
    console.log(req.body);
    const AddedItems = new MyFav(
        req.body
        );
    await AddedItems.save()
    MyFav.find({email:req.body.email},(error,MyFavData)=>{
        if(error){
            console.log('Error in Adding Data to my fav');
        }else{
        //    console.log(MyFavData); 
        res.send(MyFavData)
        }
    })
})

server.get('/myfavoraties',(req,res)=>{
    // console.log(req.query.email);
    MyFav.find({email:req.query.email},(error,MyFavData)=>{
        if(error){
            console.log('Error in Adding Data to my fav');
        }else{
        //    console.log(MyFavData); 
        res.send(MyFavData)
        }
    })
})

server.delete('/deleteitem/:id',(req,res)=>{
    // console.log(req.query);
    // console.log(req.params.id);
    let email=Object.values(req.query)
    // console.log(email);

    MyFav.deleteOne({_id:req.params.id},(error,DeletedItem)=>{
        if(error){
            console.log('Error in deleting the item');
        }else{
            // console.log(DeletedItem);
            MyFav.find({email:email[0]},(error,MyFavorites)=>{
                if(error){
                    console.log('error in deleting the item');
                }else {
                    // console.log(MyFavorites); 
                    res.send(MyFavorites)
                }
            })
        }
    })
})


server.put('/updateitem',(req,res)=>{
    // console.log(req.body);
    MyFav.findOneAndUpdate({_id:req.body.id},{title:req.body.title,imageUrl:req.body.image},{new:true},(err)=>{
        if(err){
            console.log('Error in updating data');
        }else{
            MyFav.find({email:req.body.useremail},(error,UpdatedData)=>{
                if(error){
                    console.log('Error in Updating the data');
                }else{
                    // console.log(UpdatedData);
                    res.send(UpdatedData)
                }
            })
        }
    })
})
// defining my schema and my model for mongodb

const MyFavSchema = new mongoose.Schema({
    title: String,
    imageUrl:String,
    email:String
  });


const MyFav = mongoose.model('MyFav', MyFavSchema);


server.get('/*',(req,res)=>{
    res.send('Error in the request syntax please change you querys!')
})


class AllApiData{
    constructor(title,imageUrl){
        this.title=title;
        this.imageUrl=imageUrl
    }
}