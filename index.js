import { getComments } from './modules/commentsApi.js'
import { renderComments } from './modules/renderComments.js'
import {attachAddCommentHandler} from "./modules/attachHandlers.js";

export let comments = []

function loadComments() {
    return getComments().then((data) => {
        comments = data.map((c) => ({
            ...c,
            name: c.author.name,
            date: new Date(c.date).toLocaleString(),
            quote: '',
            quoteAuthor: '',
            likesCount: c.likes ?? 0,
            isLiked: false,
        }))
        renderComments()
    })
}

attachAddCommentHandler();
loadComments()