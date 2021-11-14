require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const app = express()
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');
var path = require('path')
app.use(express.static(path.join(__dirname, 'public')));


const Food = require('./models/food')
// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));

// set up mongo connection 


const dbURI = "mongodb+srv://vinay:vinay2071@cluster0.pdcis.mongodb.net/flipr?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));


  app.get('/order', (req, res) => {
    Food.find()
      .then(result => {
        console.log(result)
        res.render('order', {foods:result});
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  app.post('/order', (req, res) => {
    console.log(req.body);
    const flipr  = new Food(req.body);

    flipr.save()
      .then(result => {
        res.redirect('/order');
      })
      .catch(err => {
        console.log(err);
      });
  });

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/', (req, res) => res.render("index"))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) =>{
    res.render("profile",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
})

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

// add restaurant
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})





//Add reswebsite
app.get('/addrest', (req, res) => { 
  res.render("addres")
})
// add hotel addres
app.get('/addhotel', (req, res) => { 
  res.render("addhotel")
})



//  let output;
// fetch(
// `https://maps.googleapis.com/maps/api/geocode/json?address=${address_variable}&key=AIzaSyACxL5Qd3gp4-wYl5tOjiYTlIqXRvQbIAc`).then(res =>
//             res.json()).then(data => {
//             output=data
// 	    console.log(output)   
//             }).catch((e)=>{
// console.log(e)
// })

// lat_1= output.geometry.location.lat;
// lng_1=output.geometry.location.lng;
// place_id_1=output.place_id;

// JSONObject coords_1= new JSONObject();
// coords_1.put("lat",lat_1 );
// coords_1.put("lng", lng_1);

// String message;
// JSONObject json = new JSONObject();

// json.put("title",);
// json.put("address1",);
// json.put("address2",);
// json.put("coords","coords_1");
// json.put("placeId",place_id_1);
// {"title":"Hotels in Delhi India","address1":"222 Jaina Tower - II","address2":"District Center Janakpuri, Janakpuri District Center, Janakpuri, New Delhi, Delhi 110058, India","coords":{"lat":28.629403892370927,"lng":77.08211803558197},"placeId":"ChIJAQAwHL8EDTkRAgbIGHRI_-c"},
// console.log(json);
// var locationarr=CONFIGURATION.locations[];
// const obj=JSON.parse(locationarr);
// obj["locations"].push(json);
// locationarr=JSON.stringify(obj);






































app.listen(5000, () => console.log(`Example app listening on port ${5000}!`))