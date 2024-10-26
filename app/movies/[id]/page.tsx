import Image from "next/image";
import { notFound } from "next/navigation";

import { dateFormatter, imgUrlPrefixer } from "@/libs/utils";

import {
  getImage,
  getMovieDetails,
  getMovieMembers,
  getMovieRecommendations,
} from "@/app/actions";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function MovieDetails({ params }: PageProps) {
  const { id } = params;

  const [movieDetails, movieMembers, movieRecommendations] = await Promise.all([
    getMovieDetails(id),
    getMovieMembers(id),
    getMovieRecommendations(id),
  ]);

  if (!movieDetails || !movieDetails || !movieRecommendations) {
    notFound();
  }

  const { base64, img } = await getImage(
    imgUrlPrefixer(movieDetails.backdrop_path, "high")
  );

  return (
    <>
      <main>
        <div className="relative">
          <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm"></div>
          <Image
            src={img}
            alt={movieDetails.title}
            fill
            priority={true}
            placeholder="blur"
            blurDataURL={base64}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="-z-10 hidden min-h-dvh object-cover grayscale md:block"
          />
          <div className="mx-auto flex max-w-full translate-y-0 flex-col items-center justify-between gap-0 px-0 md:h-dvh md:max-w-screen-xl md:flex-row md:gap-8 md:px-8">
            <div
              className="z-20 order-2 h-[8rem] w-full -translate-y-full bg-gradient-to-t from-black to-transparent to-90% md:hidden"
              aria-hidden="true"
            >
              &nbsp;
            </div>
            <div className="relative z-20 order-3 -mt-[8.1rem] flex w-full flex-col gap-4 bg-black px-4 md:order-1 md:mt-0 md:bg-transparent md:px-0">
              <h1 className="order-1 text-pretty text-center text-3xl font-semibold tracking-tighter text-white sm:text-left md:order-2 md:text-7xl">
                {movieDetails.title}
              </h1>
              <div className="order-2 flex w-full items-center justify-center sm:items-start sm:justify-start md:order-1">
                <div className="flex w-fit items-center gap-1 text-sm md:text-base">
                  <span className="text-white">
                    {movieDetails.adult ? "18+" : "PG"}
                  </span>
                  <span className="text-white">•</span>
                  <span className="uppercase text-white">
                    {movieDetails.original_language}
                  </span>
                  <span className="text-white">•</span>
                  <span className="text-white">
                    {dateFormatter(movieDetails.release_date, "full-year")}
                  </span>
                </div>
              </div>
              <p className="order-3 max-w-xl text-pretty text-sm text-white md:text-left md:text-lg">
                {movieDetails.overview}
              </p>
              <div className="order-4 flex gap-4">
                {movieDetails.genres.map((genre) => {
                  return (
                    <span
                      className="text-xs font-semibold uppercase text-neutral-500 md:text-sm md:text-neutral-400"
                      key={genre.id}
                    >
                      {genre.name}
                    </span>
                  );
                })}
              </div>
              <div className="order-5 mr-0 lg:mr-52">
                <h3 className="mb-4 mt-8 font-semibold text-white">CASTS</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8">
                  {movieMembers.cast.splice(0, 4).map((cast) => {
                    return (
                      <div
                        key={cast.id}
                        className="overflow-hidden rounded-lg border-2 border-white/50"
                      >
                        <div className="relative aspect-square h-auto w-full">
                          <Image
                            fill
                            src={imgUrlPrefixer(cast.profile_path, "low")}
                            className="h-full w-full overflow-hidden object-cover"
                            alt={cast.name}
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 backdrop-blur"></div>
                          <p className="relative truncate px-3 py-2 text-sm text-white">
                            {cast.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="border-0md:order-2 relative order-1 aspect-[2/3] h-[60dvh] w-full overflow-hidden md:h-auto md:w-96 md:rounded-lg md:border-2 md:border-white/40">
              <Image
                src={imgUrlPrefixer(movieDetails.poster_path, "low")}
                alt={movieDetails.title}
                fill
                placeholder="empty"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="z-20 object-cover duration-300 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
        <div
          className="relative -z-10 h-[8rem] w-full -translate-y-full bg-gradient-to-t from-black to-transparent to-90% text-white"
          aria-hidden="true"
        >
          &nbsp;
        </div>
        <div className="-mt-[8.1rem] bg-black">
          <div className="mx-auto max-w-screen-xl px-4 text-white md:px-8">
            <h3 className="pb-4 pt-8 font-semibold text-white md:pt-0">
              YOU MAY ALSO LIKE
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8">
              {movieRecommendations.results.map((movie) => {
                return (
                  <Link
                    href={`/movies/${movie.id}`}
                    key={movie.id}
                    className="group rounded-lg"
                  >
                    {/* {rc.id} */}
                    <div className="relative aspect-[4/5] h-auto w-full overflow-hidden rounded-lg border-2 border-white/0 transition-colors group-hover:border-white/50">
                      <Image
                        fill
                        src={imgUrlPrefixer(movie.poster_path, "low")}
                        alt={movie.title}
                        className="h-full w-full overflow-hidden object-cover"
                      />
                    </div>
                    <p className="mt-3 truncate">{movie.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg-black py-10" aria-hidden="true">
          &nbsp;
        </div>
      </main>
    </>
  );
}