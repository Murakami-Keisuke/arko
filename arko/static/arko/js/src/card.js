import {Roomdraw} from './room.js';

class Carddraw extends React.Component {
    constructor(props) {
      super(props);
      this.API_host= props.API_host;
      this.domContainer2= props.domContainer2;
      this.loading= props.loading;
      this.state = { block: false, card: false };
    }
  
    // Draw(block_id) {
    componentDidUpdate(prevProps) {
      if(this.props.block_id !== prevProps.block_id){
        const local_url = 'card_api/';
        let blockid = this.props.block_id + '/';
        let url = this.API_host + local_url + blockid;
        console.log('Carddraw.componentDidUpdate run.');
        fetch(url)
            .then(response => response.json())
            .then(data => {
            this.setState({ block: data.block, card: data.card });
            this.loading.style.display = "none";
            }).catch((reason) => {
            alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
            this.loading.style.display = "none";
            });
      }else{
        this.loading.style.display = "none";
      }
    }
  
    Pagechange(id) {
      this.loading.style.display = "block";
      // room_dom.Draw(id);
      ReactDOM.render(<Roomdraw card_id={id}/>, this.domContainer2);
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
  
export {Carddraw};