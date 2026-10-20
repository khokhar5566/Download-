import { Scene, VoiceOption } from '../types/documentary.ts';

export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Male',
    description: 'Deep, resonant, authoritative baritone voice. Majestic and commanding.',
    recommendedFor: 'Epic historical and economic documentaries (Recommended)',
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Male',
    description: 'Solemn, grounded, mature narration with profound depth.',
    recommendedFor: 'Historical reflection, Sheikh Zayed era',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Male',
    description: 'Dynamic, intense, and sharp cadence.',
    recommendedFor: 'Fast-paced aviation, AI, and trade growth sections',
  },
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Female',
    description: 'Warm, poised, articulate storytelling voice.',
    recommendedFor: 'Inspiring narratives, cultural transformation & future vision',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Female',
    description: 'Clear, modern, engaging journalistic style.',
    recommendedFor: 'Economic breakdown and global business analysis',
  },
];

export const INITIAL_SCENES: Scene[] = [
  {
    id: 1,
    titleUrdu: 'منظر 1: خالی صحرا اور موتیوں کی تلاش (70 سال پہلے)',
    titleEnglish: 'Scene 1: The Empty Desert & Pearl Divers (70 Years Ago)',
    urduScript:
      'سوچیں، 70 سال پہلے یہاں کچھ بھی نہیں تھا۔ صرف ریت، سمندر، اور موتیوں کی تلاش میں نکلنے والے چند لوگ۔ کیا آپ سوچ سکتے ہیں کہ یہ خالی صحرا ایک دن دنیا کی معیشت کا مرکز بن جائے گا؟',
    englishTranslation:
      'Imagine, 70 years ago there was nothing here. Only sand, the sea, and a few people venturing out in search of pearls. Could you ever imagine that this empty desert would one day become the center of the world economy?',
    visualCue:
      'Cinematic slow pan across vast wind-swept golden desert dunes. Fade into vintage archival footage of traditional wooden dhows and Emirati pearl divers plunging into the Arabian Gulf with nose clips and rope baskets.',
    soundEffect:
      'Desert wind howling gently, transitioning to tranquil ocean waves and splashing water.',
    estimatedDurationSec: 16,
  },
  {
    id: 2,
    titleUrdu: 'منظر 2: سیاہ سونے کی دریافت اور پہلا برآمدی جہاز (1958 - 1962)',
    titleEnglish: 'Scene 2: Discovery of Black Gold & The First Tanker (1958 - 1962)',
    urduScript:
      'پھر 1958 میں، زمین نے اپنا راز کھولا۔ ابوظہبی میں باب-2 اور اُم شیف کے مقامات پر تیل کے بڑے ذخائر دریافت ہوئے۔ یہ سیاہ سونا صرف تیل نہیں تھا، یہ مستقبل تھا۔ 1962 میں، تیل سے بھرا پہلا تجارتی جہاز ابوظہبی سے روانہ ہوا۔ دنیا نے پہلی بار اس چھوٹے سے علاقے پر توجہ دی۔',
    englishTranslation:
      'Then in 1958, the earth revealed its secret. Massive oil reserves were discovered at Bab-2 and Umm Shaif in Abu Dhabi. This black gold was not just oil—it was the future. In 1962, the first commercial tanker filled with oil departed from Abu Dhabi. For the first time, the world turned its gaze toward this small region.',
    visualCue:
      'Historical sepia footage of early seismic testing, drilling rigs rising from desert sands, black oil gushing forth, and the historic oil tanker "British Signal" loading crude at Das Island in 1962.',
    soundEffect:
      'Mechanical thumping of early oil drills, siren chime, ship horn echoing across the open ocean.',
    estimatedDurationSec: 22,
  },
  {
    id: 3,
    titleUrdu: 'منظر 3: اتحاد کی طاقت اور قوم کی تعمیر (1971)',
    titleEnglish: 'Scene 3: The Power of Union & Nation Building (1971)',
    urduScript:
      '2 دسمبر 1971۔ سات ریاستوں نے مل کر ایک خواب دیکھا — متحدہ عرب امارات، یعنی یو اے ای۔ شیخ زاید نے ثابت کیا کہ اتحاد میں طاقت ہے۔ اور یہیں یو اے ای نے دنیا سے ہٹ کر ایک فیصلہ کیا۔ تیل کی دولت محلات پر نہیں، بلکہ سڑکوں، اسکولوں، اسپتالوں اور بجلی کے نظام پر خرچ کی۔',
    englishTranslation:
      'December 2, 1971. Seven emirates dreamt a shared dream—the United Arab Emirates, UAE. Sheikh Zayed proved that in unity lies strength. And right here, the UAE made a decision contrary to the rest of the world: oil wealth was not lavished on palaces, but invested into roads, schools, hospitals, and power grids.',
    visualCue:
      'Archival footage of the historic signing ceremony at Union House Dubai, raising the first UAE four-color flag. Close-up portraits of founding father Sheikh Zayed bin Sultan Al Nahyan inspecting early school classrooms and public infrastructure.',
    soundEffect:
      'Solemn, majestic orchestral strings building up with inspiring brass swells.',
    estimatedDurationSec: 24,
  },
  {
    id: 4,
    titleUrdu: 'منظر 4: جبل علی بندرگاہ اور جافزا فری زون (1979)',
    titleEnglish: 'Scene 4: Jebel Ali Port & JAFZA Free Zone (1979)',
    urduScript:
      'دبئی کے پاس تیل کم تھا۔ 1966 میں تیل دریافت ہوا، لیکن شیخ راشد جانتے تھے کہ یہ دولت ہمیشہ نہیں رہے گی۔ اسی لیے انہوں نے 1980 کی دہائی میں ہی مستقبل کے بارے میں سوچنا شروع کر دیا۔ 1979 میں جبل علی بندرگاہ کی تعمیر شروع ہوئی۔ یہ دنیا کی بڑی مصنوعی بندرگاہوں میں سے ایک بن گئی۔ صحرا کے درمیان سمندر کو تجارت کا راستہ بنا دیا گیا۔ آج یہ بندرگاہ لاکھوں کنٹینرز کی نقل و حرکت میں اہم کردار ادا کرتی ہے۔ جافزا — جبل علی فری زون۔ یہاں کمپنیوں کو مکمل غیر ملکی ملکیت اور کاروبار کے لیے عالمی منڈیوں تک رسائی جیسے مواقع ملے۔ ہزاروں کمپنیوں نے یہاں اپنے کاروبار قائم کیے۔',
    englishTranslation:
      'Dubai had limited oil. Oil was struck in 1966, but Sheikh Rashid knew this wealth would not last forever. Thus, already by the 1980s, he began planning for the future. In 1979, construction of Jebel Ali Port began, becoming one of the world’s largest man-made harbors. In the midst of the desert, the sea became a gateway for world trade. Today, this port moves millions of shipping containers. JAFZA—Jebel Ali Free Zone offered 100% foreign ownership and direct access to global markets. Thousands of multinational corporations established their hubs here.',
    visualCue:
      'Dredging machinery carving the deep-water harbor out of coastal bedrock; transition to hyper-lapse drone shots of towering automated gantry cranes moving thousands of colorful shipping containers.',
    soundEffect:
      'Industrial machinery hum, deep ship foghorns, bustling international logistics ambience.',
    estimatedDurationSec: 38,
  },
  {
    id: 5,
    titleUrdu: 'منظر 5: ایمریٹس ایئرلائن اور ہوا بازی کا عالمی مرکز (1985)',
    titleEnglish: 'Scene 5: Emirates Airline & The Global Aviation Hub (1985)',
    urduScript:
      '1985 میں صرف دو طیاروں کے ساتھ ایمریٹس ایئرلائن کا آغاز ہوا۔ آج دبئی انٹرنیشنل ایئرپورٹ دنیا کے مصروف ترین بین الاقوامی ہوائی اڈوں میں شمار ہوتا ہے، جہاں ہر سال کروڑوں مسافر سفر کرتے ہیں۔ آج ہوا بازی کا شعبہ دبئی کی معیشت میں اہم کردار ادا کرتا ہے۔ یہ صرف ایک ایئرلائن کی کامیابی نہیں، بلکہ ایک پوری معاشی صنعت کی کہانی ہے۔',
    englishTranslation:
      'In 1985, Emirates Airline took off with just two leased aircraft. Today, Dubai International Airport ranks among the busiest international passenger airports on Earth, welcoming tens of millions of travelers every year. Aviation now forms a cornerstone of Dubai’s GDP. This isn’t merely the success of an airline, but the genesis of an entire economic ecosystem.',
    visualCue:
      'Vintage Boeing 737 take-off in 1985, morphing seamlessly into modern Emirates Airbus A380s gliding over Dubai illuminated skyline, followed by bustling inside shots of Terminal 3 concourse with travelers from every continent.',
    soundEffect:
      'Turbine jet engine spooling up to full thrust, airport flight announcer chime.',
    estimatedDurationSec: 28,
  },
  {
    id: 6,
    titleUrdu: 'منظر 6: سیاحت اور آئیکونک تعمیرات: برج العرب، پام اور برج خلیفہ',
    titleEnglish: 'Scene 6: Tourism & Architectural Marvels: Burj Al Arab to Burj Khalifa',
    urduScript:
      'پھر انہوں نے ریت کو سیاحت اور سرمایہ کاری کے مواقع میں بدلنا شروع کیا۔ برج العرب، پام جمیرہ اور برج خلیفہ۔ دنیا کو ایک نیا خواب دکھایا گیا۔ دبئی مال اور گولڈ سوق۔ تھوک اور پرچون کی تجارت آج بھی دبئی کی غیر تیل معیشت کا ایک اہم حصہ ہے۔ یہاں سے سامان ایشیا، افریقہ اور یورپ تک پہنچتا ہے۔',
    englishTranslation:
      'Then they began transforming desert sand into magnets for tourism and global investment. Burj Al Arab, Palm Jumeirah, and the soaring Burj Khalifa—the world was introduced to an audacious new dream. Dubai Mall and the legendary Gold Souk: wholesale and retail trade remain pivotal pillars of Dubai’s non-oil economy, distributing goods across Asia, Africa, and Europe.',
    visualCue:
      'Aerial sunlit sweep of Burj Al Arab like a sail on water; satellite zoom into the Palm Jumeirah archipelago; vertigo-inducing slow tilt up the 828-meter Burj Khalifa touching clouds; bustling Gold Souk sparkle.',
    soundEffect:
      'Cinematic orchestral crescendo, subtle crowd murmur and glistening sound design.',
    estimatedDurationSec: 27,
  },
  {
    id: 7,
    titleUrdu: 'منظر 7: خودمختار دولت فنڈز اور 95 فیصد غیر تیل معیشت',
    titleEnglish: 'Scene 7: Sovereign Wealth Funds & Over 95% Non-Oil Economy',
    urduScript:
      'ابوظہبی نے اے ڈی آئی اے، مبادلہ اور اے ڈی کیو جیسے خودمختار سرمایہ کاری فنڈز قائم کیے۔ دبئی نے ڈی آئی ایف سی کے ذریعے عالمی مالیاتی شعبے کو فروغ دیا۔ آج ان اداروں کی سرمایہ کاری دنیا بھر میں پھیلی ہوئی ہے۔ نتیجہ؟ آج دبئی کی معیشت کا 95 فیصد سے زیادہ حصہ تیل کے علاوہ دیگر شعبوں سے آتا ہے۔ یہ صحرا میں تعمیر کی گئی ایک متنوع معیشت ہے۔',
    englishTranslation:
      'Abu Dhabi established premier sovereign wealth funds including ADIA, Mubadala, and ADQ. Dubai cultivated a global financial nexus through the Dubai International Financial Centre (DIFC). Today, their strategic assets span every continent. The result? Over 95% of Dubai’s economy today stems from sectors outside of oil. A diversified powerhouse built upon desert sands.',
    visualCue:
      'Graphic overlay of global financial maps showing UAE sovereign investments in clean energy, semiconductors, aerospace, and DIFC’s gate building with glowing financial tickers and glass skyscrapers.',
    soundEffect:
      'Digital high-tech pulses, fast data tickers, crisp modern electronic cadence.',
    estimatedDurationSec: 26,
  },
  {
    id: 8,
    titleUrdu: 'منظر 8: انسانوں پر سرمایہ کاری اور پائیدار توانائی: مسدر سٹی',
    titleEnglish: 'Scene 8: Investing in Human Capital & Clean Energy: Masdar City',
    urduScript:
      'شیخ زاید کا نظریہ تھا کہ جو قوم اپنے ماضی کو یاد رکھتی ہے، وہ اپنا مستقبل بھی بنا سکتی ہے۔ اسی لیے انہوں نے انسانوں کی ترقی پر سرمایہ کاری کی۔ صرف ایک نسل کے اندر، کچی سڑکوں سے بارہ لین والی شاہراہوں تک، خیموں سے جدید شہروں تک کا سفر طے ہوا۔ بجلی، پانی اور انٹرنیٹ جیسی سہولتیں زندگی کا حصہ بن گئیں۔ ابوظہبی جانتا ہے کہ تیل ہمیشہ نہیں رہے گا۔ اسی لیے مسدر سٹی جیسے منصوبے شروع کیے گئے، جہاں پائیدار ترقی اور صاف توانائی کو ترجیح دی جاتی ہے۔ یہ تیل کے بعد کے مستقبل کی تیاری ہے۔',
    englishTranslation:
      'Sheikh Zayed believed that a nation that honors its past can forge an extraordinary future. That is why they invested first and foremost in human development. Within a single generation, the nation leaped from dirt tracks to 12-lane superhighways, from nomadic tents to futuristic metropolises. Abu Dhabi knows oil will not last forever—which is why pioneering projects like Masdar City were initiated, prioritizing sustainability and clean energy in preparation for a post-oil world.',
    visualCue:
      'Split screen contrast: early desert trails vs glowing Sheikh Zayed Road at night; cutting to Masdar City’s zero-carbon architecture, solar panel fields, and autonomous PRT pods.',
    soundEffect:
      'Warm ambient pads, soft wind chime, optimistic futuristic synth swells.',
    estimatedDurationSec: 32,
  },
  {
    id: 9,
    titleUrdu: 'منظر 9: سلیکون، مصنوعی ذہانت اور ٹیکنالوجی کی لیبارٹری',
    titleEnglish: 'Scene 9: Silicon, Artificial Intelligence & The Tech Laboratory',
    urduScript:
      'آج متحدہ عرب امارات مصنوعی ذہانت کے شعبے میں بھی نمایاں مقام حاصل کرنے کی کوشش کر رہا ہے۔ دبئی میں کرپٹو اور ڈیجیٹل معیشت، جبکہ ابوظہبی میں جدید ٹیکنالوجی اور سیمی کنڈکٹرز سے متعلق سرمایہ کاری کے امکانات پر کام ہو رہا ہے۔ پورا ملک ایک بڑی ٹیکنالوجی لیبارٹری بنتا جا رہا ہے۔ نقل و حمل اور لاجسٹکس کے شعبے میں ترقی کی بڑی گنجائش ہے۔ اس کی ایک اہم وجہ جغرافیائی محلِ وقوع ہے۔ یہاں سے تقریباً آٹھ گھنٹے کی پرواز میں دنیا کی آبادی کے ایک بڑے حصے تک پہنچا جا سکتا ہے۔ آج متحدہ عرب امارات کی مجموعی معیشت میں تیل کے علاوہ دیگر شعبوں کا حصہ بہت اہم ہو چکا ہے۔ معاشی تنوع اب صرف ایک خواب نہیں، بلکہ ایک عملی حقیقت ہے۔ تیل اب بھی موجود ہے۔ لیکن اب اسے مستقبل کی ضمانت سمجھا جاتا ہے، پوری معیشت کا واحد انجن نہیں۔ دنیا کے تیل اور گیس کے بڑے ذخائر میں متحدہ عرب امارات کا بھی اہم حصہ ہے، لیکن اب توجہ ان وسائل کو دانش مندی سے استعمال کرنے پر ہے۔',
    englishTranslation:
      'Today, the UAE is claiming a prominent position in Artificial Intelligence. Dubai champions digital economy and Web3, while Abu Dhabi spearheads advanced tech and semiconductor investments through vehicles like MGX. The entire nation is evolving into a giant technology laboratory. Bolstered by its strategic geography—where an 8-hour flight reaches two-thirds of the human population—economic diversification is no longer an aspiration; it is an undeniable reality. Oil remains, but as a safeguard, not the sole engine.',
    visualCue:
      'B-roll of UAE AI summits, supercomputing data racks, autonomous flying taxi trials over Dubai Marina, and world globe projection highlighting Dubai’s 8-hour flight radius covering Asia, Europe, and Africa.',
    soundEffect:
      'Pulsing synthetic rhythm, electronic data streams, cutting-edge cinematic tension.',
    estimatedDurationSec: 42,
  },
  {
    id: 10,
    titleUrdu: 'منظر 10: وژن، سرمایہ کاری اور ہمت — ’’وی دی یو اے ای 2031‘‘ اور اختتام',
    titleEnglish: 'Scene 10: Vision, Investment & Courage — "We The UAE 2031" & Finale',
    urduScript:
      'ورلڈ ایکسپو 2020، فارمولا ون اور کوپ 28۔ متحدہ عرب امارات نے دنیا کے بڑے عالمی ایونٹس کو اپنے صحرا میں جگہ دی، اور دنیا بھر سے لوگ یہاں آنے لگے۔ سمندر میں مصنوعی جزیرے؟ کیوں نہیں! پام جمیرہ اور ورلڈ آئی لینڈز جیسے منصوبوں کے ذریعے ناممکن دکھائی دینے والے خوابوں کو حقیقت میں بدلنے کی کوشش کی گئی، جس سے عالمی سرمایہ کاروں کی توجہ بھی حاصل ہوئی۔ یہاں 200 سے زیادہ قومیتوں کے لوگ رہتے ہیں۔ دنیا بھر سے ہنرمند افراد یہاں آتے ہیں، کیونکہ انہیں کاروباری مواقع، نسبتاً محفوظ ماحول اور مستقبل کے لیے ایک واضح وژن نظر آتا ہے۔ لیکن یہ سفر آسان نہیں تھا۔ تیل کی قیمتوں میں اتار چڑھاؤ اور عالمی معاشی بحرانوں نے کئی چیلنجز پیدا کیے۔ تاہم، ان مشکلات نے متحدہ عرب امارات کو اپنی معیشت کو مزید متنوع بنانے کی اہمیت بھی سمجھائی۔ اب اگلا ہدف ہے — ’’وی دی یو اے ای 2031‘‘۔ غیر تیل تجارت کو بڑھانا، معیشت کو مزید وسعت دینا اور ملک کو عالمی سطح پر ایک مضبوط معاشی طاقت بنانا۔ تو متحدہ عرب امارات نے صحرا میں معیشت کیسے بنائی؟ تین چیزوں کی مدد سے: وژن — جو تیل سے آگے کا مستقبل دیکھ سکے۔ سرمایہ کاری — جو انسانوں اور ان کی صلاحیتوں پر کی جائے۔ ہمت — جو بڑے فیصلے کرنے اور خطرات مول لینے کا حوصلہ دے۔ آج یہ صرف صحرا نہیں، بلکہ دنیا کا ایک اہم تجارتی مرکز ہے۔ ایک ایسا مقام جہاں مشرق، مغرب سے ملتا ہے، اور جہاں خواب حقیقت کا روپ دھارتے ہیں۔ اگر ایک صحرا چند دہائیوں میں عالمی معیشت کا اہم مرکز بن سکتا ہے، تو ہم اپنے وسائل کو استعمال کرکے کیا کچھ کر سکتے ہیں؟ یہ تھی صحرا سے سلیکون تک کے سفر کی کہانی۔ اگر یہ کہانی آپ کو متاثر کن لگی، تو ویڈیو کو لائک کریں، اپنے دوستوں کے ساتھ شیئر کریں، اور مزید ایسی دلچسپ ڈاکیومنٹریز دیکھنے کے لیے ہمارے چینل کو سبسکرائب کرنا نہ بھولیں۔',
    englishTranslation:
      'World Expo 2020, Formula 1, and COP28—the UAE welcomed the world’s grandest events to its desert. Over 200 nationalities co-exist here in safety and prosperity. The road was never free of adversity, yet every crisis deepened their resolve to diversify. Now the horizon points to "We The UAE 2031". How was an economy carved from the desert? Through three pillars: Vision to look beyond oil; Investment into people; and Courage to make bold decisions. Today, where East meets West, dreams become reality. If a desert can become the fulcrum of global commerce in a few decades, what could we achieve with our own resources? This was the journey from Desert to Silicon. If you found this inspiring, like, share, and subscribe for more compelling documentaries.',
    visualCue:
      'Grand montage: Expo 2020 Al Wasl dome lighting up, Yas Marina F1 race at night, Burj Khalifa fireworks, multicultural youth collaborating in tech labs, culminating in golden sunset over the desert skyline with the We The UAE 2031 emblem.',
    soundEffect:
      'Full cinematic emotional climax, triumphant orchestral brass, choir, and gentle fading piano note.',
    estimatedDurationSec: 58,
  },
];
