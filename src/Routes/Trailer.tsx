import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ITrailer, getVideo } from "../api";
import ReactPlayer from "react-player";
import { makeVideoPath } from "../utils";


function Trailer (){
    const { id } = useParams();
    const { isLoading , data } = useQuery<ITrailer>("video" , ()=> getVideo(id!));
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
                  volume={0}
                  controls={false}
                  playing={true}
                  muted={false}
                  loop={true}
                  width="90%"
                  height="90%"
                 />
            </div>
          )}
        </>
      );
}

export default Trailer;