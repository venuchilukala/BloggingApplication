const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const userRoutes = require('./routes/userRoutes')

// Mongodb Connection
mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(()=> console.log("Mongodb connected"))

const app = express()
const PORT = 8000

// Template Engine Setup by ejs
app.set("view engine", "ejs")
app.set("views", path.resolve('./views'))

// Middlewares
app.use(express.urlencoded({extended: false}))

// Routes
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    return res.render("home")
})


// Server started
app.listen(PORT, () => {
    console.log(`Server Started at : http://localhost:${PORT}`)
}) 