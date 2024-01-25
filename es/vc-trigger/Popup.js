import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import Align from '../vc-align';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';
import animate from '../_util/css-animation';
import BaseMixin from '../_util/BaseMixin';
import { getListeners } from '../_util/props-util';

export default {
  name: 'VCTriggerPopup',
  mixins: [BaseMixin],
  props: {
    visible: PropTypes.bool,
    getClassNameFromAlign: PropTypes.func,
    getRootDomNode: PropTypes.func,
    align: PropTypes.any,
    destroyPopupOnHide: PropTypes.bool,
    prefixCls: PropTypes.string,
    getContainer: PropTypes.func,
    transitionName: PropTypes.string,
    animation: PropTypes.any,
    maskAnimation: PropTypes.string,
    maskTransitionName: PropTypes.string,
    mask: PropTypes.bool,
    zIndex: PropTypes.number,
    popupClassName: PropTypes.any,
    popupStyle: PropTypes.object.def(function () {
      return {};
    }),
    stretch: PropTypes.string,
    point: PropTypes.shape({
      pageX: PropTypes.number,
      pageY: PropTypes.number
    })
  },
  data: function data() {
    this.domEl = null;
    return {
      // Used for stretch
      stretchChecked: false,
      targetWidth: undefined,
      targetHeight: undefined
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.rootNode = _this.getPopupDomNode();
      _this.setStretchSize();
    });
  },

  // 如添加会导致动画失效，如放开会导致快速输入时闪动 https://github.com/vueComponent/ant-design-vue/issues/1327，
  // 目前方案是保留动画，闪动问题(动画多次执行)进一步定位
  // beforeUpdate() {
  //   if (this.domEl && this.domEl.rcEndListener) {
  //     this.domEl.rcEndListener();
  //     this.domEl = null;
  //   }
  // },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.setStretchSize();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    } else if (this.$el.remove) {
      this.$el.remove();
    }
  },

  methods: {
    onAlign: function onAlign(popupDomNode, align) {
      var props = this.$props;
      var currentAlignClassName = props.getClassNameFromAlign(align);
      // FIX: https://github.com/react-component/trigger/issues/56
      // FIX: https://github.com/react-component/tooltip/issues/79
      if (this.currentAlignClassName !== currentAlignClassName) {
        this.currentAlignClassName = currentAlignClassName;
        popupDomNode.className = this.getClassName(currentAlignClassName);
      }
      var listeners = getListeners(this);
      listeners.align && listeners.align(popupDomNode, align);
    },


    // Record size if stretch needed
    setStretchSize: function setStretchSize() {
      var _$props = this.$props,
          stretch = _$props.stretch,
          getRootDomNode = _$props.getRootDomNode,
          visible = _$props.visible;
      var _$data = this.$data,
          stretchChecked = _$data.stretchChecked,
          targetHeight = _$data.targetHeight,
          targetWidth = _$data.targetWidth;


      if (!stretch || !visible) {
        if (stretchChecked) {
          this.setState({ stretchChecked: false });
        }
        return;
      }

      var $ele = getRootDomNode();
      if (!$ele) return;

      var height = $ele.offsetHeight;
      var width = $ele.offsetWidth;

      if (targetHeight !== height || targetWidth !== width || !stretchChecked) {
        this.setState({
          stretchChecked: true,
          targetHeight: height,
          targetWidth: width
        });
      }
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.popupInstance ? this.$refs.popupInstance.$el : null;
    },
    getTargetElement: function getTargetElement() {
      return this.$props.getRootDomNode();
    },


    // `target` on `rc-align` can accept as a function to get the bind element or a point.
    // ref: https://www.npmjs.com/package/rc-align
    getAlignTarget: function getAlignTarget() {
      var point = this.$props.point;

      if (point) {
        return point;
      }
      return this.getTargetElement;
    },
    getMaskTransitionName: function getMaskTransitionName() {
      var props = this.$props;
      var transitionName = props.maskTransitionName;
      var animation = props.maskAnimation;
      if (!transitionName && animation) {
        transitionName = props.prefixCls + '-' + animation;
      }
      return transitionName;
    },
    getTransitionName: function getTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      var animation = props.animation;
      if (!transitionName) {
        if (typeof animation === 'string') {
          transitionName = '' + animation;
        } else if (animation && animation.props && animation.props.name) {
          transitionName = animation.props.name;
        }
      }
      return transitionName;
    },
    getClassName: function getClassName(currentAlignClassName) {
      return this.$props.prefixCls + ' ' + this.$props.popupClassName + ' ' + currentAlignClassName;
    },
    getPopupElement: function getPopupElement() {
      var _this3 = this;

      var h = this.$createElement;
      var props = this.$props,
          $slots = this.$slots,
          getTransitionName = this.getTransitionName;
      var _$data2 = this.$data,
          stretchChecked = _$data2.stretchChecked,
          targetHeight = _$data2.targetHeight,
          targetWidth = _$data2.targetWidth;
      var align = props.align,
          visible = props.visible,
          prefixCls = props.prefixCls,
          animation = props.animation,
          popupStyle = props.popupStyle,
          getClassNameFromAlign = props.getClassNameFromAlign,
          destroyPopupOnHide = props.destroyPopupOnHide,
          stretch = props.stretch;

      var className = this.getClassName(this.currentAlignClassName || getClassNameFromAlign(align));
      // const hiddenClassName = `${prefixCls}-hidden`
      if (!visible) {
        this.currentAlignClassName = null;
      }
      var sizeStyle = {};
      if (stretch) {
        // Stretch with target
        if (stretch.indexOf('height') !== -1) {
          sizeStyle.height = typeof targetHeight === 'number' ? targetHeight + 'px' : targetHeight;
        } else if (stretch.indexOf('minHeight') !== -1) {
          sizeStyle.minHeight = typeof targetHeight === 'number' ? targetHeight + 'px' : targetHeight;
        }
        if (stretch.indexOf('width') !== -1) {
          sizeStyle.width = typeof targetWidth === 'number' ? targetWidth + 'px' : targetWidth;
        } else if (stretch.indexOf('minWidth') !== -1) {
          sizeStyle.minWidth = typeof targetWidth === 'number' ? targetWidth + 'px' : targetWidth;
        }
        // Delay force align to makes ui smooth
        if (!stretchChecked) {
          // sizeStyle.visibility = 'hidden'
          setTimeout(function () {
            if (_this3.$refs.alignInstance) {
              _this3.$refs.alignInstance.forceAlign();
            }
          }, 0);
        }
      }
      var popupInnerProps = {
        props: {
          prefixCls: prefixCls,
          visible: visible
          // hiddenClassName,
        },
        'class': className,
        on: getListeners(this),
        ref: 'popupInstance',
        style: _extends({}, sizeStyle, popupStyle, this.getZIndexStyle())
      };
      var transitionProps = {
        props: {
          appear: true,
          css: false
        }
      };
      var transitionName = getTransitionName();
      var useTransition = !!transitionName;
      var transitionEvent = {
        beforeEnter: function beforeEnter() {
          // el.style.display = el.__vOriginalDisplay
          // this.$refs.alignInstance.forceAlign();
        },
        enter: function enter(el, done) {
          // render 后 vue 会移除通过animate动态添加的 class导致动画闪动，延迟两帧添加动画class，可以进一步定位或者重写 transition 组件
          _this3.$nextTick(function () {
            if (_this3.$refs.alignInstance) {
              _this3.$refs.alignInstance.$nextTick(function () {
                _this3.domEl = el;
                animate(el, transitionName + '-enter', done);
              });
            } else {
              done();
            }
          });
        },
        beforeLeave: function beforeLeave() {
          _this3.domEl = null;
        },
        leave: function leave(el, done) {
          animate(el, transitionName + '-leave', done);
        }
      };

      if ((typeof animation === 'undefined' ? 'undefined' : _typeof(animation)) === 'object') {
        useTransition = true;

        var _animation$on = animation.on,
            on = _animation$on === undefined ? {} : _animation$on,
            _animation$props = animation.props,
            _props = _animation$props === undefined ? {} : _animation$props;

        transitionProps.props = _extends({}, transitionProps.props, _props);
        transitionProps.on = _extends({}, transitionEvent, on);
      } else {
        transitionProps.on = transitionEvent;
      }
      if (!useTransition) {
        transitionProps = {};
      }
      if (destroyPopupOnHide) {
        return h(
          'transition',
          transitionProps,
          [visible ? h(
            Align,
            {
              attrs: {
                target: this.getAlignTarget(),

                monitorWindowResize: true,
                align: align
              },
              key: 'popup',
              ref: 'alignInstance', on: {
                'align': this.onAlign
              }
            },
            [h(
              PopupInner,
              popupInnerProps,
              [$slots['default']]
            )]
          ) : null]
        );
      }
      return h(
        'transition',
        transitionProps,
        [h(
          Align,
          {
            directives: [{
              name: 'show',
              value: visible
            }],
            attrs: {
              target: this.getAlignTarget(),

              monitorWindowResize: true,
              disabled: !visible,
              align: align
            },
            key: 'popup',
            ref: 'alignInstance', on: {
              'align': this.onAlign
            }
          },
          [h(
            PopupInner,
            popupInnerProps,
            [$slots['default']]
          )]
        )]
      );
    },
    getZIndexStyle: function getZIndexStyle() {
      var style = {};
      var props = this.$props;
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex;
      }
      return style;
    },
    getMaskElement: function getMaskElement() {
      var h = this.$createElement;

      var props = this.$props;
      var maskElement = null;
      if (props.mask) {
        var maskTransition = this.getMaskTransitionName();
        maskElement = h(LazyRenderBox, {
          directives: [{
            name: 'show',
            value: props.visible
          }],

          style: this.getZIndexStyle(),
          key: 'mask',
          'class': props.prefixCls + '-mask',
          attrs: { visible: props.visible
          }
        });
        if (maskTransition) {
          maskElement = h(
            'transition',
            {
              attrs: { appear: true, name: maskTransition }
            },
            [maskElement]
          );
        }
      }
      return maskElement;
    }
  },

  render: function render() {
    var h = arguments[0];
    var getMaskElement = this.getMaskElement,
        getPopupElement = this.getPopupElement;

    return h('div', [getMaskElement(), getPopupElement()]);
  }
};