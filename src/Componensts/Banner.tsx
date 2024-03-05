import styled from "styled-components";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPlay , faCircleInfo, faMedal } from "@fortawesome/free-solid-svg-icons";
import {  getPopularMovies, IGetMoviesResult } from "../api";

const BannerWrapper  = styled.div<{ bgPhoto : string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)) , 
                      url(${(props)=> props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;

const Overview = styled.p`
    font-size: 20px;
    width: 50%;
    font-weight: bolder;
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;

const MoviRank = styled.p`
    font-size: 30px;
    margin-bottom: 20px;
    font-weight: bolder;
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);

`

const OverviewBtn = styled(motion.button)`
    border: none;
    background-color: ${(props)=>props.theme.white.lighter};
    color : ${(props)=>props.theme.black.lighter};
    width: 150px;
    height: 50px;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    &:hover {
        background-color: rgb(255, 255, 255, 0.5);
    } 
`;



function Banner () {
    const { isLoading : popularLoading , data: popularData } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
    const movieHistory = useNavigate();
    const boxClick = (movieId:number) => {
        movieHistory(`/movies/${movieId}`);
    };

    return (
        <BannerWrapper  bgPhoto={makeImgPath(popularData?.results[1].backdrop_path || "")}>
        <Title>{popularData?.results[1].title}</Title>
        <MoviRank>
            <FontAwesomeIcon icon={faMedal} style={{ color : "rgb(229, 9, 20)", paddingRight: 5}}/> 
            popular movies today
        </MoviRank>
        <AnimatePresence>
        <Overview>{popularData?.results[1].overview}</Overview>
        <div style={{ display:"flex", justifyContent: "flex-start", position:"relative", top:20}}>
            <OverviewBtn>
            <FontAwesomeIcon icon={faPlay} style={{fontSize: 20, paddingRight:10}}/>
                Play
            </OverviewBtn>
        </div>
        <div style={{ display:"flex", justifyContent: "flex-start", position:"relative", top:-30, left: 170}}>
            <OverviewBtn 
                onClick={()=> boxClick(popularData?.results[1].id!)}>
            <FontAwesomeIcon icon={faCircleInfo}  style={{fontSize: 20, paddingRight:10}}/>
                More Info
            </OverviewBtn> 
        </div>
        </AnimatePresence>
    </BannerWrapper>
);
}


export default Banner;