const mongoose = require('mongoose');

const db = mongoose.connect("mongodb://bmtmain:h3l5yz41duw1fsr5@185.193.66.62:27017/?authMechanism=DEFAULT&tls=false")
                    .then(() => console.log("DB connection successfull"))
                    .catch(() => console.log("DB connection failed"));

return db
