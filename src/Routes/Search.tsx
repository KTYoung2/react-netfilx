import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IGetMoviesResult, IMedia, IMoiveDetail, getSearch } from "../api";
import { makeImgPath }  from "../utils";
import styled from "styled-components";

const Wrap = styled.div`
  padding: 100px 50px 20px;

  ul.search_list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 15px;

    @media (max-width: 1600px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    li {
      margin-bottom: 50px;
      cursor: pointer;
    }
    img {
      width: 100%;
    }
  }
  @media (max-width: 968px) {
    padding: 100px 15px;
  }
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;


function Search() {
    const navigate = useNavigate();
    const { Id } = useParams();
    const [ query ] = useSearchParams(); //URL 찾기위해 선언
    const keyword = query.get("keyword");
    const { isLoading, data } = useQuery<IGetMoviesResult>(["search", keyword ], () => getSearch(keyword + ""));
    console.log(data);
    return(
        <Wrap>
            {isLoading ? (
                <Loader> Loading ...</Loader>
                ) : (
                <>
                <h1>{keyword} 검색 결과입니다.</h1>
                {(!data || data.results.length === 0) && <div>검색결과가 없습니다.</div>}
                <ul>
                {data?.results.map((sraech)=> (
                    <li key={sraech.id}
                        onClick={() => navigate(`${sraech.id}`, { state: { keyword } })}    >
                        {sraech.title}
                    <img
                    src={makeImgPath(sraech.backdrop_path, 'w500')}
                    alt={sraech.title || sraech.release_date}
                 />
              </li>
                ))}
                </ul>
                </>
            ) }
      </Wrap>
    );
}

export default Search;