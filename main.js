// input 태그를 긁어 오기
const inputs = document.querySelectorAll('input[type="range"]')

// 실행할 내용
function inputUpdate () {
  // 넘어오는 이벤트 주체의 값 (range의 경우이므로 0~100(%) 중 하나의 값)
  const perVal = this.value
  // console.log(this.value)
  
  // slider-thumb(컨트롤 하는 버튼)의 값을 기준으로 전후 그라디언트
  this.style.background = `linear-gradient(to right, #FFDB4C 0%, #FFDB4C ${perVal}%, #C4C4C4 ${perVal}%, #C4C4C4 100%)`
}

// 공통
inputs.forEach(input => input.addEventListener('change', inputUpdate))
// 웹
inputs.forEach(input => input.addEventListener('mousemove', inputUpdate))
// 모바일
inputs.forEach(input => input.addEventListener('touchmove', inputUpdate))