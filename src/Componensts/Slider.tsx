import { useQuery } from "react-query";
import {  getMovieDetail, getMovies, IMoiveDetail, IGetMoviesResult} from "../api";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark , faCircleInfo,faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";


const SliderWrrper = styled.div`
    position: relative;
    top: -150px;
    left: 20px;
    right: -50px;
    z-index: 0;
`;


const SliderLeftBtn = styled.button`
    border: none;
    width: 50px;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.5);
    color: ${(props)=> props.theme.white.darker};
    font-size: 35px;
    z-index: 5;
    position: relative;
    top: 150px;
    left: -10px;
    cursor: pointer;
`;



const SliderRightBtn = styled.button`
    border: none;
    width: 50px;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.5);
    color: ${(props)=> props.theme.white.darker};
    font-size: 35px;
    z-index: 5;
    position: relative;
    top: 150px;
    left: 1430px;
    cursor: pointer;
`;


const HotSliderTitle = styled.h2`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    top: 70px;
    font-weight: bold;
    font-size: 25px;
    &:hover {
        color: ${(props)=> props.theme.white.lighter};
    }
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color: white;
    background-image: url(${(props)=> props.bgPhoto});
    background-size: cover;
    background-position: center center;
    width: 250px;
    height: 150px;
    border-radius: 5px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Info = styled(motion.div)`
    opacity: 0;
    position: absolute;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;


const InfoTitle = styled.h2`
    position: relative;
    font-size: 18px;
    top: -10px;
    margin-left: 5px;
    font-weight: bold;
    color: ${(props)=> props.theme.white.darker};
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;


const MoiveDetail = styled(motion.div)`
    position: absolute;
    width: 50vw;
    height: 100vh;
    border-radius: 20px;
    overflow: hidden;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props)=> props.theme.black.darker};
`;

const DetailCover = styled.div`
    width: 100%;
    height: 350px;
    background-size: cover;
    background-position: center center;
`;


const DetailTitle = styled.h2`
    padding: 10px;
    position: relative;
    top: -360px;
    font-size: 46px;
    font-weight: bold;
    color: ${(props)=> props.theme.white.darker};
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;



const  DatailDate = styled.h3`
    text-align: left;
    padding: 10px;
    padding-left: 50px;
    display: inline;
    position: relative; 
    top: -110px;
    color: ${(props)=> props.theme.white.darker};
    font-weight: bold;
    font-size: 18px;
`;

const DatailThings = styled.h3`
    text-align: right;
    display: inline;
    padding: 10px;
    padding-right: 20px;
    position: relative; 
    top: -100px;
    color: ${(props)=> props.theme.white.darker};
    font-size: 18px;
`;

const DatailRunTime = styled.h3`
    text-align: right;
    padding: 10px;
    padding-right: 10px;
    position: relative; 
    top: -100px;
    color: ${(props)=> props.theme.white.darker};
    font-size: 18px;
    span {
        font-size: 18px;
        color: ${(props)=> props.theme.black.lighter};
    }

`;



const DatailOverLay = styled.p`
    padding: 20px;
    color: ${(props)=> props.theme.white.lighter};
    position: relative;
    font-size: 20px;
    top: -150px;
    text-align: center;
`;



const OverLay = styled(motion.div)`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    top : 0;
    opacity: 0;
`;



const infoVariants = {
    hover: {
        opacity : 1,
        transition : {
            delay : 0.5,
            duration: 0.3,
            type: "tween"
        }
    },
};

const rowVariants = {
    hidden :{
        x : window.outerWidth +5,
    },
    visible : {
        x:0
    },
    exit: {
        x:-window.outerWidth -5,
    },    
}


const boxVariants = {
    nomal : {
        scale :1,
    },
    hover : {
        scale : 1.4,
        y: -50,
        transition : {
            delay : 0.5,
            duration: 0.3,
            type: "tween"
        }
    },
} 


function Silder() {
    const offset = 6;
    const movieHistory = useNavigate();
    const moviePathMath = useMatch("/movies/:id"); 
    const { id } = useParams();
    const { isLoading : nowPlayingLoading, data:playingData } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const { isLoading : detailLoading, data: detailData} = useQuery<IMoiveDetail>(["movies", id], ()=> getMovieDetail(id!));
    const { scrollY } = useScroll();
    const [index , setIndex] = useState(0);
    const incraseIndex = () => {
    if (playingData) {
        if(leaving) return;
        toggleLeaving();
        const totalMovies = playingData?.results.length -1;
        const maxIndex = Math.floor( totalMovies / offset);
        setIndex((prev)=> prev === maxIndex ? 0 : prev + 1);
    };
};
    const prevIndex = ()=> {
        if (playingData) {
            if(leaving) return;
            toggleLeaving();
            const totalMovies = playingData?.results.length -1;
            const maxIndex = Math.floor( totalMovies / offset);
            setIndex((prev)=> prev === maxIndex ? 10 : prev - 1);
        };
    }
    const [leaving , setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev)=> !prev);
    const overlayClick = () => movieHistory("/");
    const boxClick = (movieId:number) => {
        movieHistory(`/movies/${movieId}`);
    }
    const movieClick = moviePathMath?.params.id && playingData?.results.find((movie) => movie.id + "" === moviePathMath.params.id);
   return ( 
    <>
    <SliderWrrper>
        <HotSliderTitle>Popular Movies Now</HotSliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <SliderLeftBtn onClick={prevIndex}>
            <FontAwesomeIcon icon={faChevronLeft} />
        </SliderLeftBtn>
            <Row
                variants={rowVariants} 
                initial="hidden" 
                animate="visible" 
                exit="exit" 
                transition={{type:"tween", duration: 1}}
                key={index}>
                {playingData?.results
                    .slice(1)
                    .slice(offset*index, offset*index+offset)
                    .map((movie)=> (
                    <Box 
                        layoutId={movie.id + ""}
                        onClick={()=> boxClick(movie.id)}
                        variants={boxVariants}
                        key={movie.id} 
                        whileHover="hover"
                        initial="nomal"
                        transition={{type:"tween"}}
                        bgPhoto={makeImgPath(movie.backdrop_path, "w500")}
                    >
                    <Info  
                        variants={infoVariants}>
                        <FontAwesomeIcon icon={faCircleInfo} style={{position: "absolute", top: -118, left: 220, fontSize: 20, cursor: "pointer"}}/>
                        <InfoTitle>{movie.title}</InfoTitle>
                        </Info>
                    </ Box>
                    ))}
            </Row>
        </AnimatePresence>
        <SliderRightBtn onClick={incraseIndex}>
            <FontAwesomeIcon icon={faChevronRight} />
        </SliderRightBtn>
    </SliderWrrper>
    <AnimatePresence>
    { moviePathMath ? (
        <>
        <OverLay animate={{opacity : 1}} exit={{opacity : 0}} onClick={overlayClick}
        />
        <MoiveDetail 
            transition={{ type : "spring", damping : 10 }}
            initial={{ scale : 0}} 
            animate={{ scale : 1 }}
            layoutId={moviePathMath.params.id} 
            style={{top : scrollY.get() + 100 }}
        >
        <span  style={{ position: "absolute", fontSize: 30, top: 10, left: 720, cursor:"pointer"}} 
                onClick={overlayClick} >
            <FontAwesomeIcon icon={faCircleXmark} />
        </span>
        { movieClick && <>
            <DetailCover 
                style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                        movieClick.backdrop_path, 
                        "w500"
                    )})`,
                }}
            />
            <DetailTitle>{movieClick.title}</DetailTitle>
            <DatailDate style={{color:"rgb(69, 211, 105)"}}>
            {detailData?.popularity.toFixed(1)} % rating</DatailDate>
            <DatailDate>{detailData?.production_countries.map((l)=> (<p>{l.iso_3166_1}</p>))}</DatailDate>
            <DatailDate>{detailData?.release_date}</DatailDate>
            <DatailRunTime ><span>Runtime</span>{detailData?.runtime} minute</DatailRunTime >
            <DatailThings ><span>Genres</span>{detailData?.genres.map((g)=> (<p>{g.name}</p>))}</DatailThings >
            <DatailOverLay>{movieClick.overview}</DatailOverLay>
            </>
            }
        </MoiveDetail>
        </> 
    ) : null }
    </AnimatePresence>
    </>
   );
};

export default Silder;