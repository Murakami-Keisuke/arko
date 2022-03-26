'use strict';

import { Historydraw } from './history.js';
import { Missiondraw } from './mission.js';
import { Roomdraw } from './room.js';
import { Carddraw } from './card.js';

var API_host = 'https://arkoapp.herokuapp.com/';
var e = React.createElement;
console.log(location.host);

if (location.host == '127.0.0.1:8000') {
  API_host = 'http://' + location.host + '/';
};

var room_selected = '';
var block_selected = '';

var set_room_selected = function set_room_selected(id) {
  room_selected = id;
};

// 下のhistoryAPI内から呼ぶ関数
// 該当のColoeareaのBackgroundColorをセット
var SetColor = function SetColor(room_selected, stat_color) {
  var querystr = '.color_area[name="' + room_selected + '"]';
  var colorarea = document.querySelector(querystr);
  colorarea.style.backgroundColor = stat_color;
  loading.style.display = "none";
};

// Roomコンテンツのステータス変更をバックエンドに送る
var historyAPI = function historyAPI(e, csrf_token) {
  var stat_id = e.target.getAttribute('name');
  var stat_color = e.target.getAttribute('id');
  // console.log("room"+room_selected);

  // サーバへ送りたいデータ
  var data = {
    'stat_id': stat_id,
    'room_id': room_selected,
    'user_id': user_id
  };

  // FetchAPIのオプション準備
  var param = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      'X-CSRFToken': csrf_token
    },

    // リクエストボディ
    body: JSON.stringify(data)
  };
  var local_url = 'history_api/';
  var url = API_host + local_url;
  fetch(url, param).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log('change success at history_API()');
  }).catch(function (reason) {
    console.log(reason);
    alert('通信に失敗しました。もう一度お試しください。');
    return;
  }).then(function (data) {
    SetColor(room_selected, stat_color);
  });
};

var CSRFToken = function CSRFToken(e) {
  var local_csrf_url = 'get_csrf/';
  var url = API_host + local_csrf_url;
  var csrf_token = "";
  loading.style.display = "block";
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    csrf_token = data.token;
    historyAPI(e, csrf_token);
  }).catch(function (reason) {
    alert('通信に失敗しました。もう一度お試しください。(CSRFtoken取得失敗)');
  });
};

var card_draw = function card_draw(e) {
  loading.style.display = "block";
  var block_id = e.target.querySelector('input').value;
  block_selected = block_id;
  // card_dom.Draw(block_id);
  ReactDOM.render(React.createElement(Carddraw, { block_id: block_id }), domContainer);
};

var mission_draw = function mission_draw(e) {
  loading.style.display = "block";

  mission_dom.Draw(block_selected, API_host);
};

var move_to_card = function move_to_card() {
  page_card.classList.add('page_show');
  page_room.classList.remove('page_show');
};

var move_to_card_m = function move_to_card_m() {
  page_card.classList.add('page_show');
  page_mission.classList.remove('page_show');
};

// 履歴モーダルの描画
var historycontainer = document.querySelector('#historycontainer');
var history_modal = document.querySelector('#exampleModal2');

var history_dom = ReactDOM.render(React.createElement(Historydraw, null), historycontainer);

// ブロック選択の挙動
var block_list = document.querySelectorAll(".block_list");
block_list.forEach(function (i) {
  i.addEventListener('click', card_draw);
});

// ページコンテナの遷移
var page_card = document.querySelector(".page_card");
var page_room = document.querySelector(".page_room");
var page_mission = document.querySelector(".page_mission");

var movebtn = page_room.querySelector("#movebtn");
movebtn.addEventListener('click', move_to_card);

var backbtn_m = page_mission.querySelector("#backbtn_m");
backbtn_m.addEventListener('click', move_to_card_m);

var movebtn_to_m = page_card.querySelector("#movebtn_to_m");
movebtn_to_m.addEventListener('click', mission_draw);

var nextbtn = page_mission.querySelector("#nextbtn");
nextbtn.addEventListener('click', mission_draw);

var user_id = document.querySelector("#user_id").value;
var stat_list = document.querySelectorAll(".stat_list");
stat_list.forEach(function (i) {
  i.addEventListener('click', CSRFToken);
});

// ローディング画面
var loading = document.querySelector(".loading");
loading.style.display = "none";

// ルームの描画
var domContainer2 = document.querySelector('#room_container');
var room_dom = ReactDOM.render(React.createElement(Roomdraw, {
  page_card: page_card,
  page_room: page_room,
  API_host: API_host,
  historycontainer: historycontainer,
  loading: loading,
  set_room: set_room_selected
}), domContainer2);

// ミッションの描画
var domContainer3 = document.querySelector('#mission_container');
var mission_dom = ReactDOM.render(React.createElement(Missiondraw, {
  page_card: page_card,
  page_mission: page_mission,
  API_host: API_host,
  historycontainer: historycontainer,
  loading: loading,
  set_room: set_room_selected
}), domContainer3);

// カードの描画
var domContainer = document.querySelector('#card_container');
var card_dom = ReactDOM.render(React.createElement(Carddraw, {
  API_host: API_host,
  domContainer2: domContainer2,
  loading: loading
}), domContainer);