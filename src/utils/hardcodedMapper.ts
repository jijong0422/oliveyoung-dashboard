/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, OliveYoungAttributes } from "../types";
import { BRAND_MAP } from "./productMapper";

/**
 * Hardcoded brand mapping rules based on product name keywords.
 * Prevents brand-product mismatch at source.
 */
export function getCorrectBrandForRule(name: string, category: string): string | null {
  const lowerName = name.toLowerCase();

  // 1. Direct famous brand-keyword matches
  if (lowerName.includes("자작나무") || lowerName.includes("birch juice") || lowerName.includes("독도")) {
    return "라운드랩 (Round Lab)";
  }
  if (lowerName.includes("워터풀 에센스") || lowerName.includes("화이트 트러플") || lowerName.includes("d'alba")) {
    return "달바 (d'Alba)";
  }
  if (lowerName.includes("아이섀도우 브러시") || lowerName.includes("스파출라") || lowerName.includes("핑거 퍼프") || lowerName.includes("속눈썹 고데기") || lowerName.includes("헤어롤") || lowerName.includes("fillimilli")) {
    return "필리밀리 (Fillimilli)";
  }
  if (lowerName.includes("이지 네일") || lowerName.includes("쏙오프") || lowerName.includes("soak off") || lowerName.includes("wakemake")) {
    return "웨이크메이크 (Wakemake)";
  }
  if (lowerName.includes("매트 왁스") || lowerName.includes("수퍼 홀드") || lowerName.includes("handsome lip") || lowerName.includes("핸섬 립밤")) {
    return "그라펜 (GRAFEN)";
  }
  if (lowerName.includes("아티산") || lowerName.includes("artisan")) {
    return "존바바토스 (John Varvatos)";
  }
  if (lowerName.includes("위크엔드") || lowerName.includes("weekend")) {
    return "버버리 (Burberry)";
  }
  if (lowerName.includes("블랙체리") || lowerName.includes("양재동") || lowerName.includes("cocodor")) {
    return "코코도르 (Cocodor)";
  }
  if (lowerName.includes("편백") || lowerName.includes("cypress") || lowerName.includes("round a round")) {
    return "라운드어라운드 (Round A Round)";
  }
  if (lowerName.includes("퓨어 코튼 홈") || lowerName.includes("daily comma")) {
    return "데일리콤마 (Daily Comma)";
  }
  if (lowerName.includes("스위트 가든") || lowerName.includes("yankee candle")) {
    return "양키캔들 (Yankee Candle)";
  }
  if (lowerName.includes("무선 마우스") || lowerName.includes("무소음 마우스") || lowerName.includes("logitech") || lowerName.includes("로지텍")) {
    return "로지텍 (Logitech)";
  }
  if (lowerName.includes("그리드 유선 노트") || lowerName.includes("스프링 그리드") || lowerName.includes("motemote") || lowerName.includes("모트모트")) {
    return "모트모트 (Motemote)";
  }
  if (lowerName.includes("마이멜로디") || lowerName.includes("sanrio") || lowerName.includes("산리오")) {
    return "산리오 (Sanrio)";
  }
  if (lowerName.includes("블레미쉬 케어") || lowerName.includes("isoi") || lowerName.includes("잡티 세럼") && !lowerName.includes("청귤")) {
    return "아이소이 (isoi)";
  }
  if (lowerName.includes("청귤") || lowerName.includes("goodal")) {
    return "구달 (Goodal)";
  }
  if (lowerName.includes("다이브인") || lowerName.includes("저분자 히알루론산") || lowerName.includes("torriden")) {
    return "토리든 (Torriden)";
  }
  if (lowerName.includes("어성초 77%") || lowerName.includes("anua") || lowerName.includes("아누아")) {
    return "아누아 (Anua)";
  }
  if (lowerName.includes("어성초 껌딱지") || lowerName.includes("abib") || lowerName.includes("아비브")) {
    return "아비브 (Abib)";
  }
  if (lowerName.includes("티트리 에센셜 마스크") || lowerName.includes("mediheal") || lowerName.includes("메디힐")) {
    return "메디힐 (Mediheal)";
  }
  if (lowerName.includes("콜라겐 겔") || lowerName.includes("medianswer") || lowerName.includes("메디앤서")) {
    return "메디앤서 (MediAnswer)";
  }
  if (lowerName.includes("슈렉팩") || lowerName.includes("dreamworks") || lowerName.includes("드림웍스")) {
    return "드림웍스 (Dreamworks)";
  }
  if (lowerName.includes("다자연") || lowerName.includes("all natural")) {
    return "다자연 (All Natural)";
  }
  if (lowerName.includes("조선미녀") || lowerName.includes("beauty of joseon") || lowerName.includes("맑은 쌀")) {
    return "조선미녀 (Beauty of Joseon)";
  }
  if (lowerName.includes("코스알엑스") || lowerName.includes("cosrx") || lowerName.includes("snail 96")) {
    return "코스알엑스 (COSRX)";
  }
  if (lowerName.includes("어노브") || lowerName.includes("unove") || lowerName.includes("딥 데미지")) {
    return "어노브 (UNOVE)";
  }
  if (lowerName.includes("클리오") || lowerName.includes("clio") || lowerName.includes("킬커버")) {
    return "클리오 (Clio)";
  }
  if (lowerName.includes("롬앤") || lowerName.includes("romand") || lowerName.includes("쥬시 래스팅")) {
    return "롬앤 (Romand)";
  }
  if (lowerName.includes("오소몰") || lowerName.includes("orthomol") || lowerName.includes("이뮨 멀티비타민")) {
    return "오소몰 (Orthomol)";
  }
  if (lowerName.includes("에스트라") || lowerName.includes("aestura") || lowerName.includes("아토베리어")) {
    return "에스트라 (AESTURA)";
  }
  if (lowerName.includes("한율") || lowerName.includes("hanyul") || lowerName.includes("쑥 진정")) {
    return "한율 (Hanyul)";
  }
  if (lowerName.includes("마녀공장") || lowerName.includes("manyo") || lowerName.includes("퓨어 클렌징") || lowerName.includes("허브 클렌징")) {
    return "마녀공장 (Manyo)";
  }
  if (lowerName.includes("이니스프리") || lowerName.includes("innisfree") || lowerName.includes("레티놀 시카")) {
    return "이니스프리 (Innisfree)";
  }
  if (lowerName.includes("피지오겔") || lowerName.includes("physiogel")) {
    return "피지오겔 (Physiogel)";
  }
  if (lowerName.includes("바닐라코") || lowerName.includes("banila co") || lowerName.includes("클린 잇 제로")) {
    return "바닐라코 (BANILA CO)";
  }
  if (lowerName.includes("아리얼") || lowerName.includes("ariul") || lowerName.includes("립앤아이 리무버")) {
    return "아리얼 (Ariul)";
  }
  if (lowerName.includes("바이오더마") || lowerName.includes("bioderma") || lowerName.includes("센시비오")) {
    return "바이오더마 (Bioderma)";
  }
  if (lowerName.includes("폰즈") || lowerName.includes("pond's")) {
    return "폰즈 (Pond's)";
  }
  if (lowerName.includes("메디필") || lowerName.includes("medi-peel")) {
    return "메디필 (MEDI-PEEL)";
  }
  if (lowerName.includes("식물나라") || lowerName.includes("shingmulnara") || lowerName.includes("산소수") || lowerName.includes("선 쿠션")) {
    return "식물나라 (Shingmulnara)";
  }
  if (lowerName.includes("셀퓨전씨") || lowerName.includes("cell fusion c") || lowerName.includes("레이저 썬스크린")) {
    return "셀퓨전씨 (Cell Fusion C)";
  }
  if (lowerName.includes("닥터지") || lowerName.includes("dr.g") || lowerName.includes("그린 마일드 업 선 플러스")) {
    return "닥터지 (Dr.G)";
  }
  if (lowerName.includes("아넷사") || lowerName.includes("anessa")) {
    return "아넷사 (ANESSA)";
  }
  if (lowerName.includes("페리페라") || lowerName.includes("peripera") || lowerName.includes("잉크 더 벨벳")) {
    return "페리페라 (Peripera)";
  }
  if (lowerName.includes("에스쁘아") || lowerName.includes("espoir")) {
    return "에스쁘아 (Espoir)";
  }
  if (lowerName.includes("헤라") || lowerName.includes("hera")) {
    return "헤라 (HERA)";
  }
  if (lowerName.includes("뮤드") || lowerName.includes("mude") || lowerName.includes("인스파이어 마스카라")) {
    return "뮤드 (mude)";
  }
  if (lowerName.includes("투쿨포스쿨") || lowerName.includes("too cool for school") || lowerName.includes("바이로댕")) {
    return "투쿨포스쿨 (Too Cool For School)";
  }
  if (lowerName.includes("데싱디바") || lowerName.includes("dashing diva") || lowerName.includes("글레이즈")) {
    return "데싱디바 (Dashing Diva)";
  }
  if (lowerName.includes("오호라") || lowerName.includes("ohora") || lowerName.includes("세미큐어")) {
    return "오호라 (ohora)";
  }
  if (lowerName.includes("핑거수트") || lowerName.includes("finger suit") || lowerName.includes("프리미엄 젤스트립")) {
    return "핑거수트 (FINGER SUIT)";
  }
  if (lowerName.includes("키스뉴욕") || lowerName.includes("kiss new york")) {
    return "키스뉴욕 (KISS NEW YORK)";
  }
  if (lowerName.includes("리얼테크닉스") || lowerName.includes("real techniques")) {
    return "리얼테크닉스 (Real Techniques)";
  }
  if (lowerName.includes("피카소") || lowerName.includes("piccasso")) {
    return "피카소 (Piccasso)";
  }
  if (lowerName.includes("라로슈포제") || lowerName.includes("la roche-posay") || lowerName.includes("시카플라스트")) {
    return "라로슈포제 (La Roche-Posay)";
  }
  if (lowerName.includes("아벤느") || lowerName.includes("avene") || lowerName.includes("온천수 미스트")) {
    return "아벤느 (Avene)";
  }
  if (lowerName.includes("유리아쥬") || lowerName.includes("uriage") || lowerName.includes("제모스")) {
    return "유리아쥬 (Uriage)";
  }
  if (lowerName.includes("닥터자르트") || lowerName.includes("dr.jart") || lowerName.includes("시카페어")) {
    return "닥터자르트 (Dr.Jart+)";
  }
  if (lowerName.includes("우르오스") || lowerName.includes("ulos")) {
    return "우르오스 (ULOS)";
  }
  if (lowerName.includes("비레디") || lowerName.includes("beready")) {
    return "비레디 (BeREADY)";
  }
  if (lowerName.includes("포맨트") || lowerName.includes("forment") || lowerName.includes("코튼허그")) {
    return "포맨트 (Forment)";
  }
  if (lowerName.includes("클린") || lowerName.includes("clean") || lowerName.includes("웜코튼")) {
    return "클린 (Clean)";
  }
  if (lowerName.includes("랑방") || lowerName.includes("lanvin") || lowerName.includes("에끌라 드 아르페쥬")) {
    return "랑방 (Lanvin)";
  }
  if (lowerName.includes("클로에") || lowerName.includes("chloe")) {
    return "클로에 (Chloe)";
  }
  if (lowerName.includes("모레모") || lowerName.includes("moremo")) {
    return "모레모 (Moremo)";
  }
  if (lowerName.includes("미쟝센") || lowerName.includes("mise-en-scene") || lowerName.includes("퍼펙트 세럼")) {
    return "미쟝센 (Mise-en-scene)";
  }
  if (lowerName.includes("라보에이치") || lowerName.includes("labo-h") || lowerName.includes("탈모증상완화 두피")) {
    return "라보에이치 (LABO-H)";
  }
  if (lowerName.includes("닥터포헤어") || lowerName.includes("dr.forhair") || lowerName.includes("폴리젠")) {
    return "닥터포헤어 (Dr.FORHAIR)";
  }
  if (lowerName.includes("그로우어스") || lowerName.includes("growus") || lowerName.includes("씨솔트 테라피")) {
    return "그로우어스 (GROWUS)";
  }
  if (lowerName.includes("일리윤") || lowerName.includes("illiyoon") || lowerName.includes("세라마이드 아토")) {
    return "일리윤 (Illiyoon)";
  }
  if (lowerName.includes("세타필") || lowerName.includes("cetaphil") || lowerName.includes("모이스춰라이징")) {
    return "세타필 (Cetaphil)";
  }
  if (lowerName.includes("더바디샵") || lowerName.includes("the body shop")) {
    return "더바디샵 (The Body Shop)";
  }
  if (lowerName.includes("온더바디") || lowerName.includes("on the body") || lowerName.includes("티트리 바디워시")) {
    return "온더바디 (On The Body)";
  }
  if (lowerName.includes("해피바스") || lowerName.includes("happy bath") || lowerName.includes("내추럴 바디워시")) {
    return "해피바스 (Happy Bath)";
  }
  if (lowerName.includes("더프트앤도프트") || lowerName.includes("duft & doft") || lowerName.includes("소피플라워")) {
    return "더프트앤도프트 (Duft & Doft)";
  }
  if (lowerName.includes("정관장") || lowerName.includes("cheongkwanjang") || lowerName.includes("홍삼정")) {
    return "정관장 (CheongKwanJang)";
  }
  if (lowerName.includes("락토핏") || lowerName.includes("lacto-fit") || lowerName.includes("생유산균")) {
    return "락토핏 (Lacto-Fit)";
  }
  if (lowerName.includes("고려은단") || lowerName.includes("koryo eundan") || lowerName.includes("멀티비타민 미네랄 1000")) {
    return "고려은단 (Koryo Eundan)";
  }
  if (lowerName.includes("씨제이웰케어") || lowerName.includes("cj wellcare") || lowerName.includes("이너비")) {
    return "씨제이웰케어 (CJ Wellcare)";
  }
  if (lowerName.includes("비비랩") || lowerName.includes("bblab") || lowerName.includes("저분자 콜라겐")) {
    return "비비랩 (BBLAB)";
  }
  if (lowerName.includes("딜라이트 프로젝트") || lowerName.includes("delight project") || lowerName.includes("베이글칩")) {
    return "딜라이트 프로젝트 (Delight Project)";
  }
  if (lowerName.includes("티젠") || lowerName.includes("teazen") || lowerName.includes("콤부차")) {
    return "티젠 (TEAZEN)";
  }
  if (lowerName.includes("오설록") || lowerName.includes("osulloc") || lowerName.includes("녹차 티백")) {
    return "오설록 (Osulloc)";
  }
  if (lowerName.includes("웅진") || lowerName.includes("하늘보리")) {
    return "웅진 (Woongjin)";
  }
  if (lowerName.includes("정식품") || lowerName.includes("vegemil") || lowerName.includes("베지밀")) {
    return "정식품 (Jeongsik)";
  }
  if (lowerName.includes("덴티스테") || lowerName.includes("dentiste") || lowerName.includes("플러스화이트")) {
    return "덴티스테 (Dentiste)";
  }
  if (lowerName.includes("루치펠로") || lowerName.includes("rucipello") || lowerName.includes("미스티포레스트")) {
    return "루치펠로 (Rucipello)";
  }
  if (lowerName.includes("센소다인") || lowerName.includes("sensodyne") || lowerName.includes("멀티케어 치약")) {
    return "센소다인 (Sensodyne)";
  }
  if (lowerName.includes("오랄비") || lowerName.includes("oral-b") || lowerName.includes("크로스액션 칫솔")) {
    return "오랄비 (Oral-B)";
  }
  if (lowerName.includes("유한양행") || lowerName.includes("안티푸라민 쿨파스")) {
    return "유한양행 (Yuhan)";
  }
  if (lowerName.includes("케토톱") || lowerName.includes("ketotop") || lowerName.includes("핫 파스")) {
    return "케토톱 (Ketotop)";
  }

  // 2. Class/Category-specific brand rules
  if (category === "maskpack") {
    if (lowerName.includes("티트리")) return "메디힐 (Mediheal)";
    if (lowerName.includes("어성초")) return "아비브 (Abib)";
    if (lowerName.includes("다이브인") || lowerName.includes("히알루론산")) return "토리든 (Torriden)";
    if (lowerName.includes("콜라겐")) return "메디앤서 (MediAnswer)";
  }

  if (category === "skincare") {
    if (lowerName.includes("어성초")) return "아누아 (Anua)";
    if (lowerName.includes("다이브인") || lowerName.includes("히알루론산")) return "토리든 (Torriden)";
    if (lowerName.includes("독도")) return "라운드랩 (Round Lab)";
    if (lowerName.includes("잡티")) return "구달 (Goodal)";
  }

  return null;
}

/**
 * Resolves correct Category ID based on keywords inside raw product name.
 * Standardizes categorization.
 */
export function getCorrectCategoryForRule(name: string, fallbackCategory: string): string {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("마스크팩") || lowerName.includes("시트 마스크") || lowerName.includes("흔적 패드") || lowerName.includes("진정 패드") || lowerName.includes("spot pad") || lowerName.includes("sheet mask")) {
    return "maskpack";
  }
  if (lowerName.includes("선크림") || lowerName.includes("선스틱") || lowerName.includes("선 젤") || lowerName.includes("sunscreen") || lowerName.includes("sunstick") || lowerName.includes("sun cushion")) {
    return "suncare";
  }
  if (lowerName.includes("클렌징 오일") || lowerName.includes("클렌징 폼") || lowerName.includes("클렌징 밤") || lowerName.includes("립앤아이 리무버") || lowerName.includes("cleansing balm") || lowerName.includes("cleansing oil") || lowerName.includes("remover")) {
    return "cleansing";
  }
  if (lowerName.includes("아이섀도우 브러시") || lowerName.includes("메이크업 스파출라") || lowerName.includes("핑거 퍼프") || lowerName.includes("속눈썹 고데기") || lowerName.includes("화장솜") || lowerName.includes("헤어롤") || lowerName.includes("brush") || lowerName.includes("spatula")) {
    return "beauty_tools";
  }
  if (lowerName.includes("네일") || lowerName.includes("페디") || lowerName.includes("쏙오프") || lowerName.includes("nail") || lowerName.includes("pedi")) {
    return "nail";
  }
  if (lowerName.includes("틴트") || lowerName.includes("쿠션") || lowerName.includes("쉐이딩") || lowerName.includes("팔레트") || lowerName.includes("마스카라") || lowerName.includes("tint") || lowerName.includes("shading") || lowerName.includes("cushion") || lowerName.includes("palette")) {
    return "makeup";
  }
  if (lowerName.includes("시카플라스트") || lowerName.includes("온천수 미스트") || lowerName.includes("제모스") || lowerName.includes("시카페어") || lowerName.includes("thermal spring")) {
    return "dermo_cosmetics";
  }
  if (lowerName.includes("올인원 밀크") || lowerName.includes("스킨워시") || lowerName.includes("블랙밤") || lowerName.includes("톤업크림") || lowerName.includes("핸섬 립밤") || lowerName.includes("매트 왁스") || lowerName.includes("men")) {
    if (lowerName.includes("ideal for men") || lowerName.includes("ulos") || lowerName.includes("dtrt") || lowerName.includes("beready") || lowerName.includes("grafen") || lowerName.includes("우르오스") || lowerName.includes("올인원")) {
      return "mens_edit";
    }
  }
  if (lowerName.includes("오드퍼퓸") || lowerName.includes("오드뚜왈렛") || lowerName.includes("향수") || lowerName.includes("parfum") || lowerName.includes("toilette") || lowerName.includes("perfume")) {
    return "perfume";
  }
  if (lowerName.includes("디퓨저") || lowerName.includes("캔들") || lowerName.includes("diffuser") || lowerName.includes("candle")) {
    return "diffuser";
  }
  if (lowerName.includes("트리트먼트") || lowerName.includes("샴푸") || lowerName.includes("헤어 에센스") || lowerName.includes("scalp") || lowerName.includes("shampoo")) {
    return "haircare";
  }
  if (lowerName.includes("바디로션") || lowerName.includes("바디워시") || lowerName.includes("핸드크림") || lowerName.includes("body wash") || lowerName.includes("body lotion") || lowerName.includes("hand cream")) {
    return "bodycare";
  }
  if (lowerName.includes("홍삼") || lowerName.includes("유산균") || lowerName.includes("비타민") || lowerName.includes("콜라겐 파우더") || lowerName.includes("아쿠아뱅크") || lowerName.includes("probiotics") || lowerName.includes("ginseng")) {
    return "health_food";
  }
  if (lowerName.includes("베이글칩") || lowerName.includes("콤부차") || lowerName.includes("녹차 티백") || lowerName.includes("하늘보리") || lowerName.includes("베지밀") || lowerName.includes("kombucha") || lowerName.includes("sweet potato") || lowerName.includes("고구마")) {
    return "food";
  }
  if (lowerName.includes("치약") || lowerName.includes("칫솔") || lowerName.includes("구강청결제") || lowerName.includes("toothpaste") || lowerName.includes("toothbrush") || lowerName.includes("mouthwash")) {
    return "oral_care";
  }
  if (lowerName.includes("생리대") || lowerName.includes("오버나이트") || lowerName.includes("탐폰") || lowerName.includes("물티슈") || lowerName.includes("sanitary") || lowerName.includes("tampon") || lowerName.includes("wipes")) {
    return "hygiene";
  }
  if (lowerName.includes("스타킹") || lowerName.includes("양말") || lowerName.includes("브래지어") || lowerName.includes("덧신") || lowerName.includes("pantyhose") || lowerName.includes("socks") || lowerName.includes("brassiere")) {
    return "fashion";
  }
  if (lowerName.includes("키친타올") || lowerName.includes("먼지떨이") || lowerName.includes("슬리퍼") || lowerName.includes("베개 커버") || lowerName.includes("분리수거함") || lowerName.includes("towel") || lowerName.includes("duster") || lowerName.includes("slipper")) {
    return "homeliving";
  }
  if (lowerName.includes("마우스") || lowerName.includes("스피커") || lowerName.includes("가습기") || lowerName.includes("케이블") || lowerName.includes("손난로") || lowerName.includes("mouse") || lowerName.includes("speaker") || lowerName.includes("cable")) {
    return "digital_hobby";
  }
  if (lowerName.includes("노트") || lowerName.includes("볼펜") || lowerName.includes("필통") || lowerName.includes("형광펜") || lowerName.includes("notebook") || lowerName.includes("pen") || lowerName.includes("highlighter")) {
    return "fancy";
  }

  return fallbackCategory;
}

/**
 * Generates a clean, standardized, real-style Olive Young Product ID.
 * Standardizes identifiers dynamically and deterministically.
 */
export function getStandardizedOliveYoungId(p: { id?: string; name: string; brand: string; category: string; mallType: "domestic" | "global" }): string {
  // If already matches Olive Young pattern (A followed by 12 digits), keep it
  if (p.id && /^A\d{12}$/.test(p.id)) {
    return p.id;
  }

  // Otherwise, deterministically generate a real-looking Olive Young product ID
  // Include original id to ensure uniqueness across slots/ranks
  const key = p.id 
    ? `${p.id}_${p.brand}_${p.name}_${p.category}_${p.mallType}`
    : `${p.brand}_${p.name}_${p.category}_${p.mallType}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash) % 100000000; // 8 digits
  const paddedHash = String(positiveHash).padStart(8, "0");
  return `A0000${paddedHash}`; // Total 1 + 4 + 8 = 13 chars, matching A000000185934 format
}

/**
 * Validates brand-product mappings and category tags during collection.
 * Cross-references with the hardcoded rules to ensure absolute consistency.
 */
export function validateCollectionMapping(p: Product): {
  isValid: boolean;
  mismatches: Array<{ field: string; expected: string; actual: string; message: string }>;
} {
  const mismatches: Array<{ field: string; expected: string; actual: string; message: string }> = [];

  // 1. Check Brand-Product Match
  const expectedBrandWithParentheses = getCorrectBrandForRule(p.name, p.category);
  if (expectedBrandWithParentheses) {
    const rawBrand = p.brand.split(" (")[0].trim().toLowerCase();
    const expectedBrandNameKo = expectedBrandWithParentheses.split(" (")[0].trim().toLowerCase();
    const expectedBrandNameEn = expectedBrandWithParentheses.match(/\(([^)]+)\)/)?.[1]?.trim()?.toLowerCase() || expectedBrandNameKo;

    // Check if the current product brand matches the expected brand in either language
    const brandLower = p.brand.toLowerCase();
    const isMatched = brandLower.includes(expectedBrandNameKo) || 
                      brandLower.includes(expectedBrandNameEn) || 
                      expectedBrandWithParentheses.toLowerCase().includes(rawBrand);

    if (!isMatched) {
      mismatches.push({
        field: "brand",
        expected: expectedBrandWithParentheses,
        actual: p.brand,
        message: `브랜드 매칭 오류 감지: 상품명 "${p.name}"은 "${expectedBrandWithParentheses}" 브랜드 제품이나, 현재 "${p.brand}"(으)로 잘못 태그되어 있습니다.`
      });
    }
  }

  // 2. Check Category Tag Match
  const expectedCategory = getCorrectCategoryForRule(p.name, p.category);
  if (expectedCategory !== p.category) {
    mismatches.push({
      field: "category",
      expected: expectedCategory,
      actual: p.category,
      message: `카테고리 분류 매칭 오류 감지: 상품명 "${p.name}"의 핵심 키워드는 "${expectedCategory}" 카테고리에 속하나, 현재 "${p.category}"(으)로 잘못 수집되었습니다.`
    });
  }

  // 3. Check Product ID format
  const expectedId = getStandardizedOliveYoungId(p);
  if (p.id && p.id !== expectedId && !/^A\d{12}$/.test(p.id)) {
    mismatches.push({
      field: "id",
      expected: expectedId,
      actual: p.id,
      message: `상품 ID 포맷팅 규격 미준수: 수집된 ID "${p.id}"가 올리브영 실제 ID 규격(A + 12자리 숫자)에 맞지 않습니다.`
    });
  }

  return {
    isValid: mismatches.length === 0,
    mismatches
  };
}
