"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  FaTelegramPlane,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LiaAnkhSolid } from "react-icons/lia";
import { brokerLinks } from "@/lib/brokerLinks";
import { socialLinks } from "@/lib/socialLinks";
import {
  getAllotmentButtonState,
  type AllotmentButtonIPO,
} from "@/lib/allotmentButtonState";
import { HomepageFAQ } from "./components/IPOFAQ";

type IPO = AllotmentButtonIPO & {
  name: string;
  type: string;
  status: string;
  sentiment: string;
  priceBand: string;
  gmp: string;
  listingGain: string;
  subscription: string;
  openDate: string;
  closeDate: string;
  allotmentDate?: string;
  listingDate: string;
  registrar?: string;
};

const subscribeToTheme = (onStoreChange: () => void) => {
  window.addEventListener("ipoweb-theme-change", onStoreChange);
  return () => window.removeEventListener("ipoweb-theme-change", onStoreChange);
};

const getCurrentTheme = () => document.documentElement.classList.contains("dark");
const getServerTheme = () => true;

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function badgeColor(value: string) {
  const text = value.toUpperCase();

  if (
    text === "POSITIVE" ||
    text === "OPEN" ||
    text === "MAINBOARD"
  ) {
    return "bg-green-500/15 text-green-400 border-green-500/30";
  }

  if (
    text === "NEGATIVE" ||
    text === "CLOSED"
  ) {
    return "bg-red-500/15 text-red-400 border-red-500/30";
  }

  if (text === "LISTED") {
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  }

  return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
}

export default function Home() {

  const [ipos,setIpos]=useState<IPO[]>([]);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState<string | null>(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const [contactOpen,setContactOpen]=useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [search,setSearch]=useState("");
  const darkMode = useSyncExternalStore(
    subscribeToTheme,
    getCurrentTheme,
    getServerTheme,
  );

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;
    document.documentElement.classList.toggle("dark", nextDarkMode);
    document.documentElement.dataset.theme = nextDarkMode ? "dark" : "light";
    localStorage.setItem("ipoweb-theme", nextDarkMode ? "dark" : "light");
    window.dispatchEvent(new Event("ipoweb-theme-change"));
  };

  useEffect(()=>{

    async function load(){

      try{

        const res=await fetch("/api/ipos",{
          cache:"no-store"
        });

        const data=await res.json();

        if (!res.ok) {
          throw new Error(
            typeof data?.message === "string"
              ? data.message
              : "Unable to load IPO data."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("IPO API returned an invalid response.");
        }

        setIpos(data);

      }catch(error){

        setIpos([]);
        setLoadError(
          error instanceof Error ? error.message : "Unable to load IPO data."
        );

      }finally{

        setLoading(false);

      }

    }

    load();

  },[]);

  const filtered=useMemo(()=>{

    const key=search.toLowerCase();

    return ipos.filter((ipo)=>

      ipo.name.toLowerCase().includes(key)||
      ipo.type.toLowerCase().includes(key)||
      ipo.status.toLowerCase().includes(key)||
      ipo.gmp.toLowerCase().includes(key)||
      ipo.subscription.toLowerCase().includes(key)

    );

  },[ipos,search]);
return (
  <main className="min-h-screen bg-slate-950 text-white">

    {/* HEADER */}
<header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

  <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-5">

    <div className="relative">

  <button
    onClick={()=>setMenuOpen(!menuOpen)}
    className="rounded-lg p-2 text-2xl transition hover:bg-slate-800"
  >
    ☰
  </button>

  {menuOpen && (
    <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">

      <Link
        href="/allotment-status"
        onClick={()=>setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 font-bold text-yellow-400 transition hover:bg-slate-800 hover:text-yellow-300"
      >
        📋 IPO Allotment Status
      </Link>

      <Link
        href="/ipo-calendar"
        onClick={()=>setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        📅 IPO Calendar
      </Link>

      <Link
        href="/listed-ipo-performance"
        onClick={()=>setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        📈 Listed IPO Performance
      </Link>

      <Link
        href="/ipo-faq"
        onClick={()=>setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        ❓ FAQs
      </Link>

      <div className="mt-2 border-t border-slate-800 pt-2">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          <span>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
          <span className="text-sm text-slate-400">
            {darkMode ? "ON" : "OFF"}
          </span>
        </button>
      </div>

    </div>
  )}

</div>

    <Link
      href="/"
      className="text-3xl font-black tracking-tight"
    >
      <span className="text-green-400">IPO</span>Web.in
    </Link>

    <div className="hidden flex-1 md:block">

      <input
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search IPO..."
        className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 outline-none transition focus:border-green-400"
      />

    </div>

    <nav className="hidden items-center gap-6 font-bold text-white lg:flex">

      <Link href="/" className="hover:text-green-400">
        Home
      </Link>

      <Link href="/gmp" className="hover:text-green-400">
        IPO GMP
      </Link>

      <Link href="/mainboard-ipo" className="hover:text-green-400">
        Mainboard IPO
      </Link>

      <Link href="/sme-ipo" className="hover:text-green-400">
        SME IPO
      </Link>

      <Link href="/upcoming-ipo" className="hover:text-green-400">
        Upcoming IPO
      </Link>

      <Link href="/allotment-status" className="text-yellow-400 hover:text-yellow-300">
        Allotment Status
      </Link>

    </nav>

    <div className="relative">

  <button
    onClick={()=>setApplyOpen(!applyOpen)}
    className="rounded-lg bg-green-500 px-5 py-2.5 font-black text-slate-950 transition hover:bg-green-400"
  >
    Apply IPO
  </button>

  {applyOpen && (
    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">

      {brokerLinks.map((broker) => (
        <a
          key={broker.name}
          href={broker.url || undefined}
          target={broker.url ? "_blank" : undefined}
          rel={broker.url ? "noopener noreferrer" : undefined}
          aria-disabled={!broker.url}
          tabIndex={broker.url ? undefined : -1}
          onClick={broker.url ? undefined : (event) => event.preventDefault()}
          className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          <div
            style={{
              width: 22,
              height: 22,
              minWidth: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={broker.logo}
              alt={broker.name}
              width={22}
              height={22}
              style={{
                display: "block",
                width: 22,
                height: 22,
                objectFit: "contain",
              }}
            />
          </div>
          {broker.name}
        </a>
      ))}

    </div>
  )}

</div>

    <div className="relative">

  <button
    onClick={()=>setContactOpen(!contactOpen)}
    className="rounded-full border border-slate-700 p-2 transition hover:border-green-400"
  >
    👤
  </button>

  {contactOpen && (
    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">

      {/* LOGIN / SIGNUP */}
      <div className="border-b border-slate-800 pb-3">
        <Link
          href="/login"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-green-400 transition hover:bg-slate-800"
        >
          Sign Up
        </Link>
      </div>

      {/* CONTACT / SUPPORT */}
      <div className="border-b border-slate-800 py-3">
        <p className="px-3 pb-2 text-xs font-black uppercase text-slate-500">
          Contact Us
        </p>

        <a
          href="mailto:support@ipoweb.in"
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          📧 Email Support
        </a>
        <a
          href="https://t.me/yourchannel"
          target="_blank"
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          📢 Telegram
        </a>
        <a
          href="https://wa.me/91XXXXXXXXXX"
          target="_blank"
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          💬 WhatsApp
        </a>
      </div>

      {/* COMPANY LINKS */}
      <div className="border-b border-slate-800 py-3">
        <Link
          href="/about-us"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          About Us
        </Link>
        <Link
          href="/our-team"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          Our Team
        </Link>
        <Link
          href="/advertisement"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-white transition hover:bg-slate-800"
        >
          Advertisement
        </Link>
      </div>

      {/* LEGAL */}
      <div className="pt-3">
        <Link
          href="/terms"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-slate-400 transition hover:bg-slate-800"
        >
          Terms & Conditions
        </Link>
        <Link
          href="/privacy-policy"
          onClick={()=>setContactOpen(false)}
          className="block rounded-lg px-3 py-2 font-bold text-slate-400 transition hover:bg-slate-800"
        >
          Privacy Policy
        </Link>
      </div>

    </div>
  )}

</div>

  </div>

  {/* MOBILE/EXTRA MENU */}
  {menuOpen && (
    <div className="border-t border-slate-800 bg-slate-950 px-5 py-5">

      <div className="mb-4 md:hidden">
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search IPO..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 outline-none transition focus:border-green-400"
        />
      </div>

      <nav className="flex flex-col gap-4 font-bold text-white lg:hidden">

        <Link href="/" onClick={()=>setMenuOpen(false)} className="hover:text-green-400">
          Home
        </Link>

        <Link href="/gmp" onClick={()=>setMenuOpen(false)} className="hover:text-green-400">
          IPO GMP
        </Link>

        <Link href="/mainboard-ipo" onClick={()=>setMenuOpen(false)} className="hover:text-green-400">
          Mainboard IPO
        </Link>

        <Link href="/sme-ipo" onClick={()=>setMenuOpen(false)} className="hover:text-green-400">
          SME IPO
        </Link>

        <Link href="/upcoming-ipo" onClick={()=>setMenuOpen(false)} className="hover:text-green-400">
          Upcoming IPO
        </Link>

        <Link href="/allotment-status" onClick={()=>setMenuOpen(false)} className="text-yellow-400 hover:text-yellow-300">
          Allotment Status
        </Link>

<Link
  href="/ipo-faq"
  onClick={() => setMenuOpen(false)}
  className="hover:text-green-400"
>
  FAQs
</Link>
        <Link
          href="/apply-ipo"
          onClick={()=>setMenuOpen(false)}
          className="mt-2 rounded-lg bg-green-500 px-5 py-3 text-center font-black text-slate-950"
        >
          Apply IPO
        </Link>

      </nav>

    </div>
  )}

</header>

    {/* HERO */}

    <section className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      <div className="mx-auto max-w-[1500px] px-5 py-12">

        <h1 className="text-4xl font-black uppercase">

          <span className="text-green-400">
            IPOWEB
          </span>{" "}
          MARKET INTELLIGENCE

        </h1>

        <p className="mt-5 max-w-3xl text-slate-300">

          Compare every IPO in one professional table.
          Click any row to open complete IPO Dashboard.

        </p>

      </div>

    </section>

    {/* TABLE */}

    <section className="mx-auto max-w-[1500px] px-5 py-10">

      {loading ? (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

          Loading IPO...

        </div>

      ) : loadError ? (

        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center text-red-200">
          {loadError}
        </div>

      ) : filtered.length === 0 ? (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
          {ipos.length === 0 ? "No IPOs are available right now." : "No IPOs match your search."}
        </div>

      ) : (

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

          <div className="overflow-x-auto">

            <table className="min-w-[1450px] w-full">

              <thead className="sticky top-0 bg-slate-950">

                <tr className="border-b border-slate-700">

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    IPO NAME
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    TYPE
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    SENTIMENT
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    GMP
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    EST. GAIN
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    PRICE BAND
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    OPEN
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    CLOSE
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    SUBSCRIPTION
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    STATUS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((ipo) => {
                  const allotmentButton = getAllotmentButtonState(ipo);

                  return (
  <tr
    key={ipo.name}
    onClick={() => {
      window.location.href = `/ipo/${createSlug(ipo.name)}`;
    }}
    className="cursor-pointer border-b border-slate-800 transition-all duration-200 hover:bg-slate-800/70 hover:shadow-lg"
  >
    <td className="px-6 py-6">
      <div className="flex flex-col">
        <span className="text-lg font-black text-white">
          {ipo.name}
        </span>

        <span className="mt-2 text-xs font-semibold text-slate-500">
          Click to view dashboard →
        </span>

        {allotmentButton.kind === "available" ? (
          <a
            href={allotmentButton.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-3 w-fit rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-green-400"
          >
            Allotment Status
          </a>
        ) : allotmentButton.kind === "soon" ? (
          <button
            type="button"
            disabled
            onClick={(event) => event.stopPropagation()}
            className="mt-3 w-fit rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            Allotment Soon
          </button>
        ) : null}
      </div>
    </td>

    <td className="px-6 py-6">
      <span className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(ipo.type)}`}>
        {ipo.type}
      </span>
    </td>

    <td className="px-6 py-6">
      <span className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(ipo.sentiment || "Neutral")}`}>
        {ipo.sentiment || "Neutral"}
      </span>
    </td>

    <td className="px-6 py-6">
      <span className="text-xl font-black text-green-400">
        {ipo.gmp || "--"}
      </span>
    </td>

    <td className="px-6 py-6">
      <span className="font-bold text-green-400">
        {ipo.listingGain || "--"}
      </span>
    </td>

    <td className="px-6 py-6 whitespace-nowrap font-bold">
      {ipo.priceBand}
    </td>

    <td className="px-6 py-6 whitespace-nowrap">
      {ipo.openDate}
    </td>

    <td className="px-6 py-6 whitespace-nowrap">
      {ipo.closeDate}
    </td>

    <td className="px-6 py-6 whitespace-nowrap font-bold">
      {ipo.subscription}
    </td>

    <td className="px-6 py-6">
      <span className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(ipo.status)}`}>
        {ipo.status}
      </span>
    </td>
  </tr>
                  );
                })}
</tbody>

</table>

</div>

</div>

)}

    </section>

    <HomepageFAQ />
    
    {/* FOOTER */}

    <footer className="border-t border-slate-800 bg-slate-950">

      <div className="mx-auto max-w-[1500px] px-5 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          <div>

            <h2 className="text-3xl font-black">

              <span className="text-green-400">
                IPO
              </span>
              Web.in

            </h2>

            <p className="mt-4 leading-7 text-slate-400">

              IPOWEB Market Intelligence is an independent IPO
              information platform providing IPO data,
              subscription updates, GMP tracking and
              research-based insights.

            </p>

          </div>

          <div>

            <h3 className="mb-5 text-lg font-black">
              Quick Links
            </h3>

            <div className="space-y-3 text-slate-400">

              <Link href="/">Home</Link>

              <br/>

              <Link href="/gmp">IPO GMP</Link>

              <br/>

              <Link href="/mainboard-ipo">
                Mainboard IPO
              </Link>

              <br/>

              <Link href="/sme-ipo">
                SME IPO
              </Link>

              <br/>

              <Link href="/ipo-news">
                IPO News
              </Link>

            </div>

          </div>

          <div>

  <h3 className="mb-5 text-lg font-black">
    Follow Us
  </h3>

  <p className="mb-4 text-slate-400">
    ipowebsupport@gmail.com
  </p>

  <div className="flex gap-5 text-3xl">

    {[
      {
        name: "Telegram",
        href: socialLinks.telegram,
        Icon: FaTelegramPlane,
        className: "cursor-pointer text-sky-400 transition hover:scale-110",
      },
      {
        name: "YouTube",
        href: socialLinks.youtube,
        Icon: FaYoutube,
        className: "cursor-pointer text-red-600 transition hover:scale-110",
      },
      {
        name: "WhatsApp",
        href: socialLinks.whatsapp,
        Icon: FaWhatsapp,
        className: "cursor-pointer text-green-500 transition hover:scale-110",
      },
      {
        name: "Instagram",
        href: socialLinks.instagram,
        Icon: FaInstagram,
        className: "cursor-pointer transition hover:scale-110",
      },
      {
        name: "X",
        href: socialLinks.x,
        Icon: FaXTwitter,
        className: "cursor-pointer transition hover:scale-110",
      },
    ].map(({ name, href, Icon, className }) =>
      href ? (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
        >
          <Icon className={className} />
        </a>
      ) : (
        <span key={name} aria-disabled="true" aria-label={name}>
          <Icon className={className} />
        </span>
      )
    )}

  </div>

</div>
    
      </div>
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">

          © 2026 IPOWeb.in • All Rights Reserved.

        </div>

      </div>

    </footer>

  </main>

);
}
