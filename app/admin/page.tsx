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
  score: string;
  issueSize: string;
  lotSize: string;
  minimumInvestment: string;
  openDate: string;
  allotmentDate: string;
  listingDate: string;
  exchange: string;
  registrar: string;
  recommendation: string;
  listingGainView: string;
  riskLevel: string;
  verdictReason: string;
  overview: string;
  financials: string;
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
  score: "",
  issueSize: "",
  lotSize: "",
  minimumInvestment: "",
  openDate: "",
  allotmentDate: "",
  listingDate: "",
  exchange: "",
  registrar: "",
  recommendation: "WATCH",
  listingGainView: "NEUTRAL",
  riskLevel: "MEDIUM",
  verdictReason: "",
  overview: "",
  financials: "",
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

      const intelligence = calculateIPOIntelligence({
  ...form,
  gmp: latestHistoryGMP,
});

const formToSave: IPOForm = {
  ...form,
  ...intelligence,
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
            Opportunity Score
            <input
              value={form.score}
              onChange={(event) =>
                updateField("score", event.target.value)
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

          <div className="mt-4 border-t border-slate-700 pt-6 md:col-span-2">
            <h2 className="text-2xl font-black text-green-400">
              IPO Verdict System
            </h2>
          </div>

          <label className="font-bold">
            Recommendation
            <select
              value={form.recommendation}
              onChange={(event) =>
                updateField(
                  "recommendation",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="APPLY">APPLY</option>
              <option value="WATCH">WATCH</option>
              <option value="AVOID">AVOID</option>
            </select>
          </label>

          <label className="font-bold">
            Listing Gain View
            <select
              value={form.listingGainView}
              onChange={(event) =>
                updateField(
                  "listingGainView",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="POSITIVE">POSITIVE</option>
              <option value="NEUTRAL">NEUTRAL</option>
              <option value="NEGATIVE">NEGATIVE</option>
            </select>
          </label>

          <label className="font-bold">
            Risk Level
            <select
              value={form.riskLevel}
              onChange={(event) =>
                updateField(
                  "riskLevel",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>

          <label className="font-bold md:col-span-2">
            Final Verdict Reason
            <textarea
              value={form.verdictReason}
              onChange={(event) =>
                updateField(
                  "verdictReason",
                  event.target.value
                )
              }
              rows={5}
              className={inputClass}
            />
          </label>

          <label className="font-bold md:col-span-2">
            Company Overview
            <textarea
              value={form.overview}
              onChange={(event) =>
                updateField(
                  "overview",
                  event.target.value
                )
              }
              rows={5}
              className={inputClass}
            />
          </label>

          <label className="font-bold md:col-span-2">
            Financial Performance
            <textarea
              value={form.financials}
              onChange={(event) =>
                updateField(
                  "financials",
                  event.target.value
                )
              }
              rows={5}
              className={inputClass}
            />
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

          <label className="font-bold md:col-span-2">
            Risks
            <textarea
              value={form.risks}
              onChange={(event) =>
                updateField("risks", event.target.value)
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