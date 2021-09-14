// ! 기준 금액 설정 input bar
// input 태그를 긁어 오기
const inputs = document.querySelectorAll('input[type="range"]')
inputs[0].oninput = function () {
  inputs[0].value = inputs[1].value;
};
// 실행할 내용
function inputUpdate() {
  // 넘어오는 이벤트 주체의 값 (range의 경우이므로 0~100(%) 중 하나의 값)
  const perVal = this.value


  // slider-thumb(컨트롤 하는 버튼)의 값을 기준으로 전후 그라디언트
  this.style.background = `linear-gradient(to right, #FFDB4C 0%, #FFDB4C ${perVal}%, #C4C4C4 ${perVal}%, #C4C4C4 100%)`
}

// 공통
inputs.forEach(input => input.addEventListener('change', inputUpdate))
// 웹
inputs.forEach(input => input.addEventListener('mousemove', inputUpdate))
// 모바일
inputs.forEach(input => input.addEventListener('touchmove', inputUpdate))


// ! 홈 화면의 버튼 클릭시 지출내역 화면 위로

const drag_btn = document.querySelector(".drag_btn")
drag_btn.addEventListener("click", drag_use_history)

function drag_use_history() {
  const use_history = document.querySelector("section.bank_use_history")
  if (use_history.classList.contains("wide")) {

    use_history.classList.remove("wide")

  } else {
    use_history.classList.add("wide")

  }
}

// !  페이지 2( 지출관리 페이지) 열고 닫기
const link_chart = document.getElementById("link_chart") //열림 버튼
const btn_close = document.getElementById("btn_close") //닫기 버튼
const manage_budget = document.querySelector(".manage_budget") //page2

link_chart.addEventListener("click", openPage2)
btn_close.addEventListener("click", closePage2)

function openPage2() {
  manage_budget.classList.add("opened")
}

function closePage2() {
  manage_budget.classList.remove("opened")
}



// ! data 가져오기
const url = "https://syoon0624.github.io/json/test.json"
const reqObj = new XMLHttpRequest();
reqObj.open("GET", url);
reqObj.responseType = "json";
reqObj.send();
reqObj.addEventListener("load", dataload);
let bankList;
let dayList;
let cateList;
let dailySpend;
function dataload() {

  //  json에서 bankList 가져오기
  bankList = reqObj.response.bankList;

  //  json 데이터에서 keyname마다 값을 중복없이 배열로 가져오기
  dayList = getListBy("date");
  cateList = getListBy("classify");
  // 일별 지출 금액 계산 함수
  dailySpend=calc_DailySpend();

  // 1. 사용 내역 list에 data넣기
  make_Uselist();
  
  // 2.차트에 데이터 넣기 
  
  // 2.1 믹스 차트
  add_data_To_mix(); 
  // 2.2 도넛 차트
  // add_data_To_doughnut(); 
}

// 1. 사용 내역 list에 data넣는 함수
function make_Uselist(){
  // use_list_All의 기본 구조 만들기
  dayList.forEach(make_Uselist_Body);
  // 전체 리스트의 하위 li 전부 가져오기
  const use_list_All_li = document.querySelectorAll(".use_list_All li");
  // 각 객체를 list에 넣기
  for (let i = 0; i < bankList.length; i++) {
    
    for (let j = 0; j < dayList.length; j++) {
      
      if (bankList[i].date === dayList[j]) {
        
        // 날짜에 맞는 li의 ul가져오기
        const Data_ul = use_list_All_li[j].querySelector("ul");
        add_dataToList(Data_ul, bankList[i]);
        
        break; //break가 있어야 106*30=3180번 안 돈다
      } else {
        continue;
      }
    }
  }

}
// use_list_All의 기본 구조 만들어 주는 함수
function make_Uselist_Body(days) {
const ul_listALL = document.querySelector(".use_list_All");

// 요소 만들기
const _li = document.createElement("li");
  const _li_ul = document.createElement("ul");
  const _li_div = document.createElement("div");
  const _li_div_spanDay = document.createElement("span");
  // ! 총 지출을 나타내는 부분을 쪼개는 것은?
  let _li_div_spanSum = document.createElement("span");
  // let _li_div_spanSum_money=document.createElement("span");
  // let _li_div_spanSum_won=document.createElement("span");

  // 클래스 이름 주기
  _li_div.className = "dayAndSum";
  _li_div_spanDay.className = "__day";
  _li_div_spanSum.className = "__sum";
  _li_ul.className = "use_list_daily";
  // 날짜 data 넣기
  _li_div_spanDay.textContent = days;
  // 자식요소로 넣기
  ul_listALL.appendChild(_li);

  _li.appendChild(_li_div);
  _li.appendChild(_li_ul);

  _li_div.appendChild(_li_div_spanDay);
  _li_div.appendChild(_li_div_spanSum);


}
//use_list_All에 json으로 받아온 데이터 넣는 함수
function add_dataToList(Data_ul, Data) {

  // 요소 만들기
  const _li = document.createElement("li");
  const _li_spanName = document.createElement("span");
  const _li_spanPrice = document.createElement("span");

  // 클래스명 추가
  _li_spanName.className = "__name";
  _li_spanPrice.className = "__price";

  // 데이터 넣기
  _li_spanName.textContent = Data.history;
  _li_spanPrice.textContent = Data.price;
  _li_spanPrice.textContent += " 원";

  // 입금 내역이면 클래스 추가
  if (Data.income === "in") {
    _li_spanPrice.classList.add("in")
  }
  // 자식요소로 연결
  Data_ul.appendChild(_li);
  _li.appendChild(_li_spanName);
  _li.appendChild(_li_spanPrice);

}
// keyname별 값을 배열로 만들어 리턴 해주는 함수
function getListBy(keyname) {
  // set 객체로 중복 제거
  const b = new Set(bankList.map((datelist) => datelist[keyname]))
  // 다시 배열로 만들기
  const c = [...b];
  // TODO 차순으로 정리하기- 지금 당장은 PASS
  
  return c
  
}



//  하루 소비한 총 금액 구하는 함수
function calc_DailySpend() {
  // 날짜 리스트 길이 만큼 합계를 저장할 배열 선언
   dailySpend = Array.from({
    length: dayList.length
  }, () => 0);
  for (let i = 0; i < bankList.length; i++) {
    // 입금이면 해당 내역 pass
    if (bankList[i].income === "in") {
      continue;
    }
    // 지출일때만 합계에 저장
    else {
      for (let j = 0; j < dayList.length; j++) {

        if (bankList[i].date === dayList[j]) {
          dailySpend[j] += bankList[i].price;
          break;
        } else {
          continue;
        }
      }
    }

  }
  // console.log(dailySpend);
  return dailySpend;

}
//  카테고리 별 소비한 금액 구하는 함수
function bbb() {}

//  Mixed chart
function add_data_To_mix() {
  //chart 생성 
  const data = calc_DailySpend();
  new Chart(document.getElementById("mixed-chart"), {
    type: 'bar',
    data: {
      // 날짜 배열
      labels: dayList,
      //  라인 - 날짜별 총 지출 데이터 들어와야함
      datasets: [{
          label: "하루 지출 금액",
          type: "line",
          borderColor: "#8e5ea2",
          data: data,
          fill: false
        },
        //  막대 - 날짜별 총 지출 데이터가 들어와야함
        {
          label: "하루 지출 금액",
          type: "bar",
          backgroundColor: "rgba(0,0,0,0.2)",
          data: data,
        },
      ]
    },
    options: {
      responsive: false,
      title: {
        display: false,
        // text: 'Population growth (millions): Europe & Africa'
      },
      legend: {
        display: false
      }
    }
  });
  Chart.data.add(ba)
}
//  doughnut-chart
function add_data_To_doughnut() {
  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [{
        // label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
        data: [2478, 5267, 734, 784, 433]
      }]
    },


    options: {
      responsive: false,
      legend: {
        display: false
      },
      title: {
        display: false,
        text: 'Predicted world population (millions) in 2050'
      }
    }
  });
}