'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var formatOption = function formatOption(option, disabledOptions) {
  var value = '' + option;
  if (option < 10) {
    value = '0' + option;
  }

  var disabled = false;
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }

  return {
    value: value,
    disabled: disabled
  };
};

var Combobox = {
  mixins: [_BaseMixin2['default']],
  name: 'Combobox',
  props: {
    format: _vueTypes2['default'].string,
    defaultOpenValue: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    value: _vueTypes2['default'].object,
    // onChange: PropTypes.func,
    // onAmPmChange: PropTypes.func,
    showHour: _vueTypes2['default'].bool,
    showMinute: _vueTypes2['default'].bool,
    showSecond: _vueTypes2['default'].bool,
    hourOptions: _vueTypes2['default'].array,
    minuteOptions: _vueTypes2['default'].array,
    secondOptions: _vueTypes2['default'].array,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    // onCurrentSelectPanelChange: PropTypes.func,
    use12Hours: _vueTypes2['default'].bool,
    isAM: _vueTypes2['default'].bool
  },
  methods: {
    onItemChange: function onItemChange(type, itemValue) {
      var defaultOpenValue = this.defaultOpenValue,
          use12Hours = this.use12Hours,
          propValue = this.value,
          isAM = this.isAM;

      var value = (propValue || defaultOpenValue).clone();

      if (type === 'hour') {
        if (use12Hours) {
          if (isAM) {
            value.hour(+itemValue % 12);
          } else {
            value.hour(+itemValue % 12 + 12);
          }
        } else {
          value.hour(+itemValue);
        }
      } else if (type === 'minute') {
        value.minute(+itemValue);
      } else if (type === 'ampm') {
        var ampm = itemValue.toUpperCase();
        if (use12Hours) {
          if (ampm === 'PM' && value.hour() < 12) {
            value.hour(value.hour() % 12 + 12);
          }

          if (ampm === 'AM') {
            if (value.hour() >= 12) {
              value.hour(value.hour() - 12);
            }
          }
        }
        this.__emit('amPmChange', ampm);
      } else {
        value.second(+itemValue);
      }
      this.__emit('change', value);
    },
    onEnterSelectPanel: function onEnterSelectPanel(range) {
      this.__emit('currentSelectPanelChange', range);
    },
    onEsc: function onEsc(e) {
      this.__emit('esc', e);
    },
    getHourSelect: function getHourSelect(hour) {
      var _this = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          hourOptions = this.hourOptions,
          disabledHours = this.disabledHours,
          showHour = this.showHour,
          use12Hours = this.use12Hours;

      if (!showHour) {
        return null;
      }
      var disabledOptions = disabledHours();
      var hourOptionsAdj = void 0;
      var hourAdj = void 0;
      if (use12Hours) {
        hourOptionsAdj = [12].concat(hourOptions.filter(function (h) {
          return h < 12 && h > 0;
        }));
        hourAdj = hour % 12 || 12;
      } else {
        hourOptionsAdj = hourOptions;
        hourAdj = hour;
      }

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: hourOptionsAdj.map(function (option) {
            return formatOption(option, disabledOptions);
          }),
          selectedIndex: hourOptionsAdj.indexOf(hourAdj),
          type: 'hour'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': function mouseenter() {
            return _this.onEnterSelectPanel('hour');
          },
          'esc': this.onEsc
        }
      });
    },
    getMinuteSelect: function getMinuteSelect(minute) {
      var _this2 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          minuteOptions = this.minuteOptions,
          disabledMinutes = this.disabledMinutes,
          defaultOpenValue = this.defaultOpenValue,
          showMinute = this.showMinute,
          propValue = this.value;

      if (!showMinute) {
        return null;
      }
      var value = propValue || defaultOpenValue;
      var disabledOptions = disabledMinutes(value.hour());

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: minuteOptions.map(function (option) {
            return formatOption(option, disabledOptions);
          }),
          selectedIndex: minuteOptions.indexOf(minute),
          type: 'minute'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': function mouseenter() {
            return _this2.onEnterSelectPanel('minute');
          },
          'esc': this.onEsc
        }
      });
    },
    getSecondSelect: function getSecondSelect(second) {
      var _this3 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          secondOptions = this.secondOptions,
          disabledSeconds = this.disabledSeconds,
          showSecond = this.showSecond,
          defaultOpenValue = this.defaultOpenValue,
          propValue = this.value;

      if (!showSecond) {
        return null;
      }
      var value = propValue || defaultOpenValue;
      var disabledOptions = disabledSeconds(value.hour(), value.minute());

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: secondOptions.map(function (option) {
            return formatOption(option, disabledOptions);
          }),
          selectedIndex: secondOptions.indexOf(second),
          type: 'second'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': function mouseenter() {
            return _this3.onEnterSelectPanel('second');
          },
          'esc': this.onEsc
        }
      });
    },
    getAMPMSelect: function getAMPMSelect() {
      var _this4 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          use12Hours = this.use12Hours,
          format = this.format,
          isAM = this.isAM;

      if (!use12Hours) {
        return null;
      }

      var AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
      .map(function (c) {
        return format.match(/\sA/) ? c.toUpperCase() : c;
      }).map(function (c) {
        return { value: c };
      });

      var selected = isAM ? 0 : 1;

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: AMPMOptions,
          selectedIndex: selected,
          type: 'ampm'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': function mouseenter() {
            return _this4.onEnterSelectPanel('ampm');
          },
          'esc': this.onEsc
        }
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        defaultOpenValue = this.defaultOpenValue,
        propValue = this.value,
        format = this.format;

    var value = propValue || defaultOpenValue;

    var elems = [this.getHourSelect(value.hour()), this.getMinuteSelect(value.minute()), this.getSecondSelect(value.second()), this.getAMPMSelect(value.hour())];
    if (format) {
      var idx = 0;
      var char = format[idx];
      var formatAllowedChars = ['h', 'm', 's', 'a'];
      var elemsOrder = [];
      while (char) {
        if (formatAllowedChars.includes(char) && !elemsOrder.includes(char)) {
          elemsOrder.push(char);
        }
        char = format[++idx];
      }

      var bindMap = {
        'h': this.getHourSelect.bind(this, value.hour()),
        'm': this.getMinuteSelect.bind(this, value.minute()),
        's': this.getSecondSelect.bind(this, value.second()),
        'a': this.getAMPMSelect.bind(this, value.hour())
      };
      if (elems.length > 0) {
        elems = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = elemsOrder[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var order = _step.value;

            elems.push(bindMap[order]());
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }

    return h(
      'div',
      { 'class': prefixCls + '-combobox' },
      [elems.map(function (elem) {
        return elem;
      })]
    );
  }
};

exports['default'] = Combobox;