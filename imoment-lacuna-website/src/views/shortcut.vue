<template>
    <div class="container">
        <h1>라쿠나 바로가기</h1>
        
        <h2>메인</h2>
        <a href="https://www.imoment.kr/lacuna/" target="_blank">
            첫 입장 페이지
        </a>

        <h2>스팟별 주소</h2>
        <div class="spot-links">
            <a href="https://www.imoment.kr/lacuna/#/S_A?index=1" target="_blank">
                1. 시계
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_A?index=2" target="_blank">
                2. 우산
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_V?index=3" target="_blank">
                3. 비둘기
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_A?index=4" target="_blank">
                4. 너히비의자
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_V?index=5" target="_blank">
                5. 기찻길
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_A?index=6" target="_blank">
                6. 성전
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_A?index=7" target="_blank">
                7. 퇴적층
            </a>
            <a href="https://www.imoment.kr/lacuna/#/S_A?index=8" target="_blank">
                8. 낡은의자
            </a>
        </div>

        <h2>모니터링</h2>
        <a href="https://imoment-node-server-heroku-178f19c891f3.herokuapp.com" target="_blank">
            접속자 모니터링
        </a>
    </div>
</template>

<style scoped>
.container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Noto Sans KR', sans-serif;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
}

h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #333;
}

.spot-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

a {
    color: #2c3e50;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all 0.3s ease;
}

a:hover {
    background-color: #f5f5f5;
    border-color: #2c3e50;
}
</style> 