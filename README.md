# 직원 대시보드

## 프로젝트 소개
직원 관리 및 정보 제공을 위한 대시보드입니다.

## ERD
![ERD](https://blog.kakaocdn.net/dn/zIQ2t/btsHMNjdRJz/8xwbRwPRAWrJUgBJaueciK/img.png)

## 실행 화면
![실행화면](https://blog.kakaocdn.net/dn/ddh223/btsHKCRomzV/aNM8ZaT2VZNunNQgA6Gt4K/img.gif)
메뉴 중 커뮤니티는 https://github.com/DDinoBox/seerslab_test_board_server 의 게시판 리스트 및 상세보기 기능으로 추가 하였습니다. 
web 화면은 https://github.com/DDinoBox/employee_dashboard_web 참고 하시면 됩니다. 

## 설치 방법
### 1. 레포지토리 클론
```bash
git clone https://github.com/DDinoBox/employee_dashboard_server.git
```
### 2. 의존성 패키지 설치
```bash
yarn install
```
### 3. .env 파일 생성 (예시)
```bash
DATABASE_URL= localhost

PORT= 8080

TYPEORM_CONNECTION= mysql
TYPEORM_HOST= localhost
TYPEORM_USERNAME= root
TYPEORM_PASSWORD= 비밀번호
TYPEORM_DATABASE= seerslab-test
TYPEORM_PORT= 3306
TYPEORM_LOGGING= BOOLEAN
```
