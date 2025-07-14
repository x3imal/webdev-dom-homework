import { escapeHTML } from './escapeHTML.js'

export function showQuoteBlock(quoteText, quoteAuthor, textarea) {
    let oldQuote = document.querySelector('.js-quote-block')
    if (oldQuote) oldQuote.remove()

    const div = document.createElement('div')
    div.className = 'js-quote-block'
    div.style =
        'margin:8px 0;padding:6px 10px;border-left:3px solid #bbb;background:#f8f8f8;color:#555;font-style:italic;display:flex;align-items:center;'
    div.innerHTML = `"${escapeHTML(quoteText)}" <b>(${escapeHTML(quoteAuthor)})</b>
      <button style="margin-left:auto;background:none;border:none;font-size:18px;cursor:pointer;color:#888;" title="Убрать цитату">&times;</button>`

    div.querySelector('button').onclick = function () {
        div.remove()
        textarea.dataset.quote = ''
        textarea.dataset.quoteAuthor = ''
    }

    textarea.parentNode.insertBefore(div, textarea)
}
