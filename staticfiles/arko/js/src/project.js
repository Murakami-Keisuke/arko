'use strict';

import {Historydraw} from './history.js';
import {Missiondraw} from './mission.js';
import {Roomdraw} from './room.js';
import {Carddraw} from './card.js';


let API_host = 'https://arkoapp.herokuapp.com/';
const e = React.createElement;
console.log(location.host);

if (location.host == '127.0.0.1:8000') {
  API_host = 'http://' + location.host + '/'
};

let room_selected = '';
let block_selected = '';

const set_room_selected = (id)=>{
  room_selected=id;
};

// 下のhistoryAPI内から呼ぶ関数
// 該当のColoeareaのBackgroundColorをセット
const SetColor = (room_selected, stat_color) => {
  let querystr = '.color_area[name="' + room_selected + '"]'
  const colorarea = document.querySelector(querystr);
  colorarea.style.backgroundColor = stat_color;
  loading.style.display = "none";
};


// Roomコンテンツのステータス変更をバックエンドに送る
const historyAPI = (e, csrf_token) => {
  const stat_id = e.target.getAttribute('name');
  const stat_color = e.target.getAttribute('id');
  // console.log("room"+room_selected);

  // サーバへ送りたいデータ
  const data = {
    'stat_id': stat_id,
    'room_id': room_selected,
    'user_id': user_id
  };

  // FetchAPIのオプション準備
  const param = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      'X-CSRFToken': csrf_token,
    },

    // リクエストボディ
    body: JSON.stringify(data)
  };
  const local_url = 'history_api/';
  let url = API_host + local_url;
  fetch(url, param)
    .then(response => response.json())
    .then((data) => {
      console.log('change success at history_API()');
    }).catch((reason) => {
      console.log(reason);
      alert('通信に失敗しました。もう一度お試しください。');
      return;
    }).then((data) => {
      SetColor(room_selected, stat_color);
    });
}

const CSRFToken = (e) => {
  const local_csrf_url = 'get_csrf/';
  let url = API_host + local_csrf_url;
  let csrf_token = "";
  loading.style.display = "block";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      csrf_token = data.token;
      historyAPI(e, csrf_token);
    }).catch((reason) => {
      alert('通信に失敗しました。もう一度お試しください。(CSRFtoken取得失敗)');
    });
}




const card_draw = (e) => {
  loading.style.display = "block";
  const block_id = e.target.querySelector('input').value;
  block_selected = block_id;
  // card_dom.Draw(block_id);
  ReactDOM.render(<Carddraw block_id={block_id} />, domContainer);
}

const mission_draw = (e) => {
  loading.style.display = "block";

  mission_dom.Draw(block_selected, API_host);
}


const move_to_card = () => {
  page_card.classList.add('page_show');
  page_room.classList.remove('page_show');
}

const move_to_card_m = () => {
  page_card.classList.add('page_show');
  page_mission.classList.remove('page_show');
}


// 履歴モーダルの描画
const historycontainer = document.querySelector('#historycontainer');
const history_modal = document.querySelector('#exampleModal2');

const history_dom = ReactDOM.render(<Historydraw />, historycontainer);



// ブロック選択の挙動
const block_list = document.querySelectorAll(".block_list");
block_list.forEach((i) => {
  i.addEventListener('click', card_draw);
});

// ページコンテナの遷移
const page_card = document.querySelector(".page_card");
const page_room = document.querySelector(".page_room");
const page_mission = document.querySelector(".page_mission");

const movebtn = page_room.querySelector("#movebtn");
movebtn.addEventListener('click', move_to_card);

const backbtn_m = page_mission.querySelector("#backbtn_m");
backbtn_m.addEventListener('click', move_to_card_m);

const movebtn_to_m = page_card.querySelector("#movebtn_to_m");
movebtn_to_m.addEventListener('click', mission_draw);

const nextbtn = page_mission.querySelector("#nextbtn");
nextbtn.addEventListener('click', mission_draw);


const user_id = document.querySelector("#user_id").value;
const stat_list = document.querySelectorAll(".stat_list");
stat_list.forEach((i) => {
  i.addEventListener('click', CSRFToken);
});


// ローディング画面
const loading = document.querySelector(".loading");
loading.style.display = "none";



// ルームの描画
const domContainer2 = document.querySelector('#room_container');
const room_dom = ReactDOM.render(<Roomdraw 
  page_card={page_card}
  page_room={page_room}
  API_host={API_host}
  historycontainer={historycontainer}
  loading={loading}
  set_room={set_room_selected}
  />, domContainer2);

// ミッションの描画
const domContainer3 = document.querySelector('#mission_container');
const mission_dom = ReactDOM.render(<Missiondraw 
  page_card={page_card} 
  page_mission={page_mission}
  API_host={API_host}
  historycontainer={historycontainer}
  loading={loading}
  set_room={set_room_selected}
  />,
  domContainer3);

// カードの描画
const domContainer = document.querySelector('#card_container');
const card_dom = ReactDOM.render(<Carddraw 
  API_host={API_host}
  domContainer2={domContainer2}
  loading={loading}
  />, domContainer);
