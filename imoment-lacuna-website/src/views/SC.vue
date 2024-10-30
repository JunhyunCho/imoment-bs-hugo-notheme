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

        <h2>전체지도</h2>
        <a href="https://www.imoment.kr/lacuna/#/4_map" target="_blank">
            전체 스팟 지도 보기
        </a>
        

        <h2>그룹 설정</h2>
        <div class="group-buttons">
            <button @click="setGroup('A')" class="group-button">A</button>
            <button @click="setGroup('B')" class="group-button">B</button>
            <button @click="setGroup('C')" class="group-button">C</button>
        </div>
        <div class="current-group">
            현재 그룹: {{ currentGroup }}
        </div>

        <h2>모니터링 - 오프닝 문열고 첫 QR 찍을때 보는게 좋습니다.</h2>
        <a href="https://imoment-node-server-heroku-178f19c891f3.herokuapp.com" target="_blank">
            접속자 모니터링
        </a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentGroup: localStorage.getItem('userGroup') || '-'
        }
    },
    methods: {
        setGroup(group) {
            localStorage.setItem('userGroup', group);
            this.currentGroup = group;
        }
    }
}
</script>

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

.group-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
}

.group-button {
    padding: 0.5rem 2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.group-button:hover {
    background-color: #f5f5f5;
    border-color: #2c3e50;
}

.current-group {
    text-align: center;
    margin-bottom: 1rem;
    color: #666;
    font-size: 1rem;
}
</style> 