"use client";

import { FormEvent, useEffect, useState } from "react";
import { calculateIPOIntelligence } from "../ipoIntelligence";
type GMPHistoryItem = {
  date: string;
  value: string;
};


type IPOForm = {
  name: string;
  type: string;
  status: string;
  sentiment: string;
  priceBand: string;
  gmp: string;
  listingGain: string;
  subscription: string;
  qibSubscription: string;
  niiSubscription: string;
  retailSubscription: string;
  employeeSubscription: string;
  closeDate: string;
  issueSize: string;
  lotSize: string;
  minimumInvestment: string;
  openDate: string;
  allotmentDate: string;
  listingDate: string;
  exchange: string;
  registrar: string;
  financials: string;
  faceValue: string;
  drhpLink: string;
  rhpLink: string;
retailMinLot: string;
retailMinShares: string;
retailMinAmount: string;

retailMaxLot: string;
retailMaxShares: string;
retailMaxAmount: string;

sHniLot: string;
sHniShares: string;
sHniAmount: string;

bHniLot: string;
bHniShares: string;
bHniAmount: string;

qibReservation: string;
niiReservation: string;
retailReservation: string;
employeeReservation: string;
shareholderReservation: string;

prePromoterHolding: string;
postPromoterHolding: string;
anchorAllocation: string;
anchorDetails: string;

revenueFY2024: string;
revenueFY2025: string;
revenueFY2026: string;

profitFY2024: string;
profitFY2025: string;
profitFY2026: string;

marketCapPostIPO: string;
bookValue: string;
eps: string;
dilutedEPS: string;
peRatio: string;
industryPE: string;
pbRatio: string;
debtToEquity: string;
totalAssets: string;
ipoValuation: string;
  gmpTrend: string;
  strengths: string;
  risks: string;
  gmpSource: string;
subscriptionSource: string;
officialSource: string;
lastUpdated: string;
revenueGrowth: string;
patGrowth: string;
debtRisk: string;
valuation: string;
peerRevenue: string;
peerPAT: string;
peerEPS: string;
peerPE: string;
peerMarketCap: string;
peerROE: string;
peerDebtEquity: string;

peer1Name: string;
peer1Revenue: string;
peer1PAT: string;
peer1EPS: string;
peer1PE: string;
peer1MarketCap: string;
peer1ROE: string;
peer1DebtEquity: string;

peer2Name: string;
peer2Revenue: string;
peer2PAT: string;
peer2EPS: string;
peer2PE: string;
peer2MarketCap: string;
peer2ROE: string;
peer2DebtEquity: string;

peer3Name: string;
peer3Revenue: string;
peer3PAT: string;
peer3EPS: string;
peer3PE: string;
peer3MarketCap: string;
peer3ROE: string;
peer3DebtEquity: string;
companyOverview: string;
businessModel: string;
objectsOfIssue: string;
businessRisk: string;
  gmpHistory: GMPHistoryItem[];
};

const initialForm: IPOForm = {
  name: "",
  type: "MAINBOARD",
  status: "OPEN",
  sentiment: "NEUTRAL",
  priceBand: "",
  gmp: "",
  listingGain: "",
  subscription: "",
  qibSubscription: "",
  niiSubscription: "",
  retailSubscription: "",
  employeeSubscription: "",
  closeDate: "",
  issueSize: "",
  lotSize: "",
  minimumInvestment: "",
  openDate: "",
  allotmentDate: "",
  listingDate: "",
  drhpLink: "",
  rhpLink: "",
  exchange: "",
  registrar: "",
  financials: "",
  faceValue: "",

retailMinLot: "",
retailMinShares: "",
retailMinAmount: "",

retailMaxLot: "",
retailMaxShares: "",
retailMaxAmount: "",

sHniLot: "",
sHniShares: "",
sHniAmount: "",

bHniLot: "",
bHniShares: "",
bHniAmount: "",

qibReservation: "",
niiReservation: "",
retailReservation: "",
employeeReservation: "",
shareholderReservation: "",

prePromoterHolding: "",
postPromoterHolding: "",
anchorAllocation: "",
anchorDetails: "",

revenueFY2024: "",
revenueFY2025: "",
revenueFY2026: "",

profitFY2024: "",
profitFY2025: "",
profitFY2026: "",

marketCapPostIPO: "",
bookValue: "",
eps: "",
dilutedEPS: "",
peRatio: "",
industryPE: "",
pbRatio: "",
debtToEquity: "",
totalAssets: "",
ipoValuation: "",
  gmpTrend: "",
  strengths: "",
  risks: "",
  gmpSource: "",
subscriptionSource: "",
officialSource: "",
lastUpdated: "",
revenueGrowth: "",
patGrowth: "",
debtRisk: "",
valuation: "",
companyOverview: "",
businessModel: "",
objectsOfIssue: "",
businessRisk: "",
  gmpHistory: [],
};

export default function AdminPage() {
  const [form, setForm] = useState<IPOForm>(initialForm);
  const [ipos, setIpos] = useState<IPOForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingName, setEditingName] = useState<string | null>(
    null
  );

  const [gmpDate, setGmpDate] = useState("");
  const [gmpValue, setGmpValue] = useState("");

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 outline-none focus:border-green-500";

  async function loadIPOs() {
    try {
      const response = await fetch("/api/ipos", {
        cache: "no-store",
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setIpos(data);
      }
    } catch (error) {
      console.error("Unable to load IPOs:", error);
    }
  }

  useEffect(() => {
    loadIPOs();
  }, []);

  function updateField(
    field: keyof IPOForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addGMPHistory() {
    if (!gmpDate || !gmpValue) {
      setMessage("Enter GMP date and GMP value.");
      return;
    }

    setForm((current) => ({
      ...current,
      gmpHistory: [
        ...(current.gmpHistory || []),
        {
          date: gmpDate,
          value: gmpValue,
        },
      ],
    }));

    setGmpDate("");
    setGmpValue("");

    setMessage(
      "GMP history point added. Save or update IPO."
    );
  }

  function removeGMPHistory(index: number) {
    setForm((current) => ({
      ...current,
      gmpHistory: current.gmpHistory.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function editIPO(ipo: IPOForm) {
    setForm({
      ...initialForm,
      ...ipo,
      gmpHistory: Array.isArray(ipo.gmpHistory)
        ? ipo.gmpHistory
        : [],
    });

    setEditingName(ipo.name);
    setMessage(`Editing ${ipo.name}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setForm(initialForm);
    setEditingName(null);
    setGmpDate("");
    setGmpValue("");
    setMessage("Edit cancelled.");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const latestHistoryGMP =
        form.gmpHistory &&
        form.gmpHistory.length > 0
          ? form.gmpHistory[
              form.gmpHistory.length - 1
            ].value
          : form.gmp;

      const priceNumbers = form.priceBand.match(
        /\d+(?:\.\d+)?/g
      );

      const upperPrice =
        priceNumbers && priceNumbers.length > 0
          ? Number(
              priceNumbers[priceNumbers.length - 1]
            )
          : 0;

      const latestGMPNumber = Number(
        latestHistoryGMP.replace(/[^\d.-]/g, "")
      );

      const validGMPNumber = Number.isFinite(
        latestGMPNumber
      )
        ? latestGMPNumber
        : 0;

      const autoListingGain =
        upperPrice > 0
          ? `${(
              (validGMPNumber / upperPrice) *
              100
            ).toFixed(1)}%`
          : form.listingGain;


const formToSave: IPOForm = {
  ...form,
  gmp: latestHistoryGMP,
  listingGain: autoListingGain,
};

      const response = await fetch("/api/ipos", {
        method: editingName ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: editingName
          ? JSON.stringify({
              originalName: editingName,
              ipo: formToSave,
            })
          : JSON.stringify(formToSave),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (editingName
              ? "Unable to update IPO."
              : "Unable to save IPO data.")
        );
      }

      setMessage(
        editingName
          ? "IPO updated successfully! GMP and listing gain synced automatically."
          : "IPO saved successfully! GMP and listing gain calculated automatically."
      );

      setForm(initialForm);
      setEditingName(null);
      setGmpDate("");
      setGmpValue("");

      await loadIPOs();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteIPO(name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/ipos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to delete IPO."
        );
      }

      if (editingName === name) {
        setForm(initialForm);
        setEditingName(null);
      }

      setMessage(`${name} deleted successfully!`);

      await loadIPOs();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="font-bold uppercase tracking-wider text-green-400">
          IPOWEB.IN ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-black">
          IPO Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-300">
          Add, edit and manage complete IPO intelligence
          data.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-5 rounded-3xl border border-slate-700 bg-slate-900 p-6 md:grid-cols-2"
        >
          {editingName && (
            <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 font-bold text-yellow-300 md:col-span-2">
              Edit Mode: {editingName}
            </div>
          )}

          <label className="font-bold">
            IPO Name
            <input
              required
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            IPO Type
            <select
              value={form.type}
              onChange={(event) =>
                updateField("type", event.target.value)
              }
              className={inputClass}
            >
              <option value="MAINBOARD">
                MAINBOARD
              </option>
              <option value="SME">SME</option>
            </select>
          </label>

          <label className="font-bold">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value)
              }
              className={inputClass}
            >
              <option value="OPEN">OPEN</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="CLOSED">CLOSED</option>
              <option value="LISTED">LISTED</option>
            </select>
          </label>

          <label className="font-bold">
            Market Sentiment
            <select
              value={form.sentiment}
              onChange={(event) =>
                updateField("sentiment", event.target.value)
              }
              className={inputClass}
            >
              <option value="POSITIVE">POSITIVE</option>
              <option value="NEUTRAL">NEUTRAL</option>
              <option value="NEGATIVE">NEGATIVE</option>
            </select>
          </label>

          <label className="font-bold">
            Price Band
            <input
              required
              value={form.priceBand}
              onChange={(event) =>
                updateField(
                  "priceBand",
                  event.target.value
                )
              }
              placeholder="₹100 - ₹130"
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Current GMP
            <input
              value={form.gmp}
              onChange={(event) =>
                updateField("gmp", event.target.value)
              }
              placeholder="Auto synced from latest GMP history"
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Estimated Listing Gain
            <input
              value={form.listingGain}
              readOnly
              placeholder="Calculated automatically"
              className={`${inputClass} opacity-70`}
            />
          </label>

          <label className="font-bold">
            Total Subscription
            <input
              value={form.subscription}
              onChange={(event) =>
                updateField(
                  "subscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            QIB Subscription
            <input
              value={form.qibSubscription}
              onChange={(event) =>
                updateField(
                  "qibSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            NII / HNI Subscription
            <input
              value={form.niiSubscription}
              onChange={(event) =>
                updateField(
                  "niiSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Retail Subscription
            <input
              value={form.retailSubscription}
              onChange={(event) =>
                updateField(
                  "retailSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Employee Subscription
            <input
              value={form.employeeSubscription}
              onChange={(event) =>
                updateField(
                  "employeeSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Close Date
            <input
              value={form.closeDate}
              onChange={(event) =>
                updateField(
                  "closeDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          

          <label className="font-bold">
            Issue Size
            <input
              value={form.issueSize}
              onChange={(event) =>
                updateField(
                  "issueSize",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Lot Size
            <input
              value={form.lotSize}
              onChange={(event) =>
                updateField(
                  "lotSize",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Minimum Investment
            <input
              value={form.minimumInvestment}
              onChange={(event) =>
                updateField(
                  "minimumInvestment",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Open Date
            <input
              value={form.openDate}
              onChange={(event) =>
                updateField(
                  "openDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Allotment Date
            <input
              value={form.allotmentDate}
              onChange={(event) =>
                updateField(
                  "allotmentDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Listing Date
            <input
              value={form.listingDate}
              onChange={(event) =>
                updateField(
                  "listingDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Exchange
            <input
              value={form.exchange}
              onChange={(event) =>
                updateField(
                  "exchange",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Registrar
            <input
              value={form.registrar}
              onChange={(event) =>
                updateField(
                  "registrar",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
  Face Value
  <input
    value={form.faceValue}
    onChange={(event) =>
      updateField("faceValue", event.target.value)
    }
    placeholder="₹10 per share"
    className={inputClass}
  />
</label>
          <div className="mt-4 border-t border-slate-700 pt-6 md:col-span-2">
            <h2 className="text-2xl font-black text-green-400">
              GMP History Tracker
            </h2>

            <p className="mt-2 text-slate-400">
              Latest GMP history value automatically becomes
              current GMP.
            </p>
          </div>
<div className="mt-6 grid gap-4 md:grid-cols-2">
  <label className="font-bold">
    GMP Source
    <input
      value={form.gmpSource}
      onChange={(event) =>
        setForm({ ...form, gmpSource: event.target.value })
      }
      className={inputClass}
      placeholder="Example: IPO Watch"
    />
  </label>

  <label className="font-bold">
    Subscription Source
    <input
      value={form.subscriptionSource}
      onChange={(event) =>
        setForm({ ...form, subscriptionSource: event.target.value })
      }
      className={inputClass}
      placeholder="Example: NSE"
    />
  </label>

  <label className="font-bold">
    Official Source
    <input
      value={form.officialSource}
      onChange={(event) =>
        setForm({ ...form, officialSource: event.target.value })
      }
      className={inputClass}
      placeholder="Example: RHP / NSE / BSE"
    />
  </label>

  <label className="font-bold">
    Last Updated
    <input
      value={form.lastUpdated}
      onChange={(event) =>
        setForm({ ...form, lastUpdated: event.target.value })
      }
      className={inputClass}
      placeholder="Example: 15 Jul 2026, 12:30 AM"
    />
  </label>
</div>
          <label className="font-bold">
            GMP Date
            <input
              type="date"
              value={gmpDate}
              onChange={(event) =>
                setGmpDate(event.target.value)
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            GMP Value
            <input
              value={gmpValue}
              onChange={(event) =>
                setGmpValue(event.target.value)
              }
              placeholder="₹80"
              className={inputClass}
            />
          </label>

          <button
            type="button"
            onClick={addGMPHistory}
            className="rounded-xl bg-blue-500 px-6 py-3 font-black text-white md:col-span-2"
          >
            Add GMP History Point
          </button>

          {form.gmpHistory.length > 0 && (
            <div className="grid gap-3 md:col-span-2">
              {form.gmpHistory.map((item, index) => (
                <div
                  key={`${item.date}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <div>
                    <span className="font-black text-green-400">
                      {item.value}
                    </span>

                    <span className="ml-4 text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeGMPHistory(index)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="font-bold md:col-span-2">
            Financial Performance
            <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Financial Performance
  </h2>
</div>

<label className="font-bold">
  Revenue FY2024
  <input
    value={form.revenueFY2024}
    onChange={(e) => updateField("revenueFY2024", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Revenue FY2025
  <input
    value={form.revenueFY2025}
    onChange={(e) => updateField("revenueFY2025", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Revenue FY2026
  <input
    value={form.revenueFY2026}
    onChange={(e) => updateField("revenueFY2026", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  PAT FY2024
  <input
    value={form.profitFY2024}
    onChange={(e) => updateField("profitFY2024", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  PAT FY2025
  <input
    value={form.profitFY2025}
    onChange={(e) => updateField("profitFY2025", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  PAT FY2026
  <input
    value={form.profitFY2026}
    onChange={(e) => updateField("profitFY2026", e.target.value)}
    className={inputClass}
  />
</label>
       
             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Market Lot
  </h2>
</div>

<label className="font-bold">
  Retail Min Lot
  <input
    value={form.retailMinLot}
    onChange={(e) => updateField("retailMinLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Min Shares
  <input
    value={form.retailMinShares}
    onChange={(e) => updateField("retailMinShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Min Amount
  <input
    value={form.retailMinAmount}
    onChange={(e) => updateField("retailMinAmount", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Max Lot
  <input
    value={form.retailMaxLot}
    onChange={(e) => updateField("retailMaxLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Max Shares
  <input
    value={form.retailMaxShares}
    onChange={(e) => updateField("retailMaxShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Max Amount
  <input
    value={form.retailMaxAmount}
    onChange={(e) => updateField("retailMaxAmount", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  sHNI Lot
  <input
    value={form.sHniLot}
    onChange={(e) => updateField("sHniLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  sHNI Shares
  <input
    value={form.sHniShares}
    onChange={(e) => updateField("sHniShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  sHNI Amount
  <input
    value={form.sHniAmount}
    onChange={(e) => updateField("sHniAmount", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  bHNI Lot
  <input
    value={form.bHniLot}
    onChange={(e) => updateField("bHniLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  bHNI Shares
  <input
    value={form.bHniShares}
    onChange={(e) => updateField("bHniShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  bHNI Amount
  <input
    value={form.bHniAmount}
    onChange={(e) => updateField("bHniAmount", e.target.value)}
    className={inputClass}
  />
</label>

              <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Reservation
  </h2>
</div>

<label className="font-bold">
  QIB Reservation
  <input
    value={form.qibReservation}
    onChange={(e) => updateField("qibReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  NII Reservation
  <input
    value={form.niiReservation}
    onChange={(e) => updateField("niiReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Reservation
  <input
    value={form.retailReservation}
    onChange={(e) => updateField("retailReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Employee Reservation
  <input
    value={form.employeeReservation}
    onChange={(e) => updateField("employeeReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Shareholder Reservation
  <input
    value={form.shareholderReservation}
    onChange={(e) => updateField("shareholderReservation", e.target.value)}
    className={inputClass}
  />
</label>

             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Promoter Holding & Anchor Investors
  </h2>
</div>

<label className="font-bold">
  Pre IPO Promoter Holding
  <input
    value={form.prePromoterHolding}
    onChange={(e) => updateField("prePromoterHolding", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Post IPO Promoter Holding
  <input
    value={form.postPromoterHolding}
    onChange={(e) => updateField("postPromoterHolding", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Anchor Allocation
  <input
    value={form.anchorAllocation}
    onChange={(e) => updateField("anchorAllocation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold md:col-span-2">
  Anchor Details
  <textarea
    rows={4}
    value={form.anchorDetails}
    onChange={(e) => updateField("anchorDetails", e.target.value)}
    className={inputClass}
  />
</label>

             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Fundamentals
  </h2>
</div>

        <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Peer Comparison
  </h2>
</div>

<label className="font-bold">
  Market Cap (Post IPO)
  <input
    value={form.marketCapPostIPO}
    onChange={(e) => updateField("marketCapPostIPO", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Book Value
  <input
    value={form.bookValue}
    onChange={(e) => updateField("bookValue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  EPS
  <input
    value={form.eps}
    onChange={(e) => updateField("eps", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Diluted EPS
  <input
    value={form.dilutedEPS}
    onChange={(e) => updateField("dilutedEPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  P/E Ratio
  <input
    value={form.peRatio}
    onChange={(e) => updateField("peRatio", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Industry P/E
  <input
    value={form.industryPE}
    onChange={(e) => updateField("industryPE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  P/B Ratio
  <input
    value={form.pbRatio}
    onChange={(e) => updateField("pbRatio", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Debt / Equity
  <input
    value={form.debtToEquity}
    onChange={(e) => updateField("debtToEquity", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Total Assets
  <input
    value={form.totalAssets}
    onChange={(e) => updateField("totalAssets", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO Valuation
  <input
    value={form.ipoValuation}
    onChange={(e) => updateField("ipoValuation", e.target.value)}
    className={inputClass}
  />
</label>
 
             <label className="font-bold">
  IPO Revenue
  <input
    value={form.peerRevenue}
    onChange={(e) => updateField("peerRevenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO PAT
  <input
    value={form.peerPAT}
    onChange={(e) => updateField("peerPAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO EPS
  <input
    value={form.peerEPS}
    onChange={(e) => updateField("peerEPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO P/E
  <input
    value={form.peerPE}
    onChange={(e) => updateField("peerPE", e.target.value)}
    className={inputClass}
  />
</label>

             <label className="font-bold">
  Peer 1 Name
  <input
    value={form.peer1Name}
    onChange={(e) => updateField("peer1Name", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 Revenue
  <input
    value={form.peer1Revenue}
    onChange={(e) => updateField("peer1Revenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 PAT
  <input
    value={form.peer1PAT}
    onChange={(e) => updateField("peer1PAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 P/E
  <input
    value={form.peer1PE}
    onChange={(e) => updateField("peer1PE", e.target.value)}
    className={inputClass}
  />
</label>
             <label className="font-bold">
  Peer 2 Name
  <input
    value={form.peer2Name}
    onChange={(e) => updateField("peer2Name", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Revenue
  <input
    value={form.peer2Revenue}
    onChange={(e) => updateField("peer2Revenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 PAT
  <input
    value={form.peer2PAT}
    onChange={(e) => updateField("peer2PAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 EPS
  <input
    value={form.peer2EPS}
    onChange={(e) => updateField("peer2EPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 P/E
  <input
    value={form.peer2PE}
    onChange={(e) => updateField("peer2PE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Market Cap
  <input
    value={form.peer2MarketCap}
    onChange={(e) => updateField("peer2MarketCap", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 ROE
  <input
    value={form.peer2ROE}
    onChange={(e) => updateField("peer2ROE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Debt/Equity
  <input
    value={form.peer2DebtEquity}
    onChange={(e) => updateField("peer2DebtEquity", e.target.value)}
    className={inputClass}
  />
</label>
              <label className="font-bold">
  Peer 3 Name
  <input
    value={form.peer3Name}
    onChange={(e) => updateField("peer3Name", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 Revenue
  <input
    value={form.peer3Revenue}
    onChange={(e) => updateField("peer3Revenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 PAT
  <input
    value={form.peer3PAT}
    onChange={(e) => updateField("peer3PAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 EPS
  <input
    value={form.peer3EPS}
    onChange={(e) => updateField("peer3EPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 P/E
  <input
    value={form.peer3PE}
    onChange={(e) => updateField("peer3PE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 Market Cap
  <input
    value={form.peer3MarketCap}
    onChange={(e) => updateField("peer3MarketCap", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 ROE
  <input
    value={form.peer3ROE}
    onChange={(e) => updateField("peer3ROE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 Debt/Equity
  <input
    value={form.peer3DebtEquity}
    onChange={(e) => updateField("peer3DebtEquity", e.target.value)}
    className={inputClass}
  />
</label>     
              <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Company Overview
  </h2>
</div>

<label className="font-bold md:col-span-2">
  Company Overview
  <textarea
    rows={6}
    value={form.companyOverview}
    onChange={(e) => updateField("companyOverview", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold md:col-span-2">
  Business Model
  <textarea
    rows={5}
    value={form.businessModel}
    onChange={(e) => updateField("businessModel", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold md:col-span-2">
  Objects of the Issue
  <textarea
    rows={5}
    value={form.objectsOfIssue}
    onChange={(e) => updateField("objectsOfIssue", e.target.value)}
    className={inputClass}
  />
</label>

             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    DRHP & RHP Documents
  </h2>
</div>

<label className="font-bold md:col-span-2">
  DRHP Link
  <input
    type="url"
    value={form.drhpLink}
    onChange={(e) => updateField("drhpLink", e.target.value)}
    className={inputClass}
    placeholder="https://..."
  />
</label>

<label className="font-bold md:col-span-2">
  RHP Link
  <input
    type="url"
    value={form.rhpLink}
    onChange={(e) => updateField("rhpLink", e.target.value)}
    className={inputClass}
    placeholder="https://..."
  />
</label>
              rows={5}
              className={inputClass}
            /
          </label>
<label className="font-bold">
  Revenue Growth
  <input
    value={form.revenueGrowth}
    onChange={(event) =>
      updateField("revenueGrowth", event.target.value)
    }
    className={inputClass}
    placeholder="Example: 35%"
  />
</label>

<label className="font-bold">
  PAT Growth
  <input
    value={form.patGrowth}
    onChange={(event) =>
      updateField("patGrowth", event.target.value)
    }
    className={inputClass}
    placeholder="Example: 42%"
  />
</label>

<label className="font-bold">
  Debt Risk
  <select
    value={form.debtRisk}
    onChange={(event) =>
      updateField("debtRisk", event.target.value)
    }
    className={inputClass}
  >
    <option value="">SELECT DEBT RISK</option>
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>
</label>

<label className="font-bold">
  Valuation
  <select
    value={form.valuation}
    onChange={(event) =>
      updateField("valuation", event.target.value)
    }
    className={inputClass}
  >
    <option value="">SELECT VALUATION</option>
    <option value="ATTRACTIVE">ATTRACTIVE</option>
    <option value="FAIR">FAIR</option>
    <option value="EXPENSIVE">EXPENSIVE</option>
  </select>
</label>

<label className="font-bold">
  Business Risk
  <select
    value={form.businessRisk}
    onChange={(event) =>
      updateField("businessRisk", event.target.value)
    }
    className={inputClass}
  >
    <option value="">SELECT BUSINESS RISK</option>
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>
</label>
          <label className="font-bold md:col-span-2">
            GMP Trend
            <textarea
              value={form.gmpTrend}
              onChange={(event) =>
                updateField(
                  "gmpTrend",
                  event.target.value
                )
              }
              rows={4}
              className={inputClass}
            />
          </label>

          <label className="font-bold md:col-span-2">
            Strengths
            <textarea
              value={form.strengths}
              onChange={(event) =>
                updateField(
                  "strengths",
                  event.target.value
                )
              }
              rows={5}
              className={inputClass}
            />
          </label>

          

          <div className="flex items-end gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-green-500 px-6 py-3 font-black text-slate-950 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingName
                  ? "Update IPO"
                  : "Save IPO Data"}
            </button>

            {editingName && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-600 px-6 py-3 font-black"
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-green-400 md:col-span-2">
              {message}
            </div>
          )}
        </form>

        <section className="mt-10">
          <h2 className="text-3xl font-black">
            Manage IPOs
          </h2>

          <div className="mt-6 grid gap-4">
            {ipos.map((ipo, index) => (
              <div
                key={`${ipo.name}-${index}`}
                className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xl font-black">
                    {ipo.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {ipo.type} • {ipo.status} •{" "}
                    {ipo.priceBand}
                  </p>

                  <p className="mt-2 text-sm font-bold text-green-400">
                    GMP: {ipo.gmp || "Tracking"} • Est.
                    Gain:{" "}
                    {ipo.listingGain || "Tracking"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => editIPO(ipo)}
                    className="rounded-xl bg-yellow-500 px-5 py-3 font-black text-slate-950"
                  >
                    Edit IPO
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteIPO(ipo.name)
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 font-black text-white"
                  >
                    Delete IPO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}