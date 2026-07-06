import type { DealOffer } from './types';

/**
 * Promo deal offers parsed from nejlepsi_moznosti_nakup_s_datumy.xlsx.
 * Key = "CATEGORY::ItemName"
 */
export const DEAL_OFFERS: Record<string, DealOffer[]> = {
  "ZELENINA::Okurka": [
    { shop: "Albert", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Okurka salátová hadovka", packaging: "1 ks", price: "9,90 Kč", note: "Nejlepší nalezená cena za salátovou okurku." },
  ],
  "ZELENINA::Cibule": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Cibule kuchyňská žlutá volná", packaging: "1 kg", price: "14,90 Kč", note: "Nejlepší nalezená cena za kg." },
  ],
  "ZELENINA::Česnek": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Česnek balený XXL", packaging: "500 g", price: "39,90 Kč", note: "Měrně cca 79,80 Kč/kg." },
  ],
  "ZELENINA::Mrkev": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Mrkev volná", packaging: "1 kg", price: "19,90 Kč", note: "Stejná nejlepší cena ve více letácích." },
    { shop: "Tesco", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Mrkev", packaging: "1 kg", price: "19,90 Kč", note: "Stejná nejlepší cena ve více letácích." },
  ],
  "ZELENINA::Brambory": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Brambory žluté rané", packaging: "1 kg", price: "12,90 Kč", note: "Nejlepší cena za kg." },
    { shop: "Lidl", validFrom: "2026-07-09", validTo: "2026-07-12", product: "Brambory rané", packaging: "1 kg", price: "12,90 Kč", note: "Nejlepší cena za kg." },
  ],
  "OVOCE::Jablko": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Jablka červená volná", packaging: "1 kg", price: "22,90 Kč", note: "Nejlepší cena za kg." },
  ],
  "SUCHÉ::Knedlík": [
    { shop: "Tesco", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Tesco Houskový knedlík", packaging: "400 g", price: "27,90 Kč", note: "Nejlevnější nalezený knedlík." },
  ],
  "SUCHÉ::Cukr": [
    { shop: "Tesco", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Korunní cukr krystal", packaging: "1 kg", price: "9,90 Kč", note: "Nejlepší cena; další běžná akce 12,90 Kč." },
  ],
  "SUCHÉ::Sůl": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Mořská sůl San Fabio", packaging: "1 kg", price: "11,90 Kč", note: "Nejlevnější sůl v letácích." },
  ],
  "SUCHÉ::Polohrubá mouka": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Albert Mouka vybrané druhy", packaging: "1 kg", price: "9,90 Kč", note: "Albert je levnější, ale ověř typ v regálu." },
    { shop: "Lidl", validFrom: "2026-07-06", validTo: "2026-07-08", product: "Babiččina volba polohrubá", packaging: "1 kg", price: "19,90 Kč", note: "Jistá polohrubá." },
  ],
  "SUCHÉ::Lupinky": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Cereálie Cornflakes Crip Crop", packaging: "500 g", price: "29,90 Kč", note: "Nejlepší nalezené lupínky/cornflakes." },
  ],
  "SUCHÉ::Arašidy": [
    { shop: "Kaufland", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Arašídy pražené solené", packaging: "500 g", price: "39,90 Kč", note: "Cca 79,80 Kč/kg." },
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Arašídy pražené solené", packaging: "500 g", price: "39,90 Kč", note: "Cca 79,80 Kč/kg." },
  ],
  "SUCHÉ::Tortilly": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Pšeničná/celozrnná tortilla Mexilla", packaging: "6×60 g", price: "23,90 Kč", note: "Penny má jasně uvedené kusy." },
  ],
  "SUCHÉ::Chleba": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Chléb Pětistovka", packaging: "500 g", price: "21,90 Kč", note: "Nejlepší klasický chléb." },
  ],
  "SUCHÉ::Strouhanka": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Strouhanka z pečiva Karlova Koruna", packaging: "500 g", price: "19,90 Kč", note: "Cca 39,80 Kč/kg." },
  ],
  "SUCHÉ::Hladká mouka": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Albert Mouka vybrané druhy", packaging: "1 kg", price: "9,90 Kč", note: "Ověř typ v regálu." },
    { shop: "Lidl", validFrom: "2026-07-06", validTo: "2026-07-08", product: "Babiččina volba hladká", packaging: "1 kg", price: "19,90 Kč", note: "Jistá hladká." },
  ],
  "MASO::Vepřové mleté": [
    { shop: "Lidl", validFrom: "2026-07-06", validTo: "2026-07-08", product: "Vepřové mleté maso", packaging: "1 kg", price: "99,90 Kč", note: "Nejlepší nalezené mleté maso." },
  ],
  "MASO::Plec": [
    { shop: "Tesco", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Vepřová plec bez kosti", packaging: "1 kg", price: "54,90 Kč", note: "Nejlepší nalezená cena." },
  ],
  "MASO::Vysočina": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Krahulík Vysočina", packaging: "800 g", price: "99,90 Kč", note: "Cca 124,90 Kč/kg." },
  ],
  "MASO::Kuřecí prsa": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Kuřecí prsní řízky", packaging: "1 kg", price: "109,90 Kč", note: "Stejná nejlepší jistá cena." },
    { shop: "Lidl", validFrom: "2026-07-09", validTo: "2026-07-12", product: "Kuřecí prsní řízky", packaging: "1 kg", price: "109,90 Kč", note: "Stejná nejlepší jistá cena." },
  ],
  "MASO::Špekáčky": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Špekáčky tradiční", packaging: "400 g", price: "39,90 Kč", note: "Cca 99,80 Kč/kg." },
  ],
  "MASO::Šunkový salám": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Šunkový salám Řezníkův talíř", packaging: "350 g", price: "42,90 Kč", note: "Cca 122,60 Kč/kg." },
  ],
  "POLOTOVARY::Čaj Jemča Flip": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Jemča bylinné čaje", packaging: "30 g", price: "18,90 Kč", note: "Přesně Jemča Flip nenalezen; jako levnější čaj je Pigi 8,90 Kč." },
  ],
  "POLOTOVARY::Ocet": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Ocet lihový Gustito 8 %", packaging: "1 l", price: "10,90 Kč", note: "Nejlepší nalezený lihový ocet." },
  ],
  "POLOTOVARY::Hořčice plnotučná": [
    { shop: "Lidl", validFrom: "2026-07-09", validTo: "2026-07-12", product: "Fruta Bohemia plnotučná", packaging: "920 g", price: "23,90 Kč", note: "Nejlepší měrně." },
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Karlova Koruna plnotučná", packaging: "350 g", price: "14,90 Kč", note: "Menší běžné balení." },
  ],
  "POLOTOVARY::Hořčice kremžská": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Hořčice plnotučná/kremžská", packaging: "340 g", price: "14,90 Kč", note: "Nejlepší nalezená varianta." },
  ],
  "POLOTOVARY::Kečup": [
    { shop: "Kaufland", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Benita kečup jemný/ostrý", packaging: "1 kg", price: "24,90 Kč", note: "Nejlepší nalezený kečup." },
  ],
  "POLOTOVARY::Sojovka": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Omáčka Vitana sójová/worcesterová", packaging: "160 ml", price: "29,90 Kč", note: "Nejbližší shoda na sójovou omáčku." },
  ],
  "MLÉČNÉ / VEJCE::Smetana 12%": [
    { shop: "Albert", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Kunín zakysaná smetana 12 %", packaging: "190 g", price: "19,90 Kč", note: "Pozor: je to zakysaná smetana." },
  ],
  "MLÉČNÉ / VEJCE::Majonéza": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Zárubova Tatarka/Majonéza", packaging: "500 g", price: "39,90 Kč", note: "Dobrá velká varianta." },
  ],
  "MLÉČNÉ / VEJCE::Jogurty malé": [
    { shop: "Albert", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Hollandia Selský jogurt", packaging: "200 g", price: "4,95 Kč", note: "S aplikací; bez aplikace 7,90–12,90 Kč." },
  ],
  "MLÉČNÉ / VEJCE::Sýr Eidam": [
    { shop: "Tesco", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Eidam 30 %, pultový prodej", packaging: "100 g", price: "9,90 Kč", note: "Cca 99 Kč/kg." },
  ],
  "MLÉČNÉ / VEJCE::Tvaroh": [
    { shop: "Tesco", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Madeta Jihočeský tvaroh", packaging: "250 g", price: "7,90 Kč", note: "Nejlepší, platí 1.–7. 7." },
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Tvaroh polotučný KK", packaging: "250 g", price: "12,90 Kč", note: "Alternativa po 7. 7." },
  ],
  "MLÉČNÉ / VEJCE::Pomazánkové": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Madeta Jihočeské pomazánkové", packaging: "150 g", price: "22,90 Kč", note: "Nejlepší nalezené pomazánkové." },
  ],
  "MLÉČNÉ / VEJCE::Mléko": [
    { shop: "Lidl", validFrom: "2026-07-06", validTo: "2026-07-08", product: "Madeta polotučné mléko", packaging: "1 l", price: "6,90 Kč", note: "Nejlepší cena." },
    { shop: "Tesco", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Polotučné mléko", packaging: "1 l", price: "8,90 Kč", note: "Alternativa po 8. 7." },
  ],
  "MLÉČNÉ / VEJCE::Vejce": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Čerstvá vejce z podestýlky M", packaging: "10 ks", price: "29,90 Kč", note: "2,99 Kč/ks; hlídej limit na nákup." },
  ],
  "STERILIZOVANÉ::Okurky": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Okurky Karlova Koruna", packaging: "670/350 g", price: "24,90 Kč", note: "Sterilované okurky." },
  ],
  "STERILIZOVANÉ::Protlak": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Rajčatový protlak San Fabio", packaging: "500 g", price: "17,90 Kč", note: "Nejlepší velké balení, cca 35,80 Kč/kg." },
  ],
  "STERILIZOVANÉ::Kukuřice": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Kukuřice sladká Penny", packaging: "3×150/140 g", price: "39,90 Kč", note: "Pro 9 ks vychází 3 multipacky." },
  ],
  "STERILIZOVANÉ::Hrášek": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Hrášek jemný Jardinelle", packaging: "400/280 g", price: "16,90 Kč", note: "Nejlepší konzervovaný hrášek." },
  ],
  "SLADKÉ::Granko": [
    { shop: "Lidl", validFrom: "2026-07-06", validTo: "2026-07-08", product: "Granko", packaging: "500 g", price: "89,90 Kč", note: "Nejlepší měrně z nalezených variant." },
  ],
  "SLADKÉ::Nutella 600g": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Nutella", packaging: "350 g", price: "79,90 Kč", note: "Přesné 600g balení nenalezeno." },
  ],
  "SLADKÉ::Marmeláda": [
    { shop: "Lidl", validFrom: "2026-07-09", validTo: "2026-07-12", product: "Maribel ovocný džem jahoda", packaging: "450 g", price: "29,90 Kč", note: "Nejlepší džem/marmeláda měrně." },
  ],
  "KOŘENÍ::Pepř": [
    { shop: "Lidl", validFrom: "2026-07-09", validTo: "2026-07-12", product: "Kania pepř černý", packaging: "14 g", price: "5,90 Kč", note: "Nejlepší samostatný pepř." },
  ],
  "KOŘENÍ::Bazalka": [
    { shop: "Kaufland", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Byliny Bazalka (květináč)", packaging: "1 ks", price: "44,90 Kč", note: "Čerstvá bylinka; sušenou nenalezeno." },
  ],
  "KOŘENÍ::Bobkový list": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Vitana Koření Bobkový list", packaging: "3 g", price: "15,90 Kč", note: "Nejlepší nalezené." },
  ],
  "TUKY::Máslo": [
    { shop: "Albert", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Máslo 82 %", packaging: "250 g", price: "24,90 Kč", note: "Nejlepší jistá cena." },
  ],
  "TUKY::Olej": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Řepkový/slunečnicový olej", packaging: "1 l", price: "29,90 Kč", note: "Stejná nejlepší cena ve více řetězcích." },
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Řepkový/slunečnicový olej", packaging: "1 l", price: "29,90 Kč", note: "Stejná nejlepší cena ve více řetězcích." },
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Řepkový/slunečnicový olej", packaging: "1 l", price: "29,90 Kč", note: "Stejná nejlepší cena ve více řetězcích." },
    { shop: "Tesco", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Řepkový/slunečnicový olej", packaging: "1 l", price: "29,90 Kč", note: "Stejná nejlepší cena ve více řetězcích." },
  ],
  "TUKY::Hovězí bujón": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Vitana Masox bujón 10 kostek", packaging: "110 g", price: "28,90 Kč", note: "Nejbližší bujón/Masox." },
  ],
  "OSTATNÍ::Paštika": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Hamé Svačinka/Májka/Matěj paštika", packaging: "105 g", price: "14,90 Kč", note: "Dobrá velikost i cena." },
  ],
  "OBILOVINY / LUŠTĚNINY::Fazole": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Fazole různé druhy", packaging: "500 g", price: "34,90 Kč", note: "Suché fazole." },
  ],
  "OBILOVINY / LUŠTĚNINY::Čočka": [
    { shop: "Albert", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Čočka červená", packaging: "500 g", price: "24,90 Kč", note: "Cca 49,80 Kč/kg." },
    { shop: "Kaufland", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Lagris čočka červená půlená", packaging: "500 g", price: "24,90 Kč", note: "Cca 49,80 Kč/kg." },
  ],
  "OBILOVINY / LUŠTĚNINY::Vločky": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Emma ovesné vločky", packaging: "500 g", price: "12,90 Kč", note: "Cca 25,80 Kč/kg." },
  ],
  "OBILOVINY / LUŠTĚNINY::Rýže": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Lagris rýže loupaná 1 kg + 20 %", packaging: "1,2 kg", price: "34,90 Kč", note: "Cca 24,92 Kč/kg; nejlepší nalezená rýže." },
  ],
  "PEČIVO::Chleba": [
    { shop: "Albert", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Chléb Pětistovka", packaging: "500 g", price: "21,90 Kč", note: "Nejlepší klasický chléb." },
  ],
  "PEČIVO::Rohlíky": [
    { shop: "Kaufland", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Rohlík císařský", packaging: "85 g", price: "5,90 Kč", note: "Obyčejný rohlík za 3 Kč v letácích nenalezen." },
  ],
  "HYGIENA::Odpadové sáčky": [
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Fino pytle na odpad Zeus FLEX", packaging: "8×70 l / 12×40 l", price: "19,90 Kč", note: "Nejbližší k 60l pytlům." },
  ],
  "HYGIENA::Jar": [
    { shop: "Lidl", validFrom: "2026-07-06", validTo: "2026-07-08", product: "Jar prostředek na nádobí", packaging: "2×900 ml", price: "119,90 Kč", note: "Spolehlivější varianta." },
  ],
  "HYGIENA::Utěrky": [
    { shop: "Penny", validFrom: "2026-07-01", validTo: "2026-07-07", product: "Víceúčelové utěrky Penny", packaging: "6 ks", price: "19,90 Kč", note: "Kuchyňské utěrky." },
  ],
};

export const ALL_SHOPS = ["Albert", "Kaufland", "Lidl", "Penny", "Tesco"];

export const PROMO_PERIODS = [
  { label: "1.–7. 7.", from: "2026-07-01", to: "2026-07-07" },
  { label: "6.–8. 7.", from: "2026-07-06", to: "2026-07-08" },
  { label: "8.–14. 7.", from: "2026-07-08", to: "2026-07-14" },
  { label: "9.–12. 7.", from: "2026-07-09", to: "2026-07-12" },
];
