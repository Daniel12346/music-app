import Hero from "@/components/header";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">Music app</main>
    </>
  );
}
