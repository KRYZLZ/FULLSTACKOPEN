const _ = require('lodash')

const favoriteBlog = async ({ Blog }) => {
    const favorite = await Blog.findOne().sort({ likes: -1 })
    if (favorite) {
        return {
            title: favorite.title,
            author: favorite.author,
            likes: favorite.likes
        }
    } else {
        return null
    }
}

const mostBlogs = async ({ Blog }) => {
    const blogs = await Blog.find({})

    if (blogs.length === 0) {
        return {}
    }

    const authorCount = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(Object.keys(authorCount), (author) => authorCount[author])

    return {
        author: topAuthor,
        blogs: authorCount[topAuthor]
    }
}

const mostLikes = async ({ Blog }) => {
    const blogs = await Blog.find({})
    if (blogs.length === 0) {
        return {}
    }

    const authorLikes = _(blogs)
        .groupBy('author')
        .map((authorBlogs, author) => ({
            author,
            likes: _.sumBy(authorBlogs, 'likes')
        }))
        .maxBy('likes')

    return authorLikes
}

module.exports = { favoriteBlog, mostBlogs, mostLikes }