import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">QAPT</h1>
          <nav className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Modern Property Management Made Simple
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  QAPT helps property owners and managers streamline operations,
                  improve tenant satisfaction, and boost profitability.
                </p>
                <div className="flex gap-4">
                  <Link href="/auth/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <Image
                  src="/placeholder-hero.svg"
                  alt="Property Management"
                  width={500}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Property Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Easily manage all your properties in one place with detailed tracking and reporting.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Tenant Portal</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide tenants with a dedicated portal for payments, maintenance requests, and communication.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Assign custom roles to team members with specific permissions for seamless collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2023 QAPT Property Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
