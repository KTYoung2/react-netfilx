import { useQuery } from "react-query";
import { IGetMovieRank, IGetMoviesResult, getMovieDetail, getMovies, IMoiveDetail, getTopMovies, getCommingMovies } from "../api";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, PathMatch, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleXmark , faStar } from "@fortawesome/free-solid-svg-icons";
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
`;

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
    left: 50px;
    right: -50px;
`;

const HotSliderTitle = styled.h2`
    position: relative;
    top: -50px;
    font-weight: bold;
    font-size: 25px;
`;


const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color: white;
    background-image: url(${(props)=> props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
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
    gap: 5px;
    position: absolute;
    width: 100%;
`;

const Info = styled(motion.div)`
    padding : 10px;
    background-color: ${(props)=> props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

const MoiveDetail = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    border-radius: 20px;
    overflow: hidden;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props)=> props.theme.black.lighter};
`;

const DetailCover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center center;
`;


const DetailTitle = styled.h2`
    padding: 10px;
    position: relative;
    top: -400px;
    font-size: 46px;
    font-weight: bold;
    color: ${(props)=> props.theme.white.darker};
`;

const DatailTagLine = styled.h3`
    padding: 10px;
    position: relative;
    top: -130px;
    font-size: 23px;
    color: ${(props)=> props.theme.white.darker};
`;

const  DatailDate = styled.h3`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 10px;
    position: relative;
    top: -100px;
    color: ${(props)=> props.theme.white.darker};
    font-weight: bold;
    font-size: 20px;
`;

const DatailOverLay = styled.p`
    padding: 20px;
    color: ${(props)=> props.theme.white.lighter};
    position: relative;
    font-size: 20px;
    top: -150px;

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
    grid-template-columns: repeat(5, 2fr);
    gap: 5px;
    position: absolute;
    width: 100%;
`;

const RankItem = styled(motion.div)<{bgPhoto?:string}>`
    background-image: url(${(props)=> props.bgPhoto});
    background-size: cover;
    background-color: white;
    background-position: center center;
    width: 250px;
    height: 300px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
`;

const RankNum = styled.h1`
    font-size: 200px;
    font-weight: 800;
    stroke-width: 1px #fff;
`;

const Populars = styled.div`
    position: relative;
    display: flex;
    top: 600px;
    left: 50px;
    right: -50px;
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
                        <Overview>{playingData?.results[0].overview}</Overview>
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
                                    > {movie.title}
                                        <Info
                                            variants={infoVariants}>
                                        <h4>{movie.title}</h4>
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
                        <FontAwesomeIcon style={{ position: "absolute", fontSize: 40, top: 10, left: 700}} icon={faCircleXmark} />
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
                            <DatailTagLine>{detailData?.tagline}</DatailTagLine>
                            <DatailDate style={{color:"rgb(69, 211, 105)"}}>
                            {detailData?.popularity.toFixed(1)} % rating</DatailDate>
                            <DatailDate>{detailData?.release_date}</DatailDate>
                            <span>{detailData?.genres.map((g)=> (<p>{g.name}</p>))}</span>
                            <DatailOverLay>RUNTIME : {detailData?.runtime}</DatailOverLay>
                            <DatailOverLay>{movieClick.overview}</DatailOverLay>
                            </>
                            }
                        </MoiveDetail>
                        </> 
                    ) : null }
                    </AnimatePresence>
                    <>
                    <TopRank>
                    <HotSliderTitle>Top 10 Movies</HotSliderTitle>
                        <Rank>
                            <RankItem 
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
                                {topData?.results[4].title}
                                </RankItem>
                                <RankItem  bgPhoto={makeImgPath(topData?.results[5].backdrop_path as any, "w500")}>
                            <RankNum>6</RankNum>
                                {topData?.results[5].title}
                                </RankItem>
                                <RankItem  bgPhoto={makeImgPath(topData?.results[6].backdrop_path as any, "w500")}>
                            <RankNum>7</RankNum>
                                {topData?.results[6].title}
                                </RankItem>
                                <RankItem  bgPhoto={makeImgPath(topData?.results[7].backdrop_path as any, "w500")}>
                            <RankNum>8</RankNum>
                                {topData?.results[7].title}
                                </RankItem>
                                <RankItem  bgPhoto={makeImgPath(topData?.results[8].backdrop_path as any, "w500")}>
                            <RankNum>9</RankNum>
                                {topData?.results[8].title}
                                </RankItem>
                                <RankItem  bgPhoto={makeImgPath(topData?.results[9].backdrop_path as any, "w500")}>
                            <RankNum>10</RankNum>
                                {topData?.results[9].title}
                                </RankItem>    
                        </Rank>
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