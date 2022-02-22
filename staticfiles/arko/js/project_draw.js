var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { API_host, loading } from './project.js';

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

export { Carddraw, Roomdraw };