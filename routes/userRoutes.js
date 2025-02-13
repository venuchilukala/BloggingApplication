const { Router } = require('express')
const User = require('../models/userModel')

const router = Router()

router
    .route('/signup')
    .get((req, res) => {
        return res.render("signup")
    }).post(async (req, res) => {
        const { fullName, email, password } = req.body;

        await User.create({
            fullName,
            email,
            password
        })
        return res.redirect("/")
    })

router
    .route('/signin')
    .get((req, res) => {
        return res.render("signin")
    }).post(async (req, res) => {
        const { email, password } = req.body;
        try {
            const token = await User.matchPasswordAndGenerateToken(email, password)
            return res.cookie('token', token).redirect("/")

        } catch (error) {
            return res.render('signin', {
                error : "Incorrect Password or email"
            })
        }

    })

router
    .route('/logout')
    .get((req, res)=>{
        return res.clearCookie('token').redirect('/')
    })

module.exports = router 