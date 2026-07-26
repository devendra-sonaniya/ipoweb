"use client";
import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  id: number;
  emoji: string;
  title: string;
  color: string;
  bg: string;
  faqs: FAQ[];
}

const categories: Category[] = [
  {
    id: 1,
    emoji: "📘",
    title: "IPO Basics",
    color: "#2563EB",
    bg: "#EFF6FF",
    faqs: [
      { q: "What is an IPO?", a: "An IPO (Initial Public Offering) is when a private company offers its shares to the public for the first time through a stock exchange. It is the process through which a company goes public and raises capital from retail and institutional investors." },
      { q: "Why do companies launch an IPO?", a: "Companies launch IPOs to raise capital for expansion, allow early investors to exit, increase brand visibility, provide liquidity to existing shareholders, and use shares for acquisitions or employee stock plans." },
      { q: "Mainboard IPO vs SME IPO?", a: "Mainboard IPOs are for larger companies listed on NSE/BSE with paid-up capital above Rs 10 crore. SME IPOs list on NSE Emerge or BSE SME for smaller companies with higher lot sizes and higher risk." },
      { q: "Face Value vs Issue Price?", a: "Face Value is the nominal value of a share (usually Rs 1, 2, 5, or 10). Issue Price is the actual IPO price. The difference is called Premium. Example: FV = Rs 10, Issue Price = Rs 500, Premium = Rs 490." },
      { q: "What is Lot Size?", a: "Lot Size is the minimum number of shares you must apply for. SEBI ensures one Mainboard IPO lot is approximately Rs 13,000-15,000. SME IPO lots can be Rs 1-2 lakh." },
      { q: "Minimum investment in an IPO?", a: "Minimum investment in a Mainboard IPO is one lot, approximately Rs 13,000-15,000 as regulated by SEBI. For SME IPOs, minimum is typically Rs 1-2 lakh." },
      { q: "Who can apply for an IPO?", a: "Resident Indians with PAN and Demat account, HUFs, NRIs, QIBs like mutual funds and FIIs, and companies and trusts with valid KYC can all apply for IPOs in India." },
      { q: "Retail vs HNI vs QIB?", a: "Retail investors apply up to Rs 2 lakh and get 35% reservation. HNI/NII apply above Rs 2 lakh and get 15%. QIBs are mutual funds, FIIs, banks etc. and get 50% of shares." },
      { q: "What is Fresh Issue?", a: "In a Fresh Issue, the company issues new shares to the public. Money raised goes directly to the company for expansion, capex, or debt repayment. It dilutes existing shareholding." },
      { q: "What is Offer for Sale (OFS)?", a: "In OFS, existing shareholders sell their shares to the public. The company receives NO money - it goes to selling shareholders. OFS allows promoters or early investors to exit their stake." },
    ],
  },
  {
    id: 2,
    emoji: "📝",
    title: "IPO Application",
    color: "#7C3AED",
    bg: "#F5F3FF",
    faqs: [
      { q: "How to apply for an IPO?", a: "Apply through your broker app (Zerodha, Groww, Angel One), bank net banking (ASBA), or UPI-based applications. You need a valid Demat account, PAN, and linked bank account." },
      { q: "What is ASBA?", a: "ASBA (Application Supported by Blocked Amount) blocks your application money in your bank account without debiting it until allotment. It is mandatory for all IPO applications in India." },
      { q: "What is UPI Mandate?", a: "When applying via broker, a mandate request is sent to your UPI app (PhonePe, GPay, BHIM). You must approve it within the time limit or your application will be rejected. It blocks funds only." },
      { q: "What is Cut-off Price?", a: "Cut-off Price means you agree to pay whatever final price is decided within the price band. Only Retail investors can apply at cut-off. It is recommended as it increases allotment chances." },
      { q: "Can I modify my IPO application?", a: "Yes, you can modify lot quantity, bid price, or UPI ID during the subscription window before the IPO closes. You cannot change the investor category or Demat account details." },
      { q: "Can I cancel an IPO application?", a: "Yes, you can withdraw your application before the IPO closes. After closing, cancellation is not possible. The blocked amount is immediately unblocked after successful cancellation." },
      { q: "Can I apply from multiple Demat accounts?", a: "Yes, if each application uses a different PAN. Multiple applications from the same PAN, even with different Demat or bank accounts, are not allowed and will be rejected." },
      { q: "Is a Demat account mandatory?", a: "Yes, a Demat account is mandatory. IPO shares are allotted in electronic form to your Demat account. Open a free account with any SEBI-registered broker like Zerodha, Groww, or Angel One." },
      { q: "Can NRIs apply for IPOs?", a: "Yes. NRIs on repatriation basis apply through NRE account ASBA. Non-repatriation basis through NRO accounts. Some IPOs restrict NRI participation - check the DRHP. UPI is usually not available for NRIs." },
      { q: "Can I apply through my bank?", a: "Yes, most major banks like SBI, HDFC, ICICI, Axis, Kotak offer IPO applications through net banking using ASBA. Funds are blocked in your savings account until allotment." },
    ],
  },
  {
    id: 3,
    emoji: "📋",
    title: "IPO Allotment",
    color: "#059669",
    bg: "#ECFDF5",
    faqs: [
      { q: "How is IPO allotment decided?", a: "For Retail: If oversubscribed, computerized lottery gives 1 lot or nothing. If undersubscribed, all get applied lots. HNI gets proportionate allotment. QIB gets discretionary allotment." },
      { q: "When is allotment announced?", a: "Allotment is announced on T+6 (6 working days after IPO close). Day 0 IPO closes, Day 6 allotment status available online, Day 7 refunds processed, Day 8 listing on exchanges." },
      { q: "How to check IPO allotment?", a: "Check on BSE website bseindia.com, NSE website nseindia.com, Registrar website (KFin Tech, Link Intime, Bigshare), your broker app, or CDSL/NSDL portal using PAN or Application Number." },
      { q: "What if I don't get allotment?", a: "Your blocked funds are unblocked within T+2 days after allotment. For ASBA, funds return automatically. You can buy the stock from secondary market once it lists on the exchange." },
      { q: "When is refund processed?", a: "Refunds (unblocking of ASBA funds) happen on allotment date T+6. Since ASBA only blocks funds without debiting, the unblock is automatic. Funds are available within 1-2 working days." },
      { q: "When are shares credited?", a: "Shares are credited to your Demat account on T+6, same day as listing. Credit happens before market opens at 9:15 AM so you can sell on listing day itself." },
      { q: "Why is my application rejected?", a: "Common reasons: Multiple applications from same PAN, UPI mandate not approved in time, insufficient funds, name mismatch between PAN and Demat and bank, invalid PAN or Demat details, applying after IPO closes." },
      { q: "What is Basis of Allotment?", a: "Basis of Allotment (BoA) is the official document showing how shares were distributed. It shows total applications, subscription levels per category, allotment method used, and number of successful applicants." },
      { q: "Can I check allotment using PAN?", a: "Yes. Visit the Registrar website (Link Intime, KFin Tech, or Bigshare), select the IPO name, choose PAN as query type, enter your PAN, and submit to see allotment status." },
      { q: "Can I check allotment using Application Number?", a: "Yes. Visit the Registrar website, select the IPO, choose Application Number as query type, enter the number along with your PAN or date of birth to check your allotment status." },
    ],
  },
  {
    id: 4,
    emoji: "📈",
    title: "IPO Listing",
    color: "#D97706",
    bg: "#FFFBEB",
    faqs: [
      { q: "What is Listing Gain?", a: "Listing Gain is profit when IPO stock lists above issue price. Example: Issue price Rs 100, lists at Rs 140, listing gain is Rs 40 or 40%. Subject to Short-Term Capital Gains tax." },
      { q: "Why do IPOs list at premium?", a: "IPOs list at premium when company has strong fundamentals, IPO is heavily oversubscribed, sector is in favor, GMP was high, valuations are reasonable, and overall market sentiment is positive." },
      { q: "Why do IPOs list at discount?", a: "IPOs list at discount when overvalued relative to peers, weak fundamentals or high debt, negative market conditions, low subscription levels, weak GMP, poor timing, or negative news about company or sector." },
      { q: "Can listing price change before market opens?", a: "Yes. IPO stocks go through pre-open session from 9:00-9:15 AM on listing day where buyers and sellers discover equilibrium price. Final listing price is set at 9:15 AM when normal trading begins." },
      { q: "Should I sell on listing day?", a: "If you are a listing gain investor, sell if stock lists at premium to lock in profit. Long-term investors should hold if fundamentals are strong. Consider STCG tax implications if sold within 1 year." },
      { q: "What happens after listing?", a: "After listing, stock trades on exchange like any other stock. Price is determined by market forces. Lock-in periods apply for promoters and anchor investors. Company must follow SEBI disclosure requirements." },
      { q: "Can IPO shares hit Upper Circuit?", a: "Yes. On listing day, IPO shares can hit Upper Circuit if demand is extremely high. SEBI allows 5% circuit limit during pre-open. After listing, normal circuit limits of 5%, 10%, or 20% apply." },
      { q: "Can IPO shares hit Lower Circuit?", a: "Yes. IPO shares can hit Lower Circuit if selling pressure is very high after poor listing. Common with overpriced IPOs or bearish markets. When Lower Circuit hits, buyers can buy but sellers cannot exit." },
    ],
  },
  {
    id: 5,
    emoji: "💹",
    title: "IPO GMP",
    color: "#DC2626",
    bg: "#FEF2F2",
    faqs: [
      { q: "What is IPO GMP?", a: "GMP (Grey Market Premium) is the unofficial premium at which IPO shares trade before official listing. Example: Issue price Rs 100, GMP Rs 50 means shares trade at Rs 150 in grey market." },
      { q: "Is GMP reliable?", a: "GMP is an indicator but NOT a guarantee. It reflects unofficial demand and can be manipulated. More reliable when subscription is high, market is stable, and GMP has been consistent over multiple days." },
      { q: "Why does GMP change daily?", a: "GMP changes due to overall market movements, daily subscription data updates, news about company or sector, changes in investor sentiment, anchor allotment data, and QIB subscription numbers." },
      { q: "What is Kostak Rate?", a: "Kostak Rate is the price at which an IPO application (not shares) is traded in grey market. Selling at Kostak gives guaranteed profit regardless of allotment. Example: Kostak Rs 500 means you get Rs 500 whether allotted or not." },
      { q: "What is Subject to Sauda?", a: "Subject to Sauda (STS) is a conditional Kostak deal where buyer pays only if allotment happens. STS rates are higher than Kostak rates. Example: STS Rs 2000 means you get Rs 2000 only if allotted." },
      { q: "Does GMP guarantee listing gain?", a: "No. GMP does NOT guarantee listing gain. Grey market is unofficial, unregulated, and can be manipulated. Many high-GMP IPOs have listed at discounts due to market crashes or poor sentiment." },
      { q: "How is GMP calculated?", a: "GMP is not officially calculated. It is determined by demand and supply in the grey market. Expected Listing Price = Issue Price + GMP. Negative GMP indicates expected listing below issue price." },
      { q: "Why do some IPOs have Zero GMP?", a: "Zero GMP means no trading activity in grey market. Can happen due to investor uncertainty, unknown company with no valuation benchmark, poor market conditions, or company being in an unfamiliar sector." },
    ],
  },
  {
    id: 6,
    emoji: "🧠",
    title: "IPOWEB Market Intelligence",
    color: "#0891B2",
    bg: "#ECFEFF",
    faqs: [
      { q: "What is IPOWEB Market Intelligence?", a: "IPOWEB Market Intelligence is a proprietary analysis framework combining subscription data, GMP trends, market conditions, company fundamentals, and sector performance to give a holistic view of each IPO." },
      { q: "What is IPOWEB Data Signal?", a: "IPOWEB Data Signal is a composite indicator aggregating key IPO metrics into a single easy-to-understand signal based on subscription rates, GMP consistency, QIB participation, market sentiment, and valuation ratios." },
      { q: "How is Data Signal calculated?", a: "Data Signal considers QIB subscription rate, GMP trend direction and consistency, overall subscription levels across categories, price-to-earnings relative to peers, promoter holding post-IPO, and recent IPO market performance." },
      { q: "Why doesn't IPOWEB give Buy/Sell recommendations?", a: "IPOWEB is a data analytics platform, not a SEBI-registered Investment Advisor or Research Analyst. Explicit Buy/Sell recommendations require SEBI registration. IPOWEB provides data and analysis tools for informed self-decisions." },
      { q: "Why is GMP alone not enough?", a: "GMP is unregulated and can be manipulated. It does not reflect fundamentals, market conditions can change before listing, it only captures short-term sentiment, and operators can artificially inflate or deflate GMP." },
      { q: "How should investors use IPOWEB analysis?", a: "Use IPOWEB as a starting point for research, a tool to filter and shortlist IPOs, a real-time tracker for subscription and GMP trends, and a comparative tool for multiple IPOs. Always combine with personal fundamental research." },
    ],
  },
  {
    id: 7,
    emoji: "🚀",
    title: "How to Apply (Step-by-Step)",
    color: "#9333EA",
    bg: "#FDF4FF",
    faqs: [
      { q: "Zerodha", a: "1. Open Zerodha Kite app. 2. Go to IPO section. 3. Select IPO and click Apply. 4. Enter lots and select Cut-off Price. 5. Enter UPI ID. 6. Submit application. 7. Open UPI app and approve mandate. 8. Done." },
      { q: "Groww", a: "1. Open Groww app, tap IPO. 2. Select IPO and tap Apply Now. 3. Choose lots and Cut-off Price. 4. Enter UPI ID. 5. Tap Submit Application. 6. Open UPI app and approve mandate. 7. Confirmation SMS received." },
      { q: "Angel One", a: "1. Login to Angel One app. 2. Go to IPO section. 3. Select IPO and click Apply. 4. Enter lots and Cut-off Price. 5. Enter UPI ID. 6. Submit. 7. Approve mandate in UPI app. 8. Check status in My IPOs." },
      { q: "Upstox", a: "1. Open Upstox app, go to IPO tab. 2. Select IPO and click Apply Now. 3. Select lots and Cut-off Price. 4. Enter UPI ID. 5. Submit. 6. Approve mandate in UPI app within time limit. 7. Check status in Upstox IPO section." },
      { q: "ICICI Direct", a: "1. Login to icicidirect.com. 2. Go to IPO under Markets. 3. Select IPO and click Apply Now. 4. Choose ASBA - funds blocked from ICICI account. 5. Enter bid details. 6. Confirm and submit. 7. Confirmation email from ICICI Bank." },
      { q: "HDFC Sky", a: "1. Open HDFC Sky app. 2. Tap IPO from home screen. 3. Select IPO and tap Apply. 4. Enter lots and bid price. 5. Choose UPI or HDFC ASBA. 6. For ASBA funds blocked automatically. 7. For UPI approve mandate. 8. Submit." },
      { q: "SBI Securities", a: "1. Login to SBI Securities app. 2. Click IPO under Products. 3. Select IPO and click Apply. 4. Enter bid details in lots. 5. Select SBI bank account for ASBA. 6. Confirm and submit. 7. Confirmation via SMS from SBI." },
      { q: "Kotak Neo", a: "1. Login to Kotak Neo app. 2. Go to IPO section. 3. Select IPO and tap Apply Now. 4. Enter lots and Cut-off Price. 5. Choose UPI or Kotak ASBA. 6. For UPI approve mandate in UPI app. 7. Track status in My Applications." },
    ],
  },
];
interface FaqCardProps {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  color: string;
  bg: string;
  badge?: string;
}

function FaqCard({ faq, index, isOpen, onToggle, color, bg, badge }: FaqCardProps) {
  return (
    <div style={{ background: "#fff", border: isOpen ? `1.5px solid ${color}50` : "1.5px solid #E2E8F0", borderRadius: 12, marginBottom: 10, overflow: "hidden", boxShadow: isOpen ? `0 4px 20px ${color}15` : "0 1px 3px rgba(0,0,0,0.04)" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: isOpen ? color : "#F1F5F9", color: isOpen ? "#fff" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
            {index + 1}
          </span>
          <div>
            {badge && <div style={{ fontSize: 10, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{badge}</div>}
            <span style={{ fontWeight: 600, fontSize: 14, color: isOpen ? color : "#1E293B" }}>{faq.q}</span>
          </div>
        </div>
        <span style={{ fontSize: 18, color: isOpen ? color : "#CBD5E1", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▾</span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 18px 18px 54px", borderTop: `1px solid ${color}20`, background: bg + "60" }}>
          <div style={{ height: 12 }} />
          <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function IPOFAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | string | null>(null);
  const [search, setSearch] = useState("");

  const cat = categories[activeCategory];

  type SearchFAQ = FAQ & { catTitle: string; catColor: string; catBg: string };

  const filteredFaqs: SearchFAQ[] | null = search.trim()
    ? categories.flatMap((c) =>
        c.faqs
          .filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
          .map((f) => ({ ...f, catTitle: c.title, catColor: c.color, catBg: c.bg }))
      )
    : null;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#F8FAFC" }}>
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)", padding: "32px 20px 24px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>📊</span>
            <span style={{ fontSize: 22, fontWeight: 800 }}>IPOWEB</span>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>FAQ Hub</span>
          </div>
          <p style={{ margin: "0 0 20px", color: "#93C5FD", fontSize: 14 }}>Everything you need to know about IPO investing</p>
          <div style={{ position: "relative" }}>
       <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }} placeholder="Search any IPO question..." style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px 11px 38px", borderRadius: 10, border: "none", fontSize: 14, background: "rgba(255,255,255,0.12)", color: "#fff", outline: "none" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
        {search.trim() ? (
          <div style={{ marginTop: 20 }}>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 12 }}>{filteredFaqs?.length ?? 0} results for &quot;{search}&quot;</p>
            {filteredFaqs?.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔎</div>
                <div>No results found. Try different keywords.</div>
              </div>
            ) : (
              filteredFaqs?.map((f, i) => (
                <FaqCard key={i} faq={f} index={i} isOpen={openFaq === `s-${i}`} onToggle={() => setOpenFaq(openFaq === `s-${i}` ? null : `s-${i}`)} color={f.catColor} bg={f.catBg} badge={f.catTitle} />
              ))
            )}
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 0 12px", scrollbarWidth: "none" }}>
              {categories.map((c, i) => (
                <button key={c.id} onClick={() => { setActiveCategory(i); setOpenFaq(null); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, background: activeCategory === i ? c.color : "#fff", color: activeCategory === i ? "#fff" : "#475569", boxShadow: activeCategory === i ? `0 4px 12px ${c.color}40` : "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <span>{c.emoji}</span>
                  <span>{c.title}</span>
                  <span style={{ background: activeCategory === i ? "rgba(255,255,255,0.25)" : "#F1F5F9", borderRadius: 10, padding: "1px 7px", fontSize: 11, color: activeCategory === i ? "#fff" : "#94A3B8" }}>{c.faqs.length}</span>
                </button>
              ))}
            </div>
            <div style={{ background: cat.bg, border: `1px solid ${cat.color}25`, borderRadius: 12, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32 }}>{cat.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: cat.color }}>{cat.title}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{cat.faqs.length} questions in this section</div>
              </div>
            </div>
            <div>
              {cat.faqs.map((faq, i) => (
                <FaqCard key={i} faq={faq} index={i} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} color={cat.color} bg={cat.bg} />
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ borderTop: "1px solid #E2E8F0", padding: "16px 20px", textAlign: "center", color: "#94A3B8", fontSize: 12 }}>
        IPOWEB FAQ Hub • Data for educational purposes only • Not investment advice
      </div>
    </div>
  );
}