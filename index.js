var express = require("express"),
    mongoose = require("mongoose"),
    mongodb = require("mongodb"),
    mongoClient = mongodb.MongoClient,
    app = express(),
    assert = require('assert'),
    methodOverride = require("method-override"),
    bodyParser  = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passport    = require("passport"),
    courts = require("./models/courts"),
    comments = require("./models/comments"),
    user = require("./models/user"),
    midObj = require("./midware/midw.js"),
    seed = require("./seed");
    
//config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seed
// seed(); 

//db config
// mongodb://ball:islife@ds159013.mlab.com:59013/lookuppickup
var MONGOHQ_URL =  "mongodb://localhost/lookuppickup"
mongoose.connect("mongodb://localhost/lookuppickup", {
  useMongoClient: true,
});



// config passport
app.use(require("express-session")({
    secret: "Ball is life",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//have user 
app.use(function(req, res, next){
   res.locals.activeUser = req.user;
   next();
});

//homepage--------------------------------
app.get("/", function(req, res){
    res.render("homepage");
})

//courts----------------------------------
app.get("/courts", function(req, res){
    courts.find({}, function(err, allCourts){
        if(err){
            res.redirect("back");
        } else{
            res.render("courts", {courts: allCourts});
        }
    });
})

app.get("/courts/new", function(req, res){
    res.render("courtNew");
})

app.post("/courts/new", function(req, res){
    courts.create(req.body.court , function(err, newCourt){
        if(err){
            res.redirect("back");
        } else{
            console.log(newCourt);
            res.redirect("/courts");
        }
    });
})

app.get("/courts/:id", function(req, res){
    courts.findById(req.params.id).populate("comments").exec(function(err, court){
       if(err){
           res.redirect("back");
       } else{
           res.render("courtDetail", {court, court});
       }
    });
})

//registration and login-------------------------------------
app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/courts",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/signup", function(req, res){
    res.render("signup");
})

app.post("/signup", function(req, res){
    var newUser = new user({username: req.body.username});
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            res.redirect("back")
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/courts"); 
        });
    });
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/courts");
});

//comments-----------------------------------------------
app.post("/courts/:id/comments", midObj.isLogged ,function(req, res){
    courts.findById(req.params.id, function(err, court){
        if(err){
            res.redirect("back");
        } else{
            var newComment = {
                creator: {
                    id: req.user.id,
                    username: req.user.username
                },
                text: req.body.comment
            };
            comments.create(newComment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    comment.save();
                    court.comments.push(comment);
                    court.save();
                    console.log(court);
                    //added comment to court
                    res.redirect('/courts/' + court.id);
                }
            })
        }
    });
});

app.put("/courts/:id/comments/:comment_id", function(req, res){
    comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/courts/" + req.params.id);
        }
    })
})

app.delete("/courts/:id/comments/:comment_id", function(req, res){
    comments.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/courts/" + req.params.id);
        }
    })
})

//profile---------------------------------------------------------
app.get("/profile/:username/:id", function(req, res){
    user.findById(req.params.id, function(err, user){
        if(err){
            res.redirect("back");
        }else{
            res.render("profile", {user, user});
        }
    })
})

app.get("/profile/:username/edit", function(req, res){
    res.render("profileEdit");
})

//search ---------------------------------------------------------
app.get("/search", function(req, res){
    db.collection('textstore').find({
    "$text": {
      "$search": req.body.query
        }
      },{
      name: 1,
      
      textScore: {
        $meta: "textScore"
      }
    },{
    sort: {
      textScore: {
$meta: "textScore"
      }
    }
  }).toArray(function(err, courts) {
    res.render("search", {courts: courts});
  })
});


var db;
mongoClient.connect(MONGOHQ_URL, function(err, database) {  
  db = database;
  db.collection("courts", { }, function(err, coll) {
      if (err != null) {
      db.createCollection("textstore", function(err, result) {
        assert.equal(null, err);  
      });
    }
    db.ensureIndex("courts", {  
      name: "text"
    }, function(err, indexname) {
      assert.equal(null, err);
    });
    app.listen(3000);
      });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server up");
});