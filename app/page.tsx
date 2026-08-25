import pares from "@/data/palabras.json";
import ImpostorLunar from "@/components/impostor-lunar";

export default function Home() {
  return <ImpostorLunar pares={pares} />;
}
