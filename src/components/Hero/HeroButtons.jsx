import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroButtons({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex gap-4">
      <button
      onClick={() => navigate(`/movie/${movie.id}`)}
        className="flex items-center gap-3 rounded-md bg-white/20 px-8 py-3 font-semibold backdrop-blur transition hover:bg-white/30"
        className="flex items-center gap-3 rounded-md bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-300"
      >
        <Play fill="currentColor" />
        Play
      </button>

      
    </div>
  );
}

export default HeroButtons;