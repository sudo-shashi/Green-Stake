import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { StatusBadge } from "@/components/StatusBadge";
import { getClaimById } from "@/lib/claims";

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = await getClaimById(Number(id));
  if (!claim) notFound();

  const timeline = [
    { label: "Submitted", active: true },
    { label: "Verifier review", active: ["Pending", "Approved", "Paid"].includes(claim.status) },
    { label: "Approved", active: ["Approved", "Paid"].includes(claim.status) },
    { label: "Paid", active: claim.status === "Paid" },
  ];

  return (
    <section className="px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-[rgba(18,53,34,0.08)] px-4 py-2 text-sm font-bold"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="earth-panel overflow-hidden rounded-[8px]">
              <div className="relative aspect-[4/3] bg-[linear-gradient(180deg,#dfe9cf,#8fad66_62%,#6f4728_62%)]">
                <div className="absolute bottom-[28%] left-1/2 h-32 w-5 -translate-x-1/2 rounded-t-full bg-[var(--color-bark)]" />
                <div className="absolute bottom-[42%] left-1/2 size-40 -translate-x-1/2 rounded-full bg-[var(--color-moss)]" />
                <div className="absolute bottom-[43%] left-[34%] size-28 rounded-full bg-[var(--color-leaf)]" />
                <div className="absolute bottom-[43%] right-[34%] size-28 rounded-full bg-[#6d963f]" />
                <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[var(--color-soil)]" />
                <p className="absolute bottom-5 left-5 right-5 break-all rounded-[8px] bg-[rgba(247,240,223,0.84)] p-4 text-sm font-bold text-[var(--color-forest)]">
                  Photo hash: {claim.photoHash}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="earth-panel rounded-[8px] p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
                    Claim detail
                  </p>
                  <h1 className="font-display mt-3 text-5xl font-semibold">Claim #{claim.id}</h1>
                </div>
                <StatusBadge status={claim.status} />
              </div>
              <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                <Detail label="Grid cell" value={claim.gridCell} />
                <Detail label="Stake" value={`${claim.stakeAmount} XLM`} />
                <Detail label="Planter" value={claim.planter} />
                <Detail label="Photo hash" value={claim.photoHash} />
                <Detail label="Approve votes" value={String(claim.votes.approve)} />
                <Detail label="Reject votes" value={String(claim.votes.reject)} />
              </div>
              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-soil)]">
                  Status timeline
                </p>
                <div className="mt-5 grid gap-3">
                  {timeline.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span
                        className={`size-3 rounded-full ${
                          item.active ? "bg-[var(--color-moss)]" : "bg-[rgba(18,53,34,0.18)]"
                        }`}
                      />
                      <span className={item.active ? "font-bold" : "text-[rgba(18,53,34,0.48)]"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[rgba(18,53,34,0.07)] p-4">
      <p className="text-[rgba(18,53,34,0.52)]">{label}</p>
      <p className="mt-1 break-all font-bold">{value}</p>
    </div>
  );
}
