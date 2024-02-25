import { useLocation } from "react-router-dom";


function Search() {
    const location = useLocation();
    const keyWord = new URLSearchParams(location.search).get("keyword");
    console.log(keyWord);
    return null;
}

export default Search;