import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PokemonDetailsType {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

function PokemonDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState<PokemonDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );

        setPokemon(response.data);
      } catch (err) {
        console.error("Error fetching pokemon details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchPokemonDetails();
    }
  }, [name]);

  if (loading) {
    return <div className="text-center mt-10">Loading details...</div>;
  }

  if (error || !pokemon) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load Pokémon.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6">
        <CardContent className="flex flex-col items-center space-y-4">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32"
          />

          <h1 className="text-2xl font-bold capitalize">
            {pokemon.name}
          </h1>

          <p><strong>Height:</strong> {pokemon.height}</p>
          <p><strong>Weight:</strong> {pokemon.weight}</p>

          <div className="text-center">
            <strong>Types:</strong>
            <div className="mt-2">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className="ml-2 px-2 py-1 bg-blue-200 rounded text-sm"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <strong>Abilities:</strong>
            <div className="mt-2">
              {pokemon.abilities.map((ability, index) => (
                <span
                  key={index}
                  className="ml-2 px-2 py-1 bg-green-200 rounded text-sm"
                >
                  {ability.ability.name}
                </span>
              ))}
            </div>
          </div>

          <Button onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PokemonDetails;
