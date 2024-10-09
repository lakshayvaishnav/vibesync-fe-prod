"use client";

import { YT_REGEX } from "@/lib/utils";
import { useSocket } from "@/context/socket-context";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useSession } from "next-auth/react";

type Props = {
  inputLink: string;
  creatorId: string;
  userId: string;
  setLoading: (value: boolean) => void;
  setInputLink: (value: string) => void;
  loading: boolean;
  enqueueToast: (type: "error" | "success", message: string) => void;
  spaceId: string;
  isSpectator: boolean;
};

export default function AddSongForm({
  inputLink,
  enqueueToast,
  setInputLink,
  loading,
  setLoading,
  userId,
  spaceId,
  isSpectator,
}: Props) {
  const { sendMessage } = useSocket();
  const wallet = useWallet();
  const { connection } = useConnection();
  const user = useSession().data?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputLink.match(YT_REGEX)) {
      setLoading(true);

      sendMessage("add-to-queue", {
        spaceId,
        userId,
        url: inputLink,
      });
    } else {
      enqueueToast("error", "Invalid please use specified format");
    }
    setLoading(false);
    setInputLink("");
  };

  const handlePayAndPlay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.publicKey || !connection) {
      enqueueToast("error", "Please connect your wallet");
      return;
    }
    if (!inputLink.match(YT_REGEX)) {
      enqueueToast("error", "Invalid please use specified format");
    }
    try {
      setLoading(true);
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(process.env.NEXT_PUBLIC_PUBLICKEY as string),
          lamports:
            Number(process.env.NEXT_PUBLIC_SOL_PER_PAYMENT) * LAMPORTS_PER_SOL,
        }),
      );

      const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      //@ts-ignore
      const signed = await wallet.signTransaction(transaction);

      const signature = await connection.sendRawTransaction(signed.serialize());

      enqueueToast("success", `Transaction signature: ${signature}`);
      await connection.confirmTransaction({
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
        signature,
      });
      enqueueToast("success", `Payment successful`);
      sendMessage("pay-and-play-next", {
        spaceId,
        userId: user?.id,
        url: inputLink,
      });
    } catch (error) {
      enqueueToast("error", `Payment unsuccessful`);
    }
    setLoading(false);
  };

  const videoId = inputLink ? inputLink.match(YT_REGEX)?.[1] : undefined;

  return (
    <div className="rounded-lg bg-black p-4 text-green-400">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-500">Add a song</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="Please paste your link"
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
          className="border-green-500 bg-gray-900 text-green-400 focus:border-green-400 focus:ring-green-400"
        />
        <Button
          disabled={loading}
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-green-600 font-bold text-black hover:bg-green-700"
        >
          {loading ? "Loading..." : "Add to Queue"}
        </Button>

        {isSpectator && (
          <Button
            disabled={loading}
            onClick={handlePayAndPlay}
            type="submit"
            className="mt-2 w-full bg-green-600 font-bold text-black hover:bg-green-700"
          >
            {loading ? "Loading..." : "Pay and Play"}
          </Button>
        )}
      </form>

      {videoId && !loading && (
        <Card className="mt-4 border-green-500 bg-gray-900">
          <CardContent className="p-4">
            <LiteYouTubeEmbed title="" id={videoId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
