const { Router } = require('express')
const multer = require('multer')
const path = require('path')

const Blog = require('../models/blogModel')

const router = Router()

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb){
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const upload = multer({storage})

router
    .route('/add-blog')
    .get((req, res) => {
        return res.render('addBlog', {
            user: req.user
        })
    })

router
    .route('/')
    .post(upload.single('coverImage') , async (req, res) => {
        const {body, title } = req.body
        const blog = await Blog.create({
            body,
            title,
            coverImageURL: `/uploads/${req.file.filename}`
        })
        return res.redirect(`/blog/${blog._id}`)
    })

module.exports = router 