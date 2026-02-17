import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface PokemonType {
  type: { name: string };
}

interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

interface PokemonAbility {
  ability: { name: string };
}

interface PokemonDetail {
  id: number;
  name: string;
  sprites: { front_default: string; other?: { "official-artwork"?: { front_default: string } } };
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-green-600",
  rock: "bg-gray-600",
  ghost: "bg-indigo-700",
  dark: "bg-gray-800",
  dragon: "bg-purple-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

const fetchPokemonDetail = async (name: string): Promise<PokemonDetail> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon details");
  return res.json();
};

function PokemonDetails() {
  const { name } = useParams<{ name: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pokemonDetail", name],
    queryFn: () => fetchPokemonDetail(name!),
    enabled: !!name,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-lg">Loading Pokémon...</div>;
  }

  if (isError || !data) {
    return <div className="text-center mt-10 text-lg text-red-500">Error loading Pokémon</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      {/* Back Link */}
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to list
      </Link>

      {/* Name & Image */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold capitalize mb-2">{data.name}</h1>
        <img
          className="w-48 h-48 mx-auto object-contain"
          src={data.sprites.other?.["official-artwork"]?.front_default || data.sprites.front_default}
          alt={data.name}
        />
      </div>

      {/* Types */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Types</h2>
        <div className="flex gap-2 flex-wrap justify-center">
          {data.types.map((t) => (
            <span
              key={t.type.name}
              className={cn(
                "px-3 py-1 rounded-full text-white font-semibold text-sm capitalize",
                typeColors[t.type.name] || "bg-gray-500"
              )}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Stats</h2>
        <div className="space-y-2">
          {data.stats.map((s) => (
            <div key={s.stat.name} className="flex items-center gap-2">
              <span className="capitalize w-24">{s.stat.name}</span>
              <div className="bg-gray-200 w-full h-4 rounded-full overflow-hidden">
                <div
                  className="h-4 rounded-full bg-green-500"
                  style={{ width: `${s.base_stat > 100 ? 100 : s.base_stat}%` }}
                />
              </div>
              <span className="ml-2 w-8 text-right">{s.base_stat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Abilities</h2>
        <div className="flex gap-2 flex-wrap justify-center">
          {data.abilities.map((a) => (
            <span
              key={a.ability.name}
              className="capitalize bg-gray-200 px-3 py-1 rounded-full font-medium text-gray-700 text-sm"
            >
              {a.ability.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
