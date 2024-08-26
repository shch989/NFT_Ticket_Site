## 인공지능그랜드ICT 연구센터 창의자율과제
### 매크로 시뮬레이션을 위한 실행환경 조건
1. NodeJS 설치 (LTS버전)
2. test_client 폴더로 이동 후 `npm install` 터미널에 입력 (필요한 모듈을 설치하기 위함)
3. test_client 폴더에서 `npm start` 입력 시 웹 프론트엔드 실행
4. test_client 폴더의 터미널을 끄지말고 새로운 터미널을 하나 더 추가
5. ai 폴더로 이동 후 `uvicorn main:app --reload` 터미널에 작성 
6. 아마 파이썬 모듈을 설치를 안해서 실행이 안될꺼임 일단 FastAPI에 필요한 설치모듈은 [여기](https://fastapi.tiangolo.com/ko/#typer-fastapi-cli)서 확인
7. 한번 클라이언트에서 정보 입력해보고 오류같은거 뜨면 언제든 말좀 ㅎㅎ