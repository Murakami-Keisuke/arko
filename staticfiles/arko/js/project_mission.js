var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Missiondraw = function (_React$Component) {
  _inherits(Missiondraw, _React$Component);

  function Missiondraw(props) {
    _classCallCheck(this, Missiondraw);

    var _this = _possibleConstructorReturn(this, (Missiondraw.__proto__ || Object.getPrototypeOf(Missiondraw)).call(this, props));

    _this.state = { block: false, card: false, room: false };
    return _this;
  }

  _createClass(Missiondraw, [{
    key: 'Draw',
    value: function Draw(block_id, API_host, loading, page_card, page_mission) {
      var _this2 = this;

      var local_url = 'mission_api/';
      var blockid = block_id + '/';
      var url = API_host + local_url + blockid;
      console.log('Missiondraw.Draw run.');
      fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setState({ block: data.block, card: data.card, room: data.room });
        loading.style.display = "none";
        page_card.classList.remove('page_show');
        page_mission.classList.add('page_show');
      }).catch(function (reason) {
        alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
        loading.style.display = "none";
      });
    }
  }, {
    key: 'render',
    value: function render() {
      // this.sample();
      var elm = [];
      // console.log(this.state.card);
      var i = this.state.card;
      if (!i) {
        return React.createElement(
          'div',
          null,
          '\u30B3\u30F3\u30C6\u30F3\u30C4\u306F\u3042\u308A\u307E\u305B\u3093'
        );
      }
      var map_url = "";
      var link = '';
      if (i.address) {
        map_url = 'https://www.google.com/maps/search/' + i.address;
        link = React.createElement(
          'a',
          { className: 'btn btn-sm btn-outline-primary', href: map_url, target: '_blank', rel: 'noopener noreferrer' },
          '\u5730\u56F3\u3092\u898B\u308B'
        );
      }
      elm.push(React.createElement(
        'div',
        { key: i.id },
        React.createElement(
          'p',
          { className: 'fs-5 title m-0' },
          React.createElement(
            'b',
            null,
            i.name
          ),
          React.createElement('i', { className: 'bi bi-chevron-double-right' })
        ),
        React.createElement(
          'p',
          { className: 'm-0' },
          i.comment
        ),
        React.createElement(
          'p',
          null,
          link
        ),
        React.createElement('input', { type: 'hidden', value: i.id })
      ));

      var j = this.state.room;
      var color = "white";
      var isban = false;
      var colorerea = "";
      var statusvalue = document.querySelector('#status_value');
      if (j.stat_id) {
        color = statusvalue.querySelector('#stat_' + j.stat_id).value;
        isban = statusvalue.querySelector('#stat_' + j.stat_id).getAttribute('isban');
        console.log("isban" + isban);
      }

      var date = Date.parse(j.update_at);
      date = new Date(date);
      var date_jp = date.toLocaleString('ja-JP');
      // console.log(date_jp);

      if (isban == 'True') {
        colorerea = React.createElement('div', { className: 'color_area',
          name: j.id,
          style: { backgroundColor: color }
        });
      } else {
        colorerea = React.createElement('div', { className: 'color_area',
          name: j.id,
          style: { backgroundColor: color },
          'data-bs-toggle': 'modal',
          'data-bs-target': '#exampleModal',
          onClick: function onClick(e) {
            room_selected = j.id;
          }
        });
      }

      elm.push(React.createElement(
        'div',
        { key: j.id },
        React.createElement(
          'div',
          { className: 'sample_card' },
          React.createElement(
            'p',
            { className: 'fs-5 title m-0' },
            React.createElement(
              'b',
              null,
              j.name
            )
          ),
          React.createElement(
            'p',
            { className: 'm-0' },
            j.comment
          ),
          React.createElement(
            'p',
            null,
            React.createElement(
              'button',
              {
                className: 'btn btn-sm btn-outline-primary',
                type: 'button',
                'data-bs-toggle': 'modal',
                'data-bs-target': '#exampleModal2',
                onClick: function onClick() {
                  Historydraw.Draw(j.id);
                } },
              React.createElement('i', { className: 'bi bi-box-arrow-in-left' }),
              '\u8A73\u7D30'
            ),
            '\u66F4\u65B0\u65E5\u6642: ',
            date_jp
          ),
          React.createElement('input', { type: 'hidden', value: j.id }),
          colorerea
        )
      ));

      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          this.state.block,
          ' ',
          React.createElement('i', { className: 'bi bi-chevron-double-right' }),
          ' \u30DF\u30C3\u30B7\u30E7\u30F3\u30E2\u30FC\u30C9'
        ),
        elm
      );
    }
  }]);

  return Missiondraw;
}(React.Component);

export { Missiondraw };