import type { DealOffer } from './types';

/**
 * Auto-generated from Potravinka.cz API on 2026-07-09.
 * Stores: Albert, Penny, Kaufland, LIDL, Tesco
 * Key = "CATEGORY::ItemName"
 */
export const DEAL_OFFERS: Record<string, DealOffer[]> = {
  "HYGIENA::Alobal": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Fino Alobal 10 m x 28 cm", packaging: "1 ks", price: "49,90 Kč", note: "Běžná cena" },
  ],
  "HYGIENA::Jar": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Jar Prostředek na nádobí", packaging: "2x900ml", price: "119,90 Kč", note: "Platí do 12.07." },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Jar Prostředek na nádobí", packaging: "2x1.35l", price: "159,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Tablety do myčky Original Lemon Jar", packaging: "41ks", price: "179,90 Kč", note: "Platí do 14.07." },
  ],
  "HYGIENA::Odpadové sáčky": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "FINO Pytle na odpad Zeus FLEX", packaging: "8x70l/12x40l", price: "34,90 Kč", note: "Platí do 14.07." },
  ],
  "HYGIENA::Potravinová fólie": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Potravinová fólie 30 m x 29 cm", packaging: "1 ks", price: "17,90 Kč", note: "Běžná cena" },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "VIGO! Potravinová fólie perforovaná", packaging: "30m", price: "19,90 Kč", note: "Platí do 14.07." },
  ],
  "HYGIENA::Utěrky": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Univerzální utěrky z mikrovlákna 3 ks", packaging: "3 ks", price: "36,90 Kč", note: "Běžná cena" },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Kuchyňské utěrky Wippy", packaging: "57m", price: "39,90 Kč", note: "Platí do 14.07." },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Sanytol Dezinfekční čistič/utěrky", packaging: "500ml", price: "64,90 Kč", note: "Platí do 14.07." },
  ],
  "KOŘENÍ::Kmín mletý": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "J.C.Horn Kmín mletý 18g", packaging: "18g", price: "13,90 Kč", note: "Běžná cena" },
  ],
  "KOŘENÍ::Majoránka": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "J.C.Horn Majoránka 5g", packaging: "5g", price: "7,90 Kč", note: "Běžná cena" },
  ],
  "KOŘENÍ::Pepř": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Avokádo Pepř bílý mletý 18g", packaging: "18g", price: "24,90 Kč", note: "Běžná cena" },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Rybí pepřenky Gran Mare", packaging: "200/140g", price: "26,90 Kč", note: "Platí do 14.07." },
  ],
  "KOŘENÍ::Skořice": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Vitana Skořice mletá 23g", packaging: "23g", price: "18,50 Kč", note: "Běžná cena" },
  ],
  "MASO::Kuřecí prsa": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Pomalu vařená kuřecí prsa 500g", packaging: "500g", price: "114,90 Kč", note: "Běžná cena" },
  ],
  "MASO::Plec": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Vepřová plec s kůží", packaging: "1kg", price: "49,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Vepřová plec bez kosti", packaging: "1kg", price: "59,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Vepřová plec bez kosti", packaging: "1 kg", price: "148,90 Kč", note: "Běžná cena" },
  ],
  "MASO::Vepřové mleté": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Vepřové mleté maso", packaging: "1kg", price: "99,90 Kč", note: "Platí do 12.07." },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Vepřové mleté maso XXL z kýty a plece", packaging: "1kg", price: "129,90 Kč", note: "Platí do 14.07." },
  ],
  "MASO::Vysočina": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Salám Vysočina krájená Řezníkův talíř", packaging: "100g", price: "15,90 Kč", note: "Platí do 14.07." },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Krahulík Vysočina", packaging: "800g", price: "99,90 Kč", note: "Platí do 14.07." },
  ],
  "MASO::Špekáčky": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Váhala Špekáčky klasik", packaging: "100g", price: "8,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Špekáčky tradiční", packaging: "400g", price: "39,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "DZ Klatovy Kuřecí špekáčky 400g", packaging: "400g", price: "44,90 Kč", note: "Běžná cena" },
  ],
  "MASO::Šunkový salám": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Maso Příbram Šunkový salám", packaging: "100g", price: "12,60 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Šunkový salám Maso Příbram", packaging: "100g", price: "12,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Šunkový salám 100g", packaging: "100g", price: "18,90 Kč", note: "Běžná cena" },
  ],
  "MLÉČNÉ / VEJCE::Jogurty malé": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Z Valašska Jogurt bílý", packaging: "380g", price: "15,90 Kč", note: "Platí do 14.07." },
  ],
  "MLÉČNÉ / VEJCE::Majonéza": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Majonéza, tatarská omáčka Karlova koruna", packaging: "250ml", price: "19,90 Kč", note: "Platí do 14.07." },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Zárubova Tatarka/Majonéza", packaging: "500g", price: "34,90 Kč", note: "Platí do 14.07." },
  ],
  "MLÉČNÉ / VEJCE::Mléko": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Tatra/Madeta Mléko trvanlivé polotučné", packaging: "1l", price: "8,90 Kč", note: "Platí do 14.07." },
  ],
  "MLÉČNÉ / VEJCE::Pomazánkové": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Madeta Jihočeské pomazánkové", packaging: "150g", price: "22,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Madeta Jihočeské pomazánkové tradiční budapešť 150g", packaging: "150g", price: "39,90 Kč", note: "Běžná cena" },
  ],
  "MLÉČNÉ / VEJCE::Smetana 12%": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Mlékárna Kunín Zakysaná smetana 12% 190g", packaging: "190g", price: "26,90 Kč", note: "Běžná cena" },
  ],
  "MLÉČNÉ / VEJCE::Sýr Eidam": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "K-Classic Eidam 30% polotvrdý sýr plátky", packaging: "100g", price: "12,90 Kč", note: "Platí do 14.07." },
  ],
  "MLÉČNÉ / VEJCE::Tvaroh": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Tvaroh polotučný Karlova koruna", packaging: "250g", price: "12,90 Kč", note: "Platí do 14.07." },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Milko Tvaroh polotučný", packaging: "250g", price: "18,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Tvaroh polotučný 250g", packaging: "250g", price: "19,90 Kč", note: "Běžná cena" },
  ],
  "MLÉČNÉ / VEJCE::Vejce": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Čerstvá vejce M, 10 kusů, podestýlka", packaging: "10ks", price: "49,90 Kč", note: "Platí do 12.07." },
  ],
  "OBILOVINY / LUŠTĚNINY::Fazole": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "BASSTA Fazole červené/bílé", packaging: "400g", price: "14,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Fazole barevné borlotti ve vodním nálevu 400g", packaging: "400g", price: "15,90 Kč", note: "Běžná cena" },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Fazole s kukuřicí v rajčatové omáčce Gustito", packaging: "430g", price: "26,90 Kč", note: "Platí do 14.07." },
  ],
  "OBILOVINY / LUŠTĚNINY::Rýže": [
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Gustona Rýže dlouhozrnná", packaging: "400g", price: "19,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Wholegrain rýže dlouhozrnná 500g", packaging: "500g", price: "24,90 Kč", note: "Běžná cena" },
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Vitana Rýže dlouhozrnná", packaging: "5kg", price: "139,90 Kč", note: "Platí do 12.07." },
  ],
  "OBILOVINY / LUŠTĚNINY::Vločky": [
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Emma Ovesné vločky", packaging: "500g", price: "12,90 Kč", note: "Platí do 14.07." },
  ],
  "OBILOVINY / LUŠTĚNINY::Čočka": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Menu Gold Čočka 500g", packaging: "500g", price: "41,90 Kč", note: "Běžná cena" },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Salát Kuře a červená čočka", packaging: "350g", price: "99,90 Kč", note: "Platí do 14.07." },
  ],
  "OSTATNÍ::Paštika": [
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Hamé Paštika Májka", packaging: "75g", price: "14,90 Kč", note: "Platí do 14.07." },
  ],
  "OSTATNÍ::Vánočka": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Vánočka 400g", packaging: "400g", price: "44,90 Kč", note: "Běžná cena" },
  ],
  "OVOCE::Jablko": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Jablka červená", packaging: "1 kg", price: "39,90 Kč", note: "Běžná cena" },
  ],
  "PEČIVO::Chleba": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Semínkový chléb", packaging: "400g", price: "29,90 Kč", note: "Platí do 14.07." },
    { shop: "Albert", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Chléb maltézský", packaging: "400g", price: "29,90 Kč", note: "Běžná cena" },
  ],
  "PEČIVO::Rohlíky": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Rohlík císařský 85g", packaging: "85g", price: "8,90 Kč", note: "Běžná cena" },
  ],
  "POLOTOVARY::Citronka": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "The Grower's Harvest Citrónka 350ml", packaging: "350ml", price: "13,90 Kč", note: "Běžná cena" },
  ],
  "POLOTOVARY::Hořčice kremžská": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Stockwell & Co. Hořčice kremžská 400g", packaging: "400g", price: "12,90 Kč", note: "Běžná cena" },
  ],
  "POLOTOVARY::Hořčice plnotučná": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Stockwell & Co. Hořčice plnotučná 400g", packaging: "400g", price: "12,90 Kč", note: "Běžná cena" },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Hořčice plnotučná/kremžská", packaging: "340g", price: "14,90 Kč", note: "Platí do 14.07." },
  ],
  "POLOTOVARY::Kečup": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Gourmet kečup jemný Spak", packaging: "450g", price: "34,90 Kč", note: "Platí do 14.07." },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Gustona Kečup jemný", packaging: "900g", price: "35,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Kečup jemný 500g", packaging: "500g", price: "44,90 Kč", note: "Běžná cena" },
  ],
  "POLOTOVARY::Ocet": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Ocet lihový Gustito", packaging: "1l", price: "10,90 Kč", note: "Platí do 14.07." },
  ],
  "POLOTOVARY::Sojovka": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "MAGGI Sójová omáčka 190ml", packaging: "190ml", price: "49,90 Kč", note: "Běžná cena" },
  ],
  "SLADKÉ::Granko": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Granko rychle rozpustné kakao", packaging: "500g", price: "89,90 Kč", note: "Platí do 12.07." },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Granko instantní kakaový nápoj", packaging: "400g", price: "89,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Granko", packaging: "550g", price: "99,90 Kč", note: "Platí do 14.07." },
  ],
  "SLADKÉ::Marmeláda": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Gold Plus Extra džem jahodový 340g", packaging: "340g", price: "79,90 Kč", note: "Běžná cena" },
  ],
  "SLADKÉ::Nutella 600g": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Nutella", packaging: "350g", price: "79,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Nutella Pomazánka s lískovými ořechy a kakaem 1000g", packaging: "1000g", price: "269,90 Kč", note: "Běžná cena" },
  ],
  "SLADKÉ::Perník": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Plněná perníková srdce 160g", packaging: "160g", price: "35,90 Kč", note: "Běžná cena" },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Vitana Perník Tradiční", packaging: "550g", price: "39,90 Kč", note: "Platí do 14.07." },
  ],
  "STERILIZOVANÉ::Hrášek": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Mražená zelenina hrášek", packaging: "450g", price: "21,90 Kč", note: "Platí do 14.07." },
  ],
  "STERILIZOVANÉ::Kukuřice": [
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Albert Kukuřice", packaging: "350g", price: "19,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "HAMI hvězdičky kukuřice-quinoa s ananasem 20 g", packaging: "20 g", price: "27,90 Kč", note: "Běžná cena" },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Kukuřice sladká Penny", packaging: "3x150/140g", price: "39,90 Kč", note: "Platí do 14.07." },
  ],
  "STERILIZOVANÉ::Okurky": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "K-Classic Okurky ve sladkokyselém nálevu", packaging: "670g", price: "26,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Okurky Znojmia", packaging: "520/260g", price: "29,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Machland Okurky 5 - 8 cm 540g", packaging: "540g", price: "29,90 Kč", note: "Běžná cena" },
  ],
  "STERILIZOVANÉ::Protlak": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Baresa Rajčatový protlak", packaging: "140g", price: "9,90 Kč", note: "Platí do 12.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Rajčatový protlak 140g", packaging: "140g", price: "19,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Arašidy": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "KK Arašídy pražené a solené", packaging: "227g", price: "44,90 Kč", note: "Platí do 14.07." },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Ar Rashid Arašídy pražené solené", packaging: "350g", price: "59,90 Kč", note: "Platí do 14.07." },
  ],
  "SUCHÉ::Chleba": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Semínkový chléb", packaging: "400g", price: "29,90 Kč", note: "Platí do 14.07." },
    { shop: "Albert", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Chléb maltézský", packaging: "400g", price: "29,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Cukr": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Cukr krystal Karlova koruna", packaging: "1kg", price: "14,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Korunní Cukr Krystal 1000g", packaging: "1000g", price: "24,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Hladká mouka": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Mouka hladká pšeničná", packaging: "1kg", price: "9,90 Kč", note: "Platí do 14.07." },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Albert Mouka hladká", packaging: "1kg", price: "9,90 Kč", note: "Platí do 14.07." },
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Mlýn Perner Špaldová mouka hladká", packaging: "1kg", price: "26,90 Kč", note: "Platí do 14.07." },
  ],
  "SUCHÉ::Knedlík": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Poctivý knedlík houskový 500g", packaging: "500g", price: "34,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Lupinky": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Bramborové lupínky smažené s příchutí zakysané smetany a cibule 130g", packaging: "130g", price: "23,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Polohrubá mouka": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Mouka polohrubá/hrubá", packaging: "1kg", price: "8,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Mouka polohrubá pšeničná", packaging: "1kg", price: "9,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Mouka polohrubá pšeničná 1kg", packaging: "1kg", price: "9,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Strouhanka": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Penam Strouhanka", packaging: "500g", price: "21,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Druid Kukuřičná strouhanka 200g", packaging: "200g", price: "39,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Sůl": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Solné Mlýny Sůl jedlá kamenná s jodem 1kg", packaging: "1kg", price: "9,90 Kč", note: "Běžná cena" },
  ],
  "SUCHÉ::Tortilly": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Santa Maria Křupavé smažené kukuřičné tortilly 12 ks 135g", packaging: "12 ks", price: "79,90 Kč", note: "Běžná cena" },
  ],
  "TUKY::Hovězí bujón": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Knorr Bohatý bujón", packaging: "112g", price: "29,90 Kč", note: "Platí do 12.07." },
  ],
  "TUKY::Máslo": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Máslo 82% tuku 250g", packaging: "250g", price: "34,90 Kč", note: "Běžná cena" },
  ],
  "TUKY::Olej": [
    { shop: "Kaufland", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Slunečnicový olej", packaging: "1l", price: "29,90 Kč", note: "Platí do 14.07." },
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Slunečnicový olej Penny", packaging: "1l", price: "29,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Giana Slunečnicový olej 1l", packaging: "1l", price: "34,90 Kč", note: "Běžná cena" },
  ],
  "TUKY::Rama": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Rama Crema na vaření 15% 200ml", packaging: "200ml", price: "29,90 Kč", note: "Běžná cena" },
  ],
  "ZELENINA::Brambory": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Brambory rané volné", packaging: "1 kg", price: "14,90 Kč", note: "Běžná cena" },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Albert Brambory rané balené", packaging: "2kg", price: "36,90 Kč", note: "Platí do 14.07." },
  ],
  "ZELENINA::Celer": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Celer Machland", packaging: "330/180g", price: "19,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Celer", packaging: "1 kg", price: "19,90 Kč", note: "Běžná cena" },
  ],
  "ZELENINA::Cibule": [
    { shop: "Penny", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Cibule kuchyňská žlutá", packaging: "1 kg", price: "9,90 Kč", note: "Akce -50% (kupi.cz)" },
    { shop: "Kaufland", validFrom: "2026-07-08", validTo: "2026-07-14", product: "Cibule kuchyňská žlutá", packaging: "1 kg", price: "9,90 Kč", note: "Akční cena (kupi.cz)" },
  ],
  "ZELENINA::Mrkev": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Mrkev", packaging: "1kg", price: "19,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Mrkev svazek", packaging: "1 ks", price: "29,90 Kč", note: "Běžná cena" },
  ],
  "ZELENINA::Okurka": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Okurka hadovka", packaging: "1 ks", price: "24,90 Kč", note: "Běžná cena" },
  ],
  "ZELENINA::Petržel": [
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Petržel hladkolistá 100g", packaging: "100g", price: "27,90 Kč", note: "Běžná cena" },
  ],
  "ZELENINA::Česnek": [
    { shop: "Penny", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Česnek balený XXL", packaging: "500g", price: "39,90 Kč", note: "Platí do 14.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Jim Jerky Biltong sušené hovězí maso s příchutí česneku 20g", packaging: "20g", price: "79,90 Kč", note: "Běžná cena" },
    { shop: "Albert", validFrom: "2026-07-07", validTo: "2026-07-14", product: "Česnek volný", packaging: "1kg", price: "99,00 Kč", note: "Platí do 14.07." },
  ],
  "ZELENINA::Ředkvičky": [
    { shop: "LIDL", validFrom: "2026-07-05", validTo: "2026-07-12", product: "Ředkvičky", packaging: "1 svazek", price: "7,90 Kč", note: "Platí do 12.07." },
    { shop: "Tesco", validFrom: "2026-07-09", validTo: "2026-07-23", product: "Ředkvičky", packaging: "1 ks", price: "12,90 Kč", note: "Běžná cena" },
  ],
};

export const ALL_SHOPS = ["Albert","Penny","Kaufland","LIDL","Tesco"];

export const PROMO_PERIODS = [
  { label: "6.7.–12.7.", from: "2026-07-06", to: "2026-07-12" },
  { label: "13.7.–19.7.", from: "2026-07-13", to: "2026-07-19" },
];
