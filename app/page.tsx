import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Headphones,
  Music,
  Radio,
  Disc,
  AArrowUp,
  Amphora,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { authOptions } from "@/lib/auth-options";
export default async function Component() {
  const session = await getServerSession(authOptions);
  console.log("session: ", session);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            VibeSync
          </Link>
          <div className="space-x-4">
            <Link
              href={{
                pathname: "/auth",
                query: {
                  authType: "/signUp",
                },
              }}
              className="transition-colors hover:text-green-400"
            >
              SignUp
            </Link>

            <Link
              href={{
                pathname: "/auth",
                query: {
                  authType: "/signIn",
                },
              }}
              className="transition-colors hover:text-green-400"
            >
              SignIn
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-black py-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-5xl">
            The Future of Music Streaming is Here
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            Stream millions of songs with crystal-clear audio quality
          </p>
          <Button className="transform rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-green-600">
            Start Listening Now
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose VibeSync?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Headphones,
                title: "Collaborative Playlists",
                description:
                  "Create playlists together with your coworkers and enjoy a shared music experience.",
              },
              {
                icon: Music,
                title: "Vast Music Library",
                description:
                  "Access millions of songs and genres to suit every mood and occasion.",
              },
              {
                icon: AArrowUp,
                title: "Upvote System",
                description:
                  "The most popular tracks are played next, ensuring everyone's favorites get airtime.",
              },
              {
                icon: Radio,
                title: "Host Streaming",
                description:
                  "A host can stream music seamlessly while others join the room and contribute.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="transform rounded-lg bg-gradient-to-br from-gray-900 to-black p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
              >
                <feature.icon className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Experience the Future of Music?
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Join millions of music lovers and start your journey today
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-64 border-green-500 bg-black text-white"
            />
            <Button className="transform rounded-full bg-green-500 px-6 py-2 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-green-600">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-10">
        <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold">
              NeonBeats
            </Link>
            <p className="text-sm text-gray-500">
              © 2024 NeonBeats. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-green-400"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-green-400"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-green-400"
            >
              Careers
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-green-400"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
