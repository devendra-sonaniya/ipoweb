export function getRegistrarLink(registrar: string) {
  const r = registrar.trim().toLowerCase().replace(/\s+/g, " ");

  if (r.includes("kfin")) {
    return "https://ris.kfintech.com/ipostatus/";
  }

  if (r.includes("mufg") || r.includes("link intime") || r.includes("linkintime")) {
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

  if (r.includes("purva")) {
    return "https://www.purvashare.com/investor-service/ipo-query";
  }

  if (r.includes("maashitla")) {
    return "https://maashitla.com/allotment-status/";
  }

  if (r.includes("integrated")) {
    return "https://www.integratedregistry.in/";
  }

  if (r.includes("satellite")) {
    return "https://satellitecorporate.com/";
  }

  if (r.includes("accurate")) {
    return "https://accuratesecurities.com/";
  }

  if (r.includes("beetal")) {
    return "https://www.beetalfinancial.com/";
  }

  return "#";
}
