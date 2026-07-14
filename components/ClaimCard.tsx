import Link from "next/link";
import type { Claim } from "@/lib/claims";
import { StatusBadge } from "./StatusBadge";

export function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <Link
      href={`/claim/${claim.id}`}
      className="focus-ring group earth-panel block overflow-hidden rounded-[8px] transition duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#dfe9cf,#8fad66_62%,#6f4728_62%)]">
        <div className="absolute bottom-[28%] left-1/2 h-24 w-4 -translate-x-1/2 rounded-t-full bg-[var(--color-bark)]" />
        <div className="absolute bottom-[42%] left-1/2 size-28 -translate-x-1/2 rounded-full bg-[var(--color-moss)] transition duration-700 group-hover:scale-105" />
        <div className="absolute bottom-[43%] left-[38%] size-20 rounded-full bg-[var(--color-leaf)]" />
        <div className="absolute bottom-[43%] right-[38%] size-20 rounded-full bg-[#6d963f]" />
        <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[var(--color-soil)]" />
        <p className="absolute bottom-4 left-4 max-w-[80%] break-all rounded-full bg-[rgba(247,240,223,0.82)] px-3 py-1 text-xs font-bold text-[var(--color-forest)]">
          {claim.photoHash.slice(0, 18)}
        </p>
        <div className="absolute left-4 top-4">
          <StatusBadge status={claim.status} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-semibold">Claim #{claim.id}</p>
            <p className="mt-1 text-sm text-[rgba(18,53,34,0.68)]">{claim.gridCell}</p>
          </div>
          <p className="rounded-full bg-[rgba(18,53,34,0.08)] px-3 py-1 text-sm font-bold">
            {claim.stakeAmount} XLM
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[rgba(18,53,34,0.52)]">Planter</p>
            <p className="font-semibold">{claim.planter}</p>
          </div>
          <div>
            <p className="text-[rgba(18,53,34,0.52)]">Votes</p>
            <p className="font-semibold">
              {claim.votes.approve} approve / {claim.votes.reject} reject
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
