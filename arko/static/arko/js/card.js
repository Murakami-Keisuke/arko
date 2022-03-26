var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Roomdraw } from './room.js';

var Carddraw = function (_React$Component) {
  _inherits(Carddraw, _React$Component);

  function Carddraw(props) {
    _classCallCheck(this, Carddraw);

    var _this = _possibleConstructorReturn(this, (Carddraw.__proto__ || Object.getPrototypeOf(Carddraw)).call(this, props));

    _this.API_host = props.API_host;
    _this.domContainer2 = props.domContainer2;
    _this.loading = props.loading;
    _this.state = { block: false, card: false };
    return _this;
  }

  // Draw(block_id) {


  _createClass(Carddraw, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      if (this.props.block_id !== prevProps.block_id) {
        var local_url = 'card_api/';
        var blockid = this.props.block_id + '/';
        var url = this.API_host + local_url + blockid;
        console.log('Carddraw.componentDidUpdate run.');
        fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          _this2.setState({ block: data.block, card: data.card });
          _this2.loading.style.display = "none";
        }).catch(function (reason) {
          alert('通信に失敗しました。もう一度お試しください。(カード情報取得失敗)');
          _this2.loading.style.display = "none";
        });
      } else {
        this.loading.style.display = "none";
      }
    }
  }, {
    key: 'Pagechange',
    value: function Pagechange(id) {
      this.loading.style.display = "block";
      // room_dom.Draw(id);
      ReactDOM.render(React.createElement(Roomdraw, { card_id: id }), this.domContainer2);
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

export { Carddraw };