var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Historydraw } from './history.js';

var Roomdraw = function (_React$Component) {
  _inherits(Roomdraw, _React$Component);

  function Roomdraw(props) {
    _classCallCheck(this, Roomdraw);

    var _this = _possibleConstructorReturn(this, (Roomdraw.__proto__ || Object.getPrototypeOf(Roomdraw)).call(this, props));

    _this.page_card = props.page_card;
    _this.page_room = props.page_room;
    _this.API_host = props.API_host;
    _this.historycontainer = props.historycontainer;
    _this.loading = props.loading;
    _this.set_room = props.set_room;
    _this.state = { block: false, card: false, room: false };

    return _this;
  }

  _createClass(Roomdraw, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      if (this.props.card_id !== prevProps.card_id) {
        var local_url = 'room_api/';
        var cardid = this.props.card_id + '/';
        var url = this.API_host + local_url + cardid;
        console.log('Roomdraw.componentDidUpdate run.');
        fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          _this2.setState({ block: data.block, card: data.card, room: data.room });
          _this2.loading.style.display = "none";
          _this2.page_card.classList.remove('page_show');
          _this2.page_room.classList.add('page_show');
        }).catch(function (reason) {
          alert('通信に失敗しました。もう一度お試しください。(ルーム情報取得失敗)');
          _this2.loading.style.display = "none";
        });
      }
    }
  }, {
    key: 'Colorclick',
    value: function Colorclick(e, isban) {
      if (isban == 'True') {
        e.preventDefault();
      } else {}
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      // this.sample();
      var list = [];
      // console.log(this.state.room);
      if (!this.state.room) {
        return React.createElement(
          'div',
          null,
          'Enpty.'
        );
      }
      if (this.state.room == "") {
        return React.createElement(
          'div',
          null,
          '\u30B3\u30F3\u30C6\u30F3\u30C4\u304C\u3042\u308A\u307E\u305B\u3093'
        );
      }

      var _loop = function _loop(i) {
        var color = "white";
        var isban = false;
        var colorerea = "";
        var statusvalue = document.querySelector('#status_value');
        if (i.stat_id) {
          color = statusvalue.querySelector('#stat_' + i.stat_id).value;
          isban = statusvalue.querySelector('#stat_' + i.stat_id).getAttribute('isban');
          // console.log("isban" + isban);
        }

        var date = Date.parse(i.update_at);
        date = new Date(date);
        var date_jp = date.toLocaleString('ja-JP');
        // console.log(date_jp);

        if (isban == 'True') {
          colorerea = React.createElement('div', { className: 'color_area',
            name: i.id,
            style: { backgroundColor: color }
          });
        } else {
          colorerea = React.createElement('div', { className: 'color_area',
            name: i.id,
            style: { backgroundColor: color },
            'data-bs-toggle': 'modal',
            'data-bs-target': '#exampleModal',
            onClick: function onClick(e) {
              _this3.set_room(i.id);
            }
          });
        }

        list.push(React.createElement(
          'div',
          { key: i.id },
          React.createElement(
            'div',
            { className: 'sample_card' },
            React.createElement(
              'p',
              { className: 'fs-5 title m-0' },
              React.createElement(
                'b',
                null,
                i.name
              )
            ),
            React.createElement(
              'p',
              { className: 'm-0' },
              i.comment
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
                  'data-bs-target': '#exampleModal2'
                  // onClick={() => {this.History_click(i.id)}}>
                  , onClick: function onClick() {
                    ReactDOM.render(React.createElement(Historydraw, { room_id: i.id, API_host: _this3.API_host }), _this3.historycontainer);
                  } },
                React.createElement('i', { className: 'bi bi-box-arrow-in-left' }),
                '\u8A73\u7D30'
              ),
              '\u66F4\u65B0\u65E5\u6642: ',
              date_jp
            ),
            React.createElement('input', { type: 'hidden', value: i.id }),
            colorerea
          )
        ));
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.room[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          _loop(i);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          this.state.block,
          ' ',
          React.createElement('i', { className: 'bi bi-chevron-double-right' }),
          this.state.card,
          ' ',
          React.createElement('i', { className: 'bi bi-chevron-double-right' })
        ),
        list
      );
    }
  }]);

  return Roomdraw;
}(React.Component);

export { Roomdraw };