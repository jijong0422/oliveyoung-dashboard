/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category } from "./types";
import { preprocessProduct, getPriceForProductName } from "./utils/productMapper";

export const CATEGORIES: Category[] = [
  { id: "all", name: "전체" },
  { id: "skincare", name: "스킨케어" },
  { id: "maskpack", name: "마스크팩" },
  { id: "cleansing", name: "클렌징" },
  { id: "suncare", name: "선케어" },
  { id: "makeup", name: "메이크업" },
  { id: "dermo_cosmetics", name: "더모 코스메틱" },
  { id: "haircare", name: "헤어케어" },
  { id: "bodycare", name: "바디케어" },
  { id: "health_food", name: "건강식품" }
];

// Real K-Beauty Brands (10 Core Categories)
const BRANDS = {
  all: [
    "아누아 (Anua)", "토리든 (Torriden)", "라운드랩 (Round Lab)", "메디힐 (Mediheal)",
    "달바 (d'Alba)", "어노브 (UNOVE)", "클리오 (Clio)", "롬앤 (Romand)", "오소몰 (Orthomol)"
  ],
  skincare: [
    "아누아 (Anua)", "토리든 (Torriden)", "라운드랩 (Round Lab)",
    "달바 (d'Alba)", "아이소이 (isoi)", "에스트라 (AESTURA)", "한율 (Hanyul)",
    "마녀공장 (Manyo)", "구달 (Goodal)", "피지오겔 (Physiogel)", "코스알엑스 (COSRX)"
  ],
  maskpack: [
    "메디힐 (Mediheal)", "아비브 (Abib)", "토리든 (Torriden)", "넘버즈인 (numbuzin)",
    "드림웍스 (Dreamworks)", "다자연 (All Natural)", "메디앤서 (MediAnswer)"
  ],
  cleansing: [
    "마녀공장 (Manyo)", "바닐라코 (BANILA CO)", "아리얼 (Ariul)", "바이오더마 (Bioderma)",
    "폰즈 (Pond's)", "한율 (Hanyul)", "메디필 (MEDI-PEEL)"
  ],
  suncare: [
    "라운드랩 (Round Lab)", "조선미녀 (Beauty of Joseon)", "식물나라 (Shingmulnara)",
    "셀퓨전씨 (Cell Fusion C)", "닥터지 (Dr.G)", "달바 (d'Alba)", "아넷사 (ANESSA)"
  ],
  makeup: [
    "롬앤 (Romand)", "클리오 (Clio)", "페리페라 (Peripera)", "에스쁘아 (Espoir)",
    "헤라 (HERA)", "뮤드 (mude)", "투쿨포스쿨 (Too Cool For School)", "웨이크메이크 (Wakemake)"
  ],
  dermo_cosmetics: [
    "라로슈포제 (La Roche-Posay)", "아벤느 (Avene)", "바이오더마 (Bioderma)",
    "유리아쥬 (Uriage)", "피지오겔 (Physiogel)", "닥터자르트 (Dr.Jart+)"
  ],
  haircare: [
    "어노브 (UNOVE)", "모레모 (Moremo)", "미쟝센 (Mise-en-scene)",
    "라보에이치 (LABO-H)", "닥터포헤어 (Dr.FORHAIR)", "그로우어스 (GROWUS)"
  ],
  bodycare: [
    "일리윤 (Illiyoon)", "세타필 (Cetaphil)", "더바디샵 (The Body Shop)",
    "온더바디 (On The Body)", "해피바스 (Happy Bath)", "더프트앤도프트 (Duft & Doft)"
  ],
  health_food: [
    "정관장 (CheongKwanJang)", "락토핏 (Lacto-Fit)", "고려은단 (Koryo Eundan)",
    "오소몰 (Orthomol)", "씨제이웰케어 (CJ Wellcare)", "비비랩 (BBLAB)"
  ]
};

// Item templates for realism (10 Core Categories)
const TEMPLATES: Record<string, string[]> = {
  all: [
    "다이브인 저분자 히알루론산 세럼", "자작나무 수분 선크림", "어성초 77% 진정 토너",
    "킬커버 더 뉴 파운웨어 쿠션", "딥 데미지 트리트먼트 EX", "이뮨 멀티비타민",
    "티트리 에센셜 마스크팩", "아토베리어365 크림"
  ],
  skincare: [
    "어성초 77% 진정 토너", "다이브인 저분자 히알루론산 세럼", "독도 토너",
    "화이트 트러플 퍼스트 스프레이 세럼", "잡티 세럼", "아토베리어365 크림",
    "비피다 바이옴 앰플", "레티놀 시카 흔적 앰플"
  ],
  maskpack: [
    "티트리 에센셜 마스크팩", "어성초 껌딱지 시트 마스크", "다이브인 저분자 히알루론산 마스크팩",
    "콜라겐 겔 마스크", "슈렉팩 모공 수축 팩", "마데카소사이드 흔적 패드", "어성초 진정 패드"
  ],
  cleansing: [
    "퓨어 클렌징 오일", "클린 잇 제로 클렌징 밤", "스트레스 릴리프 립앤아이 리무버",
    "센시비오 H2O 클렌징워터", "쏙 클렌징 폼", "쑥 진정 클렌징 워터", "허브 클렌징 오일"
  ],
  suncare: [
    "자작나무 수분 선크림", "유기농 맑은 선크림", "산소수 톤업 선 쿠션",
    "레이저 썬스크린", "그린 마일드 업 선 플러스", "워터풀 에센스 선크림", "선스틱 레포츠"
  ],
  makeup: [
    "쥬시 래스팅 틴트", "킬커버 더 뉴 파운웨어 쿠션", "잉크 더 벨벳 틴트",
    "워터 벨벳 틴트", "바이로댕 쉐이딩", "프로 아이 팔레트", "인스파이어 롱래쉬 마스카라"
  ],
  dermo_cosmetics: [
    "시카플라스트 밤 B5", "오 떼르말 온천수 미스트", "센시비오 H2O 클렌징워터",
    "제모스 토너", "데일리 모이스처 페이셜 크림", "시카페어 리커버 크림"
  ],
  haircare: [
    "딥 데미지 트리트먼트 EX", "헤어 에센스 딜라이트풀 오일", "데미지 케어 퍼펙트 세럼",
    "탈모증상완화 두피 샴푸", "폴리젠 샴푸", "씨솔트 테라피 두피 스케일러"
  ],
  bodycare: [
    "세라마이드 아토 로션", "모이스춰라이징 로션", "티트리 바디워시",
    "화이트머스크 바디로션", "내추럴 바디워시", "소피플라워 핸드크림"
  ],
  health_food: [
    "홍삼정 에브리타임", "생유산균 골드", "멀티비타민 미네랄 1000",
    "이뮨 멀티비타민", "이너비 아쿠아뱅크", "저분자 콜라겐 파우더"
  ]
};

const SUFFIXES = [
  "50ml", "100ml", "200ml", "1+1 기획세트", "더블 기획세트", "한정 기획 (+미니어처 증정)",
  "대용량 단독기획", "본품+리필 세트", "120매입 대용량", "30개입 팩"
];

const SUFFIXES_EN = [
  "50ml", "100ml", "200ml", "1+1 Special Set", "Double Special Set", "Limited Edition (+Mini Gift)",
  "Jumbo Size Special", "Main + Refill Set", "120 Sheets Jumbo Pack", "30 Packs Box"
];

const MASKPACK_SUFFIXES_KO = [
  "10매 기획 (+2매 추가 증정)", "5매입", "10+2매 단독기획 (+티트리 마스크 2매 증정)",
  "80매 대용량 패드", "75매 리필기획", "1매 (단품)", "4매 기획 (비타콜라겐)",
  "10매입 실속세트", "60매입 (진정흔적 패드)", "30매 대용량 팩"
];

const MASKPACK_SUFFIXES_EN = [
  "10 Sheets Special Set (+2 Free Sheets)", "5 Sheets Pack", "10+2 Sheets Exclusive Set (+2 Extra Sheets)",
  "80 Sheets Jumbo Pad", "75 Sheets Refill Set", "1 Sheet (Single)", "4 Sheets Gel Mask Special Set",
  "10 Sheets Value Pack", "60 Sheets (Calming Spot Pad)", "30 Sheets Daily Mask Box"
];

export function formatBrandName(brand: string, mallType: "domestic" | "global"): string {
  const koPart = brand.split(" (")[0].trim();
  const enPart = brand.match(/\(([^)]+)\)/)?.[1]?.trim() || koPart;
  return mallType === "domestic" ? koPart : enPart;
}

const TEMPLATE_TRANSLATIONS: Record<string, string> = {
  // All/Skincare
  "다이브인 저분자 히알루론산 세럼": "DIVE-IN Low Molecular Hyaluronic Acid Serum",
  "자작나무 수분 선크림": "Birch Juice Moisturizing Sunscreen",
  "어성초 77% 진정 토너": "Heartleaf 77% Soothing Toner",
  "킬커버 더 뉴 파운웨어 쿠션": "Kill Cover The New Founwear Cushion",
  "딥 데미지 트리트먼트 EX": "Deep Damage Treatment EX",
  "이뮨 멀티비타민": "Immun Multivitamin",
  "쫀득한 군고구마": "Chewy Roasted Sweet Potato",
  "덴티스테 플러스화이트 치약": "Dentiste Plus White Toothpaste",
  "독도 토너": "1025 Dokdo Toner",
  "화이트 트러플 퍼스트 스프레이 세럼": "White Truffle First Spray Serum",
  "잡티 세럼": "Green Tangerine Vita C Dark Spot Care Serum",
  "아토베리어365 크림": "Atobarrier 365 Cream",
  "비피다 바이옴 앰플": "Bifida Biome Complex Ampoule",
  "레티놀 시카 흔적 앰플": "Retinol Cica Repair Ampoule",
  
  // Maskpack
  "티트리 에센셜 마스크팩": "Teatree Essential Mask",
  "어성초 껌딱지 시트 마스크": "Gummy Sheet Mask Heartleaf Sticker",
  "다이브인 저분자 히알루론산 마스크팩": "DIVE-IN Low Molecular Hyaluronic Acid Mask",
  "콜라겐 겔 마스크": "Real Collagen Essential Gel Mask",
  "슈렉팩 모공 수축 팩": "I'm The Real Shrek Pack",
  "마데카소사이드 흔적 패드": "Madecassoside Blemish Pad",
  "어성초 진정 패드": "Heartleaf Spot Pad Calming Touch",

  // Cleansing
  "퓨어 클렌징 오일": "Pure Cleansing Oil",
  "클린 잇 제로 클렌징 밤": "Clean It Zero Cleansing Balm",
  "스트레스 릴리프 립앤아이 리무버": "Stress Relief Lip & Eye Remover",
  "센시비오 H2O 클렌징워터": "Sensibio H2O Micellar Water",
  "쏙 클렌징 폼": "Deep Pore Cleansing Foam",
  "쑥 진정 클렌징 워터": "Artemisia Calming Cleansing Water",
  "허브 클렌징 오일": "Herb Green Cleansing Oil",

  // Suncare
  "유기농 맑은 선크림": "Organic Clear Sunscreen",
  "산소수 톤업 선 쿠션": "Oxygen Water Tone Up Sun Cushion",
  "레이저 썬스크린": "Laser Sunscreen 100",
  "그린 마일드 업 선 플러스": "Green Mild Up Sun+",
  "워터풀 에센스 선크림": "Waterfull Essence Sunscreen",
  "선스틱 레포츠": "Sports Sunstick",

  // Makeup
  "쥬시 래스팅 틴트": "Juicy Lasting Tint",
  "잉크 더 벨벳 틴트": "Ink The Velvet Tint",
  "워터 벨벳 틴트": "Water Velvet Tint",
  "바이로댕 쉐이딩": "Artclass By Rodin Shading",
  "프로 아이 팔레트": "Pro Eye Palette",
  "인스파이어 롱래쉬 마스카라": "Inspire Longlash Mascara",

  // Nail
  "글레이즈 젤네일 패치": "Glaze Gel Nail Patch",
  "세미큐어 젤네일 페디": "Semi-Cure Gel Nail Pedi",
  "프리미엄 젤스트립": "Premium Gel Strips",
  "이지 네일 스티커": "Easy Nail Sticker",
  "쏙오프 네일 리무버": "Soak Off Nail Remover",

  // Beauty Tools
  "아이섀도우 브러시 세트": "Eyeshadow Brush Set",
  "메이크업 스파출라": "Makeup Spatula",
  "메이크업 핑거 퍼프": "Makeup Finger Puff",
  "속눈썹 고데기": "Heated Eyelash Curler",
  "화장솜 100매": "Premium Cotton Pads 100P",
  "앞머리 헤어롤": "Hair Rollers",
  "파운데이션 브러시": "Foundation Brush",

  // Dermo
  "시카플라스트 밤 B5": "Cicaplast Baume B5",
  "오 떼르말 온천수 미스트": "Thermal Spring Water Mist",
  "제모스 토너": "Xemose Toner",
  "데일리 모이스처 페이셜 크림": "Daily Moisture Therapy Facial Cream",
  "시카페어 리커버 크림": "Cicapair Tiger Grass Color Correcting Treatment",

  // Mens edit
  "퍼펙트 올인원 밀크": "Perfect All-In-One Milk",
  "스킨워시 바디 앤 페이스": "Skin Wash Body & Face",
  "블랙밤 립밤": "Black Balm Dual Lip Balm",
  "에어리 텐션 톤업크림": "Airy Tension Tone Up Cream",
  "트리플 핸섬 립밤": "Triple Handsome Lip Balm",
  "매트 왁스 수퍼 홀드": "Matte Wax Super Hold",

  // Perfume
  "웜코튼 오드퍼퓸": "Warm Cotton Eau de Parfum",
  "시그니처 퍼퓸 코튼허그": "Signature Perfume Cotton Hug",
  "에끌라 드 아르페쥬": "Eclat d'Arpege",
  "시그니처 로즈 오드퍼퓸": "Signature Rose Eau de Parfum",
  "아티산 오드뚜왈렛": "Artisan Eau de Toilette",
  "위크엔드 포 맨": "Weekend For Men",

  // Diffuser
  "블랙체리 디퓨저": "Black Cherry Diffuser",
  "양재동 꽃시장 디퓨저": "Flower Market Diffuser",
  "편백 숲 향 디퓨저": "Cypress Forest Diffuser",
  "퓨어 코튼 홈 디퓨저": "Pure Cotton Home Diffuser",
  "스위트 가든 소이캔들": "Sweet Garden Soy Candle",

  // Haircare
  "헤어 에센스 딜라이트풀 오일": "Delightful Hair Essence Oil",
  "데미지 케어 퍼펙트 세럼": "Perfect Serum Damage Care",
  "탈모증상완화 두피 샴푸": "Anti-Hair Loss Scalp Shampoo",
  "폴리젠 샴푸": "Folligen Shampoo",
  "씨솔트 테라피 두피 스케일러": "Sea Salt Therapy Scalp Scaler",

  // Bodycare
  "세라마이드 아토 로션": "Ceramide Ato Lotion",
  "모이스춰라이징 로션": "Moisturizing Lotion",
  "티트리 바디워시": "Teatree Body Wash",
  "화이트머스크 바디로션": "White Musk Body Lotion",
  "내추럴 바디워시": "Natural Body Wash",
  "소피플라워 핸드크림": "Sophy Flower Hand Cream",

  // Health food
  "홍삼정 에브리타임": "Korean Red Ginseng Extract Everytime",
  "생유산균 골드": "Lacto-fit Probiotics Gold",
  "멀티비타민 미네랄 1000": "Multivitamin Mineral 1000",
  "이너비 아쿠아뱅크": "Innerb Aqua Bank",
  "저분자 콜라겐 파우더": "Low Molecular Collagen Powder",

  // Food
  "베이글칩 갈릭버터": "Garlic Butter Bagel Chip",
  "콤부차 레몬": "Teazen Kombucha Lemon",
  "제주 유기농 녹차 티백": "Jeju Organic Green Tea Bags",
  "하늘보리": "Barley Tea",
  "담백한 베지밀A": "Vegemil A Soy Milk",

  // Oral care
  "플러스화이트 치약": "Plus White Toothpaste",
  "미스티포레스트 치약": "Misty Forest Toothpaste",
  "멀티케어 치약": "Multicare Toothpaste",
  "크로스액션 칫솔 세트": "CrossAction Toothbrush Set",
  "구강청결제 오리지널": "Mouthwash Original",

  // Health
  "안티푸라민 쿨파스": "Pain Relief Cool Patch",
  "관절 엠에스엠": "Joint MSM Formula",
  "핫 파스 밴드": "Hot Patch Band",
  "비타민C 활력 영양제": "Vitamin C Vitality Supplement",
  "황사 방역 마스크 KF94": "Yellow Dust KF94 Protection Mask",

  // Health goods
  "손목 보호대 슬림핏": "Wrist Supporter Slim Fit",
  "종아리 공기압 마사지기": "Calf Air Compression Massager",
  "저주파 안마 패치": "Low Frequency Massage Patch",
  "자동 전자 혈압계": "Automatic Digital Blood Pressure Monitor",
  "바른자세 교정 밴드": "Posture Corrector Band",

  // Hygiene
  "유기농 순면 커버 생리대": "Organic Cotton Cover Sanitary Pads",
  "입는 오버나이트": "Overnight Panty Sanitary Pads",
  "유기농 면달 생리대": "Organic Cotton Sanitary Pads",
  "안심 물티슈": "Safe Wet Wipes",
  "레귤러 탐폰": "Regular Tampons",

  // Fashion
  "살색 팬티스타킹 5족": "Skin-tone Pantyhose 5-pack",
  "압박 무릎 반스타킹": "Compression Knee-high Stockings",
  "면 100% 무봉제 덧신": "100% Cotton Seamless No-show Socks",
  "스포츠 기능성 남성 양말": "Men's Athletic Crew Socks",
  "심리스 노와이어 브래지어": "Seamless Wireless Brassiere",

  // Homeliving
  "뽑아쓰는 키친타올": "Pop-up Kitchen Towels",
  "부직포 먼지떨이 리필": "Disposable Duster Refills",
  "실리콘 욕실 슬리퍼": "Silicone Bathroom Slippers",
  "초극세사 원룸 베개 커버": "Microfiber Pillow Cover",
  "스마트 원터치 자동 분리수거함": "Smart One-touch Trash Bin",

  // Digital Hobby
  "무소음 무선 마우스": "Silent Wireless Mouse",
  "블루투스 무선 스피커": "Bluetooth Wireless Speaker",
  "에어 워셔 초음파 가습기": "Ultrasonic Air Humidifier",
  "C타입 고속 충전 케이블": "USB Type-C Fast Charging Cable",
  "휴대용 미니 손난로": "Portable Pocket Hand Warmer",

  // Fancy
  "스프링 그리드 유선 노트": "Spring Grid Lined Notebook",
  "153 볼펜 12색 세트": "153 Ballpoint Pen 12-Color Set",
  "투명 다이어리 꾸미기 스티커": "Clear Diary Deco Stickers",
  "파스텔 듀얼 형광펜": "Pastel Dual Tip Highlighters",
  "마이멜로디 캐릭터 필통": "My Melody Pencil Case"
};

// Simple deterministic hash of the product template name to determine its price and originalPrice consistently.
// This ensures that the same product has a stable price across categories, ranks, dates, and malls.

// Helper to get realistic real-world bestselling products for major categories
export function getRealBestseller(
  category: string,
  rank: number,
  mallType: "domestic" | "global"
): { brand: string; name: string; suffix: string } | null {
  const isGlobal = mallType === "global";
  
  if (category === "all") {
    if (rank === 1) {
      return {
        brand: "토리든 (Torriden)",
        name: isGlobal ? "DIVE-IN Low Molecular Hyaluronic Acid Serum" : "다이브인 저분자 히알루론산 세럼",
        suffix: isGlobal ? "50ml Double Set" : "50ml 더블 기획세트"
      };
    }
    if (rank === 2) {
      return {
        brand: "라운드랩 (Round Lab)",
        name: isGlobal ? "Birch Juice Moisturizing Sunscreen" : "자작나무 수분 선크림",
        suffix: isGlobal ? "50ml 1+1 Set" : "50ml 1+1 기획세트"
      };
    }
    if (rank === 3) {
      return {
        brand: "어노브 (UNOVE)",
        name: isGlobal ? "Deep Damage Treatment EX" : "딥 데미지 트리트먼트 EX",
        suffix: isGlobal ? "320ml Double Set" : "320ml 더블 기획세트"
      };
    }
  }

  if (category === "skincare") {
    if (rank === 1) {
      return {
        brand: isGlobal ? "코스알엑스 (COSRX)" : "토리든 (Torriden)",
        name: isGlobal ? "Advanced Snail 96 Mucin Power Essence" : "다이브인 저분자 히알루론산 세럼",
        suffix: isGlobal ? "100ml" : "50ml 더블 기획세트"
      };
    }
    if (rank === 2) {
      return {
        brand: "아누아 (Anua)",
        name: isGlobal ? "Heartleaf 77% Soothing Toner" : "어성초 77% 진정 토너",
        suffix: "250ml"
      };
    }
    if (rank === 3) {
      return {
        brand: "라운드랩 (Round Lab)",
        name: isGlobal ? "1025 Dokdo Toner" : "1025 독도 토너",
        suffix: isGlobal ? "500ml Jumbo" : "500ml 대용량 기획"
      };
    }
  }

  if (category === "dermo_cosmetics") {
    if (rank === 1) {
      return {
        brand: "에스트라 (AESTURA)",
        name: isGlobal ? "Atobarrier 365 Cream" : "아토베리어365 크림",
        suffix: isGlobal ? "80ml Special Set" : "80ml 기획세트"
      };
    }
    if (rank === 2) {
      return {
        brand: "라로슈포제 (La Roche-Posay)",
        name: isGlobal ? "Cicaplast Baume B5" : "시카플라스트 밤 B5",
        suffix: "100ml"
      };
    }
    if (rank === 3) {
      return {
        brand: "피지오겔 (Physiogel)",
        name: isGlobal ? "Daily Moisture Therapy Facial Cream" : "데일리 모이스처 페이셜 크림",
        suffix: "150ml"
      };
    }
  }

  if (category === "bodycare") {
    if (rank === 1) {
      return {
        brand: "일리윤 (Illiyoon)",
        name: isGlobal ? "Ceramide Ato Lotion" : "세라마이드 아토 로션",
        suffix: isGlobal ? "528ml Jumbo" : "528ml 대용량 기획"
      };
    }
    if (rank === 2) {
      return {
        brand: "세타필 (Cetaphil)",
        name: isGlobal ? "Moisturizing Lotion" : "모이스춰라이징 로션",
        suffix: "591ml"
      };
    }
    if (rank === 3) {
      return {
        brand: "더프트앤도프트 (Duft & Doft)",
        name: isGlobal ? "Sophy Flower Hand Cream" : "소피플라워 핸드크림",
        suffix: "50ml"
      };
    }
  }

  if (category === "maskpack") {
    if (rank === 1) {
      return {
        brand: "메디힐 (Mediheal)",
        name: isGlobal ? "Teatree Essential Mask" : "티트리 에센셜 마스크팩",
        suffix: isGlobal ? "10-Pack" : "10매입 기획세트"
      };
    }
    if (rank === 2) {
      return {
        brand: "아비브 (Abib)",
        name: isGlobal ? "Gummy Sheet Mask Heartleaf Sticker" : "어성초 껌딱지 시트 마스크",
        suffix: isGlobal ? "10 sheets" : "10매입"
      };
    }
    if (rank === 3) {
      return {
        brand: "토리든 (Torriden)",
        name: isGlobal ? "Dive-In Low Molecular Hyaluronic Acid Mask" : "다이브인 저분자 히알루론산 마스크팩",
        suffix: isGlobal ? "10-Pack" : "10매입 기획"
      };
    }
  }

  if (category === "cleansing") {
    if (rank === 1) {
      return {
        brand: "마녀공장 (Manyo)",
        name: isGlobal ? "Pure Cleansing Oil" : "퓨어 클렌징 오일",
        suffix: "200ml"
      };
    }
    if (rank === 2) {
      return {
        brand: "바닐라코 (BANILA CO)",
        name: isGlobal ? "Clean It Zero Cleansing Balm Original" : "클린 잇 제로 클렌징 밤 오리지널",
        suffix: "100ml"
      };
    }
    if (rank === 3) {
      return {
        brand: "바이오더마 (Bioderma)",
        name: isGlobal ? "Sensibio H2O Micellar Water" : "센시비오 H2O 클렌징워터",
        suffix: "500ml"
      };
    }
  }

  if (category === "suncare") {
    if (rank === 1) {
      return {
        brand: "조선미녀 (Beauty of Joseon)",
        name: isGlobal ? "Relief Sun : Rice + Probiotics" : "맑은 쌀 선크림",
        suffix: isGlobal ? "50ml Double Pack" : "50ml 더블 기획세트"
      };
    }
    if (rank === 2) {
      return {
        brand: "라운드랩 (Round Lab)",
        name: isGlobal ? "Birch Juice Moisturizing Sunscreen" : "자작나무 수분 선크림",
        suffix: isGlobal ? "50ml 1+1 Set" : "50ml 1+1 기획세트"
      };
    }
    if (rank === 3) {
      return {
        brand: "식물나라 (Shingmulnara)",
        name: isGlobal ? "Oxygen Water Light Sun Gel" : "산소수 가벼운 선 젤",
        suffix: "60ml"
      };
    }
  }

  if (category === "makeup") {
    if (rank === 1) {
      return {
        brand: "롬앤 (Romand)",
        name: isGlobal ? "Juicy Lasting Tint" : "쥬시 래스팅 틴트",
        suffix: "5.5g"
      };
    }
    if (rank === 2) {
      return {
        brand: "클리오 (Clio)",
        name: isGlobal ? "Kill Cover The New Founwear Cushion" : "킬커버 더 뉴 파운웨어 쿠션",
        suffix: isGlobal ? "15g + Refill" : "본품+리필 기획"
      };
    }
    if (rank === 3) {
      return {
        brand: "페리페라 (Peripera)",
        name: isGlobal ? "Ink The Velvet Tint" : "잉크 더 벨벳 틴트",
        suffix: "4g"
      };
    }
  }

  if (category === "haircare") {
    if (rank === 1) {
      return {
        brand: "어노브 (UNOVE)",
        name: isGlobal ? "Deep Damage Treatment EX" : "딥 데미지 트리트먼트 EX",
        suffix: "320ml"
      };
    }
    if (rank === 2) {
      return {
        brand: "라보에이치 (LABO-H)",
        name: isGlobal ? "Hair Loss Care Scalp Shampoo" : "탈모증상완화 두피 샴푸",
        suffix: "400ml"
      };
    }
    if (rank === 3) {
      return {
        brand: "모레모 (Moremo)",
        name: isGlobal ? "Water Treatment Miracle 10" : "워터 트리트먼트 미라클 10",
        suffix: "200ml"
      };
    }
  }

  if (category === "health_food") {
    if (rank === 1) {
      return {
        brand: "오소몰 (Orthomol)",
        name: isGlobal ? "Immun Multivitamin Liquid + Tablet" : "이뮨 멀티비타민",
        suffix: isGlobal ? "30-Day Pack" : "30개입 기획팩"
      };
    }
    if (rank === 2) {
      return {
        brand: "락토핏 (Lacto-Fit)",
        name: isGlobal ? "Lacto-Fit Gold Probiotics" : "생유산균 골드",
        suffix: "50포"
      };
    }
    if (rank === 3) {
      return {
        brand: "정관장 (CheongKwanJang)",
        name: isGlobal ? "Korean Red Ginseng Extract Everytime" : "홍삼정 에브리타임",
        suffix: "30포"
      };
    }
  }

  if (category === "beauty_tools") {
    if (rank === 1) {
      return {
        brand: "필리밀리 (Fillimilli)",
        name: isGlobal ? "Eye Shadow Brush Set" : "아이섀도우 브러시 세트",
        suffix: isGlobal ? "5-Pack" : "5종 세트"
      };
    }
    if (rank === 2) {
      return {
        brand: "피카소 (Piccasso)",
        name: isGlobal ? "Makeup Spatula" : "메이크업 스파출라",
        suffix: isGlobal ? "Leather Pouch Set" : "가죽케이스 세트"
      };
    }
    if (rank === 3) {
      return {
        brand: "올리브영 (Olive Young)",
        name: isGlobal ? "Premium Cotton Pads" : "화장솜",
        suffix: "100매"
      };
    }
  }

  if (category === "food") {
    if (rank === 1) {
      return {
        brand: "딜라이트 프로젝트 (Delight Project)",
        name: isGlobal ? "Sweet Roasted Sweet Potato" : "쫀득한 군고구마",
        suffix: "60g"
      };
    }
    if (rank === 2) {
      return {
        brand: "티젠 (TEAZEN)",
        name: isGlobal ? "Kombucha Lemon" : "티젠 콤부차 레몬",
        suffix: "10포"
      };
    }
    if (rank === 3) {
      return {
        brand: "딜라이트 프로젝트 (Delight Project)",
        name: isGlobal ? "Garlic Butter Bagel Chips" : "갈릭버터 베이글칩",
        suffix: "60g"
      };
    }
  }

  return null;
}

// Helper to generate 30 deterministic products for a category & mall
export function generateBaselineProducts(
  category: string,
  mallType: "domestic" | "global",
  timestamp: string
): Product[] {
  // '전체(all)' 카테고리는 9개 핵심 뷰티/헬스 카테고리의 최상위 베스트셀러를 교차 집계하여 생성 (브랜드-템플릿 오매칭 원천 차단)
  if (category === "all") {
    const subCategories = [
      "skincare",
      "suncare",
      "maskpack",
      "makeup",
      "haircare",
      "dermo_cosmetics",
      "cleansing",
      "bodycare",
      "health_food"
    ];
    const subLists = subCategories.map((sub) =>
      generateBaselineProducts(sub, mallType, timestamp)
    );
    const pooled: Product[] = [];
    for (let tier = 0; tier < 4; tier++) {
      for (const list of subLists) {
        if (list[tier] && pooled.length < 30) {
          const item = list[tier];
          const newRank = pooled.length + 1;
          pooled.push({
            ...item,
            rank: newRank,
            category: "all",
            id: `${mallType}_all_${newRank}_${item.brand.replace(/[^a-zA-Z가-힣]/g, "").slice(0, 5)}`
          });
        }
      }
    }
    return pooled.map((p) => preprocessProduct(p, mallType));
  }

  const brands = BRANDS[category as keyof typeof BRANDS] || BRANDS.skincare;
  const templates = TEMPLATES[category as keyof typeof TEMPLATES] || TEMPLATES.skincare;

  const products: Product[] = [];

  for (let i = 1; i <= 30; i++) {
    let brand = "";
    let name = "";
    let suffix = "";

    const bestseller = getRealBestseller(category, i, mallType);

    if (bestseller) {
      brand = bestseller.brand;
      name = bestseller.name;
      suffix = bestseller.suffix;
    } else {
      // Generate deterministic values using a prime hash that is coprime to all list lengths
      // 31, 37, 41 are coprime to 5, 6, 7, 8, 9, 10
      const brandIdx = (i * 31 + (mallType === "global" ? 7 : 1)) % brands.length;
      const templateIdx = (i * 37 + (mallType === "global" ? 3 : 2)) % templates.length;
      const suffixIdx = (i * 41 + (mallType === "global" ? 5 : 9)) % 10;

      brand = brands[brandIdx];
      name = templates[templateIdx];

      if (category === "maskpack") {
        const maskpackSuffixes = mallType === "domestic" ? MASKPACK_SUFFIXES_KO : MASKPACK_SUFFIXES_EN;
        suffix = maskpackSuffixes[suffixIdx % maskpackSuffixes.length];
      } else {
        if (mallType === "global") {
          suffix = SUFFIXES_EN[suffixIdx % SUFFIXES_EN.length];
        } else {
          suffix = SUFFIXES[suffixIdx % SUFFIXES.length];
        }
      }
    }

    // Map specific templates to their real world brands dynamically (parentheses format)
    brand = getCorrectBrandForProduct(category, name, brand);

    // Apply the translation for product name if global mall (only if not already translated by getRealBestseller)
    let displayName = name;
    if (mallType === "global" && !bestseller) {
      displayName = TEMPLATE_TRANSLATIONS[name] || name;
    }

    // Apply clean brand formatting based on mall type
    const finalBrand = formatBrandName(brand, mallType);

    const fullName = suffix ? `${displayName} ${suffix}` : displayName;
    const imageUrl = getProductImageUrl(category, brand, name, i);
    const link = getProductOliveYoungLink(mallType, brand, fullName);

    // Pricing calculation based on the stable product name instead of ranking index
    const { price: basePrice, originalPrice } = getPriceForProductName(fullName, category);
    
    // Set realistic rating and reviews (bestsellers have higher scores/counts, with category+name seed to prevent identical numbers in 'all')
    const nameSeed = fullName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    let rating = Math.round((4.3 + ((i * 17 + nameSeed) % 7) * 0.1) * 10) / 10;
    let reviewCount = 240 + ((i * 457 + nameSeed * 31) % 8900);
    
    if (i === 1) {
      rating = 4.9;
      reviewCount = 19500 + ((nameSeed * 73) % 9800);
    } else if (i === 2) {
      rating = 4.8;
      reviewCount = 13200 + ((nameSeed * 59) % 6200);
    } else if (i === 3) {
      rating = 4.8;
      reviewCount = 9100 + ((nameSeed * 43) % 4500);
    }

    products.push({
      rank: i,
      id: `${mallType}_${category}_${i}_${brand.replace(/[^a-zA-Z]/g, "").slice(0, 5)}`,
      name: fullName,
      brand: finalBrand,
      price: basePrice,
      originalPrice,
      rating,
      reviewCount,
      imageUrl,
      link,
      change: 0,
      category,
      mallType,
      timestamp
    });
  }

  return products.map(p => preprocessProduct(p, mallType));
}

// Function to apply jitter and shuffle rankings to simulate a real scraper tracking rank shifts
export function simulateRankingShift(
  previousProducts: Product[],
  category: string,
  mallType: "domestic" | "global",
  timestamp: string
): Product[] {
  const list = previousProducts.length > 0
    ? JSON.parse(JSON.stringify(previousProducts)) as Product[]
    : generateBaselineProducts(category, mallType, timestamp);

  list.forEach(p => {
    p.timestamp = timestamp;
    p.brand = formatBrandName(getCorrectBrandForProduct(category, p.name, p.brand), mallType);
    p.link = getProductOliveYoungLink(mallType, p.brand, p.name);
  });

  const swapCount = 3 + Math.floor(Math.random() * 4);
  for (let s = 0; s < swapCount; s++) {
    const idx = Math.floor(Math.random() * 28);
    const temp = list[idx];
    list[idx] = list[idx + 1];
    list[idx + 1] = temp;
  }

  if (Math.random() > 0.4) {
    const replaceCount = 1 + Math.floor(Math.random() * 2);
    for (let r = 0; r < replaceCount; r++) {
      const idx = 25 + r;
      const brands = BRANDS[category as keyof typeof BRANDS] || BRANDS.skincare;
      const templates = TEMPLATES[category as keyof typeof TEMPLATES] || TEMPLATES.skincare;
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      let randomSuffix = "";
      if (category === "maskpack") {
        const maskpackSuffixes = mallType === "domestic" ? MASKPACK_SUFFIXES_KO : MASKPACK_SUFFIXES_EN;
        randomSuffix = maskpackSuffixes[Math.floor(Math.random() * maskpackSuffixes.length)];
      } else {
        if (mallType === "global") {
          randomSuffix = SUFFIXES_EN[Math.floor(Math.random() * SUFFIXES_EN.length)];
        } else {
          randomSuffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
        }
      }

      const correctBrandWithParentheses = getCorrectBrandForProduct(category, randomTemplate, randomBrand);
      const finalBrand = formatBrandName(correctBrandWithParentheses, mallType);

      let randomDisplayName = randomTemplate;
      if (mallType === "global") {
        randomDisplayName = TEMPLATE_TRANSLATIONS[randomTemplate] || randomTemplate;
      }
      const newName = `${randomDisplayName} ${randomSuffix}`;

      const { price: basePrice, originalPrice } = getPriceForProductName(newName, category);

      list[idx] = {
        ...list[idx],
        id: `${mallType}_${category}_new_${Date.now()}_${r}`,
        brand: finalBrand,
        name: newName,
        price: basePrice,
        originalPrice: originalPrice,
        rating: 4.5,
        reviewCount: 45,
        imageUrl: getProductImageUrl(category, correctBrandWithParentheses, randomTemplate, idx),
        link: getProductOliveYoungLink(mallType, finalBrand, newName),
        change: "NEW"
      };
    }
  }

  const updatedList = list.map((p, newIndex) => {
    const newRank = newIndex + 1;
    let rankChange: number | "NEW" = 0;

    if (p.change === "NEW") {
      rankChange = "NEW";
    } else {
      const prevItem = previousProducts.find(prev => prev.id === p.id);
      if (prevItem) {
        rankChange = prevItem.rank - newRank;
      } else {
        rankChange = "NEW";
      }
    }

    return {
      ...p,
      rank: newRank,
      change: rankChange
    };
  });

  return updatedList.map(p => preprocessProduct(p, mallType));
}

export function getProductImageUrl(
  category: string,
  brand: string,
  name: string,
  rank: number
): string {
  const CATEGORY_IMAGES: Record<string, string[]> = {
    all: [
      "1620916566398-39f1143ab7be", "1586495777744-4413f21062fa", "1541643600914-78b084683601"
    ],
    skincare: [
      "1620916566398-39f1143ab7be", "1612817288484-6f916006741a", "1601049676099-e7ed07d825b0"
    ],
    maskpack: [
      "1620916566398-39f1143ab7be", "1608248597279-f99d160bfcbc"
    ],
    cleansing: [
      "1617897903246-719242758050", "1556228578-0d85b1a4d571"
    ],
    suncare: [
      "1598440947619-2c35fc9aa908"
    ],
    makeup: [
      "1586495777744-4413f21062fa", "1596462502278-27bfdc403348", "1522335789203-aabd1fc54bc9"
    ],
    nail: [
      "1604654894610-df4906b1150c"
    ],
    beauty_tools: [
      "1522337360788-8b13dee7a37e", "1631730359575-38e4755d772b", "1615396899839-c99c121888b0"
    ],
    dermo_cosmetics: [
      "1570172619644-dfd03ed5d881", "1626806787461-102c1bfaaea1"
    ],
    mens_edit: [
      "1626806787461-102c1bfaaea1", "1556228578-0d85b1a4d571"
    ],
    perfume: [
      "1541643600914-78b084683601", "1594035910387-fea47794261f"
    ],
    diffuser: [
      "1595981267035-7b04ec8d4f7e", "1603006905003-be475563bc59"
    ],
    haircare: [
      "1535585209827-a15fcdbc4c2d", "1608248597279-f99d160bfcbc"
    ],
    bodycare: [
      "1515377905703-c4788e51af15", "1607006342446-93a43bf242fa"
    ],
    health_food: [
      "1584017911766-d451b3d0e843", "1471864190281-a93a3070b6de"
    ],
    food: [
      "1599490659243-701552240a5a", "1576092768241-dec231879fc3"
    ],
    oral_care: [
      "1607613009820-a29f7bb81c04", "1559599101-f09722fb4948"
    ],
    health: [
      "1584017911766-d451b3d0e843", "1471864190281-a93a3070b6de"
    ],
    health_goods: [
      "1511671782779-c97d3d27a1d4", "1607613009820-a29f7bb81c04"
    ],
    hygiene: [
      "1563170351-be82bc888bb4", "1618013444023-fa989d3d09a0"
    ],
    fashion: [
      "1593085512530-eb72d47de474", "1517842645767-c639042777db"
    ],
    homeliving: [
      "1595981267035-7b04ec8d4f7e"
    ],
    digital_hobby: [
      "1511671782779-c97d3d27a1d4"
    ],
    fancy: [
      "1517842645767-c639042777db"
    ]
  };

  const nameLower = name.toLowerCase();
  
  if (nameLower.includes("선크림") || nameLower.includes("선케어") || nameLower.includes("sunscreen") || nameLower.includes("sun ")) {
    return "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&h=200&fit=crop&q=80";
  }
  
  if (nameLower.includes("세럼") || nameLower.includes("앰플") || nameLower.includes("serum") || nameLower.includes("ampoule")) {
    const serumImages = ["1620916566398-39f1143ab7be", "1612817288484-6f916006741a", "1601049676099-e7ed07d825b0"];
    const id = serumImages[rank % serumImages.length];
    return `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop&q=80`;
  }
  
  if (nameLower.includes("크림") || nameLower.includes("cream")) {
    const creamImages = ["1608248597279-f99d160bfcbc", "1626806787461-102c1bfaaea1"];
    const id = creamImages[rank % creamImages.length];
    return `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop&q=80`;
  }

  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.skincare;
  const imageId = images[(rank - 1) % images.length];
  return `https://images.unsplash.com/photo-${imageId}?w=200&h=200&fit=crop&q=80`;
}

export function getCorrectBrandForProduct(category: string, productName: string, fallbackBrand: string): string {
  const name = productName.toLowerCase();
  
  // 1. Global unique name-based mapping to ensure correct brand-product pairing across ALL categories (including "All")
  if (name.includes("티트리 에센셜") || name.includes("티트리 마스크") || (name.includes("티트리") && name.includes("마스크팩")) || name.includes("teatree essential") || (name.includes("teatree") && name.includes("mask"))) return "메디힐 (Mediheal)";
  if (name.includes("어성초 껌딱지") || name.includes("껌딱지") || name.includes("어성초 진정 마스크") || name.includes("gummy sheet") || name.includes("heartleaf sticker")) return "아비브 (Abib)";
  if (name.includes("다이브인") || name.includes("히알루론산 세럼") || name.includes("히알루론산 마스크") || name.includes("dive-in") || name.includes("hyaluronic")) return "토리든 (Torriden)";
  if (name.includes("콜라겐 겔") || name.includes("콜라겐 마스크") || name.includes("collagen gel") || name.includes("collagen essential")) return "메디앤서 (MediAnswer)";
  if (name.includes("슈렉팩") || name.includes("shrek pack") || name.includes("shrek")) return "드림웍스 (Dreamworks)";
  if (name.includes("마데카소사이드") || name.includes("madecassoside")) return "메디힐 (Mediheal)";
  if (name.includes("어성초 진정") || name.includes("어성초 스팟") || name.includes("카밍 터치") || name.includes("heartleaf spot") || name.includes("calming touch")) return "아비브 (Abib)";
  if (name.includes("시카플라스트") || name.includes("cicaplast")) return "라로슈포제 (La Roche-Posay)";
  if (name.includes("오 떼르말") || name.includes("온천수 미스트") || name.includes("아벤느") || name.includes("thermal spring") || name.includes("avene")) return "아벤느 (Avene)";
  if (name.includes("센시비오") || name.includes("클렌징워터") || name.includes("sensibio") || name.includes("micellar water")) return "바이오더마 (Bioderma)";
  if (name.includes("제모스") || name.includes("xemose")) return "유리아쥬 (Uriage)";
  if (name.includes("데일리 모이스처") || name.includes("페이셜 크림") || name.includes("daily moisture") || name.includes("therapy facial cream") || name.includes("physiogel")) return "피지오겔 (Physiogel)";
  if (name.includes("시카페어") || name.includes("리커버 크림") || name.includes("cicapair") || name.includes("color correcting") || name.includes("jart")) return "닥터자르트 (Dr.Jart+)";
  if (name.includes("어성초 77%") || name.includes("heartleaf 77") || name.includes("anua")) return "아누아 (Anua)";
  if (name.includes("독도 토너") || name.includes("독도 로션") || name.includes("독도 크림") || name.includes("dokdo")) return "라운드랩 (Round Lab)";
  if (name.includes("티트리 트러블") || name.includes("트러블 수딩")) return "메디힐 (Mediheal)";
  if (name.includes("화이트 트러플") || name.includes("스프레이 세럼") || name.includes("white truffle") || name.includes("d'alba")) return "달바 (d'Alba)";
  if (name.includes("아토베리어") || name.includes("atobarrier") || name.includes("aestura")) return "에스트라 (AESTURA)";
  if (name.includes("퓨어 클렌징") || name.includes("pure cleansing")) return "마녀공장 (Manyo)";
  if (name.includes("비피다") || name.includes("bifida")) return "마녀공장 (Manyo)";
  if (name.includes("레티놀 시카") || name.includes("retinol cica")) return "이니스프리 (Innisfree)";
  if (name.includes("청귤") || name.includes("그린 탠저린") || name.includes("green tangerine")) return "구달 (Goodal)";
  if (name.includes("스네일") || name.includes("snail") || name.includes("뮤신")) return "코스알엑스 (COSRX)";
  if (name.includes("쥬시 래스팅") || name.includes("글래스팅") || name.includes("롬앤") || name.includes("juicy lasting")) return "롬앤 (Romand)";
  if (name.includes("잉크 더 벨벳") || name.includes("페리페라") || name.includes("ink the velvet") || name.includes("peripera")) return "페리페라 (Peripera)";
  if (name.includes("워터 벨벳") || name.includes("웨이크메이크") || name.includes("water velvet") || name.includes("wakemake")) return "웨이크메이크 (Wakemake)";
  if (name.includes("킬커버") || name.includes("클리오") || name.includes("kill cover")) return "클리오 (Clio)";
  if (name.includes("바이로댕") || name.includes("쉐이딩") || name.includes("by rodin") || name.includes("too cool")) return "투쿨포스쿨 (Too Cool For School)";
  if (name.includes("프로 아이") || name.includes("팔레트") || name.includes("pro eye")) return "클리오 (Clio)";
  if (name.includes("인스파이어") || name.includes("마스카라") || name.includes("inspire longlash") || name.includes("mude")) return "뮤드 (mude)";
  if (name.includes("스파출라") || name.includes("파운데이션 브러시") || name.includes("피카소") || name.includes("spatula") || name.includes("foundation brush") || name.includes("piccasso")) return "피카소 (Piccasso)";
  if (name.includes("화장솜") || name.includes("필리밀리") || name.includes("cotton pads") || name.includes("fillimilli")) return "필리밀리 (Fillimilli)";
  if (name.includes("스펀지") || name.includes("스폰지") || name.includes("리얼테크닉스") || name.includes("real techniques")) return "리얼테크닉스 (Real Techniques)";
  if (name.includes("웜코튼") || name.includes("클린") || name.includes("warm cotton")) return "클린 (Clean)";
  if (name.includes("코튼허그") || name.includes("포맨트") || name.includes("cotton hug")) return "포맨트 (Forment)";
  if (name.includes("에끌라 드 아르페쥬") || name.includes("랑방") || name.includes("eclat") || name.includes("lanvin")) return "랑방 (Lanvin)";
  if (name.includes("로즈") || name.includes("클로에") || name.includes("chloe")) return "클로에 (Chloe)";
  if (name.includes("딥 데미지") || name.includes("트리트먼트 EX") || name.includes("어노브") || name.includes("deep damage") || name.includes("unove")) return "어노브 (UNOVE)";
  if (name.includes("딜라이트풀") || name.includes("delightful") || name.includes("moremo")) return "모레모 (Moremo)";
  if (name.includes("퍼펙트 세럼") || name.includes("미쟝센") || name.includes("perfect serum") || name.includes("mise-en-scene")) return "미쟝센 (Mise-en-scene)";
  if (name.includes("탈모증상") || name.includes("두피 샴푸") || name.includes("라보에이치") || name.includes("anti-hair loss") || name.includes("labo-h")) return "라보에이치 (LABO-H)";
  if (name.includes("폴리젠") || name.includes("닥터포헤어") || name.includes("folligen") || name.includes("dr.forhair")) return "닥터포헤어 (Dr.FORHAIR)";
  if (name.includes("씨솔트") || name.includes("스케일러") || name.includes("그로우어스") || name.includes("sea salt") || name.includes("growus")) return "그로우어스 (GROWUS)";
  if (name.includes("세라마이드") || name.includes("일리윤") || name.includes("ceramide ato") || name.includes("illiyoon")) return "일리윤 (Illiyoon)";
  if (name.includes("모이스춰라이징") || name.includes("세타필") || name.includes("moisturizing") || name.includes("cetaphil")) return "세타필 (Cetaphil)";
  if (name.includes("티트리 바디워시") || name.includes("더바디샵") || name.includes("teatree body wash") || name.includes("body shop")) return "더바디샵 (The Body Shop)";
  if (name.includes("화이트머스크") || name.includes("온더바디") || name.includes("white musk") || name.includes("on the body")) return "온더바디 (On The Body)";
  if (name.includes("내추럴 바디워시") || name.includes("해피바스") || name.includes("natural body") || name.includes("happy bath")) return "해피바스 (Happy Bath)";
  if (name.includes("소피플라워") || name.includes("핸드크림") || name.includes("sophy flower") || name.includes("duft & doft")) return "더프트앤도프트 (Duft & Doft)";
  if (name.includes("홍삼") || name.includes("에브리타임") || name.includes("정관장") || name.includes("ginseng") || name.includes("cheongkwanjang")) return "정관장 (CheongKwanJang)";
  if (name.includes("유산균") || name.includes("락토핏") || name.includes("lacto-fit")) return "락토핏 (Lacto-Fit)";
  if (name.includes("미네랄 1000") || name.includes("고려은단") || name.includes("mineral 1000") || name.includes("koryo eundan")) return "고려은단 (Koryo Eundan)";
  if (name.includes("이뮨") || name.includes("오소몰") || name.includes("immun") || name.includes("orthomol")) return "오소몰 (Orthomol)";
  if (name.includes("이너비") || name.includes("아쿠아뱅크") || name.includes("innerb") || name.includes("aqua bank") || name.includes("cj wellcare")) return "씨제이웰케어 (CJ Wellcare)";
  if (name.includes("콜라겐") || name.includes("비비랩") || name.includes("collagen powder") || name.includes("bblab")) return "비비랩 (BBLAB)";
  if (name.includes("고구마") || name.includes("베이글칩") || name.includes("딜라이트 프로젝트") || name.includes("sweet potato") || name.includes("bagel") || name.includes("delight project")) return "딜라이트 프로젝트 (Delight Project)";
  if (name.includes("콤부차") || name.includes("티젠") || name.includes("kombucha") || name.includes("teazen")) return "티젠 (TEAZEN)";
  if (name.includes("녹차") || name.includes("오설록") || name.includes("green tea") || name.includes("osulloc")) return "오설록 (Osulloc)";
  if (name.includes("하늘보리") || name.includes("barley tea") || name.includes("woongjin")) return "웅진 (Woongjin)";
  if (name.includes("베지밀") || name.includes("vegemil") || name.includes("jeongsik")) return "정식품 (Jeongsik)";
  if (name.includes("덴티스테") || name.includes("플러스화이트") || name.includes("dentiste")) return "덴티스테 (Dentiste)";
  if (name.includes("미스티포레스트") || name.includes("misty forest") || name.includes("rucipello")) return "루치펠로 (Rucipello)";
  if (name.includes("멀티케어") || name.includes("sensodyne") || name.includes("multicare")) return "센소다인 (Sensodyne)";
  if (name.includes("크로스액션") || name.includes("crossaction") || name.includes("oral-b")) return "오랄비 (Oral-B)";
  if (name.includes("구강청결제") || name.includes("mouthwash")) return "덴티스테 (Dentiste)";
  if (name.includes("쿨파스") || name.includes("cool patch") || name.includes("pain relief") || name.includes("antiphuramin")) return "안티푸라민 (Antiphuramin)";
  if (name.includes("관절 엠에스엠") || name.includes("joint msm") || name.includes("ckd")) return "종근당건강 (CKD)";
  if (name.includes("핫 파스") || name.includes("hot patch") || name.includes("ketotop")) return "케토톱 (Ketotop)";
  if (name.includes("비타민c") || name.includes("vitamin c")) return "고려은단 (Koryo Eundan)";
  if (name.includes("황사") || name.includes("kf94") || name.includes("boryung")) return "보령제약 (Boryung)";
  if (name.includes("손목 보호대") || name.includes("wrist supporter") || name.includes("gapo")) return "가포 (GAPO)";
  if (name.includes("종아리") || name.includes("calf air") || name.includes("7liner")) return "세븐라이너 (7Liner)";
  if (name.includes("저주파") || name.includes("low frequency") || name.includes("bodyfriend")) return "바디프랜드 (BODYFRIEND)";
  if (name.includes("혈압계") || name.includes("blood pressure") || name.includes("omron")) return "오므론 (OMRON)";
  if (name.includes("교정 밴드") || name.includes("posture corrector") || name.includes("duoback")) return "듀오백 (Duoback)";
  if (name.includes("순면 커버") || name.includes("cotton cover") || name.includes("good feel")) return "좋은느낌 (Good Feel)";
  if (name.includes("오버나이트") || name.includes("overnight") || name.includes("sofy")) return "쏘피 (Sofy)";
  if (name.includes("면달") || name.includes("cotton sanitary") || name.includes("organic bon")) return "유기농본 (Organic Bon)";
  if (name.includes("물티슈") || name.includes("wet wipes") || name.includes("kleenex")) return "크리넥스 (Kleenex)";
  if (name.includes("탐폰") || name.includes("tampon") || name.includes("tempo")) return "템포 (Tempo)";
  if (name.includes("스타킹") || name.includes("pantyhose") || name.includes("vivien")) return "비비안 (Vivien)";
  if (name.includes("무릎 반스타킹") || name.includes("knee-high") || name.includes("venus")) return "비너스 (Venus)";
  if (name.includes("덧신") || name.includes("no-show") || name.includes("wacoal")) return "신영와코루 (Wacoal)";
  if (name.includes("남성 양말") || name.includes("crew socks") || name.includes("sock co")) return "양말컴퍼니 (Sock Co)";
  if (name.includes("브래지어") || name.includes("brassiere") || name.includes("wonderbra")) return "원더브라 (Wonderbra)";
  if (name.includes("키친타올") || name.includes("kitchen towel") || name.includes("saenghwal")) return "생활공작소 (Saenghwal)";
  if (name.includes("먼지떨이") || name.includes("duster") || name.includes("jaju")) return "자주 (JAJU)";
  if (name.includes("슬리퍼") || name.includes("slipper") || name.includes("bath")) return "바스 (BATH)";
  if (name.includes("베개 커버") || name.includes("pillow cover") || name.includes("modern house")) return "모던하우스 (Modern House)";
  if (name.includes("분리수거함") || name.includes("trash bin") || name.includes("april shower")) return "에이프릴샤워 (April Shower)";
  if (name.includes("스피커") || name.includes("speaker") || name.includes("britz")) return "브리츠 (Britz)";
  if (name.includes("가습기") || name.includes("humidifier") || name.includes("oa")) return "오아 (OA)";
  if (name.includes("충전 케이블") || name.includes("charging cable") || name.includes("samsung")) return "삼성전자 (Samsung)";
  if (name.includes("손난로") || name.includes("hand warmer") || name.includes("iriver")) return "아이리버 (iriver)";
  if (name.includes("볼펜") || name.includes("ballpoint") || name.includes("monami")) return "모나미 (Monami)";
  if (name.includes("스티커") || name.includes("sticker") || name.includes("livework")) return "라이브워크 (Livework)";
  if (name.includes("형광펜") || name.includes("highlighter") || name.includes("iconic")) return "아이코닉 (Iconic)";
  if (name.includes("쌀 선크림") || name.includes("relief sun") || name.includes("beauty of joseon")) return "조선미녀 (Beauty of Joseon)";
  if (name.includes("워터 트리트먼트") || name.includes("water treatment") || name.includes("miracle 10")) return "모레모 (Moremo)";
  if (name.includes("퍼펙트 올인원") || name.includes("perfect all-in-one") || name.includes("ideal for men")) return "아이디얼 포 맨 (IDEAL FOR MEN)";
  if (name.includes("스킨워시") || name.includes("skin wash") || name.includes("ulos")) return "우르오스 (ULOS)";
  if (name.includes("블랙밤") || name.includes("black balm") || name.includes("dtrt")) return "다TR (DTRT)";
  if (name.includes("톤업크림") || name.includes("tone up cream") || name.includes("beready")) return "비레디 (BeREADY)";
  if (name.includes("핸섬 립밤") || name.includes("handsome lip balm") || name.includes("grafen")) return "그라펜 (GRAFEN)";
  if (name.includes("가벼운 선 젤") || name.includes("light sun gel") || name.includes("shingmulnara")) return "식물나라 (Shingmulnara)";
  if (name.includes("립앤아이 리무버") || name.includes("lip & eye remover")) return "아리얼 (Ariul)";
  if (name.includes("클렌징 밤") || name.includes("cleansing balm")) return "바닐라코 (BANILA CO)";
  if (name.includes("쑥 진정") || name.includes("artemisia calming")) return "한율 (Hanyul)";
  if (name.includes("허브 클렌징") || name.includes("herb green")) return "마녀공장 (Manyo)";
  if (name.includes("맑은 선크림") || name.includes("organic clear sunscreen")) return "조선미녀 (Beauty of Joseon)";
  if (name.includes("선 쿠션") || name.includes("sun cushion")) return "식물나라 (Shingmulnara)";
  if (name.includes("레이저 썬스크린") || name.includes("laser sunscreen")) return "셀퓨전씨 (Cell Fusion C)";
  if (name.includes("선 플러스") || name.includes("sun+")) return "닥터지 (Dr.G)";
  if (name.includes("선스틱") || name.includes("sunstick")) return "아넷사 (ANESSA)";
  if (name.includes("젤네일 패치") || name.includes("gel nail patch") || name.includes("dashing diva")) return "데싱디바 (Dashing Diva)";
  if (name.includes("젤네일 페디") || name.includes("gel nail pedi") || name.includes("ohora")) return "오호라 (ohora)";
  if (name.includes("젤스트립") || name.includes("gel strips") || name.includes("finger suit")) return "핑거수트 (FINGER SUIT)";
  if (name.includes("자작나무") || name.includes("birch")) return "라운드랩 (Round Lab)";
  if (name.includes("워터풀 에센스") || name.includes("waterful essence")) return "달바 (d'Alba)";
  if (name.includes("아이섀도우 브러시") || name.includes("eyeshadow brush") || name.includes("핑거 퍼프") || name.includes("finger puff") || name.includes("속눈썹 고데기") || name.includes("eyelash curler") || name.includes("헤어롤") || name.includes("hair roller")) return "필리밀리 (Fillimilli)";
  if (name.includes("이지 네일") || name.includes("easy nail") || name.includes("쏙오프") || name.includes("soak off")) return "웨이크메이크 (Wakemake)";
  if (name.includes("매트 왁스") || name.includes("matte wax")) return "그라펜 (GRAFEN)";
  if (name.includes("아티산") || name.includes("artisan")) return "존바바토스 (John Varvatos)";
  if (name.includes("위크엔드") || name.includes("weekend")) return "버버리 (Burberry)";
  if (name.includes("블랙체리") || name.includes("black cherry") || name.includes("양재동") || name.includes("flower market")) return "코코도르 (Cocodor)";
  if (name.includes("편백") || name.includes("hinoki") || name.includes("cypress")) return "라운드어라운드 (Round A Round)";
  if (name.includes("퓨어 코튼 홈") || name.includes("pure cotton home")) return "데일리콤마 (Daily Comma)";
  if (name.includes("스위트 가든") || name.includes("sweet garden")) return "양키캔들 (Yankee Candle)";
  if (name.includes("무선 마우스") || name.includes("wireless mouse") || name.includes("무소음 마우스") || name.includes("logitech") || name.includes("로지텍") || name.includes("무소음")) return "로지텍 (Logitech)";
  if (name.includes("그리드 유선 노트") || name.includes("grid note") || name.includes("스프링 그리드") || name.includes("motemote") || name.includes("모트모트")) return "모트모트 (Motemote)";
  if (name.includes("마이멜로디") || name.includes("my melody")) return "산리오 (Sanrio)";
  if (name.includes("아이소이") || name.includes("블레미쉬 케어") || name.includes("isoi")) return "아이소이 (isoi)";
  if (name.includes("잡티 세럼") || name.includes("green tangerine") || name.includes("청귤")) return "구달 (Goodal)";

  // 2. Fallback to category-based matching
  if (category === "maskpack") {
    if (name.includes("티트리")) return "메디힐 (Mediheal)";
    if (name.includes("어성초")) return "아비브 (Abib)";
    if (name.includes("다이브인") || name.includes("히알루론산")) return "토리든 (Torriden)";
    if (name.includes("콜라겐")) return "메디앤서 (MediAnswer)";
  }

  if (category === "skincare") {
    if (name.includes("어성초")) return "아누아 (Anua)";
    if (name.includes("다이브인") || name.includes("히알루론산")) return "토리든 (Torriden)";
    if (name.includes("독도")) return "라운드랩 (Round Lab)";
    if (name.includes("잡티 세럼")) return "아이소이 (isoi)";
  }

  return fallbackBrand;
}

export function getProductOliveYoungLink(mallType: "domestic" | "global", brand: string, name: string): string {
  const cleanBrand = brand.split("(")[0].trim();
  const queryStr = `${cleanBrand} ${name}`;
  if (mallType === "domestic") {
    return `https://www.oliveyoung.co.kr/store/search/getSearchList.do?query=${encodeURIComponent(queryStr)}`;
  } else {
    return `https://global.oliveyoung.com/main/getSearchList.do?query=${encodeURIComponent(queryStr)}`;
  }
}

export const baselineProducts: Product[] = generateBaselineProducts(
  "all",
  "domestic",
  new Date().toISOString()
);

export default baselineProducts;

