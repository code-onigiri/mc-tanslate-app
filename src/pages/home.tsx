import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MC-Translate" },
    { name: "description", content: "There are nothing" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to MC-Translate</h1>
    </div>
  );
}
