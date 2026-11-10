import time
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_oliveyoung_domestic_best(category_url="https://www.oliveyoung.co.kr/store/main/getBestList.do"):
    """올리브영 국내몰 베스트(Top 30) 수집"""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    # 사용자 에이전트 추가 (차단 우회용)
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print("국내몰 스크래핑 시작...")
        driver.get(category_url)
        # 로딩 대기
        time.sleep(3)
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        product_items = soup.select('.prd_info')
        
        results = []
        for rank, item in enumerate(product_items[:30], start=1):
            try:
                brand = item.select_one('.tx_brand').text.strip() if item.select_one('.tx_brand') else "브랜드 없음"
                name = item.select_one('.tx_name').text.strip() if item.select_one('.tx_name') else "상품명 없음"
                price = item.select_one('.tx_cur > .tx_num').text.strip() if item.select_one('.tx_cur > .tx_num') else "가격 정보 없음"
                
                results.append({
                    "Rank": rank,
                    "Brand": brand,
                    "Product Name": name,
                    "Price (KRW)": price
                })
            except Exception as e:
                print(f"[{rank}위] 데이터 추출 중 오류 발생: {e}")
                continue
                
        return pd.DataFrame(results)
    finally:
        driver.quit()

def get_oliveyoung_global_best(category_url="https://global.oliveyoung.com/display/page/best-seller"):
    """올리브영 글로벌몰 베스트(Top 30) 수집"""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print("글로벌몰 스크래핑 시작...")
        driver.get(category_url)
        time.sleep(4)  # 페이지 로딩 및 렌더링 대기
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # 글로벌몰 상품 목록 선택자 (글로벌몰 사이트 구조에 맞게 변경 필요)
        product_items = soup.select('.product-item')
        
        # 만약 .product-item이 없으면 다른 선택자 시도
        if not product_items:
            product_items = soup.select('.list-item')
            
        results = []
        for rank, item in enumerate(product_items[:30], start=1):
            try:
                brand = item.select_one('.brand-name').text.strip() if item.select_one('.brand-name') else "Brand Unknown"
                name = item.select_one('.product-name').text.strip() if item.select_one('.product-name') else "Product Name Unknown"
                price = item.select_one('.price-current').text.strip() if item.select_one('.price-current') else "Price Unknown"
                
                results.append({
                    "Rank": rank,
                    "Brand": brand,
                    "Product Name": name,
                    "Price (USD)": price
                })
            except Exception as e:
                continue
                
        return pd.DataFrame(results)
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=== 올리브영 실시간 베스트 상품 크롤러 ===")
    
    # 국내몰 수집
    df_domestic = get_oliveyoung_domestic_best()
    if not df_domestic.empty:
        print("\n[국내몰 TOP 30]")
        print(df_domestic.head(10)) # 10개만 출력
        df_domestic.to_csv("oliveyoung_domestic_top30.csv", index=False, encoding='utf-8-sig')
        print("-> oliveyoung_domestic_top30.csv 저장 완료")
    else:
        print("국내몰 데이터를 찾지 못했습니다. 사이트 구조가 변경되었을 수 있습니다.")
        
    # 글로벌몰 수집
    df_global = get_oliveyoung_global_best()
    if not df_global.empty:
        print("\n[글로벌몰 TOP 30]")
        print(df_global.head(10))
        df_global.to_csv("oliveyoung_global_top30.csv", index=False, encoding='utf-8-sig')
        print("-> oliveyoung_global_top30.csv 저장 완료")
    else:
        print("글로벌몰 데이터를 찾지 못했습니다. 사이트 구조가 변경되었을 수 있습니다.")
