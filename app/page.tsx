import { GTMInputForm } from "@/components/input/gtm-input-form";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Prospect Swarm
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          AI-powered multi-agent GTM intelligence. Discover, qualify, and engage
          your ideal customers.
        </p>
      </div>
      <GTMInputForm />
    </main>
  );
}
