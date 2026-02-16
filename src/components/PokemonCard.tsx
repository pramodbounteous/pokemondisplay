import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
}


interface PokemonCardProps {
  pokemon: Pokemon;
}

function PokemonCard({ pokemon }: PokemonCardProps) {
 // console.log("Rendering PokemonCard for:", pokemon.name);
  const navigate = useNavigate();

  // Extract Pokémon ID from API URL
  const pokemonId = pokemon.url.split("/")[6];

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
//  useEffect(() => {
//     console.log("PokemonCard useEffect for:", pokemon.name);
    // const fetchPokemon = async () => {
    //   try {
    //     const response = await axios.get(
    //       "https://pokeapi.co/api/v2/pokemon?limit=20"
    //     );
    //     setPokemonList(response.data.results);
    //   } catch (error) {
    //     console.error("Error fetching pokemon:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    //fetchPokemon();
  //}, []);

  return (
    <Card
      className="cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
    >
      <CardContent className="flex flex-col items-center p-4">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-24 h-24"
        />
        <h2 className="capitalize mt-2 text-lg font-semibold">
          {pokemon.name}
        </h2>
      </CardContent>
    </Card>
  );

}

export default PokemonCard;
