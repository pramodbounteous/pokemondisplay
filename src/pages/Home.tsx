import { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "@/components/PokemonCard";

interface Pokemon {
  name: string;
  url: string;
}


function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  //const[count, setCount] = useState(0);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );
        setPokemonList(response.data.results);
      } catch (error) {
        console.error("Error fetching pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading Pokémon...
      </div>
    );
  }


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pokémon List
      </h1>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}

export default Home;
