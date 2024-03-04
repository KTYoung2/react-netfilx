import { useQuery } from "react-query";
import { IGetMovieRank,  getTopMovies } from "../api";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";





const TopRanks = styled.div`
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


function TopRank () {
    const { isLoading : topRatedLoading, data: topData} = useQuery<IGetMovieRank>(["movies", "topRated"], getTopMovies);

    return(
        <>
        <TopRanks>
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
        </TopRanks>
        </>
    );

};

export default TopRank;