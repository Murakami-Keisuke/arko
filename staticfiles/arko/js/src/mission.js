import {Historydraw} from './history.js';

class Missiondraw extends React.Component {
    constructor(props) {
      super(props);
      this.page_card=props.page_card;
      this.page_mission= props.page_mission;
      this.API_host=props.API_host;
      this.historycontainer=props.historycontainer;
      this.loading=props.loading;
      this.set_room= props.set_room;
      this.state = { block: false, card: false, room: false };
    }
  
    Draw(block_id, API_host) {
      const local_url = 'mission_api/';
      let blockid = block_id + '/';
      let url = this.API_host + local_url + blockid;
      console.log('Missiondraw.Draw run.');
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.setState({ block: data.block, card: data.card, room: data.room });
          this.loading.style.display = "none";
          this.page_card.classList.remove('page_show');
          this.page_mission.classList.add('page_show');
        }).catch((reason) => {
          alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
          this.loading.style.display = "none";
        });
    }
  
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
        <div key={'c_'+i.id}>
  
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
        // console.log("isban" + isban);
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
          onClick={(e) => { this.set_room(j.id) }}
        ></div>
      }
  
  
      elm.push(
        <div key={'r_'+j.id}>
          <div className="sample_card">
            <p className="fs-5 title m-0"><b>{j.name}</b></p>
            <p className="m-0">{j.comment}</p>
            <p>
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                // onClick={() => { history_dom.Draw(j.id) }}>
                // onClick={() => {this.History_click(j.id)}}>
                onClick={() => {ReactDOM.render(<Historydraw room_id={j.id} API_host={this.API_host}/>, this.historycontainer); }}>
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
  
export {Missiondraw};