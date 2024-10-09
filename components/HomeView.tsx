"use client";

import { toast } from "react-toastify";
import { Appbar } from "@/components/Appbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardSkeleton from "./ui/cardSkeleton";
import { motion } from "framer-motion";

interface Space {
  endTime?: Date | null;
  hostId: string;
  id: string;
  isActive: boolean;
  name: string;
  startTime: Date | null;
}

const Star = ({ index }: { index: number }) => {
  const size = Math.random() * 2 + 1;
  const duration = Math.random() * 3 + 4; // Slower twinkling: 4-7 seconds

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: index * 0.1, // Stagger the start of each star's animation
      }}
    />
  );
};

export default function HomeView() {
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [spaces, setSpaces] = useState<Space[] | null>(null);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/spaces", {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch spaces");
        }
        const fetchedSpaces: Space[] = data.spaces;
        setSpaces(fetchedSpaces);
      } catch (error) {
        toast.error("Error fetching spaces");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  const handleCreateSpace = async () => {
    setIsCreateSpaceOpen(false);
    try {
      const response = await fetch(`/api/spaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceName: spaceName,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create space");
      }
      const newSpace = data.space;
      setSpaces((prev) => {
        const updatedSpaces: Space[] = prev ? [...prev, newSpace] : [newSpace];
        return updatedSpaces;
      });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || "Error Creating Space");
    }
  };

  const handleDeleteSpace = async (spaceId: string) => {
    try {
      const response = await fetch(`/api/spaces/?spaceId=${spaceId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete space");
      }
      setSpaces((prev) => {
        const updatedSpaces: Space[] = prev
          ? prev.filter((space) => space.id !== spaceId)
          : [];
        return updatedSpaces;
      });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || "Error Deleting Space");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {[...Array(100)].map((_, i) => (
        <Star key={i} index={i} />
      ))}
      <Appbar />
      <div className="relative z-10 flex flex-grow flex-col items-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-36 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-9xl font-bold text-transparent"
        >
          Spaces
        </motion.div>
        <Button
          onClick={() => {
            setIsCreateSpaceOpen(true);
          }}
          className="duration-900 mt-10 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-bold text-black transition-all hover:from-green-500 hover:to-blue-600"
        >
          Create a new Space
        </Button>

        <div className="mt-20 grid grid-cols-1 gap-8 p-4 md:grid-cols-2">
          {loading && (
            <div className="dark mx-auto h-[500px] w-full py-4 sm:w-[450px] lg:w-[500px]">
              <CardSkeleton />
            </div>
          )}
          {loading && (
            <div className="dark mx-auto h-[500px] w-full py-4 sm:w-[450px] lg:w-[500px]">
              <CardSkeleton />
            </div>
          )}

          {!loading &&
            spaces &&
            spaces.map((space) => {
              return (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mx-auto h-[500px] w-full rounded-3xl border-0 bg-gradient-to-br from-green-900 to-blue-900 py-4 shadow-lg transition-all duration-300 hover:shadow-2xl sm:w-[450px] lg:w-[500px]">
                    <CardHeader className="flex-col items-center justify-center px-4 pb-0 pt-2 text-white">
                      <div className="text-4xl font-bold">{space.name}</div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center overflow-visible py-2">
                      <Image
                        width={450}
                        height={300}
                        alt="Card background"
                        className="w-[28rem] rounded-3xl object-cover"
                        src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                      <div className="mt-6 flex justify-between space-x-6">
                        <Button
                          onClick={() => {
                            router.push(`/dashboard/${space.id}`);
                          }}
                          className="rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-bold text-black transition-all duration-300 hover:from-green-500 hover:to-blue-600"
                        >
                          View Space
                        </Button>

                        <Button
                          onClick={() => {
                            handleDeleteSpace(space.id);
                          }}
                          className="rounded-lg bg-gradient-to-r from-red-400 to-red-600 px-4 py-2 font-bold text-white transition-all duration-300 hover:from-red-500 hover:to-red-700"
                        >
                          Delete This Space
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      </div>

      <Dialog open={isCreateSpaceOpen} onOpenChange={setIsCreateSpaceOpen}>
        <DialogContent className="bg-gradient-to-br from-green-900 to-blue-900 text-white">
          <DialogHeader>
            <DialogTitle className="mb-10 text-center text-2xl font-bold">
              Create new space
            </DialogTitle>
            <fieldset className="Fieldset">
              <label
                className="mb-2 block w-full text-left text-xl font-bold text-white"
                htmlFor="name"
              >
                Name of the Space
              </label>
              <input
                className="mt-2 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] bg-black/50 bg-white px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="name"
                defaultValue="New Space"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSpaceName(e.target.value);
                }}
              />
            </fieldset>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateSpaceOpen(false)}
              className="border-white font-bold text-black transition-all duration-300 hover:bg-green-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSpace}
              className="bg-gradient-to-r from-green-400 to-blue-500 font-bold text-black transition-all duration-300 hover:from-green-500 hover:to-blue-600"
            >
              Create Space
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
