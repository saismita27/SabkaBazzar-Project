import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-electronics',
    slug: 'electronics',
    icon: 'Laptop',
    name: {
      en: 'Electronics',
      hi: 'इलेक्ट्रॉनिक्स',
      or: 'ଇଲେକ୍ଟ୍ରୋନିକ୍ସ',
      mr: 'इलेक्ट्रॉनिक्स',
      bn: 'ইলেকট্রনিক্স',
      ta: 'மின்னணுவியல்',
      te: 'ఎలక్ట్రానిక్స్',
      gu: 'ઇલેક્ટ્રોનિક્સ'
    },
    subcategories: [
      'Laptops',
      'Desktop & CPU',
      'AIO & Tower PC',
      'Tablets',
      'Mobile Covers',
      'Desktop Accessories',
      'Power Bank',
      'Gaming',
      'Healthcare',
      'Networking',
      'Earbuds'
    ]
  },
  {
    id: 'cat-fashion',
    slug: 'fashion',
    icon: 'Shirt',
    name: {
      en: 'Fashion',
      hi: 'फैशन और वस्त्र',
      or: 'ଫ୍ୟାଶନ ଓ ପୋଷାକ',
      mr: 'फॅशन',
      bn: 'ফ্যাশন',
      ta: 'ஃபேஷன்',
      te: 'ఫ్యాషన్',
      gu: 'ફેશન'
    },
    subcategories: [
      "Men's Tshirts & Tees",
      "Men's Kurtas",
      "Men's Jeans & Cargos",
      "Men's Tracks & Jackets",
      "Men's Watches, Belts & Wallets",
      "Men's Jewellery & Teen Styles",
      "Women's Ethnic Sets & Kurtis",
      "Women's Sarees & Blouses",
      "Women's Lehenga Cholis",
      "Women's Dresses & Tops",
      "Women's Jeans & Night Suits",
      "Women's Jewellery, Earrings & Watches",
      "Women's Handbags & Sunglasses",
      "Kids (0-2 Years)",
      "Kids (2-6 Years)",
      "Kids (6-10 Years)",
      "Kids (11-16 Years)"
    ]
  },
  {
    id: 'cat-grocery',
    slug: 'grocery',
    icon: 'Utensils',
    name: {
      en: 'Grocery, Food & Healthcare',
      hi: 'किराना, खाद्य और स्वास्थ्य',
      or: 'ରାସନ, ଖାଦ୍ୟ ଓ ସ୍ୱାସ୍ଥ୍ୟ',
      mr: 'किराणा, खाद्य आणि आरोग्य',
      bn: 'মুদি, খাদ্য ও স্বাস্থ্য',
      ta: 'மளிகை, உணவு மற்றும் சுகாதாரம்',
      te: 'కిరాణా, ఆహారం & ఆరోగ్యం',
      gu: 'કરિયાણું, ખાદ્ય અને આરોગ્ય'
    },
    subcategories: [
      'Spices & Condiments',
      'Flours & Grains',
      'Cooking Oils & Ghee',
      'Dry Fruits',
      'Chocolates & Sweets',
      'Preserved Foods & Pickles',
      'Hot Brews & Teas',
      'Edible Seeds',
      'Healthy Drinks',
      'Proteins & Nutrition',
      'Vitamins & Health',
      'Household Cleaning',
      'Emergency First Aid & Medical'
    ]
  },
  {
    id: 'cat-shoes',
    slug: 'shoes',
    icon: 'Footprints',
    name: {
      en: 'Shoes & Sandals',
      hi: 'जूते और चप्पल',
      or: 'ଜୋତା ଓ ଚପଲ',
      mr: 'पादत्राणे',
      bn: 'জুতো ও চটি',
      ta: 'காலணிகள்',
      te: 'పాదరక్షలు',
      gu: 'પગરખાં'
    },
    subcategories: [
      "Men's Casuals & Sneakers",
      "Men's Formals",
      "Men's Sandals & Sliders",
      "Men's Socks",
      "Women's Flats & Mojaris",
      "Women's Heels",
      "Women's Walking Shoes & Sliders",
      "Kids Boys Shoes"
    ]
  },
  {
    id: 'cat-mobiles',
    slug: 'mobiles',
    icon: 'Smartphone',
    name: {
      en: 'Mobiles',
      hi: 'मोबाइल फोन',
      or: 'ମୋବାଇଲ ଫୋନ',
      mr: 'मोबाईल्स',
      bn: 'মোবাইল',
      ta: 'மொபைல் போன்கள்',
      te: 'మొబైల్ ఫోన్లు',
      gu: 'મોબાઈલ'
    },
    subcategories: ['Apple iPhone', 'Samsung Galaxy', 'Realme', 'Google Pixel', 'Motorola', 'Nothing', 'Redmi / Xiaomi', 'Vivo & Oppo']
  },
  {
    id: 'cat-gadgets',
    slug: 'gadgets',
    icon: 'Watch',
    name: {
      en: 'Smart Gadgets',
      hi: 'स्मार्ट गैजेट्स',
      or: 'ସ୍ମାର୍ଟ ଗ୍ୟାଜେଟ୍ସ',
      mr: 'स्मार्ट गॅजेट्स',
      bn: 'স্মার্ট গ্যাজেট',
      ta: 'ஸ்மார்ட் கேஜெட்டுகள்',
      te: 'స్మార్ట్ గాడ్జెట్లు',
      gu: 'સ્માર્ટ ગેજેટ્સ'
    },
    subcategories: ['Fitbit & Fitness Bands', 'AirPods & TWS', 'Bluetooth SoundBars', 'Neckbands', 'Smart Health Rings', 'Smart Speakers']
  },
  {
    id: 'cat-home',
    slug: 'home',
    icon: 'Home',
    name: {
      en: 'Home & Kitchen',
      hi: 'घर और रसोई',
      or: 'ଘର ଓ ରୋଷେଇ',
      mr: 'घर आणि स्वयंपाकघर',
      bn: 'গৃহ ও রান্নাঘর',
      ta: 'வீடு & சமையலறை',
      te: 'ఇల్లు & వంటగది',
      gu: 'ઘર અને રસોડું'
    },
    subcategories: ['Gas Stoves & Cookware', 'Bedsheets & Curtains', 'Kitchen Storage', 'Dinner Sets', 'Blankets & Mattresses', 'Wall Clocks & Decor']
  },
  {
    id: 'cat-beauty',
    slug: 'beauty',
    icon: 'Sparkles',
    name: {
      en: 'Beauty & Personal Care',
      hi: 'सौंदर्य और व्यक्तिगत देखभाल',
      or: 'ସୌନ୍ଦର୍ଯ୍ୟ ଓ ବ୍ୟକ୍ତିଗତ ଯତ୍ନ',
      mr: 'सौंदर्य प्रसाधने',
      bn: 'সৌন্দর্য ও যত্ন',
      ta: 'அழகு சாதனங்கள்',
      te: 'సౌందర్య ఉత్పత్తులు',
      gu: 'સૌંદર્ય અને વ્યક્તિગત સંભાળ'
    },
    subcategories: ['Sunscreen & Derma', 'Face Wash & Creams', 'Herbal Shampoos', 'Lipsticks & Kajal', 'Shaving Essentials', 'Oral Care', 'Bath & Shower']
  },
  {
    id: 'cat-baby',
    slug: 'baby',
    icon: 'Baby',
    name: {
      en: 'Toys & Baby Care',
      hi: 'खिलौने और शिशु देखभाल',
      or: 'ଖେଳନା ଓ ଶିଶୁ ଯତ୍ନ',
      mr: 'खेळणी आणि बाळ संगोपन',
      bn: 'খেলনা ও শিশুর যত্ন',
      ta: 'பொம்மைகள் & குழந்தை பராமரிப்பு',
      te: 'బొమ్మలు & పిల్లల సంరక్షణ',
      gu: 'રમકડાં અને બાળ સંભાળ'
    },
    subcategories: ['Diapers & Wipes', 'Baby Skin Care', 'Soft Floppy Towels', 'Educational Wooden Toys', 'Board Games', 'School Backpacks & Stationery']
  },
  {
    id: 'cat-sports',
    slug: 'sports',
    icon: 'Activity',
    name: {
      en: 'Sports & Fitness',
      hi: 'खेल और फिटनेस',
      or: 'ଖେଳ ଓ ଫିଟନେସ',
      mr: 'खेळ आणि तंदुरुस्ती',
      bn: 'খেলাধুলা ও ফিটনেস',
      ta: 'விளையாட்டு & உடற்தகுதி',
      te: 'క్రీడలు & ఫిట్నెస్',
      gu: 'રમતો અને ફિટનેસ'
    },
    subcategories: ['Whey Protein & Nutrition', 'Cricket Bats & Gear', 'Badminton Rackets', 'Yoga Mats', 'Exercise Cycles & Dumbbells', 'Camping & Outdoor']
  },
  {
    id: 'cat-furniture',
    slug: 'furniture',
    icon: 'Armchair',
    name: {
      en: 'Furniture',
      hi: 'फर्नीचर',
      or: 'ଆସବାବପତ୍ର (ଫର୍ଣ୍ଣିଚର)',
      mr: 'फर्निचर',
      bn: 'আসবাবপত্র',
      ta: 'மரச்சாமான்கள்',
      te: 'ఫర్నిచర్',
      gu: 'ફર્નિચર'
    },
    subcategories: ['Solid Wood Beds', 'Wardrobes', 'Ergonomic Study Chairs', 'Dining Tables', 'Recliners & Sofas', 'TV Entertainment Units']
  },
  {
    id: 'cat-pets',
    slug: 'pets',
    icon: 'Cat',
    name: {
      en: 'Pet Store',
      hi: 'पालतू जानवरों की दुकान',
      or: 'ପୋଷା ଜନ୍ତୁ ସାମଗ୍ରୀ',
      mr: 'पाळीव प्राणी स्टोअर',
      bn: 'পোষা প্রাণীর পণ্য',
      ta: 'செல்லப்பிராணிகள் கடை',
      te: 'పెంపుడు జంతువుల దుకాణం',
      gu: 'પાલતુ પ્રાણીઓની દુકાન'
    },
    subcategories: ['Dog Food & Treats', 'Cat Food & Toys', 'Bird Food & Feeders', 'Aquarium Care & Fish Food', 'Grooming Shampoos']
  }
];
