import { Product } from '../../types';

export const MOBILES_PRODUCTS: Product[] = [
  // 1. APPLE IPHONE
  {
    id: 'prod-iphone-16',
    categoryId: 'cat-mobiles',
    subCategory: 'Apple iPhone',
    name: {
      en: 'Apple iPhone 16 Pro — 128GB, Desert Titanium',
      hi: 'एप्पल आईफोन 16 प्रो (128 GB) - डेजर्ट टाइटेनियम',
      or: 'ଆପଲ୍ ଆଇଫୋନ୍ 16 ପ୍ରୋ (128 GB)',
      mr: 'अॅपल आयफोन 16 प्रो',
      bn: 'অ্যাপল আইফোন ১৬ প্রো',
      ta: 'ஆப்பிள் ஐபோன் 16 ப்ரோ',
      te: 'ఆపిల్ ఐఫోన్ 16 ప్రో',
      gu: 'એપલ આઇફોન 16 પ્રો'
    },
    description: {
      en: 'A18 Pro bionic chip, 48MP fusion camera with Camera Control button, Grade 5 titanium body, and USB-C superfast charging.',
      hi: 'A18 प्रो चिप, 48MP कैमरा कंट्रोल बटन, ग्रेड 5 टाइटेनियम डिज़ाइन और बेहतरीन बैटरी लाइफ।',
      or: 'ଅତ୍ୟାଧୁନିକ A18 ପ୍ରୋ ଚିପ୍ ଏବଂ ୪୮MP କ୍ୟାମେରା ସହ ପ୍ରିମିୟମ ସ୍ମାର୍ଟଫୋନ୍।',
      mr: 'शक्तिशाली A18 प्रो चिप आणि उत्कृष्ट कॅमेरा.',
      bn: 'উন্নত প্রযুক্তির এ১৮ প্রো চিপ এবং টাইটানিয়াম বডি।',
      ta: 'டைட்டானியம் வடிவமைப்புடன் கூடிய ஐபோன்.',
      te: 'అత్యుత్తమ కెమెరా మరియు ప్రాసెసర్ కలిగిన ఫోన్.',
      gu: 'નવો પ્રીમિયમ આઇફોન.'
    },
    price: 119900,
    mrp: 129900,
    stock: 24,
    rating: 4.9,
    reviewCount: 1250,
    imageUrl: '/images/technology-brands/prod-iphone-16.jpg',
    sourceUrl: 'https://www.flipkart.com/apple-iphone-16-pro-desert-titanium-128-gb/p/itm5a8453e89cbd4',
    brand: 'Apple',
    unit: '1 Unit',
    variants: ['Apple iPhone 16 Pro — 128GB, Desert Titanium'],
    aliases: [
      { term: 'iphone', language: 'en', script: 'latin' },
      { term: 'apple mobile', language: 'en', script: 'latin' },
      { term: 'आईफोन', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-iphone-15',
    categoryId: 'cat-mobiles',
    subCategory: 'Apple iPhone',
    name: {
      en: 'Apple iPhone 15 — 128GB, Blue',
      hi: 'एप्पल आईफोन 15 (128 GB, 48MP मुख्य कैमरा)',
      or: 'ଆପଲ୍ ଆଇଫୋନ୍ ୧୫ (୧୨୮ GB)',
      mr: 'अॅपल आयफोन 15',
      bn: 'অ্যাপল আইফোন ১৫',
      ta: 'ஆப்பிள் ஐபோன் 15',
      te: 'ఆపిల్ ఐఫోన్ 15',
      gu: 'એપલ આઇફોન 15'
    },
    description: {
      en: 'Dynamic Island, 48MP Main camera with 2x Telephoto, durable color-infused glass and aluminum design, USB-C charging.',
      hi: 'डायनामिक आइलैंड और 48 मेगापिक्सल कैमरा वाला लोकप्रिय एप्पल आईफोन 15।',
      or: 'ଡାଇନାମିକ୍ ଆଇଲ୍ୟାଣ୍ଡ ଏବଂ ୪୮MP କ୍ୟାମେରା ସହ ଲୋକପ୍ରିୟ ଆଇଫୋନ୍।',
      mr: 'आधुनिक कॅमेरा आणि उत्तम डिझाइन.',
      bn: 'অসাধারণ ক্যামেরা ও ডাইনামিক আইল্যান্ড সম্বলিত আইফোন।',
      ta: 'பிரபலமான ஆப்பிள் ஐபோன் 15.',
      te: 'డైనమిక్ ఐలాండ్ గల ఆపిల్ ఐఫోన్.',
      gu: 'લોકપ્રિય એપલ આઇફોન 15.'
    },
    price: 69900,
    mrp: 79900,
    stock: 40,
    rating: 4.8,
    reviewCount: 3100,
    imageUrl: '/images/technology-brands/prod-iphone-15.jpg',
    sourceUrl: 'https://www.reliancedigital.in/product/apple-iphone-15-128gb-blue-lmiqm7-7533785',
    brand: 'Apple',
    unit: '1 Unit',
    variants: ['Apple iPhone 15 — 128GB, Blue'],
    aliases: [
      { term: 'iphone 15', language: 'en', script: 'latin' },
      { term: 'apple', language: 'en', script: 'latin' }
    ]
  },
  {
    id: 'prod-iphone-14-plus',
    categoryId: 'cat-mobiles',
    subCategory: 'Apple iPhone',
    name: {
      en: 'Apple iPhone 14 Plus — 128GB, Starlight',
      hi: 'एप्पल आईफोन 14 प्लस (बड़ी 6.7 इंच स्क्रीन, महाबली बैटरी)',
      or: 'ଆପଲ୍ ଆଇଫୋନ୍ 14 ପ୍ଲସ୍',
      mr: 'अॅपल आयफोन 14 प्लस',
      bn: 'অ্যাপল আইফোন ১৪ প্লাস',
      ta: 'ஆப்பிள் ஐபோன் 14 பிளஸ்',
      te: 'ఆపిల్ ఐఫోన్ 14 ప్లస్',
      gu: 'એપલ આઇફોન 14 પ્લસ'
    },
    description: {
      en: '6.7-inch Super Retina XDR display, longest battery life ever on iPhone 14, advanced dual-camera system with Photonic Engine.',
      hi: 'बड़ी 6.7 इंच स्क्रीन और पूरे दिन चलने वाली जबरदस्त बैटरी वाला प्रीमियम आईफोन।',
      or: 'ବଡ଼ ସ୍କ୍ରିନ୍ ଏବଂ ଲମ୍ବା ସମୟ ବ୍ୟାଟେରୀ ସହ ଆଇଫୋନ୍।',
      mr: 'मोठा डिस्प्ले आणि दीर्घकाळ बॅटरी.',
      bn: 'বড় স্ক্রিন ও দীর্ঘ ব্যাটারির আইফোন।',
      ta: 'பெரிய திரை மற்றும் நீண்ட பேட்டரி ஆயுள்.',
      te: 'పెద్ద స్క్రీన్ మరియు ఎక్కువ బ్యాటరీ లైఫ్ గల ఐఫోన్.',
      gu: 'મોટી સ્ક્રીન વાળો એપલ આઇફોન.'
    },
    price: 59999,
    mrp: 69900,
    stock: 35,
    rating: 4.7,
    reviewCount: 1800,
    imageUrl: '/images/technology-brands/prod-iphone-14-plus.jpg',
    sourceUrl: 'https://www.flipkart.com/apple-iphone-14-plus-starlight-128-gb/p/itmc922ddc8af349',
    brand: 'Apple',
    unit: '1 Unit',
    variants: ['Apple iPhone 14 Plus — 128GB, Starlight'],
    aliases: [
      { term: 'iphone 14', language: 'en', script: 'latin' }
    ]
  },

  // 2. SAMSUNG GALAXY
  {
    id: 'prod-samsung-s25',
    categoryId: 'cat-mobiles',
    subCategory: 'Samsung Galaxy',
    name: {
      en: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      hi: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      or: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      mr: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      bn: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      ta: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      te: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow',
      gu: 'Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow'
    },
    description: {
      en: 'Snapdragon 8 Elite flagship chipset, 120Hz Dynamic AMOLED 2X display, 50MP AI camera, and 7 years of Android OS upgrades.',
      hi: 'स्नैपड्रैगन 8 एलीट फ्लैगशिप प्रोसेसर, डायनामिक एमोलेड डिस्प्ले और 50MP नाइटोग्राफी कैमरा।',
      or: 'ଶକ୍ତିଶାଳୀ ପ୍ରୋସେସର୍ ଏବଂ ୫୦MP AI କ୍ୟାମେରା ସହ ନୂଆ ସାମସଙ୍ଗ ଗାଲାକ୍ସି ଫୋନ୍।',
      mr: 'अत्याधुनिक स्नॅपड्रॅगन प्रोसेसर आणि AI कॅमेरा.',
      bn: 'লেটেস্ট স্ন্যাপড্রাগন প্রসেসর ও ৫০ মেগাপিক্সেল এআই ক্যামেরা।',
      ta: 'சக்திவாய்ந்த பிராசஸர் கொண்ட சாம்சங் போன்.',
      te: 'అత్యంత వేగవంతమైన స్మార్ట్‌ఫోన్.',
      gu: 'લેટેસ્ટ ફ્લેગશિપ સેમસંગ સ્માર્ટફોન.'
    },
    price: 74999,
    mrp: 82999,
    stock: 50,
    rating: 4.8,
    reviewCount: 420,
    imageUrl: '/images/technology-brands/prod-samsung-s25.jpg',
    sourceUrl: 'https://www.reliancedigital.in/product/samsung-galaxy-s25-5g-256-gb-12-gb-ram-silver-shadow-mobile-phone-mszxqt-10494330',
    brand: 'Samsung',
    unit: '1 Unit',
    variants: ['Samsung Galaxy S25 5G — 12GB/256GB, Silver Shadow'],
    aliases: [
      { term: 'samsung', language: 'en', script: 'latin' },
      { term: 'galaxy s25', language: 'en', script: 'latin' },
      { term: 'सैमसंग', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-samsung-galaxy-m35',
    categoryId: 'cat-mobiles',
    subCategory: 'Samsung Galaxy',
    name: {
      en: 'Samsung Galaxy M35 5G — 6GB/128GB, Daybreak Blue',
      hi: 'सैमसंग गैलेक्सी M35 5G (6000mAh महाबली बैटरी, 120Hz एमोलेड)',
      or: 'ସାମସଙ୍ଗ ଗାଲାକ୍ସି M35 5G (୬୦୦୦mAh ବ୍ୟାଟେରୀ)',
      mr: 'सॅमसंग गॅलॅक्सी M35 (6000mAh बॅटरी)',
      bn: 'স্যামসাং গ্যালাক্সি এম৩৫ (৬০০০ এমএএইচ ব্যাটারি)',
      ta: 'சாம்சங் கேலக்ஸி M35 5G',
      te: 'శామ్‌సంగ్ గెలాక్సీ M35 5G',
      gu: 'સેમસંગ ગેલેક્સી M35 5G'
    },
    description: {
      en: 'Monster 6000mAh battery for up to 2 days continuous usage, 50MP No Shake OIS camera, Vapor Cooling Chamber, and Gorilla Glass Victus+ protection.',
      hi: '2 दिन चलने वाली 6000mAh बैटरी और बिना हिले साफ फोटो खींचने वाला सैमसंग का सबसे भरोसेमंद 5G फोन।',
      or: '୨ ଦିନ ଚାଲୁଥିବା ବଡ଼ ବ୍ୟାଟେରୀ ସହ ଭରସାଯୋଗ୍ୟ ସାମସଙ୍ଗ ଫୋନ୍।',
      mr: 'दोन दिवस टिकणारी मोठी बॅटरी.',
      bn: 'বিশাল ৬০০০ এমএএইচ ব্যাটারির দীর্ঘস্থায়ী স্মার্টফোন।',
      ta: 'நீண்ட நேரம் உழைக்கும் பெரிய பேட்டரி.',
      te: 'రెండు రోజులు వచ్చే భారీ బ్యాటరీ ఫోన్.',
      gu: 'લાંબી બેટરી લાઈફ વાળી સેમસંગ 5G ફોન.'
    },
    price: 16999,
    mrp: 24499,
    stock: 80,
    rating: 4.7,
    reviewCount: 2400,
    imageUrl: '/images/technology-brands/prod-samsung-galaxy-m35.jpg',
    sourceUrl: 'https://www.flipkart.com/samsung-galaxy-m35-5g-daybreak-blue-128-gb/p/itm1a53e8f5191db',
    brand: 'Samsung',
    unit: '1 Unit',
    variants: ['Samsung Galaxy M35 5G — 6GB/128GB, Daybreak Blue'],
    aliases: [
      { term: 'samsung m35', language: 'en', script: 'latin' },
      { term: 'samsung budget phone', language: 'en', script: 'latin' }
    ]
  },
  {
    id: 'prod-samsung-galaxy-a55',
    categoryId: 'cat-mobiles',
    subCategory: 'Samsung Galaxy',
    name: {
      en: 'Samsung Galaxy A55 5G — 8GB/128GB, Awesome Iceblue',
      hi: 'सैमसंग गैलेक्सी A55 5G (प्रीमियम मेटल फ्रेम, गोरिल्ला ग्लास विक्टस)',
      or: 'ସାମସଙ୍ଗ ଗାଲାକ୍ସି A55 5G',
      mr: 'सॅमसंग गॅलॅक्सी A55',
      bn: 'স্যামসাং গ্যালাক্সি এ৫৫',
      ta: 'சாம்சங் கேலக்ஸி A55 5G',
      te: 'శామ్‌సంగ్ గెలాక్సీ A55 5G',
      gu: 'સેમસંગ ગેલેક્સી A55'
    },
    description: {
      en: 'Premium metal frame with glass back, IP67 water and dust resistance, 50MP OIS camera with 4K video recording, and Knox Vault security.',
      hi: 'मेटल फ्रेम, वाटरप्रूफ सुरक्षा और शानदार कैमरा वाला सैमसंग A-सीरीज़ फोन।',
      or: 'ମେଟାଲ ଫ୍ରେମ୍ ଏବଂ ୱାଟରପ୍ରୁଫ୍ ସହ ସାମସଙ୍ଗ ଫୋନ୍।',
      mr: 'वॉटरप्रूफ आणि मेटल बॉडी फोन.',
      bn: 'ওয়াটারপ্রুফ মেটাল বডি প্রিমিয়াম স্যামসাং ফোন।',
      ta: 'மெட்டல் பிரேம் மற்றும் நீர்ப்புகா வசதி.',
      te: 'మెటల్ ఫ్రేమ్ మరియు వాటర్‌ప్రూఫ్ గల ఫోన్.',
      gu: 'વોટરપ્રૂફ મેટલ ફ્રેમ સ્માર્ટફોન.'
    },
    price: 35999,
    mrp: 42999,
    stock: 45,
    rating: 4.6,
    reviewCount: 890,
    imageUrl: '/images/technology-brands/prod-samsung-galaxy-a55.jpg',
    sourceUrl: 'https://www.flipkart.com/samsung-galaxy-a55-5g-awesome-iceblue-128-gb/p/itm0bb662185bcc4',
    brand: 'Samsung',
    unit: '1 Unit',
    variants: ['Samsung Galaxy A55 5G — 8GB/128GB, Awesome Iceblue'],
    aliases: [
      { term: 'galaxy a55', language: 'en', script: 'latin' }
    ]
  },

  // 3. REALME
  {
    id: 'prod-realme-13-pro-plus',
    categoryId: 'cat-mobiles',
    subCategory: 'Realme',
    name: {
      en: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      hi: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      or: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      mr: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      bn: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      ta: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      te: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green',
      gu: 'realme 13 Pro+ 5G — 8GB/256GB, Emerald Green'
    },
    description: {
      en: 'Ultra-clear 50MP Sony LYT-701 OIS camera + 50MP Sony LYT-600 periscope lens with 120X super zoom. 120Hz curved AMOLED, 80W Ultra Charge.',
      hi: 'सोनी सेंसर वाले पेरिस्कोप लेंस से दूर की भी साफ फोटो खींचने वाला और 80W फास्ट चार्जिंग वाला फोन।',
      or: 'ଦୂରର ଫଟୋ ସ୍ପଷ୍ଟ ଉଠାଇବା ପାଇଁ ପେରିସ୍କୋପ୍ କ୍ୟାମେରା ସହ ରିଅଲମି ଫୋନ୍।',
      mr: 'लांबचे फोटो स्पष्ट काढणारा कॅमेरा फोन.',
      bn: 'উচ্চমানের জুম ক্যামেরা ও দ্রুত চার্জিং ফোন।',
      ta: 'தெளிவான ஜூம் கேமரா கொண்ட ரியல்மி போன்.',
      te: 'అద్భుతమైన జూమ్ కెమెరా గల రియల్‌మీ ఫోన్.',
      gu: 'સુપર ઝૂમ કેમેરા વાળો સ્માર્ટફોન.'
    },
    price: 32999,
    mrp: 36999,
    stock: 55,
    rating: 4.7,
    reviewCount: 980,
    imageUrl: '/images/technology-brands/prod-realme-13-pro-plus.jpg',
    sourceUrl: 'https://www.flipkart.com/realme-13-pro-5g/p/itm1e3e0852d520a',
    brand: 'Realme',
    unit: '1 Unit',
    variants: ['realme 13 Pro+ 5G — 8GB/256GB, Emerald Green'],
    aliases: [
      { term: 'realme', language: 'en', script: 'latin' },
      { term: 'रियलमी', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-realme-narzo-70x',
    categoryId: 'cat-mobiles',
    subCategory: 'Realme',
    name: {
      en: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      hi: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      or: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      mr: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      bn: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      ta: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      te: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue',
      gu: 'realme Narzo 70x 5G — 6GB/128GB, Ice Blue'
    },
    description: {
      en: 'Most accessible 5G smartphone with 120Hz smooth display, 5000mAh battery with 45W SUPERVOOC charging, and dual stereo speakers.',
      hi: 'कम बजट में तेज 5G इंटरनेट, 45W फास्ट चार्जिंग और स्टीरियो स्पीकर वाला बढ़िया फोन।',
      or: 'କମ୍ ଖର୍ଚ୍ଚରେ ଦ୍ରୁତ 5G ଏବଂ ବଡ଼ ବ୍ୟାଟେରୀ ସହ ଫୋନ୍।',
      mr: 'कमी बजेटमध्ये उत्तम 5G स्मार्टफोन.',
      bn: 'বাজেট ফ্রেন্ডলি সুপারফাস্ট ৫জি স্মার্টফোন।',
      ta: 'குறைந்த விலையில் சிறந்த 5G போன்.',
      te: 'తక్కువ ధరలో బెస్ట్ 5G స్మార్ట్‌ఫోన్.',
      gu: 'બજેટ ફ્રેન્ડલી 5G સ્માર્ટફોન.'
    },
    price: 13499,
    mrp: 17999,
    stock: 75,
    rating: 4.6,
    reviewCount: 1650,
    imageUrl: '/images/technology-brands/prod-realme-narzo-70x.jpg',
    sourceUrl: 'https://www.flipkart.com/realme-narzo-70x-5g-ice-blue-128-gb/p/itm4ef66169ea11b',
    brand: 'Realme',
    unit: '1 Unit',
    aliases: [
      { term: 'narzo', language: 'en', script: 'latin' },
      { term: 'realme narzo', language: 'en', script: 'latin' }
    ]
  },

  // 4. GOOGLE PIXEL
  {
    id: 'prod-google-pixel-9',
    categoryId: 'cat-mobiles',
    subCategory: 'Google Pixel',
    name: {
      en: 'Google Pixel 9 — 12GB/256GB, Peony',
      hi: 'Google Pixel 9 — 12GB/256GB, Peony',
      or: 'Google Pixel 9 — 12GB/256GB, Peony',
      mr: 'Google Pixel 9 — 12GB/256GB, Peony',
      bn: 'Google Pixel 9 — 12GB/256GB, Peony',
      ta: 'Google Pixel 9 — 12GB/256GB, Peony',
      te: 'Google Pixel 9 — 12GB/256GB, Peony',
      gu: 'Google Pixel 9 — 12GB/256GB, Peony'
    },
    description: {
      en: 'Google Tensor G4 processor, world-class computational photography with Magic Editor, and satellite SOS capability.',
      hi: 'सर्वश्रेष्ठ कैमरा, गूगल का असली एंड्रॉइड अनुभव और शक्तिशाली टेंसर G4 चिप।',
      or: 'ଚମତ୍କାର କ୍ୟାମେରା ଏବଂ ସଫ୍ଟୱେର୍ ସହ ଗୁଗଲ୍ ଫୋନ୍।',
      mr: 'उत्कृष्ट कॅमेरा आणि गुगलचा अस्सल अनुभव.',
      bn: 'সেরা ক্যামেরা ও পিওর অ্যান্ড্রয়েড ফোন।',
      ta: 'சிறந்த கேமரா அனுபவம் தரும் கூகிள் போன்.',
      te: 'అత్యుత్తమ కెమెరా గల గూగుల్ పిక్సెల్.',
      gu: 'શ્રેષ્ઠ કેમેરા સાથે ગૂગલ ફોન.'
    },
    price: 79999,
    mrp: 89999,
    stock: 30,
    rating: 4.8,
    reviewCount: 520,
    imageUrl: '/images/technology-brands/prod-google-pixel-9.jpg',
    sourceUrl: 'https://www.flipkart.com/google-pixel-9-peony-256-gb/p/itmdfee129571238',
    brand: 'Google',
    unit: '1 Unit',
    aliases: [
      { term: 'pixel', language: 'en', script: 'latin' },
      { term: 'google phone', language: 'en', script: 'latin' },
      { term: 'गूगल फोन', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-google-pixel-8a',
    categoryId: 'cat-mobiles',
    subCategory: 'Google Pixel',
    name: {
      en: 'Google Pixel 8a — 8GB/128GB, Bay',
      hi: 'गूगल पिक्सल 8a 5G (टेंसर G3 चिप, बेस्ट कैमरा)',
      or: 'ଗୁଗଲ୍ ପିକ୍ସେଲ 8a 5G',
      mr: 'गुगल पिक्सेल 8a',
      bn: 'গুগল পিক্সেল ৮এ',
      ta: 'கூகிள் பிக்சல் 8a',
      te: 'గూగుల్ పిక్సెల్ 8a',
      gu: 'ગૂગલ પિક્સેલ 8a'
    },
    description: {
      en: 'Google Tensor G3 chip, incredible AI camera with Best Take & Audio Magic Eraser, 120Hz Actua display, and 7 years of Pixel drops.',
      hi: 'एआई फीचर्स, बेस्ट टेक फोटो तकनीक और 7 साल तक सॉफ्टवेयर अपडेट की गारंटी।',
      or: 'ଅତୁଳନୀୟ AI ଫଟୋଗ୍ରାଫି ସହ ଗୁଗଲ୍ ଫୋନ୍।',
      mr: 'उत्तम कॅमेरा आणि AI फीचर्स.',
      bn: 'অসাধারণ এআই ক্যামেরা সম্বলিত স্মার্টফোন।',
      ta: 'சிறந்த AI கேமரா போன்.',
      te: 'బెస్ట్ AI కెమెరా గల గూగుల్ ఫోన్.',
      gu: 'શ્રેષ્ઠ AI કેમેરા સ્માર્ટફોન.'
    },
    price: 49999,
    mrp: 52999,
    stock: 40,
    rating: 4.7,
    reviewCount: 780,
    imageUrl: '/images/technology-brands/prod-google-pixel-8a.jpg',
    sourceUrl: 'https://www.flipkart.com/google-pixel-8a-bay-128-gb/p/itm6d2e15988f2c4',
    brand: 'Google',
    unit: '1 Unit',
    aliases: [
      { term: 'pixel 8a', language: 'en', script: 'latin' }
    ]
  },

  // 5. MOTOROLA
  {
    id: 'prod-motorola-edge-50',
    categoryId: 'cat-mobiles',
    subCategory: 'Motorola',
    name: {
      en: 'Motorola Edge 50 Fusion — 8GB/128GB, Marshmallow Blue',
      hi: 'मोटोरोला एज 50 फ्यूजन (144Hz कर्व्ड डिस्प्ले, सोनी सेंसर)',
      or: 'ମୋଟୋରୋଲା ଏଜ୍ ୫୦ ଫ୍ୟୁଜନ୍',
      mr: 'मोटोरोला एज 50',
      bn: 'মটোরোলা এজ ৫০ ফিউশন',
      ta: 'மோட்டோரோலா எட்ஜ் 50',
      te: 'మోటోరోలా ఎడ్జ్ 50',
      gu: 'મોટોરોલા એજ 50'
    },
    description: {
      en: 'IP68 underwater protection, 144Hz 3D curved pOLED screen, Sony LYTIA 700C OIS camera, and clean Moto MyUX.',
      hi: 'वाटरप्रूफ IP68 रेटिंग, 144Hz कर्व्ड स्क्रीन और सोनी ओआईएस कैमरा वाला किफायती 5G फोन।',
      or: 'ୱାଟରପ୍ରୁଫ୍ ଏବଂ କର୍ଭଡ୍ ସ୍କ୍ରିନ୍ ସହ ମୋଟୋରୋଲା 5G ମୋବାଇଲ୍।',
      mr: 'पाण्यात न बिघडणारा कर्व्हड स्क्रीन फोन.',
      bn: 'আইপি৬৮ ওয়াটারপ্রুফ স্লিম স্মার্টফোন।',
      ta: 'நீர்ப்புகா வசதி கொண்ட ஸ்மார்ட்போன்.',
      te: 'వాటర్‌ప్రూఫ్ మరియు కర్వ్‌డ్ డిస్‌ప్లే ఫోన్.',
      gu: 'વોટરપ્રૂફ કર્વ્ડ સ્ક્રીન ફોન.'
    },
    price: 22999,
    mrp: 27999,
    stock: 65,
    rating: 4.7,
    reviewCount: 840,
    imageUrl: '/images/technology-brands/prod-motorola-edge-50.jpg',
    sourceUrl: 'https://www.flipkart.com/motorola-edge-50-fusion-marshmallow-blue-128-gb/p/itm7d39b15599c7e',
    brand: 'Motorola',
    unit: '1 Unit',
    aliases: [
      { term: 'moto', language: 'en', script: 'latin' },
      { term: 'motorola', language: 'en', script: 'latin' },
      { term: 'मोटोरोला', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-moto-g85',
    categoryId: 'cat-mobiles',
    subCategory: 'Motorola',
    name: {
      en: 'Motorola G85 5G — 8GB/128GB, Olive Green',
      hi: 'मोटो G85 5G (वीगन लेदर फिनिश, 3D कर्व्ड स्क्रीन)',
      or: 'ମୋଟୋ G85 5G',
      mr: 'मोटो G85',
      bn: 'মটো জি৮৫ ৫জি',
      ta: 'மோட்டோ G85',
      te: 'మోటో G85',
      gu: 'મોટો G85'
    },
    description: {
      en: 'Segment-first 3D Curved pOLED 120Hz display, 50MP Sony LYTIA 600 camera with OIS, premium vegan leather design, and 5000mAh battery.',
      hi: 'कर्व्ड स्क्रीन, वीगन लेदर बैक और सोनी कैमरा वाला सबसे खूबसूरत बजट फोन।',
      or: 'ପ୍ରିମିୟମ ଲେଦର ଫିନିସ୍ ସହ ମୋଟୋ ଫୋନ୍।',
      mr: 'लेदर फिनिश आणि कर्व्हड डिस्प्ले फोन.',
      bn: 'লেদার ফিনিশ ও দুর্দান্ত ক্যামেরার স্মার্টফোন।',
      ta: 'லெதர் வடிவமைப்பு கொண்ட அழகான போன்.',
      te: 'లెదర్ డిజైన్ గల బెస్ట్ ఫోన్.',
      gu: 'લેધર ફિનિશ સ્માર્ટફોન.'
    },
    price: 17999,
    mrp: 20999,
    stock: 55,
    rating: 4.6,
    reviewCount: 920,
    imageUrl: '/images/technology-brands/prod-moto-g85.jpg',
    sourceUrl: 'https://www.flipkart.com/motorola-g85-5g-olive-green-128-gb/p/itm897540eb01ff1',
    brand: 'Motorola',
    unit: '1 Unit',
    aliases: [
      { term: 'moto g85', language: 'en', script: 'latin' }
    ]
  },

  // 6. NOTHING
  {
    id: 'prod-nothing-phone-2a',
    categoryId: 'cat-mobiles',
    subCategory: 'Nothing',
    name: {
      en: 'Nothing Phone (2a) Plus — 8GB/256GB, Grey',
      hi: 'नथिंग फोन (2a) प्लस (पारदर्शी डिज़ाइन और ग्लिफ लाइट)',
      or: 'ନଥିଙ୍ଗ୍ ଫୋନ୍ (2a) ପ୍ଲସ୍ 5G',
      mr: 'नथिंग फोन 2a',
      bn: 'নাথিং ফোন ২এ প্লাস',
      ta: 'நத்திங் போன் 2a',
      te: 'నథింగ్ ఫోన్ 2a',
      gu: 'નથિંગ ફોન 2a'
    },
    description: {
      en: 'Iconic transparent back with Glyph LED lighting notification interface, MediaTek Dimensity 7350 Pro, 50MP + 50MP dual cameras.',
      hi: 'पारदर्शी अनोखा डिज़ाइन, ग्लिफ लाइट्स और बिना ब्लोटवेयर का क्लीन नथिंग ओएस।',
      or: 'ପାରଦର୍ଶୀ ଆକର୍ଷଣୀୟ ଡିଜାଇନ୍ ଏବଂ ଲାଇଟ୍ ଇଣ୍ଟରଫେସ୍ ଫୋନ୍।',
      mr: 'पारदर्शक डिझाइन आणि ग्लिफ लाईट फोन.',
      bn: 'স্বচ্ছ ব্যাক প্যানেল ও আলোযুক্ত আকর্ষণীয় ফোন।',
      ta: 'புதுமையான வெளிப்படையான வடிவமைப்பு.',
      te: 'ట్రాన్స్‌పరెంట్ డిజైన్ గల నథింగ్ ఫోన్.',
      gu: 'પારદર્શક વિશિષ્ટ ડિઝાઇન વાળો સ્માર્ટફોન.'
    },
    price: 27999,
    mrp: 31999,
    stock: 45,
    rating: 4.7,
    reviewCount: 690,
    imageUrl: '/images/technology-brands/prod-nothing-phone-2a.jpg',
    sourceUrl: 'https://www.flipkart.com/nothing-phone-2a-plus-grey-256-gb/p/itm8fb343901dbbd',
    brand: 'Nothing',
    unit: '1 Unit',
    aliases: [
      { term: 'nothing phone', language: 'en', script: 'latin' },
      { term: 'glyph', language: 'en', script: 'latin' },
      { term: 'नथिंग', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-cmf-phone-1',
    categoryId: 'cat-mobiles',
    subCategory: 'Nothing',
    name: {
      en: 'CMF Phone 1 — 8GB/128GB, Blue',
      hi: 'CMF Phone 1 — 8GB/128GB, Blue',
      or: 'CMF Phone 1 — 8GB/128GB, Blue',
      mr: 'CMF Phone 1 — 8GB/128GB, Blue',
      bn: 'CMF Phone 1 — 8GB/128GB, Blue',
      ta: 'CMF Phone 1 — 8GB/128GB, Blue',
      te: 'CMF Phone 1 — 8GB/128GB, Blue',
      gu: 'CMF Phone 1 — 8GB/128GB, Blue'
    },
    description: {
      en: 'Unique modular design with swappable back covers and accessory mounting point, 120Hz Super AMOLED display, Dimensity 7300 5G processor.',
      hi: 'खुद बैक पैनल बदलने की सुविधा वाला अनोखा मॉड्यूलर फोन, सुपर एमोलेड स्क्रीन।',
      or: 'ନିଜେ କଭର ବଦଳାଇ ହେଉଥିବା ଆକର୍ଷଣୀୟ ଫୋନ୍।',
      mr: 'कव्हर बदलता येणारा मॉड्युलर फोन.',
      bn: 'নিজস্ব কাস্টমাইজেশন সুবিধা যুক্ত স্মার্টফোন।',
      ta: 'மாற்றக்கூடிய பின் அட்டை கொண்ட போன்.',
      te: 'కవర్ మార్చుకోగల వెసులుబాటు గల స్మార్ట్‌ఫోన్.',
      gu: 'કસ્ટમાઇઝ કરી શકાય તેવો સ્માર્ટફોન.'
    },
    price: 15999,
    mrp: 19999,
    stock: 60,
    rating: 4.6,
    reviewCount: 1100,
    imageUrl: '/images/technology-brands/prod-cmf-phone-1.jpg',
    sourceUrl: 'https://www.flipkart.com/cmf-nothing-phone-1-orange-128-gb/p/itmeef68c7ce70bf',
    brand: 'CMF by Nothing',
    unit: '1 Unit',
    aliases: [
      { term: 'cmf', language: 'en', script: 'latin' }
    ]
  },

  // 7. REDMI / XIAOMI
  {
    id: 'prod-redmi-note-13-pro',
    categoryId: 'cat-mobiles',
    subCategory: 'Redmi / Xiaomi',
    name: {
      en: 'Redmi Note 13 Pro 5G — 8GB/256GB, Coral Purple',
      hi: 'रेडमी नोट 13 प्रो 5G (200 मेगापिक्सल कैमरा, 1.5K एमोलेड)',
      or: 'ରେଡମି ନୋଟ୍ 13 ପ୍ରୋ 5G',
      mr: 'रेडमी नोट 13 प्रो',
      bn: 'রেডমি নোট ১৩ প্রো ৫জি',
      ta: 'ரெட்மி நோட் 13 ப்ரோ',
      te: 'రెడ్‌మి నోట్ 13 ప్రో',
      gu: 'રેડમી નોટ 13 પ્રો'
    },
    description: {
      en: 'Flagship-grade 200MP camera with in-sensor 4x lossless zoom and OIS, 1.5K 120Hz AMOLED screen, Snapdragon 7s Gen 2, and 67W Turbo Charge.',
      hi: '200 मेगापिक्सल का सुपर कैमरा, तेज 67 वाट चार्जिंग और 1.5K साफ डिस्प्ले।',
      or: '୨୦୦MP କ୍ୟାମେରା ଏବଂ ଦ୍ରୁତ ଚାର୍ଜିଂ ସହ ରେଡମି ନୋଟ୍ ଫୋନ୍।',
      mr: '200MP कॅमेरा आणि 67W टर्बो चार्जिंग.',
      bn: '২০০ মেগাপিক্সেল শক্তিশালী ক্যামেরা ফোন।',
      ta: '200MP சூப்பர் கேமரா போன்.',
      te: '200 మెగాపిక్సెల్ కెమెరా గల రెడ్‌మి ఫోన్.',
      gu: '200MP કેમેરા સાથે રેડમી ફોન.'
    },
    price: 24999,
    mrp: 28999,
    stock: 70,
    rating: 4.7,
    reviewCount: 2150,
    imageUrl: '/images/technology-brands/prod-redmi-note-13-pro.jpg',
    sourceUrl: 'https://www.flipkart.com/redmi-note-13-pro-5g-coral-purple-256-gb/p/itm0267c1add6203',
    brand: 'Redmi',
    unit: '1 Unit',
    aliases: [
      { term: 'redmi', language: 'en', script: 'latin' },
      { term: 'xiaomi', language: 'en', script: 'latin' },
      { term: 'रेडमी', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-xiaomi-14-civi',
    categoryId: 'cat-mobiles',
    subCategory: 'Redmi / Xiaomi',
    name: {
      en: 'Xiaomi 14 Civi — 8GB/256GB, Shadow Black',
      hi: 'शाओमी 14 सीवी 5G (लाइका लेंस कैमरा, डुअल सेल्फी कैमरा)',
      or: 'ଶାଓମି ୧୪ ସିଭି 5G',
      mr: 'शाओमी 14 सीवी',
      bn: 'শাওমি ১৪ সিভি ৫জি',
      ta: 'ஷாவ்மி 14 சிவி',
      te: 'షావోమి 14 సివి',
      gu: 'શાઓમી 14 સીવી'
    },
    description: {
      en: 'Co-engineered with Leica, Cinematic 50MP triple cameras, dual 32MP front portrait cameras, floating quad-curved display, Snapdragon 8s Gen 3.',
      hi: 'लाइका प्रोफेशनल कैमरे के साथ स्टूडियो जैसी फोटोग्राफी, दोनों तरफ मुड़ा हुआ डिस्प्ले।',
      or: 'ଲାଇକା ପ୍ରୋଫେସନାଲ୍ କ୍ୟାମେରା ସହ ପ୍ରିମିୟମ ଶାଓମି ଫୋନ୍।',
      mr: 'लाइका लेन्सचा उत्कृष्ट कॅमेरा फोन.',
      bn: 'লাইকা অপটিক্স যুক্ত পেশাদার ক্যামেরা ফোন।',
      ta: 'லைக்கா கேமரா கொண்ட பிரீமியம் போன்.',
      te: 'లైకా లెన్స్‌లతో స్టూడియో క్వాలిటీ ఫోటోలు తీసే ఫోన్.',
      gu: 'લાઇકા કેમેરા વાળો પ્રીમિયમ ફોન.'
    },
    price: 39999,
    mrp: 54999,
    stock: 35,
    rating: 4.8,
    reviewCount: 410,
    imageUrl: '/images/technology-brands/prod-xiaomi-14-civi.jpg',
    sourceUrl: 'https://www.flipkart.com/xiaomi-14-civi-shadow-black-256-gb/p/itm53e4149acd211',
    brand: 'Xiaomi',
    unit: '1 Unit',
    aliases: [
      { term: 'xiaomi 14', language: 'en', script: 'latin' },
      { term: 'civi', language: 'en', script: 'latin' }
    ]
  },

  // 8. VIVO & OPPO
  {
    id: 'prod-vivo-v40-pro',
    categoryId: 'cat-mobiles',
    subCategory: 'Vivo & Oppo',
    name: {
      en: 'vivo V40 Pro — 8GB/256GB, Ganges Blue',
      hi: 'वीवो V40 प्रो 5G (ज़ाइस मल्टी-फोकल पोर्ट्रेट कैमरा, 5500mAh)',
      or: 'ଭିଭୋ V40 ପ୍ରୋ 5G',
      mr: 'व्हिव्हो V40 प्रो',
      bn: 'ভিভো ভি৪০ প্রো ৫জি',
      ta: 'விவோ V40 ப்ரோ',
      te: 'వివో V40 ప్రో',
      gu: 'વીવો V40 પ્રો'
    },
    description: {
      en: 'ZEISS professional optics on all rear cameras, 50MP Sony IMX921 sensor with Aura Light portrait, IP68 water resistance, and 80W FlashCharge.',
      hi: 'ज़ाइस लेंस और औरा लाइट से शादी व पार्टियों में बेहतरीन पोर्ट्रेट फोटो खींचने वाला वीवो का फ्लैगशिप फोन।',
      or: 'ଜାଇସ୍ କ୍ୟାମେରା ଏବଂ ଅରା ଲାଇଟ୍ ସହ ଭିଭୋ ଫୋନ୍।',
      mr: 'उत्कृष्ट पोर्ट्रेट कॅमेरा असणारा व्हिव्हो फोन.',
      bn: 'অসাধারণ পোর্ট্রেট ছবির জন্য জাইস ক্যামেরা ফোন।',
      ta: 'அற்புதமான போர்ட்ரெய்ட் போட்டோ எடுக்கும் விவோ போன்.',
      te: 'పోర్ట్రెయిట్ ఫోటోల కోసం బెస్ట్ వివో ఫోన్.',
      gu: 'ઝાઇસ કેમેરા સાથે પોર્ટ્રેટ સ્માર્ટફોન.'
    },
    price: 49999,
    mrp: 54999,
    stock: 40,
    rating: 4.8,
    reviewCount: 780,
    imageUrl: '/images/technology-brands/prod-vivo-v40-pro.jpg',
    sourceUrl: 'https://www.flipkart.com/vivo-v40-pro-5g-ganges-blue-256-gb/p/itm8edd196b3ffde',
    brand: 'Vivo',
    unit: '1 Unit',
    aliases: [
      { term: 'vivo', language: 'en', script: 'latin' },
      { term: 'वीवो', language: 'hi', script: 'devanagari' }
    ]
  },
  {
    id: 'prod-oppo-reno-12-pro',
    categoryId: 'cat-mobiles',
    subCategory: 'Vivo & Oppo',
    name: {
      en: 'OPPO Reno12 Pro — 12GB/256GB, Sunset Gold',
      hi: 'ओप्पो रेनो 12 प्रो 5G (एआई फोटो इरेज़र, स्प्लैश टच स्क्रीन)',
      or: 'ଓପୋ ରେନୋ 12 ପ୍ରୋ 5G',
      mr: 'ओप्पो रेनो 12 प्रो',
      bn: 'অপ্পো রেনো ১২ প্রো ৫জি',
      ta: 'ஒப்போ ரெனோ 12 ப்ரோ',
      te: 'ఒప్పో రెనో 12 ప్రో',
      gu: 'ઓપ્પો રેનો 12 પ્રો'
    },
    description: {
      en: 'AI Eraser 2.0 to remove photo photobombers, 50MP telephoto portrait camera, quad-curved infinite view display, and 80W SUPERVOOC charging.',
      hi: 'फोटो से अनचाहे लोगों को तुरंत हटाने वाला एआई इरेज़र और खूबसूरत 3D कर्व्ड स्क्रीन वाला ओप्पो फोन।',
      or: 'AI ଫଟୋ ଏଡିଟିଂ ଏବଂ ସୁନ୍ଦର କର୍ଭଡ୍ ସ୍କ୍ରିନ୍ ସହ ଓପୋ ଫୋନ୍।',
      mr: 'AI फोटो इरेझर आणि सुंदर डिझाइन फोन.',
      bn: 'এআই এডিটিং এবং নিখুঁত ক্যামেরার স্মার্টফোন।',
      ta: 'AI வசதி கொண்ட ஸ்டைலான ஒப்போ போன்.',
      te: 'AI ఫోటో ఎరేజర్‌తో వచ్చే అందమైన ఒప్పో ఫోన్.',
      gu: 'AI ફોટો એડિટર સાથે ઓપ્પો સ્માર્ટફોન.'
    },
    price: 36999,
    mrp: 41999,
    stock: 50,
    rating: 4.7,
    reviewCount: 650,
    imageUrl: '/images/technology-brands/prod-oppo-reno-12-pro.jpg',
    sourceUrl: 'https://www.flipkart.com/oppo-reno-12-pro-space-brown-256-gb/p/itmfdf8a32440331',
    brand: 'Oppo',
    unit: '1 Unit',
    aliases: [
      { term: 'oppo', language: 'en', script: 'latin' },
      { term: 'reno', language: 'en', script: 'latin' },
      { term: 'ओप्पो', language: 'hi', script: 'devanagari' }
    ]
  }
];
