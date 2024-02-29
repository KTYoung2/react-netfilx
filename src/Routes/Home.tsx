import { useQuery } from "react-query";
import { IGetMovieRank, IGetMoviesResult, getMovieDetail, getMovies, IMoiveDetail, getTopMovies, getCommingMovies } from "../api";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, PathMatch, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleXmark , faPlay , faCircleInfo, faMedal, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 200px;
    width: 100vw;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto : string }>`
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

const OverviewBtn = styled.button`
    border: none;
    background-color: ${(props)=>props.theme.white.lighter};
    color : ${(props)=>props.theme.black.lighter};
    width: 150px;
    height: 50px;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background-color: rgb(255, 255, 255, 0.5);
    } 
`;


const Slider = styled.div`
    position: relative;
    top: -80px;
    left: 50px;
    right: -50px;
`;

const HotSliderTitle = styled.h2`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    top: -20px;
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

const TopRank = styled.div`
    position: relative;
    display: flex;
    top: 200px;
    left: 50px;
    right: -50px;
`;


const Rank = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2px;
    position: absolute;
    width: 100%;
    left: 50px;
    right: -70px;
    top: -13px;
`;
  



const RankItem = styled(motion.div)<{bgPhoto?:string}>`
    z-index: 2;
    background-image: url(${(props)=> props.bgPhoto});
    background-size: cover;
    background-color: white;
    background-position: center center;
    width: 150px;
    height: 180px;
    border-radius: 5px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
`;

const RankNum = styled.h1`
    font-size: 220px;
    font-weight: 800;
    -webkit-text-stroke: 4px rgb(89, 89, 89);
    color: transparent;
    position: relative;
    left: -85px;
`;


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

const offset = 6;

function Home() {
    const movieHistory = useNavigate();
    const moviePathMath = useMatch("/movies/:id"); 
    const { id } = useParams();
    const { scrollY } = useScroll();
    const { isLoading : nowPlayingLoading, data:playingData } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const { isLoading : topRatedLoading, data: topData} = useQuery<IGetMovieRank>(["movies", "topRated"], getTopMovies);
    const { isLoading : commLoading, data: commData} = useQuery<IGetMovieRank>(["movies", "comming"], getCommingMovies);
    const { isLoading : detailLoading, data: detailData} = useQuery<IMoiveDetail>(["movies", id], ()=> getMovieDetail(id!));
    console.log(detailData);
    const isLoading = nowPlayingLoading || topRatedLoading || commLoading ||  detailLoading ;
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
    const [leaving , setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev)=> !prev);
    const boxClick = (movieId:number) => {
        movieHistory(`/movies/${movieId}`);
    }
    const overlayClick = () => movieHistory("/");
    const movieClick = moviePathMath?.params.id && playingData?.results.find((movie) => movie.id + "" === moviePathMath.params.id);
    

    return (
        <Wrapper>
            {isLoading ? ( 
                <Loader> Loading ... </Loader> 
            )  : ( 
                <>
                    <Banner onClick={incraseIndex} bgPhoto={makeImgPath(playingData?.results[0].backdrop_path || "")}>
                        <Title>{playingData?.results[0].title}</Title>
                        <MoviRank><FontAwesomeIcon icon={faMedal} style={{ color : "rgb(229, 9, 20)", paddingRight: 5}}/> 
                            popular movies today
                        </MoviRank>
                        <Overview>{playingData?.results[0].overview}</Overview>
                        <div style={{ display:"flex", justifyContent: "flex-start"}}>
                            <OverviewBtn>
                            <FontAwesomeIcon icon={faPlay} style={{fontSize: 20, paddingRight:10}}/>
                                Play
                            </OverviewBtn>
                            <OverviewBtn>
                            <FontAwesomeIcon icon={faCircleInfo}  style={{fontSize: 20, paddingRight:10}}/>
                                More
                            </OverviewBtn>
                        </div>
                    </Banner>
                    <Slider>
                        <HotSliderTitle>Popular Movies Now</HotSliderTitle>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
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
                    </Slider>
                    <AnimatePresence>
                    { moviePathMath ? (
                        <>
                        <OverLay animate={{opacity : 1}} exit={{opacity : 0}} onClick={overlayClick}
                        />
                        <MoiveDetail 
                            layoutId={moviePathMath.params.id} 
                            style={{top : scrollY.get() + 100 }}
                        >
                        <FontAwesomeIcon onClick={overlayClick} style={{ position: "absolute", fontSize: 30, top: 10, left: 720, cursor:"pointer"}} icon={faCircleXmark} />
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
                    <>
                    <TopRank>
                    <HotSliderTitle style={{top:-70}}>Top 10 Movies</HotSliderTitle>
                    <AnimatePresence>
                        <Rank transition={{type:"tween", duration: 1}}>
                            <RankItem variants={boxVariants}
                                      whileHover="hover"
                                      initial="nomal"
                                      transition={{type:"tween"}}
                                bgPhoto={makeImgPath(topData?.results[0].backdrop_path as any, "w500")}> 
                                 <RankNum>1</RankNum> 
                                 {topData?.results[0].title}
                                </RankItem>
                            <RankItem  bgPhoto={makeImgPath(topData?.results[1].backdrop_path as any, "w500")}>
                                <RankNum>2</RankNum>
                                {topData?.results[1].title}
                            </RankItem>
                            <RankItem  bgPhoto={makeImgPath(topData?.results[2].backdrop_path as any, "w500")}>
                            <RankNum>3</RankNum>
                            {topData?.results[2].title}
                            </RankItem>
                            <RankItem  bgPhoto={makeImgPath(topData?.results[3].backdrop_path as any, "w500")}>
                            <RankNum>4</RankNum>
                                {topData?.results[3].title}
                                </RankItem>
                            <RankItem  bgPhoto={makeImgPath(topData?.results[4].backdrop_path as any, "w500")}>
                            <RankNum>5</RankNum>
                            </RankItem> 
                        </Rank>
                    </AnimatePresence>
                    </TopRank>
                    </>
                    <>
                    <Slider style={{top : 850}}>
                        <HotSliderTitle>UpComming Movies </HotSliderTitle>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                                <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[0].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[1].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[1].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[2].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[2].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[3].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[4].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[5].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[6].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[7].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                            <Row>
                                    <Box bgPhoto={makeImgPath(commData?.results[8].backdrop_path as any, "w500")}>
                                    <Info >{commData?.results[0].title}</Info>
                                    </Box>
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    
                    </>
                </>
            )}  
        </Wrapper>
        );
}

export default Home;