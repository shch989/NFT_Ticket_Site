# 매크로 및 티켓 예매 자동화 README
## 개요
이 프로젝트는 PyQt5를 사용한 매크로 GUI 애플리케이션과 Selenium WebDriver를 사용한 티켓 예매 자동화 스크립트로 구성되어 있습니다. 매크로 애플리케이션은 사용자 인터페이스를 통해 자동화 작업을 수행하며, 티켓 예매 자동화 스크립트는 웹 브라우저를 통해 티켓 예매 과정을 자동화합니다.

## 구성 요소
### 1. 매크로 애플리케이션 (macro_app.py)
    * PyQt5를 사용하여 GUI를 제공하는 매크로 애플리케이션입니다.
    * 사용자로부터 명령어를 받아 자동화된 작업을 수행합니다.
    * 예약 기능을 통해 지정된 시간에 매크로를 실행할 수 있습니다.

### 2. 티켓 예매 자동화 스크립트 (ticket_booking_automation.py)
    * Selenium WebDriver를 사용하여 웹 브라우저를 자동화합니다.
    * 지정된 URL에서 티켓 예매 과정을 자동으로 수행합니다.
    * 사용자 데이터를 입력받아 폼을 자동으로 채우고 제출합니다.

## 요구 사항
* Python 3.x
* PyQt5
* PyInstaller
* Selenium
* Chrome 웹 브라우저
* ChromeDriver

## 설치 및 설정
### 1. Python 패키지 설치
다음 명령어를 통해 필요한 Python 패키지를 설치합니다:

```bash
pip install PyQt5 pyinstaller selenium pyautogui keyboard
```

### 2. ChromeDriver 설치
* ChromeDriver 다운로드 페이지에서 사용 중인 Chrome 버전에 맞는 ChromeDriver를 다운로드합니다.
* 다운로드한 chromedriver.exe 파일을 프로젝트 디렉토리에 저장하거나 시스템 PATH에 추가합니다.

### 3. 프로젝트 파일 구조
프로젝트 디렉토리는 다음과 같이 구성됩니다:
```
project/
├── macro_app.py
├── ticket_booking_automation.py
├── chromedriver.exe
├── user_data.txt
```
* macro_app.py: 매크로 GUI 애플리케이션 스크립트
* ticket_booking_automation.py: 티켓 예매 자동화 스크립트
* chromedriver.exe: ChromeDriver 실행 파일
* user_data.txt: 사용자 데이터를 저장하는 파일

## 사용 방법
### 1. 매크로 애플리케이션 실행

#### 실행 방법
터미널에서 다음 명령어를 실행합니다:
```bash
python macro_app.py
```

#### 기능 설명
* 파일 열기: 명령어가 포함된 텍스트 파일을 열어 명령어 리스트를 로드합니다.
* 시간 지연 설정: 매크로 동작 사이의 지연 시간을 설정합니다.
* 매크로 시작 (F3): 매크로를 시작합니다.
* 매크로 중지 (F4): 매크로를 중지합니다.
* 예약 실행: 특정 날짜와 시간에 매크로를 자동으로 실행하도록 예약합니다.

### 2. 티켓 예매 자동화 스크립트 실행
#### 사용자 데이터 설정
user_data.txt 파일에 다음과 같은 형식으로 사용자 정보를 입력합니다:
```makefile
User_ID=testID
Password=passWord
Transaction_Quantity=2
Age=16
Payment_Method=Credit Card
Card_Type=Credit
Card_Number=1234123412341234
```
#### 실행 방법
터미널에서 다음 명령어를 실행합니다:
```bash
python ticket_booking_automation.py
```

#### 기능 설명
* 페이지 열기: 지정된 URL의 티켓 예매 페이지를 엽니다.
* 예매하기 버튼 클릭: "예매하기" 버튼을 찾아 클릭합니다.
* 폼 자동 작성: user_data.txt에 입력된 사용자 정보를 기반으로 폼을 자동으로 작성합니다.
* 폼 제출: 작성된 폼을 제출하여 티켓 예매를 완료합니다.

## 주의 사항
* ChromeDriver 버전: 사용 중인 Chrome 브라우저 버전과 일치하는 ChromeDriver를 사용해야 합니다.
* 프로필 경로 설정: 로그인 정보 및 쿠키를 유지하려면 Chrome 프로필 경로를 올바르게 설정해야 합니다.
* 안티바이러스 소프트웨어: 자동화 스크립트 실행 시 안티바이러스 소프트웨어가 간섭할 수 있으므로 필요에 따라 일시적으로 비활성화합니다.

## 로그 및 오류 처리
* 매크로 애플리케이션과 티켓 예매 자동화 스크립트는 실행 중 발생하는 오류를 로그 파일에 기록합니다.
* `error.log` 및 `ticket_booking.log` 파일에서 상세한 오류 정보를 확인할 수 있습니다.

## PyInstaller를 통한 실행 파일 생성
매크로 애플리케이션을 실행 파일로 배포하려면 PyInstaller를 사용합니다.

### 실행 파일 생성 명령어
```bash
pyinstaller --onefile macro_app.py
```

## 주의 사항
* 실행 파일 생성 시 PermissionError가 발생할 경우, 해당 파일이 사용 중인지 확인하고, 필요한 권한이 있는지 확인합니다.
* 안티바이러스 소프트웨어가 실행 파일 생성을 방해할 수 있으므로 일시적으로 비활성화합니다.