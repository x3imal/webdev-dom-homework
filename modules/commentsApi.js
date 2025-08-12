const API_URL = "https://wedev-api.sky.pro/api/v1/alex-kaz/comments";

export async function getComments() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Ошибка загрузки комментариев");
    const data = await res.json();
    return data.comments;
}

export async function postComment({ text, name }) {
    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ text, name }),
    });
    if (res.status === 400) {
        const err = await res.json();
        throw new Error(err.error);
    }
    if (!res.ok) throw new Error("Ошибка отправки комментария");
    return await res.json();
}
