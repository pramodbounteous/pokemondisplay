import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PokemonCard from "@/components/PokemonCard";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonResponse {
  results: Pokemon[];
  next: string | null;
}

const fetchPokemon = async ({ pageParam = 0 }): Promise<PokemonResponse> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageParam}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch pokemon");
  }

  return res.json();
};

function Home() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: fetchPokemon,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.next) return undefined;

      return pages.length * 20;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading Pokémon...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-lg text-red-500">
        Error loading Pokémon
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pokémon List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.map((page) =>
          page.results.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))
        )}
      </div>

      {/* Sentinel div for infinite scroll */}
      <div ref={loadMoreRef} className="h-10 mt-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <p className="text-muted-foreground">Loading more...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
