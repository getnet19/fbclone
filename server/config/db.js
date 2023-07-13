const mongodb = require("mongoose");

const DBCONNECTON = () => {
    mongodb
        .connect(process.env.DBURL)
        .then(() => {
            console.log("DB CONNECTION is Successfuly");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = DBCONNECTON;
