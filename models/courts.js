var mongoose = require("mongoose");

var courtsSchema = new mongoose.Schema({
    name: String,
    map: String,
    details: String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Courts", courtsSchema);