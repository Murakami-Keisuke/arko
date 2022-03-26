var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Historydraw = function (_React$Component) {
  _inherits(Historydraw, _React$Component);

  function Historydraw(props) {
    _classCallCheck(this, Historydraw);

    var _this = _possibleConstructorReturn(this, (Historydraw.__proto__ || Object.getPrototypeOf(Historydraw)).call(this, props));

    _this.state = { history: false, room: false };
    return _this;
  }

  _createClass(Historydraw, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      if (this.props.room_id !== prevProps.room_id) {
        var local_url = 'history_modal_api/';
        var cardid = this.props.room_id + '/';
        var url = this.props.API_host + local_url + cardid;
        console.log('History_componentDidUpdate run.');
        fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          _this2.setState({ history: data.history, room: data.room });
          // ReactDOM.render(<Historydraw history={data.history} room={data.room}/>, historycontainer); 
        }).catch(function (reason) {
          alert('通信に失敗しました。もう一度お試しください。(履歴情報取得失敗)');
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
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
          'Empty.'
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.history[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          list.push(React.createElement(
            'p',
            { key: i.id },
            i.string
          ));
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

export { Historydraw };