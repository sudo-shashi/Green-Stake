"use client";

import { useState } from "react";
import { Camera, Crosshair, LoaderCircle, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function SubmitForm() {
  const reduceMotion = useReducedMotion();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoHash, setPhotoHash] = useState("");
  const [gridCell, setGridCell] = useState("");
  const [stake, setStake] = useState("5");
  const [status, setStatus] = useState<"idle" | "locating" | "ready" | "sending" | "sent">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const valid = photo && gridCell.trim().length > 3 && Number(stake) > 0;
  const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;

  function captureGps() {
    setStatus("locating");
    if (!navigator.geolocation) {
      setStatus("idle");
      setMessage("GPS is unavailable in this browser. Enter the grid cell manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGridCell(
          `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`,
        );
        setStatus("ready");
      },
      () => {
        setStatus("idle");
        setMessage("GPS permission was denied. Enter the grid cell manually.");
      },
    );
  }

  async function selectPhoto(file: File | null) {
    setPhoto(file);
    setPhotoHash("");
    if (!file) return;

    const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
    setPhotoHash(
      Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/submit-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photoHash,
        gridCell,
        stakeStroops: Number(stake) * 10_000_000,
      }),
    });

    const result = (await response.json()) as { error?: string; signing?: string };
    if (!response.ok) {
      setStatus("ready");
      setMessage(result.error ?? "Claim preparation failed.");
      return;
    }

    setStatus("sent");
    setMessage(result.signing ?? "Claim prepared for wallet signing.");
  }

  return (
    <form onSubmit={submit} className="earth-panel rounded-[8px] p-5 sm:p-8">
      <div className="grid gap-6">
        <label className="grid gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-soil)]">
            Photo proof
          </span>
          <div className="rounded-[8px] border border-dashed border-[rgba(18,53,34,0.28)] bg-[rgba(247,240,223,0.55)] p-6">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void selectPhoto(event.target.files?.[0] ?? null)}
              className="focus-ring w-full rounded-[8px] text-sm"
            />
            <p className="mt-3 text-sm text-[rgba(18,53,34,0.62)]">
              {photo ? photo.name : "Upload a clear sapling photo from the planting site."}
            </p>
          </div>
        </label>

        <label className="grid gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-soil)]">
            GPS grid cell
          </span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={gridCell}
              onChange={(event) => setGridCell(event.target.value)}
              placeholder="lat,lng rounded to 4 decimals"
              className="focus-ring focus:ring-2 focus:ring-forest min-h-12 flex-1 rounded-[8px] border border-[rgba(18,53,34,0.18)] bg-[rgba(255,251,235,0.72)] px-4"
            />
            <button 
              type="button"
              onClick={captureGps}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-moss)] px-5 py-3 font-bold text-[var(--color-cream)]"
            >
              {status === "locating" ? <LoaderCircle className="animate-spin" size={18} /> : <Crosshair size={18} />}
              Capture GPS
            </button>
          </div>
        </label>

        <label className="grid gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-soil)]">
            Stake amount
          </span>
          <input
            value={stake}
            onChange={(event) => setStake(event.target.value)}
            type="number"
            min="1"
            step="1"
            className="focus-ring focus:ring-2 focus:ring-forest min-h-12 rounded-[8px] border border-[rgba(18,53,34,0.18)] bg-[rgba(255,251,235,0.72)] px-4"
          />
        </label>
      </div>

      <motion.div
        className="mt-8 rounded-[8px] bg-[rgba(18,53,34,0.08)] p-4 text-sm leading-6"
        animate={valid && !reduceMotion ? { scale: [1, 1.015, 1] } : { scale: 1 }}
      >
        <p className="font-bold">Contract call preview</p>
        <p className="break-all text-[rgba(18,53,34,0.68)]">
          submit_claim(planter, {photoHash || "photo_hash"}, {gridCell || "grid_cell"},{" "}
          {Number(stake || 0) * 10_000_000} stroops) on {contractId}
        </p>
      </motion.div>

      <button
        disabled={!valid || status === "sending"}
        data-loading={status === "sending"}
        className="focus-ring mt-6 inline-flex data-[loading=true]:animate-pulse w-full items-center justify-center gap-2 rounded-full bg-[var(--color-forest)] px-6 py-4 font-bold text-[var(--color-cream)] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {status === "sending" ? (
          <LoaderCircle className="animate-spin" size={18} />
        ) : status === "sent" ? (
          <Camera size={18} />
        ) : (
          <Send size={18} />
        )}
        {status === "sending"
          ? "Preparing claim"
          : status === "sent"
            ? "Claim prepared for wallet signing"
            : "Prepare submit_claim"}
      </button>
      {message ? (
        <p className="mt-4 rounded-[8px] bg-[rgba(229,168,58,0.18)] p-4 text-sm font-semibold text-[var(--color-forest)]">
          {message}
        </p>
      ) : null}
    </form>
  );
}
