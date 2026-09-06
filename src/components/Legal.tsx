import { Reveal } from "../lib/motion";

const PRIVACY = [
  ["Collected", "Nothing. No analytics, crash SDKs, ad IDs or usage pings exist in any build."],
  ["Stored", "Settings and libraries live on your device in plain, exportable files."],
  ["Transmitted", "Only to hosts you configure, or the service you explicitly asked for."],
  ["Retained", "We operate no servers that hold user data, so there is nothing to retain."],
];

const TERMS = [
  ["Licence", "GPL-3.0 copyleft, publicly auditable on GitHub."],
  ["Warranty", "None. Software is provided as-is; you accept the risk of running it."],
  ["Your content", "Files you open remain entirely yours. You confirm you hold the rights to them."],
  ["Third parties", "Integrations use public endpoints and remain subject to those services' terms."],
  ["Contributions", "Inbound equals outbound. You keep copyright; the patch ships under the app's licence."],
  ["Trademarks", "Independent project. Not affiliated with or endorsed by Google, YouTube or Spotify."],
];

function Panel({
  id,
  index,
  title,
  intro,
  rows,
  footnote,
}: {
  id: string;
  index: string;
  title: string;
  intro: string;
  rows: string[][];
  footnote: string;
}) {
  return (
    <article id={id} className="spot scroll-mt-28 border border-edge p-7 sm:p-9">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">{index}</p>
      <h3 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.02em] text-bone-50">
        {title}
      </h3>
      <p className="mt-4 max-w-md leading-relaxed text-bone-300">{intro}</p>

      <dl className="mt-7">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-12 gap-4 border-t border-edge py-4">
            <dt className="col-span-4 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-500 sm:col-span-3">
              {k}
            </dt>
            <dd className="col-span-8 text-[15px] leading-relaxed text-bone-200 sm:col-span-9">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-t border-edge pt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-bone-500">
        {footnote}
      </p>
    </article>
  );
}

export default function Legal() {
  return (
    <section id="legal" className="relative scroll-mt-24 border-t border-edge px-5 py-24 sm:px-10 sm:py-32">
      <Reveal>
        <div className="border-b border-edge pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone-500">06 — Legal</p>
          <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-bone-50 sm:text-6xl">
            The short version
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-6 pt-10 lg:grid-cols-2">
        <Reveal>
          <Panel
            id="privacy"
            index="Privacy"
            title="What we know about you"
            intro="Nothing, and not as a policy choice we could quietly reverse — as an absence of code. The tables below describe every data path that exists."
            rows={PRIVACY}
            footnote="Full text lives in PRIVACY.md in each repository"
          />
        </Reveal>
        <Reveal delay={120}>
          <Panel
            id="terms"
            index="Terms"
            title="What you agree to"
            intro="Derived entirely from the licences. There is no account, no subscription and no arbitration clause, because there is no commercial relationship."
            rows={TERMS}
            footnote="Binding text lives in LICENSE and TERMS.md in each repository"
          />
        </Reveal>
      </div>
    </section>
  );
}
