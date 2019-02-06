var express               = require("express"),
    app                   = express(),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

//mongoose.connect("mongodb://localhost/saraswatiPooja",{ useNewUrlParser: true });//testing
mongoose.connect("mongodb://SaurabhPanja:saurabh1@ds119755.mlab.com:19755/saraswatipooja",{ useNewUrlParser: true });//production

//Database Schema

var donarSchema = new mongoose.Schema({
  name   : String,
  amount : Number,
  paid   : Boolean
});

var Donar = mongoose.model("donars",donarSchema);
//app initialization


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Amra sobai kori Saraswati Pooja",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//naive login approach
app.get("/",function (req,res) {
  //can access only if logged in
  res.redirect('/donars');
});
// app.post("/",function(req,res){
//   if(Number(req.body.pin) === pin)
//     res.redirect('/donars');
//   else
//     res.redirect('/');
// });

//login
app.get('/login',function(req,res){
  res.render('login');
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Restful routes
//index route
app.get("/donars",isLoggedIn,function (req,res) {
  Donar.find({},function (err,data) {
    if (err) {
      console.log(err);
    }else {
      res.render("index",{donars:data,sum:0});
    }
  });
});

// //show
// app.get("/donars/show/:id",function (req,res) {
//   Donar.findById(req.params.id,function (err,data) {
//     if (err) {
//       console.log(err);
//     }else {
//       res.render("show",{blog:data});
//     }
//   });
// });
//new
app.get("/donars/new",isLoggedIn,function (req,res) {
  res.render("new");
});
//create route
app.post("/donars",isLoggedIn,function (req,res) {
  Donar.create({
    name   : req.body.username,
    amount : req.body.amount,
    paid   : req.body.paid
  },function (err,data) {
    if (err) {
      console.log(err);
    }else {
      res.redirect("/");
      console.log(data);
    }
  });
});
// update route
app.put("/donars/:id",isLoggedIn,function (req,res) {
  Donar.findByIdAndUpdate(req.params.id,req.body,function (err,data) {
    if (err) {
      console.log(err);
    }else {
      res.redirect("/");
      console.log(data);
    }
  });
});
// //delete route
// app.delete("/blogs/:id",function (req,res) {
//   Blog.findByIdAndRemove(req.params.id,function (err) {
//       if (err) {
//         console.log(err);
//       }else {
//         res.redirect("/");
//       }
//   });
// });
//edit route
app.get("/donars/:id/edit",isLoggedIn,function (req,res) {
  Donar.findById(req.params.id,function (err,data) {
    if (err) {
      console.log(err);
    }else {
      console.log(data);
      res.render("edit",{donars:data});
    }
  });
});
// //else if

//Paid
app.get('/showPaid',isLoggedIn,function(req,res){
  Donar.find({paid:true},function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('index',{donars:data,sum:0});
    }
  })
});
//unpaid
app.get('/showUnpaid',isLoggedIn,function(req,res){
  Donar.find({paid:false},function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('index',{donars:data,sum:0});
    }
  })
});

app.get("*",function (req,res) {
  res.send("Error 404");
});

//production
// app.listen(process.env.PORT,process.env.IP,function () {
//  //console.log("Server running on port 8080");
// });

//testing
app.listen(8080,function(req,res){
  console.log('Server running on port 8080');
});
