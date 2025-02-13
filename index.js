const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const { checkForAuthenticationCookie } = require('./middlewares/authentication')
const Blog = require('./models/blogModel')

const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

// Mongodb Connection
mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(()=> console.log("Mongodb connected"))

const app = express()
const PORT = 8000

// Template Engine Setup by ejs
app.set("view engine", "ejs")
app.set("views", path.resolve('./views'))

// Middlewares
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))  // for intimating express that ./public servers as a static folder

// Routes
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    return res.render("home", {
        user : JSON.stringify(req.user),
        blogs : allBlogs
    })
})


// Server started
app.listen(PORT, () => {
    console.log(`Server Started at : http://localhost:${PORT}`)
}) 