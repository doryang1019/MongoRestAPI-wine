const express = require("express")
const collection = require("./mongo.js")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const http = require('http');

app.get("/", cors(), (req, res) => {
    res.json("hihi");
})

app.get("/api/products/all", async (req, res) => {
    try {
        const datas = await collection.product.find({}).sort({price :1});

        const result = datas.map((x) => {
            return {
                id: x._id,
                winery: x.winery,
                wine: x.wine,
                price: x.price,
                image: x.image,
                rating: x.rating.reviews
            }
        });
        // .sort((a, b) => Number(a.price) - Number(b.price));
        // console.log(datas);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
})


app.post("/", async (req, res) => {
    const { email, password } = req.body

    try {
        const check = await collection.user.findOne({ email: email })

        if (check) {
            res.json("exist")
        }
        else {
            res.json("notexist")
        }

    }
    catch (e) {
        res.json("fail")
    }

})



app.post("/signup", async (req, res) => {
    console.log("123")
    const { email, password, username } = req.body

    const data = {
        email: email,
        password: password,
        username: username
    }

    try {
        const check = await collection.user.findOne({ email: email })

        if (check) {
            res.json("exist")
        }
        else {
            res.json("notexist")
            await collection.user.insertMany([data])
        }

    }
    catch (e) {
        res.json("fail")
    }

});
app.post('/api/orders/processing', async (req, res) => {
    try {
        const result = await collection.order.find();
        for (const order of result) {
            var filter = { _id: order._id };
            var update = { $set: { status: "Processing" } };

            await collection.order.updateOne(filter, update);
        }

        res.json("Success");
    } catch (err) {
        res.status(500).json({ error: "Internal server error: " + err });
    }

})

app.put('/api/orders/checkout', async (req, res) => {
    try {
        const result = await collection.order.find({status: "Pending"});
        let sum = 0;

        for (const order of result) {
            var filter = { _id: order._id };
            console.log(order);
            var update = { $set: { status: "Checkout" } };
            sum += order.totalPrice;
            await collection.order.updateOne(filter, update);
        }

        const history = new collection.history({
            totalPrice: sum, createdAt: new Date()
        });
        await history.save();
        res.json("Success");
    } catch (err) {
        res.status(500).json({ error: "Internal server error: " + err });
    }

})

app.get('/api/orders', async (req, res) => {
    try{
        const result = await collection.order.find({status: "Pending"}).sort({createdAt: -1});
        console.log(result.length);
        res.json(result);
    }catch(err) {
        res.status(500).json({ error: "Internal server error" + err });
    }
})

app.get('/api/history', async (req, res) => {
    try{
        const result = await collection.history.find().sort({createdAt: -1});
        res.json(result);
    }catch(err) {
        res.status(500).json({ error: "Internal server error" + err });
    }
})

app.post('/api/orders', async (req, res) => {
    try {
        const {totalPrice, itemPrice, productName, email,quantity } = req.body;
        console.log("req.body" + req.body);
        const newOrder = new collection.order({
            totalPrice, status: 'Pending', createdAt: new Date(),itemPrice, productName, email,quantity
        });
        const saveOrder = await newOrder.save();
        res.status(201).json(saveOrder);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" + err });
    }
})
const server = http.createServer(app);
server.listen(8000, () => {
    console.log(`port connected!`);
});


