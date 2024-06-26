import { json } from "stream/consumers";

const API_KEY = "13290a0565e22931273afb470ac796f9";
const BASE_PATH= "https://api.themoviedb.org/3";


interface IMovie {
    id : number;
    backdrop_path : string;
    poster_path : string;
    title : string;
    overview: string;
    release_date: string;
    popularity:number;
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

export interface IMoiveDetail {
    id: number;
    overview: string;
    popularity: number;
    tagline: string;
    title: string;
    backdrop_path: string;
    poster_path: string;
    genres: [
      {
        id: number;
        name: string;
      },
    ],
    production_countries: [
        {
          iso_3166_1: string,
        }
      ],
    release_date: string;
    runtime: number;
    
}


export interface ICredits {
  id:number;
  cast : [ 
    {
    character: string,
    gender:number,
    name: string,
    profile_path: string,
    },
  ]
}

export interface ISimilar {
  results : IMovie[];
  gender: [
    {
      id: number;
    },
  ],
}

interface Trailer {
  key: string;
  site: string;
  id:string;
}

export interface ITrailer {
  id: number;
  results: Trailer[];
}

export interface IMedia {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  title: string;
  original_title: string;
  media_type: string;
  first_air_date?: string;
  name?: string;
  origin_country?: string[];
  original_name?: string;
  adult?: boolean;
  release_date?: string;
  video?: boolean;
  keyword :string
}



export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};

export function getMovieDetail( id : string ){
    return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((req)=> req.json());
};

export function getTopMovies(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};

export function getCommingMovies(){
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};

export function getPopularMovies(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};


export function getSimilarMovies( id : string ){
    return fetch(`${BASE_PATH}/movie/${id}/similar?api_key=${API_KEY}`).then(
        (responce)=>responce.json());
};


export function getCredits (id:string) {
  return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}`).then(
    (responce)=>responce.json());
}

export function getVideo (id:string) {
  return fetch(`${BASE_PATH}/movie/${id}/videos?api_key=${API_KEY}`).then(
    (responce)=>responce.json());
}

export function getSearch ( keyword :string) {
  return fetch( `${BASE_PATH}/search/movie?query=${keyword}&api_key=${API_KEY}`).then(
    (responce)=>responce.json());
}