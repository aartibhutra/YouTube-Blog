const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;
mongoose.connect("mongodb://localhost:27017/Blogora").then(e => console.log("MongoDB connected")).catch(e => console.log(e));

// form data parsing middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.get('/' , (req , res) => {
    res.render("home" , {
        user: req.user,
    });
});

app.use('/user', userRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));