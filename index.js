const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes')
const { checkForAuthenticationCookie } = require('./middlewares/authentication')

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

// Routes
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    return res.render("home", {
        user : JSON.stringify(req.user)
    })
})


// Server started
app.listen(PORT, () => {
    console.log(`Server Started at : http://localhost:${PORT}`)
}) 