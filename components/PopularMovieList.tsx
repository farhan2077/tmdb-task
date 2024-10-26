"use client";

import { useState } from "react";

import { useDebounce } from "@uidotdev/usehooks";

import EmptyStatePlaceholder from "@/components/EmptyStatePlaceholder";
import MovieCard from "@/components/MovieCard";
import Spinner from "@/components/Spinner";
import { useMovies } from "@/libs/queries";
import { cn } from "@/libs/utils";

function MovieCardSkeleton() {
  return (
    <div className="group relative animate-pulse overflow-hidden rounded-lg border border-gray-300 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[2/3]">
        <div className="h-full w-full bg-gray-200"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-1 h-4 w-10/12 truncate rounded bg-gray-300"></div>
        <div className="h-3 w-1/3 rounded bg-gray-300"></div>
      </div>
    </div>
  );
}

export default function PopularMovieList() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useMovies({
      page: 1,
      searchTerm: debouncedSearch.length >= 3 ? debouncedSearch : "",
    });

  if (isLoading)
    return (
      <div>
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search for movies..."
            disabled={true}
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <MovieCardSkeleton />
          <MovieCardSkeleton />
          <MovieCardSkeleton />
          <MovieCardSkeleton />
          <MovieCardSkeleton />
          <MovieCardSkeleton />
          <MovieCardSkeleton />
          <MovieCardSkeleton />
        </div>
      </div>
    );

  if (error)
    return (
      <EmptyStatePlaceholder
        type="error"
        title="Error"
        message={`Error: ${error.message}`}
      />
    );

  if (!data)
    return (
      <EmptyStatePlaceholder
        type="empty-data"
        title="Empty"
        message="Data not found"
      />
    );

  if (data.pages[0].length === 0)
    return (
      <div>
        <div className="mb-5">
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {searchTerm ? (
          <EmptyStatePlaceholder
            type="empty-data"
            title="Not found"
            message={`Nothing found for "${searchTerm}". Try searching for something else.`}
          />
        ) : null}
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <input
          id="search"
          name="search"
          type="search"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.pages
          .flatMap((page) => page)
          .map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
      </div>
      <div className="my-10 flex w-full justify-center">
        <button
          onClick={() => fetchNextPage()}
          className={cn(
            "flex h-12 w-fit items-center justify-between rounded-lg px-6 font-semibold text-white",
            {
              "bg-blue-700 shadow-md shadow-blue-100 hover:bg-blue-600":
                !isFetchingNextPage,
              "cursor-not-allowed bg-gray-500": isFetchingNextPage,
            }
          )}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <>
              <Spinner color="text-white" />
              <span>Loading&#8230;</span>
            </>
          ) : (
            "Load more"
          )}
        </button>
      </div>
    </div>
  );
}
