const mongoose = require('mongoose')


const categorySection = new mongoose.Schema({

    categoryName: {
        type:string,
        required:true
    }


})