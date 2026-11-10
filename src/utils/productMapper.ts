/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, OliveYoungAttributes } from "../types";
import { getCorrectBrandForRule, getCorrectCategoryForRule, getStandardizedOliveYoungId } from "./hardcodedMapper";

// Official Olive Young Brand Translations (Domestic Kor <-> Global Eng)
export const BRAND_MAP: Record<string, { ko: string; en: string }> = {
  "메디힐 (Mediheal)": { ko: "메디힐", en: "MEDIHEAL" },
  "아비브 (Abib)": { ko: "아비브", en: "Abib" },
  "토리든 (Torriden)": { ko: "토리든", en: "Torriden" },
  "넘버즈인 (numbuzin)": { ko: "넘버즈인", en: "numbuzin" },
  "드림웍스 (Dreamworks)": { ko: "드림웍스", en: "Dreamworks" },
  "다자연 (All Natural)": { ko: "다자연", en: "All Natural" },
  "메디앤서 (MediAnswer)": { ko: "메디앤서", en: "MediAnswer" },
  "조선미녀 (Beauty of Joseon)": { ko: "조선미녀", en: "Beauty of Joseon" },
  "코스알엑스 (COSRX)": { ko: "코스알엑스", en: "COSRX" },
  "아누아 (Anua)": { ko: "아누아", en: "Anua" },
  "라운드랩 (Round Lab)": { ko: "라운드랩", en: "Round Lab" },
  "달바 (d'Alba)": { ko: "달바", en: "d'Alba" },
  "어노브 (UNOVE)": { ko: "어노브", en: "UNOVE" },
  "클리오 (Clio)": { ko: "클리오", en: "CLIO" },
  "롬앤 (Romand)": { ko: "롬앤", en: "rom&nd" },
  "오소몰 (Orthomol)": { ko: "오소몰", en: "Orthomol" },
  "아이소이 (isoi)": { ko: "아이소이", en: "isoi" },
  "에스트라 (AESTURA)": { ko: "에스트라", en: "AESTURA" },
  "한율 (Hanyul)": { ko: "한율", en: "Hanyul" },
  "마녀공장 (Manyo)": { ko: "마녀공장", en: "Manyo" },
  "구달 (Goodal)": { ko: "구달", en: "goodal" },
  "이니스프리 (Innisfree)": { ko: "이니스프리", en: "Innisfree" },
  "피지오겔 (Physiogel)": { ko: "피지오겔", en: "Physiogel" },
  "바닐라코 (BANILA CO)": { ko: "바닐라코", en: "BANILA CO" },
  "아리얼 (Ariul)": { ko: "아리얼", en: "Ariul" },
  "바이오더마 (Bioderma)": { ko: "바이오더마", en: "BIODERMA" },
  "폰즈 (Pond's)": { ko: "폰즈", en: "Pond's" },
  "메디필 (MEDI-PEEL)": { ko: "메디필", en: "MEDI-PEEL" },
  "식물나라 (Shingmulnara)": { ko: "식물나라", en: "Shingmulnara" },
  "셀퓨전씨 (Cell Fusion C)": { ko: "셀퓨전씨", en: "Cell Fusion C" },
  "닥터지 (Dr.G)": { ko: "닥터지", en: "Dr.G" },
  "아넷사 (ANESSA)": { ko: "아넷사", en: "ANESSA" },
  "페리페라 (Peripera)": { ko: "페리페라", en: "peripera" },
  "에스쁘아 (Espoir)": { ko: "에스쁘아", en: "espoir" },
  "헤라 (HERA)": { ko: "헤라", en: "HERA" },
  "뮤드 (mude)": { ko: "뮤드", en: "mude" },
  "투쿨포스쿨 (Too Cool For School)": { ko: "투쿨포스쿨", en: "Too Cool For School" },
  "웨이크메이크 (Wakemake)": { ko: "웨이크메이크", en: "WAKEMAKE" },
  "데싱디바 (Dashing Diva)": { ko: "데싱디바", en: "Dashing Diva" },
  "오호라 (ohora)": { ko: "오호라", en: "ohora" },
  "핑거수트 (FINGER SUIT)": { ko: "핑거수트", en: "FINGER SUIT" },
  "키스뉴욕 (KISS NEW YORK)": { ko: "키스뉴욕", en: "KISS NEW YORK" },
  "필리밀리 (Fillimilli)": { ko: "필리밀리", en: "Fillimilli" },
  "리얼테크닉스 (Real Techniques)": { ko: "리얼테크닉스", en: "Real Techniques" },
  "피카소 (Piccasso)": { ko: "피카소", en: "Piccasso" },
  "다이소 (Daiso)": { ko: "다이소", en: "Daiso" },
  "올리브영 (Olive Young)": { ko: "올리브영", en: "Olive Young" },
  "라로슈포제 (La Roche-Posay)": { ko: "라로슈포제", en: "La Roche-Posay" },
  "아벤느 (Avene)": { ko: "아벤느", en: "Avene" },
  "유리아쥬 (Uriage)": { ko: "유리아쥬", en: "Uriage" },
  "닥터자르트 (Dr.Jart+)": { ko: "닥터자르트", en: "Dr.Jart+" },
  "아이디얼 포 맨 (IDEAL FOR MEN)": { ko: "아이디얼 포 맨", en: "IDEAL FOR MEN" },
  "우르오스 (ULOS)": { ko: "우르오스", en: "ULOS" },
  "다TR (DTRT)": { ko: "DTRT", en: "DTRT" },
  "비레디 (BeREADY)": { ko: "비레디", en: "B.READY" },
  "그라펜 (GRAFEN)": { ko: "그라펜", en: "GRAFEN" },
  "포맨트 (Forment)": { ko: "포맨트", en: "Forment" },
  "클린 (Clean)": { ko: "클린", en: "CLEAN" },
  "랑방 (Lanvin)": { ko: "랑방", en: "Lanvin" },
  "클로에 (Chloe)": { ko: "클로에", en: "Chloé" },
  "존바바토스 (John Varvatos)": { ko: "존바바토스", en: "John Varvatos" },
  "버버리 (Burberry)": { ko: "버버리", en: "Burberry" },
  "양키캔들 (Yankee Candle)": { ko: "양키캔들", en: "Yankee Candle" },
  "코코도르 (Cocodor)": { ko: "코코도르", en: "Cocodor" },
  "라운드어라운드 (Round A Round)": { ko: "라운드어라운드", en: "ROUND A ROUND" },
  "헤이디 (Heidi)": { ko: "헤이디", en: "Heidi" },
  "데일리콤마 (Daily Comma)": { ko: "데일리콤마", en: "DAILY COMMA" },
  "모레모 (Moremo)": { ko: "모레모", en: "moremo" },
  "미쟝센 (Mise-en-scene)": { ko: "미쟝센", en: "mise en scene" },
  "라보에이치 (LABO-H)": { ko: "라보에이치", en: "LABO-H" },
  "닥터포헤어 (Dr.FORHAIR)": { ko: "닥터포헤어", en: "Dr.FORHAIR" },
  "그로우어스 (GROWUS)": { ko: "그로우어스", en: "GROWUS" },
  "일리윤 (Illiyoon)": { ko: "일리윤", en: "Illiyoon" },
  "세타필 (Cetaphil)": { ko: "세타필", en: "Cetaphil" },
  "더바디샵 (The Body Shop)": { ko: "더바디샵", en: "THE BODY SHOP" },
  "온더바디 (On The Body)": { ko: "온더바디", en: "ON THE BODY" },
  "해피바스 (Happy Bath)": { ko: "해피바스", en: "HAPPY BATH" },
  "더프트앤도프트 (Duft & Doft)": { ko: "더프트앤도프트", en: "DUFT&DOFT" },
  "정관장 (CheongKwanJang)": { ko: "정관장", en: "CheongKwanJang" },
  "락토핏 (Lacto-Fit)": { ko: "락토핏", en: "LACTO-FIT" },
  "고려은단 (Koryo Eundan)": { ko: "고려은단", en: "Koryo Eundan" },
  "씨제이웰케어 (CJ Wellcare)": { ko: "씨제이웰케어", en: "CJ Wellcare" },
  "비비랩 (BBLAB)": { ko: "비비랩", en: "BBLAB" },
  "딜라이트 프로젝트 (Delight Project)": { ko: "딜라이트 프로젝트", en: "Delight Project" },
  "티젠 (TEAZEN)": { ko: "티젠", en: "TEAZEN" },
  "오설록 (Osulloc)": { ko: "오설록", en: "OSULLOC" },
  "웅진 (Woongjin)": { ko: "웅진", en: "Woongjin" },
  "정식품 (Jeongsik)": { ko: "정식품", en: "Vegemil" },
  "덴티스테 (Dentiste)": { ko: "덴티스테", en: "DENTISTE" },
  "루치펠로 (Rucipello)": { ko: "루치펠로", en: "Rucipello" },
  "센소다인 (Sensodyne)": { ko: "센소다인", en: "Sensodyne" },
  "오랄비 (Oral-B)": { ko: "오랄비", en: "Oral-B" },
  "유한양행 (Yuhan)": { ko: "유한양행", en: "Yuhan" },
  "안티푸라민 (Antiphuramin)": { ko: "안티푸라민", en: "Antiphuramin" },
  "종근당건강 (CKD)": { ko: "종근당건강", en: "CKD" },
  "케토톱 (Ketotop)": { ko: "케토톱", en: "Ketotop" },
  "대웅제약 (Daewoong)": { ko: "대웅제약", en: "Daewoong" },
  "보령제약 (Boryung)": { ko: "보령제약", en: "Boryung" },
  "가포 (GAPO)": { ko: "가포", en: "GAPO" },
  "세븐라이너 (7Liner)": { ko: "세븐라이너", en: "7Liner" },
  "바디프랜드 (BODYFRIEND)": { ko: "바디프랜드", en: "BODYFRIEND" },
  "오므론 (OMRON)": { ko: "오므론", en: "OMRON" },
  "듀오백 (Duoback)": { ko: "듀오백", en: "Duoback" },
  "좋은느낌 (Good Feel)": { ko: "좋은느낌", en: "Good Feel" },
  "쏘피 (Sofy)": { ko: "쏘피", en: "Sofy" },
  "유기농본 (Organic Bon)": { ko: "유기농본", en: "Organic Bon" },
  "크리넥스 (Kleenex)": { ko: "크리넥스", en: "Kleenex" },
  "템포 (Tempo)": { ko: "템포", en: "Tempo" },
  "비비안 (Vivien)": { ko: "비비안", en: "Vivien" },
  "비너스 (Venus)": { ko: "비너스", en: "Venus" },
  "신영와코루 (Wacoal)": { ko: "신영와코루", en: "Wacoal" },
  "양말컴퍼니 (Sock Co)": { ko: "양말컴퍼니", en: "Sock Company" },
  "원더브라 (Wonderbra)": { ko: "원더브라", en: "Wonderbra" },
  "생활공작소 (Saenghwal)": { ko: "생활공작소", en: "Saenghwal" },
  "자주 (JAJU)": { ko: "자주", en: "JAJU" },
  "바스 (BATH)": { ko: "바스", en: "BATH" },
  "모던하우스 (Modern House)": { ko: "모던하우스", en: "Modern House" },
  "에이프릴샤워 (April Shower)": { ko: "에이프릴샤워", en: "April Shower" },
  "로지텍 (Logitech)": { ko: "로지텍", en: "Logitech" },
  "브리츠 (Britz)": { ko: "브리츠", en: "Britz" },
  "오아 (OA)": { ko: "오아", en: "OA" },
  "삼성전자 (Samsung)": { ko: "삼성전자", en: "SAMSUNG" },
  "아이리버 (iriver)": { ko: "아이리버", en: "iriver" },
  "모트모트 (Motemote)": { ko: "모트모트", en: "motemote" },
  "모나미 (Monami)": { ko: "모나미", en: "Monami" },
  "라이브워크 (Livework)": { ko: "라이브워크", en: "Livework" },
  "아이코닉 (Iconic)": { ko: "아이코닉", en: "Iconic" },
  "산리오 (Sanrio)": { ko: "산리오", en: "Sanrio" },
  "브이티 (VT)": { ko: "브이티", en: "VT" },
  "스킨1004 (SKIN1004)": { ko: "스킨1004", en: "SKIN1004" },
  "티르티르 (TIRTIR)": { ko: "티르티르", en: "TIRTIR" },
  "메디큐브 (medicube)": { ko: "메디큐브", en: "medicube" },
  "바이오던스 (Biodance)": { ko: "바이오던스", en: "Biodance" },
  "파티온 (FATION)": { ko: "파티온", en: "FATION" },
  "스킨푸드 (SKINFOOD)": { ko: "스킨푸드", en: "SKINFOOD" },
  "에뛰드 (ETUDE)": { ko: "에뛰드", en: "ETUDE" },
  "미샤 (MISSHA)": { ko: "미샤", en: "MISSHA" },
  "리쥬란 (REJURAN)": { ko: "리쥬란", en: "REJURAN" },
  "성분에디터 (SUNGBOON EDITOR)": { ko: "성분에디터", en: "SUNGBOON EDITOR" },
  "아로마티카 (AROMATICA)": { ko: "아로마티카", en: "AROMATICA" },
  "브링그린 (BRINGGREEN)": { ko: "브링그린", en: "BRINGGREEN" },
  "비플레인 (beplain)": { ko: "비플레인", en: "beplain" }
};

// Official Product Name Translations (Domestic <-> Global)
export const PRODUCT_TRANSLATIONS: Record<string, { ko: string; en: string }> = {
  // Maskpack Category (Crucial!)
  "티트리 에센셜 마스크팩": {
    ko: "티트리 에센셜 마스크",
    en: "Teatree Essential Mask"
  },
  "어성초 껌딱지 시트 마스크": {
    ko: "껌딱지 시트 마스크 어성초 스티커",
    en: "Gummy Sheet Mask Heartleaf Sticker"
  },
  "다이브인 저분자 히알루론산 마스크팩": {
    ko: "다이브인 저분자 히알루론산 마스크",
    en: "DIVE-IN Low Molecular Hyaluronic Acid Mask"
  },
  "콜라겐 겔 마스크": {
    ko: "콜라겐 겔 마스크",
    en: "Real Collagen Essential Gel Mask"
  },
  "슈렉팩 모공 수축 팩": {
    ko: "아임 더 리얼 슈렉팩",
    en: "I'm The Real Shrek Pack"
  },
  "마데카소사이드 흔적 패드": {
    ko: "마데카소사이드 흔적 패드",
    en: "Madecassoside Blemish Pad"
  },
  "어성초 진정 패드": {
    ko: "어성초 스팟 패드 카밍 터치",
    en: "Heartleaf Spot Pad Calming Touch"
  },

  // Skincare Category
  "다이브인 저분자 히알루론산 세럼": {
    ko: "다이브인 저분자 히알루론산 세럼",
    en: "DIVE-IN Low Molecular Hyaluronic Acid Serum"
  },
  "자작나무 수분 선크림": {
    ko: "자작나무 수분 선크림",
    en: "Birch Juice Moisturizing Sunscreen"
  },
  "어성초 77% 진정 토너": {
    ko: "어성초 77% 진정 토너",
    en: "Heartleaf 77% Soothing Toner"
  },
  "킬커버 더 뉴 파운웨어 쿠션": {
    ko: "킬커버 더 뉴 파운웨어 쿠션",
    en: "Kill Cover The New Founwear Cushion"
  },
  "딥 데미지 트리트먼트 EX": {
    ko: "딥 데미지 트리트먼트 EX",
    en: "Deep Damage Treatment EX"
  },
  "이뮨 멀티비타민": {
    ko: "이뮨 멀티비타민",
    en: "Immun Multivitamin"
  },
  "쫀득한 군고구마": {
    ko: "쫀득한 군고구마",
    en: "Chewy Roasted Sweet Potato"
  },
  "덴티스테 플러스화이트 치약": {
    ko: "플러스화이트 치약",
    en: "Dentiste Plus White Toothpaste"
  },
  "독도 토너": {
    ko: "1025 독도 토너",
    en: "1025 Dokdo Toner"
  },
  "화이트 트러플 퍼스트 스프레이 세럼": {
    ko: "화이트 트러플 퍼스트 스프레이 세럼",
    en: "White Truffle First Spray Serum"
  },
  "잡티 세럼": {
    ko: "청귤 비타C 잡티 케어 세럼",
    en: "Green Tangerine Vita C Dark Spot Care Serum"
  },
  "아토베리어365 크림": {
    ko: "아토베리어365 크림",
    en: "Atobarrier 365 Cream"
  },
  "비피다 바이옴 앰플": {
    ko: "비피다 바이옴 콤플렉스 앰플",
    en: "Bifida Biome Complex Ampoule"
  },
  "레티놀 시카 흔적 앰플": {
    ko: "레티놀 시카 흔적 앰플",
    en: "Retinol Cica Repair Ampoule"
  },
  "어드밴스드 스네일 96 뮤신 파워 에센스": {
    ko: "어드밴스드 스네일 96 뮤신 파워 에센스",
    en: "Advanced Snail 96 Mucin Power Essence"
  },
  "맑은 쌀 선크림": {
    ko: "맑은 쌀 선크림",
    en: "Relief Sun : Rice + Probiotics"
  },
  "산소수 가벼운 선 젤": {
    ko: "산소수 가벼운 선 젤",
    en: "Oxygen Water Light Sun Gel"
  },
  "워터 트리트먼트 미라클 10": {
    ko: "워터 트리트먼트 미라클 10",
    en: "Water Treatment Miracle 10"
  },

  // Cleansing
  "퓨어 클렌징 오일": {
    ko: "퓨어 클렌징 오일",
    en: "Pure Cleansing Oil"
  },
  "클린 잇 제로 클렌징 밤": {
    ko: "클린 잇 제로 클렌징 밤",
    en: "Clean It Zero Cleansing Balm"
  },
  "스트레스 릴리프 립앤아이 리무버": {
    ko: "스트레스 릴리프 립앤아이 리무버",
    en: "Stress Relief Lip & Eye Remover"
  },
  "센시비오 H2O 클렌징워터": {
    ko: "센시비오 H2O 클렌징워터",
    en: "Sensibio H2O Micellar Water"
  },
  "쏙 클렌징 폼": {
    ko: "딥 포어 클렌징 폼",
    en: "Deep Pore Cleansing Foam"
  },
  "쑥 진정 클렌징 워터": {
    ko: "쑥 진정 클렌징 워터",
    en: "Artemisia Calming Cleansing Water"
  },
  "허브 클렌징 오일": {
    ko: "허브 그린 클렌징 오일",
    en: "Herb Green Cleansing Oil"
  },

  // Suncare
  "유기농 맑은 선크림": {
    ko: "유기농 맑은 선크림",
    en: "Organic Clear Sunscreen"
  },
  "산소수 톤업 선 쿠션": {
    ko: "산소수 톤업 선 쿠션",
    en: "Oxygen Water Tone Up Sun Cushion"
  },
  "레이저 썬스크린": {
    ko: "레이저 썬스크린 100",
    en: "Laser Sunscreen 100"
  },
  "그린 마일드 업 선 플러스": {
    ko: "그린 마일드 업 선 플러스",
    en: "Green Mild Up Sun+"
  },
  "워터풀 에센스 선크림": {
    ko: "워터풀 에센스 선크림",
    en: "Waterfull Essence Sunscreen"
  },
  "선스틱 레포츠": {
    ko: "선스틱 레포츠",
    en: "Sports Sunstick"
  },

  // Makeup
  "쥬시 래스팅 틴트": {
    ko: "쥬시 래스팅 틴트",
    en: "Juicy Lasting Tint"
  },
  "잉크 더 벨벳 틴트": {
    ko: "잉크 더 벨벳 틴트",
    en: "Ink The Velvet Tint"
  },
  "워터 벨벳 틴트": {
    ko: "워터 벨벳 틴트",
    en: "Water Velvet Tint"
  },
  "바이로댕 쉐이딩": {
    ko: "아트클래스 바이로댕 쉐이딩",
    en: "Artclass By Rodin Shading"
  },
  "프로 아이 팔레트": {
    ko: "프로 아이 팔레트",
    en: "Pro Eye Palette"
  },
  "인스파이어 롱래쉬 마스카라": {
    ko: "인스파이어 롱래쉬 마스카라",
    en: "Inspire Longlash Mascara"
  },

  // Nail
  "글레이즈 젤네일 패치": {
    ko: "글레이즈 젤네일 패치",
    en: "Glaze Gel Nail Patch"
  },
  "세미큐어 젤네일 페디": {
    ko: "세미큐어 젤네일 페디",
    en: "Semi-Cure Gel Nail Pedi"
  },
  "프리미엄 젤스트립": {
    ko: "프리미엄 젤스트립",
    en: "Premium Gel Strips"
  },
  "이지 네일 스티커": {
    ko: "이지 네일 스티커",
    en: "Easy Nail Sticker"
  },
  "쏙오프 네일 리무버": {
    ko: "쏙오프 네일 리무버",
    en: "Soak Off Nail Remover"
  },

  // Beauty Tools
  "아이섀도우 브러시 세트": {
    ko: "아이섀도우 브러시 세트",
    en: "Eyeshadow Brush Set"
  },
  "메이크업 스파출라": {
    ko: "메이크업 스파출라",
    en: "Makeup Spatula"
  },
  "메이크업 핑거 퍼프": {
    ko: "메이크업 핑거 퍼프",
    en: "Makeup Finger Puff"
  },
  "속눈썹 고데기": {
    ko: "속눈썹 고데기",
    en: "Heated Eyelash Curler"
  },
  "화장솜 100매": {
    ko: "화장솜 100매",
    en: "Premium Cotton Pads 100P"
  },
  "앞머리 헤어롤": {
    ko: "앞머리 헤어롤",
    en: "Hair Rollers"
  },
  "파운데이션 브러시": {
    ko: "파운데이션 브러시",
    en: "Foundation Brush"
  },

  // Dermo Cosmetics
  "시카플라스트 밤 B5": {
    ko: "시카플라스트 밤 B5",
    en: "Cicaplast Baume B5"
  },
  "오 떼르말 온천수 미스트": {
    ko: "오 떼르말 온천수 미스트",
    en: "Thermal Spring Water Mist"
  },
  "제모스 토너": {
    ko: "제모스 토너",
    en: "Xemose Toner"
  },
  "데일리 모이스처 페이셜 크림": {
    ko: "데일리 모이스처 페이셜 크림",
    en: "Daily Moisture Therapy Facial Cream"
  },
  "시카페어 리커버 크림": {
    ko: "시카페어 리커버 크림",
    en: "Cicapair Tiger Grass Color Correcting Treatment"
  },

  // Mens Edit
  "퍼펙트 올인원 밀크": {
    ko: "퍼펙트 올인원 밀크",
    en: "Perfect All-In-One Milk"
  },
  "스킨워시 바디 앤 페이스": {
    ko: "스킨워시 바디 앤 페이스",
    en: "Skin Wash Body & Face"
  },
  "블랙밤 립밤": {
    ko: "블랙밤 립밤",
    en: "Black Balm Dual Lip Balm"
  },
  "에어리 텐션 톤업크림": {
    ko: "에어리 텐션 톤업크림",
    en: "Airy Tension Tone Up Cream"
  },
  "트리플 핸섬 립밤": {
    ko: "트리플 핸섬 립밤",
    en: "Triple Handsome Lip Balm"
  },
  "매트 왁스 수퍼 홀드": {
    ko: "매트 왁스 수퍼 홀드",
    en: "Matte Wax Super Hold"
  },

  // Perfume
  "웜코튼 오드퍼퓸": {
    ko: "웜코튼 오드퍼퓸",
    en: "Warm Cotton Eau de Parfum"
  },
  "시그니처 퍼퓸 코튼허그": {
    ko: "시그니처 퍼퓸 코튼허그",
    en: "Signature Perfume Cotton Hug"
  },
  "에끌라 드 아르페쥬": {
    ko: "에끌라 드 아르페쥬",
    en: "Eclat d'Arpege"
  },
  "시그니처 로즈 오드퍼퓸": {
    ko: "시그니처 로즈 오드퍼퓸",
    en: "Signature Rose Eau de Parfum"
  },
  "아티산 오드뚜왈렛": {
    ko: "아티산 오드뚜왈렛",
    en: "Artisan Eau de Toilette"
  },
  "위크엔드 포 맨": {
    ko: "위크엔드 포 맨",
    en: "Weekend For Men"
  },

  // Diffuser
  "블랙체리 디퓨저": {
    ko: "블랙체리 디퓨저",
    en: "Black Cherry Diffuser"
  },
  "양재동 꽃시장 디퓨저": {
    ko: "양재동 꽃시장 디퓨저",
    en: "Flower Market Diffuser"
  },
  "편백 숲 향 디퓨저": {
    ko: "편백 숲 향 디퓨저",
    en: "Cypress Forest Diffuser"
  },
  "퓨어 코튼 홈 디퓨저": {
    ko: "퓨어 코튼 홈 디퓨저",
    en: "Pure Cotton Home Diffuser"
  },
  "스위트 가든 소이캔들": {
    ko: "스위트 가든 소이캔들",
    en: "Sweet Garden Soy Candle"
  },

  // Haircare
  "헤어 에센스 딜라이트풀 오일": {
    ko: "헤어 에센스 딜라이트풀 오일",
    en: "Delightful Hair Essence Oil"
  },
  "데미지 케어 퍼펙트 세럼": {
    ko: "데미지 케어 퍼펙트 세럼",
    en: "Perfect Serum Damage Care"
  },
  "탈모증상완화 두피 샴푸": {
    ko: "탈모증상완화 두피 샴푸",
    en: "Anti-Hair Loss Scalp Shampoo"
  },
  "폴리젠 샴푸": {
    ko: "폴리젠 샴푸",
    en: "Folligen Shampoo"
  },
  "씨솔트 테라피 두피 스케일러": {
    ko: "씨솔트 테라피 두피 스케일러",
    en: "Sea Salt Therapy Scalp Scaler"
  },

  // Bodycare
  "세라마이드 아토 로션": {
    ko: "세라마이드 아토 로션",
    en: "Ceramide Ato Lotion"
  },
  "모이스춰라이징 로션": {
    ko: "모이스춰라이징 로션",
    en: "Moisturizing Lotion"
  },
  "티트리 바디워시": {
    ko: "티트리 바디워시",
    en: "Teatree Body Wash"
  },
  "화이트머스크 바디로션": {
    ko: "화이트머스크 바디로션",
    en: "White Musk Body Lotion"
  },
  "내추럴 바디워시": {
    ko: "내추럴 바디워시",
    en: "Natural Body Wash"
  },
  "소피플라워 핸드크림": {
    ko: "소피플라워 핸드크림",
    en: "Sophy Flower Hand Cream"
  },

  // Health food
  "홍삼정 에브리타임": {
    ko: "홍삼정 에브리타임",
    en: "Korean Red Ginseng Extract Everytime"
  },
  "생유산균 골드": {
    ko: "생유산균 골드",
    en: "Lacto-fit Probiotics Gold"
  },
  "멀티비타민 미네랄 1000": {
    ko: "멀티비타민 미네랄 1000",
    en: "Multivitamin Mineral 1000"
  },
  "이너비 아쿠아뱅크": {
    ko: "이너비 아쿠아뱅크",
    en: "Innerb Aqua Bank"
  },
  "저분자 콜라겐 파우더": {
    ko: "저분자 콜라겐 파우더",
    en: "Low Molecular Collagen Powder"
  },

  // Food
  "베이글칩 갈릭버터": {
    ko: "베이글칩 갈릭버터",
    en: "Garlic Butter Bagel Chip"
  },
  "콤부차 레몬": {
    ko: "콤부차 레몬",
    en: "Teazen Kombucha Lemon"
  },
  "제주 유기농 녹차 티백": {
    ko: "제주 유기농 녹차 티백",
    en: "Jeju Organic Green Tea Bags"
  },
  "하늘보리": {
    ko: "하늘보리",
    en: "Barley Tea"
  },
  "담백한 베지밀A": {
    ko: "담백한 베지밀A",
    en: "Vegemil A Soy Milk"
  },

  // Oral care
  "미스티포레스트 치약": {
    ko: "미스티포레스트 치약",
    en: "Misty Forest Toothpaste"
  },
  "멀티케어 치약": {
    ko: "멀티케어 치약",
    en: "Multicare Toothpaste"
  },
  "크로스액션 칫솔 세트": {
    ko: "크로스액션 칫솔 세트",
    en: "CrossAction Toothbrush Set"
  },
  "구강청결제 오리지널": {
    ko: "구강청결제 오리지널",
    en: "Mouthwash Original"
  },

  // Health
  "안티푸라민 쿨파스": {
    ko: "안티푸라민 쿨파스",
    en: "Pain Relief Cool Patch"
  },
  "관절 엠에스엠": {
    ko: "관절 엠에스엠",
    en: "Joint MSM Formula"
  },
  "핫 파스 밴드": {
    ko: "핫 파스 밴드",
    en: "Hot Patch Band"
  },
  "비타민C 활력 영양제": {
    ko: "비타민C 활력 영양제",
    en: "Vitamin C Vitality Supplement"
  },
  "황사 방역 마스크 KF94": {
    ko: "황사 방역 마스크 KF94",
    en: "Yellow Dust KF94 Protection Mask"
  },

  // Health Goods
  "손목 보호대 슬림핏": {
    ko: "손목 보호대 슬림핏",
    en: "Wrist Supporter Slim Fit"
  },
  "종아리 공기압 마사지기": {
    ko: "종아리 공기압 마사지기",
    en: "Calf Air Compression Massager"
  },
  "저주파 안마 패치": {
    ko: "저주파 안마 패치",
    en: "Low Frequency Massage Patch"
  },
  "자동 전자 혈압계": {
    ko: "자동 전자 혈압계",
    en: "Automatic Digital Blood Pressure Monitor"
  },
  "바른자세 교정 밴드": {
    ko: "바른자세 교정 밴드",
    en: "Posture Corrector Band"
  },

  // Hygiene
  "유기농 순면 커버 생리대": {
    ko: "유기농 순면 커버 생리대",
    en: "Organic Cotton Cover Sanitary Pads"
  },
  "입는 오버나이트": {
    ko: "입는 오버나이트",
    en: "Overnight Panty Sanitary Pads"
  },
  "유기농 면달 생리대": {
    ko: "유기농 면달 생리대",
    en: "Organic Cotton Sanitary Pads"
  },
  "안심 물티슈": {
    ko: "안심 물티슈",
    en: "Safe Wet Wipes"
  },
  "레귤러 탐폰": {
    ko: "레귤러 탐폰",
    en: "Regular Tampons"
  },

  // Fashion
  "살색 팬티스타킹 5족": {
    ko: "살색 팬티스타킹 5족",
    en: "Skin-tone Pantyhose 5-pack"
  },
  "압박 무릎 반스타킹": {
    ko: "압박 무릎 반스타킹",
    en: "Compression Knee-high Stockings"
  },
  "면 100% 무봉제 덧신": {
    ko: "면 100% 무봉제 덧신",
    en: "100% Cotton Seamless No-show Socks"
  },
  "스포츠 기능성 남성 양말": {
    ko: "스포츠 기능성 남성 양말",
    en: "Men's Athletic Crew Socks"
  },
  "심리스 노와이어 브래지어": {
    ko: "심리스 노와이어 브래지어",
    en: "Seamless Wireless Brassiere"
  },

  // Homeliving
  "뽑아쓰는 키친타올": {
    ko: "뽑아쓰는 키친타올",
    en: "Pop-up Kitchen Towels"
  },
  "부직포 먼지떨이 리필": {
    ko: "부직포 먼지떨이 리필",
    en: "Disposable Duster Refills"
  },
  "실리콘 욕실 슬리퍼": {
    ko: "실리콘 욕실 슬리퍼",
    en: "Silicone Bathroom Slippers"
  },
  "초극세사 원룸 베개 커버": {
    ko: "초극세사 원룸 베개 커버",
    en: "Microfiber Pillow Cover"
  },
  "스마트 원터치 자동 분리수거함": {
    ko: "스마트 원터치 자동 분리수거함",
    en: "Smart One-touch Trash Bin"
  },

  // Digital Hobby
  "무소음 무선 마우스": {
    ko: "무소음 무선 마우스",
    en: "Silent Wireless Mouse"
  },
  "블루투스 무선 스피커": {
    ko: "블루투스 무선 스피커",
    en: "Bluetooth Wireless Speaker"
  },
  "에어 워셔 초음파 가습기": {
    ko: "에어 워셔 초음파 가습기",
    en: "Ultrasonic Air Humidifier"
  },
  "C타입 고속 충전 케이블": {
    ko: "C타입 고속 충전 케이블",
    en: "USB Type-C Fast Charging Cable"
  },
  "휴대용 미니 손난로": {
    ko: "휴대용 미니 손난로",
    en: "Portable Pocket Hand Warmer"
  },

  // Fancy
  "스프링 그리드 유선 노트": {
    ko: "스프링 그리드 유선 노트",
    en: "Spring Grid Lined Notebook"
  },
  "153 볼펜 12색 세트": {
    ko: "153 볼펜 12색 세트",
    en: "153 Ballpoint Pen 12-Color Set"
  },
  "투명 다이어리 꾸미기 스티커": {
    ko: "투명 다이어리 꾸미기 스티커",
    en: "Clear Diary Deco Stickers"
  },
  "파스텔 듀얼 형광펜": {
    ko: "파스텔 듀얼 형광펜",
    en: "Pastel Dual Tip Highlighters"
  },
  "마이멜로디 캐릭터 필통": {
    ko: "마이멜로디 캐릭터 필통",
    en: "My Melody Pencil Case"
  }
};

// Standard Attribute Mapping is imported from types.ts

/**
 * Normalizes brand names to match the official Olive Young system.
 */
export function normalizeBrand(rawBrand: string, mallType: "domestic" | "global"): string {
  const brandKey = Object.keys(BRAND_MAP).find(
    k => k.toLowerCase().includes(rawBrand.toLowerCase()) || rawBrand.toLowerCase().includes(k.toLowerCase())
  );

  if (brandKey) {
    const item = BRAND_MAP[brandKey];
    return mallType === "domestic" ? item.ko : item.en;
  }

  // Fallback cleanly
  const koPart = rawBrand.split(" (")[0].trim();
  const enPart = rawBrand.match(/\(([^)]+)\)/)?.[1]?.trim() || koPart;
  return mallType === "domestic" ? koPart : enPart;
}

/**
 * Normalizes product names and resolves languages cleanly.
 */
export function normalizeProductName(
  rawName: string,
  category: string,
  mallType: "domestic" | "global"
): string {
  let matchedTranslation = "";
  
  // Clean and robust dictionary lookup that searches for complete substring matches in either language
  const dictKey = Object.keys(PRODUCT_TRANSLATIONS).find(k => {
    if (rawName === k) return true;
    if (rawName.includes(k)) return true;
    
    const item = PRODUCT_TRANSLATIONS[k];
    if (rawName.toLowerCase().includes(item.en.toLowerCase())) return true;
    if (rawName.includes(item.ko)) return true;
    
    return false;
  });

  if (dictKey) {
    matchedTranslation = mallType === "domestic" ? PRODUCT_TRANSLATIONS[dictKey].ko : PRODUCT_TRANSLATIONS[dictKey].en;
  } else {
    // Exact fallback to clean up trailing spec suffix if dict didn't match (with word boundaries to avoid partial word truncation)
    matchedTranslation = rawName
      .replace(/^\[(?:기획|단독|증정)\]\s*/i, "")
      .replace(/\s+\b(?:\d+\s*(?:ml|g|매|매입|개입|포|정)|1\+1|2\+1|3\+1|기획세트|기획|더블|한정|대용량|본품\+리필|Special Set|Double Pack|1\+1 Set|Jumbo|30-Day Pack|10-Pack)\b.*$/i, "")
      .trim();
  }

  // Parse out suffix/attributes to reconstruct properly
  const attrs = parseOliveYoungAttributes(rawName, mallType, category);

  // Reconstruct name standard matching Olive Young official layout:
  // Domestic: "[기획] 브랜드 제품명 + 속성/규량"
  // Global: "브랜드 제품명 + 속성/규량"
  let formattedName = matchedTranslation;

  if (mallType === "domestic") {
    // Olive Young often puts [기획] or [단독] as a prefix
    const prefix = attrs.isSpecial ? "[기획] " : attrs.isGift ? "[증정] " : "";
    formattedName = `${prefix}${matchedTranslation} ${attrs.specText}`;
  } else {
    formattedName = `${matchedTranslation} ${attrs.specText}`;
  }

  return formattedName.replace(/\s+/g, " ").trim();
}

/**
 * Extract specific attributes like package type, size, sheets, etc.
 */
export function parseOliveYoungAttributes(
  name: string,
  mallType: "domestic" | "global",
  category?: string
): OliveYoungAttributes {
  const cleanName = name.toLowerCase();

  let isSpecial = cleanName.includes("기획") || cleanName.includes("special") || cleanName.includes("exclusive") || cleanName.includes("limited") || cleanName.includes("한정") || cleanName.includes("에디션") || cleanName.includes("edition");
  let isGift = cleanName.includes("증정") || cleanName.includes("gift") || cleanName.includes("사은품");
  let isDouble = cleanName.includes("더블") || cleanName.includes("double") || cleanName.includes("1+1") || cleanName.includes("2+1") || cleanName.includes("3+1") || cleanName.includes("듀오") || cleanName.includes("duo");
  let isSingle = !isSpecial && !isDouble && !isGift;

  if (cleanName.includes("단품") || cleanName.includes("single")) {
    isSingle = true;
    isSpecial = false;
    isDouble = false;
    isGift = false;
  }

  // Refined packaging type mapping that captures combination configurations
  let packageType = mallType === "domestic" ? "일반 단품" : "Single Item";
  if (isSpecial && isDouble) {
    packageType = mallType === "domestic" ? "1+1 기획 세트" : "1+1 Special Set";
  } else if (isSpecial && isGift) {
    packageType = mallType === "domestic" ? "증정 기획 세트" : "Special Set (+Gift)";
  } else if (isSpecial) {
    packageType = mallType === "domestic" ? "기획 세트" : "Special Set";
  } else if (isDouble) {
    packageType = mallType === "domestic" ? "더블 기획" : "Double Set";
  } else if (isGift) {
    packageType = mallType === "domestic" ? "증정 기획" : "Promo Set";
  }

  // Robust parsing for volume and count
  let volume = "";
  let count = 1;

  // Regexes for precise parsing
  const sheetComboMatch = name.match(/(\d+)\s*(?:매입|매|포|정|개입|개(?!월)|sheets|pads|pad|패드)?\s*\+\s*(\d+)\s*(?:매입|매|포|정|개입|개(?!월)|sheets|pads|pad|패드)/i);
  const refillMatch = cleanName.includes("본품+리필") || cleanName.includes("본품 + 리필") || cleanName.includes("main+refill") || cleanName.includes("main + refill") || cleanName.includes("리필기획");
  const comboMatch = name.match(/(\d+(?:\.\d+)?\s*(?:ml|g))\s*\+\s*(\d+(?:\.\d+)?\s*(?:ml|g))/i);
  const multiMatch = name.match(/(\d+(?:\.\d+)?\s*(?:ml|g))\s*(?:\*|x|✖️)\s*(\d+)/i);
  const singleMatch = name.match(/(\d+(?:\.\d+)?\s*(?:ml|g|kg|l))/i);
  const sheetMatch = name.match(/(\d+)\s*(매입|매|포|정|병|개입|개(?!월)|sheets|pads|pad|패드|t|capsules|pcs|pieces)/i);

  if (sheetComboMatch) {
    const s1 = parseInt(sheetComboMatch[1], 10);
    const s2 = parseInt(sheetComboMatch[2], 10);
    count = s1 + s2;
    volume = mallType === "domestic" ? `${count}매` : `${count} Sheets`;
    isSpecial = true;
  } else if (refillMatch) {
    volume = mallType === "domestic" ? "본품 + 리필" : "Main + Refill";
    count = 2;
    isSpecial = true;
  } else if (comboMatch) {
    volume = `${comboMatch[1].trim()} + ${comboMatch[2].trim()}`;
    count = 2;
  } else if (multiMatch) {
    volume = `${multiMatch[1].trim()} x ${multiMatch[2].trim()}`;
    count = parseInt(multiMatch[2], 10) || 1;
  } else if (singleMatch) {
    const singleVol = singleMatch[1].trim();
    if (isDouble) {
      volume = `${singleVol} x 2`;
      count = 2;
    } else {
      volume = singleVol;
      count = 1;
    }
  } else if (sheetMatch) {
    const baseSheets = parseInt(sheetMatch[1], 10) || 1;
    const rawUnit = sheetMatch[2];
    if (isDouble) {
      count = baseSheets * 2;
    } else {
      count = baseSheets;
    }
    const unitLabel =
      mallType === "domestic"
        ? /포|정|병/.test(rawUnit)
          ? rawUnit
          : "매"
        : "Sheets";
    volume = `${count}${unitLabel}`;
  }

  // Adjust count based on packaging multipliers if not already handled
  if (!sheetComboMatch && !refillMatch && !comboMatch && !multiMatch && !singleMatch && !sheetMatch) {
    if (cleanName.includes("1+1") || cleanName.includes("더블") || cleanName.includes("double")) {
      count = 2;
    } else if (cleanName.includes("2+1")) {
      count = 3;
    } else if (cleanName.includes("3+1")) {
      count = 4;
    }
  }

  // Fallback defaults if volume couldn't be parsed
  if (!volume) {
    if (category === "maskpack") {
      volume = mallType === "domestic" ? "10매" : "10 Sheets";
      count = 10;
    } else if (category === "makeup" || category === "nail") {
      volume = mallType === "domestic" ? "단품" : "1 Unit";
      count = 1;
    } else {
      volume = mallType === "domestic" ? "단품" : "Standard";
      count = 1;
    }
  }

  // Construct standard spec text & quantity string
  let quantity = mallType === "domestic" ? `${count}개입` : `${count} Unit${count > 1 ? "s" : ""}`;
  if (category === "maskpack" || cleanName.includes("sheet") || cleanName.includes("패드") || cleanName.includes("pad")) {
    quantity = mallType === "domestic" ? `${count}매입` : `${count} Sheets`;
  }

  let specText = volume;
  if (isDouble && !specText.includes("+") && !specText.includes("x") && !specText.includes("1+1")) {
    specText += mallType === "domestic" ? " 1+1" : " 1+1 Duo";
  }
  if (isSpecial && !specText.includes("기획") && !specText.includes("Special")) {
    specText += mallType === "domestic" ? " 기획" : " Special";
  }

  return {
    isSpecial,
    isSingle,
    isDouble,
    isGift,
    packageType,
    quantity,
    specText,
    volume,
    count
  };
}

/**
 * Filter product data safely across the application.
 */
export function filterProductsByCriteria(
  products: Product[],
  filters: {
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    isPackageOnly?: boolean;
    rating?: number;
  }
): Product[] {
  return products.filter(p => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(searchLower);
      const brandMatch = p.brand.toLowerCase().includes(searchLower);
      if (!nameMatch && !brandMatch) return false;
    }

    if (filters.brand && filters.brand !== "all") {
      if (p.brand !== filters.brand) return false;
    }

    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;

    if (filters.isPackageOnly) {
      const attrs = parseOliveYoungAttributes(p.name, p.mallType, p.category);
      if (!attrs.isSpecial && !attrs.isDouble && !attrs.isGift) return false;
    }

    if (filters.rating !== undefined && p.rating < filters.rating) return false;

    return true;
  });
}

export function getPriceForProductName(name: string, category?: string): { price: number; originalPrice: number } {
  let basePrice = 15000; // default fallback
  let originalPrice = 20000;
  const lowerName = name.toLowerCase();
  
  // 1. Resolve category context early to avoid redundant checks
  let cat = category;
  if (!cat) {
    if (lowerName.includes("마스크팩") || lowerName.includes("패드") || lowerName.includes("팩") || lowerName.includes("마스크") || lowerName.includes("mask")) cat = "maskpack";
    else if (lowerName.includes("클렌징") || lowerName.includes("폼") || lowerName.includes("리무버")) cat = "cleansing";
    else if (lowerName.includes("선크림") || lowerName.includes("선스틱") || lowerName.includes("선 쿠션")) cat = "suncare";
    else if (lowerName.includes("틴트") || lowerName.includes("쿠션") || lowerName.includes("쉐이딩") || lowerName.includes("팔레트")) cat = "makeup";
    else if (lowerName.includes("네일") || lowerName.includes("페디")) cat = "nail";
    else if (lowerName.includes("브러시") || lowerName.includes("스파출라") || lowerName.includes("화장솜")) cat = "beauty_tools";
    else if (lowerName.includes("시카플라스트") || lowerName.includes("온천수") || lowerName.includes("미스트")) cat = "dermo_cosmetics";
    else if (lowerName.includes("올인원") || lowerName.includes("블랙밤") || lowerName.includes("왁스")) cat = "mens_edit";
    else if (lowerName.includes("오드퍼퓸") || lowerName.includes("퍼퓸") || lowerName.includes("뚜왈렛")) cat = "perfume";
    else if (lowerName.includes("디퓨저") || lowerName.includes("캔들")) cat = "diffuser";
    else if (lowerName.includes("트리트먼트") || lowerName.includes("샴푸") || lowerName.includes("헤어")) cat = "haircare";
    else if (lowerName.includes("로션") || lowerName.includes("바디워시") || lowerName.includes("크림")) cat = "bodycare";
    else if (lowerName.includes("비타민") || lowerName.includes("콜라겐") || lowerName.includes("유산균")) cat = "health_food";
    else if (lowerName.includes("콤부차") || lowerName.includes("고구마") || lowerName.includes("푸드")) cat = "food";
    else if (lowerName.includes("치약") || lowerName.includes("칫솔")) cat = "oral_care";
    else if (lowerName.includes("생리대") || lowerName.includes("쏘피") || lowerName.includes("본")) cat = "hygiene";
  }

  // 2. Handle Single-unit Sheet Mask / Maskpack / Spot Patch items (Realistic 1,500 ~ 3,500 KRW)
  const isMaskProduct = (cat === "maskpack" || lowerName.includes("마스크") || lowerName.includes("mask") || lowerName.includes("시트"));
  const hasSingleUnitIndicator = (
    lowerName.includes("1매") || 
    lowerName.includes("1개입") || 
    lowerName.includes("단품") || 
    lowerName.includes("single") || 
    lowerName.includes("1pc") || 
    lowerName.includes("1ea") || 
    lowerName.includes("1 sheet")
  );

  if (isMaskProduct && hasSingleUnitIndicator) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    basePrice = 1500 + (positiveHash % 5) * 500; // 1500, 2000, 2500, 3000, 3500 KRW
    originalPrice = basePrice + 1000 + (positiveHash % 3) * 500; // realistic markup
    
    // Calculate realistic discount
    const discountPercent = 20 + (positiveHash % 4) * 5; // 20%, 25%, 30%, 35%
    originalPrice = Math.round((basePrice / (1 - discountPercent / 100)) / 100) * 100;
    if (originalPrice <= basePrice) {
      originalPrice = Math.round((basePrice * 1.3) / 100) * 100;
    }
    return { price: basePrice, originalPrice };
  }

  // Specific famous products with realistic actual retail prices
  if (lowerName.includes("맑은 쌀 선크림") || lowerName.includes("relief sun")) {
    basePrice = 18000;
    originalPrice = 24000;
  } else if (lowerName.includes("다이브인 저분자 히알루론산 세럼") || lowerName.includes("snail 96 mucin")) {
    basePrice = 21000;
    originalPrice = 28000;
  } else if (lowerName.includes("어성초 77% 진정 토너") || lowerName.includes("heartleaf 77%")) {
    basePrice = 23000;
    originalPrice = 30000;
  } else if (lowerName.includes("독도 토너") || lowerName.includes("dokdo toner")) {
    basePrice = 15000;
    originalPrice = 20000;
  } else if (lowerName.includes("이뮨 멀티비타민") || lowerName.includes("orthomol")) {
    basePrice = 64000;
    originalPrice = 85000;
  } else if (lowerName.includes("홍삼정") || lowerName.includes("에브리타임")) {
    basePrice = 48000;
    originalPrice = 60000;
  } else if (lowerName.includes("생유산균") || lowerName.includes("lacto-fit")) {
    basePrice = 16900;
    originalPrice = 22900;
  } else if (lowerName.includes("군고구마") || lowerName.includes("roasted sweet potato")) {
    basePrice = 2500;
    originalPrice = 3500;
  } else if (lowerName.includes("치약") || lowerName.includes("덴티스테") || lowerName.includes("치약")) {
    basePrice = 9800;
    originalPrice = 13500;
  } else if (lowerName.includes("티트리 에센셜 마스크팩") || lowerName.includes("teatree essential")) {
    basePrice = 16000; // 10-pack price
    originalPrice = 30000;
  } else if (lowerName.includes("마스크팩") || lowerName.includes("시트 마스크") || lowerName.includes("maskpack") || lowerName.includes("sheet mask")) {
    if (lowerName.includes("10매") || lowerName.includes("10ea") || lowerName.includes("set") || lowerName.includes("세트") || lowerName.includes("더블") || lowerName.includes("pack")) {
      basePrice = 15000;
      originalPrice = 25000;
    } else {
      basePrice = 2500;
      originalPrice = 4000;
    }
  } else if (lowerName.includes("화장솜")) {
    basePrice = 2500;
    originalPrice = 3000;
  } else if (lowerName.includes("베이글칩")) {
    basePrice = 2300;
    originalPrice = 3000;
  } else if (lowerName.includes("콤부차")) {
    basePrice = 7500;
    originalPrice = 9900;
  } else {
    // If not a specific famous product, let's determine price based on category
    let cat = category;
    if (!cat) {
      if (lowerName.includes("마스크팩") || lowerName.includes("패드") || lowerName.includes("팩")) cat = "maskpack";
      else if (lowerName.includes("클렌징") || lowerName.includes("폼") || lowerName.includes("리무버")) cat = "cleansing";
      else if (lowerName.includes("선크림") || lowerName.includes("선스틱") || lowerName.includes("선 쿠션")) cat = "suncare";
      else if (lowerName.includes("틴트") || lowerName.includes("쿠션") || lowerName.includes("쉐이딩") || lowerName.includes("팔레트")) cat = "makeup";
      else if (lowerName.includes("네일") || lowerName.includes("페디")) cat = "nail";
      else if (lowerName.includes("브러시") || lowerName.includes("스파출라") || lowerName.includes("화장솜")) cat = "beauty_tools";
      else if (lowerName.includes("시카플라스트") || lowerName.includes("온천수") || lowerName.includes("미스트")) cat = "dermo_cosmetics";
      else if (lowerName.includes("올인원") || lowerName.includes("블랙밤") || lowerName.includes("왁스")) cat = "mens_edit";
      else if (lowerName.includes("오드퍼퓸") || lowerName.includes("퍼퓸") || lowerName.includes("뚜왈렛")) cat = "perfume";
      else if (lowerName.includes("디퓨저") || lowerName.includes("캔들")) cat = "diffuser";
      else if (lowerName.includes("트리트먼트") || lowerName.includes("샴푸") || lowerName.includes("헤어")) cat = "haircare";
      else if (lowerName.includes("로션") || lowerName.includes("바디워시") || lowerName.includes("크림")) cat = "bodycare";
      else if (lowerName.includes("비타민") || lowerName.includes("콜라겐") || lowerName.includes("유산균")) cat = "health_food";
      else if (lowerName.includes("콤부차") || lowerName.includes("고구마") || lowerName.includes("푸드")) cat = "food";
      else if (lowerName.includes("치약") || lowerName.includes("칫솔")) cat = "oral_care";
      else if (lowerName.includes("생리대") || lowerName.includes("쏘피") || lowerName.includes("본")) cat = "hygiene";
    }

    // Determine realistic price ranges per category
    let minPrice = 12000;
    let maxPrice = 35000;

    if (cat === "maskpack") {
      minPrice = 1500;
      maxPrice = 28000; // singles to 10-packs
    } else if (cat === "cleansing") {
      minPrice = 9900;
      maxPrice = 26000;
    } else if (cat === "suncare") {
      minPrice = 14000;
      maxPrice = 29000;
    } else if (cat === "makeup") {
      minPrice = 9000;
      maxPrice = 38000;
    } else if (cat === "nail") {
      minPrice = 7900;
      maxPrice = 18000;
    } else if (cat === "beauty_tools") {
      minPrice = 2500;
      maxPrice = 18000;
    } else if (cat === "dermo_cosmetics") {
      minPrice = 18000;
      maxPrice = 45000;
    } else if (cat === "mens_edit") {
      minPrice = 12000;
      maxPrice = 36000;
    } else if (cat === "perfume") {
      minPrice = 29000;
      maxPrice = 89000;
    } else if (cat === "diffuser") {
      minPrice = 8900;
      maxPrice = 24000;
    } else if (cat === "haircare") {
      minPrice = 11000;
      maxPrice = 39000;
    } else if (cat === "bodycare") {
      minPrice = 9900;
      maxPrice = 28000;
    } else if (cat === "health_food") {
      minPrice = 15000;
      maxPrice = 89000;
    } else if (cat === "food") {
      minPrice = 1800;
      maxPrice = 15000;
    } else if (cat === "oral_care") {
      minPrice = 3500;
      maxPrice = 19000;
    } else if (cat === "health" || cat === "health_goods") {
      minPrice = 5000;
      maxPrice = 49000;
    } else if (cat === "hygiene") {
      minPrice = 4500;
      maxPrice = 18000;
    } else if (cat === "fashion") {
      minPrice = 9900;
      maxPrice = 29000;
    } else if (cat === "homeliving" || cat === "digital_hobby") {
      minPrice = 12000;
      maxPrice = 69000;
    } else if (cat === "fancy") {
      minPrice = 3000;
      maxPrice = 15000;
    }

    // Deterministic hash based on name to pick a stable price in the range
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    const range = maxPrice - minPrice;
    const step = range > 20000 ? 1000 : range > 5000 ? 500 : 100;
    const stepsCount = Math.floor(range / step);
    const calculatedPrice = minPrice + (positiveHash % (stepsCount || 1)) * step;

    basePrice = Math.round(calculatedPrice / 100) * 100;
    
    // Set a realistic original price representing a typical discount (15% to 35% discount)
    const discountPercent = 15 + (positiveHash % 5) * 5; 
    const calculatedOriginal = basePrice / (1 - discountPercent / 100);
    originalPrice = Math.round(calculatedOriginal / 1000) * 1000;

    if (originalPrice <= basePrice) {
      originalPrice = Math.round((basePrice * 1.25) / 1000) * 1000;
    }
  }

  return { price: basePrice, originalPrice };
}

/**
 * Common pipeline function to process raw scraped product items.
 * Standardizes brands, names, attributes, links, and details.
 */
export function preprocessProduct(product: Product, mallType: "domestic" | "global"): Product {
  // [핵심 수정] ZenRows로 수집한 실제 데이터(isRealData === true)는
  // 하드코딩된 시뮬레이션 브랜드/이름/가격 매퍼로 절대 덮어쓰지 않고 원본 그대로 보존!
  const isReal =
    product.isRealData === true ||
    (product.isRealData !== false && /^A\d+$/i.test(product.id)) ||
    product.id.startsWith("glob_") ||
    product.id.startsWith("real_") ||
    product.id.startsWith("oy_") ||
    (product.isRealData !== false &&
      Boolean(product.link && (product.link.includes("getGoodsDetail.do") || product.link.includes("prdtNo="))));

  if (isReal) {
    const attributes = parseOliveYoungAttributes(product.name, mallType, product.category);
    return {
      ...product,
      mallType,
      isRealData: true,
      attributes
    };
  }

  const p = product;

  // Autocorrect Category Tag based on name keywords to eliminate collection mismatches
  const correctedCategory = getCorrectCategoryForRule(p.name, p.category);

  // Autocorrect Brand based on product name rules to prevent mismatches at source
  const ruleBrand = getCorrectBrandForRule(p.name, correctedCategory) || p.brand;
  const normalizedBrand = normalizeBrand(ruleBrand, mallType);

  // Standardize Product ID based on actual Olive Young database format (e.g., A000000185934)
  const standardizedId = getStandardizedOliveYoungId({
    id: p.id,
    name: p.name,
    brand: ruleBrand,
    category: correctedCategory,
    mallType
  });

  // Normalize Product Name based on the corrected category and mall type
  const normalizedName = normalizeProductName(p.name, correctedCategory, mallType);
  
  // Dynamically re-calculate the price to overwrite any cached inaccurate prices (e.g. from historical runs)
  const { price, originalPrice } = getPriceForProductName(normalizedName, correctedCategory);
  
  const attributes = parseOliveYoungAttributes(normalizedName, mallType, correctedCategory);

  return {
    ...p,
    id: standardizedId,
    brand: normalizedBrand,
    name: normalizedName,
    category: correctedCategory,
    price,
    originalPrice,
    mallType,
    attributes,
    isRealData: false
  };
}
