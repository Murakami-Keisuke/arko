'use strict';



let API_host = 'https://arkoapp.herokuapp.com/';
const e = React.createElement;
console.log(location.host);

if (location.host == '127.0.0.1:8000') {
  API_host = 'http://' + location.host + '/'
}

let room_selected = '';
let block_selected = '';

class Carddraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = { block: false, card: false };
  }

  Draw(block_id) {
    const local_url = 'card_api/';
    let blockid = block_id + '/';
    let url = API_host + local_url + blockid;
    console.log('Carddraw.Draw run.');
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ block: data.block, card: data.card });
        loading.style.display = "none";
      }).catch((reason) => {
        alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
        loading.style.display = "none";
      });
  }

  Pagechange(id) {
    loading.style.display = "block";
    room_dom.Draw(id);
  }

  render() {
    // this.sample();
    let list = [];
    // console.log(this.state.card);
    if (!this.state.card) {
      return <div>ブロックを選択してください</div>
    }
    movebtn_to_m.style.display = 'inline-block';
    for (let i of this.state.card) {
      let map_url = ""
      let link = ''

      if (i.address) {
        map_url = 'https://www.google.com/maps/search/' + i.address;
        link = <a className="btn btn-sm btn-outline-primary" href={map_url} target="_blank" rel="noopener noreferrer">地図を見る</a>
      }
      list.push(
        <div key={i.id}>
          <div className="sample_card">
            <p className="fs-5 title m-0"><b>{i.name}</b></p>
            <p className="m-0">{i.comment}</p>
            <p>{link}</p>
            <input type="hidden" value={i.id} />
            <div className="color_area_card" onClick={() => this.Pagechange(i.id)}><i className="bi bi-chevron-compact-right"></i></div>
          </div>
        </div>);
    }

    return (
      <div>
        <p>{this.state.block} <i className="bi bi-chevron-double-right"></i></p>
        {list}
      </div>);
  }
}


class Roomdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = { block: false, card: false, room: false };
    this.room_selected = ''
    this.promise = ''
  }

  Draw(card_id) {
    // console.log(e.target);
    // const card_id = e.target.closest('.sample_card').querySelector('input').value;
    const local_url = 'room_api/';
    let cardid = card_id + '/';
    let url = API_host + local_url + cardid;
    console.log('Roomdraw.Draw run.');
    this.promise = fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.setState({ block: data.block, card: data.card, room: data.room });
        loading.style.display = "none";
        page_card.classList.remove('page_show');
        page_room.classList.add('page_show');

      }).catch((reason) => {
        alert('通信に失敗しました。もう一度お試しください。(ルーム情報取得失敗)');
        loading.style.display = "none";
      });
  }

  Colorclick(e, isban) {
    if (isban == 'True') {
      e.preventDefault();
    } else {
    }
  }

  render() {
    // this.sample();
    let list = [];
    // console.log(this.state.room);
    if (!this.state.room) {
      return <div>Enpty.</div>
    }
    if (this.state.room == "") {
      return <div>コンテンツがありません</div>
    }
    for (let i of this.state.room) {
      let color = "white"
      let isban = false;
      let colorerea = ""
      const statusvalue = document.querySelector('#status_value')
      if (i.stat_id) {
        color = statusvalue.querySelector('#stat_' + i.stat_id).value;
        isban = statusvalue.querySelector('#stat_' + i.stat_id).getAttribute('isban');
        console.log("isban" + isban);
      }

      let date = Date.parse(i.update_at);
      date = new Date(date);
      let date_jp = date.toLocaleString('ja-JP');
      // console.log(date_jp);

      if (isban == 'True') {
        colorerea = <div className="color_area"
          name={i.id}
          style={{ backgroundColor: color }}
        ></div>
      } else {
        colorerea = <div className="color_area"
          name={i.id}
          style={{ backgroundColor: color }}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={(e) => { room_selected = i.id; }}
        ></div>
      }


      list.push(
        <div key={i.id}>
          <div className="sample_card">
            <p className="fs-5 title m-0"><b>{i.name}</b></p>
            <p className="m-0">{i.comment}</p>
            <p>
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                onClick={() => { history_dom.Draw(i.id) }}>
                <i className="bi bi-box-arrow-in-left"></i>詳細
              </button>
              更新日時: {date_jp}
            </p>
            <input type="hidden" value={i.id} />
            {colorerea}
          </div>
        </div>);
    }

    return (
      <div>
        <p >
          {this.state.block} <i className="bi bi-chevron-double-right"></i>
          {this.state.card} <i className="bi bi-chevron-double-right"></i>
        </p>
        {list}
      </div>);
  }
}


class Historydraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = { history: false, room: false };
  }

  Draw(room_id) {
    // console.log(e.target);
    // const card_id = e.target.closest('.sample_card').querySelector('input').value;
    const local_url = 'history_modal_api/';
    let cardid = room_id + '/';
    let url = API_host + local_url + cardid;
    console.log('Historydraw.Draw run.');
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.setState({ history: data.history, room: data.room });
      }).catch((reason) => {
        alert('通信に失敗しました。もう一度お試しください。(履歴情報取得失敗)');
      });
  }

  render() {
    // this.sample();
    let list = [];
    // console.log(this.state.room);
    if (!this.state.history) {
      return <div><p className="fs-4">
        {this.state.room}の履歴
      </p>Enpty.</div>
    }
    if (this.state.history == "") {
      return <div><p className="fs-4">
        {this.state.room}の履歴
      </p>コンテンツがありません</div>
    }
    for (let i of this.state.history) {
      list.push(
        <p key={i.id}>
          {i.string}
        </p>);
    }

    return (
      <div>
        <p className="fs-4">
          {this.state.room}の履歴
        </p>
        {list}
      </div>);
  }
}


class Missiondraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = { block: false, card: false, room: false };
  }

  Draw(block_id, API_host) {
    const local_url = 'mission_api/';
    let blockid = block_id + '/';
    let url = API_host + local_url + blockid;
    console.log('Missiondraw.Draw run.');
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ block: data.block, card: data.card, room: data.room });
        loading.style.display = "none";
        page_card.classList.remove('page_show');
        page_mission.classList.add('page_show');
      }).catch((reason) => {
        alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
        loading.style.display = "none";
      });
  }

  // Pagechange(id){
  //   loading.style.display = "block";
  //   room_dom.Draw(id);
  // }

  render() {
    // this.sample();
    let elm = [];
    // console.log(this.state.card);
    let i = this.state.card
    if (!i) {
      return <div>コンテンツはありません</div>
    }
    let map_url = ""
    let link = ''
    if (i.address) {
      map_url = 'https://www.google.com/maps/search/' + i.address;
      link = <a className="btn btn-sm btn-outline-primary" href={map_url} target="_blank" rel="noopener noreferrer">地図を見る</a>
    }
    elm.push(
      <div key={i.id}>

        <p className="fs-5 title m-0"><b>{i.name}</b><i className="bi bi-chevron-double-right"></i></p>
        <p className="m-0">{i.comment}</p>
        <p>{link}</p>
        <input type="hidden" value={i.id} />


      </div>);

    let j = this.state.room
    let color = "white"
    let isban = false;
    let colorerea = ""
    const statusvalue = document.querySelector('#status_value')
    if (j.stat_id) {
      color = statusvalue.querySelector('#stat_' + j.stat_id).value;
      isban = statusvalue.querySelector('#stat_' + j.stat_id).getAttribute('isban');
      console.log("isban" + isban);
    }

    let date = Date.parse(j.update_at);
    date = new Date(date);
    let date_jp = date.toLocaleString('ja-JP');
    // console.log(date_jp);

    if (isban == 'True') {
      colorerea = <div className="color_area"
        name={j.id}
        style={{ backgroundColor: color }}
      ></div>
    } else {
      colorerea = <div className="color_area"
        name={j.id}
        style={{ backgroundColor: color }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={(e) => { room_selected = j.id; }}
      ></div>
    }


    elm.push(
      <div key={j.id}>
        <div className="sample_card">
          <p className="fs-5 title m-0"><b>{j.name}</b></p>
          <p className="m-0">{j.comment}</p>
          <p>
            <button
              className="btn btn-sm btn-outline-primary"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
              onClick={() => { history_dom.Draw(j.id) }}>
              <i className="bi bi-box-arrow-in-left"></i>詳細
            </button>
            更新日時: {date_jp}
          </p>
          <input type="hidden" value={j.id} />
          {colorerea}
        </div>
      </div>);


    return (
      <div>
        <p>{this.state.block} <i className="bi bi-chevron-double-right"></i> ミッションモード</p>
        {elm}
      </div>);
  }
}


// 下のhistoryAPI内から呼ぶ関数
// 該当のColoeareaのBackgroundColorをセット
const SetColor = (room_selected, stat_color) => {
  let querystr = '.color_area[name="' + room_selected + '"]'
  const colorarea = document.querySelector(querystr);
  colorarea.style.backgroundColor = stat_color;
}


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
      console.log('change success');
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
  let csrf_token = ""
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
  block_selected = block_id
  card_dom.Draw(block_id)
}

const mission_draw = (e) => {
  loading.style.display = "block";

  mission_dom.Draw(block_selected, API_host)
}


const move_to_card = () => {
  page_card.classList.add('page_show');
  page_room.classList.remove('page_show');
}

const move_to_card_m = () => {
  page_card.classList.add('page_show');
  page_mission.classList.remove('page_show');
}

// カードの描画
const domContainer = document.querySelector('#card_container');
const card_dom = ReactDOM.render(<Carddraw />, domContainer);

// ルームの描画
const domContainer2 = document.querySelector('#room_container');
const room_dom = ReactDOM.render(<Roomdraw />, domContainer2);

// ミッションの描画
const domContainer3 = document.querySelector('#mission_container');
const mission_dom = ReactDOM.render(<Missiondraw />, domContainer3);

// 履歴モーダルの描画
const historycontainer = document.querySelector('#historycontainer');
const history_modal = document.querySelector('#exampleModal2');

const history_dom = ReactDOM.render(<Historydraw />, historycontainer);


// ブロック選択の挙動
const block_list = document.querySelectorAll(".block_list")
block_list.forEach((i) => {
  i.addEventListener('click', card_draw);
});

// ページコンテナの遷移
const page_card = document.querySelector(".page_card");
const page_room = document.querySelector(".page_room");
const page_mission = document.querySelector(".page_mission");

const movebtn = page_room.querySelector("#movebtn");
movebtn.addEventListener('click', move_to_card)

const backbtn_m = page_mission.querySelector("#backbtn_m");
backbtn_m.addEventListener('click', move_to_card_m)

const movebtn_to_m = page_card.querySelector("#movebtn_to_m");
movebtn_to_m.addEventListener('click', mission_draw);

const nextbtn = page_mission.querySelector("#nextbtn");
nextbtn.addEventListener('click', mission_draw);


const user_id = document.querySelector("#user_id").value;
const stat_list = document.querySelectorAll(".stat_list")
stat_list.forEach((i) => {
  i.addEventListener('click', CSRFToken);
});


// ローディング画面
const loading = document.querySelector(".loading");
loading.style.display = "none";

