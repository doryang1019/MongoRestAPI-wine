const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://fullstack:fullstack@cluster0.vp4srop.mongodb.net/wineDatabase")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log('failed');
})


const newSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
// {"productName":"Pêra-Manca Tinto 1990","quantity":2,"itemPrice":18.5,"totalPrice":37}
const productSchema = new mongoose.Schema({
    winery: String,
    wine: String,
    rating: {
      average: String,
      reviews: String
    },
    location: String,
    image: String,
    id: Number,
    price: Number,
  });


const orderSchema = new mongoose.Schema({
    email: String,
    productName: String,
    itemPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    quantity: Number,
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})
const wines = [
    {"winery":"Maselva","wine":"Emporda 2012","rating":{"average":"4.9","reviews":"88 ratings"},"location":"Spain\n·\nEmpordà","image":"https://images.vivino.com/thumbs/ApnIiXjcT5Kc33OHgNb9dA_375x500.jpg","id":1, "price": 29.99},
    {"winery":"Ernesto Ruffo","wine":"Amarone della Valpolicella Riserva N.V.","rating":{"average":"4.9","reviews":"75 ratings"},"location":"Italy\n·\nAmarone della Valpolicella","image":"https://images.vivino.com/thumbs/nC9V6L2mQQSq0s-wZLcaxw_pb_x300.png","id":2, "price": 45.75},
    {"winery":"Cartuxa","wine":"Pêra-Manca Tinto 1990","rating":{"average":"4.9","reviews":"72 ratings"},"location":"Portugal\n·\nAlentejo","image":"https://images.vivino.com/thumbs/L33jsYUuTMWTMy3KoqQyXg_pb_x300.png","id":3, "price": 18.50},
    {"winery":"Schrader","wine":"Cabernet Sauvignon RBS Beckstoffer To Kalon Vineyard 2015","rating":{"average":"4.9","reviews":"72 ratings"},"location":"United States\n·\nOakville","image":"https://images.vivino.com/thumbs/GpcSXs2ERS6niDxoAsvESA_pb_x300.png","id":4, "price": 64.25},
    {"winery":"Hundred Acre","wine":"Wraith Cabernet Sauvignon 2013","rating":{"average":"4.9","reviews":"68 ratings"},"location":"United States\n·\nNapa Valley","image":"https://images.vivino.com/thumbs/PBhGMcRNQ7aVnVNr7VgnWA_pb_x300.png","id":5, "price": 89.00},
    {"winery":"Sine Qua Non","wine":"Ratsel Syrah N.V.","rating":{"average":"4.9","reviews":"68 ratings"},"location":"United States\n·\nCalifornia","image":"https://images.vivino.com/thumbs/ZzMKzqFqRO-6oI3ys3gGgQ_pb_x300.png","id":6, "price": 37.80},
    {"winery":"Del Dotto","wine":"The Beast Cabernet Sauvignon 2012","rating":{"average":"4.9","reviews":"60 ratings"},"location":"United States\n·\nRutherford","image":"https://images.vivino.com/thumbs/easjTPIcS-mCQ99XoYOMgQ_pb_x300.png","id":7, "price": 72.60},
    {"winery":"Darioush","wine":"Darius II Cabernet Sauvignon 2016","rating":{"average":"4.9","reviews":"59 ratings"},"location":"United States\n·\nNapa Valley","image":"https://images.vivino.com/thumbs/U19RXtSdRMmoAesl2CBygA_pb_x300.png","id":8, "price": 55.40},
    {"winery":"Garbole","wine":"Hurlo 2009","rating":{"average":"4.9","reviews":"55 ratings"},"location":"Italy\n·\nVeneto","image":"https://images.vivino.com/thumbs/f_G1SS0eT_C6hZGGwdEZqA_pb_x300.png","id":9, "price": 28.75}
  ];

const user = mongoose.model("User",newSchema);
const order = mongoose.model("Order", orderSchema);
const product = mongoose.model("Product", productSchema);
product.deleteMany({}).then(() => {
    console.log("drop all the product data first");
    product.insertMany(wines)
    .then(() => console.log("insert success"))
    .catch((err) => console.log("error"));
});
module.exports= {user, order, product}
