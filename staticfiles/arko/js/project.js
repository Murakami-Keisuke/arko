'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var API_host = 'https://arkoapp.herokuapp.com/';
var e = React.createElement;
console.log(location.host);

if (location.host == '127.0.0.1:8000') {
  API_host = 'http://' + location.host + '/';
}

var room_selected = '';
var block_selected = '';

var Carddraw = function (_React$Component) {
  _inherits(Carddraw, _React$Component);

  function Carddraw(props) {
    _classCallCheck(this, Carddraw);

    var _this = _possibleConstructorReturn(this, (Carddraw.__proto__ || Object.getPrototypeOf(Carddraw)).call(this, props));

    _this.state = { block: false, card: false };
    return _this;
  }

  _createClass(Carddraw, [{
    key: 'Draw',
    value: function Draw(block_id) {
      var _this2 = this;

      var local_url = 'card_api/';
      var blockid = block_id + '/';
      var url = API_host + local_url + blockid;
      console.log('Carddraw.Draw run.');
      fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setState({ block: data.block, card: data.card });
        loading.style.display = "none";
      }).catch(function (reason) {
        alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
        loading.style.display = "none";
      });
    }
  }, {
    key: 'Pagechange',
    value: function Pagechange(id) {
      loading.style.display = "block";
      room_dom.Draw(id);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      // this.sample();
      var list = [];
      // console.log(this.state.card);
      if (!this.state.card) {
        return React.createElement(
          'div',
          null,
          '\u30D6\u30ED\u30C3\u30AF\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044'
        );
      }
      movebtn_to_m.style.display = 'inline-block';

      var _loop = function _loop(i) {
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
              link
            ),
            React.createElement('input', { type: 'hidden', value: i.id }),
            React.createElement(
              'div',
              { className: 'color_area_card', onClick: function onClick() {
                  return _this3.Pagechange(i.id);
                } },
              React.createElement('i', { className: 'bi bi-chevron-compact-right' })
            )
          )
        ));
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.card[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
          React.createElement('i', { className: 'bi bi-chevron-double-right' })
        ),
        list
      );
    }
  }]);

  return Carddraw;
}(React.Component);

var Roomdraw = function (_React$Component2) {
  _inherits(Roomdraw, _React$Component2);

  function Roomdraw(props) {
    _classCallCheck(this, Roomdraw);

    var _this4 = _possibleConstructorReturn(this, (Roomdraw.__proto__ || Object.getPrototypeOf(Roomdraw)).call(this, props));

    _this4.state = { block: false, card: false, room: false };
    _this4.room_selected = '';
    _this4.promise = '';
    return _this4;
  }

  _createClass(Roomdraw, [{
    key: 'Draw',
    value: function Draw(card_id) {
      var _this5 = this;

      // console.log(e.target);
      // const card_id = e.target.closest('.sample_card').querySelector('input').value;
      var local_url = 'room_api/';
      var cardid = card_id + '/';
      var url = API_host + local_url + cardid;
      console.log('Roomdraw.Draw run.');
      this.promise = fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this5.setState({ block: data.block, card: data.card, room: data.room });
        loading.style.display = "none";
        page_card.classList.remove('page_show');
        page_room.classList.add('page_show');
      }).catch(function (reason) {
        alert('通信に失敗しました。もう一度お試しください。(ルーム情報取得失敗)');
        loading.style.display = "none";
      });
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

      var _loop2 = function _loop2(i) {
        var color = "white";
        var isban = false;
        var colorerea = "";
        var statusvalue = document.querySelector('#status_value');
        if (i.stat_id) {
          color = statusvalue.querySelector('#stat_' + i.stat_id).value;
          isban = statusvalue.querySelector('#stat_' + i.stat_id).getAttribute('isban');
          console.log("isban" + isban);
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
              room_selected = i.id;
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
                  'data-bs-target': '#exampleModal2',
                  onClick: function onClick() {
                    history_dom.Draw(i.id);
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.state.room[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var i = _step2.value;

          _loop2(i);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
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

var Historydraw = function (_React$Component3) {
  _inherits(Historydraw, _React$Component3);

  function Historydraw(props) {
    _classCallCheck(this, Historydraw);

    var _this6 = _possibleConstructorReturn(this, (Historydraw.__proto__ || Object.getPrototypeOf(Historydraw)).call(this, props));

    _this6.state = { history: false, room: false };
    return _this6;
  }

  _createClass(Historydraw, [{
    key: 'Draw',
    value: function Draw(room_id) {
      var _this7 = this;

      // console.log(e.target);
      // const card_id = e.target.closest('.sample_card').querySelector('input').value;
      var local_url = 'history_modal_api/';
      var cardid = room_id + '/';
      var url = API_host + local_url + cardid;
      console.log('Historydraw.Draw run.');
      fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this7.setState({ history: data.history, room: data.room });
      }).catch(function (reason) {
        alert('通信に失敗しました。もう一度お試しください。(履歴情報取得失敗)');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      // this.sample();
      var list = [];
      // console.log(this.state.room);
      if (!this.state.history) {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'fs-4' },
            this.state.room,
            '\u306E\u5C65\u6B74'
          ),
          'Enpty.'
        );
      }
      if (this.state.history == "") {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'fs-4' },
            this.state.room,
            '\u306E\u5C65\u6B74'
          ),
          '\u30B3\u30F3\u30C6\u30F3\u30C4\u304C\u3042\u308A\u307E\u305B\u3093'
        );
      }
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.state.history[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var i = _step3.value;

          list.push(React.createElement(
            'p',
            { key: i.id },
            i.string
          ));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          { className: 'fs-4' },
          this.state.room,
          '\u306E\u5C65\u6B74'
        ),
        list
      );
    }
  }]);

  return Historydraw;
}(React.Component);

var Missiondraw = function (_React$Component4) {
  _inherits(Missiondraw, _React$Component4);

  function Missiondraw(props) {
    _classCallCheck(this, Missiondraw);

    var _this8 = _possibleConstructorReturn(this, (Missiondraw.__proto__ || Object.getPrototypeOf(Missiondraw)).call(this, props));

    _this8.state = { block: false, card: false, room: false };
    return _this8;
  }

  _createClass(Missiondraw, [{
    key: 'Draw',
    value: function Draw(block_id, API_host) {
      var _this9 = this;

      var local_url = 'mission_api/';
      var blockid = block_id + '/';
      var url = API_host + local_url + blockid;
      console.log('Missiondraw.Draw run.');
      fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this9.setState({ block: data.block, card: data.card, room: data.room });
        loading.style.display = "none";
        page_card.classList.remove('page_show');
        page_mission.classList.add('page_show');
      }).catch(function (reason) {
        alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
        loading.style.display = "none";
      });
    }

    // Pagechange(id){
    //   loading.style.display = "block";
    //   room_dom.Draw(id);
    // }

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
        { key: 'c_' + i.id },
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
        { key: 'r_' + j.id },
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
                  history_dom.Draw(j.id);
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

// 下のhistoryAPI内から呼ぶ関数
// 該当のColoeareaのBackgroundColorをセット


var SetColor = function SetColor(room_selected, stat_color) {
  var querystr = '.color_area[name="' + room_selected + '"]';
  var colorarea = document.querySelector(querystr);
  colorarea.style.backgroundColor = stat_color;
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
    console.log('change success');
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
  card_dom.Draw(block_id);
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

// カードの描画
var domContainer = document.querySelector('#card_container');
var card_dom = ReactDOM.render(React.createElement(Carddraw, null), domContainer);

// ルームの描画
var domContainer2 = document.querySelector('#room_container');
var room_dom = ReactDOM.render(React.createElement(Roomdraw, null), domContainer2);

// ミッションの描画
var domContainer3 = document.querySelector('#mission_container');
var mission_dom = ReactDOM.render(React.createElement(Missiondraw, null), domContainer3);

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