var express = require('express');
var router = express.Router();
const {mongodb,dbName,dbUrl} = require('../config/dbConfig')
const {mongoose,usersModel,foodModel,orderModel} = require('../config/dbSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validateToken,adminGaurd} = require('../config/auth');
const { ObjectId } = require('mongodb');
mongoose.connect(dbUrl)

exports.handler= async (event,context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':'Content-Type'
  };
  return{
    statusCode:200,
    headers,
    body:JSON.stringify(data),
  };
};

router.get('/all-food',validateToken,async(req, res)=>{
  try {
    let food = await foodModel.find()
    res.send({
      statusCode:200,
      food
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
});

router.post('/add-food',validateToken,adminGaurd,async(req,res)=>{
  try {
    let food = await foodModel.create(req.body)
    res.send({
      statusCode:200,
      message:"Food Added Successfully",
      food
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

router.delete('/delete-food/:id',validateToken,adminGaurd,async(req,res)=>{
  try {
    console.log("inside try")
    let food = new ObjectId(req.params.id);
    console.log("food:",food)
    let food1 = await foodModel.findByIdAndDelete(food)
    
    // let food = await foodModel.deleteOne({_id:mongodb.ObjectId(req.params.id)})
    res.send({
      statusCode:200,
      message:"Food Deleted Successfully"
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

router.post('/order',validateToken, async(req,res)=>{
  try {
    let food = await orderModel.create(req.body)
    res.send({
      statusCode:200,
      message:"Order Placed Successfully",
      food
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

//display in admin
router.get('/orders',validateToken,adminGaurd,async(req,res)=>{
  try {
    let orders = await orderModel.find()
    res.send({
      statusCode:200,
      orders
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

//Indivudual Order
router.get('/orders/:id',validateToken,adminGaurd,async(req,res)=>{
  try {

    let order1= new ObjectId(req.params.id)
    let order = await orderModel.findOne(order1)
    res.send({
      statusCode:200,
      order
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

router.put('/order-status/:id',validateToken,adminGaurd,async(req,res)=>{
  try {
    let order1= new ObjectId(req.params.id)
    let order = await orderModel.findOne(order1)
    if(order)
    {
      let newStatus = ""
      switch(order.status)
      {
        case "Ordered": newStatus="Placed"
                        break;
        case "Placed": newStatus="In-Transit"
                        break;
        case "In-Transit": newStatus="Delivered"
                        break;
        default: res.send({
          statusCode:401,
          message:"Invalid Status"
        })
      }
     if(newStatus){
      order.status=newStatus
      await order.save()
      res.send({
        statusCode:200,
        message:"Status Changed Successfully"
      })
     }
    }
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

module.exports = router;
