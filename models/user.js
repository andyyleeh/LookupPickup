var mongoose = require("mongoose");
var passportLocal = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    friends: [
            {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
          }
        ]
});

userSchema.plugin(passportLocal);

module.exports = mongoose.model("User", userSchema);