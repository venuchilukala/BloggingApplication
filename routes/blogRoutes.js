const { Router } = require('express')
const multer = require('multer')
const path = require('path')

const Blog = require('../models/blogModel')
const Comment = require('../models/commentModel')

const router = Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const upload = multer({ storage })


router
    .route('/add-blog')
    .get((req, res) => {
        return res.render('addBlog', {
            user: req.user
        })
    })

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            const blog = await Blog.findById(req.params.id).populate("createdBy");
            const comments = await Comment.find({blogId: blog._id}).populate("createdBy")
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            return res.render("blog", {
                blog,
                comments,
                user: JSON.stringify(req.user)
            });
        } catch (error) {
            console.error("Error fetching blog:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    })


/***************************** Comment Routes ****************************************/

router
    .route('/comment/:blogId')
    .post(async (req, res) => {
        await Comment.create({
            content: req.body.content,
            blogId : req.params.blogId,
            createdBy : req.user._id
        })
        return res.redirect(`/blog/${req.params.blogId}`)
    })

/**************************************************************************************/

router
    .route('/')
    .post(upload.single('coverImage'), async (req, res) => {
        const { body, title } = req.body
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`
        })
        return res.redirect(`/blog/${blog._id}`)
    })

module.exports = router 