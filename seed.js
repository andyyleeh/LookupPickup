var mongoose = require("mongoose"),
    courts = require("./models/courts"),
    comments = require("./models/comments");
    
var data = [
    {
        name: "Park at metro George Vanier",
        location: "Rue Canning/Rue Coursol Near Metro George Vanier",
        map: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.0498533594573!2d-73.57743862444556!3d45.488940825493785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x12db7d8f3a522447!2sParc+Oscar-Peterson!5e0!3m2!1sen!2sca!4v1503167136538" width="400" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>'
    },
    {
        name: "Parc Pellan",
        location: "On street Pellan in Brossard",
        map: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.7407576844334!2d-73.48760278477319!3d45.475025940742526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc905686fed7f59%3A0xe37e9b20da37b978!2sParc+Pellan!5e0!3m2!1sen!2sca!4v1503167334020" width="400" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>'
    }];
    
function seedDB(){
   //Remove all campgrounds
   courts.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("emptied courts");
         //add a few campgrounds
        // data.forEach(function(seed){
        //     courts.create(seed, function(err, campground){
        //         if(err){
        //             console.log(err)
        //         } else {
        //             console.log("created court");
        //         }
        //     });
        // });
    }); 
}

module.exports = seedDB;
