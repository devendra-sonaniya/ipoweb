const fundamentalFAQs = [
  {
    question: "What is P/E Ratio?",
    answer:
      "P/E (Price to Earnings) बताता है कि company की ₹1 earnings के लिए market कितनी कीमत दे रहा है. IPO में इसे peers और industry P/E के साथ compare करना useful होता है. कम या ज्यादा P/E अकेले अच्छा या खराब IPO साबित नहीं करता; growth, debt, profitability और risks भी देखें.",
  },
  {
    question: "What is RONW?",
    answer:
      "RONW (Return on Net Worth) बताता है कि company shareholders की net worth से कितना profit बना रही है. Higher RONW efficient use दिखा सकता है, लेकिन इसे peers, past years और unusual gains के साथ check करना चाहिए.",
  },
  {
    question: "What is ROE?",
    answer:
      "ROE (Return on Equity) shareholders की equity पर कमाए गए profit का percentage है. यह management efficiency समझने में मदद करता है. High ROE debt या one-time income से भी बढ़ सकता है, इसलिए peers और debt के साथ compare करें.",
  },
  {
    question: "What is ROCE?",
    answer:
      "ROCE (Return on Capital Employed) बताता है कि business अपने total long-term capital से कितना operating return बना रहा है. इसे industry peers और कई वर्षों के trend से compare करना बेहतर है; capital-heavy industries में level अलग हो सकता है.",
  },
  {
    question: "What is Debt / Equity?",
    answer:
      "Debt / Equity ratio company के debt को shareholders की equity से compare करता है. ज्यादा ratio financial risk बढ़ा सकता है, पर acceptable level industry पर depend करता है. Cash flow और debt repayment ability भी जरूरी हैं.",
  },
  {
    question: "What is Face Value?",
    answer:
      "Face Value share की nominal accounting value है, जैसे ₹10. यह IPO price या market value नहीं होती. Dividend percentage और stock split जैसे corporate actions में इसका use हो सकता है.",
  },
  {
    question: "What is Book Value?",
    answer:
      "Book Value per share broadly company की net assets value को प्रति share दिखाती है. इसे market price और peers से compare किया जा सकता है, लेकिन brands, technology और future growth जैसे factors पूरी तरह इसमें नहीं दिखते.",
  },
  {
    question: "What is EPS?",
    answer:
      "EPS (Earnings Per Share) बताता है कि company का profit हर share पर कितना है. Rising EPS positive trend दिखा सकता है, लेकिन dilution, one-time profit और earnings quality को भी देखना चाहिए.",
  },
  {
    question: "What is P/B Ratio?",
    answer:
      "P/B (Price to Book) market price को book value per share से compare करता है. Banks और asset-heavy companies में यह ज्यादा useful हो सकता है. Low या high P/B का meaning industry, ROE और asset quality के साथ समझें.",
  },
  {
    question: "What is Industry P/E?",
    answer:
      "Industry P/E उसी industry की companies का सामान्य valuation reference है. IPO का P/E इससे compare करने पर relative valuation का idea मिलता है, लेकिन growth, size, quality और business model में differences ध्यान में रखें.",
  },
  {
    question: "What is Market Cap?",
    answer:
      "Market Cap company के सभी outstanding shares की कुल market value है. IPO के बाद यह issue price के आधार पर company का size और valuation समझने में मदद करता है, लेकिन business quality की guarantee नहीं है.",
  },
  {
    question: "What is PAT Margin?",
    answer:
      "PAT Margin बताता है कि ₹100 revenue में से सभी expenses और tax के बाद कितना profit बचा. इसे peers और कई वर्षों के trend से compare करें; one-time income या expenses margin बदल सकते हैं.",
  },
  {
    question: "What is EBITDA Margin?",
    answer:
      "EBITDA Margin core operations की profitability दिखाता है, interest, tax, depreciation और amortisation से पहले. Peer comparison में useful है, लेकिन यह cash flow या final profit का substitute नहीं है.",
  },
  {
    question: "What is IPO Valuation?",
    answer:
      "IPO Valuation वह कीमत है जिस पर company public investors को shares offer करती है. इसे P/E, P/B, peers, growth, debt, profitability और business risks के साथ evaluate करना चाहिए; केवल एक ratio पर्याप्त नहीं है.",
  },
  {
    question: "What is Revenue Growth?",
    answer:
      "Revenue Growth बताता है कि company की sales समय के साथ कितनी बढ़ी या घटी. Consistent growth useful signal हो सकती है, पर profit, cash flow, industry demand और growth की sustainability भी देखें.",
  },
  {
    question: "What is PAT Growth?",
    answer:
      "PAT Growth बताता है कि tax के बाद profit समय के साथ कितना बढ़ा या घटा. Revenue growth के साथ इसे देखना useful है. One-time gains, low base या exceptional costs trend को distort कर सकते हैं.",
  },
  {
    question: "What is Fresh Issue?",
    answer:
      "Fresh Issue में company नए shares जारी करती है और जुटाया गया पैसा company को मिलता है. इसका use debt repayment, expansion या working capital में हो सकता है; नए shares से existing ownership dilute होती है.",
  },
  {
    question: "What is Offer For Sale (OFS)?",
    answer:
      "OFS में existing shareholders अपने shares बेचते हैं. इसका पैसा selling shareholders को मिलता है, company को नहीं. बड़ा OFS अपने आप negative नहीं है; seller, reason और remaining promoter holding देखें.",
  },
  {
    question: "What is Issue Size?",
    answer:
      "Issue Size IPO में offer किए जा रहे shares की कुल value है, जिसमें Fresh Issue और OFS दोनों हो सकते हैं. इसके breakup और funds के intended use को समझना जरूरी है.",
  },
  {
    question: "What is Lot Size?",
    answer:
      "Lot Size shares की minimum quantity है जिसमें IPO application दी जाती है. Application आमतौर पर एक lot या उसके multiples में होती है; allotment demand और rules पर depend करता है.",
  },
  {
    question: "What is Minimum Investment?",
    answer:
      "Minimum Investment सामान्यतः upper price band × minimum lot size होता है. Final blocked amount selected bid price पर depend कर सकता है, और application देने से allotment guaranteed नहीं होता.",
  },
  {
    question: "What is GMP?",
    answer:
      "GMP (Grey Market Premium) unofficial market में IPO share के expected premium या discount का संकेत है. यह regulated exchange price नहीं है और तेजी से बदल सकता है. High GMP listing gain या safety की guarantee नहीं देता.",
  },
  {
    question: "What is GMP History?",
    answer:
      "GMP History अलग-अलग dates पर reported GMP movement दिखाती है. इससे sentiment का trend समझ आ सकता है, लेकिन grey-market data unofficial है और actual listing price अलग हो सकती है.",
  },
  {
    question: "What is IPO Subscription?",
    answer:
      "IPO Subscription बताता है कि available shares के मुकाबले कितनी bids मिलीं. 2x का मतलब लगभग दो गुना demand है. High subscription interest दिखाता है, लेकिन valuation, bid quality और business risks भी जरूरी हैं.",
  },
  {
    question: "What is QIB Subscription?",
    answer:
      "QIB Subscription qualified institutional buyers जैसे mutual funds, insurers और eligible institutions की demand दिखाता है. Strong demand market interest बता सकती है, पर यह future returns की guarantee नहीं है.",
  },
  {
    question: "What is NII/HNI Subscription?",
    answer:
      "NII/HNI Subscription retail limit से बड़ी applications वाले non-institutional investors की demand दिखाता है. इसमें leveraged bids हो सकती हैं, इसलिए high number को अकेले investment signal न मानें.",
  },
  {
    question: "What is Retail Subscription?",
    answer:
      "Retail Subscription individual retail investors के reserved portion की demand बताता है. Oversubscription होने पर allotment कम या lottery-based हो सकता है; demand business quality या listing gain सुनिश्चित नहीं करती.",
  },
  {
    question: "What is Listing Gain?",
    answer:
      "Listing Gain issue price और exchange पर opening/listing price के बीच positive difference है. यह market sentiment से प्रभावित होता है और guaranteed नहीं है; listing loss भी हो सकता है.",
  },
  {
    question: "What is IPO Reservation?",
    answer:
      "IPO Reservation issue का वह हिस्सा है जो QIB, NII/HNI, Retail, Employee या Shareholder categories के लिए अलग रखा जाता है. हर category के rules और allotment method अलग हो सकते हैं.",
  },
  {
    question: "What is Promoter Holding?",
    answer:
      "Promoter Holding company में promoters की ownership percentage है, IPO से पहले और बाद में. बदलाव dilution या OFS दिखा सकता है. Holding को governance, pledging और business performance के साथ evaluate करें.",
  },
] as const;

export default function IPOFundamentalGuide() {
  return (
    <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-950 p-8 max-sm:rounded-2xl max-sm:p-4">
      <h2 className="text-3xl font-black text-green-400 max-sm:text-2xl">
        IPO Fundamental Guide
      </h2>
      <p className="mt-2 text-slate-400">
        Understand the important IPO and financial terms before evaluating an IPO.
      </p>

      <div className="mt-6 space-y-3">
        {fundamentalFAQs.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-2xl border border-slate-800 bg-slate-900"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none max-sm:px-4">
              <span className="flex items-center justify-between gap-4">
                {question}
                <span
                  aria-hidden="true"
                  className="text-green-400 transition-transform group-open:rotate-180"
                >
                  ▼
                </span>
              </span>
            </summary>
            <p className="border-t border-slate-800 px-5 py-4 leading-7 text-slate-300 max-sm:px-4">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
