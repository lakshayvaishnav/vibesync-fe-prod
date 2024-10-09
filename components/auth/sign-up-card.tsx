"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { SignInFlow } from "@/types/auth-types";
import { Span } from "next/dist/trace";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const StarryNight = () => {
  useEffect(() => {
    const canvas = document.getElementById("starry-night") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const stars: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
    }[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    const drawStars = (time: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        star.alpha = Math.sin(time * star.twinkleSpeed) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    };

    requestAnimationFrame(drawStars);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas id="starry-night" className="fixed inset-0 z-0" />;
};

interface SignInCardProps {
  setFormType: (state: SignInFlow) => void;
}

export default function SignupCard({ setFormType: setState }: SignInCardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const signInWithProvider = async (provider: "google" | "credentials") => {
    try {
      if (provider === "credentials") {
        const res = signIn(provider, {
          email,
          password,
          redirect: false,
          callbackUrl: "/home",
        });
        res.then((res) => {
          if (res?.error) {
            setError(res.error);
          }
          if (!res?.error) {
            router.push("/");
          }
          setPending(false);
        });
      }
      if (provider === "google") {
        const res = signIn(provider, {
          redirect: false,
          callbackUrl: "/home",
        });
        res.then((res) => {
          if (res?.error) {
            setError(res.error);
          }
          console.log(res);
          setPending(false);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerCredentialSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setPending(false);
      return;
    }
    signInWithProvider("credentials");
  };

  const handleGoogleSignup = (provider: "google") => {
    setError("");
    setPending(true);
    signInWithProvider(provider);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <StarryNight />
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-white">Join VibeSync</h2>
          <p className="mt-2 text-sm text-gray-400">
            Create your account and start your musical journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handlerCredentialSignup}>
          <div className="space-y-4">
            <div className="group relative">
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                disabled={pending}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-lg border-green-500/50 bg-black/50 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-green-500 focus:ring-green-500 group-hover:border-green-400"
                placeholder="Email address"
              />
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
            <div className="group relative">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-lg border-green-500/50 bg-black/50 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-green-500 focus:ring-green-500 group-hover:border-green-400"
                placeholder="Password"
              />
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
            <div className="group relative">
              <Label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </Label>
              <Input
                disabled={pending}
                id="confirm-password"
                name="confirm-password"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="block w-full rounded-lg border-green-500/50 bg-black/50 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-green-500 focus:ring-green-500 group-hover:border-green-400"
                placeholder="Confirm Password"
              />
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          </div>

          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-semibold text-black transition duration-300 ease-in-out hover:scale-105 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? <h1>Loading...</h1> : null}
              Sign up
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black/50 px-2 text-gray-400 backdrop-blur-sm">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              disabled={pending}
              onClick={() => handleGoogleSignup("google")}
              type="button"
              className="flex w-full transform items-center justify-center rounded-lg border border-green-500/50 bg-black/50 px-4 py-3 font-semibold text-white backdrop-blur-sm transition duration-300 ease-in-out hover:scale-105 hover:border-green-400 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Continue With Google
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="font-medium text-green-500 transition-colors duration-300 hover:cursor-pointer hover:text-green-400"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
