import { useQuery } from "react-query";
import { IGetMovieRank, IGetMoviesResult, getMovieDetail, getMovies, IMoiveDetail, getTopMovies, getCommingMovies} from "../api";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark , faCircleInfo,faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Banner from "../Componensts/Banner";

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


const Slider = styled.div`
    position: relative;
    top: -150px;
    left: 20px;
    right: -50px;
    z-index: 0;
`;
/*
const MovieTitle = styled.p`
    position: relative;
    top: 160px;
    font-size: 17px;
    font-weight: bolder;
    color: ${(props)=> props.theme.white.darker};
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;
*/
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
    left: 1400px;
    cursor: pointer;
`;




const HotSliderTitle = styled.h2`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    top: 100px;
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
    width: 55vw;
    height: 100vh;
    border-radius: 20px;
    overflow: hidden;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props)=> props.theme.black.veryDark};
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
    top: -80px;
    left: 350px;
    font-size: 30px;
    font-weight: bold;
    color: ${(props)=> props.theme.white.darker};
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;

const DetailImg = styled.img`
    width: 300px;
    height: 400px;
    position: relative;
    top: -150px;
    left: 40px;
    padding-right: 20px;
`
const  DatailDate = styled.p`
    display: flex;
    position: relative; 
    top: -440px;
    color: ${(props)=> props.theme.white.darker};
    font-size: 15px;
    left: 350px;
    padding-top: 5px;
`;

const  DatailTagLine = styled.h3`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    font-size: 20px;
    font-weight: 500;
    top: -400px;
    display: flex;
    justify-content: center;
    left: 70px;
`;

const DatailOverLay = styled.p`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    font-size: 15px;
    top: -370px;
    left: 350px;
    text-align: justify;
    width: 450px;
    height: 450px;
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
    gap: 2px;
    position: absolute;
    width: 100%;
    left: 50px;
    right: -70px;
    top: -13px;
`;
  



const RankItem = styled(motion.div)<{bgPhoto?:string}>`
    position: relative;
    z-index: 5;
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
    font-size: 200px;
    font-weight: 800;
    -webkit-text-stroke: 3px ${(props)=> props.theme.white.darker};
    color: transparent;
    position: relative;
    left: -85px;
    z-index: 0;
    top: -20px;
`;


const rowVariants = {
    hidden : {
        x : window.outerWidth +5,
    },
    visible : {
        x:0
    },
    exit: {
        x: -window.outerWidth -5,
    },    
};


const boxVariants  = {
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
    const prevIndex = ()=> {
        if (playingData) {
            if(leaving) return;
            toggleLeaving();
            const totalMovies = playingData?.results.length -1;
            const maxIndex = Math.floor( totalMovies / offset);
            setIndex((prev)=> prev === maxIndex ?  offset : prev - 1);
        };
    }

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
                    <Banner />           
                    <Slider>
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
                    </Slider>
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
                        <span  style={{ position: "absolute", fontSize: 30, top: 10, left: 800, cursor:"pointer"}} 
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
                            <DetailImg src={`https://image.tmdb.org/t/p/w500${detailData?.poster_path}`}/>
                            <DatailDate>
                            ·{detailData?.release_date} </DatailDate>
                            <DatailDate> ·{detailData?.runtime} minute </DatailDate>
                            <DatailDate> {detailData?.genres.map((g)=> (<p>·{g.name}</p>))}</DatailDate>
                            <DatailTagLine> 
                            「 {detailData?.tagline} 」
                            </DatailTagLine>
                            <DatailOverLay>   
                            {movieClick.overview}</DatailOverLay>
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
                        <Rank>
                        {topData?.results
                                    .slice(1)
                                    .slice(offset*index, offset*index+offset)
                                    .map((movie)=> (
                                    <RankItem 
                                        layoutId={movie.id + ""}
                                        onClick={()=> boxClick(movie.id)}
                                        variants={boxVariants}
                                        key={movie.id} 
                                        whileHover="hover"
                                        initial="nomal"
                                        transition={{type:"tween"}}
                                        bgPhoto={makeImgPath(movie.backdrop_path, "w500")}
                                    ><RankNum>{}</RankNum>
                                    <Info  
                                        variants={infoVariants}>
                                            <FontAwesomeIcon icon={faCircleInfo} style={{position: "absolute", top: -118, left: 220, fontSize: 20, cursor: "pointer"}}/>
                                        <InfoTitle>{movie.title}</InfoTitle>
                                        </Info>
                                    </RankItem>
                                ))}
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