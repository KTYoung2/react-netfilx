import { useQuery } from "react-query";
import { IGetMovieRank, IGetMoviesResult, getMovieDetail, getMovies, IMoiveDetail, getTopMovies, ISimilar,getCommingMovies, getPopularMovies, getSimilarMovies, getCredits,  ICredits, getVideo, ITrailer, IMedia} from "../api";
import styled from "styled-components";
import { makeImgPath} from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark , faCircleInfo,faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Banner from "../Componensts/Banner";
import Trailer from "./Trailer";

const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 200px;
    width: 100vw;
    height: 350vh;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;


const Slider = styled.div`
    position: relative;
    top: -180px;
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
    left: 1400px;
    cursor: pointer;
`;




const HotSliderTitle = styled.h2`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    top: 120px;
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
    gap:5px;
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
    z-index: 10;
    position: absolute;
    width: 65vw;
    height: 340vh;
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
    top: -110px;
    left: 350px;
    font-size: 30px;
    font-weight: bold;
    color: ${(props)=> props.theme.white.darker};
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;

const TrailerBtn = styled.button`
    padding: 10px;
    position: relative;
    top: 10px;
    left: 350px;
    border: none;
    border: 1px solid rgb(229, 9, 20);
    width: 100px;
    height: 40px;
    background-color:  rgb(229, 9, 20);
    border-radius: 3px;
    font-size: 17px;
    font-weight: bolder;
    color: ${(props)=> props.theme.white.darker};
    cursor: pointer;
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

const DatailGenres = styled.ul`
    display: flex;
    padding-right: 20px;
    position: relative; 
    top: -430px;
    left: 350px;
    li {
      
    }
`;

const  DatailTagLine = styled.h3`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    font-size: 20px;
    font-weight: 500;
    top: -370px;
    display: flex;
    justify-content: center;
    left: 70px;
`;

const DatailOverLay = styled.p`
    color: ${(props)=> props.theme.white.darker};
    position: relative;
    font-size: 15px;
    top: -340px;
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


const Actors = styled.div`
    position: relative;
    top: -420px;
    left: 10px;
    right: -10px;
    display: flex;
`;
const ActorBox = styled.div`

`;

const ActorImg = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 5px;
    position: relative;
    top: -150px;
    left: 40px;
    padding-right: 20px;
`

const ActorName =  styled.p`
    position: relative;
    top: -130px;
    left: 10px;
    text-align: center;
    color: ${(props)=> props.theme.white.darker};
`;


const Similar = styled.div`
    position: relative;
    top: -400px;
    left: 20px;
    right: -20px;
`;

const SimilarTitle = styled.h2`
font-size: 17px;
font-weight: bold;
color: ${(props)=> props.theme.white.darker};
text-align: center;
`;

const Similardate = styled.h2`
font-size: 15px;
color: rgb(229, 229, 229, 0.5);
text-align: center;
`;


const SimilarRating = styled.h2`
font-size: 15px;
text-align: center;
color: ${(props)=> props.theme.white.darker};
`;



const SimilarMovie = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(4, 2fr);
    row-gap: 5px;
    position: absolute;
    width: 100%;
    `;

const SimilarItem = styled(motion.div)`
    color: black;
    width: 200px;
    height: 400px;
    border-radius: 10px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
    
    `;

const SimilarImg = styled.img`
    width: 200px;
    height: 300px;
    border-radius: 5px;
`;

const TopRank = styled.div`
    position: relative;
    top: 60px;
    left: 50px;
    right: -50px;
`;


const Rank = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    position: absolute;
    width: 100%;
    
`;
  
const RankItem = styled(motion.div)<{bgPhoto?:string}>`
    position: relative;
    z-index: 5;
    background-image: url(${(props)=> props.bgPhoto});
    background-size: cover;
    background-color: white;
    background-position: center center;
    width: 200px;
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


const MovieTitle = styled.p`
    position: relative;
    top: 120px;
    font-size: 18px;
    font-weight: bold;
    color: ${(props)=> props.theme.white.darker};
    text-align: center;
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
`;


const RankNum = styled.h1`
    display: flex;
    font-size: 200px;
    font-weight: 800;
    -webkit-text-stroke: 3px ${(props)=> props.theme.white.darker};
    color: transparent;
    position: relative;
    left: -90px;
    z-index: 0;
    top: -190px;
   
`;


const Comming = styled.div`
    position: relative;
    top: 450px;
    left: 20px;
    right: -50px;
`;


const CBox = styled(motion.div)<{bgPhoto:string}>`
    background-color: rgb(255, 255, 255);
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

const CRow = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
    gap:5px;
`;

const Popular = styled.div`
    position: relative;
    top: 200px;
    left: 20px;
    right: -50px;
    z-index: 0;
`;

const PBox = styled(motion.div)<{bgPhoto:string}>`
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

const PRow = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
    gap:5px;
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
        zIndex:10,
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

interface IModalProps {
    movie: IMedia;
    type: string;
  }

const offset = 6;

function Home( { movie, type }: any ) {
    const movieHistory = useNavigate();
    const moviePathMath = useMatch("/movies/:id"); 
    const { id } = useParams();
    const { scrollY } = useScroll();
    const { isLoading : nowPlayingLoading, data:playingData } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const { isLoading : topRatedLoading, data: topData} = useQuery<IGetMovieRank>(["movies", "topRated"], getTopMovies);
    const { isLoading : commLoading, data: commData} = useQuery<IGetMovieRank>(["movies", "comming"], getCommingMovies);
    const { isLoading : detailLoading, data: detailData} = useQuery<IMoiveDetail>(["movies", id], ()=> getMovieDetail(id!));
    const { isLoading : popularLoading , data: popularData } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
    const { isLoading : similarLoading , data: similarData } = useQuery<ISimilar>(["similer", id], ()=> getSimilarMovies(id!));
    const { isLoading : creditLoading , data: creditData } = useQuery<ICredits>(["actor", id], ()=> getCredits(id!));
    const isLoading = nowPlayingLoading || topRatedLoading || commLoading ||  detailLoading || popularLoading || similarLoading || creditLoading ;
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
    const titleClick = (movieId:any) => {
        movieHistory(`/movies/${movieId}`);
    }

    const videoClick = (movieId:number) => {
        movieHistory(`/movies/trailer/${movieId}`);
    }

    const overlayClick = () => movieHistory("/");
    const PLAY =  moviePathMath?.params.id && playingData?.results.find((movie) => movie.id  + ""  === moviePathMath.params.id);
    const TOP =  moviePathMath?.params.id && topData?.results.find((movie) => movie.id  + "" === moviePathMath.params.id);   
    const COME =  moviePathMath?.params.id && commData?.results.find((movie) => movie.id  + "" === moviePathMath.params.id);   
    const POPULAR = moviePathMath?.params.id && popularData?.results.find((movie) => movie.id  + "" === moviePathMath.params.id);    
    const movieClick = PLAY || TOP || COME || POPULAR ;  
    return (
        <Wrapper>
            {isLoading ? ( 
                <Loader> Loading ... </Loader> 
            )  : ( 
                <>
                    <Banner />           
                    <Slider>
                        <HotSliderTitle  onClick={()=> titleClick(playingData?.results.find((movie) => movie.id))}>Now playing</HotSliderTitle>
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
                                    <MovieTitle>{movie.title}</MovieTitle>
                                    <Info  
                                        variants={infoVariants}>
                                            <FontAwesomeIcon icon={faCircleInfo} style={{position: "absolute", top: -118, left: 220, fontSize: 20, cursor: "pointer"}}/>
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
                        { movieClick && 
                         <>
                            <DetailCover 
                                style={{
                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                                       movieClick.backdrop_path,
                                        "w500"
                                    )})`,
                                }}
                            />
                            <TrailerBtn onClick={()=> videoClick(movieClick.id)}>Trailer</TrailerBtn>
                            <DetailTitle>{movieClick.title}</DetailTitle>
                            <DetailImg src={`https://image.tmdb.org/t/p/w500${detailData?.poster_path}`}/>
                            <DatailDate>
                            ·{detailData?.release_date} </DatailDate>
                            <DatailDate> ·{detailData?.runtime} minute </DatailDate>
                            <DatailGenres> {detailData?.genres.map((g)=> ( <li>· {g.name}</li>))}</DatailGenres>
                            <DatailTagLine> 
                            「 {detailData?.tagline} 」
                            </DatailTagLine>
                            <DatailOverLay>{movieClick.overview}</DatailOverLay>
                            <HotSliderTitle style={{top:-620, textAlign:"left", left:35}}>
                             Actors
                            </HotSliderTitle>  
                            <Actors key={index}>
                                {creditData?.cast.slice(0,6).map((i)=> 
                                <ActorBox>
                                    <ActorImg src={`https://image.tmdb.org/t/p/w500${i?.profile_path}`}/>
                                    <ActorName>{i.name}</ActorName>
                                    <ActorName style={{ fontSize:13 , color:" rgb(229, 229, 229, 0.5)"}}> / {i.character}</ActorName>
                                </ActorBox>
                            )}    
                            </Actors>
                            <HotSliderTitle style={{top:-450, textAlign:"left", left:35}}>
                             Similar Movies
                            </HotSliderTitle>
                            <Similar>
                            <SimilarMovie>
                                {similarData?.results.slice(0,12).map((g)=> (
                                    <SimilarItem key={g.id}>
                                    <SimilarImg src={`https://image.tmdb.org/t/p/w500${g.poster_path}`} />
                                    <SimilarTitle>{g.title}</SimilarTitle>
                                    <Similardate>{g.release_date}</Similardate> 
                                    <SimilarRating>⭐{g.popularity.toFixed(1)}</SimilarRating>
                                </SimilarItem>
                                ))}
                            </SimilarMovie>
                            </Similar>
                            </>
                            }
                        </MoiveDetail>
                        </> 
                    ) : null }
                    </AnimatePresence>
                    <>
                    <TopRank>
                    <HotSliderTitle style={{top:-30}}>Top 10 Movies</HotSliderTitle>
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                        <Rank variants={rowVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit="exit" 
                                key={index}
                                transition={{type:"tween", duration: 1}}
                            >
                            { topData?.results
                                    .slice(1)
                                    .slice( 5 * index, 5 * index + 5)
                                    .map((topmovie)=> (
                                    <RankItem
                                        layoutId={topmovie.id + ""}
                                        onClick={()=> boxClick(topmovie.id)}
                                        variants={boxVariants}
                                        key={topmovie.id} 
                                        whileHover="hover"
                                        initial="nomal"
                                        transition={{type:"tween"}}
                                        bgPhoto={makeImgPath(topmovie.backdrop_path, "w500")}
                                    >
                                    <MovieTitle style={{top:140}}>{topmovie.title}</MovieTitle>
                                </RankItem>
                                 ))}
                                 <RankNum>1</RankNum>
                                 <RankNum>2</RankNum>
                                 <RankNum>3</RankNum>
                                 <RankNum>4</RankNum>
                                 <RankNum>5</RankNum>
                        </Rank>
                        <SliderRightBtn onClick={incraseIndex}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </SliderRightBtn>
                    </AnimatePresence>
                    </TopRank>
                    </>
                    <>
                    <Popular>
                    <HotSliderTitle style={{top:-30}}>popular Movies </HotSliderTitle>
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <PRow       variants={rowVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit="exit" 
                                key={index}
                                transition={{type:"tween", duration: 1}}>
                                {popularData?.results
                                    .slice(1)
                                    .slice(offset*index, offset*index+offset)
                                    .map((movie)=> (
                                    <PBox 
                                        layoutId={movie.id + ""}
                                        onClick={()=> boxClick(movie.id)}
                                        variants={boxVariants}
                                        key={movie.id} 
                                        whileHover="hover"
                                        initial="nomal"
                                        transition={{type:"tween"}}
                                        bgPhoto={makeImgPath(movie.backdrop_path, "w500")}
                                    >
                                    <MovieTitle>{movie.title}</MovieTitle>
                                    <Info  
                                        variants={infoVariants}>
                                            <FontAwesomeIcon icon={faCircleInfo} style={{position: "absolute", top: -118, left: 220, fontSize: 20, cursor: "pointer"}}/>
                                        </Info>
                                    </PBox>
                                    ))}
                             </PRow>
                    </AnimatePresence>
                    </Popular>
                    </>
                    <>
                    <Comming>
                        <HotSliderTitle style={{top:-30}}>UpComming Movies </HotSliderTitle>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  
                             <CRow    
                                variants={rowVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit="exit" 
                                transition={{type:"tween", duration: 1}}
                                key={index}>
                                {commData?.results
                                    .slice(1)
                                    .slice(offset*index, offset*index+offset)
                                    .map((movie)=> (
                                    <CBox 
                                        layoutId={movie.id + ""}
                                        onClick={()=> boxClick(movie.id)}
                                        variants={boxVariants}
                                        key={movie.id} 
                                        whileHover="hover"
                                        initial="nomal"
                                        transition={{type:"tween"}}
                                        bgPhoto={makeImgPath(movie.backdrop_path, "w500")}
                                    >
                                        <MovieTitle>{movie.title}</MovieTitle>
                                    <Info  
                                        variants={infoVariants}>
                                            <FontAwesomeIcon icon={faCircleInfo} style={{position: "absolute", top: -118, left: 220, fontSize: 20, cursor: "pointer"}}/>
                                        </Info>
                                    </CBox>
                                    ))}
                             </CRow>
                        </AnimatePresence>
                    </Comming>
                    </>
                </>
            )}  
        </Wrapper>
        );
}

export default Home;