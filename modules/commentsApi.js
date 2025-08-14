const API_URL = "https://wedev-api.sky.pro/api/v1/alex-kaz/comments";

export function getComments() {
    return fetch(API_URL)
        .then((res) => {
            if (!res.ok) throw new Error("Ошибка загрузки комментариев");
            return res.json();
        })
        .then((data) => data.comments);
}

export function postComment({ text, name }) {
    return fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ text, name }),
    }).then(async (res) => {
        if (res.status === 400) {
            const err = await res.json();
            throw new Error(err.error);
        }
        if (!res.ok) throw new Error("Ошибка отправки комментария");
        return res.json();
    });
}
