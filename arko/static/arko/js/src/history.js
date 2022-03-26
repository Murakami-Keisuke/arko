class Historydraw extends React.Component {
    constructor(props) {
      super(props);
      this.state = { history: false, room: false };
    }
  
    componentDidUpdate(prevProps){
      if(this.props.room_id !== prevProps.room_id){
        const local_url = 'history_modal_api/';
        let cardid = this.props.room_id + '/';
        let url = this.props.API_host + local_url + cardid;
        console.log('History_componentDidUpdate run.');
        fetch(url)
          .then(response => response.json())
          .then((data) => {
            this.setState({ history: data.history, room: data.room });
            // ReactDOM.render(<Historydraw history={data.history} room={data.room}/>, historycontainer); 
          }).catch((reason) => {
          alert('通信に失敗しました。もう一度お試しください。(履歴情報取得失敗)');
          });

      }
    }

    render() {
      let list = [];
      // console.log(this.state.room);
      if (!this.state.history) {
        return <div><p className="fs-4">
          {this.state.room}の履歴
        </p>Empty.</div>
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

export {Historydraw}