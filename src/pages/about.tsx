import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "About MC-Translate" },
        { name: "description", content: "MC-Translate" },
    ]
}

export default function About() {
    return (
        <div>
            <h1>About MC-Translate</h1>
            <p>MC-TranslateはMinecraftの.lang,.jsonファイルを簡単に翻訳できるようにするアプリです。</p>
        </div>
    )
}