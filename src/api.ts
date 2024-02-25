import { json } from "stream/consumers";

const API_KEY = "13290a0565e22931273afb470ac796f9";
const BASE_PATH= "https://api.themoviedb.org/3";


interface IMovie {
    id : number;
    backdrop_path : string;
    poster_path : string;
    title : string;
    overview: string;
}


export interface IGetMoviesResult{
    datas : {
        maximum: string;
        minimum:string;
    };
    page : number;
    results : IMovie[];
    total_pages : number;
    total_results: number;
}

export interface IGetMovieRank {
    page : number;
    results : IMovie[];
}



export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};

export function getTopMovies(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};

export function getPopularMovies(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};
