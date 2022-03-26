import {Historydraw} from './history.js';

class Roomdraw extends React.Component {
    constructor(props) {
      super(props);
      this.page_card=props.page_card;
      this.page_room=props.page_room;
      this.API_host=props.API_host;
      this.historycontainer=props.historycontainer;
      this.loading=props.loading;
      this.set_room= props.set_room;
      this.state = { block: false, card: false, room: false };

    }
  
    componentDidUpdate(prevProps) {
      if(this.props.card_id !== prevProps.card_id){
        const local_url = 'room_api/';
        let cardid = this.props.card_id + '/';
        let url = this.API_host + local_url + cardid;
        console.log('Roomdraw.componentDidUpdate run.');
        fetch(url)
            .then(response => response.json())
            .then((data) => {
            this.setState({ block: data.block, card: data.card, room: data.room });
            this.loading.style.display = "none";
            this.page_card.classList.remove('page_show');
            this.page_room.classList.add('page_show');
    
            }).catch((reason) => {
            alert('通信に失敗しました。もう一度お試しください。(ルーム情報取得失敗)');
            this.loading.style.display = "none";
            });

        }
      
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
          // console.log("isban" + isban);
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
            onClick={(e) => { this.set_room(i.id); }}
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
                  // onClick={() => {this.History_click(i.id)}}>
                  onClick={() => {ReactDOM.render(<Historydraw room_id={i.id} API_host={this.API_host}/>, this.historycontainer); }}>
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

  export {Roomdraw};