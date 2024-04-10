import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IGetMoviesResult, IMedia, getSearch } from "../api";
import { makeImgPath }  from "../utils";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import Home from "./Home";



const Wrap = styled.div`
  padding: 100px 50px 20px 50px;
  
  span {
    margin-top: 180px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & span:first-child {
    margin-top: 30px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: flex-start;
  }

  h1 {
    color: ${(props)=> props.theme.red};
    font-weight: 700;
  }

  img {
      width: 100%;
    }

`;


const SearchWrap = styled.div`
    position: relative;
    top: -25px;
    left: -10px;
    right: -20px;
`;

const SearchMovie = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 4fr);
    row-gap: 5px;
    position: absolute;
    width: 100%;
`;


const SearchItem = styled(motion.div)`
    color: black;
    width: 235px;
    height: 130px;
    border-radius: 10px;
    margin-top: 60px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;

    & h1 {
      font-size: 16px;
      font-weight: bold;
      color: ${(props)=> props.theme.white.darker};
      text-align: center;
    }

    img {
      width: 235px;
      height: 130px;
      border-radius: 5px;
    }
    `;


const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;



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

function Search() {
    const navigate = useNavigate();
    const { movieId } = useParams();
    const [ query ] = useSearchParams(); //URL 찾기위해 선언
    const keyword = query.get("keyword");
    const { isLoading , data } = useQuery(["search", keyword ], () => getSearch(keyword + ""));
    

    return(
        <Wrap>
            {isLoading ? (
                <Loader> Loading ...</Loader>
                ) : (
                <>
                <div>
                <span>"{keyword}" 검색결과</span>
                {
                  (!data || data.results.length === 0) && 
                  <span>입력하신 <h1> {keyword} </h1> (와)과 일치하는 검색결과가 없습니다.</span>
                  }
                </div>
                <SearchWrap>
                  <SearchMovie>
                    { data?.results.slice(0,18).map((sraech:any)=> (
                      <SearchItem 
                        layoutId={sraech.id + ""}
                        variants={boxVariants}
                        whileHover="hover"
                        initial="nomal"
                        transition={{type:"tween"}}
                        key={sraech.id}>
                      <img
                      src={makeImgPath(sraech.backdrop_path, 'w500')}
                      alt={sraech.title || sraech.release_date}
                      />
                      <h1>{sraech.title}</h1>
                      
                </SearchItem>
                ))} 
                  </SearchMovie>
                </SearchWrap>
                </>
            )}
      </Wrap>
    );
}

export default Search;