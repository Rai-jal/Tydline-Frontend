import tydlineLogo from "../assets/tydline-sqaurlogo.png";

interface Article {
  iconLeft: string;
  iconRight: string;
  description: string;
}

interface HeroCardProps {
  image: string;
  articles: Article[];
}

function HeroCard({ image, articles }: HeroCardProps) {
  return (
    <section className="flex flex-row w-[75%] mt-12 h-55 border border-[#052698]/30 overflow-hidden shadow-sm">
      {/* Left — image */}
      <div className="w-1/2 shrink-0">
        <img
          src={image}
          alt="Cargo ship"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right — articles */}
      <div className="w-1/2 h-full flex flex-col divide-y divide-[#052698]/10 border-l border-[#052698]/20">
        {articles.map((article, index) => (
          <article
            key={index}
            className="flex-1 min-h-0 overflow-hidden flex flex-row items-center gap-3 px-4 relative"
          >
            {/* Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <img src={article.iconLeft} alt="" className="w-8 h-8 shrink-0" />
              <img
                src={article.iconRight}
                alt=""
                className="w-8 h-8 shrink-0"
              />
            </div>

            {/* Colon separator */}
            <span className="text-[#545454] font-medium shrink-0">:</span>

            {/* Description */}
            <p className="text-[#545454] text-medium h-full flex items-center leading-none truncate">
              {article.description}
            </p>

            {/* Logo on last article */}
            {index === articles.length - 1 && (
              <img
                src={tydlineLogo}
                alt="Tydline"
                className="absolute right-3 bottom-2 h-6 opacity-80"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default HeroCard;
