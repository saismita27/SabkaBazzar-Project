import { Product } from '../../types';

export const ELECTRONICS_PRODUCTS: Product[] = [
  // 1. LAPTOPS
  {
    id: 'prod-lenovo-ideapad-slim5',
    categoryId: 'cat-electronics',
    subCategory: 'Laptops',
    name: {
      en: 'Lenovo IdeaPad Slim 5 — i5-13420H, 16GB/512GB, Cloud Grey',
      hi: 'लेनोवो आइडियापैड स्लिम 5 लैपटॉप (16GB RAM / 512GB SSD)',
      or: 'ଲେନୋଭୋ ଆଇଡିଆପ୍ୟାଡ୍ ସ୍ଲିମ୍ ୫ ଲାପଟପ୍ (୧୬ଜିବି ରାମ୍)',
      mr: 'लेनोवो लॅपटॉप 16GB रॅम',
      bn: 'লেনোভো ল্যাপটপ আই৫',
      ta: 'லெனோவா லேப்டாப்',
      te: 'లెనోవా ల్యాప్‌టాప్',
      gu: 'લેનોવો લેપટોપ'
    },
    description: {
      en: 'Intel Core i5-13420H, 16GB memory and 512GB SSD. WUXGA IPS display; model 82XD003MIN.',
      hi: 'छात्रों और पेशेवरों के लिए हल्का और तेज़ लैपटॉप। 16GB रैम और विंडोज़ 11 के साथ।',
      or: 'କଲେଜ ଛାତ୍ର ଓ ଅଫିସ କାର୍ଯ୍ୟ ପାଇଁ ସୁବିଧାଜନକ ଏବଂ ଦ୍ରୁତ ଲାପଟପ୍।',
      mr: 'अभ्यास आणि कामासाठी हलका लॅपटॉप.',
      bn: 'স্লিম ও শক্তিশালী ল্যাপটপ।',
      ta: 'சிறந்த மடிக்கணினி.',
      te: 'ఉత్తమ ల్యాప్‌టాప్.',
      gu: 'ઝડપી લેપટોપ.'
    },
    price: 58990,
    mrp: 72990,
    stock: 18,
    rating: 4.7,
    reviewCount: 380,
    imageUrl: '/images/technology-brands/prod-lenovo-ideapad-slim5.jpg',
    sourceUrl: 'https://www.flipkart.com/lenovo-intel-core-i5-13th-gen-16-gb-ssd-512-gb-ssd-windows-11-home-82xd003min-thin-light-laptop/p/itmdee369858debc',
    brand: 'Lenovo',
    unit: '1 Unit',
    variants: ['Lenovo IdeaPad Slim 5 — i5-13420H, 16GB/512GB, Cloud Grey'],
    aliases: [
      { term: 'laptop', language: 'en', script: 'latin' },
      { term: 'लैपटॉप', language: 'hi', script: 'devanagari' },
      { term: 'computer', language: 'en', script: 'latin' },
      { term: 'ଲାପଟପ୍', language: 'or', script: 'odia' }
    ]
  },
  {
    id: 'prod-macbook-air-m3',
    categoryId: 'cat-electronics',
    subCategory: 'Laptops',
    name: {
      en: 'Apple MacBook Air M3 — 13.6-inch, 8GB/256GB, Midnight',
      hi: 'एप्पल मैकबुक एयर M3 (13.6 इंच डिस्प्ले, 256GB SSD)',
      or: 'ଆପଲ୍ ମ୍ୟାକବୁକ୍ ଏୟାର୍ M3 (୧୩.୬ ଇଞ୍ଚ)',
      mr: 'अॅपल मॅकबुक एअर M3',
      bn: 'অ্যাপল ম্যাকবুক এয়ার এম৩',
      ta: 'ஆப்பிள் மேக்புக் ஏர்',
      te: 'ఆపిల్ మ్యాక్‌బుక్ ఎయిర్',
      gu: 'એપલ મેકબુક એર'
    },
    description: {
      en: 'Blazing fast Apple M3 chip, up to 18 hours battery life, 1080p FaceTime HD camera, silent fanless aluminum design.',
      hi: 'अत्यंत तेज़ M3 चिप, 18 घंटे की बैटरी लाइफ और हल्का प्रीमियम डिज़ाइन।',
      or: 'ଦୀର୍ଘ ବ୍ୟାଟେରୀ ଏବଂ ଶକ୍ତିଶାଳୀ M3 ଚିପ୍ ସହ ପ୍ରିମିୟମ୍ ଲାପଟପ୍।',
      mr: 'उत्कृष्ट बॅटरी आणि हलके डिझाइन.',
      bn: 'শক্তিশালী এম৩ চিপ সম্বলিত ম্যাকবুক।',
      ta: 'வேகமான எம்3 பிராசஸர்.',
      te: 'అద్భుతమైన బ్యాటరీ లైఫ్ ల్యాప్‌టాప్.',
      gu: 'પ્રીમિયમ અને હળવો લેપટોપ.'
    },
    price: 104900,
    mrp: 114900,
    stock: 12,
    rating: 4.9,
    reviewCount: 650,
    imageUrl: '/images/technology-brands/prod-macbook-air-m3.jpg',
    sourceUrl: 'https://www.imagineonline.store/products/13-inch-macbook-air-mrxv3hn-a',
    brand: 'Apple',
    unit: '1 Unit',
    variants: ['Apple MacBook Air M3 — 13.6-inch, 8GB/256GB, Midnight'],
    aliases: [
      { term: 'macbook', language: 'en', script: 'latin' },
      { term: 'apple laptop', language: 'en', script: 'latin' },
      { term: 'मैकबुक', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-asus-vivobook-budget',
    categoryId: 'cat-electronics',
    subCategory: 'Laptops',
    name: {
      en: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      hi: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      or: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      mr: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      bn: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      ta: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      te: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver',
      gu: 'ASUS Vivobook Go 15 — Core i3-N305, 8GB/512GB, Cool Silver'
    },
    description: {
      en: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      hi: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      or: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      mr: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      bn: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      ta: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      te: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.',
      gu: 'Intel Core i3-N305, 8GB memory, 512GB SSD and 15.6-inch Full HD display.'
    },
    price: 33990,
    mrp: 44990,
    stock: 25,
    rating: 4.6,
    reviewCount: 420,
    imageUrl: '/images/technology-brands/prod-asus-vivobook-budget.jpg',
    sourceUrl: 'https://www.flipkart.com/asus-vivobook-go-15-2023-intel-8-cores-8-threads-core-i3-n305-8-gb-ssd-512-gb-ssd-windows-11-home-e1504ga-nj321ws-thin-light-laptop/p/itm283c8ed983ac3',
    brand: 'ASUS',
    unit: '1 Unit',
    aliases: [
      { term: 'budget laptop', language: 'en', script: 'latin' },
      { term: 'asus', language: 'en', script: 'latin' },
      { term: 'कम्प्यूटर', language: 'hi', script: 'devanagari' }
    ]
  },

  // 2. DESKTOP & CPU
  {
    id: 'prod-intel-core-i7-cpu',
    categoryId: 'cat-electronics',
    subCategory: 'Desktop & CPU',
    name: {
      en: 'Intel Core i7-14700K — 20-core Desktop Processor',
      hi: 'इंटेल कोर i7-14700K डेस्कटॉप सीपीयू प्रोसेसर',
      or: 'ଇଣ୍ଟେଲ୍ କୋର୍ i7 ପ୍ରୋସେସର୍ ସିପିୟୁ',
      mr: 'इंटेल कोर i7 प्रोसेसर',
      bn: 'ইন্টেল কোর আই৭ প্রসেসর',
      ta: 'இன்டெல் பிராசஸர்',
      te: 'ఇంటెల్ కోర్ i7 ప్రాసెసర్',
      gu: 'ઇન્ટેલ કોર i7 પ્રોસેસર'
    },
    description: {
      en: '20 cores (8 P-cores + 12 E-cores) and 28 threads. Integrated Intel UHD 770 Graphics. Optimized for heavy video editing, coding, and 4K gaming.',
      hi: 'गेमिंग, प्रोग्रामिंग और वीडियो एडिटिंग के लिए शक्तिशाली 20-कोर वाला आधुनिक कंप्यूटर प्रोसेसर।',
      or: 'କୋଡିଂ ଏବଂ ହାଇ-ଏଣ୍ଡ୍ ଗେମିଂ ପାଇଁ ଅତ୍ୟନ୍ତ ଦ୍ରୁତ କମ୍ପ୍ୟୁଟର ପ୍ରୋସେସର୍।',
      mr: 'गेमिंग आणि कोडिंगसाठी वेगवान प्रोसेसर.',
      bn: 'গেমিং ও কোডিংয়ের জন্য শক্তিশালী সিপিইউ প্রসেসর।',
      ta: 'அதிவேக பிராசஸர் சிப்.',
      te: 'హై స్పీడ్ డెస్క్‌టాప్ ప్రాసెసర్.',
      gu: 'હાઈ સ્પીડ ડેસ્કટોપ પ્રોસેસર.'
    },
    price: 38990,
    mrp: 46500,
    stock: 14,
    rating: 4.9,
    reviewCount: 290,
    imageUrl: '/images/technology-brands/prod-intel-core-i7-cpu.jpg',
    sourceUrl: 'https://www.vedantcomputers.com/intel-core-i7-processor-14700k-bx8071514700k',
    brand: 'Intel',
    unit: '1 Unit',
    aliases: [
      { term: 'cpu', language: 'en', script: 'latin' },
      { term: 'processor', language: 'en', script: 'latin' },
      { term: 'intel', language: 'en', script: 'latin' },
      { term: 'सीपीयू', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-amd-ryzen-cpu',
    categoryId: 'cat-electronics',
    subCategory: 'Desktop & CPU',
    name: {
      en: 'AMD Ryzen 5 7600X — 6-core AM5 Desktop Processor',
      hi: 'एएमडी राइजेन 5 7600X डेस्कटॉप सीपीयू प्रोसेसर',
      or: 'ଏଏମଡି ରାଇଜେନ୍ ୫ ପ୍ରୋସେସର୍',
      mr: 'एएमडी रायझेन 5 प्रोसेसर',
      bn: 'এএমডি রাইজেন ৫ প্রসেসর',
      ta: 'ஏஎம்டி பிராசஸர்',
      te: 'ఎఎమ్‌డి రైజెన్ 5 ప్రాసెసర్',
      gu: 'એએમડી રાયઝન 5 પ્રોસેસર'
    },
    description: {
      en: 'Zen 4 architecture built on 5nm process. PCIe 5.0 support, DDR5 memory speed, incredible power efficiency for creative workstations.',
      hi: 'आधुनिक DDR5 मेमोरी को सपोर्ट करने वाला बजट-फ्रेंडली हाई-परफॉर्मेंस प्रोसेसर।',
      or: 'କମ୍ପ୍ୟୁଟର ପାଇଁ ଶକ୍ତିଶାଳୀ ରାଇଜେନ୍ ପ୍ରୋସେସର୍।',
      mr: 'वर्कस्टेशनसाठी योग्य असा प्रोसेसर.',
      bn: 'উচ্চ ক্ষমতার সাশ্রয়ী রাইজেন প্রসেসর।',
      ta: 'சிறந்த கேமிங் பிராசஸர்.',
      te: 'బడ్జెట్ గేమింగ్ ప్రాసెసర్.',
      gu: 'ઝડપી વર્કસ્ટેશન પ્રોસેસર.'
    },
    price: 19490,
    mrp: 26000,
    stock: 20,
    rating: 4.8,
    reviewCount: 310,
    imageUrl: '/images/technology-brands/prod-amd-ryzen-cpu.jpg',
    sourceUrl: 'https://www.primeabgb.com/online-price-reviews-india/amd-ryzen-5-7600x-desktop-processor-100-100000593wof/',
    brand: 'AMD',
    unit: '1 Unit',
    aliases: [
      { term: 'ryzen', language: 'en', script: 'latin' },
      { term: 'amd', language: 'en', script: 'latin' },
      { term: 'cpu', language: 'en', script: 'latin' }
    ]
  },
  {
    id: 'prod-gaming-tower-pc',
    categoryId: 'cat-electronics',
    subCategory: 'Desktop & CPU',
    name: {
      en: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      hi: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      or: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      mr: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      bn: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      ta: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      te: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB',
      gu: 'Smartech SMT Phantom Lite — i5-12400F, RTX 3060, 16GB/512GB'
    },
    description: {
      en: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      hi: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      or: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      mr: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      bn: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      ta: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      te: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.',
      gu: 'Assembled desktop with Intel Core i5-12400F, 16GB RAM, 512GB SSD and GeForce RTX 3060 12GB. Tower only; monitor and peripherals are not included.'
    },
    price: 64990,
    mrp: 79990,
    stock: 9,
    rating: 4.8,
    reviewCount: 180,
    imageUrl: '/images/technology-brands/prod-gaming-tower-pc.jpg',
    sourceUrl: 'https://www.smartechcomputers.in/products/smt-phantom-cpu-only',
    brand: 'Smartech',
    unit: '1 Tower Unit',
    aliases: [
      { term: 'desktop', language: 'en', script: 'latin' },
      { term: 'gaming pc', language: 'en', script: 'latin' },
      { term: 'tower pc', language: 'en', script: 'latin' },
      { term: 'कम्प्यूटर', language: 'hi', script: 'devanagari' }
    ]
  },

  // 3. AIO & TOWER PC
  {
    id: 'prod-hp-pavilion-aio',
    categoryId: 'cat-electronics',
    subCategory: 'AIO & Tower PC',
    name: {
      en: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      hi: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      or: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      mr: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      bn: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      ta: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      te: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB',
      gu: 'HP 27-cr0451in All-in-One — Core i7, 16GB/1TB'
    },
    description: {
      en: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      hi: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      or: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      mr: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      bn: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      ta: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      te: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.',
      gu: 'HP 27-inch All-in-One desktop, model 27-cr0451in. Intel Core i7-1355U, 16GB memory and 1TB SSD.'
    },
    price: 89990,
    mrp: 105000,
    stock: 8,
    rating: 4.6,
    reviewCount: 140,
    imageUrl: '/images/technology-brands/prod-hp-pavilion-aio.jpg',
    sourceUrl: 'https://www.hp.com/in-en/shop/products/desktops/hp-27-inch-all-in-one-27-cr0451in-pc-d0be9pa-acj',
    brand: 'HP',
    unit: '1 Set',
    aliases: [
      { term: 'aio', language: 'en', script: 'latin' },
      { term: 'desktop', language: 'en', script: 'latin' },
      { term: 'computer', language: 'en', script: 'latin' }
    ]
  },
  {
    id: 'prod-lenovo-ideacentre-aio',
    categoryId: 'cat-electronics',
    subCategory: 'AIO & Tower PC',
    name: {
      en: 'Lenovo IdeaCentre AIO 3 — Ryzen 5, 8GB/512GB, Black',
      hi: 'लेनोवो आइडियासेंटर ऑल-इन-वन कंप्यूटर (23.8 इंच स्क्रीन)',
      or: 'ଲେନୋଭୋ ଅଲ୍-ଇନ୍-ୱାନ୍ କମ୍ପ୍ୟୁଟର (୨୩.୮ ଇଞ୍ଚ)',
      mr: 'लेनोवो ऑल-इन-वन संगणक',
      bn: 'লেনোভো অল-ইন-ওয়ান পিসি',
      ta: 'லெனோவா டெஸ்க்டாப்',
      te: 'లెనోవా ఆల్ ఇన్ వన్ కంప్యూటర్',
      gu: 'લેનોવો ઓલ-ઇન-વન ડેસ્કટોપ'
    },
    description: {
      en: 'Space-saving slim desktop with integrated stereo speakers, cable management clip, wireless keyboard and optical mouse.',
      hi: 'कम जगह घेरने वाला और बच्चों की पढ़ाई व ऑफिस वर्क के लिए उपयुक्त ऑल-इन-वन कंप्यूटर।',
      or: 'ପାଠପଢ଼ା ଓ ଅଫିସ୍ ପାଇଁ ସୁବିଧାଜନକ ସ୍ଲିମ୍ ଡେସ୍କଟପ୍।',
      mr: 'जागा वाचवणारा आकर्षक डेस्कटॉप संगणक.',
      bn: 'কম জায়গা নেওয়া ঘরোয়া ব্যবহারের জন্য অল-ইন-ওয়ান কম্পিউটার।',
      ta: 'குறைந்த இடம் பிடிக்கும் டெஸ்க்டாப்.',
      te: 'చిన్న స్థలంలో సరిపోయే డెస్క్‌టాప్.',
      gu: 'ઓછી જગ્યા રોકતો સુંદર કમ્પ્યુટર.'
    },
    price: 43990,
    mrp: 56990,
    stock: 15,
    rating: 4.7,
    reviewCount: 220,
    imageUrl: '/images/technology-brands/prod-lenovo-ideacentre-aio.jpg',
    sourceUrl: 'https://www.flipkart.com/lenovo-ideacentre-aio-3-24alc6-ryzen-5-8-gb-ddr4-512-ssd-windows-11-home-23-8-inch-screen-f0g100h4in/p/itmcad7e8ea91c9e',
    brand: 'Lenovo',
    unit: '1 Set',
    aliases: [
      { term: 'all in one', language: 'en', script: 'latin' },
      { term: 'lenovo desktop', language: 'en', script: 'latin' },
      { term: 'कंप्यूटर', language: 'hi', script: 'devanagari' }
    ]
  },

  // 4. TABLETS
  {
    id: 'prod-apple-ipad-10th-gen',
    categoryId: 'cat-electronics',
    subCategory: 'Tablets',
    name: {
      en: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      hi: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      or: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      mr: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      bn: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      ta: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      te: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue',
      gu: 'Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue'
    },
    description: {
      en: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      hi: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      or: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      mr: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      bn: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      ta: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      te: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.',
      gu: '10.9-inch Liquid Retina display, A14 Bionic chip and USB-C. The pictured configuration has 256GB storage with Wi-Fi and cellular connectivity.'
    },
    price: 33900,
    mrp: 39900,
    stock: 22,
    rating: 4.9,
    reviewCount: 890,
    imageUrl: '/images/technology-brands/prod-apple-ipad-10th-gen.jpg',
    sourceUrl: 'https://www.flipkart.com/apple-ipad-10th-gen-64-gb-rom-10-9-inch-wi-fi-only-blue/p/itm5d7707aeb1a78',
    brand: 'Apple',
    unit: '1 Tablet',
    variants: ['Apple iPad 10th Gen — 10.9-inch, 256GB, Wi-Fi + 5G, Blue'],
    aliases: [
      { term: 'ipad', language: 'en', script: 'latin' },
      { term: 'tablet', language: 'en', script: 'latin' },
      { term: 'आईपैड', language: 'hi', script: 'devanagari' },
      { term: 'टैबलेट', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-samsung-galaxy-tab-a9',
    categoryId: 'cat-electronics',
    subCategory: 'Tablets',
    name: {
      en: 'Samsung Galaxy Tab A9+ — 8GB/128GB, Wi-Fi + 5G, Navy',
      hi: 'सैमसंग गैलेक्सी टैब A9+ (11 इंच 90Hz, 8GB/128GB 5G कॉलिंग)',
      or: 'ସାମସଙ୍ଗ ଗାଲାକ୍ସି ଟ୍ୟାବ୍ A9+ (୫ଜି କଲିଂ)',
      mr: 'सॅमसंग गॅलॅक्सी टॅब A9+',
      bn: 'স্যামসাং গ্যালাক্সি ট্যাব এ৯+',
      ta: 'சாம்சங் கேலக்ஸி டேப்',
      te: 'శాంసంగ్ గెలాక్సీ ట్యాబ్ A9+',
      gu: 'સેમસંગ ગેલેક્સી ટેબ A9+'
    },
    description: {
      en: 'Quad speakers powered by Dolby Atmos, smooth 90Hz refresh rate, multi-active window for 3 apps simultaneously, 5G SIM calling support.',
      hi: 'सिम कार्ड से कॉलिंग और 4 डॉल्बी एटमॉस स्पीकर वाला 11 इंच का बड़ा सैमसंग टैबलेट।',
      or: '୫ଜି ସିମ୍ କଲିଂ ଏବଂ ଉତ୍ତମ ସାଉଣ୍ଡ ସହ ୧୧ ଇଞ୍ଚ ସାମସଙ୍ଗ ଟ୍ୟାବ୍।',
      mr: 'कॉलिंग सुविधा असणारा सॅमसंग टॅब.',
      bn: 'সিম কলিং ও মাল্টিটাস্কিংয়ের জন্য বড় স্ক্রিন ট্যাব।',
      ta: 'காலிங் வசதி கொண்ட டேப்லெட்.',
      te: 'కాలింగ్ ఫీచర్ గల శాంసంగ్ ట్యాబ్.',
      gu: 'કોલિંગ સુવિધા વાળો સેમસંગ ટેબ.'
    },
    price: 20999,
    mrp: 27999,
    stock: 30,
    rating: 4.7,
    reviewCount: 560,
    imageUrl: '/images/technology-brands/prod-samsung-galaxy-tab-a9.jpg',
    sourceUrl: 'https://www.flipkart.com/samsung-galaxy-tab-a9-8-gb-ram-128-rom-11-0-inch-wi-fi-5g-tablet-dark-blue/p/itm8187845046c27',
    brand: 'Samsung',
    unit: '1 Tablet',
    variants: ['Samsung Galaxy Tab A9+ — 8GB/128GB, Wi-Fi + 5G, Navy'],
    aliases: [
      { term: 'samsung tablet', language: 'en', script: 'latin' },
      { term: 'tab', language: 'en', script: 'latin' },
      { term: 'टैब', language: 'hi', script: 'devanagari' }
    ]
  },

  // 5. MOBILE COVERS
  {
    id: 'prod-spigen-rugged-cover',
    categoryId: 'cat-electronics',
    subCategory: 'Mobile Covers',
    name: {
      en: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      hi: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      or: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      mr: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      bn: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      ta: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      te: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black',
      gu: 'Spigen Rugged Armor MagFit — iPhone 15 Pro Max, Matte Black'
    },
    description: {
      en: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      hi: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      or: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      mr: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      bn: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      ta: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      te: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.',
      gu: 'Rugged Armor MagFit case for iPhone 15 Pro Max. Matte Black finish with raised edges and Air Cushion design. Phone is not included.'
    },
    price: 1199,
    mrp: 1899,
    stock: 85,
    rating: 4.8,
    reviewCount: 950,
    imageUrl: '/images/technology-brands/prod-spigen-rugged-cover.jpg',
    sourceUrl: 'https://spigen.in/products/iphone-15-series-case-rugged-armor-magfit',
    brand: 'Spigen',
    unit: '1 Piece',
    aliases: [
      { term: 'mobile cover', language: 'en', script: 'latin' },
      { term: 'phone case', language: 'en', script: 'latin' },
      { term: 'back cover', language: 'en', script: 'latin' },
      { term: 'मोबाइल कवर', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-clear-silicon-case',
    categoryId: 'cat-electronics',
    subCategory: 'Mobile Covers',
    name: {
      en: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      hi: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      or: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      mr: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      bn: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      ta: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      te: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear',
      gu: 'Spigen Liquid Crystal — iPhone 15 Plus, Crystal Clear'
    },
    description: {
      en: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      hi: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      or: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      mr: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      bn: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      ta: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      te: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.',
      gu: 'Flexible clear case specifically for iPhone 15 Plus. The phone shown inside the case is not included.'
    },
    price: 199,
    mrp: 499,
    stock: 140,
    rating: 4.5,
    reviewCount: 1420,
    imageUrl: '/images/technology-brands/prod-clear-silicon-case.jpg',
    sourceUrl: 'https://spigen.in/products/iphone-15-series-case-liquid-crystal',
    brand: 'Spigen',
    unit: '1 Piece',
    aliases: [
      { term: 'cover', language: 'en', script: 'latin' },
      { term: 'case', language: 'en', script: 'latin' },
      { term: 'कवर', language: 'hi', script: 'devanagari' }
    ]
  },

  // 6. DESKTOP ACCESSORIES
  {
    id: 'prod-logitech-keyboard-mouse',
    categoryId: 'cat-electronics',
    subCategory: 'Desktop Accessories',
    name: {
      en: 'Logitech MK295 Silent Wireless Keyboard & Mouse — Graphite',
      hi: 'लॉजिटेक साइलेंट वायरलेस कीबोर्ड और माउस सेट',
      or: 'ଲଜିଟେକ୍ ସାଇଲେଣ୍ଟ କିବୋର୍ଡ ଓ ମାଉସ୍ କମ୍ବୋ',
      mr: 'लॉजिटेक वायरलेस कीबोर्ड आणि माउस',
      bn: 'লজিটেক সাইলেন্ট ওয়্যারলেস কিবোর্ড মাউস',
      ta: 'லாஜிடெக் கீபோர்டு மவுஸ்',
      te: 'లాజిటెక్ వైర్‌లెస్ కీబోర్డ్ మౌస్',
      gu: 'લોજિટેક વાયરલેસ કીબોર્ડ માઉસ'
    },
    description: {
      en: 'SilentTouch technology eliminating over 90% of typing clicks. Full-size number pad, 36-month keyboard battery life, spill-resistant.',
      hi: 'आवाज़ रहित टाइपिंग, 36 महीने की बैटरी लाइफ और वाटर-रेसिस्टेंट वायरलेस कीबोर्ड सेट।',
      or: 'ବିନା ଶବ୍ଦରେ ଟାଇପ୍ କରିବା ପାଇଁ ଲମ୍ବା ବ୍ୟାଟେରୀ ବିଶିଷ୍ଟ କିବୋର୍ଡ।',
      mr: 'आवाज न करता चालणारा टिकाऊ कीबोर्ड.',
      bn: 'শব্দহীন ও দীর্ঘ ব্যাটারি সম্পন্ন কিবোর্ড ও মাউস।',
      ta: 'சத்தம் இல்லாத தட்டச்சு வசதி கொண்ட கீபோர்டு.',
      te: 'నిశ్శబ్ద టైపింగ్ కోసం బెస్ట్ కీబోర్డ్.',
      gu: 'શાંત અને ટકાઉ વાયરલેસ કીબોર્ડ.'
    },
    price: 2495,
    mrp: 3295,
    stock: 55,
    rating: 4.7,
    reviewCount: 1120,
    imageUrl: '/images/technology-brands/prod-logitech-keyboard-mouse.jpg',
    sourceUrl: 'https://www.flipkart.com/logitech-mk295-silent-wireless-mouse-keyboard-combo-silenttouch-technology-standard-multi-device-compatible-desktop-laptop-mac-full-numpad-advanced-optical-tracking-lag-free-wireless-90-less-noise/p/itm518306bcd2ae0',
    brand: 'Logitech',
    unit: '1 Set',
    aliases: [
      { term: 'keyboard', language: 'en', script: 'latin' },
      { term: 'mouse', language: 'en', script: 'latin' },
      { term: 'कीबोर्ड', language: 'hi', script: 'devanagari' },
      { term: 'माउस', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-laptop-stand-riser',
    categoryId: 'cat-electronics',
    subCategory: 'Desktop Accessories',
    name: {
      en: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      hi: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      or: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      mr: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      bn: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      ta: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      te: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue',
      gu: 'Portronics My Buddy Hexa 33 Laptop Stand — Blue'
    },
    description: {
      en: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      hi: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      or: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      mr: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      bn: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      ta: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      te: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.',
      gu: 'Four-legged laptop stand with ten adjustable height positions and a smartphone holder. Blue model; laptop and phone are not included.'
    },
    price: 799,
    mrp: 1499,
    stock: 90,
    rating: 4.8,
    reviewCount: 640,
    imageUrl: '/images/technology-brands/prod-laptop-stand-riser.jpg',
    sourceUrl: 'https://www.portronics.com/products/my-buddy-hexa-33',
    brand: 'Portronics',
    unit: '1 Piece',
    aliases: [
      { term: 'laptop stand', language: 'en', script: 'latin' },
      { term: 'stand', language: 'en', script: 'latin' },
      { term: 'लैपटॉप स्टैंड', language: 'hi', script: 'devanagari' }
    ]
  },

  // 7. POWER BANK
  {
    id: 'prod-mi-powerbank-20000',
    categoryId: 'cat-electronics',
    subCategory: 'Power Bank',
    name: {
      en: 'Mi HyperSonic Power Bank — 20000mAh, 50W, Black',
      hi: 'एमआई 20000mAh 50W फास्ट चार्जिंग पावर बैंक',
      or: 'ଏମଆଇ ୨୦୦୦୦mAh ପାୱାର ବ୍ୟାଙ୍କ',
      mr: 'एमआय 20000mAh पॉवर बँक',
      bn: 'শাওমি ২০০০০ এমএএইচ পাওয়ার ব্যাংক',
      ta: 'எம்ஐ பவர் பேங்க்',
      te: 'ఎంఐ పవర్ బ్యాంక్',
      gu: 'એમઆઈ પાવર બેંક'
    },
    description: {
      en: 'Charges laptops and flagship smartphones at up to 50W. Triple-port output with smart 16-layer circuit safety protection.',
      hi: 'लैपटॉप और स्मार्टफोन को सुपरफास्ट चार्ज करने वाला सुरक्षित 20000mAh पावर बैंक।',
      or: 'ଲାପଟପ୍ ଏବଂ ମୋବାଇଲ୍ ଚାର୍ଜିଂ ପାଇଁ ଉଚ୍ଚ କ୍ଷମତା ସମ୍ପନ୍ନ ପାୱାର ବ୍ୟାଙ୍କ।',
      mr: 'वेगवान चार्जिंग करणारी सुरक्षित पॉवर बँक.',
      bn: 'ল্যাপটপ ও ফোন চার্জ করার শক্তিশালী পাওয়ার ব্যাংক।',
      ta: 'வேகமாக சார்ஜ் செய்யும் பவர் பேங்க்.',
      te: 'ల్యాప్‌టాప్ మరియు ఫోన్ల కోసం ఫాస్ట్ ఛార్జర్.',
      gu: 'ઝડપી ચાર્જિંગ પાવર બેંક.'
    },
    price: 3499,
    mrp: 4999,
    stock: 65,
    rating: 4.8,
    reviewCount: 910,
    imageUrl: '/images/technology-brands/prod-mi-powerbank-20000.jpg',
    sourceUrl: 'https://www.flipkart.com/mi-20000-mah-50-w-power-bank/p/itmfd0887d5b5eea',
    brand: 'Xiaomi',
    unit: '1 Unit',
    aliases: [
      { term: 'power bank', language: 'en', script: 'latin' },
      { term: 'powerbank', language: 'en', script: 'latin' },
      { term: 'पावर बैंक', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-ambrane-pocket-powerbank',
    categoryId: 'cat-electronics',
    subCategory: 'Power Bank',
    name: {
      en: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      hi: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      or: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      mr: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      bn: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      ta: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      te: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W',
      gu: 'Ambrane Line 10 Pocket Power Bank — 10000mAh, 22.5W'
    },
    description: {
      en: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      hi: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      or: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      mr: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      bn: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      ta: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      te: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.',
      gu: 'Compact 10000mAh power bank with up to 22.5W output. Model Line 10.'
    },
    price: 899,
    mrp: 1599,
    stock: 95,
    rating: 4.6,
    reviewCount: 1450,
    imageUrl: '/images/technology-brands/prod-ambrane-pocket-powerbank.jpg',
    sourceUrl: 'https://ambraneindia.com/products/line-10',
    brand: 'Ambrane',
    unit: '1 Unit',
    aliases: [
      { term: 'charger', language: 'en', script: 'latin' },
      { term: 'power bank', language: 'en', script: 'latin' }
    ]
  },

  // 8. GAMING
  {
    id: 'prod-mechanical-gaming-keyboard',
    categoryId: 'cat-electronics',
    subCategory: 'Gaming',
    name: {
      en: 'Cosmic Byte CB-GK-16 Firefly — Outemu Blue Mechanical Keyboard',
      hi: 'कॉस्मिक बाइट मैकेनिकल आरजीबी गेमिंग कीबोर्ड (क्लिकी ब्लू स्विच)',
      or: 'କସ୍ମିକ୍ ବାଇଟ୍ ମେକାନିକାଲ୍ ଗେମିଂ କିବୋର୍ଡ',
      mr: 'मेकॅनिकल गेमिंग कीबोर्ड',
      bn: 'মেকানিকাল আরজিবি গেমিং কিবোর্ড',
      ta: 'மெக்கானிக்கல் கேமிங் கீபோர்டு',
      te: 'మెకానికల్ గేమింగ్ కీబోర్డ్',
      gu: 'મિકેનિકલ ગેમિંગ કીબોર્ડ'
    },
    description: {
      en: 'Compact tenkeyless (TKL) aluminum top design, rainbow RGB backlight with 11 lighting effects, 100% anti-ghosting keys, detachable Braided Type-C cable.',
      hi: 'तेज़ टाइपिंग और गेमिंग के लिए संतोषजनक क्लिक साउंड और आरजीबी लाइट वाला मैकेनिकल कीबोर्ड।',
      or: 'ଦ୍ରୁତ ଟାଇପିଂ ଓ ଗେମିଂ ପାଇଁ ଆକର୍ଷଣୀୟ ଆଲୋକ ଥିବା ମେକାନିକାଲ୍ କିବୋର୍ଡ।',
      mr: 'गेमर्ससाठी रंगीबेरंगी बॅकलाइट असणारा कीबोर्ड.',
      bn: 'গেমারদের জন্য আকর্ষণীয় ব্যাকলিট মেকানিক্যাল কিবোর্ড।',
      ta: 'கேமிங்கிற்கு ஏற்ற வண்ணமயமான கீபோர்டு.',
      te: 'గేమింగ్ కోసం కలర్‌ఫుల్ మెకానికల్ కీబోర్డ్.',
      gu: 'ગેમિંગ માટે કલરફુલ મિકેનિકલ કીબોર્ડ.'
    },
    price: 2199,
    mrp: 2999,
    stock: 50,
    rating: 4.7,
    reviewCount: 780,
    imageUrl: '/images/technology-brands/prod-mechanical-gaming-keyboard.jpg',
    sourceUrl: 'https://www.flipkart.com/cosmic-byte-cb-gk-16-firefly-mechanical-outemu-blue-switch-wired-usb-tenkeyless-gaming-keyboard-compatible-desktop-laptop-mac/p/itme712c97bddca4',
    brand: 'Cosmic Byte',
    unit: '1 Keyboard',
    aliases: [
      { term: 'gaming keyboard', language: 'en', script: 'latin' },
      { term: 'mechanical keyboard', language: 'en', script: 'latin' },
      { term: 'गेमिंग कीबोर्ड', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-ps5-dualsense-controller',
    categoryId: 'cat-electronics',
    subCategory: 'Gaming',
    name: {
      en: 'Sony PlayStation DualSense Wireless Controller — White',
      hi: 'सोनी प्लेस्टेशन 5 वायरलेस गेमिंग कंट्रोलर (हैप्टिक फीडबैक)',
      or: 'ସୋନି ପ୍ଲେଷ୍ଟେସନ୍ ୫ ଗେମିଂ କଣ୍ଟ୍ରୋଲର୍',
      mr: 'सोनी पीएस5 वायरलेस कंट्रोलर',
      bn: 'সনি প্লেস্টেশন ৫ কন্ট্রোলার',
      ta: 'பிளேஸ்டேஷன் 5 கண்ட்ரோலர்',
      te: 'సోనీ ప్లేస్టేషన్ 5 కంట్రోలర్',
      gu: 'સોની પ્લેસ્ટેશન 5 કંટ્રોલર'
    },
    description: {
      en: 'Immersive haptic feedback, dynamic adaptive triggers, built-in microphone, motion sensors, and comfortable ergonomic grip.',
      hi: 'गेम खेलते समय वास्तविक कम्पन और खिंचाव महसूस कराने वाला विश्व प्रसिद्ध गेमिंग रिमोट कंट्रोलर।',
      or: 'ପିସି ଏବଂ ପ୍ଲେଷ୍ଟେସନ୍ ପାଇଁ ସର୍ବୋତ୍ତମ ଗେମିଂ କଣ୍ଟ୍ରୋଲର୍।',
      mr: 'प्रत्यक्ष थरार अनुभव देणारा वायरलेस कंट्रोलर.',
      bn: 'বাস্তবসম্মত গেম খেলার অনুভূতির জন্য ওয়্যারলেস কন্ট্রোলার।',
      ta: 'அதிநவீன வயர்லெஸ் கேமிங் கண்ட்ரோலர்.',
      te: 'గేమింగ్ ప్రియుల కోసం బెస్ట్ కంట్రోలర్.',
      gu: 'અદભુત વાઇબ્રેશન આપતો ગેમિંગ કંટ્રોલર.'
    },
    price: 5490,
    mrp: 5990,
    stock: 25,
    rating: 4.9,
    reviewCount: 1650,
    imageUrl: '/images/technology-brands/prod-ps5-dualsense-controller.jpg',
    sourceUrl: 'https://shopatsc.com/products/dualsense-wireless-controller-white',
    brand: 'Sony',
    unit: '1 Controller',
    variants: ['Sony PlayStation DualSense Wireless Controller — White'],
    aliases: [
      { term: 'ps5 controller', language: 'en', script: 'latin' },
      { term: 'joystick', language: 'en', script: 'latin' },
      { term: 'gamepad', language: 'en', script: 'latin' }
    ]
  },

  // 9. HEALTHCARE
  {
    id: 'prod-omron-bp-monitor',
    categoryId: 'cat-electronics',
    subCategory: 'Healthcare',
    name: {
      en: 'Omron HEM-7120 Automatic Blood Pressure Monitor',
      hi: 'ओमरॉन स्वचालित डिजिटल ब्लड प्रेशर (बीपी) मॉनिटर मशीन',
      or: 'ଓମ୍ରନ୍ ସ୍ୱୟଂଚାଳିତ ଡିଜିଟାଲ୍ ବିପି ମେସିନ୍',
      mr: 'ओमरोन डिजिटल बीपी मॉनिटर',
      bn: 'ওমরন ডিজিটাল প্রেসার মাপার মেশিন',
      ta: 'ஓம்ரான் இரத்த அழுத்த மானிட்டர்',
      te: 'ఓమ్రాన్ బీపీ మానిటర్ మిషన్',
      gu: 'ઓમરોન ડિજિટલ બીપી માપવાનું મશીન'
    },
    description: {
      en: 'IntelliSense technology with one-touch measurement for high accuracy. Detects irregular heartbeats and hypertension.',
      hi: 'वरिष्ठ नागरिकों के लिए एक-क्लिक में आसान और सटीक बीपी नापने वाली जापानी तकनीक मशीन।',
      or: 'ବୟସ୍କ ବ୍ୟକ୍ତିଙ୍କ ପାଇଁ ସହଜରେ ବିପି ମାପିବା ପାଇଁ ଭରସାଯୋଗ୍ୟ ଡିଜିଟାଲ୍ ମେସିନ୍।',
      mr: 'ज्येष्ठ नागरिकांसाठी सोपे बीपी मशीन.',
      bn: 'সহজে রক্তচাপ মাপার নির্ভরযোগ্য ডিজিটাল যন্ত্র।',
      ta: 'எளிதாக பிரஷர் பார்க்க உதவும் மெஷின்.',
      te: 'రక్తపోటును కచ్చితంగా కొలిచే డిజిటల్ మిషన్.',
      gu: 'સરળતાથી બીપી માપવા માટેનું મશીન.'
    },
    price: 1999,
    mrp: 2740,
    stock: 80,
    rating: 4.8,
    reviewCount: 3400,
    imageUrl: '/images/technology-brands/prod-omron-bp-monitor.jpg',
    sourceUrl: 'https://pharmeasy.in/health-care/products/omron-hem-7120-in-bp-monitor-175456',
    brand: 'Omron',
    unit: '1 Machine',
    aliases: [
      { term: 'bp machine', language: 'en', script: 'latin' },
      { term: 'blood pressure', language: 'en', script: 'latin' },
      { term: 'बीपी मशीन', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-dr-trust-pulse-oximeter',
    categoryId: 'cat-electronics',
    subCategory: 'Healthcare',
    name: {
      en: 'Dr Trust Professional Series 202 Pulse Oximeter — Blue',
      hi: 'डॉ ट्रस्ट फिंगरटिप पल्स ऑक्सीमीटर (ऑक्सीजन व नब्ज मीटर)',
      or: 'ଡକ୍ଟର ଟ୍ରଷ୍ଟ ଅକ୍ସିଜେନ୍ ମାପିବା ମେସିନ୍',
      mr: 'पल्स ऑक्सिमीटर मशीन',
      bn: 'পালস অক্সিমিটার অক্সিজেন মাপার যন্ত্র',
      ta: 'பல்ஸ் ஆக்ஸிமீட்டர்',
      te: 'పల్స్ ఆక్సిమీటర్',
      gu: 'પલ્સ ઓક્સિમીટર'
    },
    description: {
      en: 'OLED color display measuring blood oxygen saturation (SpO2), pulse rate, and perfusion index within 6 seconds. Water resistant.',
      hi: 'उंगली पर लगाकर 6 सेकंड में शरीर का ऑक्सीजन लेवल और पल्स रेट बताने वाली मशीन।',
      or: 'ଶରୀରର ଅକ୍ସିଜେନ୍ ସ୍ତର ଏବଂ ନାଡ଼ିର ଗତି ମାପିବା ପାଇଁ ସହଜ ଯନ୍ତ୍ର।',
      mr: 'रक्तातील ऑक्सिजन पातळी मोजण्यासाठी उपयुक्त साधन.',
      bn: 'দ্রুত রক্তে অক্সিজেনের মাত্রা জানার নির্ভরযোগ্য যন্ত্র।',
      ta: 'ஆக்சிஜன் அளவை துல்லியமாக காட்டும் கருவி.',
      te: 'రక్తంలో ఆక్సిజన్ శాతాన్ని కొలిచే మీటర్.',
      gu: 'ઓક્સિજન લેવલ માપવાનું ડિજિટલ મશીન.'
    },
    price: 999,
    mrp: 1899,
    stock: 75,
    rating: 4.7,
    reviewCount: 1540,
    imageUrl: '/images/technology-brands/prod-dr-trust-pulse-oximeter.jpg',
    sourceUrl: 'https://drtrust.in/products/dr-trust-usa-professional-series-finger-tip-pulse-oximeter-with-audio-visual-alarm-and-respiratory-index?_fid=29bc4cc25&_pos=149&_ss=c',
    brand: 'Dr Trust',
    unit: '1 Device',
    aliases: [
      { term: 'oximeter', language: 'en', script: 'latin' },
      { term: 'oxygen meter', language: 'en', script: 'latin' },
      { term: 'ऑक्सीमीटर', language: 'hi', script: 'devanagari' }
    ]
  },

  // 10. NETWORKING
  {
    id: 'prod-tplink-wifi-router',
    categoryId: 'cat-electronics',
    subCategory: 'Networking',
    name: {
      en: 'TP-Link Archer AX12 — AX1500 Wi-Fi 6 Router',
      hi: 'टीपी-लिंक डुअल-बैंड वाई-फाई 6 गीगाबिट राउटर',
      or: 'ଟିପି-ଲିଙ୍କ ଡୁଆଲ ବ୍ୟାଣ୍ଡ ୱାଇ-ଫାଇ ରାଉଟର',
      mr: 'टीपी-लिंक वाय-फाय 6 राउटर',
      bn: 'টিপি-লিংক ওয়াইফাই ৬ রাউটার',
      ta: 'டிபி-லிங்க் வைஃபை ரூட்டர்',
      te: 'టీపీ-లింక్ వై-ఫై రూటర్',
      gu: 'ટીપી-લિંક વાઇ-ફાઇ રાઉટર'
    },
    description: {
      en: 'Next-gen Wi-Fi 6 speeds up to 1.5 Gbps with 4 high-gain antennas and Beamforming for whole-home high-speed coverage.',
      hi: 'पूरे घर में तेज़ 4K स्ट्रीमिंग और वर्क-फ्रॉम-होम के लिए हाई-स्पीड वाई-फाई 6 राउटर।',
      or: 'ଦ୍ରୁତ ଇଣ୍ଟରନେଟ୍ ଏବଂ ଅଫିସ୍ କାର୍ଯ୍ୟ ପାଇଁ ହାଇସ୍ପିଡ୍ ୱାଇଫାଇ ରାଉଟର।',
      mr: 'जलद इंटरनेटसाठी वाय-फाय 6 राउटर.',
      bn: 'হাই স্পিড ব্রডব্যান্ড ওয়াইফাই রাউটার।',
      ta: 'அதிவேக வைஃபை வசதி தரும் ரூட்டர்.',
      te: 'ఇంటి నిండా వేగవంతమైన ఇంటర్నెట్ కోసం రూటర్.',
      gu: 'હાઈ સ્પીડ વાઈ-ફાઈ રાઉટર.'
    },
    price: 2699,
    mrp: 4999,
    stock: 45,
    rating: 4.6,
    reviewCount: 820,
    imageUrl: '/images/technology-brands/prod-tplink-wifi-router.jpg',
    sourceUrl: 'https://www.flipkart.com/tp-link-archer-ax12-ax1500-dual-band-gigabit-1500-mbps-wi-fi-6-router/p/itm3f1cf0f9cdb0f',
    brand: 'TP-Link',
    unit: '1 Router',
    aliases: [
      { term: 'router', language: 'en', script: 'latin' },
      { term: 'wifi', language: 'en', script: 'latin' },
      { term: 'राउटर', language: 'hi', script: 'devanagari' }
    ]
  },

  // 11. EARBUDS (Different brands, features & variants from top to budget friendly!)
  {
    id: 'prod-boat-earbuds',
    categoryId: 'cat-electronics',
    subCategory: 'Earbuds',
    name: {
      en: 'boAt Airdopes 141 ANC — True Wireless Earbuds',
      hi: 'बोट एयरडोप्स 141 ब्लूटूथ ईयरबड्स (शोर रद्दीकरण - ANC)',
      or: 'ବୋଟ୍ ଏୟାରଡପ୍ସ ବ୍ଲୁଟୁଥ୍ ଇୟରବଡ୍ସ',
      mr: 'बोट वायरलेस इयरबड्स',
      bn: 'বোট এয়ারবাডস ব্লুটুথ',
      ta: 'போட் வயர்லெஸ் இயர்பட்ஸ்',
      te: 'బోట్ వైర్‌లెస్ ఇయర్‌బడ్స్',
      gu: 'બોટ બ્લૂટૂથ ઇયરબડ્સ'
    },
    description: {
      en: 'Active noise cancellation (up to 32dB), Beast mode low-latency for gaming, ENx quad mics, and IPX5 sweat resistance. Super budget friendly.',
      hi: 'बेहतरीन बास, 42 घंटे की बैटरी और क्रिस्टल क्लियर कॉलिंग के साथ वायरलेस ईयरबड्स।',
      or: 'ସ୍ପଷ୍ଟ ସାଉଣ୍ଡ ଏବଂ ୪୨ ଘଣ୍ଟାର ବ୍ୟାଟେରୀ ବ୍ୟାକଅପ୍।',
      mr: 'उत्कृष्ट आवाज आणि बॅटरी.',
      bn: 'ভালো সাউন্ডের ব্লুটুথ এয়ারবাডস।',
      ta: 'தெளிவான ஒலி கொண்ட இயர்பட்ஸ்.',
      te: 'వైర్‌లెస్ ఇయర్‌బడ్స్.',
      gu: 'લાંબી બેટરી લાઈફ વાળા ઇયરબડ્સ.'
    },
    price: 1499,
    mrp: 3990,
    stock: 120,
    rating: 4.5,
    reviewCount: 2450,
    imageUrl: '/images/technology-brands/prod-boat-earbuds.jpg',
    sourceUrl: 'https://www.boat-lifestyle.com/products/airdopes-141-anc-earbuds',
    brand: 'boAt',
    unit: '1 Pair',
    variants: ['boAt Airdopes 141 ANC — True Wireless Earbuds'],
    aliases: [
      { term: 'earbuds', language: 'en', script: 'latin' },
      { term: 'boat', language: 'en', script: 'latin' },
      { term: 'ईयरबड्स', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-oneplus-nord-buds-2r',
    categoryId: 'cat-electronics',
    subCategory: 'Earbuds',
    name: {
      en: 'OnePlus Nord Buds 2r — Deep Grey',
      hi: 'वनप्लस नॉर्ड बड्स 2r वायरलेस ईयरबड्स (12.4mm टाइटेनियम ड्राइवर्स)',
      or: 'ୱାନପ୍ଲସ୍ ନର୍ଡ ବଡ୍ସ ୨r',
      mr: 'वनप्लस वायरलेस इयरबड्स',
      bn: 'ওয়ানপ্লাস নর্ড বাডস ২আর',
      ta: 'ஒன்பிளஸ் இயர்பட்ஸ்',
      te: 'వన్ ప్లస్ నార్డ్ బడ్స్ 2r',
      gu: 'વનપ્લસ નોર્ડ બડ્સ 2r'
    },
    description: {
      en: 'Extra deep bass with 12.4mm titanium drivers, Sound Master Equalizer, IP55 water resistance, fast pair, and 38 hours playback.',
      hi: 'शानदार बेस, वनप्लस फास्ट पेयरिंग और 38 घंटे की बैटरी बैकअप वाला ब्रांडेड ईयरबड्स।',
      or: 'ଡିପ୍ ବାସ୍ ଏବଂ ସ୍ପଷ୍ଟ କଲିଂ ପାଇଁ ୱାନପ୍ଲସ୍ ବ୍ଲୁଟୁଥ୍ ଇୟରଫୋନ୍।',
      mr: 'भारी बेस आणि स्वच्छ आवाज देणारे वनप्लस इयरबड्स.',
      bn: 'উচ্চমানের বেস সম্বলিত ওয়ানপ্লাস ব্লুটুথ ইয়ারফোন।',
      ta: 'தெளிவான காலிங் வசதி கொண்ட இயர்பட்ஸ்.',
      te: 'నాణ్యమైన సౌండ్ అందించే వన్‌ప్లస్ ఇయర్‌బడ్స్.',
      gu: 'ઊંડા બાસ સાથે વનપ્લસ બ્લૂટૂથ ઇયરબડ્સ.'
    },
    price: 1999,
    mrp: 2999,
    stock: 95,
    rating: 4.7,
    reviewCount: 1890,
    imageUrl: '/images/technology-brands/prod-oneplus-nord-buds-2r.jpg',
    sourceUrl: 'https://www.flipkart.com/oneplus-nord-buds-2r-ear-earbuds-dual-mic-ai-crystal-clear-call-bluetooth/p/itm2560f6f9b1d5b',
    brand: 'OnePlus',
    unit: '1 Pair',
    variants: ['OnePlus Nord Buds 2r — Deep Grey'],
    aliases: [
      { term: 'oneplus', language: 'en', script: 'latin' },
      { term: 'nord buds', language: 'en', script: 'latin' },
      { term: 'earphones', language: 'en', script: 'latin' }
    ]
  },
  {
    id: 'prod-noise-buds-vs102',
    categoryId: 'cat-electronics',
    subCategory: 'Earbuds',
    name: {
      en: 'Noise Buds VS102 — Jet Black',
      hi: 'नॉइज़ बड्स VS102 वायरलेस ईयरबड्स (50 घंटे प्लेटाइम - सुपर बजट)',
      or: 'ନଏସ୍ ବଡ୍ସ VS102 (୫୦ ଘଣ୍ଟା ବ୍ୟାଟେରୀ)',
      mr: 'नॉइज बजेट इयरबड्स 50 तास',
      bn: 'নয়েজ বাডস ৫০ ঘণ্টা প্লেটাইম',
      ta: 'நாய்ஸ் பட்ஜெட் இயர்பட்ஸ்',
      te: 'నాయిస్ బడ్స్ VS102',
      gu: 'નોઇઝ બજેટ ઇયરબડ્સ 50 કલાક'
    },
    description: {
      en: 'Ultra-budget friendly powerhouse: 11mm speaker drivers, Instacharge (10 min charge = 120 mins play), IPX5 splash resistance.',
      hi: 'मात्र ₹999 में 50 घंटे चलने वाला और 10 मिनट चार्ज में 2 घंटे गाना सुनाने वाला सबसे सस्ता टिकाऊ ईयरबड्स।',
      or: 'କମ୍ ଦାମରେ ୫୦ ଘଣ୍ଟା ଚାଲୁଥିବା ଭରସାଯୋଗ୍ୟ ଇୟରବଡ୍ସ।',
      mr: 'किफायतशीर किमतीत मोठी बॅटरी असणारे इयरबड्स.',
      bn: 'অল্প দামে দীর্ঘ ব্যাটারি ব্যাকআপ বিশিষ্ট ইয়ারবাডস।',
      ta: 'குறைந்த விலையில் சிறந்த இயர்பட்ஸ்.',
      te: 'తక్కువ ధరలో ఎక్కువ బ్యాటరీ లైఫ్ ఇయర్‌బడ్స్.',
      gu: 'ઓછી કિંમતે લાંબી બેટરી વાળા ઇયરબડ્સ.'
    },
    price: 999,
    mrp: 2999,
    stock: 150,
    rating: 4.4,
    reviewCount: 3100,
    imageUrl: '/images/technology-brands/prod-noise-buds-vs102.jpg',
    sourceUrl: 'https://www.myntra.com/headphones/noise/noise-buds-vs102-truly-wireless-earbuds-with-50hrs-playtime-and-11mm-driver/15622444/buy',
    brand: 'Noise',
    unit: '1 Pair',
    variants: ['Noise Buds VS102 — Jet Black'],
    aliases: [
      { term: 'noise', language: 'en', script: 'latin' },
      { term: 'budget earbuds', language: 'en', script: 'latin' }
    ]
  },
  {
    id: 'prod-apple-airpods-pro-2',
    categoryId: 'cat-electronics',
    subCategory: 'Earbuds',
    name: {
      en: 'Apple AirPods Pro 2 — MagSafe Charging Case (USB-C)',
      hi: 'एप्पल एयरपॉड्स प्रो (2nd जनरेशन) एक्टिव नॉइज़ कैंसिलेशन व MagSafe',
      or: 'ଆପଲ୍ ଏୟାରପଡ୍ସ ପ୍ରୋ ୨ୟ ଜେନ୍',
      mr: 'अॅपल एअरपॉड्स प्रो 2nd जनरेशन',
      bn: 'অ্যাপল এয়ারপডস প্রো ২য় জেনারেশন',
      ta: 'ஆப்பிள் ஏர்பாட்ஸ் ப்ரோ',
      te: 'ఆపిల్ ఎయిర్‌పాడ్స్ ప్రో 2nd Gen',
      gu: 'એપલ એરપોડ્સ પ્રો 2nd જનરેશન'
    },
    description: {
      en: 'Apple-designed H2 chip, up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio with dynamic head tracking, USB-C charging.',
      hi: 'विश्व का सबसे प्रसिद्ध प्रीमियम ईयरबड्स। बाहर के शोर को पूरी तरह मिटाकर सिनेमा जैसा 3D ऑडियो अनुभव।',
      or: 'ବାହ୍ୟ ଶବ୍ଦକୁ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ କରୁଥିବା ଆପଲ୍ ପ୍ରିମିୟମ୍ ଏୟାରପଡ୍ସ।',
      mr: 'सिनेमासारखा 3D आवाज देणारे सर्वोत्तम अॅपल एअरपॉड्स.',
      bn: 'অতুলনীয় নয়েজ ক্যান্সলেশন সহ প্রিমিয়াম অ্যাপল এয়ারপডস।',
      ta: 'பிரீமியம் ஆப்பிள் ஏர்பாட்ஸ்.',
      te: 'అద్భుతమైన నాయిస్ క్యాన్సిలేషన్ గల ఆపిల్ ఎయిర్‌పాడ్స్.',
      gu: 'સિનેમા જેવો 3D અવાજ આપતા એપલ એરપોડ્સ.'
    },
    price: 22990,
    mrp: 24900,
    stock: 20,
    rating: 4.9,
    reviewCount: 4200,
    imageUrl: '/images/technology-brands/prod-apple-airpods-pro-2.jpg',
    sourceUrl: 'https://www.reliancedigital.in/product/apple-airpods-pro-2nd-gen-usb-c-type-with-magsafe-charging-case-true-wireless-with-active-noise-cancellation-touch-control-ip54-dust-sweat-and-water-resistant-bluetooth-v53-upto-30-hrs-of-playtime-white-lmho1u-7533663',
    brand: 'Apple',
    unit: '1 Pair',
    aliases: [
      { term: 'airpods', language: 'en', script: 'latin' },
      { term: 'airpods pro', language: 'en', script: 'latin' },
      { term: 'apple earbuds', language: 'en', script: 'latin' },
      { term: 'एयरपॉड्स', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-sony-wf-1000xm5',
    categoryId: 'cat-electronics',
    subCategory: 'Earbuds',
    name: {
      en: 'Sony WF-1000XM5 Noise Cancelling Earbuds — Black',
      hi: 'सोनी WF-1000XM5 इंडस्ट्री-लीडिंग नॉइज़ कैंसलिंग प्रीमियम ईयरबड्स',
      or: 'ସୋନି WF-1000XM5 ହାଇ-ରେସ୍ ଇୟରବଡ୍ସ',
      mr: 'सोनी प्रीमियम नॉईज कॅन्सलिंग इयरबड्स',
      bn: 'সনি প্রিমিয়াম নয়েজ ক্যান্সেলিং বাডস',
      ta: 'சோனி பிரீமியம் இயர்பட்ஸ்',
      te: 'సోనీ ఇండస్ట్రీ లీడింగ్ ఇయర్‌బడ్స్',
      gu: 'સોની પ્રીમિયમ નોઈઝ કેન્સલિંગ ઇયરબડ્સ'
    },
    description: {
      en: 'Dynamic Driver X for richer vocals and enhanced details. Dual feedback microphones, bone conduction sensors for crystal-clear calls, 24-bit audio processing.',
      hi: 'संगीत प्रेमियों के लिए सोनी का सबसे बेहतरीन ऑडियो और शोर-मुक्त कॉलिंग अनुभव देने वाला फ्लैगशिप ईयरबड्स।',
      or: 'ସଂଗୀତ ଶୁଣିବା ପାଇଁ ଉଚ୍ଚ ମାନର ଅଡିଓ ବିଶିଷ୍ଟ ପ୍ରିମିୟମ୍ ସୋନି ଇୟରବଡ୍ସ।',
      mr: 'संगीतप्रेमींसाठी अतुलनीय साऊंड क्वालिटी असणारे इयरबड्स.',
      bn: 'অডিওপ্রেমীদের জন্য শীর্ষমানের সনি ব্লুটুথ ইয়ারবাডস।',
      ta: 'இசை பிரியர்களுக்கான சிறந்த சோனி இயர்பட்ஸ்.',
      te: 'మ్యూజిక్ లవర్స్ కోసం బెస్ట్ సోనీ ఇయర్‌బడ్స్.',
      gu: 'સંગીતના શોખીનો માટે શ્રેષ્ઠ સાઉન્ડ ક્વોલિટી.'
    },
    price: 24990,
    mrp: 29990,
    stock: 14,
    rating: 4.9,
    reviewCount: 880,
    imageUrl: '/images/technology-brands/prod-sony-wf-1000xm5.jpg',
    sourceUrl: 'https://www.reliancedigital.in/product/sony-wf1000xm5-tws-earbuds-with-up-to-36-hours-battery-life-and-quick-charge-active-noise-cancellation-black-ln0fcs-7534140',
    brand: 'Sony',
    unit: '1 Pair',
    variants: ['Sony WF-1000XM5 Noise Cancelling Earbuds — Black'],
    aliases: [
      { term: 'sony earbuds', language: 'en', script: 'latin' },
      { term: 'sony headphones', language: 'en', script: 'latin' },
      { term: 'sony', language: 'en', script: 'latin' }
    ]
  }
];
