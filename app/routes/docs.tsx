import type { Route } from "./+types/docs";


export default function Home({ params }: Route.ComponentProps) {
    const { teamId } = params;
    return (
        <>
            <h1>Docs</h1>
            <pre>{teamId}</pre>
        </>
    );
}
