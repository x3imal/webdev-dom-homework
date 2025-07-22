import { showQuoteBlock } from './modules/showQuoteBlock.js'
import { renderComments } from './modules/renderComments.js'
import { attachCommentReply } from './modules/attachCommentReply.js'
import { attachLikeListeners } from './modules/attachLikeListeners.js'
import { getComments, postComment} from "./modules/commentsApi.js";

const commentsList = document.querySelector('.comments')
const button = document.querySelector('.add-form-button')
const input = document.querySelector('.add-form-name')
const textarea = document.querySelector('.add-form-text')

export let comments = [];

async function renderAll() {
    try {
        const rawComments = await getComments();

        comments = rawComments.map((c) => ({
            ...c,
            isLiked: false,
            likesCount: c.likes ?? 0,
        }));

        renderComments({
            commentsList,
            textarea,
            showQuoteBlock,
            attachLikeListeners: () =>
                attachLikeListeners({
                    commentsList,
                    textarea,
                    showQuoteBlock,
                    attachLikeListeners,
                    attachCommentReply,
                    comments,
                }),
            attachCommentReply: () =>
                attachCommentReply({ textarea, showQuoteBlock }),
            comments,
        });
    } catch (e) {
        alert(e.message);
    }
}


button.addEventListener('click', async () => {
    input.classList.remove('error');
    textarea.classList.remove('error');

    const name = input.value.trim();
    const text = textarea.value.trim();
    const quote = textarea.dataset.quote || '';
    const quoteAuthor = textarea.dataset.quoteAuthor || '';

    if (!name || !text) {
        alert('Заполни все поля');
        input.classList.add('error');
        textarea.classList.add('error');
        return;
    }

    try {
        await postComment({ name, text });
        input.value = '';
        textarea.value = '';
        textarea.quote = '';
        textarea.quoteAuthor = '';

        let oldQuote = document.querySelector('.js-quote-block');
        if (oldQuote) oldQuote.remove();

        await renderAll();
    } catch (e) {
        alert(e.message);
    }
});

renderAll();
