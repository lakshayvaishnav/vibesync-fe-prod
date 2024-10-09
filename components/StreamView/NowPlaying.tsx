"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
//@ts-ignore
import YouTubePlayer from "youtube-player";
import Image from "next/image";

type Video = {
  extractedId: string;
  bigImg: string;
  title: string;
};

type Props = {
  playVideo: boolean;
  currentVideo: Video | null;
  playNextLoader: boolean;
  playNext: () => void;
};

export default function NowPlaying({
  playVideo,
  currentVideo,
  playNext,
  playNextLoader,
}: Props) {
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoPlayerRef.current || !currentVideo) {
      return;
    }
    let player = YouTubePlayer(videoPlayerRef.current);

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo.extractedId);

    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();
    function eventHandler(event: any) {
      console.log(event);
      console.log(event.data);
      if (event.data === 0) {
        playNext();
      }
    }
    player.on("stateChange", eventHandler);
    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef, playNext]);

  return (
    <div className="space-y-4 rounded-lg bg-black p-4 text-green-400">
      <h2 className="text-2xl font-bold text-green-500">Now Playing</h2>
      <Card className="border-green-500 bg-gray-900">
        <CardContent className="p-4">
          {currentVideo ? (
            <div>
              {playVideo ? (
                <div ref={videoPlayerRef} className="aspect-video w-full" />
              ) : (
                <>
                  <Image
                    height={288}
                    width={288}
                    alt={currentVideo.bigImg}
                    src={currentVideo.bigImg}
                    className="h-72 w-full rounded object-cover"
                  />
                  <p className="mt-2 text-center font-semibold text-green-400">
                    {currentVideo.title}
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-green-400">No video playing</p>
          )}
        </CardContent>
      </Card>
      {playVideo && (
        <Button
          disabled={playNextLoader}
          onClick={playNext}
          className="w-full bg-green-600 font-bold text-black hover:bg-green-700"
        >
          <Play className="mr-2 h-4 w-4" />{" "}
          {playNextLoader ? "Loading..." : "Play next"}
        </Button>
      )}
    </div>
  );
}
