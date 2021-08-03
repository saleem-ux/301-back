'use strict';

const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

require('dotenv').config();
const PORT = process.env.PORT;

// mongoose.connect('mongodb://localhost:27017/drink', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

// http://localhost:3001/
app.get('/', (req, res) => {
    res.status(200).send('hello razan');
})

app.listen(PORT, () => {
    console.log(`razan the best ${PORT}`);
});

class Drinks {
    constructor(item) {
        this.strDrink = item.strDrink;
        this.strDrinkThumb = item.strDrinkThumb;
        this.idDrink = item.idDrink;
    }
}

const drinkSchema = new mongoose.Schema({
    strDrink: String,
    strDrinkThumb: String,
    idDrink: String
});
const userModel = new mongoose.Schema({
    email: String,
    data: [drinkSchema]
});

const favModel = mongoose.model('user', userModel);

function seedUser() {
    // const saleem = new favModel({
    const razan = new favModel({
        // email: 'saleem_diab86@yahoo.com',
        email: 'r.alquran@ltuc.com',
        data: [
            {
                strDrink: "Afterglow",
                strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/vuquyv1468876052.jpg",
                idDrink: "12560"
            },
            {
                strDrink: "Alice Cocktail",
                strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/qyqtpv1468876144.jpg",
                idDrink: "12562"
            },
            {
                strDrink: "Aloha Fruit punch",
                strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/wsyvrt1468876267.jpg",
                idDrink: "12862"
            },
            {
                strDrink: "Apello",
                strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/uptxtv1468876415.jpg",
                idDrink: "15106"
            }
        ]
    })
    // saleem.save();
    razan.save();
}
// seedUser();

// http://localhost:3001/api
app.get('/api', getApiData);
// http://localhost:3001/fav?email=saleem_diab86@yahoo.com
app.get('/fav', getFavData);
// http://localhost:3001/fav?email=saleem_diab86@yahoo.com
app.post('/fav', addFavData);
// http://localhost:3001/fav/:id?email=saleem_diab86@yahoo.com
app.delete('/fav/:id', deleteFavData);
// http://localhost:3001/fav/:id?email=saleem_diab86@yahoo.com
app.put('/fav/:id', updateFavData);

async function getApiData(req, res) {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    const apiData = await axios.get(url);
    console.log(apiData);
    const allData = apiData.data.drinks.map(item => {
        return new Drinks(item)
    })
    console.log(allData);
    res.send(allData);
}

function getFavData(req, res) {
    const email = req.query.email;
    favModel.findOne({ email: email }, (error, user) => {
        res.send(user.data)
    })
}

function addFavData(req, res) {
    const { email, strDrink, strDrinkThumb, idDrink} = req.body
    favModel.findOne({email: email}, (error, user)=>{
        const newFav = {
            strDrink: strDrink,
            strDrinkThumb: strDrinkThumb,
            idDrink: idDrink
        }
        user.data.push(newFav);
        user.save();
        res.send(user.data)
    })
}

function deleteFavData(req, res){
    const index = Number(req.params.id);
    const email = req.query.email;
    favModel.findOne({email: email}, (error, user)=>{
        user.data.splice(index, 1);
        user.save();
        res.send(user.data)
    })
}

function updateFavData(req, res){
    const {email, strDrink, strDrinkThumb, idDrink}= req.body;
    const index = req.params.id;
    favModel.findOne({email:email}, (error, user)=>{
        const newFav = {
            strDrink: strDrink,
            strDrinkThumb: strDrinkThumb,
            idDrink: idDrink
        }
        user.data.splice(index, 1, newFav);
        user.save();
        res.send(user.data);
    })
}