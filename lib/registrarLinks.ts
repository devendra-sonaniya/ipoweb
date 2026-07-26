export function getRegistrarLink(registrar: string) {
  const r = registrar.toLowerCase();

  if (r.includes("kfin")) {
    return "https://ris.kfintech.com/ipostatus/";
  }

  if (r.includes("mufg") || r.includes("link")) {
    return "https://in.mpms.mufg.com/Initial_Offer/public-issues.html";
  }

  if (r.includes("bigshare")) {
    return "https://ipo.bigshareonline.com/IPO_Status.html";
  }

  if (r.includes("skyline")) {
    return "https://www.skylinerta.com/ipo_status.aspx";
  }

  if (r.includes("cameo")) {
    return "https://ipostatus.cameoindia.com/";
  }

  if (r.includes("maashitla")) {
    return "https://maashitla.com/allotment-status/";
  }

  return "#";
}