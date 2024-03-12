
export function makeImgPath(id:string, format?:string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
};


export function makeVideoPath(key?:string) {
    return  `https://www.youtube.com/embed/${key}`;
};