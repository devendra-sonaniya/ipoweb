import Image from "next/image";

export const GROWW_REFERRAL_URL = "https://app.groww.in/v3cO/o18t2d88";

export function GrowwAdBanner() {
  return (
    <aside
      aria-label="Groww advertisement"
      className="relative mt-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-green-950/70 p-4 shadow-[0_12px_35px_rgba(34,197,94,0.10)] sm:p-5 lg:px-6"
    >
      <span className="absolute right-3 top-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500 sm:right-4 sm:top-3">
        Advertisement
      </span>

      <div className="grid min-w-0 gap-3 pt-3 sm:gap-4 sm:pt-2 md:grid-cols-[130px_minmax(0,1fr)_76px_190px] md:items-center md:gap-4 md:pt-0 lg:grid-cols-[150px_minmax(0,1fr)_88px_220px] lg:gap-5">
        <div className="flex min-w-0 items-center gap-2.5" aria-label="Groww">
          <Image
            src="/brokers/groww.svg"
            alt="Groww logo"
            width={38}
            height={38}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="truncate text-2xl font-black tracking-tight text-white">Groww</span>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_68px] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_76px] md:contents">
          <div className="min-w-0">
            <p className="text-base font-black leading-tight text-white sm:text-xl">
              India&apos;s #1 Investing Platform
            </p>
            <p className="mt-1 text-sm font-extrabold text-green-400 sm:text-base">
              Free Demat Account
            </p>
            <p className="mt-1.5 max-w-2xl break-words text-[11px] font-medium leading-relaxed text-slate-300 sm:text-sm">
              Stocks • Mutual Funds • IPOs • Bonds • Commodities
            </p>
          </div>

          <div
            aria-label="Groww mobile investing app preview"
            role="img"
            className="mx-auto flex h-[108px] w-[68px] max-w-full shrink-0 flex-col overflow-hidden rounded-[14px] border-2 border-slate-600 bg-slate-950 p-1.5 shadow-lg shadow-black/30 sm:h-28 sm:w-[72px] md:h-24 md:w-16"
          >
            <div className="mx-auto h-1 w-5 rounded-full bg-slate-600" />
            <div className="mt-1 flex items-center gap-1">
              <Image
                src="/brokers/groww.svg"
                alt=""
                width={10}
                height={10}
                aria-hidden="true"
                className="h-2.5 w-2.5 object-contain"
              />
              <span className="text-[6px] font-black text-white">Groww</span>
            </div>
            <p className="mt-1.5 text-[5px] font-bold uppercase tracking-wide text-slate-500">NIFTY 50</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[8px] font-black text-white">24,812</span>
              <span className="text-[5px] font-bold text-green-400">+0.84%</span>
            </div>
            <svg viewBox="0 0 56 25" className="mt-1 h-6 w-full" aria-hidden="true">
              <path d="M1 22 L8 18 L14 20 L21 11 L28 14 L36 6 L43 9 L55 2" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400" />
              <path d="M1 22 L8 18 L14 20 L21 11 L28 14 L36 6 L43 9 L55 2 L55 25 L1 25 Z" fill="currentColor" className="text-green-500/15" />
            </svg>
            <div className="mt-auto grid grid-cols-2 gap-1">
              <div className="rounded bg-slate-900 p-1">
                <p className="text-[4px] uppercase text-slate-500">Portfolio</p>
                <p className="text-[6px] font-bold text-white">₹2.4L</p>
              </div>
              <div className="rounded bg-green-500/10 p-1">
                <p className="text-[4px] uppercase text-slate-500">Returns</p>
                <p className="text-[6px] font-bold text-green-400">+18.2%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_72px] items-center gap-2 md:flex md:flex-col md:items-stretch md:gap-2">
          <a
            href={GROWW_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 min-w-0 max-w-full items-center justify-center rounded-xl bg-green-500 px-2.5 py-2.5 text-center text-[11px] font-black leading-tight text-slate-950 shadow-lg shadow-green-950/30 transition hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:px-4 sm:text-sm"
          >
            Open Free Demat Account →
          </a>

          <div className="flex min-w-0 items-center justify-center gap-1.5 text-center md:justify-end md:text-right">
            <span aria-hidden="true" className="text-base text-green-400">◆</span>
            <p className="min-w-0 text-[10px] font-semibold leading-tight text-slate-400 sm:text-xs">
              Trusted by
              <strong className="block text-xs font-black text-white sm:text-sm">1Cr+ Indians</strong>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
