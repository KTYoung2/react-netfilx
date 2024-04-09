import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { ITrailer, getVideo } from "../api";
import ReactPlayer from "react-player";
import { makeVideoPath } from "../utils";


function Trailer (){
    const { id } = useParams();
    const { isLoading , data } = useQuery<ITrailer>("video" , ()=> getVideo(Number(id) as any));
    console.log(data);
    return (
        <>
          { isLoading ? (
            "Loading"
          ) : (
            <div className="w-full h-screen bg-black">
                <ReactPlayer
                  url={
                    makeVideoPath(data?.results[0].key || "") ||
                    "https://www.youtube.com/watch?v=NeKdhpmVI64"
                  }
                  volume={1}
                  controls={false}
                  playing={true}
                  muted={false}
                  loop={true}
                  width="100%"
                  height="100%"
                 />
            </div>
          )}
        </>
      );
}

export default Trailer;