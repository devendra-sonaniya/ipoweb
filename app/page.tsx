"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaTelegramPlane,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type IPO = {
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
  listingDate: string;
};

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
  const [menuOpen,setMenuOpen]=useState(false);
  const [contactOpen,setContactOpen]=useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [search,setSearch]=useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(()=>{

    async function load(){

      try{

        const res=await fetch("/api/ipos",{
          cache:"no-store"
        });

        const data=await res.json();

        setIpos(Array.isArray(data)?data:[]);

      }catch{

        setIpos([]);

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
        className="block rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
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
        href="/how-to-apply"
        onClick={()=>setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        ❓ IPO FAQs / How to Apply
      </Link>

      <div className="mt-2 border-t border-slate-800 pt-2">
        <button
          onClick={()=>setDarkMode(!darkMode)}
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

      <Link href="/ipo-news" className="hover:text-green-400">
        IPO News
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

      <a
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        <img src="/logos/groww.png" alt="Groww" className="h-6 w-6 object-contain" />
        Groww
      </a>

      <a
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        <img src="/logos/zerodha.png" alt="Zerodha" className="h-6 w-6 object-contain" />
        Zerodha
      </a>

      <a
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        <img src="/logos/upstox.png" alt="Upstox" className="h-6 w-6 object-contain" />
        Upstox
      </a>

      <a
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        <img src="/logos/angelone.png" alt="Angel One" className="h-6 w-6 object-contain" />
        Angel One
      </a>

      <a
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        <img src="/logos/motilaloswal.png" alt="Motilal Oswal" className="h-6 w-6 object-contain" />
        Motilal Oswal
      </a>

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

        <Link href="/ipo-news" onClick={()=>setMenuOpen(false)} className="hover:text-green-400">
          IPO News
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

                {filtered.map((ipo)=>(
              <Link
                    key={ipo.name}
                    href={`/ipo/${createSlug(ipo.name)}`}
                    className="contents"
                  >
                    <tr className="cursor-pointer border-b border-slate-800 transition-all duration-200 hover:bg-slate-800/70 hover:shadow-lg">

                      <td className="px-6 py-6">

                        <div className="flex flex-col">

                          <span className="text-lg font-black text-white transition group-hover:text-green-400">
                            {ipo.name}
                          </span>

                          <span className="mt-2 text-xs font-semibold text-slate-500">
                            Click to view dashboard →
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-6">

                        <span
                          className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(
                            ipo.type
                          )}`}
                        >
                          {ipo.type}
                        </span>

                      </td>

                      <td className="px-6 py-6">

                        <span
                          className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(
                            ipo.sentiment || "Neutral"
                          )}`}
                        >
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

                        <span
                          className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(
                            ipo.status
                          )}`}
                        >
                          {ipo.status}
                        </span>

                      </td>

                    </tr>

                  </Link>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </section>
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

    <FaTelegramPlane className="cursor-pointer text-sky-400 transition hover:scale-110"/>

    <FaXTwitter className="cursor-pointer transition hover:scale-110"/>

    <FaYoutube className="cursor-pointer text-red-600 transition hover:scale-110"/>

    <FaWhatsapp className="cursor-pointer text-green-500 transition hover:scale-110"/>

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