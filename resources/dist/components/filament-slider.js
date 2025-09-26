// node_modules/nouislider/dist/nouislider.mjs
var PipsMode;
(function(PipsMode2) {
  PipsMode2["Range"] = "range";
  PipsMode2["Steps"] = "steps";
  PipsMode2["Positions"] = "positions";
  PipsMode2["Count"] = "count";
  PipsMode2["Values"] = "values";
})(PipsMode || (PipsMode = {}));
var PipsType;
(function(PipsType2) {
  PipsType2[PipsType2["None"] = -1] = "None";
  PipsType2[PipsType2["NoValue"] = 0] = "NoValue";
  PipsType2[PipsType2["LargeValue"] = 1] = "LargeValue";
  PipsType2[PipsType2["SmallValue"] = 2] = "SmallValue";
})(PipsType || (PipsType = {}));
function isValidFormatter(entry) {
  return isValidPartialFormatter(entry) && typeof entry.from === "function";
}
function isValidPartialFormatter(entry) {
  return typeof entry === "object" && typeof entry.to === "function";
}
function removeElement(el) {
  el.parentElement.removeChild(el);
}
function isSet(value) {
  return value !== null && value !== void 0;
}
function preventDefault(e) {
  e.preventDefault();
}
function unique(array) {
  return array.filter(function(a) {
    return !this[a] ? this[a] = true : false;
  }, {});
}
function closest(value, to) {
  return Math.round(value / to) * to;
}
function offset(elem, orientation) {
  var rect = elem.getBoundingClientRect();
  var doc = elem.ownerDocument;
  var docElem = doc.documentElement;
  var pageOffset = getPageOffset(doc);
  if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
    pageOffset.x = 0;
  }
  return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
}
function isNumeric(a) {
  return typeof a === "number" && !isNaN(a) && isFinite(a);
}
function addClassFor(element, className, duration) {
  if (duration > 0) {
    addClass(element, className);
    setTimeout(function() {
      removeClass(element, className);
    }, duration);
  }
}
function limit(a) {
  return Math.max(Math.min(a, 100), 0);
}
function asArray(a) {
  return Array.isArray(a) ? a : [a];
}
function countDecimals(numStr) {
  numStr = String(numStr);
  var pieces = numStr.split(".");
  return pieces.length > 1 ? pieces[1].length : 0;
}
function addClass(el, className) {
  if (el.classList && !/\s/.test(className)) {
    el.classList.add(className);
  } else {
    el.className += " " + className;
  }
}
function removeClass(el, className) {
  if (el.classList && !/\s/.test(className)) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
  }
}
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
}
function getPageOffset(doc) {
  var supportPageOffset = window.pageXOffset !== void 0;
  var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
  var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
  var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;
  return {
    x,
    y
  };
}
function getActions() {
  return window.navigator.pointerEnabled ? {
    start: "pointerdown",
    move: "pointermove",
    end: "pointerup"
  } : window.navigator.msPointerEnabled ? {
    start: "MSPointerDown",
    move: "MSPointerMove",
    end: "MSPointerUp"
  } : {
    start: "mousedown touchstart",
    move: "mousemove touchmove",
    end: "mouseup touchend"
  };
}
function getSupportsPassive() {
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
  return supportsPassive;
}
function getSupportsTouchActionNone() {
  return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
}
function subRangeRatio(pa, pb) {
  return 100 / (pb - pa);
}
function fromPercentage(range, value, startRange) {
  return value * 100 / (range[startRange + 1] - range[startRange]);
}
function toPercentage(range, value) {
  return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
}
function isPercentage(range, value) {
  return value * (range[1] - range[0]) / 100 + range[0];
}
function getJ(value, arr) {
  var j = 1;
  while (value >= arr[j]) {
    j += 1;
  }
  return j;
}
function toStepping(xVal, xPct, value) {
  if (value >= xVal.slice(-1)[0]) {
    return 100;
  }
  var j = getJ(value, xVal);
  var va = xVal[j - 1];
  var vb = xVal[j];
  var pa = xPct[j - 1];
  var pb = xPct[j];
  return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
}
function fromStepping(xVal, xPct, value) {
  if (value >= 100) {
    return xVal.slice(-1)[0];
  }
  var j = getJ(value, xPct);
  var va = xVal[j - 1];
  var vb = xVal[j];
  var pa = xPct[j - 1];
  var pb = xPct[j];
  return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
}
function getStep(xPct, xSteps, snap, value) {
  if (value === 100) {
    return value;
  }
  var j = getJ(value, xPct);
  var a = xPct[j - 1];
  var b = xPct[j];
  if (snap) {
    if (value - a > (b - a) / 2) {
      return b;
    }
    return a;
  }
  if (!xSteps[j - 1]) {
    return value;
  }
  return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
}
var Spectrum = (
  /** @class */
  (function() {
    function Spectrum2(entry, snap, singleStep) {
      this.xPct = [];
      this.xVal = [];
      this.xSteps = [];
      this.xNumSteps = [];
      this.xHighestCompleteStep = [];
      this.xSteps = [singleStep || false];
      this.xNumSteps = [false];
      this.snap = snap;
      var index;
      var ordered = [];
      Object.keys(entry).forEach(function(index2) {
        ordered.push([asArray(entry[index2]), index2]);
      });
      ordered.sort(function(a, b) {
        return a[0][0] - b[0][0];
      });
      for (index = 0; index < ordered.length; index++) {
        this.handleEntryPoint(ordered[index][1], ordered[index][0]);
      }
      this.xNumSteps = this.xSteps.slice(0);
      for (index = 0; index < this.xNumSteps.length; index++) {
        this.handleStepPoint(index, this.xNumSteps[index]);
      }
    }
    Spectrum2.prototype.getDistance = function(value) {
      var distances = [];
      for (var index = 0; index < this.xNumSteps.length - 1; index++) {
        distances[index] = fromPercentage(this.xVal, value, index);
      }
      return distances;
    };
    Spectrum2.prototype.getAbsoluteDistance = function(value, distances, direction) {
      var xPct_index = 0;
      if (value < this.xPct[this.xPct.length - 1]) {
        while (value > this.xPct[xPct_index + 1]) {
          xPct_index++;
        }
      } else if (value === this.xPct[this.xPct.length - 1]) {
        xPct_index = this.xPct.length - 2;
      }
      if (!direction && value === this.xPct[xPct_index + 1]) {
        xPct_index++;
      }
      if (distances === null) {
        distances = [];
      }
      var start_factor;
      var rest_factor = 1;
      var rest_rel_distance = distances[xPct_index];
      var range_pct = 0;
      var rel_range_distance = 0;
      var abs_distance_counter = 0;
      var range_counter = 0;
      if (direction) {
        start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      } else {
        start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      }
      while (rest_rel_distance > 0) {
        range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
        if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
          rel_range_distance = range_pct * start_factor;
          rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
          start_factor = 1;
        } else {
          rel_range_distance = distances[xPct_index + range_counter] * range_pct / 100 * rest_factor;
          rest_factor = 0;
        }
        if (direction) {
          abs_distance_counter = abs_distance_counter - rel_range_distance;
          if (this.xPct.length + range_counter >= 1) {
            range_counter--;
          }
        } else {
          abs_distance_counter = abs_distance_counter + rel_range_distance;
          if (this.xPct.length - range_counter >= 1) {
            range_counter++;
          }
        }
        rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
      }
      return value + abs_distance_counter;
    };
    Spectrum2.prototype.toStepping = function(value) {
      value = toStepping(this.xVal, this.xPct, value);
      return value;
    };
    Spectrum2.prototype.fromStepping = function(value) {
      return fromStepping(this.xVal, this.xPct, value);
    };
    Spectrum2.prototype.getStep = function(value) {
      value = getStep(this.xPct, this.xSteps, this.snap, value);
      return value;
    };
    Spectrum2.prototype.getDefaultStep = function(value, isDown, size) {
      var j = getJ(value, this.xPct);
      if (value === 100 || isDown && value === this.xPct[j - 1]) {
        j = Math.max(j - 1, 1);
      }
      return (this.xVal[j] - this.xVal[j - 1]) / size;
    };
    Spectrum2.prototype.getNearbySteps = function(value) {
      var j = getJ(value, this.xPct);
      return {
        stepBefore: {
          startValue: this.xVal[j - 2],
          step: this.xNumSteps[j - 2],
          highestStep: this.xHighestCompleteStep[j - 2]
        },
        thisStep: {
          startValue: this.xVal[j - 1],
          step: this.xNumSteps[j - 1],
          highestStep: this.xHighestCompleteStep[j - 1]
        },
        stepAfter: {
          startValue: this.xVal[j],
          step: this.xNumSteps[j],
          highestStep: this.xHighestCompleteStep[j]
        }
      };
    };
    Spectrum2.prototype.countStepDecimals = function() {
      var stepDecimals = this.xNumSteps.map(countDecimals);
      return Math.max.apply(null, stepDecimals);
    };
    Spectrum2.prototype.hasNoSize = function() {
      return this.xVal[0] === this.xVal[this.xVal.length - 1];
    };
    Spectrum2.prototype.convert = function(value) {
      return this.getStep(this.toStepping(value));
    };
    Spectrum2.prototype.handleEntryPoint = function(index, value) {
      var percentage;
      if (index === "min") {
        percentage = 0;
      } else if (index === "max") {
        percentage = 100;
      } else {
        percentage = parseFloat(index);
      }
      if (!isNumeric(percentage) || !isNumeric(value[0])) {
        throw new Error("noUiSlider: 'range' value isn't numeric.");
      }
      this.xPct.push(percentage);
      this.xVal.push(value[0]);
      var value1 = Number(value[1]);
      if (!percentage) {
        if (!isNaN(value1)) {
          this.xSteps[0] = value1;
        }
      } else {
        this.xSteps.push(isNaN(value1) ? false : value1);
      }
      this.xHighestCompleteStep.push(0);
    };
    Spectrum2.prototype.handleStepPoint = function(i, n) {
      if (!n) {
        return;
      }
      if (this.xVal[i] === this.xVal[i + 1]) {
        this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
        return;
      }
      this.xSteps[i] = fromPercentage([this.xVal[i], this.xVal[i + 1]], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
      var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
      var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
      var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
      this.xHighestCompleteStep[i] = step;
    };
    return Spectrum2;
  })()
);
var defaultFormatter = {
  to: function(value) {
    return value === void 0 ? "" : value.toFixed(2);
  },
  from: Number
};
var cssClasses = {
  target: "target",
  base: "base",
  origin: "origin",
  handle: "handle",
  handleLower: "handle-lower",
  handleUpper: "handle-upper",
  touchArea: "touch-area",
  horizontal: "horizontal",
  vertical: "vertical",
  background: "background",
  connect: "connect",
  connects: "connects",
  ltr: "ltr",
  rtl: "rtl",
  textDirectionLtr: "txt-dir-ltr",
  textDirectionRtl: "txt-dir-rtl",
  draggable: "draggable",
  drag: "state-drag",
  tap: "state-tap",
  active: "active",
  tooltip: "tooltip",
  pips: "pips",
  pipsHorizontal: "pips-horizontal",
  pipsVertical: "pips-vertical",
  marker: "marker",
  markerHorizontal: "marker-horizontal",
  markerVertical: "marker-vertical",
  markerNormal: "marker-normal",
  markerLarge: "marker-large",
  markerSub: "marker-sub",
  value: "value",
  valueHorizontal: "value-horizontal",
  valueVertical: "value-vertical",
  valueNormal: "value-normal",
  valueLarge: "value-large",
  valueSub: "value-sub"
};
var INTERNAL_EVENT_NS = {
  tooltips: ".__tooltips",
  aria: ".__aria"
};
function testStep(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'step' is not numeric.");
  }
  parsed.singleStep = entry;
}
function testKeyboardPageMultiplier(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
  }
  parsed.keyboardPageMultiplier = entry;
}
function testKeyboardMultiplier(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
  }
  parsed.keyboardMultiplier = entry;
}
function testKeyboardDefaultStep(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
  }
  parsed.keyboardDefaultStep = entry;
}
function testRange(parsed, entry) {
  if (typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("noUiSlider: 'range' is not an object.");
  }
  if (entry.min === void 0 || entry.max === void 0) {
    throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
  }
  parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
}
function testStart(parsed, entry) {
  entry = asArray(entry);
  if (!Array.isArray(entry) || !entry.length) {
    throw new Error("noUiSlider: 'start' option is incorrect.");
  }
  parsed.handles = entry.length;
  parsed.start = entry;
}
function testSnap(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'snap' option must be a boolean.");
  }
  parsed.snap = entry;
}
function testAnimate(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'animate' option must be a boolean.");
  }
  parsed.animate = entry;
}
function testAnimationDuration(parsed, entry) {
  if (typeof entry !== "number") {
    throw new Error("noUiSlider: 'animationDuration' option must be a number.");
  }
  parsed.animationDuration = entry;
}
function testConnect(parsed, entry) {
  var connect = [false];
  var i;
  if (entry === "lower") {
    entry = [true, false];
  } else if (entry === "upper") {
    entry = [false, true];
  }
  if (entry === true || entry === false) {
    for (i = 1; i < parsed.handles; i++) {
      connect.push(entry);
    }
    connect.push(false);
  } else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
    throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
  } else {
    connect = entry;
  }
  parsed.connect = connect;
}
function testOrientation(parsed, entry) {
  switch (entry) {
    case "horizontal":
      parsed.ort = 0;
      break;
    case "vertical":
      parsed.ort = 1;
      break;
    default:
      throw new Error("noUiSlider: 'orientation' option is invalid.");
  }
}
function testMargin(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'margin' option must be numeric.");
  }
  if (entry === 0) {
    return;
  }
  parsed.margin = parsed.spectrum.getDistance(entry);
}
function testLimit(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'limit' option must be numeric.");
  }
  parsed.limit = parsed.spectrum.getDistance(entry);
  if (!parsed.limit || parsed.handles < 2) {
    throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
  }
}
function testPadding(parsed, entry) {
  var index;
  if (!isNumeric(entry) && !Array.isArray(entry)) {
    throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
  }
  if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
    throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
  }
  if (entry === 0) {
    return;
  }
  if (!Array.isArray(entry)) {
    entry = [entry, entry];
  }
  parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
  for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
    if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
      throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
    }
  }
  var totalPadding = entry[0] + entry[1];
  var firstValue = parsed.spectrum.xVal[0];
  var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
  if (totalPadding / (lastValue - firstValue) > 1) {
    throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
  }
}
function testDirection(parsed, entry) {
  switch (entry) {
    case "ltr":
      parsed.dir = 0;
      break;
    case "rtl":
      parsed.dir = 1;
      break;
    default:
      throw new Error("noUiSlider: 'direction' option was not recognized.");
  }
}
function testBehaviour(parsed, entry) {
  if (typeof entry !== "string") {
    throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
  }
  var tap = entry.indexOf("tap") >= 0;
  var drag = entry.indexOf("drag") >= 0;
  var fixed = entry.indexOf("fixed") >= 0;
  var snap = entry.indexOf("snap") >= 0;
  var hover = entry.indexOf("hover") >= 0;
  var unconstrained = entry.indexOf("unconstrained") >= 0;
  var invertConnects = entry.indexOf("invert-connects") >= 0;
  var dragAll = entry.indexOf("drag-all") >= 0;
  var smoothSteps = entry.indexOf("smooth-steps") >= 0;
  if (fixed) {
    if (parsed.handles !== 2) {
      throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
    }
    testMargin(parsed, parsed.start[1] - parsed.start[0]);
  }
  if (invertConnects && parsed.handles !== 2) {
    throw new Error("noUiSlider: 'invert-connects' behaviour must be used with 2 handles");
  }
  if (unconstrained && (parsed.margin || parsed.limit)) {
    throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
  }
  parsed.events = {
    tap: tap || snap,
    drag,
    dragAll,
    smoothSteps,
    fixed,
    snap,
    hover,
    unconstrained,
    invertConnects
  };
}
function testTooltips(parsed, entry) {
  if (entry === false) {
    return;
  }
  if (entry === true || isValidPartialFormatter(entry)) {
    parsed.tooltips = [];
    for (var i = 0; i < parsed.handles; i++) {
      parsed.tooltips.push(entry);
    }
  } else {
    entry = asArray(entry);
    if (entry.length !== parsed.handles) {
      throw new Error("noUiSlider: must pass a formatter for all handles.");
    }
    entry.forEach(function(formatter) {
      if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) {
        throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
      }
    });
    parsed.tooltips = entry;
  }
}
function testHandleAttributes(parsed, entry) {
  if (entry.length !== parsed.handles) {
    throw new Error("noUiSlider: must pass a attributes for all handles.");
  }
  parsed.handleAttributes = entry;
}
function testAriaFormat(parsed, entry) {
  if (!isValidPartialFormatter(entry)) {
    throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
  }
  parsed.ariaFormat = entry;
}
function testFormat(parsed, entry) {
  if (!isValidFormatter(entry)) {
    throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
  }
  parsed.format = entry;
}
function testKeyboardSupport(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
  }
  parsed.keyboardSupport = entry;
}
function testDocumentElement(parsed, entry) {
  parsed.documentElement = entry;
}
function testCssPrefix(parsed, entry) {
  if (typeof entry !== "string" && entry !== false) {
    throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
  }
  parsed.cssPrefix = entry;
}
function testCssClasses(parsed, entry) {
  if (typeof entry !== "object") {
    throw new Error("noUiSlider: 'cssClasses' must be an object.");
  }
  if (typeof parsed.cssPrefix === "string") {
    parsed.cssClasses = {};
    Object.keys(entry).forEach(function(key) {
      parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
    });
  } else {
    parsed.cssClasses = entry;
  }
}
function testOptions(options) {
  var parsed = {
    margin: null,
    limit: null,
    padding: null,
    animate: true,
    animationDuration: 300,
    ariaFormat: defaultFormatter,
    format: defaultFormatter
  };
  var tests = {
    step: { r: false, t: testStep },
    keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
    keyboardMultiplier: { r: false, t: testKeyboardMultiplier },
    keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
    start: { r: true, t: testStart },
    connect: { r: true, t: testConnect },
    direction: { r: true, t: testDirection },
    snap: { r: false, t: testSnap },
    animate: { r: false, t: testAnimate },
    animationDuration: { r: false, t: testAnimationDuration },
    range: { r: true, t: testRange },
    orientation: { r: false, t: testOrientation },
    margin: { r: false, t: testMargin },
    limit: { r: false, t: testLimit },
    padding: { r: false, t: testPadding },
    behaviour: { r: true, t: testBehaviour },
    ariaFormat: { r: false, t: testAriaFormat },
    format: { r: false, t: testFormat },
    tooltips: { r: false, t: testTooltips },
    keyboardSupport: { r: true, t: testKeyboardSupport },
    documentElement: { r: false, t: testDocumentElement },
    cssPrefix: { r: true, t: testCssPrefix },
    cssClasses: { r: true, t: testCssClasses },
    handleAttributes: { r: false, t: testHandleAttributes }
  };
  var defaults = {
    connect: false,
    direction: "ltr",
    behaviour: "tap",
    orientation: "horizontal",
    keyboardSupport: true,
    cssPrefix: "noUi-",
    cssClasses,
    keyboardPageMultiplier: 5,
    keyboardMultiplier: 1,
    keyboardDefaultStep: 10
  };
  if (options.format && !options.ariaFormat) {
    options.ariaFormat = options.format;
  }
  Object.keys(tests).forEach(function(name) {
    if (!isSet(options[name]) && defaults[name] === void 0) {
      if (tests[name].r) {
        throw new Error("noUiSlider: '" + name + "' is required.");
      }
      return;
    }
    tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
  });
  parsed.pips = options.pips;
  var d = document.createElement("div");
  var msPrefix = d.style.msTransform !== void 0;
  var noPrefix = d.style.transform !== void 0;
  parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
  var styles = [
    ["left", "top"],
    ["right", "bottom"]
  ];
  parsed.style = styles[parsed.dir][parsed.ort];
  return parsed;
}
function scope(target, options, originalOptions) {
  var actions = getActions();
  var supportsTouchActionNone = getSupportsTouchActionNone();
  var supportsPassive = supportsTouchActionNone && getSupportsPassive();
  var scope_Target = target;
  var scope_Base;
  var scope_ConnectBase;
  var scope_Handles;
  var scope_Connects;
  var scope_Pips;
  var scope_Tooltips;
  var scope_Spectrum = options.spectrum;
  var scope_Values = [];
  var scope_Locations = [];
  var scope_HandleNumbers = [];
  var scope_ActiveHandlesCount = 0;
  var scope_Events = {};
  var scope_ConnectsInverted = false;
  var scope_Document = target.ownerDocument;
  var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
  var scope_Body = scope_Document.body;
  var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
  function addNodeTo(addTarget, className) {
    var div = scope_Document.createElement("div");
    if (className) {
      addClass(div, className);
    }
    addTarget.appendChild(div);
    return div;
  }
  function addOrigin(base, handleNumber) {
    var origin = addNodeTo(base, options.cssClasses.origin);
    var handle = addNodeTo(origin, options.cssClasses.handle);
    addNodeTo(handle, options.cssClasses.touchArea);
    handle.setAttribute("data-handle", String(handleNumber));
    if (options.keyboardSupport) {
      handle.setAttribute("tabindex", "0");
      handle.addEventListener("keydown", function(event) {
        return eventKeydown(event, handleNumber);
      });
    }
    if (options.handleAttributes !== void 0) {
      var attributes_1 = options.handleAttributes[handleNumber];
      Object.keys(attributes_1).forEach(function(attribute) {
        handle.setAttribute(attribute, attributes_1[attribute]);
      });
    }
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
    if (handleNumber === 0) {
      addClass(handle, options.cssClasses.handleLower);
    } else if (handleNumber === options.handles - 1) {
      addClass(handle, options.cssClasses.handleUpper);
    }
    origin.handle = handle;
    return origin;
  }
  function addConnect(base, add) {
    if (!add) {
      return false;
    }
    return addNodeTo(base, options.cssClasses.connect);
  }
  function addElements(connectOptions, base) {
    scope_ConnectBase = addNodeTo(base, options.cssClasses.connects);
    scope_Handles = [];
    scope_Connects = [];
    scope_Connects.push(addConnect(scope_ConnectBase, connectOptions[0]));
    for (var i = 0; i < options.handles; i++) {
      scope_Handles.push(addOrigin(base, i));
      scope_HandleNumbers[i] = i;
      scope_Connects.push(addConnect(scope_ConnectBase, connectOptions[i + 1]));
    }
  }
  function addSlider(addTarget) {
    addClass(addTarget, options.cssClasses.target);
    if (options.dir === 0) {
      addClass(addTarget, options.cssClasses.ltr);
    } else {
      addClass(addTarget, options.cssClasses.rtl);
    }
    if (options.ort === 0) {
      addClass(addTarget, options.cssClasses.horizontal);
    } else {
      addClass(addTarget, options.cssClasses.vertical);
    }
    var textDirection = getComputedStyle(addTarget).direction;
    if (textDirection === "rtl") {
      addClass(addTarget, options.cssClasses.textDirectionRtl);
    } else {
      addClass(addTarget, options.cssClasses.textDirectionLtr);
    }
    return addNodeTo(addTarget, options.cssClasses.base);
  }
  function addTooltip(handle, handleNumber) {
    if (!options.tooltips || !options.tooltips[handleNumber]) {
      return false;
    }
    return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
  }
  function isSliderDisabled() {
    return scope_Target.hasAttribute("disabled");
  }
  function isHandleDisabled(handleNumber) {
    var handleOrigin = scope_Handles[handleNumber];
    return handleOrigin.hasAttribute("disabled");
  }
  function disable(handleNumber) {
    if (handleNumber !== null && handleNumber !== void 0) {
      scope_Handles[handleNumber].setAttribute("disabled", "");
      scope_Handles[handleNumber].handle.removeAttribute("tabindex");
    } else {
      scope_Target.setAttribute("disabled", "");
      scope_Handles.forEach(function(handle) {
        handle.handle.removeAttribute("tabindex");
      });
    }
  }
  function enable(handleNumber) {
    if (handleNumber !== null && handleNumber !== void 0) {
      scope_Handles[handleNumber].removeAttribute("disabled");
      scope_Handles[handleNumber].handle.setAttribute("tabindex", "0");
    } else {
      scope_Target.removeAttribute("disabled");
      scope_Handles.forEach(function(handle) {
        handle.removeAttribute("disabled");
        handle.handle.setAttribute("tabindex", "0");
      });
    }
  }
  function removeTooltips() {
    if (scope_Tooltips) {
      removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
      scope_Tooltips.forEach(function(tooltip) {
        if (tooltip) {
          removeElement(tooltip);
        }
      });
      scope_Tooltips = null;
    }
  }
  function tooltips() {
    removeTooltips();
    scope_Tooltips = scope_Handles.map(addTooltip);
    bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function(values, handleNumber, unencoded) {
      if (!scope_Tooltips || !options.tooltips) {
        return;
      }
      if (scope_Tooltips[handleNumber] === false) {
        return;
      }
      var formattedValue = values[handleNumber];
      if (options.tooltips[handleNumber] !== true) {
        formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
      }
      scope_Tooltips[handleNumber].innerHTML = formattedValue;
    });
  }
  function aria() {
    removeEvent("update" + INTERNAL_EVENT_NS.aria);
    bindEvent("update" + INTERNAL_EVENT_NS.aria, function(values, handleNumber, unencoded, tap, positions) {
      scope_HandleNumbers.forEach(function(index) {
        var handle = scope_Handles[index];
        var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
        var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
        var now = positions[index];
        var text = String(options.ariaFormat.to(unencoded[index]));
        min = scope_Spectrum.fromStepping(min).toFixed(1);
        max = scope_Spectrum.fromStepping(max).toFixed(1);
        now = scope_Spectrum.fromStepping(now).toFixed(1);
        handle.children[0].setAttribute("aria-valuemin", min);
        handle.children[0].setAttribute("aria-valuemax", max);
        handle.children[0].setAttribute("aria-valuenow", now);
        handle.children[0].setAttribute("aria-valuetext", text);
      });
    });
  }
  function getGroup(pips2) {
    if (pips2.mode === PipsMode.Range || pips2.mode === PipsMode.Steps) {
      return scope_Spectrum.xVal;
    }
    if (pips2.mode === PipsMode.Count) {
      if (pips2.values < 2) {
        throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
      }
      var interval = pips2.values - 1;
      var spread = 100 / interval;
      var values = [];
      while (interval--) {
        values[interval] = interval * spread;
      }
      values.push(100);
      return mapToRange(values, pips2.stepped);
    }
    if (pips2.mode === PipsMode.Positions) {
      return mapToRange(pips2.values, pips2.stepped);
    }
    if (pips2.mode === PipsMode.Values) {
      if (pips2.stepped) {
        return pips2.values.map(function(value) {
          return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
        });
      }
      return pips2.values;
    }
    return [];
  }
  function mapToRange(values, stepped) {
    return values.map(function(value) {
      return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
    });
  }
  function generateSpread(pips2) {
    function safeIncrement(value, increment) {
      return Number((value + increment).toFixed(7));
    }
    var group = getGroup(pips2);
    var indexes = {};
    var firstInRange = scope_Spectrum.xVal[0];
    var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
    var ignoreFirst = false;
    var ignoreLast = false;
    var prevPct = 0;
    group = unique(group.slice().sort(function(a, b) {
      return a - b;
    }));
    if (group[0] !== firstInRange) {
      group.unshift(firstInRange);
      ignoreFirst = true;
    }
    if (group[group.length - 1] !== lastInRange) {
      group.push(lastInRange);
      ignoreLast = true;
    }
    group.forEach(function(current, index) {
      var step;
      var i;
      var q;
      var low = current;
      var high = group[index + 1];
      var newPct;
      var pctDifference;
      var pctPos;
      var type;
      var steps;
      var realSteps;
      var stepSize;
      var isSteps = pips2.mode === PipsMode.Steps;
      if (isSteps) {
        step = scope_Spectrum.xNumSteps[index];
      }
      if (!step) {
        step = high - low;
      }
      if (high === void 0) {
        high = low;
      }
      step = Math.max(step, 1e-7);
      for (i = low; i <= high; i = safeIncrement(i, step)) {
        newPct = scope_Spectrum.toStepping(i);
        pctDifference = newPct - prevPct;
        steps = pctDifference / (pips2.density || 1);
        realSteps = Math.round(steps);
        stepSize = pctDifference / realSteps;
        for (q = 1; q <= realSteps; q += 1) {
          pctPos = prevPct + q * stepSize;
          indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
        }
        type = group.indexOf(i) > -1 ? PipsType.LargeValue : isSteps ? PipsType.SmallValue : PipsType.NoValue;
        if (!index && ignoreFirst && i !== high) {
          type = 0;
        }
        if (!(i === high && ignoreLast)) {
          indexes[newPct.toFixed(5)] = [i, type];
        }
        prevPct = newPct;
      }
    });
    return indexes;
  }
  function addMarking(spread, filterFunc, formatter) {
    var _a, _b;
    var element = scope_Document.createElement("div");
    var valueSizeClasses = (_a = {}, _a[PipsType.None] = "", _a[PipsType.NoValue] = options.cssClasses.valueNormal, _a[PipsType.LargeValue] = options.cssClasses.valueLarge, _a[PipsType.SmallValue] = options.cssClasses.valueSub, _a);
    var markerSizeClasses = (_b = {}, _b[PipsType.None] = "", _b[PipsType.NoValue] = options.cssClasses.markerNormal, _b[PipsType.LargeValue] = options.cssClasses.markerLarge, _b[PipsType.SmallValue] = options.cssClasses.markerSub, _b);
    var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
    var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
    addClass(element, options.cssClasses.pips);
    addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
    function getClasses(type, source) {
      var a = source === options.cssClasses.value;
      var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
      var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
      return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
    }
    function addSpread(offset2, value, type) {
      type = filterFunc ? filterFunc(value, type) : type;
      if (type === PipsType.None) {
        return;
      }
      var node = addNodeTo(element, false);
      node.className = getClasses(type, options.cssClasses.marker);
      node.style[options.style] = offset2 + "%";
      if (type > PipsType.NoValue) {
        node = addNodeTo(element, false);
        node.className = getClasses(type, options.cssClasses.value);
        node.setAttribute("data-value", String(value));
        node.style[options.style] = offset2 + "%";
        node.innerHTML = String(formatter.to(value));
      }
    }
    Object.keys(spread).forEach(function(offset2) {
      addSpread(offset2, spread[offset2][0], spread[offset2][1]);
    });
    return element;
  }
  function removePips() {
    if (scope_Pips) {
      removeElement(scope_Pips);
      scope_Pips = null;
    }
  }
  function pips(pips2) {
    removePips();
    var spread = generateSpread(pips2);
    var filter = pips2.filter;
    var format = pips2.format || {
      to: function(value) {
        return String(Math.round(value));
      }
    };
    scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
    return scope_Pips;
  }
  function baseSize() {
    var rect = scope_Base.getBoundingClientRect();
    var alt = "offset" + ["Width", "Height"][options.ort];
    return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
  }
  function attachEvent(events, element, callback, data) {
    var method = function(event) {
      var e = fixEvent(event, data.pageOffset, data.target || element);
      if (!e) {
        return false;
      }
      if (isSliderDisabled() && !data.doNotReject) {
        return false;
      }
      if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
        return false;
      }
      if (events === actions.start && e.buttons !== void 0 && e.buttons > 1) {
        return false;
      }
      if (data.hover && e.buttons) {
        return false;
      }
      if (!supportsPassive) {
        e.preventDefault();
      }
      e.calcPoint = e.points[options.ort];
      callback(e, data);
      return;
    };
    var methods = [];
    events.split(" ").forEach(function(eventName) {
      element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
      methods.push([eventName, method]);
    });
    return methods;
  }
  function fixEvent(e, pageOffset, eventTarget) {
    var touch = e.type.indexOf("touch") === 0;
    var mouse = e.type.indexOf("mouse") === 0;
    var pointer = e.type.indexOf("pointer") === 0;
    var x = 0;
    var y = 0;
    if (e.type.indexOf("MSPointer") === 0) {
      pointer = true;
    }
    if (e.type === "mousedown" && !e.buttons && !e.touches) {
      return false;
    }
    if (touch) {
      var isTouchOnTarget = function(checkTouch) {
        var target2 = checkTouch.target;
        return target2 === eventTarget || eventTarget.contains(target2) || e.composed && e.composedPath().shift() === eventTarget;
      };
      if (e.type === "touchstart") {
        var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
        if (targetTouches.length > 1) {
          return false;
        }
        x = targetTouches[0].pageX;
        y = targetTouches[0].pageY;
      } else {
        var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
        if (!targetTouch) {
          return false;
        }
        x = targetTouch.pageX;
        y = targetTouch.pageY;
      }
    }
    pageOffset = pageOffset || getPageOffset(scope_Document);
    if (mouse || pointer) {
      x = e.clientX + pageOffset.x;
      y = e.clientY + pageOffset.y;
    }
    e.pageOffset = pageOffset;
    e.points = [x, y];
    e.cursor = mouse || pointer;
    return e;
  }
  function calcPointToPercentage(calcPoint) {
    var location = calcPoint - offset(scope_Base, options.ort);
    var proposal = location * 100 / baseSize();
    proposal = limit(proposal);
    return options.dir ? 100 - proposal : proposal;
  }
  function getClosestHandle(clickedPosition) {
    var smallestDifference = 100;
    var handleNumber = false;
    scope_Handles.forEach(function(handle, index) {
      if (isHandleDisabled(index)) {
        return;
      }
      var handlePosition = scope_Locations[index];
      var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
      var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
      var isCloser = differenceWithThisHandle < smallestDifference;
      var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
      if (isCloser || isCloserAfter || clickAtEdge) {
        handleNumber = index;
        smallestDifference = differenceWithThisHandle;
      }
    });
    return handleNumber;
  }
  function documentLeave(event, data) {
    if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
      eventEnd(event, data);
    }
  }
  function eventMove(event, data) {
    if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
      return eventEnd(event, data);
    }
    var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
    var proposal = movement * 100 / data.baseSize;
    moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
  }
  function eventEnd(event, data) {
    if (data.handle) {
      removeClass(data.handle, options.cssClasses.active);
      scope_ActiveHandlesCount -= 1;
    }
    data.listeners.forEach(function(c) {
      scope_DocumentElement.removeEventListener(c[0], c[1]);
    });
    if (scope_ActiveHandlesCount === 0) {
      removeClass(scope_Target, options.cssClasses.drag);
      setZindex();
      if (event.cursor) {
        scope_Body.style.cursor = "";
        scope_Body.removeEventListener("selectstart", preventDefault);
      }
    }
    if (options.events.smoothSteps) {
      data.handleNumbers.forEach(function(handleNumber) {
        setHandle(handleNumber, scope_Locations[handleNumber], true, true, false, false);
      });
      data.handleNumbers.forEach(function(handleNumber) {
        fireEvent("update", handleNumber);
      });
    }
    data.handleNumbers.forEach(function(handleNumber) {
      fireEvent("change", handleNumber);
      fireEvent("set", handleNumber);
      fireEvent("end", handleNumber);
    });
  }
  function eventStart(event, data) {
    if (data.handleNumbers.some(isHandleDisabled)) {
      return;
    }
    var handle;
    if (data.handleNumbers.length === 1) {
      var handleOrigin = scope_Handles[data.handleNumbers[0]];
      handle = handleOrigin.children[0];
      scope_ActiveHandlesCount += 1;
      addClass(handle, options.cssClasses.active);
    }
    event.stopPropagation();
    var listeners = [];
    var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
      // The event target has changed so we need to propagate the original one so that we keep
      // relying on it to extract target touches.
      target: event.target,
      handle,
      connect: data.connect,
      listeners,
      startCalcPoint: event.calcPoint,
      baseSize: baseSize(),
      pageOffset: event.pageOffset,
      handleNumbers: data.handleNumbers,
      buttonsProperty: event.buttons,
      locations: scope_Locations.slice()
    });
    var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
      target: event.target,
      handle,
      listeners,
      doNotReject: true,
      handleNumbers: data.handleNumbers
    });
    var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
      target: event.target,
      handle,
      listeners,
      doNotReject: true,
      handleNumbers: data.handleNumbers
    });
    listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
    if (event.cursor) {
      scope_Body.style.cursor = getComputedStyle(event.target).cursor;
      if (scope_Handles.length > 1) {
        addClass(scope_Target, options.cssClasses.drag);
      }
      scope_Body.addEventListener("selectstart", preventDefault, false);
    }
    data.handleNumbers.forEach(function(handleNumber) {
      fireEvent("start", handleNumber);
    });
  }
  function eventTap(event) {
    event.stopPropagation();
    var proposal = calcPointToPercentage(event.calcPoint);
    var handleNumber = getClosestHandle(proposal);
    if (handleNumber === false) {
      return;
    }
    if (!options.events.snap) {
      addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
    }
    setHandle(handleNumber, proposal, true, true);
    setZindex();
    fireEvent("slide", handleNumber, true);
    fireEvent("update", handleNumber, true);
    if (!options.events.snap) {
      fireEvent("change", handleNumber, true);
      fireEvent("set", handleNumber, true);
    } else {
      eventStart(event, { handleNumbers: [handleNumber] });
    }
  }
  function eventHover(event) {
    var proposal = calcPointToPercentage(event.calcPoint);
    var to = scope_Spectrum.getStep(proposal);
    var value = scope_Spectrum.fromStepping(to);
    Object.keys(scope_Events).forEach(function(targetEvent) {
      if ("hover" === targetEvent.split(".")[0]) {
        scope_Events[targetEvent].forEach(function(callback) {
          callback.call(scope_Self, value);
        });
      }
    });
  }
  function eventKeydown(event, handleNumber) {
    if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
      return false;
    }
    var horizontalKeys = ["Left", "Right"];
    var verticalKeys = ["Down", "Up"];
    var largeStepKeys = ["PageDown", "PageUp"];
    var edgeKeys = ["Home", "End"];
    if (options.dir && !options.ort) {
      horizontalKeys.reverse();
    } else if (options.ort && !options.dir) {
      verticalKeys.reverse();
      largeStepKeys.reverse();
    }
    var key = event.key.replace("Arrow", "");
    var isLargeDown = key === largeStepKeys[0];
    var isLargeUp = key === largeStepKeys[1];
    var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
    var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
    var isMin = key === edgeKeys[0];
    var isMax = key === edgeKeys[1];
    if (!isDown && !isUp && !isMin && !isMax) {
      return true;
    }
    event.preventDefault();
    var to;
    if (isUp || isDown) {
      var direction = isDown ? 0 : 1;
      var steps = getNextStepsForHandle(handleNumber);
      var step = steps[direction];
      if (step === null) {
        return false;
      }
      if (step === false) {
        step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
      }
      if (isLargeUp || isLargeDown) {
        step *= options.keyboardPageMultiplier;
      } else {
        step *= options.keyboardMultiplier;
      }
      step = Math.max(step, 1e-7);
      step = (isDown ? -1 : 1) * step;
      to = scope_Values[handleNumber] + step;
    } else if (isMax) {
      to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
    } else {
      to = options.spectrum.xVal[0];
    }
    setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
    fireEvent("slide", handleNumber);
    fireEvent("update", handleNumber);
    fireEvent("change", handleNumber);
    fireEvent("set", handleNumber);
    return false;
  }
  function bindSliderEvents(behaviour) {
    if (!behaviour.fixed) {
      scope_Handles.forEach(function(handle, index) {
        attachEvent(actions.start, handle.children[0], eventStart, {
          handleNumbers: [index]
        });
      });
    }
    if (behaviour.tap) {
      attachEvent(actions.start, scope_Base, eventTap, {});
    }
    if (behaviour.hover) {
      attachEvent(actions.move, scope_Base, eventHover, {
        hover: true
      });
    }
    if (behaviour.drag) {
      scope_Connects.forEach(function(connect, index) {
        if (connect === false || index === 0 || index === scope_Connects.length - 1) {
          return;
        }
        var handleBefore = scope_Handles[index - 1];
        var handleAfter = scope_Handles[index];
        var eventHolders = [connect];
        var handlesToDrag = [handleBefore, handleAfter];
        var handleNumbersToDrag = [index - 1, index];
        addClass(connect, options.cssClasses.draggable);
        if (behaviour.fixed) {
          eventHolders.push(handleBefore.children[0]);
          eventHolders.push(handleAfter.children[0]);
        }
        if (behaviour.dragAll) {
          handlesToDrag = scope_Handles;
          handleNumbersToDrag = scope_HandleNumbers;
        }
        eventHolders.forEach(function(eventHolder) {
          attachEvent(actions.start, eventHolder, eventStart, {
            handles: handlesToDrag,
            handleNumbers: handleNumbersToDrag,
            connect
          });
        });
      });
    }
  }
  function bindEvent(namespacedEvent, callback) {
    scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
    scope_Events[namespacedEvent].push(callback);
    if (namespacedEvent.split(".")[0] === "update") {
      scope_Handles.forEach(function(a, index) {
        fireEvent("update", index);
      });
    }
  }
  function isInternalNamespace(namespace) {
    return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
  }
  function removeEvent(namespacedEvent) {
    var event = namespacedEvent && namespacedEvent.split(".")[0];
    var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
    Object.keys(scope_Events).forEach(function(bind) {
      var tEvent = bind.split(".")[0];
      var tNamespace = bind.substring(tEvent.length);
      if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
        if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
          delete scope_Events[bind];
        }
      }
    });
  }
  function fireEvent(eventName, handleNumber, tap) {
    Object.keys(scope_Events).forEach(function(targetEvent) {
      var eventType = targetEvent.split(".")[0];
      if (eventName === eventType) {
        scope_Events[targetEvent].forEach(function(callback) {
          callback.call(
            // Use the slider public API as the scope ('this')
            scope_Self,
            // Return values as array, so arg_1[arg_2] is always valid.
            scope_Values.map(options.format.to),
            // Handle index, 0 or 1
            handleNumber,
            // Un-formatted slider values
            scope_Values.slice(),
            // Event is fired by tap, true or false
            tap || false,
            // Left offset of the handle, in relation to the slider
            scope_Locations.slice(),
            // add the slider public API to an accessible parameter when this is unavailable
            scope_Self
          );
        });
      }
    });
  }
  function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
    var distance;
    if (scope_Handles.length > 1 && !options.events.unconstrained) {
      if (lookBackward && handleNumber > 0) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
        to = Math.max(to, distance);
      }
      if (lookForward && handleNumber < scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
        to = Math.min(to, distance);
      }
    }
    if (scope_Handles.length > 1 && options.limit) {
      if (lookBackward && handleNumber > 0) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
        to = Math.min(to, distance);
      }
      if (lookForward && handleNumber < scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
        to = Math.max(to, distance);
      }
    }
    if (options.padding) {
      if (handleNumber === 0) {
        distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
        to = Math.max(to, distance);
      }
      if (handleNumber === scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
        to = Math.min(to, distance);
      }
    }
    if (!smoothSteps) {
      to = scope_Spectrum.getStep(to);
    }
    to = limit(to);
    if (to === reference[handleNumber] && !getValue) {
      return false;
    }
    return to;
  }
  function inRuleOrder(v, a) {
    var o = options.ort;
    return (o ? a : v) + ", " + (o ? v : a);
  }
  function moveHandles(upward, proposal, locations, handleNumbers, connect) {
    var proposals = locations.slice();
    var firstHandle = handleNumbers[0];
    var smoothSteps = options.events.smoothSteps;
    var b = [!upward, upward];
    var f = [upward, !upward];
    handleNumbers = handleNumbers.slice();
    if (upward) {
      handleNumbers.reverse();
    }
    if (handleNumbers.length > 1) {
      handleNumbers.forEach(function(handleNumber, o) {
        var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false, smoothSteps);
        if (to === false) {
          proposal = 0;
        } else {
          proposal = to - proposals[handleNumber];
          proposals[handleNumber] = to;
        }
      });
    } else {
      b = f = [true];
    }
    var state = false;
    handleNumbers.forEach(function(handleNumber, o) {
      state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], false, smoothSteps) || state;
    });
    if (state) {
      handleNumbers.forEach(function(handleNumber) {
        fireEvent("update", handleNumber);
        fireEvent("slide", handleNumber);
      });
      if (connect != void 0) {
        fireEvent("drag", firstHandle);
      }
    }
  }
  function transformDirection(a, b) {
    return options.dir ? 100 - a - b : a;
  }
  function updateHandlePosition(handleNumber, to) {
    scope_Locations[handleNumber] = to;
    scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
    var translation = transformDirection(to, 0) - scope_DirOffset;
    var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
    scope_Handles[handleNumber].style[options.transformRule] = translateRule;
    if (options.events.invertConnects && scope_Locations.length > 1) {
      var handlesAreInOrder = scope_Locations.every(function(position, index, locations) {
        return index === 0 || position >= locations[index - 1];
      });
      if (scope_ConnectsInverted !== !handlesAreInOrder) {
        invertConnects();
        return;
      }
    }
    updateConnect(handleNumber);
    updateConnect(handleNumber + 1);
    if (scope_ConnectsInverted) {
      updateConnect(handleNumber - 1);
      updateConnect(handleNumber + 2);
    }
  }
  function setZindex() {
    scope_HandleNumbers.forEach(function(handleNumber) {
      var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
      var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
      scope_Handles[handleNumber].style.zIndex = String(zIndex);
    });
  }
  function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
    if (!exactInput) {
      to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false, smoothSteps);
    }
    if (to === false) {
      return false;
    }
    updateHandlePosition(handleNumber, to);
    return true;
  }
  function updateConnect(index) {
    if (!scope_Connects[index]) {
      return;
    }
    var locations = scope_Locations.slice();
    if (scope_ConnectsInverted) {
      locations.sort(function(a, b) {
        return a - b;
      });
    }
    var l = 0;
    var h = 100;
    if (index !== 0) {
      l = locations[index - 1];
    }
    if (index !== scope_Connects.length - 1) {
      h = locations[index];
    }
    var connectWidth = h - l;
    var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
    var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
    scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
  }
  function resolveToValue(to, handleNumber) {
    if (to === null || to === false || to === void 0) {
      return scope_Locations[handleNumber];
    }
    if (typeof to === "number") {
      to = String(to);
    }
    to = options.format.from(to);
    if (to !== false) {
      to = scope_Spectrum.toStepping(to);
    }
    if (to === false || isNaN(to)) {
      return scope_Locations[handleNumber];
    }
    return to;
  }
  function valueSet(input, fireSetEvent, exactInput) {
    var values = asArray(input);
    var isInit = scope_Locations[0] === void 0;
    fireSetEvent = fireSetEvent === void 0 ? true : fireSetEvent;
    if (options.animate && !isInit) {
      addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
    }
    scope_HandleNumbers.forEach(function(handleNumber) {
      setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
    });
    var i = scope_HandleNumbers.length === 1 ? 0 : 1;
    if (isInit && scope_Spectrum.hasNoSize()) {
      exactInput = true;
      scope_Locations[0] = 0;
      if (scope_HandleNumbers.length > 1) {
        var space_1 = 100 / (scope_HandleNumbers.length - 1);
        scope_HandleNumbers.forEach(function(handleNumber) {
          scope_Locations[handleNumber] = handleNumber * space_1;
        });
      }
    }
    for (; i < scope_HandleNumbers.length; ++i) {
      scope_HandleNumbers.forEach(function(handleNumber) {
        setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
      });
    }
    setZindex();
    scope_HandleNumbers.forEach(function(handleNumber) {
      fireEvent("update", handleNumber);
      if (values[handleNumber] !== null && fireSetEvent) {
        fireEvent("set", handleNumber);
      }
    });
  }
  function valueReset(fireSetEvent) {
    valueSet(options.start, fireSetEvent);
  }
  function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
    handleNumber = Number(handleNumber);
    if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
      throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
    }
    setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
    fireEvent("update", handleNumber);
    if (fireSetEvent) {
      fireEvent("set", handleNumber);
    }
  }
  function valueGet(unencoded) {
    if (unencoded === void 0) {
      unencoded = false;
    }
    if (unencoded) {
      return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
    }
    var values = scope_Values.map(options.format.to);
    if (values.length === 1) {
      return values[0];
    }
    return values;
  }
  function destroy() {
    removeEvent(INTERNAL_EVENT_NS.aria);
    removeEvent(INTERNAL_EVENT_NS.tooltips);
    Object.keys(options.cssClasses).forEach(function(key) {
      removeClass(scope_Target, options.cssClasses[key]);
    });
    while (scope_Target.firstChild) {
      scope_Target.removeChild(scope_Target.firstChild);
    }
    delete scope_Target.noUiSlider;
  }
  function getNextStepsForHandle(handleNumber) {
    var location = scope_Locations[handleNumber];
    var nearbySteps = scope_Spectrum.getNearbySteps(location);
    var value = scope_Values[handleNumber];
    var increment = nearbySteps.thisStep.step;
    var decrement = null;
    if (options.snap) {
      return [
        value - nearbySteps.stepBefore.startValue || null,
        nearbySteps.stepAfter.startValue - value || null
      ];
    }
    if (increment !== false) {
      if (value + increment > nearbySteps.stepAfter.startValue) {
        increment = nearbySteps.stepAfter.startValue - value;
      }
    }
    if (value > nearbySteps.thisStep.startValue) {
      decrement = nearbySteps.thisStep.step;
    } else if (nearbySteps.stepBefore.step === false) {
      decrement = false;
    } else {
      decrement = value - nearbySteps.stepBefore.highestStep;
    }
    if (location === 100) {
      increment = null;
    } else if (location === 0) {
      decrement = null;
    }
    var stepDecimals = scope_Spectrum.countStepDecimals();
    if (increment !== null && increment !== false) {
      increment = Number(increment.toFixed(stepDecimals));
    }
    if (decrement !== null && decrement !== false) {
      decrement = Number(decrement.toFixed(stepDecimals));
    }
    return [decrement, increment];
  }
  function getNextSteps() {
    return scope_HandleNumbers.map(getNextStepsForHandle);
  }
  function updateOptions(optionsToUpdate, fireSetEvent) {
    var v = valueGet();
    var updateAble = [
      "margin",
      "limit",
      "padding",
      "range",
      "animate",
      "snap",
      "step",
      "format",
      "pips",
      "tooltips",
      "connect"
    ];
    updateAble.forEach(function(name) {
      if (optionsToUpdate[name] !== void 0) {
        originalOptions[name] = optionsToUpdate[name];
      }
    });
    var newOptions = testOptions(originalOptions);
    updateAble.forEach(function(name) {
      if (optionsToUpdate[name] !== void 0) {
        options[name] = newOptions[name];
      }
    });
    scope_Spectrum = newOptions.spectrum;
    options.margin = newOptions.margin;
    options.limit = newOptions.limit;
    options.padding = newOptions.padding;
    if (options.pips) {
      pips(options.pips);
    } else {
      removePips();
    }
    if (options.tooltips) {
      tooltips();
    } else {
      removeTooltips();
    }
    scope_Locations = [];
    valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
    if (optionsToUpdate.connect) {
      updateConnectOption();
    }
  }
  function updateConnectOption() {
    while (scope_ConnectBase.firstChild) {
      scope_ConnectBase.removeChild(scope_ConnectBase.firstChild);
    }
    for (var i = 0; i <= options.handles; i++) {
      scope_Connects[i] = addConnect(scope_ConnectBase, options.connect[i]);
      updateConnect(i);
    }
    bindSliderEvents({ drag: options.events.drag, fixed: true });
  }
  function invertConnects() {
    scope_ConnectsInverted = !scope_ConnectsInverted;
    testConnect(
      options,
      // inverse the connect boolean array
      options.connect.map(function(b) {
        return !b;
      })
    );
    updateConnectOption();
  }
  function setupSlider() {
    scope_Base = addSlider(scope_Target);
    addElements(options.connect, scope_Base);
    bindSliderEvents(options.events);
    valueSet(options.start);
    if (options.pips) {
      pips(options.pips);
    }
    if (options.tooltips) {
      tooltips();
    }
    aria();
  }
  setupSlider();
  var scope_Self = {
    destroy,
    steps: getNextSteps,
    on: bindEvent,
    off: removeEvent,
    get: valueGet,
    set: valueSet,
    setHandle: valueSetHandle,
    reset: valueReset,
    disable,
    enable,
    // Exposed for unit testing, don't use this in your application.
    __moveHandles: function(upward, proposal, handleNumbers) {
      moveHandles(upward, proposal, scope_Locations, handleNumbers);
    },
    options: originalOptions,
    updateOptions,
    target: scope_Target,
    removePips,
    removeTooltips,
    getPositions: function() {
      return scope_Locations.slice();
    },
    getTooltips: function() {
      return scope_Tooltips;
    },
    getOrigins: function() {
      return scope_Handles;
    },
    pips
    // Issue #594
  };
  return scope_Self;
}
function initialize(target, originalOptions) {
  if (!target || !target.nodeName) {
    throw new Error("noUiSlider: create requires a single element, got: " + target);
  }
  if (target.noUiSlider) {
    throw new Error("noUiSlider: Slider was already initialized.");
  }
  var options = testOptions(originalOptions);
  var api = scope(target, options, originalOptions);
  target.noUiSlider = api;
  return api;
}
var nouislider_default = {
  // Exposed for unit testing, don't use this in your application.
  __spectrum: Spectrum,
  // A reference to the default classes, allows global changes.
  // Use the cssClasses option for changes to one slider.
  cssClasses,
  create: initialize
};

// resources/js/index.js
function slider({
  element,
  start,
  connect,
  range = { min: 0, max: 10 },
  state = [],
  step,
  behaviour,
  snap = false,
  tooltips = false,
  format = null,
  onChange = () => {
  }
}) {
  return {
    element,
    start,
    connect,
    range,
    state,
    step,
    behaviour,
    snap,
    tooltips,
    format,
    component: null,
    slider: null,
    _handler: null,
    init() {
      this.component = document.getElementById(this.element);
      if (!this.component) return;
      this.component.classList.add("range-slider");
      const raw = (v) => window.Alpine && typeof window.Alpine.raw === "function" ? window.Alpine.raw(v) : v;
      this.slider = nouislider_default.create(this.component, {
        start: raw(this.start),
        connect: raw(this.connect),
        range: raw(this.range),
        tooltips: this.tooltips,
        step: raw(this.step),
        behaviour: raw(this.behaviour),
        snap: raw(this.snap),
        format: this.format
      });
      this._handler = (values, handle, unencoded, tap, positions) => {
        const states = Array.isArray(this.state) ? this.state : [];
        onChange.call(this, values, handle, unencoded, tap, positions, states);
      };
      this.slider.on("change", this._handler);
    },
    destroy() {
      if (this.slider) {
        if (this._handler) {
          this.slider.off("change", this._handler);
        }
        this.slider.destroy();
        this.slider = null;
      }
    }
  };
}
export {
  slider as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL25vdWlzbGlkZXIvZGlzdC9ub3Vpc2xpZGVyLm1qcyIsICIuLi8uLi9qcy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnQgdmFyIFBpcHNNb2RlO1xuKGZ1bmN0aW9uIChQaXBzTW9kZSkge1xuICAgIFBpcHNNb2RlW1wiUmFuZ2VcIl0gPSBcInJhbmdlXCI7XG4gICAgUGlwc01vZGVbXCJTdGVwc1wiXSA9IFwic3RlcHNcIjtcbiAgICBQaXBzTW9kZVtcIlBvc2l0aW9uc1wiXSA9IFwicG9zaXRpb25zXCI7XG4gICAgUGlwc01vZGVbXCJDb3VudFwiXSA9IFwiY291bnRcIjtcbiAgICBQaXBzTW9kZVtcIlZhbHVlc1wiXSA9IFwidmFsdWVzXCI7XG59KShQaXBzTW9kZSB8fCAoUGlwc01vZGUgPSB7fSkpO1xuZXhwb3J0IHZhciBQaXBzVHlwZTtcbihmdW5jdGlvbiAoUGlwc1R5cGUpIHtcbiAgICBQaXBzVHlwZVtQaXBzVHlwZVtcIk5vbmVcIl0gPSAtMV0gPSBcIk5vbmVcIjtcbiAgICBQaXBzVHlwZVtQaXBzVHlwZVtcIk5vVmFsdWVcIl0gPSAwXSA9IFwiTm9WYWx1ZVwiO1xuICAgIFBpcHNUeXBlW1BpcHNUeXBlW1wiTGFyZ2VWYWx1ZVwiXSA9IDFdID0gXCJMYXJnZVZhbHVlXCI7XG4gICAgUGlwc1R5cGVbUGlwc1R5cGVbXCJTbWFsbFZhbHVlXCJdID0gMl0gPSBcIlNtYWxsVmFsdWVcIjtcbn0pKFBpcHNUeXBlIHx8IChQaXBzVHlwZSA9IHt9KSk7XG4vL3JlZ2lvbiBIZWxwZXIgTWV0aG9kc1xuZnVuY3Rpb24gaXNWYWxpZEZvcm1hdHRlcihlbnRyeSkge1xuICAgIHJldHVybiBpc1ZhbGlkUGFydGlhbEZvcm1hdHRlcihlbnRyeSkgJiYgdHlwZW9mIGVudHJ5LmZyb20gPT09IFwiZnVuY3Rpb25cIjtcbn1cbmZ1bmN0aW9uIGlzVmFsaWRQYXJ0aWFsRm9ybWF0dGVyKGVudHJ5KSB7XG4gICAgLy8gcGFydGlhbCBmb3JtYXR0ZXJzIG9ubHkgbmVlZCBhIHRvIGZ1bmN0aW9uIGFuZCBub3QgYSBmcm9tIGZ1bmN0aW9uXG4gICAgcmV0dXJuIHR5cGVvZiBlbnRyeSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZW50cnkudG8gPT09IFwiZnVuY3Rpb25cIjtcbn1cbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoZWwpIHtcbiAgICBlbC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsKTtcbn1cbmZ1bmN0aW9uIGlzU2V0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQ7XG59XG4vLyBCaW5kYWJsZSB2ZXJzaW9uXG5mdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuLy8gUmVtb3ZlcyBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuXG5mdW5jdGlvbiB1bmlxdWUoYXJyYXkpIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiAhdGhpc1thXSA/ICh0aGlzW2FdID0gdHJ1ZSkgOiBmYWxzZTtcbiAgICB9LCB7fSk7XG59XG4vLyBSb3VuZCBhIHZhbHVlIHRvIHRoZSBjbG9zZXN0ICd0bycuXG5mdW5jdGlvbiBjbG9zZXN0KHZhbHVlLCB0bykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlIC8gdG8pICogdG87XG59XG4vLyBDdXJyZW50IHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50LlxuZnVuY3Rpb24gb2Zmc2V0KGVsZW0sIG9yaWVudGF0aW9uKSB7XG4gICAgdmFyIHJlY3QgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciBkb2MgPSBlbGVtLm93bmVyRG9jdW1lbnQ7XG4gICAgdmFyIGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciBwYWdlT2Zmc2V0ID0gZ2V0UGFnZU9mZnNldChkb2MpO1xuICAgIC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBjb250YWlucyBsZWZ0IHNjcm9sbCBpbiBDaHJvbWUgb24gQW5kcm9pZC5cbiAgICAvLyBJIGhhdmVuJ3QgZm91bmQgYSBmZWF0dXJlIGRldGVjdGlvbiB0aGF0IHByb3ZlcyB0aGlzLiBXb3JzdCBjYXNlXG4gICAgLy8gc2NlbmFyaW8gb24gbWlzLW1hdGNoOiB0aGUgJ3RhcCcgZmVhdHVyZSBvbiBob3Jpem9udGFsIHNsaWRlcnMgYnJlYWtzLlxuICAgIGlmICgvd2Via2l0LipDaHJvbWUuKk1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgcGFnZU9mZnNldC54ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG9yaWVudGF0aW9uID8gcmVjdC50b3AgKyBwYWdlT2Zmc2V0LnkgLSBkb2NFbGVtLmNsaWVudFRvcCA6IHJlY3QubGVmdCArIHBhZ2VPZmZzZXQueCAtIGRvY0VsZW0uY2xpZW50TGVmdDtcbn1cbi8vIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgbnVtZXJpY2FsLlxuZnVuY3Rpb24gaXNOdW1lcmljKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwibnVtYmVyXCIgJiYgIWlzTmFOKGEpICYmIGlzRmluaXRlKGEpO1xufVxuLy8gU2V0cyBhIGNsYXNzIGFuZCByZW1vdmVzIGl0IGFmdGVyIFtkdXJhdGlvbl0gbXMuXG5mdW5jdGlvbiBhZGRDbGFzc0ZvcihlbGVtZW50LCBjbGFzc05hbWUsIGR1cmF0aW9uKSB7XG4gICAgaWYgKGR1cmF0aW9uID4gMCkge1xuICAgICAgICBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICB9XG59XG4vLyBMaW1pdHMgYSB2YWx1ZSB0byAwIC0gMTAwXG5mdW5jdGlvbiBsaW1pdChhKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKGEsIDEwMCksIDApO1xufVxuLy8gV3JhcHMgYSB2YXJpYWJsZSBhcyBhbiBhcnJheSwgaWYgaXQgaXNuJ3Qgb25lIHlldC5cbi8vIE5vdGUgdGhhdCBhbiBpbnB1dCBhcnJheSBpcyByZXR1cm5lZCBieSByZWZlcmVuY2UhXG5mdW5jdGlvbiBhc0FycmF5KGEpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhKSA/IGEgOiBbYV07XG59XG4vLyBDb3VudHMgZGVjaW1hbHNcbmZ1bmN0aW9uIGNvdW50RGVjaW1hbHMobnVtU3RyKSB7XG4gICAgbnVtU3RyID0gU3RyaW5nKG51bVN0cik7XG4gICAgdmFyIHBpZWNlcyA9IG51bVN0ci5zcGxpdChcIi5cIik7XG4gICAgcmV0dXJuIHBpZWNlcy5sZW5ndGggPiAxID8gcGllY2VzWzFdLmxlbmd0aCA6IDA7XG59XG4vLyBodHRwOi8veW91bWlnaHRub3RuZWVkanF1ZXJ5LmNvbS8jYWRkX2NsYXNzXG5mdW5jdGlvbiBhZGRDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCAmJiAhL1xccy8udGVzdChjbGFzc05hbWUpKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICB9XG59XG4vLyBodHRwOi8veW91bWlnaHRub3RuZWVkanF1ZXJ5LmNvbS8jcmVtb3ZlX2NsYXNzXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCAmJiAhL1xccy8udGVzdChjbGFzc05hbWUpKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxcYilcIiArIGNsYXNzTmFtZS5zcGxpdChcIiBcIikuam9pbihcInxcIikgKyBcIihcXFxcYnwkKVwiLCBcImdpXCIpLCBcIiBcIik7XG4gICAgfVxufVxuLy8gaHR0cHM6Ly9wbGFpbmpzLmNvbS9qYXZhc2NyaXB0L2F0dHJpYnV0ZXMvYWRkaW5nLXJlbW92aW5nLWFuZC10ZXN0aW5nLWZvci1jbGFzc2VzLTkvXG5mdW5jdGlvbiBoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGVsLmNsYXNzTGlzdCA/IGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpIDogbmV3IFJlZ0V4cChcIlxcXFxiXCIgKyBjbGFzc05hbWUgKyBcIlxcXFxiXCIpLnRlc3QoZWwuY2xhc3NOYW1lKTtcbn1cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cvc2Nyb2xsWSNOb3Rlc1xuZnVuY3Rpb24gZ2V0UGFnZU9mZnNldChkb2MpIHtcbiAgICB2YXIgc3VwcG9ydFBhZ2VPZmZzZXQgPSB3aW5kb3cucGFnZVhPZmZzZXQgIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaXNDU1MxQ29tcGF0ID0gKGRvYy5jb21wYXRNb2RlIHx8IFwiXCIpID09PSBcIkNTUzFDb21wYXRcIjtcbiAgICB2YXIgeCA9IHN1cHBvcnRQYWdlT2Zmc2V0XG4gICAgICAgID8gd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICAgIDogaXNDU1MxQ29tcGF0XG4gICAgICAgICAgICA/IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdFxuICAgICAgICAgICAgOiBkb2MuYm9keS5zY3JvbGxMZWZ0O1xuICAgIHZhciB5ID0gc3VwcG9ydFBhZ2VPZmZzZXRcbiAgICAgICAgPyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgOiBpc0NTUzFDb21wYXRcbiAgICAgICAgICAgID8gZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICAgICAgICAgIDogZG9jLmJvZHkuc2Nyb2xsVG9wO1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgfTtcbn1cbi8vIHdlIHByb3ZpZGUgYSBmdW5jdGlvbiB0byBjb21wdXRlIGNvbnN0YW50cyBpbnN0ZWFkXG4vLyBvZiBhY2Nlc3Npbmcgd2luZG93LiogYXMgc29vbiBhcyB0aGUgbW9kdWxlIG5lZWRzIGl0XG4vLyBzbyB0aGF0IHdlIGRvIG5vdCBjb21wdXRlIGFueXRoaW5nIGlmIG5vdCBuZWVkZWRcbmZ1bmN0aW9uIGdldEFjdGlvbnMoKSB7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBldmVudHMgdG8gYmluZC4gSUUxMSBpbXBsZW1lbnRzIHBvaW50ZXJFdmVudHMgd2l0aG91dFxuICAgIC8vIGEgcHJlZml4LCB3aGljaCBicmVha3MgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBJRTEwIGltcGxlbWVudGF0aW9uLlxuICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkXG4gICAgICAgID8ge1xuICAgICAgICAgICAgc3RhcnQ6IFwicG9pbnRlcmRvd25cIixcbiAgICAgICAgICAgIG1vdmU6IFwicG9pbnRlcm1vdmVcIixcbiAgICAgICAgICAgIGVuZDogXCJwb2ludGVydXBcIixcbiAgICAgICAgfVxuICAgICAgICA6IHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IFwiTVNQb2ludGVyRG93blwiLFxuICAgICAgICAgICAgICAgIG1vdmU6IFwiTVNQb2ludGVyTW92ZVwiLFxuICAgICAgICAgICAgICAgIGVuZDogXCJNU1BvaW50ZXJVcFwiLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IFwibW91c2Vkb3duIHRvdWNoc3RhcnRcIixcbiAgICAgICAgICAgICAgICBtb3ZlOiBcIm1vdXNlbW92ZSB0b3VjaG1vdmVcIixcbiAgICAgICAgICAgICAgICBlbmQ6IFwibW91c2V1cCB0b3VjaGVuZFwiLFxuICAgICAgICAgICAgfTtcbn1cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL0V2ZW50TGlzdGVuZXJPcHRpb25zL2Jsb2IvZ2gtcGFnZXMvZXhwbGFpbmVyLm1kXG4vLyBJc3N1ZSAjNzg1XG5mdW5jdGlvbiBnZXRTdXBwb3J0c1Bhc3NpdmUoKSB7XG4gICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xuICAgIC8qIGVzbGludC1kaXNhYmxlICovXG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sIFwicGFzc2l2ZVwiLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsIG51bGwsIG9wdHMpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkgeyB9XG4gICAgLyogZXNsaW50LWVuYWJsZSAqL1xuICAgIHJldHVybiBzdXBwb3J0c1Bhc3NpdmU7XG59XG5mdW5jdGlvbiBnZXRTdXBwb3J0c1RvdWNoQWN0aW9uTm9uZSgpIHtcbiAgICByZXR1cm4gd2luZG93LkNTUyAmJiBDU1Muc3VwcG9ydHMgJiYgQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsIFwibm9uZVwiKTtcbn1cbi8vZW5kcmVnaW9uXG4vL3JlZ2lvbiBSYW5nZSBDYWxjdWxhdGlvblxuLy8gRGV0ZXJtaW5lIHRoZSBzaXplIG9mIGEgc3ViLXJhbmdlIGluIHJlbGF0aW9uIHRvIGEgZnVsbCByYW5nZS5cbmZ1bmN0aW9uIHN1YlJhbmdlUmF0aW8ocGEsIHBiKSB7XG4gICAgcmV0dXJuIDEwMCAvIChwYiAtIHBhKTtcbn1cbi8vIChwZXJjZW50YWdlKSBIb3cgbWFueSBwZXJjZW50IGlzIHRoaXMgdmFsdWUgb2YgdGhpcyByYW5nZT9cbmZ1bmN0aW9uIGZyb21QZXJjZW50YWdlKHJhbmdlLCB2YWx1ZSwgc3RhcnRSYW5nZSkge1xuICAgIHJldHVybiAodmFsdWUgKiAxMDApIC8gKHJhbmdlW3N0YXJ0UmFuZ2UgKyAxXSAtIHJhbmdlW3N0YXJ0UmFuZ2VdKTtcbn1cbi8vIChwZXJjZW50YWdlKSBXaGVyZSBpcyB0aGlzIHZhbHVlIG9uIHRoaXMgcmFuZ2U/XG5mdW5jdGlvbiB0b1BlcmNlbnRhZ2UocmFuZ2UsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGZyb21QZXJjZW50YWdlKHJhbmdlLCByYW5nZVswXSA8IDAgPyB2YWx1ZSArIE1hdGguYWJzKHJhbmdlWzBdKSA6IHZhbHVlIC0gcmFuZ2VbMF0sIDApO1xufVxuLy8gKHZhbHVlKSBIb3cgbXVjaCBpcyB0aGlzIHBlcmNlbnRhZ2Ugb24gdGhpcyByYW5nZT9cbmZ1bmN0aW9uIGlzUGVyY2VudGFnZShyYW5nZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlICogKHJhbmdlWzFdIC0gcmFuZ2VbMF0pKSAvIDEwMCArIHJhbmdlWzBdO1xufVxuZnVuY3Rpb24gZ2V0Sih2YWx1ZSwgYXJyKSB7XG4gICAgdmFyIGogPSAxO1xuICAgIHdoaWxlICh2YWx1ZSA+PSBhcnJbal0pIHtcbiAgICAgICAgaiArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gajtcbn1cbi8vIChwZXJjZW50YWdlKSBJbnB1dCBhIHZhbHVlLCBmaW5kIHdoZXJlLCBvbiBhIHNjYWxlIG9mIDAtMTAwLCBpdCBhcHBsaWVzLlxuZnVuY3Rpb24gdG9TdGVwcGluZyh4VmFsLCB4UGN0LCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA+PSB4VmFsLnNsaWNlKC0xKVswXSkge1xuICAgICAgICByZXR1cm4gMTAwO1xuICAgIH1cbiAgICB2YXIgaiA9IGdldEoodmFsdWUsIHhWYWwpO1xuICAgIHZhciB2YSA9IHhWYWxbaiAtIDFdO1xuICAgIHZhciB2YiA9IHhWYWxbal07XG4gICAgdmFyIHBhID0geFBjdFtqIC0gMV07XG4gICAgdmFyIHBiID0geFBjdFtqXTtcbiAgICByZXR1cm4gcGEgKyB0b1BlcmNlbnRhZ2UoW3ZhLCB2Yl0sIHZhbHVlKSAvIHN1YlJhbmdlUmF0aW8ocGEsIHBiKTtcbn1cbi8vICh2YWx1ZSkgSW5wdXQgYSBwZXJjZW50YWdlLCBmaW5kIHdoZXJlIGl0IGlzIG9uIHRoZSBzcGVjaWZpZWQgcmFuZ2UuXG5mdW5jdGlvbiBmcm9tU3RlcHBpbmcoeFZhbCwgeFBjdCwgdmFsdWUpIHtcbiAgICAvLyBUaGVyZSBpcyBubyByYW5nZSBncm91cCB0aGF0IGZpdHMgMTAwXG4gICAgaWYgKHZhbHVlID49IDEwMCkge1xuICAgICAgICByZXR1cm4geFZhbC5zbGljZSgtMSlbMF07XG4gICAgfVxuICAgIHZhciBqID0gZ2V0Sih2YWx1ZSwgeFBjdCk7XG4gICAgdmFyIHZhID0geFZhbFtqIC0gMV07XG4gICAgdmFyIHZiID0geFZhbFtqXTtcbiAgICB2YXIgcGEgPSB4UGN0W2ogLSAxXTtcbiAgICB2YXIgcGIgPSB4UGN0W2pdO1xuICAgIHJldHVybiBpc1BlcmNlbnRhZ2UoW3ZhLCB2Yl0sICh2YWx1ZSAtIHBhKSAqIHN1YlJhbmdlUmF0aW8ocGEsIHBiKSk7XG59XG4vLyAocGVyY2VudGFnZSkgR2V0IHRoZSBzdGVwIHRoYXQgYXBwbGllcyBhdCBhIGNlcnRhaW4gdmFsdWUuXG5mdW5jdGlvbiBnZXRTdGVwKHhQY3QsIHhTdGVwcywgc25hcCwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IDEwMCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHZhciBqID0gZ2V0Sih2YWx1ZSwgeFBjdCk7XG4gICAgdmFyIGEgPSB4UGN0W2ogLSAxXTtcbiAgICB2YXIgYiA9IHhQY3Rbal07XG4gICAgLy8gSWYgJ3NuYXAnIGlzIHNldCwgc3RlcHMgYXJlIHVzZWQgYXMgZml4ZWQgcG9pbnRzIG9uIHRoZSBzbGlkZXIuXG4gICAgaWYgKHNuYXApIHtcbiAgICAgICAgLy8gRmluZCB0aGUgY2xvc2VzdCBwb3NpdGlvbiwgYSBvciBiLlxuICAgICAgICBpZiAodmFsdWUgLSBhID4gKGIgLSBhKSAvIDIpIHtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBpZiAoIXhTdGVwc1tqIC0gMV0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4geFBjdFtqIC0gMV0gKyBjbG9zZXN0KHZhbHVlIC0geFBjdFtqIC0gMV0sIHhTdGVwc1tqIC0gMV0pO1xufVxuLy9lbmRyZWdpb25cbi8vcmVnaW9uIFNwZWN0cnVtXG52YXIgU3BlY3RydW0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3BlY3RydW0oZW50cnksIHNuYXAsIHNpbmdsZVN0ZXApIHtcbiAgICAgICAgdGhpcy54UGN0ID0gW107XG4gICAgICAgIHRoaXMueFZhbCA9IFtdO1xuICAgICAgICB0aGlzLnhTdGVwcyA9IFtdO1xuICAgICAgICB0aGlzLnhOdW1TdGVwcyA9IFtdO1xuICAgICAgICB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwID0gW107XG4gICAgICAgIHRoaXMueFN0ZXBzID0gW3NpbmdsZVN0ZXAgfHwgZmFsc2VdO1xuICAgICAgICB0aGlzLnhOdW1TdGVwcyA9IFtmYWxzZV07XG4gICAgICAgIHRoaXMuc25hcCA9IHNuYXA7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIG9yZGVyZWQgPSBbXTtcbiAgICAgICAgLy8gTWFwIHRoZSBvYmplY3Qga2V5cyB0byBhbiBhcnJheS5cbiAgICAgICAgT2JqZWN0LmtleXMoZW50cnkpLmZvckVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICBvcmRlcmVkLnB1c2goW2FzQXJyYXkoZW50cnlbaW5kZXhdKSwgaW5kZXhdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFNvcnQgYWxsIGVudHJpZXMgYnkgdmFsdWUgKG51bWVyaWMgc29ydCkuXG4gICAgICAgIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGFbMF1bMF0gLSBiWzBdWzBdO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ29udmVydCBhbGwgZW50cmllcyB0byBzdWJyYW5nZXMuXG4gICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IG9yZGVyZWQubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUVudHJ5UG9pbnQob3JkZXJlZFtpbmRleF1bMV0sIG9yZGVyZWRbaW5kZXhdWzBdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdG9yZSB0aGUgYWN0dWFsIHN0ZXAgdmFsdWVzLlxuICAgICAgICAvLyB4U3RlcHMgaXMgc29ydGVkIGluIHRoZSBzYW1lIG9yZGVyIGFzIHhQY3QgYW5kIHhWYWwuXG4gICAgICAgIHRoaXMueE51bVN0ZXBzID0gdGhpcy54U3RlcHMuc2xpY2UoMCk7XG4gICAgICAgIC8vIENvbnZlcnQgYWxsIG51bWVyaWMgc3RlcHMgdG8gdGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHN1YnJhbmdlIHRoZXkgcmVwcmVzZW50LlxuICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnhOdW1TdGVwcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU3RlcFBvaW50KGluZGV4LCB0aGlzLnhOdW1TdGVwc1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5nZXREaXN0YW5jZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgZGlzdGFuY2VzID0gW107XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnhOdW1TdGVwcy5sZW5ndGggLSAxOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBkaXN0YW5jZXNbaW5kZXhdID0gZnJvbVBlcmNlbnRhZ2UodGhpcy54VmFsLCB2YWx1ZSwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXN0YW5jZXM7XG4gICAgfTtcbiAgICAvLyBDYWxjdWxhdGUgdGhlIHBlcmNlbnR1YWwgZGlzdGFuY2Ugb3ZlciB0aGUgd2hvbGUgc2NhbGUgb2YgcmFuZ2VzLlxuICAgIC8vIGRpcmVjdGlvbjogMCA9IGJhY2t3YXJkcyAvIDEgPSBmb3J3YXJkc1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5nZXRBYnNvbHV0ZURpc3RhbmNlID0gZnVuY3Rpb24gKHZhbHVlLCBkaXN0YW5jZXMsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgeFBjdF9pbmRleCA9IDA7XG4gICAgICAgIC8vIENhbGN1bGF0ZSByYW5nZSB3aGVyZSB0byBzdGFydCBjYWxjdWxhdGlvblxuICAgICAgICBpZiAodmFsdWUgPCB0aGlzLnhQY3RbdGhpcy54UGN0Lmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICB3aGlsZSAodmFsdWUgPiB0aGlzLnhQY3RbeFBjdF9pbmRleCArIDFdKSB7XG4gICAgICAgICAgICAgICAgeFBjdF9pbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlID09PSB0aGlzLnhQY3RbdGhpcy54UGN0Lmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICB4UGN0X2luZGV4ID0gdGhpcy54UGN0Lmxlbmd0aCAtIDI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbG9va2luZyBiYWNrd2FyZHMgYW5kIHRoZSB2YWx1ZSBpcyBleGFjdGx5IGF0IGEgcmFuZ2Ugc2VwYXJhdG9yIHRoZW4gbG9vayBvbmUgcmFuZ2UgZnVydGhlclxuICAgICAgICBpZiAoIWRpcmVjdGlvbiAmJiB2YWx1ZSA9PT0gdGhpcy54UGN0W3hQY3RfaW5kZXggKyAxXSkge1xuICAgICAgICAgICAgeFBjdF9pbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXN0YW5jZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGRpc3RhbmNlcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGFydF9mYWN0b3I7XG4gICAgICAgIHZhciByZXN0X2ZhY3RvciA9IDE7XG4gICAgICAgIHZhciByZXN0X3JlbF9kaXN0YW5jZSA9IGRpc3RhbmNlc1t4UGN0X2luZGV4XTtcbiAgICAgICAgdmFyIHJhbmdlX3BjdCA9IDA7XG4gICAgICAgIHZhciByZWxfcmFuZ2VfZGlzdGFuY2UgPSAwO1xuICAgICAgICB2YXIgYWJzX2Rpc3RhbmNlX2NvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgcmFuZ2VfY291bnRlciA9IDA7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aGF0IHBhcnQgb2YgdGhlIHN0YXJ0IHJhbmdlIHRoZSB2YWx1ZSBpc1xuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBzdGFydF9mYWN0b3IgPSAodmFsdWUgLSB0aGlzLnhQY3RbeFBjdF9pbmRleF0pIC8gKHRoaXMueFBjdFt4UGN0X2luZGV4ICsgMV0gLSB0aGlzLnhQY3RbeFBjdF9pbmRleF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhcnRfZmFjdG9yID0gKHRoaXMueFBjdFt4UGN0X2luZGV4ICsgMV0gLSB2YWx1ZSkgLyAodGhpcy54UGN0W3hQY3RfaW5kZXggKyAxXSAtIHRoaXMueFBjdFt4UGN0X2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gdW50aWwgdGhlIGNvbXBsZXRlIGRpc3RhbmNlIGFjcm9zcyByYW5nZXMgaXMgY2FsY3VsYXRlZFxuICAgICAgICB3aGlsZSAocmVzdF9yZWxfZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHBlcmNlbnRhZ2Ugb2YgdG90YWwgcmFuZ2VcbiAgICAgICAgICAgIHJhbmdlX3BjdCA9IHRoaXMueFBjdFt4UGN0X2luZGV4ICsgMSArIHJhbmdlX2NvdW50ZXJdIC0gdGhpcy54UGN0W3hQY3RfaW5kZXggKyByYW5nZV9jb3VudGVyXTtcbiAgICAgICAgICAgIC8vIERldGVjdCBpZiB0aGUgbWFyZ2luLCBwYWRkaW5nIG9yIGxpbWl0IGlzIGxhcmdlciB0aGVuIHRoZSBjdXJyZW50IHJhbmdlIGFuZCBjYWxjdWxhdGVcbiAgICAgICAgICAgIGlmIChkaXN0YW5jZXNbeFBjdF9pbmRleCArIHJhbmdlX2NvdW50ZXJdICogcmVzdF9mYWN0b3IgKyAxMDAgLSBzdGFydF9mYWN0b3IgKiAxMDAgPiAxMDApIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBsYXJnZXIgdGhlbiB0YWtlIHRoZSBwZXJjZW50dWFsIGRpc3RhbmNlIG9mIHRoZSB3aG9sZSByYW5nZVxuICAgICAgICAgICAgICAgIHJlbF9yYW5nZV9kaXN0YW5jZSA9IHJhbmdlX3BjdCAqIHN0YXJ0X2ZhY3RvcjtcbiAgICAgICAgICAgICAgICAvLyBSZXN0IGZhY3RvciBvZiByZWxhdGl2ZSBwZXJjZW50dWFsIGRpc3RhbmNlIHN0aWxsIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICAgICAgICAgICAgICByZXN0X2ZhY3RvciA9IChyZXN0X3JlbF9kaXN0YW5jZSAtIDEwMCAqIHN0YXJ0X2ZhY3RvcikgLyBkaXN0YW5jZXNbeFBjdF9pbmRleCArIHJhbmdlX2NvdW50ZXJdO1xuICAgICAgICAgICAgICAgIC8vIFNldCBzdGFydCBmYWN0b3IgdG8gMSBhcyBmb3IgbmV4dCByYW5nZSBpdCBkb2VzIG5vdCBhcHBseS5cbiAgICAgICAgICAgICAgICBzdGFydF9mYWN0b3IgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgc21hbGxlciBvciBlcXVhbCB0aGVuIHRha2UgdGhlIHBlcmNlbnR1YWwgZGlzdGFuY2Ugb2YgdGhlIGNhbGN1bGF0ZSBwZXJjZW50dWFsIHBhcnQgb2YgdGhhdCByYW5nZVxuICAgICAgICAgICAgICAgIHJlbF9yYW5nZV9kaXN0YW5jZSA9ICgoZGlzdGFuY2VzW3hQY3RfaW5kZXggKyByYW5nZV9jb3VudGVyXSAqIHJhbmdlX3BjdCkgLyAxMDApICogcmVzdF9mYWN0b3I7XG4gICAgICAgICAgICAgICAgLy8gTm8gcmVzdCBsZWZ0IGFzIHRoZSByZXN0IGZpdHMgaW4gY3VycmVudCByYW5nZVxuICAgICAgICAgICAgICAgIHJlc3RfZmFjdG9yID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBhYnNfZGlzdGFuY2VfY291bnRlciA9IGFic19kaXN0YW5jZV9jb3VudGVyIC0gcmVsX3JhbmdlX2Rpc3RhbmNlO1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHJhbmdlIHRvIGZpcnN0IHJhbmdlIHdoZW4gZGlzdGFuY2UgYmVjb21lcyBvdXRzaWRlIG9mIG1pbmltdW0gcmFuZ2VcbiAgICAgICAgICAgICAgICBpZiAodGhpcy54UGN0Lmxlbmd0aCArIHJhbmdlX2NvdW50ZXIgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICByYW5nZV9jb3VudGVyLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWJzX2Rpc3RhbmNlX2NvdW50ZXIgPSBhYnNfZGlzdGFuY2VfY291bnRlciArIHJlbF9yYW5nZV9kaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCByYW5nZSB0byBsYXN0IHJhbmdlIHdoZW4gZGlzdGFuY2UgYmVjb21lcyBvdXRzaWRlIG9mIG1heGltdW0gcmFuZ2VcbiAgICAgICAgICAgICAgICBpZiAodGhpcy54UGN0Lmxlbmd0aCAtIHJhbmdlX2NvdW50ZXIgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICByYW5nZV9jb3VudGVyKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVzdCBvZiByZWxhdGl2ZSBwZXJjZW50dWFsIGRpc3RhbmNlIHN0aWxsIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICAgICAgICAgIHJlc3RfcmVsX2Rpc3RhbmNlID0gZGlzdGFuY2VzW3hQY3RfaW5kZXggKyByYW5nZV9jb3VudGVyXSAqIHJlc3RfZmFjdG9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZSArIGFic19kaXN0YW5jZV9jb3VudGVyO1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLnRvU3RlcHBpbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSB0b1N0ZXBwaW5nKHRoaXMueFZhbCwgdGhpcy54UGN0LCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5mcm9tU3RlcHBpbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZyb21TdGVwcGluZyh0aGlzLnhWYWwsIHRoaXMueFBjdCwgdmFsdWUpO1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmdldFN0ZXAgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBnZXRTdGVwKHRoaXMueFBjdCwgdGhpcy54U3RlcHMsIHRoaXMuc25hcCwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZ2V0RGVmYXVsdFN0ZXAgPSBmdW5jdGlvbiAodmFsdWUsIGlzRG93biwgc2l6ZSkge1xuICAgICAgICB2YXIgaiA9IGdldEoodmFsdWUsIHRoaXMueFBjdCk7XG4gICAgICAgIC8vIFdoZW4gYXQgdGhlIHRvcCBvciBzdGVwcGluZyBkb3duLCBsb29rIGF0IHRoZSBwcmV2aW91cyBzdWItcmFuZ2VcbiAgICAgICAgaWYgKHZhbHVlID09PSAxMDAgfHwgKGlzRG93biAmJiB2YWx1ZSA9PT0gdGhpcy54UGN0W2ogLSAxXSkpIHtcbiAgICAgICAgICAgIGogPSBNYXRoLm1heChqIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLnhWYWxbal0gLSB0aGlzLnhWYWxbaiAtIDFdKSAvIHNpemU7XG4gICAgfTtcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZ2V0TmVhcmJ5U3RlcHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGogPSBnZXRKKHZhbHVlLCB0aGlzLnhQY3QpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RlcEJlZm9yZToge1xuICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHRoaXMueFZhbFtqIC0gMl0sXG4gICAgICAgICAgICAgICAgc3RlcDogdGhpcy54TnVtU3RlcHNbaiAtIDJdLFxuICAgICAgICAgICAgICAgIGhpZ2hlc3RTdGVwOiB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ogLSAyXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzU3RlcDoge1xuICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHRoaXMueFZhbFtqIC0gMV0sXG4gICAgICAgICAgICAgICAgc3RlcDogdGhpcy54TnVtU3RlcHNbaiAtIDFdLFxuICAgICAgICAgICAgICAgIGhpZ2hlc3RTdGVwOiB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ogLSAxXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGVwQWZ0ZXI6IHtcbiAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiB0aGlzLnhWYWxbal0sXG4gICAgICAgICAgICAgICAgc3RlcDogdGhpcy54TnVtU3RlcHNbal0sXG4gICAgICAgICAgICAgICAgaGlnaGVzdFN0ZXA6IHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbal0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmNvdW50U3RlcERlY2ltYWxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RlcERlY2ltYWxzID0gdGhpcy54TnVtU3RlcHMubWFwKGNvdW50RGVjaW1hbHMpO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgc3RlcERlY2ltYWxzKTtcbiAgICB9O1xuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5oYXNOb1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnhWYWxbMF0gPT09IHRoaXMueFZhbFt0aGlzLnhWYWwubGVuZ3RoIC0gMV07XG4gICAgfTtcbiAgICAvLyBPdXRzaWRlIHRlc3RpbmdcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuY29udmVydCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGVwKHRoaXMudG9TdGVwcGluZyh2YWx1ZSkpO1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmhhbmRsZUVudHJ5UG9pbnQgPSBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgIHZhciBwZXJjZW50YWdlO1xuICAgICAgICAvLyBDb3ZlcnQgbWluL21heCBzeW50YXggdG8gMCBhbmQgMTAwLlxuICAgICAgICBpZiAoaW5kZXggPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2UgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGluZGV4ID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGVyY2VudGFnZSA9IHBhcnNlRmxvYXQoaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvciBjb3JyZWN0IGlucHV0LlxuICAgICAgICBpZiAoIWlzTnVtZXJpYyhwZXJjZW50YWdlKSB8fCAhaXNOdW1lcmljKHZhbHVlWzBdKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3JhbmdlJyB2YWx1ZSBpc24ndCBudW1lcmljLlwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdG9yZSB2YWx1ZXMuXG4gICAgICAgIHRoaXMueFBjdC5wdXNoKHBlcmNlbnRhZ2UpO1xuICAgICAgICB0aGlzLnhWYWwucHVzaCh2YWx1ZVswXSk7XG4gICAgICAgIHZhciB2YWx1ZTEgPSBOdW1iZXIodmFsdWVbMV0pO1xuICAgICAgICAvLyBOYU4gd2lsbCBldmFsdWF0ZSB0byBmYWxzZSB0b28sIGJ1dCB0byBrZWVwXG4gICAgICAgIC8vIGxvZ2dpbmcgY2xlYXIsIHNldCBzdGVwIGV4cGxpY2l0bHkuIE1ha2Ugc3VyZVxuICAgICAgICAvLyBub3QgdG8gb3ZlcnJpZGUgdGhlICdzdGVwJyBzZXR0aW5nIHdpdGggZmFsc2UuXG4gICAgICAgIGlmICghcGVyY2VudGFnZSkge1xuICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZTEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy54U3RlcHNbMF0gPSB2YWx1ZTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnhTdGVwcy5wdXNoKGlzTmFOKHZhbHVlMSkgPyBmYWxzZSA6IHZhbHVlMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcC5wdXNoKDApO1xuICAgIH07XG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmhhbmRsZVN0ZXBQb2ludCA9IGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgIC8vIElnbm9yZSAnZmFsc2UnIHN0ZXBwaW5nLlxuICAgICAgICBpZiAoIW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGVwIG92ZXIgemVyby1sZW5ndGggcmFuZ2VzICgjOTQ4KTtcbiAgICAgICAgaWYgKHRoaXMueFZhbFtpXSA9PT0gdGhpcy54VmFsW2kgKyAxXSkge1xuICAgICAgICAgICAgdGhpcy54U3RlcHNbaV0gPSB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ldID0gdGhpcy54VmFsW2ldO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZhY3RvciB0byByYW5nZSByYXRpb1xuICAgICAgICB0aGlzLnhTdGVwc1tpXSA9XG4gICAgICAgICAgICBmcm9tUGVyY2VudGFnZShbdGhpcy54VmFsW2ldLCB0aGlzLnhWYWxbaSArIDFdXSwgbiwgMCkgLyBzdWJSYW5nZVJhdGlvKHRoaXMueFBjdFtpXSwgdGhpcy54UGN0W2kgKyAxXSk7XG4gICAgICAgIHZhciB0b3RhbFN0ZXBzID0gKHRoaXMueFZhbFtpICsgMV0gLSB0aGlzLnhWYWxbaV0pIC8gdGhpcy54TnVtU3RlcHNbaV07XG4gICAgICAgIHZhciBoaWdoZXN0U3RlcCA9IE1hdGguY2VpbChOdW1iZXIodG90YWxTdGVwcy50b0ZpeGVkKDMpKSAtIDEpO1xuICAgICAgICB2YXIgc3RlcCA9IHRoaXMueFZhbFtpXSArIHRoaXMueE51bVN0ZXBzW2ldICogaGlnaGVzdFN0ZXA7XG4gICAgICAgIHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbaV0gPSBzdGVwO1xuICAgIH07XG4gICAgcmV0dXJuIFNwZWN0cnVtO1xufSgpKTtcbi8vZW5kcmVnaW9uXG4vL3JlZ2lvbiBPcHRpb25zXG4vKlx0RXZlcnkgaW5wdXQgb3B0aW9uIGlzIHRlc3RlZCBhbmQgcGFyc2VkLiBUaGlzIHdpbGwgcHJldmVudFxuICAgIGVuZGxlc3MgdmFsaWRhdGlvbiBpbiBpbnRlcm5hbCBtZXRob2RzLiBUaGVzZSB0ZXN0cyBhcmVcbiAgICBzdHJ1Y3R1cmVkIHdpdGggYW4gaXRlbSBmb3IgZXZlcnkgb3B0aW9uIGF2YWlsYWJsZS4gQW5cbiAgICBvcHRpb24gY2FuIGJlIG1hcmtlZCBhcyByZXF1aXJlZCBieSBzZXR0aW5nIHRoZSAncicgZmxhZy5cbiAgICBUaGUgdGVzdGluZyBmdW5jdGlvbiBpcyBwcm92aWRlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAgICAgICAgLSBUaGUgcHJvdmlkZWQgdmFsdWUgZm9yIHRoZSBvcHRpb247XG4gICAgICAgIC0gQSByZWZlcmVuY2UgdG8gdGhlIG9wdGlvbnMgb2JqZWN0O1xuICAgICAgICAtIFRoZSBuYW1lIGZvciB0aGUgb3B0aW9uO1xuXG4gICAgVGhlIHRlc3RpbmcgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSB3aGVuIGFuIGVycm9yIGlzIGRldGVjdGVkLFxuICAgIG9yIHRydWUgd2hlbiBldmVyeXRoaW5nIGlzIE9LLiBJdCBjYW4gYWxzbyBtb2RpZnkgdGhlIG9wdGlvblxuICAgIG9iamVjdCwgdG8gbWFrZSBzdXJlIGFsbCB2YWx1ZXMgY2FuIGJlIGNvcnJlY3RseSBsb29wZWQgZWxzZXdoZXJlLiAqL1xuLy9yZWdpb24gRGVmYXVsdHNcbnZhciBkZWZhdWx0Rm9ybWF0dGVyID0ge1xuICAgIHRvOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyBcIlwiIDogdmFsdWUudG9GaXhlZCgyKTtcbiAgICB9LFxuICAgIGZyb206IE51bWJlcixcbn07XG52YXIgY3NzQ2xhc3NlcyA9IHtcbiAgICB0YXJnZXQ6IFwidGFyZ2V0XCIsXG4gICAgYmFzZTogXCJiYXNlXCIsXG4gICAgb3JpZ2luOiBcIm9yaWdpblwiLFxuICAgIGhhbmRsZTogXCJoYW5kbGVcIixcbiAgICBoYW5kbGVMb3dlcjogXCJoYW5kbGUtbG93ZXJcIixcbiAgICBoYW5kbGVVcHBlcjogXCJoYW5kbGUtdXBwZXJcIixcbiAgICB0b3VjaEFyZWE6IFwidG91Y2gtYXJlYVwiLFxuICAgIGhvcml6b250YWw6IFwiaG9yaXpvbnRhbFwiLFxuICAgIHZlcnRpY2FsOiBcInZlcnRpY2FsXCIsXG4gICAgYmFja2dyb3VuZDogXCJiYWNrZ3JvdW5kXCIsXG4gICAgY29ubmVjdDogXCJjb25uZWN0XCIsXG4gICAgY29ubmVjdHM6IFwiY29ubmVjdHNcIixcbiAgICBsdHI6IFwibHRyXCIsXG4gICAgcnRsOiBcInJ0bFwiLFxuICAgIHRleHREaXJlY3Rpb25MdHI6IFwidHh0LWRpci1sdHJcIixcbiAgICB0ZXh0RGlyZWN0aW9uUnRsOiBcInR4dC1kaXItcnRsXCIsXG4gICAgZHJhZ2dhYmxlOiBcImRyYWdnYWJsZVwiLFxuICAgIGRyYWc6IFwic3RhdGUtZHJhZ1wiLFxuICAgIHRhcDogXCJzdGF0ZS10YXBcIixcbiAgICBhY3RpdmU6IFwiYWN0aXZlXCIsXG4gICAgdG9vbHRpcDogXCJ0b29sdGlwXCIsXG4gICAgcGlwczogXCJwaXBzXCIsXG4gICAgcGlwc0hvcml6b250YWw6IFwicGlwcy1ob3Jpem9udGFsXCIsXG4gICAgcGlwc1ZlcnRpY2FsOiBcInBpcHMtdmVydGljYWxcIixcbiAgICBtYXJrZXI6IFwibWFya2VyXCIsXG4gICAgbWFya2VySG9yaXpvbnRhbDogXCJtYXJrZXItaG9yaXpvbnRhbFwiLFxuICAgIG1hcmtlclZlcnRpY2FsOiBcIm1hcmtlci12ZXJ0aWNhbFwiLFxuICAgIG1hcmtlck5vcm1hbDogXCJtYXJrZXItbm9ybWFsXCIsXG4gICAgbWFya2VyTGFyZ2U6IFwibWFya2VyLWxhcmdlXCIsXG4gICAgbWFya2VyU3ViOiBcIm1hcmtlci1zdWJcIixcbiAgICB2YWx1ZTogXCJ2YWx1ZVwiLFxuICAgIHZhbHVlSG9yaXpvbnRhbDogXCJ2YWx1ZS1ob3Jpem9udGFsXCIsXG4gICAgdmFsdWVWZXJ0aWNhbDogXCJ2YWx1ZS12ZXJ0aWNhbFwiLFxuICAgIHZhbHVlTm9ybWFsOiBcInZhbHVlLW5vcm1hbFwiLFxuICAgIHZhbHVlTGFyZ2U6IFwidmFsdWUtbGFyZ2VcIixcbiAgICB2YWx1ZVN1YjogXCJ2YWx1ZS1zdWJcIixcbn07XG4vLyBOYW1lc3BhY2VzIG9mIGludGVybmFsIGV2ZW50IGxpc3RlbmVyc1xudmFyIElOVEVSTkFMX0VWRU5UX05TID0ge1xuICAgIHRvb2x0aXBzOiBcIi5fX3Rvb2x0aXBzXCIsXG4gICAgYXJpYTogXCIuX19hcmlhXCIsXG59O1xuLy9lbmRyZWdpb25cbmZ1bmN0aW9uIHRlc3RTdGVwKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoIWlzTnVtZXJpYyhlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3N0ZXAnIGlzIG5vdCBudW1lcmljLlwiKTtcbiAgICB9XG4gICAgLy8gVGhlIHN0ZXAgb3B0aW9uIGNhbiBzdGlsbCBiZSB1c2VkIHRvIHNldCBzdGVwcGluZ1xuICAgIC8vIGZvciBsaW5lYXIgc2xpZGVycy4gT3ZlcndyaXR0ZW4gaWYgc2V0IGluICdyYW5nZScuXG4gICAgcGFyc2VkLnNpbmdsZVN0ZXAgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RLZXlib2FyZFBhZ2VNdWx0aXBsaWVyKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoIWlzTnVtZXJpYyhlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2tleWJvYXJkUGFnZU11bHRpcGxpZXInIGlzIG5vdCBudW1lcmljLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmtleWJvYXJkUGFnZU11bHRpcGxpZXIgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RLZXlib2FyZE11bHRpcGxpZXIocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICghaXNOdW1lcmljKGVudHJ5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAna2V5Ym9hcmRNdWx0aXBsaWVyJyBpcyBub3QgbnVtZXJpYy5cIik7XG4gICAgfVxuICAgIHBhcnNlZC5rZXlib2FyZE11bHRpcGxpZXIgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RLZXlib2FyZERlZmF1bHRTdGVwKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoIWlzTnVtZXJpYyhlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2tleWJvYXJkRGVmYXVsdFN0ZXAnIGlzIG5vdCBudW1lcmljLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmtleWJvYXJkRGVmYXVsdFN0ZXAgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RSYW5nZShwYXJzZWQsIGVudHJ5KSB7XG4gICAgLy8gRmlsdGVyIGluY29ycmVjdCBpbnB1dC5cbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoZW50cnkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdyYW5nZScgaXMgbm90IGFuIG9iamVjdC5cIik7XG4gICAgfVxuICAgIC8vIENhdGNoIG1pc3Npbmcgc3RhcnQgb3IgZW5kLlxuICAgIGlmIChlbnRyeS5taW4gPT09IHVuZGVmaW5lZCB8fCBlbnRyeS5tYXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiBNaXNzaW5nICdtaW4nIG9yICdtYXgnIGluICdyYW5nZScuXCIpO1xuICAgIH1cbiAgICBwYXJzZWQuc3BlY3RydW0gPSBuZXcgU3BlY3RydW0oZW50cnksIHBhcnNlZC5zbmFwIHx8IGZhbHNlLCBwYXJzZWQuc2luZ2xlU3RlcCk7XG59XG5mdW5jdGlvbiB0ZXN0U3RhcnQocGFyc2VkLCBlbnRyeSkge1xuICAgIGVudHJ5ID0gYXNBcnJheShlbnRyeSk7XG4gICAgLy8gVmFsaWRhdGUgaW5wdXQuIFZhbHVlcyBhcmVuJ3QgdGVzdGVkLCBhcyB0aGUgcHVibGljIC52YWwgbWV0aG9kXG4gICAgLy8gd2lsbCBhbHdheXMgcHJvdmlkZSBhIHZhbGlkIGxvY2F0aW9uLlxuICAgIGlmICghQXJyYXkuaXNBcnJheShlbnRyeSkgfHwgIWVudHJ5Lmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnc3RhcnQnIG9wdGlvbiBpcyBpbmNvcnJlY3QuXCIpO1xuICAgIH1cbiAgICAvLyBTdG9yZSB0aGUgbnVtYmVyIG9mIGhhbmRsZXMuXG4gICAgcGFyc2VkLmhhbmRsZXMgPSBlbnRyeS5sZW5ndGg7XG4gICAgLy8gV2hlbiB0aGUgc2xpZGVyIGlzIGluaXRpYWxpemVkLCB0aGUgLnZhbCBtZXRob2Qgd2lsbFxuICAgIC8vIGJlIGNhbGxlZCB3aXRoIHRoZSBzdGFydCBvcHRpb25zLlxuICAgIHBhcnNlZC5zdGFydCA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdFNuYXAocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdzbmFwJyBvcHRpb24gbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgIH1cbiAgICAvLyBFbmZvcmNlIDEwMCUgc3RlcHBpbmcgd2l0aGluIHN1YnJhbmdlcy5cbiAgICBwYXJzZWQuc25hcCA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdEFuaW1hdGUocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdhbmltYXRlJyBvcHRpb24gbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgIH1cbiAgICAvLyBFbmZvcmNlIDEwMCUgc3RlcHBpbmcgd2l0aGluIHN1YnJhbmdlcy5cbiAgICBwYXJzZWQuYW5pbWF0ZSA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdEFuaW1hdGlvbkR1cmF0aW9uKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdhbmltYXRpb25EdXJhdGlvbicgb3B0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuICAgIH1cbiAgICBwYXJzZWQuYW5pbWF0aW9uRHVyYXRpb24gPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RDb25uZWN0KHBhcnNlZCwgZW50cnkpIHtcbiAgICB2YXIgY29ubmVjdCA9IFtmYWxzZV07XG4gICAgdmFyIGk7XG4gICAgLy8gTWFwIGxlZ2FjeSBvcHRpb25zXG4gICAgaWYgKGVudHJ5ID09PSBcImxvd2VyXCIpIHtcbiAgICAgICAgZW50cnkgPSBbdHJ1ZSwgZmFsc2VdO1xuICAgIH1cbiAgICBlbHNlIGlmIChlbnRyeSA9PT0gXCJ1cHBlclwiKSB7XG4gICAgICAgIGVudHJ5ID0gW2ZhbHNlLCB0cnVlXTtcbiAgICB9XG4gICAgLy8gSGFuZGxlIGJvb2xlYW4gb3B0aW9uc1xuICAgIGlmIChlbnRyeSA9PT0gdHJ1ZSB8fCBlbnRyeSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IHBhcnNlZC5oYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbm5lY3QucHVzaChlbnRyeSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdC5wdXNoKGZhbHNlKTtcbiAgICB9XG4gICAgLy8gUmVqZWN0IGludmFsaWQgaW5wdXRcbiAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShlbnRyeSkgfHwgIWVudHJ5Lmxlbmd0aCB8fCBlbnRyeS5sZW5ndGggIT09IHBhcnNlZC5oYW5kbGVzICsgMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnY29ubmVjdCcgb3B0aW9uIGRvZXNuJ3QgbWF0Y2ggaGFuZGxlIGNvdW50LlwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbm5lY3QgPSBlbnRyeTtcbiAgICB9XG4gICAgcGFyc2VkLmNvbm5lY3QgPSBjb25uZWN0O1xufVxuZnVuY3Rpb24gdGVzdE9yaWVudGF0aW9uKHBhcnNlZCwgZW50cnkpIHtcbiAgICAvLyBTZXQgb3JpZW50YXRpb24gdG8gYW4gYSBudW1lcmljYWwgdmFsdWUgZm9yIGVhc3lcbiAgICAvLyBhcnJheSBzZWxlY3Rpb24uXG4gICAgc3dpdGNoIChlbnRyeSkge1xuICAgICAgICBjYXNlIFwiaG9yaXpvbnRhbFwiOlxuICAgICAgICAgICAgcGFyc2VkLm9ydCA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInZlcnRpY2FsXCI6XG4gICAgICAgICAgICBwYXJzZWQub3J0ID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ29yaWVudGF0aW9uJyBvcHRpb24gaXMgaW52YWxpZC5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gdGVzdE1hcmdpbihwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKCFpc051bWVyaWMoZW50cnkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdtYXJnaW4nIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO1xuICAgIH1cbiAgICAvLyBJc3N1ZSAjNTgyXG4gICAgaWYgKGVudHJ5ID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGFyc2VkLm1hcmdpbiA9IHBhcnNlZC5zcGVjdHJ1bS5nZXREaXN0YW5jZShlbnRyeSk7XG59XG5mdW5jdGlvbiB0ZXN0TGltaXQocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICghaXNOdW1lcmljKGVudHJ5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnbGltaXQnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO1xuICAgIH1cbiAgICBwYXJzZWQubGltaXQgPSBwYXJzZWQuc3BlY3RydW0uZ2V0RGlzdGFuY2UoZW50cnkpO1xuICAgIGlmICghcGFyc2VkLmxpbWl0IHx8IHBhcnNlZC5oYW5kbGVzIDwgMikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAnbGltaXQnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycyB3aXRoIDIgb3IgbW9yZSBoYW5kbGVzLlwiKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0ZXN0UGFkZGluZyhwYXJzZWQsIGVudHJ5KSB7XG4gICAgdmFyIGluZGV4O1xuICAgIGlmICghaXNOdW1lcmljKGVudHJ5KSAmJiAhQXJyYXkuaXNBcnJheShlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMgb3IgYXJyYXkgb2YgZXhhY3RseSAyIG51bWJlcnMuXCIpO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeSkgJiYgIShlbnRyeS5sZW5ndGggPT09IDIgfHwgaXNOdW1lcmljKGVudHJ5WzBdKSB8fCBpc051bWVyaWMoZW50cnlbMV0pKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7XG4gICAgfVxuICAgIGlmIChlbnRyeSA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheShlbnRyeSkpIHtcbiAgICAgICAgZW50cnkgPSBbZW50cnksIGVudHJ5XTtcbiAgICB9XG4gICAgLy8gJ2dldERpc3RhbmNlJyByZXR1cm5zIGZhbHNlIGZvciBpbnZhbGlkIHZhbHVlcy5cbiAgICBwYXJzZWQucGFkZGluZyA9IFtwYXJzZWQuc3BlY3RydW0uZ2V0RGlzdGFuY2UoZW50cnlbMF0pLCBwYXJzZWQuc3BlY3RydW0uZ2V0RGlzdGFuY2UoZW50cnlbMV0pXTtcbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBwYXJzZWQuc3BlY3RydW0ueE51bVN0ZXBzLmxlbmd0aCAtIDE7IGluZGV4KyspIHtcbiAgICAgICAgLy8gbGFzdCBcInJhbmdlXCIgY2FuJ3QgY29udGFpbiBzdGVwIHNpemUgYXMgaXQgaXMgcHVyZWx5IGFuIGVuZHBvaW50LlxuICAgICAgICBpZiAocGFyc2VkLnBhZGRpbmdbMF1baW5kZXhdIDwgMCB8fCBwYXJzZWQucGFkZGluZ1sxXVtpbmRleF0gPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIocykuXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciB0b3RhbFBhZGRpbmcgPSBlbnRyeVswXSArIGVudHJ5WzFdO1xuICAgIHZhciBmaXJzdFZhbHVlID0gcGFyc2VkLnNwZWN0cnVtLnhWYWxbMF07XG4gICAgdmFyIGxhc3RWYWx1ZSA9IHBhcnNlZC5zcGVjdHJ1bS54VmFsW3BhcnNlZC5zcGVjdHJ1bS54VmFsLmxlbmd0aCAtIDFdO1xuICAgIGlmICh0b3RhbFBhZGRpbmcgLyAobGFzdFZhbHVlIC0gZmlyc3RWYWx1ZSkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBub3QgZXhjZWVkIDEwMCUgb2YgdGhlIHJhbmdlLlwiKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0ZXN0RGlyZWN0aW9uKHBhcnNlZCwgZW50cnkpIHtcbiAgICAvLyBTZXQgZGlyZWN0aW9uIGFzIGEgbnVtZXJpY2FsIHZhbHVlIGZvciBlYXN5IHBhcnNpbmcuXG4gICAgLy8gSW52ZXJ0IGNvbm5lY3Rpb24gZm9yIFJUTCBzbGlkZXJzLCBzbyB0aGF0IHRoZSBwcm9wZXJcbiAgICAvLyBoYW5kbGVzIGdldCB0aGUgY29ubmVjdC9iYWNrZ3JvdW5kIGNsYXNzZXMuXG4gICAgc3dpdGNoIChlbnRyeSkge1xuICAgICAgICBjYXNlIFwibHRyXCI6XG4gICAgICAgICAgICBwYXJzZWQuZGlyID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicnRsXCI6XG4gICAgICAgICAgICBwYXJzZWQuZGlyID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2RpcmVjdGlvbicgb3B0aW9uIHdhcyBub3QgcmVjb2duaXplZC5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gdGVzdEJlaGF2aW91cihwYXJzZWQsIGVudHJ5KSB7XG4gICAgLy8gTWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBhIHN0cmluZy5cbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdiZWhhdmlvdXInIG11c3QgYmUgYSBzdHJpbmcgY29udGFpbmluZyBvcHRpb25zLlwiKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHN0cmluZyBjb250YWlucyBhbnkga2V5d29yZHMuXG4gICAgLy8gTm9uZSBhcmUgcmVxdWlyZWQuXG4gICAgdmFyIHRhcCA9IGVudHJ5LmluZGV4T2YoXCJ0YXBcIikgPj0gMDtcbiAgICB2YXIgZHJhZyA9IGVudHJ5LmluZGV4T2YoXCJkcmFnXCIpID49IDA7XG4gICAgdmFyIGZpeGVkID0gZW50cnkuaW5kZXhPZihcImZpeGVkXCIpID49IDA7XG4gICAgdmFyIHNuYXAgPSBlbnRyeS5pbmRleE9mKFwic25hcFwiKSA+PSAwO1xuICAgIHZhciBob3ZlciA9IGVudHJ5LmluZGV4T2YoXCJob3ZlclwiKSA+PSAwO1xuICAgIHZhciB1bmNvbnN0cmFpbmVkID0gZW50cnkuaW5kZXhPZihcInVuY29uc3RyYWluZWRcIikgPj0gMDtcbiAgICB2YXIgaW52ZXJ0Q29ubmVjdHMgPSBlbnRyeS5pbmRleE9mKFwiaW52ZXJ0LWNvbm5lY3RzXCIpID49IDA7XG4gICAgdmFyIGRyYWdBbGwgPSBlbnRyeS5pbmRleE9mKFwiZHJhZy1hbGxcIikgPj0gMDtcbiAgICB2YXIgc21vb3RoU3RlcHMgPSBlbnRyeS5pbmRleE9mKFwic21vb3RoLXN0ZXBzXCIpID49IDA7XG4gICAgaWYgKGZpeGVkKSB7XG4gICAgICAgIGlmIChwYXJzZWQuaGFuZGxlcyAhPT0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2ZpeGVkJyBiZWhhdmlvdXIgbXVzdCBiZSB1c2VkIHdpdGggMiBoYW5kbGVzXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZSBtYXJnaW4gdG8gZW5mb3JjZSBmaXhlZCBzdGF0ZVxuICAgICAgICB0ZXN0TWFyZ2luKHBhcnNlZCwgcGFyc2VkLnN0YXJ0WzFdIC0gcGFyc2VkLnN0YXJ0WzBdKTtcbiAgICB9XG4gICAgaWYgKGludmVydENvbm5lY3RzICYmIHBhcnNlZC5oYW5kbGVzICE9PSAyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6ICdpbnZlcnQtY29ubmVjdHMnIGJlaGF2aW91ciBtdXN0IGJlIHVzZWQgd2l0aCAyIGhhbmRsZXNcIik7XG4gICAgfVxuICAgIGlmICh1bmNvbnN0cmFpbmVkICYmIChwYXJzZWQubWFyZ2luIHx8IHBhcnNlZC5saW1pdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3VuY29uc3RyYWluZWQnIGJlaGF2aW91ciBjYW5ub3QgYmUgdXNlZCB3aXRoIG1hcmdpbiBvciBsaW1pdFwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmV2ZW50cyA9IHtcbiAgICAgICAgdGFwOiB0YXAgfHwgc25hcCxcbiAgICAgICAgZHJhZzogZHJhZyxcbiAgICAgICAgZHJhZ0FsbDogZHJhZ0FsbCxcbiAgICAgICAgc21vb3RoU3RlcHM6IHNtb290aFN0ZXBzLFxuICAgICAgICBmaXhlZDogZml4ZWQsXG4gICAgICAgIHNuYXA6IHNuYXAsXG4gICAgICAgIGhvdmVyOiBob3ZlcixcbiAgICAgICAgdW5jb25zdHJhaW5lZDogdW5jb25zdHJhaW5lZCxcbiAgICAgICAgaW52ZXJ0Q29ubmVjdHM6IGludmVydENvbm5lY3RzLFxuICAgIH07XG59XG5mdW5jdGlvbiB0ZXN0VG9vbHRpcHMocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmIChlbnRyeSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZW50cnkgPT09IHRydWUgfHwgaXNWYWxpZFBhcnRpYWxGb3JtYXR0ZXIoZW50cnkpKSB7XG4gICAgICAgIHBhcnNlZC50b29sdGlwcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnNlZC5oYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIHBhcnNlZC50b29sdGlwcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZW50cnkgPSBhc0FycmF5KGVudHJ5KTtcbiAgICAgICAgaWYgKGVudHJ5Lmxlbmd0aCAhPT0gcGFyc2VkLmhhbmRsZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXI6IG11c3QgcGFzcyBhIGZvcm1hdHRlciBmb3IgYWxsIGhhbmRsZXMuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVudHJ5LmZvckVhY2goZnVuY3Rpb24gKGZvcm1hdHRlcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXR0ZXIgIT09IFwiYm9vbGVhblwiICYmICFpc1ZhbGlkUGFydGlhbEZvcm1hdHRlcihmb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ3Rvb2x0aXBzJyBtdXN0IGJlIHBhc3NlZCBhIGZvcm1hdHRlciBvciAnZmFsc2UnLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcnNlZC50b29sdGlwcyA9IGVudHJ5O1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRlc3RIYW5kbGVBdHRyaWJ1dGVzKHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAoZW50cnkubGVuZ3RoICE9PSBwYXJzZWQuaGFuZGxlcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiBtdXN0IHBhc3MgYSBhdHRyaWJ1dGVzIGZvciBhbGwgaGFuZGxlcy5cIik7XG4gICAgfVxuICAgIHBhcnNlZC5oYW5kbGVBdHRyaWJ1dGVzID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0QXJpYUZvcm1hdChwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKCFpc1ZhbGlkUGFydGlhbEZvcm1hdHRlcihlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2FyaWFGb3JtYXQnIHJlcXVpcmVzICd0bycgbWV0aG9kLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmFyaWFGb3JtYXQgPSBlbnRyeTtcbn1cbmZ1bmN0aW9uIHRlc3RGb3JtYXQocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICghaXNWYWxpZEZvcm1hdHRlcihlbnRyeSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Zvcm1hdCcgcmVxdWlyZXMgJ3RvJyBhbmQgJ2Zyb20nIG1ldGhvZHMuXCIpO1xuICAgIH1cbiAgICBwYXJzZWQuZm9ybWF0ID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0S2V5Ym9hcmRTdXBwb3J0KHBhcnNlZCwgZW50cnkpIHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAna2V5Ym9hcmRTdXBwb3J0JyBvcHRpb24gbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgIH1cbiAgICBwYXJzZWQua2V5Ym9hcmRTdXBwb3J0ID0gZW50cnk7XG59XG5mdW5jdGlvbiB0ZXN0RG9jdW1lbnRFbGVtZW50KHBhcnNlZCwgZW50cnkpIHtcbiAgICAvLyBUaGlzIGlzIGFuIGFkdmFuY2VkIG9wdGlvbi4gUGFzc2VkIHZhbHVlcyBhcmUgdXNlZCB3aXRob3V0IHZhbGlkYXRpb24uXG4gICAgcGFyc2VkLmRvY3VtZW50RWxlbWVudCA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdENzc1ByZWZpeChwYXJzZWQsIGVudHJ5KSB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gXCJzdHJpbmdcIiAmJiBlbnRyeSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Nzc1ByZWZpeCcgbXVzdCBiZSBhIHN0cmluZyBvciBgZmFsc2VgLlwiKTtcbiAgICB9XG4gICAgcGFyc2VkLmNzc1ByZWZpeCA9IGVudHJ5O1xufVxuZnVuY3Rpb24gdGVzdENzc0NsYXNzZXMocGFyc2VkLCBlbnRyeSkge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ2Nzc0NsYXNzZXMnIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJzZWQuY3NzUHJlZml4ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHBhcnNlZC5jc3NDbGFzc2VzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKGVudHJ5KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHBhcnNlZC5jc3NDbGFzc2VzW2tleV0gPSBwYXJzZWQuY3NzUHJlZml4ICsgZW50cnlba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwYXJzZWQuY3NzQ2xhc3NlcyA9IGVudHJ5O1xuICAgIH1cbn1cbi8vIFRlc3QgYWxsIGRldmVsb3BlciBzZXR0aW5ncyBhbmQgcGFyc2UgdG8gYXNzdW1wdGlvbi1zYWZlIHZhbHVlcy5cbmZ1bmN0aW9uIHRlc3RPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAvLyBUbyBwcm92ZSBhIGZpeCBmb3IgIzUzNywgZnJlZXplIG9wdGlvbnMgaGVyZS5cbiAgICAvLyBJZiB0aGUgb2JqZWN0IGlzIG1vZGlmaWVkLCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAvLyBPYmplY3QuZnJlZXplKG9wdGlvbnMpO1xuICAgIHZhciBwYXJzZWQgPSB7XG4gICAgICAgIG1hcmdpbjogbnVsbCxcbiAgICAgICAgbGltaXQ6IG51bGwsXG4gICAgICAgIHBhZGRpbmc6IG51bGwsXG4gICAgICAgIGFuaW1hdGU6IHRydWUsXG4gICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAzMDAsXG4gICAgICAgIGFyaWFGb3JtYXQ6IGRlZmF1bHRGb3JtYXR0ZXIsXG4gICAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdHRlcixcbiAgICB9O1xuICAgIC8vIFRlc3RzIGFyZSBleGVjdXRlZCBpbiB0aGUgb3JkZXIgdGhleSBhcmUgcHJlc2VudGVkIGhlcmUuXG4gICAgdmFyIHRlc3RzID0ge1xuICAgICAgICBzdGVwOiB7IHI6IGZhbHNlLCB0OiB0ZXN0U3RlcCB9LFxuICAgICAgICBrZXlib2FyZFBhZ2VNdWx0aXBsaWVyOiB7IHI6IGZhbHNlLCB0OiB0ZXN0S2V5Ym9hcmRQYWdlTXVsdGlwbGllciB9LFxuICAgICAgICBrZXlib2FyZE11bHRpcGxpZXI6IHsgcjogZmFsc2UsIHQ6IHRlc3RLZXlib2FyZE11bHRpcGxpZXIgfSxcbiAgICAgICAga2V5Ym9hcmREZWZhdWx0U3RlcDogeyByOiBmYWxzZSwgdDogdGVzdEtleWJvYXJkRGVmYXVsdFN0ZXAgfSxcbiAgICAgICAgc3RhcnQ6IHsgcjogdHJ1ZSwgdDogdGVzdFN0YXJ0IH0sXG4gICAgICAgIGNvbm5lY3Q6IHsgcjogdHJ1ZSwgdDogdGVzdENvbm5lY3QgfSxcbiAgICAgICAgZGlyZWN0aW9uOiB7IHI6IHRydWUsIHQ6IHRlc3REaXJlY3Rpb24gfSxcbiAgICAgICAgc25hcDogeyByOiBmYWxzZSwgdDogdGVzdFNuYXAgfSxcbiAgICAgICAgYW5pbWF0ZTogeyByOiBmYWxzZSwgdDogdGVzdEFuaW1hdGUgfSxcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IHsgcjogZmFsc2UsIHQ6IHRlc3RBbmltYXRpb25EdXJhdGlvbiB9LFxuICAgICAgICByYW5nZTogeyByOiB0cnVlLCB0OiB0ZXN0UmFuZ2UgfSxcbiAgICAgICAgb3JpZW50YXRpb246IHsgcjogZmFsc2UsIHQ6IHRlc3RPcmllbnRhdGlvbiB9LFxuICAgICAgICBtYXJnaW46IHsgcjogZmFsc2UsIHQ6IHRlc3RNYXJnaW4gfSxcbiAgICAgICAgbGltaXQ6IHsgcjogZmFsc2UsIHQ6IHRlc3RMaW1pdCB9LFxuICAgICAgICBwYWRkaW5nOiB7IHI6IGZhbHNlLCB0OiB0ZXN0UGFkZGluZyB9LFxuICAgICAgICBiZWhhdmlvdXI6IHsgcjogdHJ1ZSwgdDogdGVzdEJlaGF2aW91ciB9LFxuICAgICAgICBhcmlhRm9ybWF0OiB7IHI6IGZhbHNlLCB0OiB0ZXN0QXJpYUZvcm1hdCB9LFxuICAgICAgICBmb3JtYXQ6IHsgcjogZmFsc2UsIHQ6IHRlc3RGb3JtYXQgfSxcbiAgICAgICAgdG9vbHRpcHM6IHsgcjogZmFsc2UsIHQ6IHRlc3RUb29sdGlwcyB9LFxuICAgICAgICBrZXlib2FyZFN1cHBvcnQ6IHsgcjogdHJ1ZSwgdDogdGVzdEtleWJvYXJkU3VwcG9ydCB9LFxuICAgICAgICBkb2N1bWVudEVsZW1lbnQ6IHsgcjogZmFsc2UsIHQ6IHRlc3REb2N1bWVudEVsZW1lbnQgfSxcbiAgICAgICAgY3NzUHJlZml4OiB7IHI6IHRydWUsIHQ6IHRlc3RDc3NQcmVmaXggfSxcbiAgICAgICAgY3NzQ2xhc3NlczogeyByOiB0cnVlLCB0OiB0ZXN0Q3NzQ2xhc3NlcyB9LFxuICAgICAgICBoYW5kbGVBdHRyaWJ1dGVzOiB7IHI6IGZhbHNlLCB0OiB0ZXN0SGFuZGxlQXR0cmlidXRlcyB9LFxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBjb25uZWN0OiBmYWxzZSxcbiAgICAgICAgZGlyZWN0aW9uOiBcImx0clwiLFxuICAgICAgICBiZWhhdmlvdXI6IFwidGFwXCIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBcImhvcml6b250YWxcIixcbiAgICAgICAga2V5Ym9hcmRTdXBwb3J0OiB0cnVlLFxuICAgICAgICBjc3NQcmVmaXg6IFwibm9VaS1cIixcbiAgICAgICAgY3NzQ2xhc3NlczogY3NzQ2xhc3NlcyxcbiAgICAgICAga2V5Ym9hcmRQYWdlTXVsdGlwbGllcjogNSxcbiAgICAgICAga2V5Ym9hcmRNdWx0aXBsaWVyOiAxLFxuICAgICAgICBrZXlib2FyZERlZmF1bHRTdGVwOiAxMCxcbiAgICB9O1xuICAgIC8vIEFyaWFGb3JtYXQgZGVmYXVsdHMgdG8gcmVndWxhciBmb3JtYXQsIGlmIGFueS5cbiAgICBpZiAob3B0aW9ucy5mb3JtYXQgJiYgIW9wdGlvbnMuYXJpYUZvcm1hdCkge1xuICAgICAgICBvcHRpb25zLmFyaWFGb3JtYXQgPSBvcHRpb25zLmZvcm1hdDtcbiAgICB9XG4gICAgLy8gUnVuIGFsbCBvcHRpb25zIHRocm91Z2ggYSB0ZXN0aW5nIG1lY2hhbmlzbSB0byBlbnN1cmUgY29ycmVjdFxuICAgIC8vIGlucHV0LiBJdCBzaG91bGQgYmUgbm90ZWQgdGhhdCBvcHRpb25zIG1pZ2h0IGdldCBtb2RpZmllZCB0b1xuICAgIC8vIGJlIGhhbmRsZWQgcHJvcGVybHkuIEUuZy4gd3JhcHBpbmcgaW50ZWdlcnMgaW4gYXJyYXlzLlxuICAgIE9iamVjdC5rZXlzKHRlc3RzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIC8vIElmIHRoZSBvcHRpb24gaXNuJ3Qgc2V0LCBidXQgaXQgaXMgcmVxdWlyZWQsIHRocm93IGFuIGVycm9yLlxuICAgICAgICBpZiAoIWlzU2V0KG9wdGlvbnNbbmFtZV0pICYmIGRlZmF1bHRzW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0ZXN0c1tuYW1lXS5yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogJ1wiICsgbmFtZSArIFwiJyBpcyByZXF1aXJlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGVzdHNbbmFtZV0udChwYXJzZWQsICFpc1NldChvcHRpb25zW25hbWVdKSA/IGRlZmF1bHRzW25hbWVdIDogb3B0aW9uc1tuYW1lXSk7XG4gICAgfSk7XG4gICAgLy8gRm9yd2FyZCBwaXBzIG9wdGlvbnNcbiAgICBwYXJzZWQucGlwcyA9IG9wdGlvbnMucGlwcztcbiAgICAvLyBBbGwgcmVjZW50IGJyb3dzZXJzIGFjY2VwdCB1bnByZWZpeGVkIHRyYW5zZm9ybS5cbiAgICAvLyBXZSBuZWVkIC1tcy0gZm9yIElFOSBhbmQgLXdlYmtpdC0gZm9yIG9sZGVyIEFuZHJvaWQ7XG4gICAgLy8gQXNzdW1lIHVzZSBvZiAtd2Via2l0LSBpZiB1bnByZWZpeGVkIGFuZCAtbXMtIGFyZSBub3Qgc3VwcG9ydGVkLlxuICAgIC8vIGh0dHBzOi8vY2FuaXVzZS5jb20vI2ZlYXQ9dHJhbnNmb3JtczJkXG4gICAgdmFyIGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHZhciBtc1ByZWZpeCA9IGQuc3R5bGUubXNUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgbm9QcmVmaXggPSBkLnN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkO1xuICAgIHBhcnNlZC50cmFuc2Zvcm1SdWxlID0gbm9QcmVmaXggPyBcInRyYW5zZm9ybVwiIDogbXNQcmVmaXggPyBcIm1zVHJhbnNmb3JtXCIgOiBcIndlYmtpdFRyYW5zZm9ybVwiO1xuICAgIC8vIFBpcHMgZG9uJ3QgbW92ZSwgc28gd2UgY2FuIHBsYWNlIHRoZW0gdXNpbmcgbGVmdC90b3AuXG4gICAgdmFyIHN0eWxlcyA9IFtcbiAgICAgICAgW1wibGVmdFwiLCBcInRvcFwiXSxcbiAgICAgICAgW1wicmlnaHRcIiwgXCJib3R0b21cIl0sXG4gICAgXTtcbiAgICBwYXJzZWQuc3R5bGUgPSBzdHlsZXNbcGFyc2VkLmRpcl1bcGFyc2VkLm9ydF07XG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cbi8vZW5kcmVnaW9uXG5mdW5jdGlvbiBzY29wZSh0YXJnZXQsIG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucykge1xuICAgIHZhciBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIHZhciBzdXBwb3J0c1RvdWNoQWN0aW9uTm9uZSA9IGdldFN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lKCk7XG4gICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IHN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lICYmIGdldFN1cHBvcnRzUGFzc2l2ZSgpO1xuICAgIC8vIEFsbCB2YXJpYWJsZXMgbG9jYWwgdG8gJ3Njb3BlJyBhcmUgcHJlZml4ZWQgd2l0aCAnc2NvcGVfJ1xuICAgIC8vIFNsaWRlciBET00gTm9kZXNcbiAgICB2YXIgc2NvcGVfVGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHZhciBzY29wZV9CYXNlO1xuICAgIHZhciBzY29wZV9Db25uZWN0QmFzZTtcbiAgICB2YXIgc2NvcGVfSGFuZGxlcztcbiAgICB2YXIgc2NvcGVfQ29ubmVjdHM7XG4gICAgdmFyIHNjb3BlX1BpcHM7XG4gICAgdmFyIHNjb3BlX1Rvb2x0aXBzO1xuICAgIC8vIFNsaWRlciBzdGF0ZSB2YWx1ZXNcbiAgICB2YXIgc2NvcGVfU3BlY3RydW0gPSBvcHRpb25zLnNwZWN0cnVtO1xuICAgIHZhciBzY29wZV9WYWx1ZXMgPSBbXTtcbiAgICB2YXIgc2NvcGVfTG9jYXRpb25zID0gW107XG4gICAgdmFyIHNjb3BlX0hhbmRsZU51bWJlcnMgPSBbXTtcbiAgICB2YXIgc2NvcGVfQWN0aXZlSGFuZGxlc0NvdW50ID0gMDtcbiAgICB2YXIgc2NvcGVfRXZlbnRzID0ge307XG4gICAgdmFyIHNjb3BlX0Nvbm5lY3RzSW52ZXJ0ZWQgPSBmYWxzZTtcbiAgICAvLyBEb2N1bWVudCBOb2Rlc1xuICAgIHZhciBzY29wZV9Eb2N1bWVudCA9IHRhcmdldC5vd25lckRvY3VtZW50O1xuICAgIHZhciBzY29wZV9Eb2N1bWVudEVsZW1lbnQgPSBvcHRpb25zLmRvY3VtZW50RWxlbWVudCB8fCBzY29wZV9Eb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdmFyIHNjb3BlX0JvZHkgPSBzY29wZV9Eb2N1bWVudC5ib2R5O1xuICAgIC8vIEZvciBob3Jpem9udGFsIHNsaWRlcnMgaW4gc3RhbmRhcmQgbHRyIGRvY3VtZW50cyxcbiAgICAvLyBtYWtlIC5ub1VpLW9yaWdpbiBvdmVyZmxvdyB0byB0aGUgbGVmdCBzbyB0aGUgZG9jdW1lbnQgZG9lc24ndCBzY3JvbGwuXG4gICAgdmFyIHNjb3BlX0Rpck9mZnNldCA9IHNjb3BlX0RvY3VtZW50LmRpciA9PT0gXCJydGxcIiB8fCBvcHRpb25zLm9ydCA9PT0gMSA/IDAgOiAxMDA7XG4gICAgLy8gQ3JlYXRlcyBhIG5vZGUsIGFkZHMgaXQgdG8gdGFyZ2V0LCByZXR1cm5zIHRoZSBuZXcgbm9kZS5cbiAgICBmdW5jdGlvbiBhZGROb2RlVG8oYWRkVGFyZ2V0LCBjbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGRpdiA9IHNjb3BlX0RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGRpdiwgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBhZGRUYXJnZXQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG4gICAgLy8gQXBwZW5kIGEgb3JpZ2luIHRvIHRoZSBiYXNlXG4gICAgZnVuY3Rpb24gYWRkT3JpZ2luKGJhc2UsIGhhbmRsZU51bWJlcikge1xuICAgICAgICB2YXIgb3JpZ2luID0gYWRkTm9kZVRvKGJhc2UsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5vcmlnaW4pO1xuICAgICAgICB2YXIgaGFuZGxlID0gYWRkTm9kZVRvKG9yaWdpbiwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZSk7XG4gICAgICAgIGFkZE5vZGVUbyhoYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50b3VjaEFyZWEpO1xuICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oYW5kbGVcIiwgU3RyaW5nKGhhbmRsZU51bWJlcikpO1xuICAgICAgICBpZiAob3B0aW9ucy5rZXlib2FyZFN1cHBvcnQpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvR2xvYmFsX2F0dHJpYnV0ZXMvdGFiaW5kZXhcbiAgICAgICAgICAgIC8vIDAgPSBmb2N1c2FibGUgYW5kIHJlYWNoYWJsZVxuICAgICAgICAgICAgaGFuZGxlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRLZXlkb3duKGV2ZW50LCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaGFuZGxlQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlc18xID0gb3B0aW9ucy5oYW5kbGVBdHRyaWJ1dGVzW2hhbmRsZU51bWJlcl07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzXzEpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhdHRyaWJ1dGVzXzFbYXR0cmlidXRlXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInNsaWRlclwiKTtcbiAgICAgICAgaGFuZGxlLnNldEF0dHJpYnV0ZShcImFyaWEtb3JpZW50YXRpb25cIiwgb3B0aW9ucy5vcnQgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIik7XG4gICAgICAgIGlmIChoYW5kbGVOdW1iZXIgPT09IDApIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGhhbmRsZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZUxvd2VyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChoYW5kbGVOdW1iZXIgPT09IG9wdGlvbnMuaGFuZGxlcyAtIDEpIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGhhbmRsZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZVVwcGVyKTtcbiAgICAgICAgfVxuICAgICAgICBvcmlnaW4uaGFuZGxlID0gaGFuZGxlO1xuICAgICAgICByZXR1cm4gb3JpZ2luO1xuICAgIH1cbiAgICAvLyBJbnNlcnQgbm9kZXMgZm9yIGNvbm5lY3QgZWxlbWVudHNcbiAgICBmdW5jdGlvbiBhZGRDb25uZWN0KGJhc2UsIGFkZCkge1xuICAgICAgICBpZiAoIWFkZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGROb2RlVG8oYmFzZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmNvbm5lY3QpO1xuICAgIH1cbiAgICAvLyBBZGQgaGFuZGxlcyB0byB0aGUgc2xpZGVyIGJhc2UuXG4gICAgZnVuY3Rpb24gYWRkRWxlbWVudHMoY29ubmVjdE9wdGlvbnMsIGJhc2UpIHtcbiAgICAgICAgc2NvcGVfQ29ubmVjdEJhc2UgPSBhZGROb2RlVG8oYmFzZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmNvbm5lY3RzKTtcbiAgICAgICAgc2NvcGVfSGFuZGxlcyA9IFtdO1xuICAgICAgICBzY29wZV9Db25uZWN0cyA9IFtdO1xuICAgICAgICBzY29wZV9Db25uZWN0cy5wdXNoKGFkZENvbm5lY3Qoc2NvcGVfQ29ubmVjdEJhc2UsIGNvbm5lY3RPcHRpb25zWzBdKSk7XG4gICAgICAgIC8vIFs6Ojo6Tz09PT1PPT09PU89PT09XVxuICAgICAgICAvLyBjb25uZWN0T3B0aW9ucyA9IFswLCAxLCAxLCAxXVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMuaGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgICAvLyBLZWVwIGEgbGlzdCBvZiBhbGwgYWRkZWQgaGFuZGxlcy5cbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXMucHVzaChhZGRPcmlnaW4oYmFzZSwgaSkpO1xuICAgICAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVyc1tpXSA9IGk7XG4gICAgICAgICAgICBzY29wZV9Db25uZWN0cy5wdXNoKGFkZENvbm5lY3Qoc2NvcGVfQ29ubmVjdEJhc2UsIGNvbm5lY3RPcHRpb25zW2kgKyAxXSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgYSBzaW5nbGUgc2xpZGVyLlxuICAgIGZ1bmN0aW9uIGFkZFNsaWRlcihhZGRUYXJnZXQpIHtcbiAgICAgICAgLy8gQXBwbHkgY2xhc3NlcyBhbmQgZGF0YSB0byB0aGUgdGFyZ2V0LlxuICAgICAgICBhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50YXJnZXQpO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXIgPT09IDApIHtcbiAgICAgICAgICAgIGFkZENsYXNzKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLmx0cik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5ydGwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLm9ydCA9PT0gMCkge1xuICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMuaG9yaXpvbnRhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy52ZXJ0aWNhbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRleHREaXJlY3Rpb24gPSBnZXRDb21wdXRlZFN0eWxlKGFkZFRhcmdldCkuZGlyZWN0aW9uO1xuICAgICAgICBpZiAodGV4dERpcmVjdGlvbiA9PT0gXCJydGxcIikge1xuICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGV4dERpcmVjdGlvblJ0bCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50ZXh0RGlyZWN0aW9uTHRyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkTm9kZVRvKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLmJhc2UpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRUb29sdGlwKGhhbmRsZSwgaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy50b29sdGlwcyB8fCAhb3B0aW9ucy50b29sdGlwc1toYW5kbGVOdW1iZXJdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFkZE5vZGVUbyhoYW5kbGUuZmlyc3RDaGlsZCwgb3B0aW9ucy5jc3NDbGFzc2VzLnRvb2x0aXApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1NsaWRlckRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gc2NvcGVfVGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgIH1cbiAgICAvLyBEaXNhYmxlIHRoZSBzbGlkZXIgZHJhZ2dpbmcgaWYgYW55IGhhbmRsZSBpcyBkaXNhYmxlZFxuICAgIGZ1bmN0aW9uIGlzSGFuZGxlRGlzYWJsZWQoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIHZhciBoYW5kbGVPcmlnaW4gPSBzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl07XG4gICAgICAgIHJldHVybiBoYW5kbGVPcmlnaW4uaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpc2FibGUoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIGlmIChoYW5kbGVOdW1iZXIgIT09IG51bGwgJiYgaGFuZGxlTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5oYW5kbGUucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzY29wZV9UYXJnZXQuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZS5oYW5kbGUucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBlbmFibGUoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIGlmIChoYW5kbGVOdW1iZXIgIT09IG51bGwgJiYgaGFuZGxlTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5oYW5kbGUuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2NvcGVfVGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgc2NvcGVfSGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGUucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgaGFuZGxlLmhhbmRsZS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVUb29sdGlwcygpIHtcbiAgICAgICAgaWYgKHNjb3BlX1Rvb2x0aXBzKSB7XG4gICAgICAgICAgICByZW1vdmVFdmVudChcInVwZGF0ZVwiICsgSU5URVJOQUxfRVZFTlRfTlMudG9vbHRpcHMpO1xuICAgICAgICAgICAgc2NvcGVfVG9vbHRpcHMuZm9yRWFjaChmdW5jdGlvbiAodG9vbHRpcCkge1xuICAgICAgICAgICAgICAgIGlmICh0b29sdGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUVsZW1lbnQodG9vbHRpcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzY29wZV9Ub29sdGlwcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVGhlIHRvb2x0aXBzIG9wdGlvbiBpcyBhIHNob3J0aGFuZCBmb3IgdXNpbmcgdGhlICd1cGRhdGUnIGV2ZW50LlxuICAgIGZ1bmN0aW9uIHRvb2x0aXBzKCkge1xuICAgICAgICByZW1vdmVUb29sdGlwcygpO1xuICAgICAgICAvLyBUb29sdGlwcyBhcmUgYWRkZWQgd2l0aCBvcHRpb25zLnRvb2x0aXBzIGluIG9yaWdpbmFsIG9yZGVyLlxuICAgICAgICBzY29wZV9Ub29sdGlwcyA9IHNjb3BlX0hhbmRsZXMubWFwKGFkZFRvb2x0aXApO1xuICAgICAgICBiaW5kRXZlbnQoXCJ1cGRhdGVcIiArIElOVEVSTkFMX0VWRU5UX05TLnRvb2x0aXBzLCBmdW5jdGlvbiAodmFsdWVzLCBoYW5kbGVOdW1iZXIsIHVuZW5jb2RlZCkge1xuICAgICAgICAgICAgaWYgKCFzY29wZV9Ub29sdGlwcyB8fCAhb3B0aW9ucy50b29sdGlwcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzY29wZV9Ub29sdGlwc1toYW5kbGVOdW1iZXJdID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlc1toYW5kbGVOdW1iZXJdO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMudG9vbHRpcHNbaGFuZGxlTnVtYmVyXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlID0gb3B0aW9ucy50b29sdGlwc1toYW5kbGVOdW1iZXJdLnRvKHVuZW5jb2RlZFtoYW5kbGVOdW1iZXJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjb3BlX1Rvb2x0aXBzW2hhbmRsZU51bWJlcl0uaW5uZXJIVE1MID0gZm9ybWF0dGVkVmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhcmlhKCkge1xuICAgICAgICByZW1vdmVFdmVudChcInVwZGF0ZVwiICsgSU5URVJOQUxfRVZFTlRfTlMuYXJpYSk7XG4gICAgICAgIGJpbmRFdmVudChcInVwZGF0ZVwiICsgSU5URVJOQUxfRVZFTlRfTlMuYXJpYSwgZnVuY3Rpb24gKHZhbHVlcywgaGFuZGxlTnVtYmVyLCB1bmVuY29kZWQsIHRhcCwgcG9zaXRpb25zKSB7XG4gICAgICAgICAgICAvLyBVcGRhdGUgQXJpYSBWYWx1ZXMgZm9yIGFsbCBoYW5kbGVzLCBhcyBhIGNoYW5nZSBpbiBvbmUgY2hhbmdlcyBtaW4gYW5kIG1heCB2YWx1ZXMgZm9yIHRoZSBuZXh0LlxuICAgICAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGUgPSBzY29wZV9IYW5kbGVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgbWluID0gY2hlY2tIYW5kbGVQb3NpdGlvbihzY29wZV9Mb2NhdGlvbnMsIGluZGV4LCAwLCB0cnVlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIgbWF4ID0gY2hlY2tIYW5kbGVQb3NpdGlvbihzY29wZV9Mb2NhdGlvbnMsIGluZGV4LCAxMDAsIHRydWUsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIHZhciBub3cgPSBwb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIC8vIEZvcm1hdHRlZCB2YWx1ZSBmb3IgZGlzcGxheVxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gU3RyaW5nKG9wdGlvbnMuYXJpYUZvcm1hdC50byh1bmVuY29kZWRbaW5kZXhdKSk7XG4gICAgICAgICAgICAgICAgLy8gTWFwIHRvIHNsaWRlciByYW5nZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICBtaW4gPSBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcobWluKS50b0ZpeGVkKDEpO1xuICAgICAgICAgICAgICAgIG1heCA9IHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyhtYXgpLnRvRml4ZWQoMSk7XG4gICAgICAgICAgICAgICAgbm93ID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKG5vdykudG9GaXhlZCgxKTtcbiAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1pblwiLCBtaW4pO1xuICAgICAgICAgICAgICAgIGhhbmRsZS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbWF4XCIsIG1heCk7XG4gICAgICAgICAgICAgICAgaGFuZGxlLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIiwgbm93KTtcbiAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZXRleHRcIiwgdGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEdyb3VwKHBpcHMpIHtcbiAgICAgICAgLy8gVXNlIHRoZSByYW5nZS5cbiAgICAgICAgaWYgKHBpcHMubW9kZSA9PT0gUGlwc01vZGUuUmFuZ2UgfHwgcGlwcy5tb2RlID09PSBQaXBzTW9kZS5TdGVwcykge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlX1NwZWN0cnVtLnhWYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBpcHMubW9kZSA9PT0gUGlwc01vZGUuQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChwaXBzLnZhbHVlcyA8IDIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiAndmFsdWVzJyAoPj0gMikgcmVxdWlyZWQgZm9yIG1vZGUgJ2NvdW50Jy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEaXZpZGUgMCAtIDEwMCBpbiAnY291bnQnIHBhcnRzLlxuICAgICAgICAgICAgdmFyIGludGVydmFsID0gcGlwcy52YWx1ZXMgLSAxO1xuICAgICAgICAgICAgdmFyIHNwcmVhZCA9IDEwMCAvIGludGVydmFsO1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgLy8gTGlzdCB0aGVzZSBwYXJ0cyBhbmQgaGF2ZSB0aGVtIGhhbmRsZWQgYXMgJ3Bvc2l0aW9ucycuXG4gICAgICAgICAgICB3aGlsZSAoaW50ZXJ2YWwtLSkge1xuICAgICAgICAgICAgICAgIHZhbHVlc1tpbnRlcnZhbF0gPSBpbnRlcnZhbCAqIHNwcmVhZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKDEwMCk7XG4gICAgICAgICAgICByZXR1cm4gbWFwVG9SYW5nZSh2YWx1ZXMsIHBpcHMuc3RlcHBlZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBpcHMubW9kZSA9PT0gUGlwc01vZGUuUG9zaXRpb25zKSB7XG4gICAgICAgICAgICAvLyBNYXAgYWxsIHBlcmNlbnRhZ2VzIHRvIG9uLXJhbmdlIHZhbHVlcy5cbiAgICAgICAgICAgIHJldHVybiBtYXBUb1JhbmdlKHBpcHMudmFsdWVzLCBwaXBzLnN0ZXBwZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwaXBzLm1vZGUgPT09IFBpcHNNb2RlLlZhbHVlcykge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHZhbHVlIG11c3QgYmUgc3RlcHBlZCwgaXQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgcGVyY2VudGFnZSBmaXJzdC5cbiAgICAgICAgICAgIGlmIChwaXBzLnN0ZXBwZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGlwcy52YWx1ZXMubWFwKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRvIHBlcmNlbnRhZ2UsIGFwcGx5IHN0ZXAsIHJldHVybiB0byB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyhzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKHNjb3BlX1NwZWN0cnVtLnRvU3RlcHBpbmcodmFsdWUpKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGNhbiBzaW1wbHkgdXNlIHRoZSB2YWx1ZXMuXG4gICAgICAgICAgICByZXR1cm4gcGlwcy52YWx1ZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdOyAvLyBwaXBzLm1vZGUgPSBuZXZlclxuICAgIH1cbiAgICBmdW5jdGlvbiBtYXBUb1JhbmdlKHZhbHVlcywgc3RlcHBlZCkge1xuICAgICAgICByZXR1cm4gdmFsdWVzLm1hcChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcoc3RlcHBlZCA/IHNjb3BlX1NwZWN0cnVtLmdldFN0ZXAodmFsdWUpIDogdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTcHJlYWQocGlwcykge1xuICAgICAgICBmdW5jdGlvbiBzYWZlSW5jcmVtZW50KHZhbHVlLCBpbmNyZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIEF2b2lkIGZsb2F0aW5nIHBvaW50IHZhcmlhbmNlIGJ5IGRyb3BwaW5nIHRoZSBzbWFsbGVzdCBkZWNpbWFsIHBsYWNlcy5cbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoKHZhbHVlICsgaW5jcmVtZW50KS50b0ZpeGVkKDcpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ3JvdXAgPSBnZXRHcm91cChwaXBzKTtcbiAgICAgICAgdmFyIGluZGV4ZXMgPSB7fTtcbiAgICAgICAgdmFyIGZpcnN0SW5SYW5nZSA9IHNjb3BlX1NwZWN0cnVtLnhWYWxbMF07XG4gICAgICAgIHZhciBsYXN0SW5SYW5nZSA9IHNjb3BlX1NwZWN0cnVtLnhWYWxbc2NvcGVfU3BlY3RydW0ueFZhbC5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIGlnbm9yZUZpcnN0ID0gZmFsc2U7XG4gICAgICAgIHZhciBpZ25vcmVMYXN0ID0gZmFsc2U7XG4gICAgICAgIHZhciBwcmV2UGN0ID0gMDtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgZ3JvdXAsIHNvcnQgaXQgYW5kIGZpbHRlciBhd2F5IGFsbCBkdXBsaWNhdGVzLlxuICAgICAgICBncm91cCA9IHVuaXF1ZShncm91cC5zbGljZSgpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgfSkpO1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHJhbmdlIHN0YXJ0cyB3aXRoIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgICAgICBpZiAoZ3JvdXBbMF0gIT09IGZpcnN0SW5SYW5nZSkge1xuICAgICAgICAgICAgZ3JvdXAudW5zaGlmdChmaXJzdEluUmFuZ2UpO1xuICAgICAgICAgICAgaWdub3JlRmlyc3QgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIExpa2V3aXNlIGZvciB0aGUgbGFzdCBvbmUuXG4gICAgICAgIGlmIChncm91cFtncm91cC5sZW5ndGggLSAxXSAhPT0gbGFzdEluUmFuZ2UpIHtcbiAgICAgICAgICAgIGdyb3VwLnB1c2gobGFzdEluUmFuZ2UpO1xuICAgICAgICAgICAgaWdub3JlTGFzdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXAuZm9yRWFjaChmdW5jdGlvbiAoY3VycmVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBzdGVwIGFuZCB0aGUgbG93ZXIgKyB1cHBlciBwb3NpdGlvbnMuXG4gICAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIHE7XG4gICAgICAgICAgICB2YXIgbG93ID0gY3VycmVudDtcbiAgICAgICAgICAgIHZhciBoaWdoID0gZ3JvdXBbaW5kZXggKyAxXTtcbiAgICAgICAgICAgIHZhciBuZXdQY3Q7XG4gICAgICAgICAgICB2YXIgcGN0RGlmZmVyZW5jZTtcbiAgICAgICAgICAgIHZhciBwY3RQb3M7XG4gICAgICAgICAgICB2YXIgdHlwZTtcbiAgICAgICAgICAgIHZhciBzdGVwcztcbiAgICAgICAgICAgIHZhciByZWFsU3RlcHM7XG4gICAgICAgICAgICB2YXIgc3RlcFNpemU7XG4gICAgICAgICAgICB2YXIgaXNTdGVwcyA9IHBpcHMubW9kZSA9PT0gUGlwc01vZGUuU3RlcHM7XG4gICAgICAgICAgICAvLyBXaGVuIHVzaW5nICdzdGVwcycgbW9kZSwgdXNlIHRoZSBwcm92aWRlZCBzdGVwcy5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UnbGwgc3RlcCBvbiB0byB0aGUgbmV4dCBzdWJyYW5nZS5cbiAgICAgICAgICAgIGlmIChpc1N0ZXBzKSB7XG4gICAgICAgICAgICAgICAgc3RlcCA9IHNjb3BlX1NwZWN0cnVtLnhOdW1TdGVwc1tpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGEgJ2Z1bGwnIHN0ZXAuXG4gICAgICAgICAgICBpZiAoIXN0ZXApIHtcbiAgICAgICAgICAgICAgICBzdGVwID0gaGlnaCAtIGxvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIGhpZ2ggaXMgdW5kZWZpbmVkIHdlIGFyZSBhdCB0aGUgbGFzdCBzdWJyYW5nZS4gTWFrZSBzdXJlIGl0IGl0ZXJhdGVzIG9uY2UgKCMxMDg4KVxuICAgICAgICAgICAgaWYgKGhpZ2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGhpZ2ggPSBsb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgc3RlcCBpc24ndCAwLCB3aGljaCB3b3VsZCBjYXVzZSBhbiBpbmZpbml0ZSBsb29wICgjNjU0KVxuICAgICAgICAgICAgc3RlcCA9IE1hdGgubWF4KHN0ZXAsIDAuMDAwMDAwMSk7XG4gICAgICAgICAgICAvLyBGaW5kIGFsbCBzdGVwcyBpbiB0aGUgc3VicmFuZ2UuXG4gICAgICAgICAgICBmb3IgKGkgPSBsb3c7IGkgPD0gaGlnaDsgaSA9IHNhZmVJbmNyZW1lbnQoaSwgc3RlcCkpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHBlcmNlbnRhZ2UgdmFsdWUgZm9yIHRoZSBjdXJyZW50IHN0ZXAsXG4gICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBzaXplIGZvciB0aGUgc3VicmFuZ2UuXG4gICAgICAgICAgICAgICAgbmV3UGN0ID0gc2NvcGVfU3BlY3RydW0udG9TdGVwcGluZyhpKTtcbiAgICAgICAgICAgICAgICBwY3REaWZmZXJlbmNlID0gbmV3UGN0IC0gcHJldlBjdDtcbiAgICAgICAgICAgICAgICBzdGVwcyA9IHBjdERpZmZlcmVuY2UgLyAocGlwcy5kZW5zaXR5IHx8IDEpO1xuICAgICAgICAgICAgICAgIHJlYWxTdGVwcyA9IE1hdGgucm91bmQoc3RlcHMpO1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgcmF0aW8gcmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHBlcmNlbnRhZ2Utc3BhY2UgYSBwb2ludCBpbmRpY2F0ZXMuXG4gICAgICAgICAgICAgICAgLy8gRm9yIGEgZGVuc2l0eSAxIHRoZSBwb2ludHMvcGVyY2VudGFnZSA9IDEuIEZvciBkZW5zaXR5IDIsIHRoYXQgcGVyY2VudGFnZSBuZWVkcyB0byBiZSByZS1kaXZpZGVkLlxuICAgICAgICAgICAgICAgIC8vIFJvdW5kIHRoZSBwZXJjZW50YWdlIG9mZnNldCB0byBhbiBldmVuIG51bWJlciwgdGhlbiBkaXZpZGUgYnkgdHdvXG4gICAgICAgICAgICAgICAgLy8gdG8gc3ByZWFkIHRoZSBvZmZzZXQgb24gYm90aCBzaWRlcyBvZiB0aGUgcmFuZ2UuXG4gICAgICAgICAgICAgICAgc3RlcFNpemUgPSBwY3REaWZmZXJlbmNlIC8gcmVhbFN0ZXBzO1xuICAgICAgICAgICAgICAgIC8vIERpdmlkZSBhbGwgcG9pbnRzIGV2ZW5seSwgYWRkaW5nIHRoZSBjb3JyZWN0IG51bWJlciB0byB0aGlzIHN1YnJhbmdlLlxuICAgICAgICAgICAgICAgIC8vIFJ1biB1cCB0byA8PSBzbyB0aGF0IDEwMCUgZ2V0cyBhIHBvaW50LCBldmVudCBpZiBpZ25vcmVMYXN0IGlzIHNldC5cbiAgICAgICAgICAgICAgICBmb3IgKHEgPSAxOyBxIDw9IHJlYWxTdGVwczsgcSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSByYXRpbyBiZXR3ZWVuIHRoZSByb3VuZGVkIHZhbHVlIGFuZCB0aGUgYWN0dWFsIHNpemUgbWlnaHQgYmUgfjElIG9mZi5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29ycmVjdCB0aGUgcGVyY2VudGFnZSBvZmZzZXQgYnkgdGhlIG51bWJlciBvZiBwb2ludHNcbiAgICAgICAgICAgICAgICAgICAgLy8gcGVyIHN1YnJhbmdlLiBkZW5zaXR5ID0gMSB3aWxsIHJlc3VsdCBpbiAxMDAgcG9pbnRzIG9uIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBmdWxsIHJhbmdlLCAyIGZvciA1MCwgNCBmb3IgMjUsIGV0Yy5cbiAgICAgICAgICAgICAgICAgICAgcGN0UG9zID0gcHJldlBjdCArIHEgKiBzdGVwU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlc1twY3RQb3MudG9GaXhlZCg1KV0gPSBbc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKHBjdFBvcyksIDBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIHBvaW50IHR5cGUuXG4gICAgICAgICAgICAgICAgdHlwZSA9IGdyb3VwLmluZGV4T2YoaSkgPiAtMSA/IFBpcHNUeXBlLkxhcmdlVmFsdWUgOiBpc1N0ZXBzID8gUGlwc1R5cGUuU21hbGxWYWx1ZSA6IFBpcHNUeXBlLk5vVmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gRW5mb3JjZSB0aGUgJ2lnbm9yZUZpcnN0JyBvcHRpb24gYnkgb3ZlcndyaXRpbmcgdGhlIHR5cGUgZm9yIDAuXG4gICAgICAgICAgICAgICAgaWYgKCFpbmRleCAmJiBpZ25vcmVGaXJzdCAmJiBpICE9PSBoaWdoKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShpID09PSBoaWdoICYmIGlnbm9yZUxhc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1hcmsgdGhlICd0eXBlJyBvZiB0aGlzIHBvaW50LiAwID0gcGxhaW4sIDEgPSByZWFsIHZhbHVlLCAyID0gc3RlcCB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlc1tuZXdQY3QudG9GaXhlZCg1KV0gPSBbaSwgdHlwZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcGVyY2VudGFnZSBjb3VudC5cbiAgICAgICAgICAgICAgICBwcmV2UGN0ID0gbmV3UGN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFkZE1hcmtpbmcoc3ByZWFkLCBmaWx0ZXJGdW5jLCBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZV9Eb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdmFsdWVTaXplQ2xhc3NlcyA9IChfYSA9IHt9LFxuICAgICAgICAgICAgX2FbUGlwc1R5cGUuTm9uZV0gPSBcIlwiLFxuICAgICAgICAgICAgX2FbUGlwc1R5cGUuTm9WYWx1ZV0gPSBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVOb3JtYWwsXG4gICAgICAgICAgICBfYVtQaXBzVHlwZS5MYXJnZVZhbHVlXSA9IG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZUxhcmdlLFxuICAgICAgICAgICAgX2FbUGlwc1R5cGUuU21hbGxWYWx1ZV0gPSBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVTdWIsXG4gICAgICAgICAgICBfYSk7XG4gICAgICAgIHZhciBtYXJrZXJTaXplQ2xhc3NlcyA9IChfYiA9IHt9LFxuICAgICAgICAgICAgX2JbUGlwc1R5cGUuTm9uZV0gPSBcIlwiLFxuICAgICAgICAgICAgX2JbUGlwc1R5cGUuTm9WYWx1ZV0gPSBvcHRpb25zLmNzc0NsYXNzZXMubWFya2VyTm9ybWFsLFxuICAgICAgICAgICAgX2JbUGlwc1R5cGUuTGFyZ2VWYWx1ZV0gPSBvcHRpb25zLmNzc0NsYXNzZXMubWFya2VyTGFyZ2UsXG4gICAgICAgICAgICBfYltQaXBzVHlwZS5TbWFsbFZhbHVlXSA9IG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJTdWIsXG4gICAgICAgICAgICBfYik7XG4gICAgICAgIHZhciB2YWx1ZU9yaWVudGF0aW9uQ2xhc3NlcyA9IFtvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVIb3Jpem9udGFsLCBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVWZXJ0aWNhbF07XG4gICAgICAgIHZhciBtYXJrZXJPcmllbnRhdGlvbkNsYXNzZXMgPSBbb3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlckhvcml6b250YWwsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJWZXJ0aWNhbF07XG4gICAgICAgIGFkZENsYXNzKGVsZW1lbnQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5waXBzKTtcbiAgICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgb3B0aW9ucy5vcnQgPT09IDAgPyBvcHRpb25zLmNzc0NsYXNzZXMucGlwc0hvcml6b250YWwgOiBvcHRpb25zLmNzc0NsYXNzZXMucGlwc1ZlcnRpY2FsKTtcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q2xhc3Nlcyh0eXBlLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciBhID0gc291cmNlID09PSBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgb3JpZW50YXRpb25DbGFzc2VzID0gYSA/IHZhbHVlT3JpZW50YXRpb25DbGFzc2VzIDogbWFya2VyT3JpZW50YXRpb25DbGFzc2VzO1xuICAgICAgICAgICAgdmFyIHNpemVDbGFzc2VzID0gYSA/IHZhbHVlU2l6ZUNsYXNzZXMgOiBtYXJrZXJTaXplQ2xhc3NlcztcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UgKyBcIiBcIiArIG9yaWVudGF0aW9uQ2xhc3Nlc1tvcHRpb25zLm9ydF0gKyBcIiBcIiArIHNpemVDbGFzc2VzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFkZFNwcmVhZChvZmZzZXQsIHZhbHVlLCB0eXBlKSB7XG4gICAgICAgICAgICAvLyBBcHBseSB0aGUgZmlsdGVyIGZ1bmN0aW9uLCBpZiBpdCBpcyBzZXQuXG4gICAgICAgICAgICB0eXBlID0gZmlsdGVyRnVuYyA/IGZpbHRlckZ1bmModmFsdWUsIHR5cGUpIDogdHlwZTtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBQaXBzVHlwZS5Ob25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIGEgbWFya2VyIGZvciBldmVyeSBwb2ludFxuICAgICAgICAgICAgdmFyIG5vZGUgPSBhZGROb2RlVG8oZWxlbWVudCwgZmFsc2UpO1xuICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSBnZXRDbGFzc2VzKHR5cGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXIpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZVtvcHRpb25zLnN0eWxlXSA9IG9mZnNldCArIFwiJVwiO1xuICAgICAgICAgICAgLy8gVmFsdWVzIGFyZSBvbmx5IGFwcGVuZGVkIGZvciBwb2ludHMgbWFya2VkICcxJyBvciAnMicuXG4gICAgICAgICAgICBpZiAodHlwZSA+IFBpcHNUeXBlLk5vVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gYWRkTm9kZVRvKGVsZW1lbnQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IGdldENsYXNzZXModHlwZSwgb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIiwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZVtvcHRpb25zLnN0eWxlXSA9IG9mZnNldCArIFwiJVwiO1xuICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gU3RyaW5nKGZvcm1hdHRlci50byh2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFwcGVuZCBhbGwgcG9pbnRzLlxuICAgICAgICBPYmplY3Qua2V5cyhzcHJlYWQpLmZvckVhY2goZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICAgICAgYWRkU3ByZWFkKG9mZnNldCwgc3ByZWFkW29mZnNldF1bMF0sIHNwcmVhZFtvZmZzZXRdWzFdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVQaXBzKCkge1xuICAgICAgICBpZiAoc2NvcGVfUGlwcykge1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudChzY29wZV9QaXBzKTtcbiAgICAgICAgICAgIHNjb3BlX1BpcHMgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBpcHMocGlwcykge1xuICAgICAgICAvLyBGaXggIzY2OVxuICAgICAgICByZW1vdmVQaXBzKCk7XG4gICAgICAgIHZhciBzcHJlYWQgPSBnZW5lcmF0ZVNwcmVhZChwaXBzKTtcbiAgICAgICAgdmFyIGZpbHRlciA9IHBpcHMuZmlsdGVyO1xuICAgICAgICB2YXIgZm9ybWF0ID0gcGlwcy5mb3JtYXQgfHwge1xuICAgICAgICAgICAgdG86IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoTWF0aC5yb3VuZCh2YWx1ZSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc2NvcGVfUGlwcyA9IHNjb3BlX1RhcmdldC5hcHBlbmRDaGlsZChhZGRNYXJraW5nKHNwcmVhZCwgZmlsdGVyLCBmb3JtYXQpKTtcbiAgICAgICAgcmV0dXJuIHNjb3BlX1BpcHM7XG4gICAgfVxuICAgIC8vIFNob3J0aGFuZCBmb3IgYmFzZSBkaW1lbnNpb25zLlxuICAgIGZ1bmN0aW9uIGJhc2VTaXplKCkge1xuICAgICAgICB2YXIgcmVjdCA9IHNjb3BlX0Jhc2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBhbHQgPSAoXCJvZmZzZXRcIiArIFtcIldpZHRoXCIsIFwiSGVpZ2h0XCJdW29wdGlvbnMub3J0XSk7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm9ydCA9PT0gMCA/IHJlY3Qud2lkdGggfHwgc2NvcGVfQmFzZVthbHRdIDogcmVjdC5oZWlnaHQgfHwgc2NvcGVfQmFzZVthbHRdO1xuICAgIH1cbiAgICAvLyBIYW5kbGVyIGZvciBhdHRhY2hpbmcgZXZlbnRzIHRyb3VnaCBhIHByb3h5LlxuICAgIGZ1bmN0aW9uIGF0dGFjaEV2ZW50KGV2ZW50cywgZWxlbWVudCwgY2FsbGJhY2ssIGRhdGEpIHtcbiAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byAnZmlsdGVyJyBldmVudHMgdG8gdGhlIHNsaWRlci5cbiAgICAgICAgLy8gZWxlbWVudCBpcyBhIG5vZGUsIG5vdCBhIG5vZGVMaXN0XG4gICAgICAgIHZhciBtZXRob2QgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBlID0gZml4RXZlbnQoZXZlbnQsIGRhdGEucGFnZU9mZnNldCwgZGF0YS50YXJnZXQgfHwgZWxlbWVudCk7XG4gICAgICAgICAgICAvLyBmaXhFdmVudCByZXR1cm5zIGZhbHNlIGlmIHRoaXMgZXZlbnQgaGFzIGEgZGlmZmVyZW50IHRhcmdldFxuICAgICAgICAgICAgLy8gd2hlbiBoYW5kbGluZyAobXVsdGktKSB0b3VjaCBldmVudHM7XG4gICAgICAgICAgICBpZiAoIWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb05vdFJlamVjdCBpcyBwYXNzZWQgYnkgYWxsIGVuZCBldmVudHMgdG8gbWFrZSBzdXJlIHJlbGVhc2VkIHRvdWNoZXNcbiAgICAgICAgICAgIC8vIGFyZSBub3QgcmVqZWN0ZWQsIGxlYXZpbmcgdGhlIHNsaWRlciBcInN0dWNrXCIgdG8gdGhlIGN1cnNvcjtcbiAgICAgICAgICAgIGlmIChpc1NsaWRlckRpc2FibGVkKCkgJiYgIWRhdGEuZG9Ob3RSZWplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTdG9wIGlmIGFuIGFjdGl2ZSAndGFwJyB0cmFuc2l0aW9uIGlzIHRha2luZyBwbGFjZS5cbiAgICAgICAgICAgIGlmIChoYXNDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50YXApICYmICFkYXRhLmRvTm90UmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWdub3JlIHJpZ2h0IG9yIG1pZGRsZSBjbGlja3Mgb24gc3RhcnQgIzQ1NFxuICAgICAgICAgICAgaWYgKGV2ZW50cyA9PT0gYWN0aW9ucy5zdGFydCAmJiBlLmJ1dHRvbnMgIT09IHVuZGVmaW5lZCAmJiBlLmJ1dHRvbnMgPiAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWdub3JlIHJpZ2h0IG9yIG1pZGRsZSBjbGlja3Mgb24gc3RhcnQgIzQ1NFxuICAgICAgICAgICAgaWYgKGRhdGEuaG92ZXIgJiYgZS5idXR0b25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gJ3N1cHBvcnRzUGFzc2l2ZScgaXMgb25seSB0cnVlIGlmIGEgYnJvd3NlciBhbHNvIHN1cHBvcnRzIHRvdWNoLWFjdGlvbjogbm9uZSBpbiBDU1MuXG4gICAgICAgICAgICAvLyBpT1Mgc2FmYXJpIGRvZXMgbm90LCBzbyBpdCBkb2Vzbid0IGdldCB0byBiZW5lZml0IGZyb20gcGFzc2l2ZSBzY3JvbGxpbmcuIGlPUyBkb2VzIHN1cHBvcnRcbiAgICAgICAgICAgIC8vIHRvdWNoLWFjdGlvbjogbWFuaXB1bGF0aW9uLCBidXQgdGhhdCBhbGxvd3MgcGFubmluZywgd2hpY2ggYnJlYWtzXG4gICAgICAgICAgICAvLyBzbGlkZXJzIGFmdGVyIHpvb21pbmcvb24gbm9uLXJlc3BvbnNpdmUgcGFnZXMuXG4gICAgICAgICAgICAvLyBTZWU6IGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzMxMTJcbiAgICAgICAgICAgIGlmICghc3VwcG9ydHNQYXNzaXZlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZS5jYWxjUG9pbnQgPSBlLnBvaW50c1tvcHRpb25zLm9ydF07XG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBldmVudCBoYW5kbGVyIHdpdGggdGhlIGV2ZW50IFsgYW5kIGFkZGl0aW9uYWwgZGF0YSBdLlxuICAgICAgICAgICAgY2FsbGJhY2soZSwgZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHZhciBtZXRob2RzID0gW107XG4gICAgICAgIC8vIEJpbmQgYSBjbG9zdXJlIG9uIHRoZSB0YXJnZXQgZm9yIGV2ZXJ5IGV2ZW50IHR5cGUuXG4gICAgICAgIGV2ZW50cy5zcGxpdChcIiBcIikuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBtZXRob2QsIHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2UpO1xuICAgICAgICAgICAgbWV0aG9kcy5wdXNoKFtldmVudE5hbWUsIG1ldGhvZF0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZHM7XG4gICAgfVxuICAgIC8vIFByb3ZpZGUgYSBjbGVhbiBldmVudCB3aXRoIHN0YW5kYXJkaXplZCBvZmZzZXQgdmFsdWVzLlxuICAgIGZ1bmN0aW9uIGZpeEV2ZW50KGUsIHBhZ2VPZmZzZXQsIGV2ZW50VGFyZ2V0KSB7XG4gICAgICAgIC8vIEZpbHRlciB0aGUgZXZlbnQgdG8gcmVnaXN0ZXIgdGhlIHR5cGUsIHdoaWNoIGNhbiBiZVxuICAgICAgICAvLyB0b3VjaCwgbW91c2Ugb3IgcG9pbnRlci4gT2Zmc2V0IGNoYW5nZXMgbmVlZCB0byBiZVxuICAgICAgICAvLyBtYWRlIG9uIGFuIGV2ZW50IHNwZWNpZmljIGJhc2lzLlxuICAgICAgICB2YXIgdG91Y2ggPSBlLnR5cGUuaW5kZXhPZihcInRvdWNoXCIpID09PSAwO1xuICAgICAgICB2YXIgbW91c2UgPSBlLnR5cGUuaW5kZXhPZihcIm1vdXNlXCIpID09PSAwO1xuICAgICAgICB2YXIgcG9pbnRlciA9IGUudHlwZS5pbmRleE9mKFwicG9pbnRlclwiKSA9PT0gMDtcbiAgICAgICAgdmFyIHggPSAwO1xuICAgICAgICB2YXIgeSA9IDA7XG4gICAgICAgIC8vIElFMTAgaW1wbGVtZW50ZWQgcG9pbnRlciBldmVudHMgd2l0aCBhIHByZWZpeDtcbiAgICAgICAgaWYgKGUudHlwZS5pbmRleE9mKFwiTVNQb2ludGVyXCIpID09PSAwKSB7XG4gICAgICAgICAgICBwb2ludGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFcnJvbmVvdXMgZXZlbnRzIHNlZW0gdG8gYmUgcGFzc2VkIGluIG9jY2FzaW9uYWxseSBvbiBpT1MvaVBhZE9TIGFmdGVyIHVzZXIgZmluaXNoZXMgaW50ZXJhY3Rpbmcgd2l0aFxuICAgICAgICAvLyB0aGUgc2xpZGVyLiBUaGV5IGFwcGVhciB0byBiZSBvZiB0eXBlIE1vdXNlRXZlbnQsIHlldCB0aGV5IGRvbid0IGhhdmUgdXN1YWwgcHJvcGVydGllcyBzZXQuIElnbm9yZVxuICAgICAgICAvLyBldmVudHMgdGhhdCBoYXZlIG5vIHRvdWNoZXMgb3IgYnV0dG9ucyBhc3NvY2lhdGVkIHdpdGggdGhlbS4gKCMxMDU3LCAjMTA3OSwgIzEwOTUpXG4gICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2Vkb3duXCIgJiYgIWUuYnV0dG9ucyAmJiAhZS50b3VjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIG9ubHkgdGhpbmcgb25lIGhhbmRsZSBzaG91bGQgYmUgY29uY2VybmVkIGFib3V0IGlzIHRoZSB0b3VjaGVzIHRoYXQgb3JpZ2luYXRlZCBvbiB0b3Agb2YgaXQuXG4gICAgICAgIGlmICh0b3VjaCkge1xuICAgICAgICAgICAgLy8gUmV0dXJucyB0cnVlIGlmIGEgdG91Y2ggb3JpZ2luYXRlZCBvbiB0aGUgdGFyZ2V0LlxuICAgICAgICAgICAgdmFyIGlzVG91Y2hPblRhcmdldCA9IGZ1bmN0aW9uIChjaGVja1RvdWNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGNoZWNrVG91Y2gudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHJldHVybiAodGFyZ2V0ID09PSBldmVudFRhcmdldCB8fFxuICAgICAgICAgICAgICAgICAgICBldmVudFRhcmdldC5jb250YWlucyh0YXJnZXQpIHx8XG4gICAgICAgICAgICAgICAgICAgIChlLmNvbXBvc2VkICYmIGUuY29tcG9zZWRQYXRoKCkuc2hpZnQoKSA9PT0gZXZlbnRUYXJnZXQpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiB0b3VjaHN0YXJ0IGV2ZW50cywgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlcmUgaXMgc3RpbGwgbm8gbW9yZSB0aGFuIG9uZVxuICAgICAgICAgICAgLy8gdG91Y2ggb24gdGhlIHRhcmdldCBzbyB3ZSBsb29rIGFtb25nc3QgYWxsIHRvdWNoZXMuXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRUb3VjaGVzID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKGUudG91Y2hlcywgaXNUb3VjaE9uVGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAvLyBEbyBub3Qgc3VwcG9ydCBtb3JlIHRoYW4gb25lIHRvdWNoIHBlciBoYW5kbGUuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFRvdWNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHggPSB0YXJnZXRUb3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgICAgICAgICAgIHkgPSB0YXJnZXRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gdGhlIG90aGVyIGNhc2VzLCBmaW5kIG9uIGNoYW5nZWRUb3VjaGVzIGlzIGVub3VnaC5cbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG91Y2ggPSBBcnJheS5wcm90b3R5cGUuZmluZC5jYWxsKGUuY2hhbmdlZFRvdWNoZXMsIGlzVG91Y2hPblRhcmdldCk7XG4gICAgICAgICAgICAgICAgLy8gQ2FuY2VsIGlmIHRoZSB0YXJnZXQgdG91Y2ggaGFzIG5vdCBtb3ZlZC5cbiAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFRvdWNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeCA9IHRhcmdldFRvdWNoLnBhZ2VYO1xuICAgICAgICAgICAgICAgIHkgPSB0YXJnZXRUb3VjaC5wYWdlWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYWdlT2Zmc2V0ID0gcGFnZU9mZnNldCB8fCBnZXRQYWdlT2Zmc2V0KHNjb3BlX0RvY3VtZW50KTtcbiAgICAgICAgaWYgKG1vdXNlIHx8IHBvaW50ZXIpIHtcbiAgICAgICAgICAgIHggPSBlLmNsaWVudFggKyBwYWdlT2Zmc2V0Lng7XG4gICAgICAgICAgICB5ID0gZS5jbGllbnRZICsgcGFnZU9mZnNldC55O1xuICAgICAgICB9XG4gICAgICAgIGUucGFnZU9mZnNldCA9IHBhZ2VPZmZzZXQ7XG4gICAgICAgIGUucG9pbnRzID0gW3gsIHldO1xuICAgICAgICBlLmN1cnNvciA9IG1vdXNlIHx8IHBvaW50ZXI7IC8vIEZpeCAjNDM1XG4gICAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgICAvLyBUcmFuc2xhdGUgYSBjb29yZGluYXRlIGluIHRoZSBkb2N1bWVudCB0byBhIHBlcmNlbnRhZ2Ugb24gdGhlIHNsaWRlclxuICAgIGZ1bmN0aW9uIGNhbGNQb2ludFRvUGVyY2VudGFnZShjYWxjUG9pbnQpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gY2FsY1BvaW50IC0gb2Zmc2V0KHNjb3BlX0Jhc2UsIG9wdGlvbnMub3J0KTtcbiAgICAgICAgdmFyIHByb3Bvc2FsID0gKGxvY2F0aW9uICogMTAwKSAvIGJhc2VTaXplKCk7XG4gICAgICAgIC8vIENsYW1wIHByb3Bvc2FsIGJldHdlZW4gMCUgYW5kIDEwMCVcbiAgICAgICAgLy8gT3V0LW9mLWJvdW5kIGNvb3JkaW5hdGVzIG1heSBvY2N1ciB3aGVuIC5ub1VpLWJhc2UgcHNldWRvLWVsZW1lbnRzXG4gICAgICAgIC8vIGFyZSB1c2VkIChlLmcuIGNvbnRhaW5lZCBoYW5kbGVzIGZlYXR1cmUpXG4gICAgICAgIHByb3Bvc2FsID0gbGltaXQocHJvcG9zYWwpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5kaXIgPyAxMDAgLSBwcm9wb3NhbCA6IHByb3Bvc2FsO1xuICAgIH1cbiAgICAvLyBGaW5kIGhhbmRsZSBjbG9zZXN0IHRvIGEgY2VydGFpbiBwZXJjZW50YWdlIG9uIHRoZSBzbGlkZXJcbiAgICBmdW5jdGlvbiBnZXRDbG9zZXN0SGFuZGxlKGNsaWNrZWRQb3NpdGlvbikge1xuICAgICAgICB2YXIgc21hbGxlc3REaWZmZXJlbmNlID0gMTAwO1xuICAgICAgICB2YXIgaGFuZGxlTnVtYmVyID0gZmFsc2U7XG4gICAgICAgIHNjb3BlX0hhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlLCBpbmRleCkge1xuICAgICAgICAgICAgLy8gRGlzYWJsZWQgaGFuZGxlcyBhcmUgaWdub3JlZFxuICAgICAgICAgICAgaWYgKGlzSGFuZGxlRGlzYWJsZWQoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhhbmRsZVBvc2l0aW9uID0gc2NvcGVfTG9jYXRpb25zW2luZGV4XTtcbiAgICAgICAgICAgIHZhciBkaWZmZXJlbmNlV2l0aFRoaXNIYW5kbGUgPSBNYXRoLmFicyhoYW5kbGVQb3NpdGlvbiAtIGNsaWNrZWRQb3NpdGlvbik7XG4gICAgICAgICAgICAvLyBJbml0aWFsIHN0YXRlXG4gICAgICAgICAgICB2YXIgY2xpY2tBdEVkZ2UgPSBkaWZmZXJlbmNlV2l0aFRoaXNIYW5kbGUgPT09IDEwMCAmJiBzbWFsbGVzdERpZmZlcmVuY2UgPT09IDEwMDtcbiAgICAgICAgICAgIC8vIERpZmZlcmVuY2Ugd2l0aCB0aGlzIGhhbmRsZSBpcyBzbWFsbGVyIHRoYW4gdGhlIHByZXZpb3VzbHkgY2hlY2tlZCBoYW5kbGVcbiAgICAgICAgICAgIHZhciBpc0Nsb3NlciA9IGRpZmZlcmVuY2VXaXRoVGhpc0hhbmRsZSA8IHNtYWxsZXN0RGlmZmVyZW5jZTtcbiAgICAgICAgICAgIHZhciBpc0Nsb3NlckFmdGVyID0gZGlmZmVyZW5jZVdpdGhUaGlzSGFuZGxlIDw9IHNtYWxsZXN0RGlmZmVyZW5jZSAmJiBjbGlja2VkUG9zaXRpb24gPiBoYW5kbGVQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChpc0Nsb3NlciB8fCBpc0Nsb3NlckFmdGVyIHx8IGNsaWNrQXRFZGdlKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlTnVtYmVyID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgc21hbGxlc3REaWZmZXJlbmNlID0gZGlmZmVyZW5jZVdpdGhUaGlzSGFuZGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZU51bWJlcjtcbiAgICB9XG4gICAgLy8gRmlyZSAnZW5kJyB3aGVuIGEgbW91c2Ugb3IgcGVuIGxlYXZlcyB0aGUgZG9jdW1lbnQuXG4gICAgZnVuY3Rpb24gZG9jdW1lbnRMZWF2ZShldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJtb3VzZW91dFwiICYmXG4gICAgICAgICAgICBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSFRNTFwiICYmXG4gICAgICAgICAgICBldmVudC5yZWxhdGVkVGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBldmVudEVuZChldmVudCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSGFuZGxlIG1vdmVtZW50IG9uIGRvY3VtZW50IGZvciBoYW5kbGUgYW5kIHJhbmdlIGRyYWcuXG4gICAgZnVuY3Rpb24gZXZlbnRNb3ZlKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIC8vIEZpeCAjNDk4XG4gICAgICAgIC8vIENoZWNrIHZhbHVlIG9mIC5idXR0b25zIGluICdzdGFydCcgdG8gd29yayBhcm91bmQgYSBidWcgaW4gSUUxMCBtb2JpbGUgKGRhdGEuYnV0dG9uc1Byb3BlcnR5KS5cbiAgICAgICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy85MjcwMDUvbW9iaWxlLWllMTAtd2luZG93cy1waG9uZS1idXR0b25zLXByb3BlcnR5LW9mLXBvaW50ZXJtb3ZlLWV2ZW50LWFsd2F5cy16ZXJvXG4gICAgICAgIC8vIElFOSBoYXMgLmJ1dHRvbnMgYW5kIC53aGljaCB6ZXJvIG9uIG1vdXNlbW92ZS5cbiAgICAgICAgLy8gRmlyZWZveCBicmVha3MgdGhlIHNwZWMgTUROIGRlZmluZXMuXG4gICAgICAgIGlmIChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSA5XCIpID09PSAtMSAmJiBldmVudC5idXR0b25zID09PSAwICYmIGRhdGEuYnV0dG9uc1Byb3BlcnR5ICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnRFbmQoZXZlbnQsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIHdlIGFyZSBtb3ZpbmcgdXAgb3IgZG93blxuICAgICAgICB2YXIgbW92ZW1lbnQgPSAob3B0aW9ucy5kaXIgPyAtMSA6IDEpICogKGV2ZW50LmNhbGNQb2ludCAtIGRhdGEuc3RhcnRDYWxjUG9pbnQpO1xuICAgICAgICAvLyBDb252ZXJ0IHRoZSBtb3ZlbWVudCBpbnRvIGEgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHdpZHRoL2hlaWdodFxuICAgICAgICB2YXIgcHJvcG9zYWwgPSAobW92ZW1lbnQgKiAxMDApIC8gZGF0YS5iYXNlU2l6ZTtcbiAgICAgICAgbW92ZUhhbmRsZXMobW92ZW1lbnQgPiAwLCBwcm9wb3NhbCwgZGF0YS5sb2NhdGlvbnMsIGRhdGEuaGFuZGxlTnVtYmVycywgZGF0YS5jb25uZWN0KTtcbiAgICB9XG4gICAgLy8gVW5iaW5kIG1vdmUgZXZlbnRzIG9uIGRvY3VtZW50LCBjYWxsIGNhbGxiYWNrcy5cbiAgICBmdW5jdGlvbiBldmVudEVuZChldmVudCwgZGF0YSkge1xuICAgICAgICAvLyBUaGUgaGFuZGxlIGlzIG5vIGxvbmdlciBhY3RpdmUsIHNvIHJlbW92ZSB0aGUgY2xhc3MuXG4gICAgICAgIGlmIChkYXRhLmhhbmRsZSkge1xuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoZGF0YS5oYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5hY3RpdmUpO1xuICAgICAgICAgICAgc2NvcGVfQWN0aXZlSGFuZGxlc0NvdW50IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVW5iaW5kIHRoZSBtb3ZlIGFuZCBlbmQgZXZlbnRzLCB3aGljaCBhcmUgYWRkZWQgb24gJ3N0YXJ0Jy5cbiAgICAgICAgZGF0YS5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgc2NvcGVfRG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoY1swXSwgY1sxXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2NvcGVfQWN0aXZlSGFuZGxlc0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZHJhZ2dpbmcgY2xhc3MuXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5kcmFnKTtcbiAgICAgICAgICAgIHNldFppbmRleCgpO1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGN1cnNvciBzdHlsZXMgYW5kIHRleHQtc2VsZWN0aW9uIGV2ZW50cyBib3VuZCB0byB0aGUgYm9keS5cbiAgICAgICAgICAgIGlmIChldmVudC5jdXJzb3IpIHtcbiAgICAgICAgICAgICAgICBzY29wZV9Cb2R5LnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgc2NvcGVfQm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwic2VsZWN0c3RhcnRcIiwgcHJldmVudERlZmF1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmV2ZW50cy5zbW9vdGhTdGVwcykge1xuICAgICAgICAgICAgZGF0YS5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICBmaXJlRXZlbnQoXCJjaGFuZ2VcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgZmlyZUV2ZW50KFwiZW5kXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBCaW5kIG1vdmUgZXZlbnRzIG9uIGRvY3VtZW50LlxuICAgIGZ1bmN0aW9uIGV2ZW50U3RhcnQoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgLy8gSWdub3JlIGV2ZW50IGlmIGFueSBoYW5kbGUgaXMgZGlzYWJsZWRcbiAgICAgICAgaWYgKGRhdGEuaGFuZGxlTnVtYmVycy5zb21lKGlzSGFuZGxlRGlzYWJsZWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhhbmRsZTtcbiAgICAgICAgaWYgKGRhdGEuaGFuZGxlTnVtYmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVPcmlnaW4gPSBzY29wZV9IYW5kbGVzW2RhdGEuaGFuZGxlTnVtYmVyc1swXV07XG4gICAgICAgICAgICBoYW5kbGUgPSBoYW5kbGVPcmlnaW4uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICBzY29wZV9BY3RpdmVIYW5kbGVzQ291bnQgKz0gMTtcbiAgICAgICAgICAgIC8vIE1hcmsgdGhlIGhhbmRsZSBhcyAnYWN0aXZlJyBzbyBpdCBjYW4gYmUgc3R5bGVkLlxuICAgICAgICAgICAgYWRkQ2xhc3MoaGFuZGxlLCBvcHRpb25zLmNzc0NsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBIGRyYWcgc2hvdWxkIG5ldmVyIHByb3BhZ2F0ZSB1cCB0byB0aGUgJ3RhcCcgZXZlbnQuXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBSZWNvcmQgdGhlIGV2ZW50IGxpc3RlbmVycy5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICAgICAgICAvLyBBdHRhY2ggdGhlIG1vdmUgYW5kIGVuZCBldmVudHMuXG4gICAgICAgIHZhciBtb3ZlRXZlbnQgPSBhdHRhY2hFdmVudChhY3Rpb25zLm1vdmUsIHNjb3BlX0RvY3VtZW50RWxlbWVudCwgZXZlbnRNb3ZlLCB7XG4gICAgICAgICAgICAvLyBUaGUgZXZlbnQgdGFyZ2V0IGhhcyBjaGFuZ2VkIHNvIHdlIG5lZWQgdG8gcHJvcGFnYXRlIHRoZSBvcmlnaW5hbCBvbmUgc28gdGhhdCB3ZSBrZWVwXG4gICAgICAgICAgICAvLyByZWx5aW5nIG9uIGl0IHRvIGV4dHJhY3QgdGFyZ2V0IHRvdWNoZXMuXG4gICAgICAgICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlLFxuICAgICAgICAgICAgY29ubmVjdDogZGF0YS5jb25uZWN0LFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBsaXN0ZW5lcnMsXG4gICAgICAgICAgICBzdGFydENhbGNQb2ludDogZXZlbnQuY2FsY1BvaW50LFxuICAgICAgICAgICAgYmFzZVNpemU6IGJhc2VTaXplKCksXG4gICAgICAgICAgICBwYWdlT2Zmc2V0OiBldmVudC5wYWdlT2Zmc2V0LFxuICAgICAgICAgICAgaGFuZGxlTnVtYmVyczogZGF0YS5oYW5kbGVOdW1iZXJzLFxuICAgICAgICAgICAgYnV0dG9uc1Byb3BlcnR5OiBldmVudC5idXR0b25zLFxuICAgICAgICAgICAgbG9jYXRpb25zOiBzY29wZV9Mb2NhdGlvbnMuc2xpY2UoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlbmRFdmVudCA9IGF0dGFjaEV2ZW50KGFjdGlvbnMuZW5kLCBzY29wZV9Eb2N1bWVudEVsZW1lbnQsIGV2ZW50RW5kLCB7XG4gICAgICAgICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBsaXN0ZW5lcnMsXG4gICAgICAgICAgICBkb05vdFJlamVjdDogdHJ1ZSxcbiAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IGRhdGEuaGFuZGxlTnVtYmVycyxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBvdXRFdmVudCA9IGF0dGFjaEV2ZW50KFwibW91c2VvdXRcIiwgc2NvcGVfRG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudExlYXZlLCB7XG4gICAgICAgICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBsaXN0ZW5lcnMsXG4gICAgICAgICAgICBkb05vdFJlamVjdDogdHJ1ZSxcbiAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IGRhdGEuaGFuZGxlTnVtYmVycyxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIHdlIHB1c2hlZCB0aGUgbGlzdGVuZXJzIGluIHRoZSBsaXN0ZW5lciBsaXN0IHJhdGhlciB0aGFuIGNyZWF0aW5nXG4gICAgICAgIC8vIGEgbmV3IG9uZSBhcyBpdCBoYXMgYWxyZWFkeSBiZWVuIHBhc3NlZCB0byB0aGUgZXZlbnQgaGFuZGxlcnMuXG4gICAgICAgIGxpc3RlbmVycy5wdXNoLmFwcGx5KGxpc3RlbmVycywgbW92ZUV2ZW50LmNvbmNhdChlbmRFdmVudCwgb3V0RXZlbnQpKTtcbiAgICAgICAgLy8gVGV4dCBzZWxlY3Rpb24gaXNuJ3QgYW4gaXNzdWUgb24gdG91Y2ggZGV2aWNlcyxcbiAgICAgICAgLy8gc28gYWRkaW5nIGN1cnNvciBzdHlsZXMgY2FuIGJlIHNraXBwZWQuXG4gICAgICAgIGlmIChldmVudC5jdXJzb3IpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgdGhlICdJJyBjdXJzb3IgYW5kIGV4dGVuZCB0aGUgcmFuZ2UtZHJhZyBjdXJzb3IuXG4gICAgICAgICAgICBzY29wZV9Cb2R5LnN0eWxlLmN1cnNvciA9IGdldENvbXB1dGVkU3R5bGUoZXZlbnQudGFyZ2V0KS5jdXJzb3I7XG4gICAgICAgICAgICAvLyBNYXJrIHRoZSB0YXJnZXQgd2l0aCBhIGRyYWdnaW5nIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHNjb3BlX0hhbmRsZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGFkZENsYXNzKHNjb3BlX1RhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLmRyYWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHJldmVudCB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nIHRoZSBoYW5kbGVzLlxuICAgICAgICAgICAgLy8gSW4gbm9VaVNsaWRlciA8PSA5LjIuMCwgdGhpcyB3YXMgaGFuZGxlZCBieSBjYWxsaW5nIHByZXZlbnREZWZhdWx0IG9uIG1vdXNlL3RvdWNoIHN0YXJ0L21vdmUsXG4gICAgICAgICAgICAvLyB3aGljaCBpcyBzY3JvbGwgYmxvY2tpbmcuIFRoZSBzZWxlY3RzdGFydCBldmVudCBpcyBzdXBwb3J0ZWQgYnkgRmlyZUZveCBzdGFydGluZyBmcm9tIHZlcnNpb24gNTIsXG4gICAgICAgICAgICAvLyBtZWFuaW5nIHRoZSBvbmx5IGhvbGRvdXQgaXMgaU9TIFNhZmFyaS4gVGhpcyBkb2Vzbid0IG1hdHRlcjogdGV4dCBzZWxlY3Rpb24gaXNuJ3QgdHJpZ2dlcmVkIHRoZXJlLlxuICAgICAgICAgICAgLy8gVGhlICdjdXJzb3InIGZsYWcgaXMgZmFsc2UuXG4gICAgICAgICAgICAvLyBTZWU6IGh0dHA6Ly9jYW5pdXNlLmNvbS8jc2VhcmNoPXNlbGVjdHN0YXJ0XG4gICAgICAgICAgICBzY29wZV9Cb2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgIGZpcmVFdmVudChcInN0YXJ0XCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBNb3ZlIGNsb3Nlc3QgaGFuZGxlIHRvIHRhcHBlZCBsb2NhdGlvbi5cbiAgICBmdW5jdGlvbiBldmVudFRhcChldmVudCkge1xuICAgICAgICAvLyBUaGUgdGFwIGV2ZW50IHNob3VsZG4ndCBwcm9wYWdhdGUgdXBcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHZhciBwcm9wb3NhbCA9IGNhbGNQb2ludFRvUGVyY2VudGFnZShldmVudC5jYWxjUG9pbnQpO1xuICAgICAgICB2YXIgaGFuZGxlTnVtYmVyID0gZ2V0Q2xvc2VzdEhhbmRsZShwcm9wb3NhbCk7XG4gICAgICAgIC8vIFRhY2tsZSB0aGUgY2FzZSB0aGF0IGFsbCBoYW5kbGVzIGFyZSAnZGlzYWJsZWQnLlxuICAgICAgICBpZiAoaGFuZGxlTnVtYmVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZsYWcgdGhlIHNsaWRlciBhcyBpdCBpcyBub3cgaW4gYSB0cmFuc2l0aW9uYWwgc3RhdGUuXG4gICAgICAgIC8vIFRyYW5zaXRpb24gdGFrZXMgYSBjb25maWd1cmFibGUgYW1vdW50IG9mIG1zIChkZWZhdWx0IDMwMCkuIFJlLWVuYWJsZSB0aGUgc2xpZGVyIGFmdGVyIHRoYXQuXG4gICAgICAgIGlmICghb3B0aW9ucy5ldmVudHMuc25hcCkge1xuICAgICAgICAgICAgYWRkQ2xhc3NGb3Ioc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFwLCBvcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBwcm9wb3NhbCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHNldFppbmRleCgpO1xuICAgICAgICBmaXJlRXZlbnQoXCJzbGlkZVwiLCBoYW5kbGVOdW1iZXIsIHRydWUpO1xuICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaGFuZGxlTnVtYmVyLCB0cnVlKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLmV2ZW50cy5zbmFwKSB7XG4gICAgICAgICAgICBmaXJlRXZlbnQoXCJjaGFuZ2VcIiwgaGFuZGxlTnVtYmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZXZlbnRTdGFydChldmVudCwgeyBoYW5kbGVOdW1iZXJzOiBbaGFuZGxlTnVtYmVyXSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBGaXJlcyBhICdob3ZlcicgZXZlbnQgZm9yIGEgaG92ZXJlZCBtb3VzZS9wZW4gcG9zaXRpb24uXG4gICAgZnVuY3Rpb24gZXZlbnRIb3ZlcihldmVudCkge1xuICAgICAgICB2YXIgcHJvcG9zYWwgPSBjYWxjUG9pbnRUb1BlcmNlbnRhZ2UoZXZlbnQuY2FsY1BvaW50KTtcbiAgICAgICAgdmFyIHRvID0gc2NvcGVfU3BlY3RydW0uZ2V0U3RlcChwcm9wb3NhbCk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyh0byk7XG4gICAgICAgIE9iamVjdC5rZXlzKHNjb3BlX0V2ZW50cykuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0RXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChcImhvdmVyXCIgPT09IHRhcmdldEV2ZW50LnNwbGl0KFwiLlwiKVswXSkge1xuICAgICAgICAgICAgICAgIHNjb3BlX0V2ZW50c1t0YXJnZXRFdmVudF0uZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzY29wZV9TZWxmLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBIYW5kbGVzIGtleWRvd24gb24gZm9jdXNlZCBoYW5kbGVzXG4gICAgLy8gRG9uJ3QgbW92ZSB0aGUgZG9jdW1lbnQgd2hlbiBwcmVzc2luZyBhcnJvdyBrZXlzIG9uIGZvY3VzZWQgaGFuZGxlc1xuICAgIGZ1bmN0aW9uIGV2ZW50S2V5ZG93bihldmVudCwgaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgIGlmIChpc1NsaWRlckRpc2FibGVkKCkgfHwgaXNIYW5kbGVEaXNhYmxlZChoYW5kbGVOdW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhvcml6b250YWxLZXlzID0gW1wiTGVmdFwiLCBcIlJpZ2h0XCJdO1xuICAgICAgICB2YXIgdmVydGljYWxLZXlzID0gW1wiRG93blwiLCBcIlVwXCJdO1xuICAgICAgICB2YXIgbGFyZ2VTdGVwS2V5cyA9IFtcIlBhZ2VEb3duXCIsIFwiUGFnZVVwXCJdO1xuICAgICAgICB2YXIgZWRnZUtleXMgPSBbXCJIb21lXCIsIFwiRW5kXCJdO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXIgJiYgIW9wdGlvbnMub3J0KSB7XG4gICAgICAgICAgICAvLyBPbiBhbiByaWdodC10by1sZWZ0IHNsaWRlciwgdGhlIGxlZnQgYW5kIHJpZ2h0IGtleXMgYWN0IGludmVydGVkXG4gICAgICAgICAgICBob3Jpem9udGFsS2V5cy5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5vcnQgJiYgIW9wdGlvbnMuZGlyKSB7XG4gICAgICAgICAgICAvLyBPbiBhIHRvcC10by1ib3R0b20gc2xpZGVyLCB0aGUgdXAgYW5kIGRvd24ga2V5cyBhY3QgaW52ZXJ0ZWRcbiAgICAgICAgICAgIHZlcnRpY2FsS2V5cy5yZXZlcnNlKCk7XG4gICAgICAgICAgICBsYXJnZVN0ZXBLZXlzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdHJpcCBcIkFycm93XCIgZm9yIElFIGNvbXBhdGliaWxpdHkuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2tleVxuICAgICAgICB2YXIga2V5ID0gZXZlbnQua2V5LnJlcGxhY2UoXCJBcnJvd1wiLCBcIlwiKTtcbiAgICAgICAgdmFyIGlzTGFyZ2VEb3duID0ga2V5ID09PSBsYXJnZVN0ZXBLZXlzWzBdO1xuICAgICAgICB2YXIgaXNMYXJnZVVwID0ga2V5ID09PSBsYXJnZVN0ZXBLZXlzWzFdO1xuICAgICAgICB2YXIgaXNEb3duID0ga2V5ID09PSB2ZXJ0aWNhbEtleXNbMF0gfHwga2V5ID09PSBob3Jpem9udGFsS2V5c1swXSB8fCBpc0xhcmdlRG93bjtcbiAgICAgICAgdmFyIGlzVXAgPSBrZXkgPT09IHZlcnRpY2FsS2V5c1sxXSB8fCBrZXkgPT09IGhvcml6b250YWxLZXlzWzFdIHx8IGlzTGFyZ2VVcDtcbiAgICAgICAgdmFyIGlzTWluID0ga2V5ID09PSBlZGdlS2V5c1swXTtcbiAgICAgICAgdmFyIGlzTWF4ID0ga2V5ID09PSBlZGdlS2V5c1sxXTtcbiAgICAgICAgaWYgKCFpc0Rvd24gJiYgIWlzVXAgJiYgIWlzTWluICYmICFpc01heCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHRvO1xuICAgICAgICBpZiAoaXNVcCB8fCBpc0Rvd24pIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBpc0Rvd24gPyAwIDogMTtcbiAgICAgICAgICAgIHZhciBzdGVwcyA9IGdldE5leHRTdGVwc0ZvckhhbmRsZShoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSBzdGVwc1tkaXJlY3Rpb25dO1xuICAgICAgICAgICAgLy8gQXQgdGhlIGVkZ2Ugb2YgYSBzbGlkZXIsIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIGlmIChzdGVwID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm8gc3RlcCBzZXQsIHVzZSB0aGUgZGVmYXVsdCBvZiAxMCUgb2YgdGhlIHN1Yi1yYW5nZVxuICAgICAgICAgICAgaWYgKHN0ZXAgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc3RlcCA9IHNjb3BlX1NwZWN0cnVtLmdldERlZmF1bHRTdGVwKHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdLCBpc0Rvd24sIG9wdGlvbnMua2V5Ym9hcmREZWZhdWx0U3RlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNMYXJnZVVwIHx8IGlzTGFyZ2VEb3duKSB7XG4gICAgICAgICAgICAgICAgc3RlcCAqPSBvcHRpb25zLmtleWJvYXJkUGFnZU11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGVwICo9IG9wdGlvbnMua2V5Ym9hcmRNdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU3RlcCBvdmVyIHplcm8tbGVuZ3RoIHJhbmdlcyAoIzk0OCk7XG4gICAgICAgICAgICBzdGVwID0gTWF0aC5tYXgoc3RlcCwgMC4wMDAwMDAxKTtcbiAgICAgICAgICAgIC8vIERlY3JlbWVudCBmb3IgZG93biBzdGVwc1xuICAgICAgICAgICAgc3RlcCA9IChpc0Rvd24gPyAtMSA6IDEpICogc3RlcDtcbiAgICAgICAgICAgIHRvID0gc2NvcGVfVmFsdWVzW2hhbmRsZU51bWJlcl0gKyBzdGVwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzTWF4KSB7XG4gICAgICAgICAgICAvLyBFbmQga2V5XG4gICAgICAgICAgICB0byA9IG9wdGlvbnMuc3BlY3RydW0ueFZhbFtvcHRpb25zLnNwZWN0cnVtLnhWYWwubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBIb21lIGtleVxuICAgICAgICAgICAgdG8gPSBvcHRpb25zLnNwZWN0cnVtLnhWYWxbMF07XG4gICAgICAgIH1cbiAgICAgICAgc2V0SGFuZGxlKGhhbmRsZU51bWJlciwgc2NvcGVfU3BlY3RydW0udG9TdGVwcGluZyh0byksIHRydWUsIHRydWUpO1xuICAgICAgICBmaXJlRXZlbnQoXCJzbGlkZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgZmlyZUV2ZW50KFwiY2hhbmdlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEF0dGFjaCBldmVudHMgdG8gc2V2ZXJhbCBzbGlkZXIgcGFydHMuXG4gICAgZnVuY3Rpb24gYmluZFNsaWRlckV2ZW50cyhiZWhhdmlvdXIpIHtcbiAgICAgICAgLy8gQXR0YWNoIHRoZSBzdGFuZGFyZCBkcmFnIGV2ZW50IHRvIHRoZSBoYW5kbGVzLlxuICAgICAgICBpZiAoIWJlaGF2aW91ci5maXhlZCkge1xuICAgICAgICAgICAgc2NvcGVfSGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlc2UgZXZlbnRzIGFyZSBvbmx5IGJvdW5kIHRvIHRoZSB2aXN1YWwgaGFuZGxlXG4gICAgICAgICAgICAgICAgLy8gZWxlbWVudCwgbm90IHRoZSAncmVhbCcgb3JpZ2luIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgYXR0YWNoRXZlbnQoYWN0aW9ucy5zdGFydCwgaGFuZGxlLmNoaWxkcmVuWzBdLCBldmVudFN0YXJ0LCB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IFtpbmRleF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBdHRhY2ggdGhlIHRhcCBldmVudCB0byB0aGUgc2xpZGVyIGJhc2UuXG4gICAgICAgIGlmIChiZWhhdmlvdXIudGFwKSB7XG4gICAgICAgICAgICBhdHRhY2hFdmVudChhY3Rpb25zLnN0YXJ0LCBzY29wZV9CYXNlLCBldmVudFRhcCwge30pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZpcmUgaG92ZXIgZXZlbnRzXG4gICAgICAgIGlmIChiZWhhdmlvdXIuaG92ZXIpIHtcbiAgICAgICAgICAgIGF0dGFjaEV2ZW50KGFjdGlvbnMubW92ZSwgc2NvcGVfQmFzZSwgZXZlbnRIb3Zlciwge1xuICAgICAgICAgICAgICAgIGhvdmVyOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSB0aGUgcmFuZ2UgZHJhZ2dhYmxlLlxuICAgICAgICBpZiAoYmVoYXZpb3VyLmRyYWcpIHtcbiAgICAgICAgICAgIHNjb3BlX0Nvbm5lY3RzLmZvckVhY2goZnVuY3Rpb24gKGNvbm5lY3QsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbm5lY3QgPT09IGZhbHNlIHx8IGluZGV4ID09PSAwIHx8IGluZGV4ID09PSBzY29wZV9Db25uZWN0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZUJlZm9yZSA9IHNjb3BlX0hhbmRsZXNbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlQWZ0ZXIgPSBzY29wZV9IYW5kbGVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRIb2xkZXJzID0gW2Nvbm5lY3RdO1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVzVG9EcmFnID0gW2hhbmRsZUJlZm9yZSwgaGFuZGxlQWZ0ZXJdO1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVOdW1iZXJzVG9EcmFnID0gW2luZGV4IC0gMSwgaW5kZXhdO1xuICAgICAgICAgICAgICAgIGFkZENsYXNzKGNvbm5lY3QsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5kcmFnZ2FibGUpO1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIHJhbmdlIGlzIGZpeGVkLCB0aGUgZW50aXJlIHJhbmdlIGNhblxuICAgICAgICAgICAgICAgIC8vIGJlIGRyYWdnZWQgYnkgdGhlIGhhbmRsZXMuIFRoZSBoYW5kbGUgaW4gdGhlIGZpcnN0XG4gICAgICAgICAgICAgICAgLy8gb3JpZ2luIHdpbGwgcHJvcGFnYXRlIHRoZSBzdGFydCBldmVudCB1cHdhcmQsXG4gICAgICAgICAgICAgICAgLy8gYnV0IGl0IG5lZWRzIHRvIGJlIGJvdW5kIG1hbnVhbGx5IG9uIHRoZSBvdGhlci5cbiAgICAgICAgICAgICAgICBpZiAoYmVoYXZpb3VyLmZpeGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50SG9sZGVycy5wdXNoKGhhbmRsZUJlZm9yZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50SG9sZGVycy5wdXNoKGhhbmRsZUFmdGVyLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW91ci5kcmFnQWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXNUb0RyYWcgPSBzY29wZV9IYW5kbGVzO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXJzVG9EcmFnID0gc2NvcGVfSGFuZGxlTnVtYmVycztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnRIb2xkZXJzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50SG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50KGFjdGlvbnMuc3RhcnQsIGV2ZW50SG9sZGVyLCBldmVudFN0YXJ0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVzOiBoYW5kbGVzVG9EcmFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTnVtYmVyczogaGFuZGxlTnVtYmVyc1RvRHJhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IGNvbm5lY3QsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQXR0YWNoIGFuIGV2ZW50IHRvIHRoaXMgc2xpZGVyLCBwb3NzaWJseSBpbmNsdWRpbmcgYSBuYW1lc3BhY2VcbiAgICBmdW5jdGlvbiBiaW5kRXZlbnQobmFtZXNwYWNlZEV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICBzY29wZV9FdmVudHNbbmFtZXNwYWNlZEV2ZW50XSA9IHNjb3BlX0V2ZW50c1tuYW1lc3BhY2VkRXZlbnRdIHx8IFtdO1xuICAgICAgICBzY29wZV9FdmVudHNbbmFtZXNwYWNlZEV2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgLy8gSWYgdGhlIGV2ZW50IGJvdW5kIGlzICd1cGRhdGUsJyBmaXJlIGl0IGltbWVkaWF0ZWx5IGZvciBhbGwgaGFuZGxlcy5cbiAgICAgICAgaWYgKG5hbWVzcGFjZWRFdmVudC5zcGxpdChcIi5cIilbMF0gPT09IFwidXBkYXRlXCIpIHtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoYSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaXNJbnRlcm5hbE5hbWVzcGFjZShuYW1lc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVzcGFjZSA9PT0gSU5URVJOQUxfRVZFTlRfTlMuYXJpYSB8fCBuYW1lc3BhY2UgPT09IElOVEVSTkFMX0VWRU5UX05TLnRvb2x0aXBzO1xuICAgIH1cbiAgICAvLyBVbmRvIGF0dGFjaG1lbnQgb2YgZXZlbnRcbiAgICBmdW5jdGlvbiByZW1vdmVFdmVudChuYW1lc3BhY2VkRXZlbnQpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0gbmFtZXNwYWNlZEV2ZW50ICYmIG5hbWVzcGFjZWRFdmVudC5zcGxpdChcIi5cIilbMF07XG4gICAgICAgIHZhciBuYW1lc3BhY2UgPSBldmVudCA/IG5hbWVzcGFjZWRFdmVudC5zdWJzdHJpbmcoZXZlbnQubGVuZ3RoKSA6IG5hbWVzcGFjZWRFdmVudDtcbiAgICAgICAgT2JqZWN0LmtleXMoc2NvcGVfRXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChiaW5kKSB7XG4gICAgICAgICAgICB2YXIgdEV2ZW50ID0gYmluZC5zcGxpdChcIi5cIilbMF07XG4gICAgICAgICAgICB2YXIgdE5hbWVzcGFjZSA9IGJpbmQuc3Vic3RyaW5nKHRFdmVudC5sZW5ndGgpO1xuICAgICAgICAgICAgaWYgKCghZXZlbnQgfHwgZXZlbnQgPT09IHRFdmVudCkgJiYgKCFuYW1lc3BhY2UgfHwgbmFtZXNwYWNlID09PSB0TmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgIC8vIG9ubHkgZGVsZXRlIHByb3RlY3RlZCBpbnRlcm5hbCBldmVudCBpZiBpbnRlbnRpb25hbFxuICAgICAgICAgICAgICAgIGlmICghaXNJbnRlcm5hbE5hbWVzcGFjZSh0TmFtZXNwYWNlKSB8fCBuYW1lc3BhY2UgPT09IHROYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlX0V2ZW50c1tiaW5kXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBFeHRlcm5hbCBldmVudCBoYW5kbGluZ1xuICAgIGZ1bmN0aW9uIGZpcmVFdmVudChldmVudE5hbWUsIGhhbmRsZU51bWJlciwgdGFwKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHNjb3BlX0V2ZW50cykuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0RXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBldmVudFR5cGUgPSB0YXJnZXRFdmVudC5zcGxpdChcIi5cIilbMF07XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lID09PSBldmVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICBzY29wZV9FdmVudHNbdGFyZ2V0RXZlbnRdLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgc2xpZGVyIHB1YmxpYyBBUEkgYXMgdGhlIHNjb3BlICgndGhpcycpXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlX1NlbGYsIFxuICAgICAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdmFsdWVzIGFzIGFycmF5LCBzbyBhcmdfMVthcmdfMl0gaXMgYWx3YXlzIHZhbGlkLlxuICAgICAgICAgICAgICAgICAgICBzY29wZV9WYWx1ZXMubWFwKG9wdGlvbnMuZm9ybWF0LnRvKSwgXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBpbmRleCwgMCBvciAxXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgIC8vIFVuLWZvcm1hdHRlZCBzbGlkZXIgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlX1ZhbHVlcy5zbGljZSgpLCBcbiAgICAgICAgICAgICAgICAgICAgLy8gRXZlbnQgaXMgZmlyZWQgYnkgdGFwLCB0cnVlIG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHRhcCB8fCBmYWxzZSwgXG4gICAgICAgICAgICAgICAgICAgIC8vIExlZnQgb2Zmc2V0IG9mIHRoZSBoYW5kbGUsIGluIHJlbGF0aW9uIHRvIHRoZSBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVfTG9jYXRpb25zLnNsaWNlKCksIFxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIHNsaWRlciBwdWJsaWMgQVBJIHRvIGFuIGFjY2Vzc2libGUgcGFyYW1ldGVyIHdoZW4gdGhpcyBpcyB1bmF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICBzY29wZV9TZWxmKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFNwbGl0IG91dCB0aGUgaGFuZGxlIHBvc2l0aW9uaW5nIGxvZ2ljIHNvIHRoZSBNb3ZlIGV2ZW50IGNhbiB1c2UgaXQsIHRvb1xuICAgIGZ1bmN0aW9uIGNoZWNrSGFuZGxlUG9zaXRpb24ocmVmZXJlbmNlLCBoYW5kbGVOdW1iZXIsIHRvLCBsb29rQmFja3dhcmQsIGxvb2tGb3J3YXJkLCBnZXRWYWx1ZSwgc21vb3RoU3RlcHMpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlO1xuICAgICAgICAvLyBGb3Igc2xpZGVycyB3aXRoIG11bHRpcGxlIGhhbmRsZXMsIGxpbWl0IG1vdmVtZW50IHRvIHRoZSBvdGhlciBoYW5kbGUuXG4gICAgICAgIC8vIEFwcGx5IHRoZSBtYXJnaW4gb3B0aW9uIGJ5IGFkZGluZyBpdCB0byB0aGUgaGFuZGxlIHBvc2l0aW9ucy5cbiAgICAgICAgaWYgKHNjb3BlX0hhbmRsZXMubGVuZ3RoID4gMSAmJiAhb3B0aW9ucy5ldmVudHMudW5jb25zdHJhaW5lZCkge1xuICAgICAgICAgICAgaWYgKGxvb2tCYWNrd2FyZCAmJiBoYW5kbGVOdW1iZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBzY29wZV9TcGVjdHJ1bS5nZXRBYnNvbHV0ZURpc3RhbmNlKHJlZmVyZW5jZVtoYW5kbGVOdW1iZXIgLSAxXSwgb3B0aW9ucy5tYXJnaW4sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0byA9IE1hdGgubWF4KHRvLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9va0ZvcndhcmQgJiYgaGFuZGxlTnVtYmVyIDwgc2NvcGVfSGFuZGxlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBzY29wZV9TcGVjdHJ1bS5nZXRBYnNvbHV0ZURpc3RhbmNlKHJlZmVyZW5jZVtoYW5kbGVOdW1iZXIgKyAxXSwgb3B0aW9ucy5tYXJnaW4sIHRydWUpO1xuICAgICAgICAgICAgICAgIHRvID0gTWF0aC5taW4odG8sIGRpc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGUgbGltaXQgb3B0aW9uIGhhcyB0aGUgb3Bwb3NpdGUgZWZmZWN0LCBsaW1pdGluZyBoYW5kbGVzIHRvIGFcbiAgICAgICAgLy8gbWF4aW11bSBkaXN0YW5jZSBmcm9tIGFub3RoZXIuIExpbWl0IG11c3QgYmUgPiAwLCBhcyBvdGhlcndpc2VcbiAgICAgICAgLy8gaGFuZGxlcyB3b3VsZCBiZSB1bm1vdmFibGUuXG4gICAgICAgIGlmIChzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEgJiYgb3B0aW9ucy5saW1pdCkge1xuICAgICAgICAgICAgaWYgKGxvb2tCYWNrd2FyZCAmJiBoYW5kbGVOdW1iZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBzY29wZV9TcGVjdHJ1bS5nZXRBYnNvbHV0ZURpc3RhbmNlKHJlZmVyZW5jZVtoYW5kbGVOdW1iZXIgLSAxXSwgb3B0aW9ucy5saW1pdCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRvID0gTWF0aC5taW4odG8sIGRpc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb29rRm9yd2FyZCAmJiBoYW5kbGVOdW1iZXIgPCBzY29wZV9IYW5kbGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHNjb3BlX1NwZWN0cnVtLmdldEFic29sdXRlRGlzdGFuY2UocmVmZXJlbmNlW2hhbmRsZU51bWJlciArIDFdLCBvcHRpb25zLmxpbWl0LCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0byA9IE1hdGgubWF4KHRvLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIHBhZGRpbmcgb3B0aW9uIGtlZXBzIHRoZSBoYW5kbGVzIGEgY2VydGFpbiBkaXN0YW5jZSBmcm9tIHRoZVxuICAgICAgICAvLyBlZGdlcyBvZiB0aGUgc2xpZGVyLiBQYWRkaW5nIG11c3QgYmUgPiAwLlxuICAgICAgICBpZiAob3B0aW9ucy5wYWRkaW5nKSB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlTnVtYmVyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBzY29wZV9TcGVjdHJ1bS5nZXRBYnNvbHV0ZURpc3RhbmNlKDAsIG9wdGlvbnMucGFkZGluZ1swXSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRvID0gTWF0aC5tYXgodG8sIGRpc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYW5kbGVOdW1iZXIgPT09IHNjb3BlX0hhbmRsZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gc2NvcGVfU3BlY3RydW0uZ2V0QWJzb2x1dGVEaXN0YW5jZSgxMDAsIG9wdGlvbnMucGFkZGluZ1sxXSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdG8gPSBNYXRoLm1pbih0bywgZGlzdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghc21vb3RoU3RlcHMpIHtcbiAgICAgICAgICAgIHRvID0gc2NvcGVfU3BlY3RydW0uZ2V0U3RlcCh0byk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGltaXQgcGVyY2VudGFnZSB0byB0aGUgMCAtIDEwMCByYW5nZVxuICAgICAgICB0byA9IGxpbWl0KHRvKTtcbiAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGhhbmRsZSBjYW4ndCBtb3ZlXG4gICAgICAgIGlmICh0byA9PT0gcmVmZXJlbmNlW2hhbmRsZU51bWJlcl0gJiYgIWdldFZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgICAvLyBVc2VzIHNsaWRlciBvcmllbnRhdGlvbiB0byBjcmVhdGUgQ1NTIHJ1bGVzLiBhID0gYmFzZSB2YWx1ZTtcbiAgICBmdW5jdGlvbiBpblJ1bGVPcmRlcih2LCBhKSB7XG4gICAgICAgIHZhciBvID0gb3B0aW9ucy5vcnQ7XG4gICAgICAgIHJldHVybiAobyA/IGEgOiB2KSArIFwiLCBcIiArIChvID8gdiA6IGEpO1xuICAgIH1cbiAgICAvLyBNb3ZlcyBoYW5kbGUocykgYnkgYSBwZXJjZW50YWdlXG4gICAgLy8gKGJvb2wsICUgdG8gbW92ZSwgWyUgd2hlcmUgaGFuZGxlIHN0YXJ0ZWQsIC4uLl0sIFtpbmRleCBpbiBzY29wZV9IYW5kbGVzLCAuLi5dKVxuICAgIGZ1bmN0aW9uIG1vdmVIYW5kbGVzKHVwd2FyZCwgcHJvcG9zYWwsIGxvY2F0aW9ucywgaGFuZGxlTnVtYmVycywgY29ubmVjdCkge1xuICAgICAgICB2YXIgcHJvcG9zYWxzID0gbG9jYXRpb25zLnNsaWNlKCk7XG4gICAgICAgIC8vIFN0b3JlIGZpcnN0IGhhbmRsZSBub3csIHNvIHdlIHN0aWxsIGhhdmUgaXQgaW4gY2FzZSBoYW5kbGVOdW1iZXJzIGlzIHJldmVyc2VkXG4gICAgICAgIHZhciBmaXJzdEhhbmRsZSA9IGhhbmRsZU51bWJlcnNbMF07XG4gICAgICAgIHZhciBzbW9vdGhTdGVwcyA9IG9wdGlvbnMuZXZlbnRzLnNtb290aFN0ZXBzO1xuICAgICAgICB2YXIgYiA9IFshdXB3YXJkLCB1cHdhcmRdO1xuICAgICAgICB2YXIgZiA9IFt1cHdhcmQsICF1cHdhcmRdO1xuICAgICAgICAvLyBDb3B5IGhhbmRsZU51bWJlcnMgc28gd2UgZG9uJ3QgY2hhbmdlIHRoZSBkYXRhc2V0XG4gICAgICAgIGhhbmRsZU51bWJlcnMgPSBoYW5kbGVOdW1iZXJzLnNsaWNlKCk7XG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSB3aGljaCBoYW5kbGUgaXMgJ2xlYWRpbmcnLlxuICAgICAgICAvLyBJZiB0aGF0IG9uZSBjYW4ndCBtb3ZlIHRoZSBzZWNvbmQgY2FuJ3QgZWl0aGVyLlxuICAgICAgICBpZiAodXB3YXJkKSB7XG4gICAgICAgICAgICBoYW5kbGVOdW1iZXJzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGVwIDE6IGdldCB0aGUgbWF4aW11bSBwZXJjZW50YWdlIHRoYXQgYW55IG9mIHRoZSBoYW5kbGVzIGNhbiBtb3ZlXG4gICAgICAgIGlmIChoYW5kbGVOdW1iZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyLCBvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvID0gY2hlY2tIYW5kbGVQb3NpdGlvbihwcm9wb3NhbHMsIGhhbmRsZU51bWJlciwgcHJvcG9zYWxzW2hhbmRsZU51bWJlcl0gKyBwcm9wb3NhbCwgYltvXSwgZltvXSwgZmFsc2UsIHNtb290aFN0ZXBzKTtcbiAgICAgICAgICAgICAgICAvLyBTdG9wIGlmIG9uZSBvZiB0aGUgaGFuZGxlcyBjYW4ndCBtb3ZlLlxuICAgICAgICAgICAgICAgIGlmICh0byA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcG9zYWwgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcG9zYWwgPSB0byAtIHByb3Bvc2Fsc1toYW5kbGVOdW1iZXJdO1xuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbHNbaGFuZGxlTnVtYmVyXSA9IHRvO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHVzaW5nIG9uZSBoYW5kbGUsIGNoZWNrIGJhY2t3YXJkIEFORCBmb3J3YXJkXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYiA9IGYgPSBbdHJ1ZV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXRlID0gZmFsc2U7XG4gICAgICAgIC8vIFN0ZXAgMjogVHJ5IHRvIHNldCB0aGUgaGFuZGxlcyB3aXRoIHRoZSBmb3VuZCBwZXJjZW50YWdlXG4gICAgICAgIGhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlTnVtYmVyLCBvKSB7XG4gICAgICAgICAgICBzdGF0ZSA9XG4gICAgICAgICAgICAgICAgc2V0SGFuZGxlKGhhbmRsZU51bWJlciwgbG9jYXRpb25zW2hhbmRsZU51bWJlcl0gKyBwcm9wb3NhbCwgYltvXSwgZltvXSwgZmFsc2UsIHNtb290aFN0ZXBzKSB8fCBzdGF0ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFN0ZXAgMzogSWYgYSBoYW5kbGUgbW92ZWQsIGZpcmUgZXZlbnRzXG4gICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoXCJzbGlkZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBJZiB0YXJnZXQgaXMgYSBjb25uZWN0LCB0aGVuIGZpcmUgZHJhZyBldmVudFxuICAgICAgICAgICAgaWYgKGNvbm5lY3QgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KFwiZHJhZ1wiLCBmaXJzdEhhbmRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVGFrZXMgYSBiYXNlIHZhbHVlIGFuZCBhbiBvZmZzZXQuIFRoaXMgb2Zmc2V0IGlzIHVzZWQgZm9yIHRoZSBjb25uZWN0IGJhciBzaXplLlxuICAgIC8vIEluIHRoZSBpbml0aWFsIGRlc2lnbiBmb3IgdGhpcyBmZWF0dXJlLCB0aGUgb3JpZ2luIGVsZW1lbnQgd2FzIDElIHdpZGUuXG4gICAgLy8gVW5mb3J0dW5hdGVseSwgYSByb3VuZGluZyBidWcgaW4gQ2hyb21lIG1ha2VzIGl0IGltcG9zc2libGUgdG8gaW1wbGVtZW50IHRoaXMgZmVhdHVyZVxuICAgIC8vIGluIHRoaXMgbWFubmVyOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD03OTgyMjNcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1EaXJlY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5kaXIgPyAxMDAgLSBhIC0gYiA6IGE7XG4gICAgfVxuICAgIC8vIFVwZGF0ZXMgc2NvcGVfTG9jYXRpb25zIGFuZCBzY29wZV9WYWx1ZXMsIHVwZGF0ZXMgdmlzdWFsIHN0YXRlXG4gICAgZnVuY3Rpb24gdXBkYXRlSGFuZGxlUG9zaXRpb24oaGFuZGxlTnVtYmVyLCB0bykge1xuICAgICAgICAvLyBVcGRhdGUgbG9jYXRpb25zLlxuICAgICAgICBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSA9IHRvO1xuICAgICAgICAvLyBDb252ZXJ0IHRoZSB2YWx1ZSB0byB0aGUgc2xpZGVyIHN0ZXBwaW5nL3JhbmdlLlxuICAgICAgICBzY29wZV9WYWx1ZXNbaGFuZGxlTnVtYmVyXSA9IHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyh0byk7XG4gICAgICAgIHZhciB0cmFuc2xhdGlvbiA9IHRyYW5zZm9ybURpcmVjdGlvbih0bywgMCkgLSBzY29wZV9EaXJPZmZzZXQ7XG4gICAgICAgIHZhciB0cmFuc2xhdGVSdWxlID0gXCJ0cmFuc2xhdGUoXCIgKyBpblJ1bGVPcmRlcih0cmFuc2xhdGlvbiArIFwiJVwiLCBcIjBcIikgKyBcIilcIjtcbiAgICAgICAgc2NvcGVfSGFuZGxlc1toYW5kbGVOdW1iZXJdLnN0eWxlW29wdGlvbnMudHJhbnNmb3JtUnVsZV0gPSB0cmFuc2xhdGVSdWxlO1xuICAgICAgICAvLyBzYW5pdHkgY2hlY2sgZm9yIGF0IGxlYXN0IDIgaGFuZGxlcyAoZS5nLiBkdXJpbmcgc2V0dXApXG4gICAgICAgIGlmIChvcHRpb25zLmV2ZW50cy5pbnZlcnRDb25uZWN0cyAmJiBzY29wZV9Mb2NhdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaGFuZGxlcyBwYXNzZWQgZWFjaCBvdGhlciwgYnV0IGRvbid0IG1hdGNoIHRoZSBDb25uZWN0c0ludmVydGVkIHN0YXRlXG4gICAgICAgICAgICB2YXIgaGFuZGxlc0FyZUluT3JkZXIgPSBzY29wZV9Mb2NhdGlvbnMuZXZlcnkoZnVuY3Rpb24gKHBvc2l0aW9uLCBpbmRleCwgbG9jYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSAwIHx8IHBvc2l0aW9uID49IGxvY2F0aW9uc1tpbmRleCAtIDFdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc2NvcGVfQ29ubmVjdHNJbnZlcnRlZCAhPT0gIWhhbmRsZXNBcmVJbk9yZGVyKSB7XG4gICAgICAgICAgICAgICAgLy8gaW52ZXJ0IGNvbm5lY3RzIHdoZW4gaGFuZGxlcyBwYXNzIGVhY2ggb3RoZXJcbiAgICAgICAgICAgICAgICBpbnZlcnRDb25uZWN0cygpO1xuICAgICAgICAgICAgICAgIC8vIGludmVydENvbm5lY3RzIGFscmVhZHkgdXBkYXRlcyBhbGwgY29ubmVjdCBlbGVtZW50c1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVDb25uZWN0KGhhbmRsZU51bWJlcik7XG4gICAgICAgIHVwZGF0ZUNvbm5lY3QoaGFuZGxlTnVtYmVyICsgMSk7XG4gICAgICAgIGlmIChzY29wZV9Db25uZWN0c0ludmVydGVkKSB7XG4gICAgICAgICAgICAvLyBXaGVuIGNvbm5lY3RzIGFyZSBpbnZlcnRlZCwgd2UgYWxzbyBoYXZlIHRvIHVwZGF0ZSBhZGphY2VudCBjb25uZWN0c1xuICAgICAgICAgICAgdXBkYXRlQ29ubmVjdChoYW5kbGVOdW1iZXIgLSAxKTtcbiAgICAgICAgICAgIHVwZGF0ZUNvbm5lY3QoaGFuZGxlTnVtYmVyICsgMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSGFuZGxlcyBiZWZvcmUgdGhlIHNsaWRlciBtaWRkbGUgYXJlIHN0YWNrZWQgbGF0ZXIgPSBoaWdoZXIsXG4gICAgLy8gSGFuZGxlcyBhZnRlciB0aGUgbWlkZGxlIGxhdGVyIGlzIGxvd2VyXG4gICAgLy8gW1s3XSBbOF0gLi4uLi4uLi4uLiB8IC4uLi4uLi4uLi4gWzVdIFs0XVxuICAgIGZ1bmN0aW9uIHNldFppbmRleCgpIHtcbiAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBkaXIgPSBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSA+IDUwID8gLTEgOiAxO1xuICAgICAgICAgICAgdmFyIHpJbmRleCA9IDMgKyAoc2NvcGVfSGFuZGxlcy5sZW5ndGggKyBkaXIgKiBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgc2NvcGVfSGFuZGxlc1toYW5kbGVOdW1iZXJdLnN0eWxlLnpJbmRleCA9IFN0cmluZyh6SW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gVGVzdCBzdWdnZXN0ZWQgdmFsdWVzIGFuZCBhcHBseSBtYXJnaW4sIHN0ZXAuXG4gICAgLy8gaWYgZXhhY3RJbnB1dCBpcyB0cnVlLCBkb24ndCBydW4gY2hlY2tIYW5kbGVQb3NpdGlvbiwgdGhlbiB0aGUgaGFuZGxlIGNhbiBiZSBwbGFjZWQgaW4gYmV0d2VlbiBzdGVwcyAoIzQzNilcbiAgICBmdW5jdGlvbiBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCB0bywgbG9va0JhY2t3YXJkLCBsb29rRm9yd2FyZCwgZXhhY3RJbnB1dCwgc21vb3RoU3RlcHMpIHtcbiAgICAgICAgaWYgKCFleGFjdElucHV0KSB7XG4gICAgICAgICAgICB0byA9IGNoZWNrSGFuZGxlUG9zaXRpb24oc2NvcGVfTG9jYXRpb25zLCBoYW5kbGVOdW1iZXIsIHRvLCBsb29rQmFja3dhcmQsIGxvb2tGb3J3YXJkLCBmYWxzZSwgc21vb3RoU3RlcHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0byA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVIYW5kbGVQb3NpdGlvbihoYW5kbGVOdW1iZXIsIHRvKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIFVwZGF0ZXMgc3R5bGUgYXR0cmlidXRlIGZvciBjb25uZWN0IG5vZGVzXG4gICAgZnVuY3Rpb24gdXBkYXRlQ29ubmVjdChpbmRleCkge1xuICAgICAgICAvLyBTa2lwIGNvbm5lY3RzIHNldCB0byBmYWxzZVxuICAgICAgICBpZiAoIXNjb3BlX0Nvbm5lY3RzW2luZGV4XSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgbG9jYXRpb25zLCBzbyB3ZSBjYW4gc29ydCB0aGVtIGZvciB0aGUgbG9jYWwgc2NvcGUgbG9naWNcbiAgICAgICAgdmFyIGxvY2F0aW9ucyA9IHNjb3BlX0xvY2F0aW9ucy5zbGljZSgpO1xuICAgICAgICBpZiAoc2NvcGVfQ29ubmVjdHNJbnZlcnRlZCkge1xuICAgICAgICAgICAgbG9jYXRpb25zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbCA9IDA7XG4gICAgICAgIHZhciBoID0gMTAwO1xuICAgICAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgICAgIGwgPSBsb2NhdGlvbnNbaW5kZXggLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggIT09IHNjb3BlX0Nvbm5lY3RzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGggPSBsb2NhdGlvbnNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlIHVzZSB0d28gcnVsZXM6XG4gICAgICAgIC8vICd0cmFuc2xhdGUnIHRvIGNoYW5nZSB0aGUgbGVmdC90b3Agb2Zmc2V0O1xuICAgICAgICAvLyAnc2NhbGUnIHRvIGNoYW5nZSB0aGUgd2lkdGggb2YgdGhlIGVsZW1lbnQ7XG4gICAgICAgIC8vIEFzIHRoZSBlbGVtZW50IGhhcyBhIHdpZHRoIG9mIDEwMCUsIGEgdHJhbnNsYXRpb24gb2YgMTAwJSBpcyBlcXVhbCB0byAxMDAlIG9mIHRoZSBwYXJlbnQgKC5ub1VpLWJhc2UpXG4gICAgICAgIHZhciBjb25uZWN0V2lkdGggPSBoIC0gbDtcbiAgICAgICAgdmFyIHRyYW5zbGF0ZVJ1bGUgPSBcInRyYW5zbGF0ZShcIiArIGluUnVsZU9yZGVyKHRyYW5zZm9ybURpcmVjdGlvbihsLCBjb25uZWN0V2lkdGgpICsgXCIlXCIsIFwiMFwiKSArIFwiKVwiO1xuICAgICAgICB2YXIgc2NhbGVSdWxlID0gXCJzY2FsZShcIiArIGluUnVsZU9yZGVyKGNvbm5lY3RXaWR0aCAvIDEwMCwgXCIxXCIpICsgXCIpXCI7XG4gICAgICAgIHNjb3BlX0Nvbm5lY3RzW2luZGV4XS5zdHlsZVtvcHRpb25zLnRyYW5zZm9ybVJ1bGVdID1cbiAgICAgICAgICAgIHRyYW5zbGF0ZVJ1bGUgKyBcIiBcIiArIHNjYWxlUnVsZTtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHZhbHVlIHBhc3NlZCB0byAuc2V0IG1ldGhvZC4gUmV0dXJucyBjdXJyZW50IHZhbHVlIGlmIG5vdCBwYXJzZS1hYmxlLlxuICAgIGZ1bmN0aW9uIHJlc29sdmVUb1ZhbHVlKHRvLCBoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgLy8gU2V0dGluZyB3aXRoIG51bGwgaW5kaWNhdGVzIGFuICdpZ25vcmUnLlxuICAgICAgICAvLyBJbnB1dHRpbmcgJ2ZhbHNlJyBpcyBpbnZhbGlkLlxuICAgICAgICBpZiAodG8gPT09IG51bGwgfHwgdG8gPT09IGZhbHNlIHx8IHRvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBhIGZvcm1hdHRlZCBudW1iZXIgd2FzIHBhc3NlZCwgYXR0ZW1wdCB0byBkZWNvZGUgaXQuXG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRvID0gU3RyaW5nKHRvKTtcbiAgICAgICAgfVxuICAgICAgICB0byA9IG9wdGlvbnMuZm9ybWF0LmZyb20odG8pO1xuICAgICAgICBpZiAodG8gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0byA9IHNjb3BlX1NwZWN0cnVtLnRvU3RlcHBpbmcodG8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHBhcnNpbmcgdGhlIG51bWJlciBmYWlsZWQsIHVzZSB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICAgICAgaWYgKHRvID09PSBmYWxzZSB8fCBpc05hTih0bykpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG87XG4gICAgfVxuICAgIC8vIFNldCB0aGUgc2xpZGVyIHZhbHVlLlxuICAgIGZ1bmN0aW9uIHZhbHVlU2V0KGlucHV0LCBmaXJlU2V0RXZlbnQsIGV4YWN0SW5wdXQpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IGFzQXJyYXkoaW5wdXQpO1xuICAgICAgICB2YXIgaXNJbml0ID0gc2NvcGVfTG9jYXRpb25zWzBdID09PSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIEV2ZW50IGZpcmVzIGJ5IGRlZmF1bHRcbiAgICAgICAgZmlyZVNldEV2ZW50ID0gZmlyZVNldEV2ZW50ID09PSB1bmRlZmluZWQgPyB0cnVlIDogZmlyZVNldEV2ZW50O1xuICAgICAgICAvLyBBbmltYXRpb24gaXMgb3B0aW9uYWwuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgaW5pdGlhbCB2YWx1ZXMgd2VyZSBzZXQgYmVmb3JlIHVzaW5nIGFuaW1hdGVkIHBsYWNlbWVudC5cbiAgICAgICAgaWYgKG9wdGlvbnMuYW5pbWF0ZSAmJiAhaXNJbml0KSB7XG4gICAgICAgICAgICBhZGRDbGFzc0ZvcihzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50YXAsIG9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZpcnN0IHBhc3MsIHdpdGhvdXQgbG9va0FoZWFkIGJ1dCB3aXRoIGxvb2tCYWNrd2FyZC4gVmFsdWVzIGFyZSBzZXQgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgICAgICBzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgc2V0SGFuZGxlKGhhbmRsZU51bWJlciwgcmVzb2x2ZVRvVmFsdWUodmFsdWVzW2hhbmRsZU51bWJlcl0sIGhhbmRsZU51bWJlciksIHRydWUsIGZhbHNlLCBleGFjdElucHV0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBpID0gc2NvcGVfSGFuZGxlTnVtYmVycy5sZW5ndGggPT09IDEgPyAwIDogMTtcbiAgICAgICAgLy8gU3ByZWFkIGhhbmRsZXMgZXZlbmx5IGFjcm9zcyB0aGUgc2xpZGVyIGlmIHRoZSByYW5nZSBoYXMgbm8gc2l6ZSAobWluPW1heClcbiAgICAgICAgaWYgKGlzSW5pdCAmJiBzY29wZV9TcGVjdHJ1bS5oYXNOb1NpemUoKSkge1xuICAgICAgICAgICAgZXhhY3RJbnB1dCA9IHRydWU7XG4gICAgICAgICAgICBzY29wZV9Mb2NhdGlvbnNbMF0gPSAwO1xuICAgICAgICAgICAgaWYgKHNjb3BlX0hhbmRsZU51bWJlcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHZhciBzcGFjZV8xID0gMTAwIC8gKHNjb3BlX0hhbmRsZU51bWJlcnMubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl0gPSBoYW5kbGVOdW1iZXIgKiBzcGFjZV8xO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFNlY29uZGFyeSBwYXNzZXMuIE5vdyB0aGF0IGFsbCBiYXNlIHZhbHVlcyBhcmUgc2V0LCBhcHBseSBjb25zdHJhaW50cy5cbiAgICAgICAgLy8gSXRlcmF0ZSBhbGwgaGFuZGxlcyB0byBlbnN1cmUgY29uc3RyYWludHMgYXJlIGFwcGxpZWQgZm9yIHRoZSBlbnRpcmUgc2xpZGVyIChJc3N1ZSAjMTAwOSlcbiAgICAgICAgZm9yICg7IGkgPCBzY29wZV9IYW5kbGVOdW1iZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdLCB0cnVlLCB0cnVlLCBleGFjdElucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNldFppbmRleCgpO1xuICAgICAgICBzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgZmlyZUV2ZW50KFwidXBkYXRlXCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgICAgICAvLyBGaXJlIHRoZSBldmVudCBvbmx5IGZvciBoYW5kbGVzIHRoYXQgcmVjZWl2ZWQgYSBuZXcgdmFsdWUsIGFzIHBlciAjNTc5XG4gICAgICAgICAgICBpZiAodmFsdWVzW2hhbmRsZU51bWJlcl0gIT09IG51bGwgJiYgZmlyZVNldEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KFwic2V0XCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBSZXNldCBzbGlkZXIgdG8gaW5pdGlhbCB2YWx1ZXNcbiAgICBmdW5jdGlvbiB2YWx1ZVJlc2V0KGZpcmVTZXRFdmVudCkge1xuICAgICAgICB2YWx1ZVNldChvcHRpb25zLnN0YXJ0LCBmaXJlU2V0RXZlbnQpO1xuICAgIH1cbiAgICAvLyBTZXQgdmFsdWUgZm9yIGEgc2luZ2xlIGhhbmRsZVxuICAgIGZ1bmN0aW9uIHZhbHVlU2V0SGFuZGxlKGhhbmRsZU51bWJlciwgdmFsdWUsIGZpcmVTZXRFdmVudCwgZXhhY3RJbnB1dCkge1xuICAgICAgICAvLyBFbnN1cmUgbnVtZXJpYyBpbnB1dFxuICAgICAgICBoYW5kbGVOdW1iZXIgPSBOdW1iZXIoaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgaWYgKCEoaGFuZGxlTnVtYmVyID49IDAgJiYgaGFuZGxlTnVtYmVyIDwgc2NvcGVfSGFuZGxlTnVtYmVycy5sZW5ndGgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiBpbnZhbGlkIGhhbmRsZSBudW1iZXIsIGdvdDogXCIgKyBoYW5kbGVOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvb2sgYm90aCBiYWNrd2FyZCBhbmQgZm9yd2FyZCwgc2luY2Ugd2UgZG9uJ3Qgd2FudCB0aGlzIGhhbmRsZSB0byBcInB1c2hcIiBvdGhlciBoYW5kbGVzICgjOTYwKTtcbiAgICAgICAgLy8gVGhlIGV4YWN0SW5wdXQgYXJndW1lbnQgY2FuIGJlIHVzZWQgdG8gaWdub3JlIHNsaWRlciBzdGVwcGluZyAoIzQzNilcbiAgICAgICAgc2V0SGFuZGxlKGhhbmRsZU51bWJlciwgcmVzb2x2ZVRvVmFsdWUodmFsdWUsIGhhbmRsZU51bWJlciksIHRydWUsIHRydWUsIGV4YWN0SW5wdXQpO1xuICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaGFuZGxlTnVtYmVyKTtcbiAgICAgICAgaWYgKGZpcmVTZXRFdmVudCkge1xuICAgICAgICAgICAgZmlyZUV2ZW50KFwic2V0XCIsIGhhbmRsZU51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gR2V0IHRoZSBzbGlkZXIgdmFsdWUuXG4gICAgZnVuY3Rpb24gdmFsdWVHZXQodW5lbmNvZGVkKSB7XG4gICAgICAgIGlmICh1bmVuY29kZWQgPT09IHZvaWQgMCkgeyB1bmVuY29kZWQgPSBmYWxzZTsgfVxuICAgICAgICBpZiAodW5lbmNvZGVkKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gYSBjb3B5IG9mIHRoZSByYXcgdmFsdWVzXG4gICAgICAgICAgICByZXR1cm4gc2NvcGVfVmFsdWVzLmxlbmd0aCA9PT0gMSA/IHNjb3BlX1ZhbHVlc1swXSA6IHNjb3BlX1ZhbHVlcy5zbGljZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmFsdWVzID0gc2NvcGVfVmFsdWVzLm1hcChvcHRpb25zLmZvcm1hdC50byk7XG4gICAgICAgIC8vIElmIG9ubHkgb25lIGhhbmRsZSBpcyB1c2VkLCByZXR1cm4gYSBzaW5nbGUgdmFsdWUuXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICAgIC8vIFJlbW92ZXMgY2xhc3NlcyBmcm9tIHRoZSByb290IGFuZCBlbXB0aWVzIGl0LlxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIHJlbW92ZSBwcm90ZWN0ZWQgaW50ZXJuYWwgbGlzdGVuZXJzXG4gICAgICAgIHJlbW92ZUV2ZW50KElOVEVSTkFMX0VWRU5UX05TLmFyaWEpO1xuICAgICAgICByZW1vdmVFdmVudChJTlRFUk5BTF9FVkVOVF9OUy50b29sdGlwcyk7XG4gICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuY3NzQ2xhc3NlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZW1vdmVDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlc1trZXldKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdoaWxlIChzY29wZV9UYXJnZXQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgc2NvcGVfVGFyZ2V0LnJlbW92ZUNoaWxkKHNjb3BlX1RhcmdldC5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgc2NvcGVfVGFyZ2V0Lm5vVWlTbGlkZXI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5leHRTdGVwc0ZvckhhbmRsZShoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl07XG4gICAgICAgIHZhciBuZWFyYnlTdGVwcyA9IHNjb3BlX1NwZWN0cnVtLmdldE5lYXJieVN0ZXBzKGxvY2F0aW9uKTtcbiAgICAgICAgdmFyIHZhbHVlID0gc2NvcGVfVmFsdWVzW2hhbmRsZU51bWJlcl07XG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSBuZWFyYnlTdGVwcy50aGlzU3RlcC5zdGVwO1xuICAgICAgICB2YXIgZGVjcmVtZW50ID0gbnVsbDtcbiAgICAgICAgLy8gSWYgc25hcHBlZCwgZGlyZWN0bHkgdXNlIGRlZmluZWQgc3RlcCB2YWx1ZVxuICAgICAgICBpZiAob3B0aW9ucy5zbmFwKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHZhbHVlIC0gbmVhcmJ5U3RlcHMuc3RlcEJlZm9yZS5zdGFydFZhbHVlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbmVhcmJ5U3RlcHMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUgLSB2YWx1ZSB8fCBudWxsLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgbmV4dCB2YWx1ZSBpbiB0aGlzIHN0ZXAgbW92ZXMgaW50byB0aGUgbmV4dCBzdGVwLFxuICAgICAgICAvLyB0aGUgaW5jcmVtZW50IGlzIHRoZSBzdGFydCBvZiB0aGUgbmV4dCBzdGVwIC0gdGhlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgaWYgKGluY3JlbWVudCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSArIGluY3JlbWVudCA+IG5lYXJieVN0ZXBzLnN0ZXBBZnRlci5zdGFydFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaW5jcmVtZW50ID0gbmVhcmJ5U3RlcHMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUgLSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgdmFsdWUgaXMgYmV5b25kIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICBpZiAodmFsdWUgPiBuZWFyYnlTdGVwcy50aGlzU3RlcC5zdGFydFZhbHVlKSB7XG4gICAgICAgICAgICBkZWNyZW1lbnQgPSBuZWFyYnlTdGVwcy50aGlzU3RlcC5zdGVwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5lYXJieVN0ZXBzLnN0ZXBCZWZvcmUuc3RlcCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlY3JlbWVudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGEgaGFuZGxlIGlzIGF0IHRoZSBzdGFydCBvZiBhIHN0ZXAsIGl0IGFsd2F5cyBzdGVwcyBiYWNrIGludG8gdGhlIHByZXZpb3VzIHN0ZXAgZmlyc3RcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWNyZW1lbnQgPSB2YWx1ZSAtIG5lYXJieVN0ZXBzLnN0ZXBCZWZvcmUuaGlnaGVzdFN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm93LCBpZiBhdCB0aGUgc2xpZGVyIGVkZ2VzLCB0aGVyZSBpcyBubyBpbi9kZWNyZW1lbnRcbiAgICAgICAgaWYgKGxvY2F0aW9uID09PSAxMDApIHtcbiAgICAgICAgICAgIGluY3JlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobG9jYXRpb24gPT09IDApIHtcbiAgICAgICAgICAgIGRlY3JlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXMgcGVyICMzOTEsIHRoZSBjb21wYXJpc29uIGZvciB0aGUgZGVjcmVtZW50IHN0ZXAgY2FuIGhhdmUgc29tZSByb3VuZGluZyBpc3N1ZXMuXG4gICAgICAgIHZhciBzdGVwRGVjaW1hbHMgPSBzY29wZV9TcGVjdHJ1bS5jb3VudFN0ZXBEZWNpbWFscygpO1xuICAgICAgICAvLyBSb3VuZCBwZXIgIzM5MVxuICAgICAgICBpZiAoaW5jcmVtZW50ICE9PSBudWxsICYmIGluY3JlbWVudCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGluY3JlbWVudCA9IE51bWJlcihpbmNyZW1lbnQudG9GaXhlZChzdGVwRGVjaW1hbHMpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVjcmVtZW50ICE9PSBudWxsICYmIGRlY3JlbWVudCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlY3JlbWVudCA9IE51bWJlcihkZWNyZW1lbnQudG9GaXhlZChzdGVwRGVjaW1hbHMpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2RlY3JlbWVudCwgaW5jcmVtZW50XTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSBjdXJyZW50IHN0ZXAgc2l6ZSBmb3IgdGhlIHNsaWRlci5cbiAgICBmdW5jdGlvbiBnZXROZXh0U3RlcHMoKSB7XG4gICAgICAgIHJldHVybiBzY29wZV9IYW5kbGVOdW1iZXJzLm1hcChnZXROZXh0U3RlcHNGb3JIYW5kbGUpO1xuICAgIH1cbiAgICAvLyBVcGRhdGFibGU6IG1hcmdpbiwgbGltaXQsIHBhZGRpbmcsIHN0ZXAsIHJhbmdlLCBhbmltYXRlLCBzbmFwXG4gICAgZnVuY3Rpb24gdXBkYXRlT3B0aW9ucyhvcHRpb25zVG9VcGRhdGUsIGZpcmVTZXRFdmVudCkge1xuICAgICAgICAvLyBTcGVjdHJ1bSBpcyBjcmVhdGVkIHVzaW5nIHRoZSByYW5nZSwgc25hcCwgZGlyZWN0aW9uIGFuZCBzdGVwIG9wdGlvbnMuXG4gICAgICAgIC8vICdzbmFwJyBhbmQgJ3N0ZXAnIGNhbiBiZSB1cGRhdGVkLlxuICAgICAgICAvLyBJZiAnc25hcCcgYW5kICdzdGVwJyBhcmUgbm90IHBhc3NlZCwgdGhleSBzaG91bGQgcmVtYWluIHVuY2hhbmdlZC5cbiAgICAgICAgdmFyIHYgPSB2YWx1ZUdldCgpO1xuICAgICAgICB2YXIgdXBkYXRlQWJsZSA9IFtcbiAgICAgICAgICAgIFwibWFyZ2luXCIsXG4gICAgICAgICAgICBcImxpbWl0XCIsXG4gICAgICAgICAgICBcInBhZGRpbmdcIixcbiAgICAgICAgICAgIFwicmFuZ2VcIixcbiAgICAgICAgICAgIFwiYW5pbWF0ZVwiLFxuICAgICAgICAgICAgXCJzbmFwXCIsXG4gICAgICAgICAgICBcInN0ZXBcIixcbiAgICAgICAgICAgIFwiZm9ybWF0XCIsXG4gICAgICAgICAgICBcInBpcHNcIixcbiAgICAgICAgICAgIFwidG9vbHRpcHNcIixcbiAgICAgICAgICAgIFwiY29ubmVjdFwiLFxuICAgICAgICBdO1xuICAgICAgICAvLyBPbmx5IGNoYW5nZSBvcHRpb25zIHRoYXQgd2UncmUgYWN0dWFsbHkgcGFzc2VkIHRvIHVwZGF0ZS5cbiAgICAgICAgdXBkYXRlQWJsZS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgdW5kZWZpbmVkLiBudWxsIHJlbW92ZXMgdGhlIHZhbHVlLlxuICAgICAgICAgICAgaWYgKG9wdGlvbnNUb1VwZGF0ZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxPcHRpb25zW25hbWVdID0gb3B0aW9uc1RvVXBkYXRlW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSB0ZXN0T3B0aW9ucyhvcmlnaW5hbE9wdGlvbnMpO1xuICAgICAgICAvLyBMb2FkIG5ldyBvcHRpb25zIGludG8gdGhlIHNsaWRlciBzdGF0ZVxuICAgICAgICB1cGRhdGVBYmxlLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zVG9VcGRhdGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbbmFtZV0gPSBuZXdPcHRpb25zW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2NvcGVfU3BlY3RydW0gPSBuZXdPcHRpb25zLnNwZWN0cnVtO1xuICAgICAgICAvLyBMaW1pdCwgbWFyZ2luIGFuZCBwYWRkaW5nIGRlcGVuZCBvbiB0aGUgc3BlY3RydW0gYnV0IGFyZSBzdG9yZWQgb3V0c2lkZSBvZiBpdC4gKCM2NzcpXG4gICAgICAgIG9wdGlvbnMubWFyZ2luID0gbmV3T3B0aW9ucy5tYXJnaW47XG4gICAgICAgIG9wdGlvbnMubGltaXQgPSBuZXdPcHRpb25zLmxpbWl0O1xuICAgICAgICBvcHRpb25zLnBhZGRpbmcgPSBuZXdPcHRpb25zLnBhZGRpbmc7XG4gICAgICAgIC8vIFVwZGF0ZSBwaXBzLCByZW1vdmVzIGV4aXN0aW5nLlxuICAgICAgICBpZiAob3B0aW9ucy5waXBzKSB7XG4gICAgICAgICAgICBwaXBzKG9wdGlvbnMucGlwcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVQaXBzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRvb2x0aXBzLCByZW1vdmVzIGV4aXN0aW5nLlxuICAgICAgICBpZiAob3B0aW9ucy50b29sdGlwcykge1xuICAgICAgICAgICAgdG9vbHRpcHMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZVRvb2x0aXBzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW52YWxpZGF0ZSB0aGUgY3VycmVudCBwb3NpdGlvbmluZyBzbyB2YWx1ZVNldCBmb3JjZXMgYW4gdXBkYXRlLlxuICAgICAgICBzY29wZV9Mb2NhdGlvbnMgPSBbXTtcbiAgICAgICAgdmFsdWVTZXQoaXNTZXQob3B0aW9uc1RvVXBkYXRlLnN0YXJ0KSA/IG9wdGlvbnNUb1VwZGF0ZS5zdGFydCA6IHYsIGZpcmVTZXRFdmVudCk7XG4gICAgICAgIC8vIFVwZGF0ZSBjb25uZWN0cyBvbmx5IGlmIGl0IHdhcyBzZXRcbiAgICAgICAgaWYgKG9wdGlvbnNUb1VwZGF0ZS5jb25uZWN0KSB7XG4gICAgICAgICAgICB1cGRhdGVDb25uZWN0T3B0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlQ29ubmVjdE9wdGlvbigpIHtcbiAgICAgICAgLy8gSUUgc3VwcG9ydGVkIHdheSBvZiByZW1vdmluZyBjaGlsZHJlbiBpbmNsdWRpbmcgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgd2hpbGUgKHNjb3BlX0Nvbm5lY3RCYXNlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHNjb3BlX0Nvbm5lY3RCYXNlLnJlbW92ZUNoaWxkKHNjb3BlX0Nvbm5lY3RCYXNlLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZGluZyBuZXcgY29ubmVjdHMgYWNjb3JkaW5nIHRvIHRoZSBuZXcgY29ubmVjdCBvcHRpb25zXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IG9wdGlvbnMuaGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgICBzY29wZV9Db25uZWN0c1tpXSA9IGFkZENvbm5lY3Qoc2NvcGVfQ29ubmVjdEJhc2UsIG9wdGlvbnMuY29ubmVjdFtpXSk7XG4gICAgICAgICAgICB1cGRhdGVDb25uZWN0KGkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlLWFkZGluZyBkcmFnIGV2ZW50cyBmb3IgdGhlIG5ldyBjb25uZWN0IGVsZW1lbnRzXG4gICAgICAgIC8vIHRvIGlnbm9yZSB0aGUgb3RoZXIgZXZlbnRzIHdlIGhhdmUgdG8gbmVnYXRlIHRoZSAnaWYgKCFiZWhhdmlvdXIuZml4ZWQpJyBjaGVja1xuICAgICAgICBiaW5kU2xpZGVyRXZlbnRzKHsgZHJhZzogb3B0aW9ucy5ldmVudHMuZHJhZywgZml4ZWQ6IHRydWUgfSk7XG4gICAgfVxuICAgIC8vIEludmVydCBvcHRpb25zIGZvciBjb25uZWN0IGhhbmRsZXNcbiAgICBmdW5jdGlvbiBpbnZlcnRDb25uZWN0cygpIHtcbiAgICAgICAgc2NvcGVfQ29ubmVjdHNJbnZlcnRlZCA9ICFzY29wZV9Db25uZWN0c0ludmVydGVkO1xuICAgICAgICB0ZXN0Q29ubmVjdChvcHRpb25zLCBcbiAgICAgICAgLy8gaW52ZXJzZSB0aGUgY29ubmVjdCBib29sZWFuIGFycmF5XG4gICAgICAgIG9wdGlvbnMuY29ubmVjdC5tYXAoZnVuY3Rpb24gKGIpIHsgcmV0dXJuICFiOyB9KSk7XG4gICAgICAgIHVwZGF0ZUNvbm5lY3RPcHRpb24oKTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6YXRpb24gc3RlcHNcbiAgICBmdW5jdGlvbiBzZXR1cFNsaWRlcigpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBiYXNlIGVsZW1lbnQsIGluaXRpYWxpemUgSFRNTCBhbmQgc2V0IGNsYXNzZXMuXG4gICAgICAgIC8vIEFkZCBoYW5kbGVzIGFuZCBjb25uZWN0IGVsZW1lbnRzLlxuICAgICAgICBzY29wZV9CYXNlID0gYWRkU2xpZGVyKHNjb3BlX1RhcmdldCk7XG4gICAgICAgIGFkZEVsZW1lbnRzKG9wdGlvbnMuY29ubmVjdCwgc2NvcGVfQmFzZSk7XG4gICAgICAgIC8vIEF0dGFjaCB1c2VyIGV2ZW50cy5cbiAgICAgICAgYmluZFNsaWRlckV2ZW50cyhvcHRpb25zLmV2ZW50cyk7XG4gICAgICAgIC8vIFVzZSB0aGUgcHVibGljIHZhbHVlIG1ldGhvZCB0byBzZXQgdGhlIHN0YXJ0IHZhbHVlcy5cbiAgICAgICAgdmFsdWVTZXQob3B0aW9ucy5zdGFydCk7XG4gICAgICAgIGlmIChvcHRpb25zLnBpcHMpIHtcbiAgICAgICAgICAgIHBpcHMob3B0aW9ucy5waXBzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy50b29sdGlwcykge1xuICAgICAgICAgICAgdG9vbHRpcHMoKTtcbiAgICAgICAgfVxuICAgICAgICBhcmlhKCk7XG4gICAgfVxuICAgIHNldHVwU2xpZGVyKCk7XG4gICAgdmFyIHNjb3BlX1NlbGYgPSB7XG4gICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgIHN0ZXBzOiBnZXROZXh0U3RlcHMsXG4gICAgICAgIG9uOiBiaW5kRXZlbnQsXG4gICAgICAgIG9mZjogcmVtb3ZlRXZlbnQsXG4gICAgICAgIGdldDogdmFsdWVHZXQsXG4gICAgICAgIHNldDogdmFsdWVTZXQsXG4gICAgICAgIHNldEhhbmRsZTogdmFsdWVTZXRIYW5kbGUsXG4gICAgICAgIHJlc2V0OiB2YWx1ZVJlc2V0LFxuICAgICAgICBkaXNhYmxlOiBkaXNhYmxlLFxuICAgICAgICBlbmFibGU6IGVuYWJsZSxcbiAgICAgICAgLy8gRXhwb3NlZCBmb3IgdW5pdCB0ZXN0aW5nLCBkb24ndCB1c2UgdGhpcyBpbiB5b3VyIGFwcGxpY2F0aW9uLlxuICAgICAgICBfX21vdmVIYW5kbGVzOiBmdW5jdGlvbiAodXB3YXJkLCBwcm9wb3NhbCwgaGFuZGxlTnVtYmVycykge1xuICAgICAgICAgICAgbW92ZUhhbmRsZXModXB3YXJkLCBwcm9wb3NhbCwgc2NvcGVfTG9jYXRpb25zLCBoYW5kbGVOdW1iZXJzKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczogb3JpZ2luYWxPcHRpb25zLFxuICAgICAgICB1cGRhdGVPcHRpb25zOiB1cGRhdGVPcHRpb25zLFxuICAgICAgICB0YXJnZXQ6IHNjb3BlX1RhcmdldCxcbiAgICAgICAgcmVtb3ZlUGlwczogcmVtb3ZlUGlwcyxcbiAgICAgICAgcmVtb3ZlVG9vbHRpcHM6IHJlbW92ZVRvb2x0aXBzLFxuICAgICAgICBnZXRQb3NpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9Mb2NhdGlvbnMuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VG9vbHRpcHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9Ub29sdGlwcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3JpZ2luczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlX0hhbmRsZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHBpcHM6IHBpcHMsIC8vIElzc3VlICM1OTRcbiAgICB9O1xuICAgIHJldHVybiBzY29wZV9TZWxmO1xufVxuLy8gUnVuIHRoZSBzdGFuZGFyZCBpbml0aWFsaXplclxuZnVuY3Rpb24gaW5pdGlhbGl6ZSh0YXJnZXQsIG9yaWdpbmFsT3B0aW9ucykge1xuICAgIGlmICghdGFyZ2V0IHx8ICF0YXJnZXQubm9kZU5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlcjogY3JlYXRlIHJlcXVpcmVzIGEgc2luZ2xlIGVsZW1lbnQsIGdvdDogXCIgKyB0YXJnZXQpO1xuICAgIH1cbiAgICAvLyBUaHJvdyBhbiBlcnJvciBpZiB0aGUgc2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlxuICAgIGlmICh0YXJnZXQubm9VaVNsaWRlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyOiBTbGlkZXIgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCIpO1xuICAgIH1cbiAgICAvLyBUZXN0IHRoZSBvcHRpb25zIGFuZCBjcmVhdGUgdGhlIHNsaWRlciBlbnZpcm9ubWVudDtcbiAgICB2YXIgb3B0aW9ucyA9IHRlc3RPcHRpb25zKG9yaWdpbmFsT3B0aW9ucyk7XG4gICAgdmFyIGFwaSA9IHNjb3BlKHRhcmdldCwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zKTtcbiAgICB0YXJnZXQubm9VaVNsaWRlciA9IGFwaTtcbiAgICByZXR1cm4gYXBpO1xufVxuZXhwb3J0IHsgaW5pdGlhbGl6ZSBhcyBjcmVhdGUgfTtcbmV4cG9ydCB7IGNzc0NsYXNzZXMgfTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBFeHBvc2VkIGZvciB1bml0IHRlc3RpbmcsIGRvbid0IHVzZSB0aGlzIGluIHlvdXIgYXBwbGljYXRpb24uXG4gICAgX19zcGVjdHJ1bTogU3BlY3RydW0sXG4gICAgLy8gQSByZWZlcmVuY2UgdG8gdGhlIGRlZmF1bHQgY2xhc3NlcywgYWxsb3dzIGdsb2JhbCBjaGFuZ2VzLlxuICAgIC8vIFVzZSB0aGUgY3NzQ2xhc3NlcyBvcHRpb24gZm9yIGNoYW5nZXMgdG8gb25lIHNsaWRlci5cbiAgICBjc3NDbGFzc2VzOiBjc3NDbGFzc2VzLFxuICAgIGNyZWF0ZTogaW5pdGlhbGl6ZSxcbn07XG4iLCAiaW1wb3J0IG5vVWlTbGlkZXIgZnJvbSAnbm91aXNsaWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsaWRlcih7XG4gIGVsZW1lbnQsXG4gIHN0YXJ0LFxuICBjb25uZWN0LFxuICByYW5nZSA9IHsgbWluOiAwLCBtYXg6IDEwIH0sXG4gIHN0YXRlID0gW10sXG4gIHN0ZXAsXG4gIGJlaGF2aW91cixcbiAgc25hcCA9IGZhbHNlLFxuICB0b29sdGlwcyA9IGZhbHNlLFxuICBmb3JtYXQgPSBudWxsLFxuICBvbkNoYW5nZSA9ICgpID0+IHt9LFxufSkge1xuICByZXR1cm4ge1xuICAgIGVsZW1lbnQsXG4gICAgc3RhcnQsXG4gICAgY29ubmVjdCxcbiAgICByYW5nZSxcbiAgICBzdGF0ZSxcbiAgICBzdGVwLFxuICAgIGJlaGF2aW91cixcbiAgICBzbmFwLFxuICAgIHRvb2x0aXBzLFxuICAgIGZvcm1hdCxcbiAgICBjb21wb25lbnQ6IG51bGwsXG4gICAgc2xpZGVyOiBudWxsLFxuICAgIF9oYW5kbGVyOiBudWxsLFxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbGVtZW50KTtcbiAgICAgIGlmICghdGhpcy5jb21wb25lbnQpIHJldHVybjtcblxuICAgICAgdGhpcy5jb21wb25lbnQuY2xhc3NMaXN0LmFkZCgncmFuZ2Utc2xpZGVyJyk7XG5cbiAgICAgIGNvbnN0IHJhdyA9ICh2KSA9PlxuICAgICAgICB3aW5kb3cuQWxwaW5lICYmIHR5cGVvZiB3aW5kb3cuQWxwaW5lLnJhdyA9PT0gJ2Z1bmN0aW9uJyA/IHdpbmRvdy5BbHBpbmUucmF3KHYpIDogdjtcblxuICAgICAgdGhpcy5zbGlkZXIgPSBub1VpU2xpZGVyLmNyZWF0ZSh0aGlzLmNvbXBvbmVudCwge1xuICAgICAgICBzdGFydDogcmF3KHRoaXMuc3RhcnQpLFxuICAgICAgICBjb25uZWN0OiByYXcodGhpcy5jb25uZWN0KSxcbiAgICAgICAgcmFuZ2U6IHJhdyh0aGlzLnJhbmdlKSxcbiAgICAgICAgdG9vbHRpcHM6IHRoaXMudG9vbHRpcHMsXG4gICAgICAgIHN0ZXA6IHJhdyh0aGlzLnN0ZXApLFxuICAgICAgICBiZWhhdmlvdXI6IHJhdyh0aGlzLmJlaGF2aW91ciksXG4gICAgICAgIHNuYXA6IHJhdyh0aGlzLnNuYXApLFxuICAgICAgICBmb3JtYXQ6IHRoaXMuZm9ybWF0LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEJpbmQgQWxwaW5lIGNvbXBvbmVudCBjb250ZXh0IHNvIGB0aGlzLnN0YXRlYCB3b3JrcyBpbnNpZGUgdGhlIHByb3ZpZGVkIG9uQ2hhbmdlXG4gICAgICB0aGlzLl9oYW5kbGVyID0gKHZhbHVlcywgaGFuZGxlLCB1bmVuY29kZWQsIHRhcCwgcG9zaXRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlcyA9IEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgPyB0aGlzLnN0YXRlIDogW107XG4gICAgICAgIG9uQ2hhbmdlLmNhbGwodGhpcywgdmFsdWVzLCBoYW5kbGUsIHVuZW5jb2RlZCwgdGFwLCBwb3NpdGlvbnMsIHN0YXRlcyk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNsaWRlci5vbignY2hhbmdlJywgdGhpcy5faGFuZGxlcik7XG4gICAgfSxcblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBpZiAodGhpcy5zbGlkZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLnNsaWRlci5vZmYoJ2NoYW5nZScsIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2xpZGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ08sSUFBSTtBQUFBLENBQ1YsU0FBVUEsV0FBVTtBQUNqQixFQUFBQSxVQUFTLE9BQU8sSUFBSTtBQUNwQixFQUFBQSxVQUFTLE9BQU8sSUFBSTtBQUNwQixFQUFBQSxVQUFTLFdBQVcsSUFBSTtBQUN4QixFQUFBQSxVQUFTLE9BQU8sSUFBSTtBQUNwQixFQUFBQSxVQUFTLFFBQVEsSUFBSTtBQUN6QixHQUFHLGFBQWEsV0FBVyxDQUFDLEVBQUU7QUFDdkIsSUFBSTtBQUFBLENBQ1YsU0FBVUMsV0FBVTtBQUNqQixFQUFBQSxVQUFTQSxVQUFTLE1BQU0sSUFBSSxFQUFFLElBQUk7QUFDbEMsRUFBQUEsVUFBU0EsVUFBUyxTQUFTLElBQUksQ0FBQyxJQUFJO0FBQ3BDLEVBQUFBLFVBQVNBLFVBQVMsWUFBWSxJQUFJLENBQUMsSUFBSTtBQUN2QyxFQUFBQSxVQUFTQSxVQUFTLFlBQVksSUFBSSxDQUFDLElBQUk7QUFDM0MsR0FBRyxhQUFhLFdBQVcsQ0FBQyxFQUFFO0FBRTlCLFNBQVMsaUJBQWlCLE9BQU87QUFDN0IsU0FBTyx3QkFBd0IsS0FBSyxLQUFLLE9BQU8sTUFBTSxTQUFTO0FBQ25FO0FBQ0EsU0FBUyx3QkFBd0IsT0FBTztBQUVwQyxTQUFPLE9BQU8sVUFBVSxZQUFZLE9BQU8sTUFBTSxPQUFPO0FBQzVEO0FBQ0EsU0FBUyxjQUFjLElBQUk7QUFDdkIsS0FBRyxjQUFjLFlBQVksRUFBRTtBQUNuQztBQUNBLFNBQVMsTUFBTSxPQUFPO0FBQ2xCLFNBQU8sVUFBVSxRQUFRLFVBQVU7QUFDdkM7QUFFQSxTQUFTLGVBQWUsR0FBRztBQUN2QixJQUFFLGVBQWU7QUFDckI7QUFFQSxTQUFTLE9BQU8sT0FBTztBQUNuQixTQUFPLE1BQU0sT0FBTyxTQUFVLEdBQUc7QUFDN0IsV0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFLLEtBQUssQ0FBQyxJQUFJLE9BQVE7QUFBQSxFQUN6QyxHQUFHLENBQUMsQ0FBQztBQUNUO0FBRUEsU0FBUyxRQUFRLE9BQU8sSUFBSTtBQUN4QixTQUFPLEtBQUssTUFBTSxRQUFRLEVBQUUsSUFBSTtBQUNwQztBQUVBLFNBQVMsT0FBTyxNQUFNLGFBQWE7QUFDL0IsTUFBSSxPQUFPLEtBQUssc0JBQXNCO0FBQ3RDLE1BQUksTUFBTSxLQUFLO0FBQ2YsTUFBSSxVQUFVLElBQUk7QUFDbEIsTUFBSSxhQUFhLGNBQWMsR0FBRztBQUlsQyxNQUFJLDBCQUEwQixLQUFLLFVBQVUsU0FBUyxHQUFHO0FBQ3JELGVBQVcsSUFBSTtBQUFBLEVBQ25CO0FBQ0EsU0FBTyxjQUFjLEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxZQUFZLEtBQUssT0FBTyxXQUFXLElBQUksUUFBUTtBQUMxRztBQUVBLFNBQVMsVUFBVSxHQUFHO0FBQ2xCLFNBQU8sT0FBTyxNQUFNLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDM0Q7QUFFQSxTQUFTLFlBQVksU0FBUyxXQUFXLFVBQVU7QUFDL0MsTUFBSSxXQUFXLEdBQUc7QUFDZCxhQUFTLFNBQVMsU0FBUztBQUMzQixlQUFXLFdBQVk7QUFDbkIsa0JBQVksU0FBUyxTQUFTO0FBQUEsSUFDbEMsR0FBRyxRQUFRO0FBQUEsRUFDZjtBQUNKO0FBRUEsU0FBUyxNQUFNLEdBQUc7QUFDZCxTQUFPLEtBQUssSUFBSSxLQUFLLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN2QztBQUdBLFNBQVMsUUFBUSxHQUFHO0FBQ2hCLFNBQU8sTUFBTSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUNwQztBQUVBLFNBQVMsY0FBYyxRQUFRO0FBQzNCLFdBQVMsT0FBTyxNQUFNO0FBQ3RCLE1BQUksU0FBUyxPQUFPLE1BQU0sR0FBRztBQUM3QixTQUFPLE9BQU8sU0FBUyxJQUFJLE9BQU8sQ0FBQyxFQUFFLFNBQVM7QUFDbEQ7QUFFQSxTQUFTLFNBQVMsSUFBSSxXQUFXO0FBQzdCLE1BQUksR0FBRyxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsR0FBRztBQUN2QyxPQUFHLFVBQVUsSUFBSSxTQUFTO0FBQUEsRUFDOUIsT0FDSztBQUNELE9BQUcsYUFBYSxNQUFNO0FBQUEsRUFDMUI7QUFDSjtBQUVBLFNBQVMsWUFBWSxJQUFJLFdBQVc7QUFDaEMsTUFBSSxHQUFHLGFBQWEsQ0FBQyxLQUFLLEtBQUssU0FBUyxHQUFHO0FBQ3ZDLE9BQUcsVUFBVSxPQUFPLFNBQVM7QUFBQSxFQUNqQyxPQUNLO0FBQ0QsT0FBRyxZQUFZLEdBQUcsVUFBVSxRQUFRLElBQUksT0FBTyxZQUFZLFVBQVUsTUFBTSxHQUFHLEVBQUUsS0FBSyxHQUFHLElBQUksV0FBVyxJQUFJLEdBQUcsR0FBRztBQUFBLEVBQ3JIO0FBQ0o7QUFFQSxTQUFTLFNBQVMsSUFBSSxXQUFXO0FBQzdCLFNBQU8sR0FBRyxZQUFZLEdBQUcsVUFBVSxTQUFTLFNBQVMsSUFBSSxJQUFJLE9BQU8sUUFBUSxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsU0FBUztBQUNwSDtBQUVBLFNBQVMsY0FBYyxLQUFLO0FBQ3hCLE1BQUksb0JBQW9CLE9BQU8sZ0JBQWdCO0FBQy9DLE1BQUksZ0JBQWdCLElBQUksY0FBYyxRQUFRO0FBQzlDLE1BQUksSUFBSSxvQkFDRixPQUFPLGNBQ1AsZUFDSSxJQUFJLGdCQUFnQixhQUNwQixJQUFJLEtBQUs7QUFDbkIsTUFBSSxJQUFJLG9CQUNGLE9BQU8sY0FDUCxlQUNJLElBQUksZ0JBQWdCLFlBQ3BCLElBQUksS0FBSztBQUNuQixTQUFPO0FBQUEsSUFDSDtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQ0o7QUFJQSxTQUFTLGFBQWE7QUFHbEIsU0FBTyxPQUFPLFVBQVUsaUJBQ2xCO0FBQUEsSUFDRSxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsRUFDVCxJQUNFLE9BQU8sVUFBVSxtQkFDYjtBQUFBLElBQ0UsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLEVBQ1QsSUFDRTtBQUFBLElBQ0UsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLEVBQ1Q7QUFDWjtBQUdBLFNBQVMscUJBQXFCO0FBQzFCLE1BQUksa0JBQWtCO0FBRXRCLE1BQUk7QUFDQSxRQUFJLE9BQU8sT0FBTyxlQUFlLENBQUMsR0FBRyxXQUFXO0FBQUEsTUFDNUMsS0FBSyxXQUFZO0FBQ2IsMEJBQWtCO0FBQUEsTUFDdEI7QUFBQSxJQUNKLENBQUM7QUFFRCxXQUFPLGlCQUFpQixRQUFRLE1BQU0sSUFBSTtBQUFBLEVBQzlDLFNBQ08sR0FBRztBQUFBLEVBQUU7QUFFWixTQUFPO0FBQ1g7QUFDQSxTQUFTLDZCQUE2QjtBQUNsQyxTQUFPLE9BQU8sT0FBTyxJQUFJLFlBQVksSUFBSSxTQUFTLGdCQUFnQixNQUFNO0FBQzVFO0FBSUEsU0FBUyxjQUFjLElBQUksSUFBSTtBQUMzQixTQUFPLE9BQU8sS0FBSztBQUN2QjtBQUVBLFNBQVMsZUFBZSxPQUFPLE9BQU8sWUFBWTtBQUM5QyxTQUFRLFFBQVEsT0FBUSxNQUFNLGFBQWEsQ0FBQyxJQUFJLE1BQU0sVUFBVTtBQUNwRTtBQUVBLFNBQVMsYUFBYSxPQUFPLE9BQU87QUFDaEMsU0FBTyxlQUFlLE9BQU8sTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNoRztBQUVBLFNBQVMsYUFBYSxPQUFPLE9BQU87QUFDaEMsU0FBUSxTQUFTLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFNLE1BQU0sTUFBTSxDQUFDO0FBQzFEO0FBQ0EsU0FBUyxLQUFLLE9BQU8sS0FBSztBQUN0QixNQUFJLElBQUk7QUFDUixTQUFPLFNBQVMsSUFBSSxDQUFDLEdBQUc7QUFDcEIsU0FBSztBQUFBLEVBQ1Q7QUFDQSxTQUFPO0FBQ1g7QUFFQSxTQUFTLFdBQVcsTUFBTSxNQUFNLE9BQU87QUFDbkMsTUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQzVCLFdBQU87QUFBQSxFQUNYO0FBQ0EsTUFBSSxJQUFJLEtBQUssT0FBTyxJQUFJO0FBQ3hCLE1BQUksS0FBSyxLQUFLLElBQUksQ0FBQztBQUNuQixNQUFJLEtBQUssS0FBSyxDQUFDO0FBQ2YsTUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDO0FBQ25CLE1BQUksS0FBSyxLQUFLLENBQUM7QUFDZixTQUFPLEtBQUssYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssSUFBSSxjQUFjLElBQUksRUFBRTtBQUNwRTtBQUVBLFNBQVMsYUFBYSxNQUFNLE1BQU0sT0FBTztBQUVyQyxNQUFJLFNBQVMsS0FBSztBQUNkLFdBQU8sS0FBSyxNQUFNLEVBQUUsRUFBRSxDQUFDO0FBQUEsRUFDM0I7QUFDQSxNQUFJLElBQUksS0FBSyxPQUFPLElBQUk7QUFDeEIsTUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDO0FBQ25CLE1BQUksS0FBSyxLQUFLLENBQUM7QUFDZixNQUFJLEtBQUssS0FBSyxJQUFJLENBQUM7QUFDbkIsTUFBSSxLQUFLLEtBQUssQ0FBQztBQUNmLFNBQU8sYUFBYSxDQUFDLElBQUksRUFBRSxJQUFJLFFBQVEsTUFBTSxjQUFjLElBQUksRUFBRSxDQUFDO0FBQ3RFO0FBRUEsU0FBUyxRQUFRLE1BQU0sUUFBUSxNQUFNLE9BQU87QUFDeEMsTUFBSSxVQUFVLEtBQUs7QUFDZixXQUFPO0FBQUEsRUFDWDtBQUNBLE1BQUksSUFBSSxLQUFLLE9BQU8sSUFBSTtBQUN4QixNQUFJLElBQUksS0FBSyxJQUFJLENBQUM7QUFDbEIsTUFBSSxJQUFJLEtBQUssQ0FBQztBQUVkLE1BQUksTUFBTTtBQUVOLFFBQUksUUFBUSxLQUFLLElBQUksS0FBSyxHQUFHO0FBQ3pCLGFBQU87QUFBQSxJQUNYO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFDQSxNQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRztBQUNoQixXQUFPO0FBQUEsRUFDWDtBQUNBLFNBQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxRQUFRLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDO0FBQ25FO0FBR0EsSUFBSTtBQUFBO0FBQUEsR0FBMEIsV0FBWTtBQUN0QyxhQUFTQyxVQUFTLE9BQU8sTUFBTSxZQUFZO0FBQ3ZDLFdBQUssT0FBTyxDQUFDO0FBQ2IsV0FBSyxPQUFPLENBQUM7QUFDYixXQUFLLFNBQVMsQ0FBQztBQUNmLFdBQUssWUFBWSxDQUFDO0FBQ2xCLFdBQUssdUJBQXVCLENBQUM7QUFDN0IsV0FBSyxTQUFTLENBQUMsY0FBYyxLQUFLO0FBQ2xDLFdBQUssWUFBWSxDQUFDLEtBQUs7QUFDdkIsV0FBSyxPQUFPO0FBQ1osVUFBSTtBQUNKLFVBQUksVUFBVSxDQUFDO0FBRWYsYUFBTyxLQUFLLEtBQUssRUFBRSxRQUFRLFNBQVVDLFFBQU87QUFDeEMsZ0JBQVEsS0FBSyxDQUFDLFFBQVEsTUFBTUEsTUFBSyxDQUFDLEdBQUdBLE1BQUssQ0FBQztBQUFBLE1BQy9DLENBQUM7QUFFRCxjQUFRLEtBQUssU0FBVSxHQUFHLEdBQUc7QUFDekIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUFBLE1BQzNCLENBQUM7QUFFRCxXQUFLLFFBQVEsR0FBRyxRQUFRLFFBQVEsUUFBUSxTQUFTO0FBQzdDLGFBQUssaUJBQWlCLFFBQVEsS0FBSyxFQUFFLENBQUMsR0FBRyxRQUFRLEtBQUssRUFBRSxDQUFDLENBQUM7QUFBQSxNQUM5RDtBQUdBLFdBQUssWUFBWSxLQUFLLE9BQU8sTUFBTSxDQUFDO0FBRXBDLFdBQUssUUFBUSxHQUFHLFFBQVEsS0FBSyxVQUFVLFFBQVEsU0FBUztBQUNwRCxhQUFLLGdCQUFnQixPQUFPLEtBQUssVUFBVSxLQUFLLENBQUM7QUFBQSxNQUNyRDtBQUFBLElBQ0o7QUFDQSxJQUFBRCxVQUFTLFVBQVUsY0FBYyxTQUFVLE9BQU87QUFDOUMsVUFBSSxZQUFZLENBQUM7QUFDakIsZUFBUyxRQUFRLEdBQUcsUUFBUSxLQUFLLFVBQVUsU0FBUyxHQUFHLFNBQVM7QUFDNUQsa0JBQVUsS0FBSyxJQUFJLGVBQWUsS0FBSyxNQUFNLE9BQU8sS0FBSztBQUFBLE1BQzdEO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFHQSxJQUFBQSxVQUFTLFVBQVUsc0JBQXNCLFNBQVUsT0FBTyxXQUFXLFdBQVc7QUFDNUUsVUFBSSxhQUFhO0FBRWpCLFVBQUksUUFBUSxLQUFLLEtBQUssS0FBSyxLQUFLLFNBQVMsQ0FBQyxHQUFHO0FBQ3pDLGVBQU8sUUFBUSxLQUFLLEtBQUssYUFBYSxDQUFDLEdBQUc7QUFDdEM7QUFBQSxRQUNKO0FBQUEsTUFDSixXQUNTLFVBQVUsS0FBSyxLQUFLLEtBQUssS0FBSyxTQUFTLENBQUMsR0FBRztBQUNoRCxxQkFBYSxLQUFLLEtBQUssU0FBUztBQUFBLE1BQ3BDO0FBRUEsVUFBSSxDQUFDLGFBQWEsVUFBVSxLQUFLLEtBQUssYUFBYSxDQUFDLEdBQUc7QUFDbkQ7QUFBQSxNQUNKO0FBQ0EsVUFBSSxjQUFjLE1BQU07QUFDcEIsb0JBQVksQ0FBQztBQUFBLE1BQ2pCO0FBQ0EsVUFBSTtBQUNKLFVBQUksY0FBYztBQUNsQixVQUFJLG9CQUFvQixVQUFVLFVBQVU7QUFDNUMsVUFBSSxZQUFZO0FBQ2hCLFVBQUkscUJBQXFCO0FBQ3pCLFVBQUksdUJBQXVCO0FBQzNCLFVBQUksZ0JBQWdCO0FBRXBCLFVBQUksV0FBVztBQUNYLHdCQUFnQixRQUFRLEtBQUssS0FBSyxVQUFVLE1BQU0sS0FBSyxLQUFLLGFBQWEsQ0FBQyxJQUFJLEtBQUssS0FBSyxVQUFVO0FBQUEsTUFDdEcsT0FDSztBQUNELHdCQUFnQixLQUFLLEtBQUssYUFBYSxDQUFDLElBQUksVUFBVSxLQUFLLEtBQUssYUFBYSxDQUFDLElBQUksS0FBSyxLQUFLLFVBQVU7QUFBQSxNQUMxRztBQUVBLGFBQU8sb0JBQW9CLEdBQUc7QUFFMUIsb0JBQVksS0FBSyxLQUFLLGFBQWEsSUFBSSxhQUFhLElBQUksS0FBSyxLQUFLLGFBQWEsYUFBYTtBQUU1RixZQUFJLFVBQVUsYUFBYSxhQUFhLElBQUksY0FBYyxNQUFNLGVBQWUsTUFBTSxLQUFLO0FBRXRGLCtCQUFxQixZQUFZO0FBRWpDLHlCQUFlLG9CQUFvQixNQUFNLGdCQUFnQixVQUFVLGFBQWEsYUFBYTtBQUU3Rix5QkFBZTtBQUFBLFFBQ25CLE9BQ0s7QUFFRCwrQkFBdUIsVUFBVSxhQUFhLGFBQWEsSUFBSSxZQUFhLE1BQU87QUFFbkYsd0JBQWM7QUFBQSxRQUNsQjtBQUNBLFlBQUksV0FBVztBQUNYLGlDQUF1Qix1QkFBdUI7QUFFOUMsY0FBSSxLQUFLLEtBQUssU0FBUyxpQkFBaUIsR0FBRztBQUN2QztBQUFBLFVBQ0o7QUFBQSxRQUNKLE9BQ0s7QUFDRCxpQ0FBdUIsdUJBQXVCO0FBRTlDLGNBQUksS0FBSyxLQUFLLFNBQVMsaUJBQWlCLEdBQUc7QUFDdkM7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUVBLDRCQUFvQixVQUFVLGFBQWEsYUFBYSxJQUFJO0FBQUEsTUFDaEU7QUFDQSxhQUFPLFFBQVE7QUFBQSxJQUNuQjtBQUNBLElBQUFBLFVBQVMsVUFBVSxhQUFhLFNBQVUsT0FBTztBQUM3QyxjQUFRLFdBQVcsS0FBSyxNQUFNLEtBQUssTUFBTSxLQUFLO0FBQzlDLGFBQU87QUFBQSxJQUNYO0FBQ0EsSUFBQUEsVUFBUyxVQUFVLGVBQWUsU0FBVSxPQUFPO0FBQy9DLGFBQU8sYUFBYSxLQUFLLE1BQU0sS0FBSyxNQUFNLEtBQUs7QUFBQSxJQUNuRDtBQUNBLElBQUFBLFVBQVMsVUFBVSxVQUFVLFNBQVUsT0FBTztBQUMxQyxjQUFRLFFBQVEsS0FBSyxNQUFNLEtBQUssUUFBUSxLQUFLLE1BQU0sS0FBSztBQUN4RCxhQUFPO0FBQUEsSUFDWDtBQUNBLElBQUFBLFVBQVMsVUFBVSxpQkFBaUIsU0FBVSxPQUFPLFFBQVEsTUFBTTtBQUMvRCxVQUFJLElBQUksS0FBSyxPQUFPLEtBQUssSUFBSTtBQUU3QixVQUFJLFVBQVUsT0FBUSxVQUFVLFVBQVUsS0FBSyxLQUFLLElBQUksQ0FBQyxHQUFJO0FBQ3pELFlBQUksS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDO0FBQUEsTUFDekI7QUFDQSxjQUFRLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLO0FBQUEsSUFDL0M7QUFDQSxJQUFBQSxVQUFTLFVBQVUsaUJBQWlCLFNBQVUsT0FBTztBQUNqRCxVQUFJLElBQUksS0FBSyxPQUFPLEtBQUssSUFBSTtBQUM3QixhQUFPO0FBQUEsUUFDSCxZQUFZO0FBQUEsVUFDUixZQUFZLEtBQUssS0FBSyxJQUFJLENBQUM7QUFBQSxVQUMzQixNQUFNLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxVQUMxQixhQUFhLEtBQUsscUJBQXFCLElBQUksQ0FBQztBQUFBLFFBQ2hEO0FBQUEsUUFDQSxVQUFVO0FBQUEsVUFDTixZQUFZLEtBQUssS0FBSyxJQUFJLENBQUM7QUFBQSxVQUMzQixNQUFNLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxVQUMxQixhQUFhLEtBQUsscUJBQXFCLElBQUksQ0FBQztBQUFBLFFBQ2hEO0FBQUEsUUFDQSxXQUFXO0FBQUEsVUFDUCxZQUFZLEtBQUssS0FBSyxDQUFDO0FBQUEsVUFDdkIsTUFBTSxLQUFLLFVBQVUsQ0FBQztBQUFBLFVBQ3RCLGFBQWEsS0FBSyxxQkFBcUIsQ0FBQztBQUFBLFFBQzVDO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFDQSxJQUFBQSxVQUFTLFVBQVUsb0JBQW9CLFdBQVk7QUFDL0MsVUFBSSxlQUFlLEtBQUssVUFBVSxJQUFJLGFBQWE7QUFDbkQsYUFBTyxLQUFLLElBQUksTUFBTSxNQUFNLFlBQVk7QUFBQSxJQUM1QztBQUNBLElBQUFBLFVBQVMsVUFBVSxZQUFZLFdBQVk7QUFDdkMsYUFBTyxLQUFLLEtBQUssQ0FBQyxNQUFNLEtBQUssS0FBSyxLQUFLLEtBQUssU0FBUyxDQUFDO0FBQUEsSUFDMUQ7QUFFQSxJQUFBQSxVQUFTLFVBQVUsVUFBVSxTQUFVLE9BQU87QUFDMUMsYUFBTyxLQUFLLFFBQVEsS0FBSyxXQUFXLEtBQUssQ0FBQztBQUFBLElBQzlDO0FBQ0EsSUFBQUEsVUFBUyxVQUFVLG1CQUFtQixTQUFVLE9BQU8sT0FBTztBQUMxRCxVQUFJO0FBRUosVUFBSSxVQUFVLE9BQU87QUFDakIscUJBQWE7QUFBQSxNQUNqQixXQUNTLFVBQVUsT0FBTztBQUN0QixxQkFBYTtBQUFBLE1BQ2pCLE9BQ0s7QUFDRCxxQkFBYSxXQUFXLEtBQUs7QUFBQSxNQUNqQztBQUVBLFVBQUksQ0FBQyxVQUFVLFVBQVUsS0FBSyxDQUFDLFVBQVUsTUFBTSxDQUFDLENBQUMsR0FBRztBQUNoRCxjQUFNLElBQUksTUFBTSwwQ0FBMEM7QUFBQSxNQUM5RDtBQUVBLFdBQUssS0FBSyxLQUFLLFVBQVU7QUFDekIsV0FBSyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUM7QUFDdkIsVUFBSSxTQUFTLE9BQU8sTUFBTSxDQUFDLENBQUM7QUFJNUIsVUFBSSxDQUFDLFlBQVk7QUFDYixZQUFJLENBQUMsTUFBTSxNQUFNLEdBQUc7QUFDaEIsZUFBSyxPQUFPLENBQUMsSUFBSTtBQUFBLFFBQ3JCO0FBQUEsTUFDSixPQUNLO0FBQ0QsYUFBSyxPQUFPLEtBQUssTUFBTSxNQUFNLElBQUksUUFBUSxNQUFNO0FBQUEsTUFDbkQ7QUFDQSxXQUFLLHFCQUFxQixLQUFLLENBQUM7QUFBQSxJQUNwQztBQUNBLElBQUFBLFVBQVMsVUFBVSxrQkFBa0IsU0FBVSxHQUFHLEdBQUc7QUFFakQsVUFBSSxDQUFDLEdBQUc7QUFDSjtBQUFBLE1BQ0o7QUFFQSxVQUFJLEtBQUssS0FBSyxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksQ0FBQyxHQUFHO0FBQ25DLGFBQUssT0FBTyxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO0FBQzNEO0FBQUEsTUFDSjtBQUVBLFdBQUssT0FBTyxDQUFDLElBQ1QsZUFBZSxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksY0FBYyxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQztBQUN6RyxVQUFJLGNBQWMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUM7QUFDckUsVUFBSSxjQUFjLEtBQUssS0FBSyxPQUFPLFdBQVcsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzdELFVBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLElBQUk7QUFDOUMsV0FBSyxxQkFBcUIsQ0FBQyxJQUFJO0FBQUEsSUFDbkM7QUFDQSxXQUFPQTtBQUFBLEVBQ1gsR0FBRTtBQUFBO0FBZ0JGLElBQUksbUJBQW1CO0FBQUEsRUFDbkIsSUFBSSxTQUFVLE9BQU87QUFDakIsV0FBTyxVQUFVLFNBQVksS0FBSyxNQUFNLFFBQVEsQ0FBQztBQUFBLEVBQ3JEO0FBQUEsRUFDQSxNQUFNO0FBQ1Y7QUFDQSxJQUFJLGFBQWE7QUFBQSxFQUNiLFFBQVE7QUFBQSxFQUNSLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxFQUNSLFFBQVE7QUFBQSxFQUNSLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFBQSxFQUNiLFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLFVBQVU7QUFBQSxFQUNWLFlBQVk7QUFBQSxFQUNaLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLEtBQUs7QUFBQSxFQUNMLEtBQUs7QUFBQSxFQUNMLGtCQUFrQjtBQUFBLEVBQ2xCLGtCQUFrQjtBQUFBLEVBQ2xCLFdBQVc7QUFBQSxFQUNYLE1BQU07QUFBQSxFQUNOLEtBQUs7QUFBQSxFQUNMLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULE1BQU07QUFBQSxFQUNOLGdCQUFnQjtBQUFBLEVBQ2hCLGNBQWM7QUFBQSxFQUNkLFFBQVE7QUFBQSxFQUNSLGtCQUFrQjtBQUFBLEVBQ2xCLGdCQUFnQjtBQUFBLEVBQ2hCLGNBQWM7QUFBQSxFQUNkLGFBQWE7QUFBQSxFQUNiLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLGlCQUFpQjtBQUFBLEVBQ2pCLGVBQWU7QUFBQSxFQUNmLGFBQWE7QUFBQSxFQUNiLFlBQVk7QUFBQSxFQUNaLFVBQVU7QUFDZDtBQUVBLElBQUksb0JBQW9CO0FBQUEsRUFDcEIsVUFBVTtBQUFBLEVBQ1YsTUFBTTtBQUNWO0FBRUEsU0FBUyxTQUFTLFFBQVEsT0FBTztBQUM3QixNQUFJLENBQUMsVUFBVSxLQUFLLEdBQUc7QUFDbkIsVUFBTSxJQUFJLE1BQU0sb0NBQW9DO0FBQUEsRUFDeEQ7QUFHQSxTQUFPLGFBQWE7QUFDeEI7QUFDQSxTQUFTLDJCQUEyQixRQUFRLE9BQU87QUFDL0MsTUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHO0FBQ25CLFVBQU0sSUFBSSxNQUFNLHNEQUFzRDtBQUFBLEVBQzFFO0FBQ0EsU0FBTyx5QkFBeUI7QUFDcEM7QUFDQSxTQUFTLHVCQUF1QixRQUFRLE9BQU87QUFDM0MsTUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHO0FBQ25CLFVBQU0sSUFBSSxNQUFNLGtEQUFrRDtBQUFBLEVBQ3RFO0FBQ0EsU0FBTyxxQkFBcUI7QUFDaEM7QUFDQSxTQUFTLHdCQUF3QixRQUFRLE9BQU87QUFDNUMsTUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHO0FBQ25CLFVBQU0sSUFBSSxNQUFNLG1EQUFtRDtBQUFBLEVBQ3ZFO0FBQ0EsU0FBTyxzQkFBc0I7QUFDakM7QUFDQSxTQUFTLFVBQVUsUUFBUSxPQUFPO0FBRTlCLE1BQUksT0FBTyxVQUFVLFlBQVksTUFBTSxRQUFRLEtBQUssR0FBRztBQUNuRCxVQUFNLElBQUksTUFBTSx1Q0FBdUM7QUFBQSxFQUMzRDtBQUVBLE1BQUksTUFBTSxRQUFRLFVBQWEsTUFBTSxRQUFRLFFBQVc7QUFDcEQsVUFBTSxJQUFJLE1BQU0sZ0RBQWdEO0FBQUEsRUFDcEU7QUFDQSxTQUFPLFdBQVcsSUFBSSxTQUFTLE9BQU8sT0FBTyxRQUFRLE9BQU8sT0FBTyxVQUFVO0FBQ2pGO0FBQ0EsU0FBUyxVQUFVLFFBQVEsT0FBTztBQUM5QixVQUFRLFFBQVEsS0FBSztBQUdyQixNQUFJLENBQUMsTUFBTSxRQUFRLEtBQUssS0FBSyxDQUFDLE1BQU0sUUFBUTtBQUN4QyxVQUFNLElBQUksTUFBTSwwQ0FBMEM7QUFBQSxFQUM5RDtBQUVBLFNBQU8sVUFBVSxNQUFNO0FBR3ZCLFNBQU8sUUFBUTtBQUNuQjtBQUNBLFNBQVMsU0FBUyxRQUFRLE9BQU87QUFDN0IsTUFBSSxPQUFPLFVBQVUsV0FBVztBQUM1QixVQUFNLElBQUksTUFBTSw4Q0FBOEM7QUFBQSxFQUNsRTtBQUVBLFNBQU8sT0FBTztBQUNsQjtBQUNBLFNBQVMsWUFBWSxRQUFRLE9BQU87QUFDaEMsTUFBSSxPQUFPLFVBQVUsV0FBVztBQUM1QixVQUFNLElBQUksTUFBTSxpREFBaUQ7QUFBQSxFQUNyRTtBQUVBLFNBQU8sVUFBVTtBQUNyQjtBQUNBLFNBQVMsc0JBQXNCLFFBQVEsT0FBTztBQUMxQyxNQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzNCLFVBQU0sSUFBSSxNQUFNLDBEQUEwRDtBQUFBLEVBQzlFO0FBQ0EsU0FBTyxvQkFBb0I7QUFDL0I7QUFDQSxTQUFTLFlBQVksUUFBUSxPQUFPO0FBQ2hDLE1BQUksVUFBVSxDQUFDLEtBQUs7QUFDcEIsTUFBSTtBQUVKLE1BQUksVUFBVSxTQUFTO0FBQ25CLFlBQVEsQ0FBQyxNQUFNLEtBQUs7QUFBQSxFQUN4QixXQUNTLFVBQVUsU0FBUztBQUN4QixZQUFRLENBQUMsT0FBTyxJQUFJO0FBQUEsRUFDeEI7QUFFQSxNQUFJLFVBQVUsUUFBUSxVQUFVLE9BQU87QUFDbkMsU0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLFNBQVMsS0FBSztBQUNqQyxjQUFRLEtBQUssS0FBSztBQUFBLElBQ3RCO0FBQ0EsWUFBUSxLQUFLLEtBQUs7QUFBQSxFQUN0QixXQUVTLENBQUMsTUFBTSxRQUFRLEtBQUssS0FBSyxDQUFDLE1BQU0sVUFBVSxNQUFNLFdBQVcsT0FBTyxVQUFVLEdBQUc7QUFDcEYsVUFBTSxJQUFJLE1BQU0sMERBQTBEO0FBQUEsRUFDOUUsT0FDSztBQUNELGNBQVU7QUFBQSxFQUNkO0FBQ0EsU0FBTyxVQUFVO0FBQ3JCO0FBQ0EsU0FBUyxnQkFBZ0IsUUFBUSxPQUFPO0FBR3BDLFVBQVEsT0FBTztBQUFBLElBQ1gsS0FBSztBQUNELGFBQU8sTUFBTTtBQUNiO0FBQUEsSUFDSixLQUFLO0FBQ0QsYUFBTyxNQUFNO0FBQ2I7QUFBQSxJQUNKO0FBQ0ksWUFBTSxJQUFJLE1BQU0sOENBQThDO0FBQUEsRUFDdEU7QUFDSjtBQUNBLFNBQVMsV0FBVyxRQUFRLE9BQU87QUFDL0IsTUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHO0FBQ25CLFVBQU0sSUFBSSxNQUFNLDhDQUE4QztBQUFBLEVBQ2xFO0FBRUEsTUFBSSxVQUFVLEdBQUc7QUFDYjtBQUFBLEVBQ0o7QUFDQSxTQUFPLFNBQVMsT0FBTyxTQUFTLFlBQVksS0FBSztBQUNyRDtBQUNBLFNBQVMsVUFBVSxRQUFRLE9BQU87QUFDOUIsTUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHO0FBQ25CLFVBQU0sSUFBSSxNQUFNLDZDQUE2QztBQUFBLEVBQ2pFO0FBQ0EsU0FBTyxRQUFRLE9BQU8sU0FBUyxZQUFZLEtBQUs7QUFDaEQsTUFBSSxDQUFDLE9BQU8sU0FBUyxPQUFPLFVBQVUsR0FBRztBQUNyQyxVQUFNLElBQUksTUFBTSx3RkFBd0Y7QUFBQSxFQUM1RztBQUNKO0FBQ0EsU0FBUyxZQUFZLFFBQVEsT0FBTztBQUNoQyxNQUFJO0FBQ0osTUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsTUFBTSxRQUFRLEtBQUssR0FBRztBQUM1QyxVQUFNLElBQUksTUFBTSw2RUFBNkU7QUFBQSxFQUNqRztBQUNBLE1BQUksTUFBTSxRQUFRLEtBQUssS0FBSyxFQUFFLE1BQU0sV0FBVyxLQUFLLFVBQVUsTUFBTSxDQUFDLENBQUMsS0FBSyxVQUFVLE1BQU0sQ0FBQyxDQUFDLElBQUk7QUFDN0YsVUFBTSxJQUFJLE1BQU0sNkVBQTZFO0FBQUEsRUFDakc7QUFDQSxNQUFJLFVBQVUsR0FBRztBQUNiO0FBQUEsRUFDSjtBQUNBLE1BQUksQ0FBQyxNQUFNLFFBQVEsS0FBSyxHQUFHO0FBQ3ZCLFlBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxFQUN6QjtBQUVBLFNBQU8sVUFBVSxDQUFDLE9BQU8sU0FBUyxZQUFZLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxTQUFTLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5RixPQUFLLFFBQVEsR0FBRyxRQUFRLE9BQU8sU0FBUyxVQUFVLFNBQVMsR0FBRyxTQUFTO0FBRW5FLFFBQUksT0FBTyxRQUFRLENBQUMsRUFBRSxLQUFLLElBQUksS0FBSyxPQUFPLFFBQVEsQ0FBQyxFQUFFLEtBQUssSUFBSSxHQUFHO0FBQzlELFlBQU0sSUFBSSxNQUFNLDREQUE0RDtBQUFBLElBQ2hGO0FBQUEsRUFDSjtBQUNBLE1BQUksZUFBZSxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUM7QUFDckMsTUFBSSxhQUFhLE9BQU8sU0FBUyxLQUFLLENBQUM7QUFDdkMsTUFBSSxZQUFZLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxLQUFLLFNBQVMsQ0FBQztBQUNwRSxNQUFJLGdCQUFnQixZQUFZLGNBQWMsR0FBRztBQUM3QyxVQUFNLElBQUksTUFBTSxpRUFBaUU7QUFBQSxFQUNyRjtBQUNKO0FBQ0EsU0FBUyxjQUFjLFFBQVEsT0FBTztBQUlsQyxVQUFRLE9BQU87QUFBQSxJQUNYLEtBQUs7QUFDRCxhQUFPLE1BQU07QUFDYjtBQUFBLElBQ0osS0FBSztBQUNELGFBQU8sTUFBTTtBQUNiO0FBQUEsSUFDSjtBQUNJLFlBQU0sSUFBSSxNQUFNLG9EQUFvRDtBQUFBLEVBQzVFO0FBQ0o7QUFDQSxTQUFTLGNBQWMsUUFBUSxPQUFPO0FBRWxDLE1BQUksT0FBTyxVQUFVLFVBQVU7QUFDM0IsVUFBTSxJQUFJLE1BQU0sOERBQThEO0FBQUEsRUFDbEY7QUFHQSxNQUFJLE1BQU0sTUFBTSxRQUFRLEtBQUssS0FBSztBQUNsQyxNQUFJLE9BQU8sTUFBTSxRQUFRLE1BQU0sS0FBSztBQUNwQyxNQUFJLFFBQVEsTUFBTSxRQUFRLE9BQU8sS0FBSztBQUN0QyxNQUFJLE9BQU8sTUFBTSxRQUFRLE1BQU0sS0FBSztBQUNwQyxNQUFJLFFBQVEsTUFBTSxRQUFRLE9BQU8sS0FBSztBQUN0QyxNQUFJLGdCQUFnQixNQUFNLFFBQVEsZUFBZSxLQUFLO0FBQ3RELE1BQUksaUJBQWlCLE1BQU0sUUFBUSxpQkFBaUIsS0FBSztBQUN6RCxNQUFJLFVBQVUsTUFBTSxRQUFRLFVBQVUsS0FBSztBQUMzQyxNQUFJLGNBQWMsTUFBTSxRQUFRLGNBQWMsS0FBSztBQUNuRCxNQUFJLE9BQU87QUFDUCxRQUFJLE9BQU8sWUFBWSxHQUFHO0FBQ3RCLFlBQU0sSUFBSSxNQUFNLDJEQUEyRDtBQUFBLElBQy9FO0FBRUEsZUFBVyxRQUFRLE9BQU8sTUFBTSxDQUFDLElBQUksT0FBTyxNQUFNLENBQUMsQ0FBQztBQUFBLEVBQ3hEO0FBQ0EsTUFBSSxrQkFBa0IsT0FBTyxZQUFZLEdBQUc7QUFDeEMsVUFBTSxJQUFJLE1BQU0scUVBQXFFO0FBQUEsRUFDekY7QUFDQSxNQUFJLGtCQUFrQixPQUFPLFVBQVUsT0FBTyxRQUFRO0FBQ2xELFVBQU0sSUFBSSxNQUFNLDJFQUEyRTtBQUFBLEVBQy9GO0FBQ0EsU0FBTyxTQUFTO0FBQUEsSUFDWixLQUFLLE9BQU87QUFBQSxJQUNaO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFDSjtBQUNBLFNBQVMsYUFBYSxRQUFRLE9BQU87QUFDakMsTUFBSSxVQUFVLE9BQU87QUFDakI7QUFBQSxFQUNKO0FBQ0EsTUFBSSxVQUFVLFFBQVEsd0JBQXdCLEtBQUssR0FBRztBQUNsRCxXQUFPLFdBQVcsQ0FBQztBQUNuQixhQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxLQUFLO0FBQ3JDLGFBQU8sU0FBUyxLQUFLLEtBQUs7QUFBQSxJQUM5QjtBQUFBLEVBQ0osT0FDSztBQUNELFlBQVEsUUFBUSxLQUFLO0FBQ3JCLFFBQUksTUFBTSxXQUFXLE9BQU8sU0FBUztBQUNqQyxZQUFNLElBQUksTUFBTSxvREFBb0Q7QUFBQSxJQUN4RTtBQUNBLFVBQU0sUUFBUSxTQUFVLFdBQVc7QUFDL0IsVUFBSSxPQUFPLGNBQWMsYUFBYSxDQUFDLHdCQUF3QixTQUFTLEdBQUc7QUFDdkUsY0FBTSxJQUFJLE1BQU0sK0RBQStEO0FBQUEsTUFDbkY7QUFBQSxJQUNKLENBQUM7QUFDRCxXQUFPLFdBQVc7QUFBQSxFQUN0QjtBQUNKO0FBQ0EsU0FBUyxxQkFBcUIsUUFBUSxPQUFPO0FBQ3pDLE1BQUksTUFBTSxXQUFXLE9BQU8sU0FBUztBQUNqQyxVQUFNLElBQUksTUFBTSxxREFBcUQ7QUFBQSxFQUN6RTtBQUNBLFNBQU8sbUJBQW1CO0FBQzlCO0FBQ0EsU0FBUyxlQUFlLFFBQVEsT0FBTztBQUNuQyxNQUFJLENBQUMsd0JBQXdCLEtBQUssR0FBRztBQUNqQyxVQUFNLElBQUksTUFBTSxnREFBZ0Q7QUFBQSxFQUNwRTtBQUNBLFNBQU8sYUFBYTtBQUN4QjtBQUNBLFNBQVMsV0FBVyxRQUFRLE9BQU87QUFDL0IsTUFBSSxDQUFDLGlCQUFpQixLQUFLLEdBQUc7QUFDMUIsVUFBTSxJQUFJLE1BQU0sd0RBQXdEO0FBQUEsRUFDNUU7QUFDQSxTQUFPLFNBQVM7QUFDcEI7QUFDQSxTQUFTLG9CQUFvQixRQUFRLE9BQU87QUFDeEMsTUFBSSxPQUFPLFVBQVUsV0FBVztBQUM1QixVQUFNLElBQUksTUFBTSx5REFBeUQ7QUFBQSxFQUM3RTtBQUNBLFNBQU8sa0JBQWtCO0FBQzdCO0FBQ0EsU0FBUyxvQkFBb0IsUUFBUSxPQUFPO0FBRXhDLFNBQU8sa0JBQWtCO0FBQzdCO0FBQ0EsU0FBUyxjQUFjLFFBQVEsT0FBTztBQUNsQyxNQUFJLE9BQU8sVUFBVSxZQUFZLFVBQVUsT0FBTztBQUM5QyxVQUFNLElBQUksTUFBTSxzREFBc0Q7QUFBQSxFQUMxRTtBQUNBLFNBQU8sWUFBWTtBQUN2QjtBQUNBLFNBQVMsZUFBZSxRQUFRLE9BQU87QUFDbkMsTUFBSSxPQUFPLFVBQVUsVUFBVTtBQUMzQixVQUFNLElBQUksTUFBTSw2Q0FBNkM7QUFBQSxFQUNqRTtBQUNBLE1BQUksT0FBTyxPQUFPLGNBQWMsVUFBVTtBQUN0QyxXQUFPLGFBQWEsQ0FBQztBQUNyQixXQUFPLEtBQUssS0FBSyxFQUFFLFFBQVEsU0FBVSxLQUFLO0FBQ3RDLGFBQU8sV0FBVyxHQUFHLElBQUksT0FBTyxZQUFZLE1BQU0sR0FBRztBQUFBLElBQ3pELENBQUM7QUFBQSxFQUNMLE9BQ0s7QUFDRCxXQUFPLGFBQWE7QUFBQSxFQUN4QjtBQUNKO0FBRUEsU0FBUyxZQUFZLFNBQVM7QUFJMUIsTUFBSSxTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsSUFDUixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxtQkFBbUI7QUFBQSxJQUNuQixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsRUFDWjtBQUVBLE1BQUksUUFBUTtBQUFBLElBQ1IsTUFBTSxFQUFFLEdBQUcsT0FBTyxHQUFHLFNBQVM7QUFBQSxJQUM5Qix3QkFBd0IsRUFBRSxHQUFHLE9BQU8sR0FBRywyQkFBMkI7QUFBQSxJQUNsRSxvQkFBb0IsRUFBRSxHQUFHLE9BQU8sR0FBRyx1QkFBdUI7QUFBQSxJQUMxRCxxQkFBcUIsRUFBRSxHQUFHLE9BQU8sR0FBRyx3QkFBd0I7QUFBQSxJQUM1RCxPQUFPLEVBQUUsR0FBRyxNQUFNLEdBQUcsVUFBVTtBQUFBLElBQy9CLFNBQVMsRUFBRSxHQUFHLE1BQU0sR0FBRyxZQUFZO0FBQUEsSUFDbkMsV0FBVyxFQUFFLEdBQUcsTUFBTSxHQUFHLGNBQWM7QUFBQSxJQUN2QyxNQUFNLEVBQUUsR0FBRyxPQUFPLEdBQUcsU0FBUztBQUFBLElBQzlCLFNBQVMsRUFBRSxHQUFHLE9BQU8sR0FBRyxZQUFZO0FBQUEsSUFDcEMsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLEdBQUcsc0JBQXNCO0FBQUEsSUFDeEQsT0FBTyxFQUFFLEdBQUcsTUFBTSxHQUFHLFVBQVU7QUFBQSxJQUMvQixhQUFhLEVBQUUsR0FBRyxPQUFPLEdBQUcsZ0JBQWdCO0FBQUEsSUFDNUMsUUFBUSxFQUFFLEdBQUcsT0FBTyxHQUFHLFdBQVc7QUFBQSxJQUNsQyxPQUFPLEVBQUUsR0FBRyxPQUFPLEdBQUcsVUFBVTtBQUFBLElBQ2hDLFNBQVMsRUFBRSxHQUFHLE9BQU8sR0FBRyxZQUFZO0FBQUEsSUFDcEMsV0FBVyxFQUFFLEdBQUcsTUFBTSxHQUFHLGNBQWM7QUFBQSxJQUN2QyxZQUFZLEVBQUUsR0FBRyxPQUFPLEdBQUcsZUFBZTtBQUFBLElBQzFDLFFBQVEsRUFBRSxHQUFHLE9BQU8sR0FBRyxXQUFXO0FBQUEsSUFDbEMsVUFBVSxFQUFFLEdBQUcsT0FBTyxHQUFHLGFBQWE7QUFBQSxJQUN0QyxpQkFBaUIsRUFBRSxHQUFHLE1BQU0sR0FBRyxvQkFBb0I7QUFBQSxJQUNuRCxpQkFBaUIsRUFBRSxHQUFHLE9BQU8sR0FBRyxvQkFBb0I7QUFBQSxJQUNwRCxXQUFXLEVBQUUsR0FBRyxNQUFNLEdBQUcsY0FBYztBQUFBLElBQ3ZDLFlBQVksRUFBRSxHQUFHLE1BQU0sR0FBRyxlQUFlO0FBQUEsSUFDekMsa0JBQWtCLEVBQUUsR0FBRyxPQUFPLEdBQUcscUJBQXFCO0FBQUEsRUFDMUQ7QUFDQSxNQUFJLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLGFBQWE7QUFBQSxJQUNiLGlCQUFpQjtBQUFBLElBQ2pCLFdBQVc7QUFBQSxJQUNYO0FBQUEsSUFDQSx3QkFBd0I7QUFBQSxJQUN4QixvQkFBb0I7QUFBQSxJQUNwQixxQkFBcUI7QUFBQSxFQUN6QjtBQUVBLE1BQUksUUFBUSxVQUFVLENBQUMsUUFBUSxZQUFZO0FBQ3ZDLFlBQVEsYUFBYSxRQUFRO0FBQUEsRUFDakM7QUFJQSxTQUFPLEtBQUssS0FBSyxFQUFFLFFBQVEsU0FBVSxNQUFNO0FBRXZDLFFBQUksQ0FBQyxNQUFNLFFBQVEsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLE1BQU0sUUFBVztBQUN2RCxVQUFJLE1BQU0sSUFBSSxFQUFFLEdBQUc7QUFDZixjQUFNLElBQUksTUFBTSxrQkFBa0IsT0FBTyxnQkFBZ0I7QUFBQSxNQUM3RDtBQUNBO0FBQUEsSUFDSjtBQUNBLFVBQU0sSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLE1BQU0sUUFBUSxJQUFJLENBQUMsSUFBSSxTQUFTLElBQUksSUFBSSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ2hGLENBQUM7QUFFRCxTQUFPLE9BQU8sUUFBUTtBQUt0QixNQUFJLElBQUksU0FBUyxjQUFjLEtBQUs7QUFDcEMsTUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0I7QUFDdkMsTUFBSSxXQUFXLEVBQUUsTUFBTSxjQUFjO0FBQ3JDLFNBQU8sZ0JBQWdCLFdBQVcsY0FBYyxXQUFXLGdCQUFnQjtBQUUzRSxNQUFJLFNBQVM7QUFBQSxJQUNULENBQUMsUUFBUSxLQUFLO0FBQUEsSUFDZCxDQUFDLFNBQVMsUUFBUTtBQUFBLEVBQ3RCO0FBQ0EsU0FBTyxRQUFRLE9BQU8sT0FBTyxHQUFHLEVBQUUsT0FBTyxHQUFHO0FBQzVDLFNBQU87QUFDWDtBQUVBLFNBQVMsTUFBTSxRQUFRLFNBQVMsaUJBQWlCO0FBQzdDLE1BQUksVUFBVSxXQUFXO0FBQ3pCLE1BQUksMEJBQTBCLDJCQUEyQjtBQUN6RCxNQUFJLGtCQUFrQiwyQkFBMkIsbUJBQW1CO0FBR3BFLE1BQUksZUFBZTtBQUNuQixNQUFJO0FBQ0osTUFBSTtBQUNKLE1BQUk7QUFDSixNQUFJO0FBQ0osTUFBSTtBQUNKLE1BQUk7QUFFSixNQUFJLGlCQUFpQixRQUFRO0FBQzdCLE1BQUksZUFBZSxDQUFDO0FBQ3BCLE1BQUksa0JBQWtCLENBQUM7QUFDdkIsTUFBSSxzQkFBc0IsQ0FBQztBQUMzQixNQUFJLDJCQUEyQjtBQUMvQixNQUFJLGVBQWUsQ0FBQztBQUNwQixNQUFJLHlCQUF5QjtBQUU3QixNQUFJLGlCQUFpQixPQUFPO0FBQzVCLE1BQUksd0JBQXdCLFFBQVEsbUJBQW1CLGVBQWU7QUFDdEUsTUFBSSxhQUFhLGVBQWU7QUFHaEMsTUFBSSxrQkFBa0IsZUFBZSxRQUFRLFNBQVMsUUFBUSxRQUFRLElBQUksSUFBSTtBQUU5RSxXQUFTLFVBQVUsV0FBVyxXQUFXO0FBQ3JDLFFBQUksTUFBTSxlQUFlLGNBQWMsS0FBSztBQUM1QyxRQUFJLFdBQVc7QUFDWCxlQUFTLEtBQUssU0FBUztBQUFBLElBQzNCO0FBQ0EsY0FBVSxZQUFZLEdBQUc7QUFDekIsV0FBTztBQUFBLEVBQ1g7QUFFQSxXQUFTLFVBQVUsTUFBTSxjQUFjO0FBQ25DLFFBQUksU0FBUyxVQUFVLE1BQU0sUUFBUSxXQUFXLE1BQU07QUFDdEQsUUFBSSxTQUFTLFVBQVUsUUFBUSxRQUFRLFdBQVcsTUFBTTtBQUN4RCxjQUFVLFFBQVEsUUFBUSxXQUFXLFNBQVM7QUFDOUMsV0FBTyxhQUFhLGVBQWUsT0FBTyxZQUFZLENBQUM7QUFDdkQsUUFBSSxRQUFRLGlCQUFpQjtBQUd6QixhQUFPLGFBQWEsWUFBWSxHQUFHO0FBQ25DLGFBQU8saUJBQWlCLFdBQVcsU0FBVSxPQUFPO0FBQ2hELGVBQU8sYUFBYSxPQUFPLFlBQVk7QUFBQSxNQUMzQyxDQUFDO0FBQUEsSUFDTDtBQUNBLFFBQUksUUFBUSxxQkFBcUIsUUFBVztBQUN4QyxVQUFJLGVBQWUsUUFBUSxpQkFBaUIsWUFBWTtBQUN4RCxhQUFPLEtBQUssWUFBWSxFQUFFLFFBQVEsU0FBVSxXQUFXO0FBQ25ELGVBQU8sYUFBYSxXQUFXLGFBQWEsU0FBUyxDQUFDO0FBQUEsTUFDMUQsQ0FBQztBQUFBLElBQ0w7QUFDQSxXQUFPLGFBQWEsUUFBUSxRQUFRO0FBQ3BDLFdBQU8sYUFBYSxvQkFBb0IsUUFBUSxNQUFNLGFBQWEsWUFBWTtBQUMvRSxRQUFJLGlCQUFpQixHQUFHO0FBQ3BCLGVBQVMsUUFBUSxRQUFRLFdBQVcsV0FBVztBQUFBLElBQ25ELFdBQ1MsaUJBQWlCLFFBQVEsVUFBVSxHQUFHO0FBQzNDLGVBQVMsUUFBUSxRQUFRLFdBQVcsV0FBVztBQUFBLElBQ25EO0FBQ0EsV0FBTyxTQUFTO0FBQ2hCLFdBQU87QUFBQSxFQUNYO0FBRUEsV0FBUyxXQUFXLE1BQU0sS0FBSztBQUMzQixRQUFJLENBQUMsS0FBSztBQUNOLGFBQU87QUFBQSxJQUNYO0FBQ0EsV0FBTyxVQUFVLE1BQU0sUUFBUSxXQUFXLE9BQU87QUFBQSxFQUNyRDtBQUVBLFdBQVMsWUFBWSxnQkFBZ0IsTUFBTTtBQUN2Qyx3QkFBb0IsVUFBVSxNQUFNLFFBQVEsV0FBVyxRQUFRO0FBQy9ELG9CQUFnQixDQUFDO0FBQ2pCLHFCQUFpQixDQUFDO0FBQ2xCLG1CQUFlLEtBQUssV0FBVyxtQkFBbUIsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUdwRSxhQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsU0FBUyxLQUFLO0FBRXRDLG9CQUFjLEtBQUssVUFBVSxNQUFNLENBQUMsQ0FBQztBQUNyQywwQkFBb0IsQ0FBQyxJQUFJO0FBQ3pCLHFCQUFlLEtBQUssV0FBVyxtQkFBbUIsZUFBZSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQUEsSUFDNUU7QUFBQSxFQUNKO0FBRUEsV0FBUyxVQUFVLFdBQVc7QUFFMUIsYUFBUyxXQUFXLFFBQVEsV0FBVyxNQUFNO0FBQzdDLFFBQUksUUFBUSxRQUFRLEdBQUc7QUFDbkIsZUFBUyxXQUFXLFFBQVEsV0FBVyxHQUFHO0FBQUEsSUFDOUMsT0FDSztBQUNELGVBQVMsV0FBVyxRQUFRLFdBQVcsR0FBRztBQUFBLElBQzlDO0FBQ0EsUUFBSSxRQUFRLFFBQVEsR0FBRztBQUNuQixlQUFTLFdBQVcsUUFBUSxXQUFXLFVBQVU7QUFBQSxJQUNyRCxPQUNLO0FBQ0QsZUFBUyxXQUFXLFFBQVEsV0FBVyxRQUFRO0FBQUEsSUFDbkQ7QUFDQSxRQUFJLGdCQUFnQixpQkFBaUIsU0FBUyxFQUFFO0FBQ2hELFFBQUksa0JBQWtCLE9BQU87QUFDekIsZUFBUyxXQUFXLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUMzRCxPQUNLO0FBQ0QsZUFBUyxXQUFXLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUMzRDtBQUNBLFdBQU8sVUFBVSxXQUFXLFFBQVEsV0FBVyxJQUFJO0FBQUEsRUFDdkQ7QUFDQSxXQUFTLFdBQVcsUUFBUSxjQUFjO0FBQ3RDLFFBQUksQ0FBQyxRQUFRLFlBQVksQ0FBQyxRQUFRLFNBQVMsWUFBWSxHQUFHO0FBQ3RELGFBQU87QUFBQSxJQUNYO0FBQ0EsV0FBTyxVQUFVLE9BQU8sWUFBWSxRQUFRLFdBQVcsT0FBTztBQUFBLEVBQ2xFO0FBQ0EsV0FBUyxtQkFBbUI7QUFDeEIsV0FBTyxhQUFhLGFBQWEsVUFBVTtBQUFBLEVBQy9DO0FBRUEsV0FBUyxpQkFBaUIsY0FBYztBQUNwQyxRQUFJLGVBQWUsY0FBYyxZQUFZO0FBQzdDLFdBQU8sYUFBYSxhQUFhLFVBQVU7QUFBQSxFQUMvQztBQUNBLFdBQVMsUUFBUSxjQUFjO0FBQzNCLFFBQUksaUJBQWlCLFFBQVEsaUJBQWlCLFFBQVc7QUFDckQsb0JBQWMsWUFBWSxFQUFFLGFBQWEsWUFBWSxFQUFFO0FBQ3ZELG9CQUFjLFlBQVksRUFBRSxPQUFPLGdCQUFnQixVQUFVO0FBQUEsSUFDakUsT0FDSztBQUNELG1CQUFhLGFBQWEsWUFBWSxFQUFFO0FBQ3hDLG9CQUFjLFFBQVEsU0FBVSxRQUFRO0FBQ3BDLGVBQU8sT0FBTyxnQkFBZ0IsVUFBVTtBQUFBLE1BQzVDLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUNBLFdBQVMsT0FBTyxjQUFjO0FBQzFCLFFBQUksaUJBQWlCLFFBQVEsaUJBQWlCLFFBQVc7QUFDckQsb0JBQWMsWUFBWSxFQUFFLGdCQUFnQixVQUFVO0FBQ3RELG9CQUFjLFlBQVksRUFBRSxPQUFPLGFBQWEsWUFBWSxHQUFHO0FBQUEsSUFDbkUsT0FDSztBQUNELG1CQUFhLGdCQUFnQixVQUFVO0FBQ3ZDLG9CQUFjLFFBQVEsU0FBVSxRQUFRO0FBQ3BDLGVBQU8sZ0JBQWdCLFVBQVU7QUFDakMsZUFBTyxPQUFPLGFBQWEsWUFBWSxHQUFHO0FBQUEsTUFDOUMsQ0FBQztBQUFBLElBQ0w7QUFBQSxFQUNKO0FBQ0EsV0FBUyxpQkFBaUI7QUFDdEIsUUFBSSxnQkFBZ0I7QUFDaEIsa0JBQVksV0FBVyxrQkFBa0IsUUFBUTtBQUNqRCxxQkFBZSxRQUFRLFNBQVUsU0FBUztBQUN0QyxZQUFJLFNBQVM7QUFDVCx3QkFBYyxPQUFPO0FBQUEsUUFDekI7QUFBQSxNQUNKLENBQUM7QUFDRCx1QkFBaUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0o7QUFFQSxXQUFTLFdBQVc7QUFDaEIsbUJBQWU7QUFFZixxQkFBaUIsY0FBYyxJQUFJLFVBQVU7QUFDN0MsY0FBVSxXQUFXLGtCQUFrQixVQUFVLFNBQVUsUUFBUSxjQUFjLFdBQVc7QUFDeEYsVUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsVUFBVTtBQUN0QztBQUFBLE1BQ0o7QUFDQSxVQUFJLGVBQWUsWUFBWSxNQUFNLE9BQU87QUFDeEM7QUFBQSxNQUNKO0FBQ0EsVUFBSSxpQkFBaUIsT0FBTyxZQUFZO0FBQ3hDLFVBQUksUUFBUSxTQUFTLFlBQVksTUFBTSxNQUFNO0FBQ3pDLHlCQUFpQixRQUFRLFNBQVMsWUFBWSxFQUFFLEdBQUcsVUFBVSxZQUFZLENBQUM7QUFBQSxNQUM5RTtBQUNBLHFCQUFlLFlBQVksRUFBRSxZQUFZO0FBQUEsSUFDN0MsQ0FBQztBQUFBLEVBQ0w7QUFDQSxXQUFTLE9BQU87QUFDWixnQkFBWSxXQUFXLGtCQUFrQixJQUFJO0FBQzdDLGNBQVUsV0FBVyxrQkFBa0IsTUFBTSxTQUFVLFFBQVEsY0FBYyxXQUFXLEtBQUssV0FBVztBQUVwRywwQkFBb0IsUUFBUSxTQUFVLE9BQU87QUFDekMsWUFBSSxTQUFTLGNBQWMsS0FBSztBQUNoQyxZQUFJLE1BQU0sb0JBQW9CLGlCQUFpQixPQUFPLEdBQUcsTUFBTSxNQUFNLElBQUk7QUFDekUsWUFBSSxNQUFNLG9CQUFvQixpQkFBaUIsT0FBTyxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQzNFLFlBQUksTUFBTSxVQUFVLEtBQUs7QUFFekIsWUFBSSxPQUFPLE9BQU8sUUFBUSxXQUFXLEdBQUcsVUFBVSxLQUFLLENBQUMsQ0FBQztBQUV6RCxjQUFNLGVBQWUsYUFBYSxHQUFHLEVBQUUsUUFBUSxDQUFDO0FBQ2hELGNBQU0sZUFBZSxhQUFhLEdBQUcsRUFBRSxRQUFRLENBQUM7QUFDaEQsY0FBTSxlQUFlLGFBQWEsR0FBRyxFQUFFLFFBQVEsQ0FBQztBQUNoRCxlQUFPLFNBQVMsQ0FBQyxFQUFFLGFBQWEsaUJBQWlCLEdBQUc7QUFDcEQsZUFBTyxTQUFTLENBQUMsRUFBRSxhQUFhLGlCQUFpQixHQUFHO0FBQ3BELGVBQU8sU0FBUyxDQUFDLEVBQUUsYUFBYSxpQkFBaUIsR0FBRztBQUNwRCxlQUFPLFNBQVMsQ0FBQyxFQUFFLGFBQWEsa0JBQWtCLElBQUk7QUFBQSxNQUMxRCxDQUFDO0FBQUEsSUFDTCxDQUFDO0FBQUEsRUFDTDtBQUNBLFdBQVMsU0FBU0UsT0FBTTtBQUVwQixRQUFJQSxNQUFLLFNBQVMsU0FBUyxTQUFTQSxNQUFLLFNBQVMsU0FBUyxPQUFPO0FBQzlELGFBQU8sZUFBZTtBQUFBLElBQzFCO0FBQ0EsUUFBSUEsTUFBSyxTQUFTLFNBQVMsT0FBTztBQUM5QixVQUFJQSxNQUFLLFNBQVMsR0FBRztBQUNqQixjQUFNLElBQUksTUFBTSx3REFBd0Q7QUFBQSxNQUM1RTtBQUVBLFVBQUksV0FBV0EsTUFBSyxTQUFTO0FBQzdCLFVBQUksU0FBUyxNQUFNO0FBQ25CLFVBQUksU0FBUyxDQUFDO0FBRWQsYUFBTyxZQUFZO0FBQ2YsZUFBTyxRQUFRLElBQUksV0FBVztBQUFBLE1BQ2xDO0FBQ0EsYUFBTyxLQUFLLEdBQUc7QUFDZixhQUFPLFdBQVcsUUFBUUEsTUFBSyxPQUFPO0FBQUEsSUFDMUM7QUFDQSxRQUFJQSxNQUFLLFNBQVMsU0FBUyxXQUFXO0FBRWxDLGFBQU8sV0FBV0EsTUFBSyxRQUFRQSxNQUFLLE9BQU87QUFBQSxJQUMvQztBQUNBLFFBQUlBLE1BQUssU0FBUyxTQUFTLFFBQVE7QUFFL0IsVUFBSUEsTUFBSyxTQUFTO0FBQ2QsZUFBT0EsTUFBSyxPQUFPLElBQUksU0FBVSxPQUFPO0FBRXBDLGlCQUFPLGVBQWUsYUFBYSxlQUFlLFFBQVEsZUFBZSxXQUFXLEtBQUssQ0FBQyxDQUFDO0FBQUEsUUFDL0YsQ0FBQztBQUFBLE1BQ0w7QUFFQSxhQUFPQSxNQUFLO0FBQUEsSUFDaEI7QUFDQSxXQUFPLENBQUM7QUFBQSxFQUNaO0FBQ0EsV0FBUyxXQUFXLFFBQVEsU0FBUztBQUNqQyxXQUFPLE9BQU8sSUFBSSxTQUFVLE9BQU87QUFDL0IsYUFBTyxlQUFlLGFBQWEsVUFBVSxlQUFlLFFBQVEsS0FBSyxJQUFJLEtBQUs7QUFBQSxJQUN0RixDQUFDO0FBQUEsRUFDTDtBQUNBLFdBQVMsZUFBZUEsT0FBTTtBQUMxQixhQUFTLGNBQWMsT0FBTyxXQUFXO0FBRXJDLGFBQU8sUUFBUSxRQUFRLFdBQVcsUUFBUSxDQUFDLENBQUM7QUFBQSxJQUNoRDtBQUNBLFFBQUksUUFBUSxTQUFTQSxLQUFJO0FBQ3pCLFFBQUksVUFBVSxDQUFDO0FBQ2YsUUFBSSxlQUFlLGVBQWUsS0FBSyxDQUFDO0FBQ3hDLFFBQUksY0FBYyxlQUFlLEtBQUssZUFBZSxLQUFLLFNBQVMsQ0FBQztBQUNwRSxRQUFJLGNBQWM7QUFDbEIsUUFBSSxhQUFhO0FBQ2pCLFFBQUksVUFBVTtBQUVkLFlBQVEsT0FBTyxNQUFNLE1BQU0sRUFBRSxLQUFLLFNBQVUsR0FBRyxHQUFHO0FBQzlDLGFBQU8sSUFBSTtBQUFBLElBQ2YsQ0FBQyxDQUFDO0FBRUYsUUFBSSxNQUFNLENBQUMsTUFBTSxjQUFjO0FBQzNCLFlBQU0sUUFBUSxZQUFZO0FBQzFCLG9CQUFjO0FBQUEsSUFDbEI7QUFFQSxRQUFJLE1BQU0sTUFBTSxTQUFTLENBQUMsTUFBTSxhQUFhO0FBQ3pDLFlBQU0sS0FBSyxXQUFXO0FBQ3RCLG1CQUFhO0FBQUEsSUFDakI7QUFDQSxVQUFNLFFBQVEsU0FBVSxTQUFTLE9BQU87QUFFcEMsVUFBSTtBQUNKLFVBQUk7QUFDSixVQUFJO0FBQ0osVUFBSSxNQUFNO0FBQ1YsVUFBSSxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQzFCLFVBQUk7QUFDSixVQUFJO0FBQ0osVUFBSTtBQUNKLFVBQUk7QUFDSixVQUFJO0FBQ0osVUFBSTtBQUNKLFVBQUk7QUFDSixVQUFJLFVBQVVBLE1BQUssU0FBUyxTQUFTO0FBR3JDLFVBQUksU0FBUztBQUNULGVBQU8sZUFBZSxVQUFVLEtBQUs7QUFBQSxNQUN6QztBQUVBLFVBQUksQ0FBQyxNQUFNO0FBQ1AsZUFBTyxPQUFPO0FBQUEsTUFDbEI7QUFFQSxVQUFJLFNBQVMsUUFBVztBQUNwQixlQUFPO0FBQUEsTUFDWDtBQUVBLGFBQU8sS0FBSyxJQUFJLE1BQU0sSUFBUztBQUUvQixXQUFLLElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxjQUFjLEdBQUcsSUFBSSxHQUFHO0FBR2pELGlCQUFTLGVBQWUsV0FBVyxDQUFDO0FBQ3BDLHdCQUFnQixTQUFTO0FBQ3pCLGdCQUFRLGlCQUFpQkEsTUFBSyxXQUFXO0FBQ3pDLG9CQUFZLEtBQUssTUFBTSxLQUFLO0FBSzVCLG1CQUFXLGdCQUFnQjtBQUczQixhQUFLLElBQUksR0FBRyxLQUFLLFdBQVcsS0FBSyxHQUFHO0FBS2hDLG1CQUFTLFVBQVUsSUFBSTtBQUN2QixrQkFBUSxPQUFPLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLGFBQWEsTUFBTSxHQUFHLENBQUM7QUFBQSxRQUN4RTtBQUVBLGVBQU8sTUFBTSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsYUFBYSxVQUFVLFNBQVMsYUFBYSxTQUFTO0FBRTlGLFlBQUksQ0FBQyxTQUFTLGVBQWUsTUFBTSxNQUFNO0FBQ3JDLGlCQUFPO0FBQUEsUUFDWDtBQUNBLFlBQUksRUFBRSxNQUFNLFFBQVEsYUFBYTtBQUU3QixrQkFBUSxPQUFPLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7QUFBQSxRQUN6QztBQUVBLGtCQUFVO0FBQUEsTUFDZDtBQUFBLElBQ0osQ0FBQztBQUNELFdBQU87QUFBQSxFQUNYO0FBQ0EsV0FBUyxXQUFXLFFBQVEsWUFBWSxXQUFXO0FBQy9DLFFBQUksSUFBSTtBQUNSLFFBQUksVUFBVSxlQUFlLGNBQWMsS0FBSztBQUNoRCxRQUFJLG9CQUFvQixLQUFLLENBQUMsR0FDMUIsR0FBRyxTQUFTLElBQUksSUFBSSxJQUNwQixHQUFHLFNBQVMsT0FBTyxJQUFJLFFBQVEsV0FBVyxhQUMxQyxHQUFHLFNBQVMsVUFBVSxJQUFJLFFBQVEsV0FBVyxZQUM3QyxHQUFHLFNBQVMsVUFBVSxJQUFJLFFBQVEsV0FBVyxVQUM3QztBQUNKLFFBQUkscUJBQXFCLEtBQUssQ0FBQyxHQUMzQixHQUFHLFNBQVMsSUFBSSxJQUFJLElBQ3BCLEdBQUcsU0FBUyxPQUFPLElBQUksUUFBUSxXQUFXLGNBQzFDLEdBQUcsU0FBUyxVQUFVLElBQUksUUFBUSxXQUFXLGFBQzdDLEdBQUcsU0FBUyxVQUFVLElBQUksUUFBUSxXQUFXLFdBQzdDO0FBQ0osUUFBSSwwQkFBMEIsQ0FBQyxRQUFRLFdBQVcsaUJBQWlCLFFBQVEsV0FBVyxhQUFhO0FBQ25HLFFBQUksMkJBQTJCLENBQUMsUUFBUSxXQUFXLGtCQUFrQixRQUFRLFdBQVcsY0FBYztBQUN0RyxhQUFTLFNBQVMsUUFBUSxXQUFXLElBQUk7QUFDekMsYUFBUyxTQUFTLFFBQVEsUUFBUSxJQUFJLFFBQVEsV0FBVyxpQkFBaUIsUUFBUSxXQUFXLFlBQVk7QUFDekcsYUFBUyxXQUFXLE1BQU0sUUFBUTtBQUM5QixVQUFJLElBQUksV0FBVyxRQUFRLFdBQVc7QUFDdEMsVUFBSSxxQkFBcUIsSUFBSSwwQkFBMEI7QUFDdkQsVUFBSSxjQUFjLElBQUksbUJBQW1CO0FBQ3pDLGFBQU8sU0FBUyxNQUFNLG1CQUFtQixRQUFRLEdBQUcsSUFBSSxNQUFNLFlBQVksSUFBSTtBQUFBLElBQ2xGO0FBQ0EsYUFBUyxVQUFVQyxTQUFRLE9BQU8sTUFBTTtBQUVwQyxhQUFPLGFBQWEsV0FBVyxPQUFPLElBQUksSUFBSTtBQUM5QyxVQUFJLFNBQVMsU0FBUyxNQUFNO0FBQ3hCO0FBQUEsTUFDSjtBQUVBLFVBQUksT0FBTyxVQUFVLFNBQVMsS0FBSztBQUNuQyxXQUFLLFlBQVksV0FBVyxNQUFNLFFBQVEsV0FBVyxNQUFNO0FBQzNELFdBQUssTUFBTSxRQUFRLEtBQUssSUFBSUEsVUFBUztBQUVyQyxVQUFJLE9BQU8sU0FBUyxTQUFTO0FBQ3pCLGVBQU8sVUFBVSxTQUFTLEtBQUs7QUFDL0IsYUFBSyxZQUFZLFdBQVcsTUFBTSxRQUFRLFdBQVcsS0FBSztBQUMxRCxhQUFLLGFBQWEsY0FBYyxPQUFPLEtBQUssQ0FBQztBQUM3QyxhQUFLLE1BQU0sUUFBUSxLQUFLLElBQUlBLFVBQVM7QUFDckMsYUFBSyxZQUFZLE9BQU8sVUFBVSxHQUFHLEtBQUssQ0FBQztBQUFBLE1BQy9DO0FBQUEsSUFDSjtBQUVBLFdBQU8sS0FBSyxNQUFNLEVBQUUsUUFBUSxTQUFVQSxTQUFRO0FBQzFDLGdCQUFVQSxTQUFRLE9BQU9BLE9BQU0sRUFBRSxDQUFDLEdBQUcsT0FBT0EsT0FBTSxFQUFFLENBQUMsQ0FBQztBQUFBLElBQzFELENBQUM7QUFDRCxXQUFPO0FBQUEsRUFDWDtBQUNBLFdBQVMsYUFBYTtBQUNsQixRQUFJLFlBQVk7QUFDWixvQkFBYyxVQUFVO0FBQ3hCLG1CQUFhO0FBQUEsSUFDakI7QUFBQSxFQUNKO0FBQ0EsV0FBUyxLQUFLRCxPQUFNO0FBRWhCLGVBQVc7QUFDWCxRQUFJLFNBQVMsZUFBZUEsS0FBSTtBQUNoQyxRQUFJLFNBQVNBLE1BQUs7QUFDbEIsUUFBSSxTQUFTQSxNQUFLLFVBQVU7QUFBQSxNQUN4QixJQUFJLFNBQVUsT0FBTztBQUNqQixlQUFPLE9BQU8sS0FBSyxNQUFNLEtBQUssQ0FBQztBQUFBLE1BQ25DO0FBQUEsSUFDSjtBQUNBLGlCQUFhLGFBQWEsWUFBWSxXQUFXLFFBQVEsUUFBUSxNQUFNLENBQUM7QUFDeEUsV0FBTztBQUFBLEVBQ1g7QUFFQSxXQUFTLFdBQVc7QUFDaEIsUUFBSSxPQUFPLFdBQVcsc0JBQXNCO0FBQzVDLFFBQUksTUFBTyxXQUFXLENBQUMsU0FBUyxRQUFRLEVBQUUsUUFBUSxHQUFHO0FBQ3JELFdBQU8sUUFBUSxRQUFRLElBQUksS0FBSyxTQUFTLFdBQVcsR0FBRyxJQUFJLEtBQUssVUFBVSxXQUFXLEdBQUc7QUFBQSxFQUM1RjtBQUVBLFdBQVMsWUFBWSxRQUFRLFNBQVMsVUFBVSxNQUFNO0FBR2xELFFBQUksU0FBUyxTQUFVLE9BQU87QUFDMUIsVUFBSSxJQUFJLFNBQVMsT0FBTyxLQUFLLFlBQVksS0FBSyxVQUFVLE9BQU87QUFHL0QsVUFBSSxDQUFDLEdBQUc7QUFDSixlQUFPO0FBQUEsTUFDWDtBQUdBLFVBQUksaUJBQWlCLEtBQUssQ0FBQyxLQUFLLGFBQWE7QUFDekMsZUFBTztBQUFBLE1BQ1g7QUFFQSxVQUFJLFNBQVMsY0FBYyxRQUFRLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxhQUFhO0FBQ3JFLGVBQU87QUFBQSxNQUNYO0FBRUEsVUFBSSxXQUFXLFFBQVEsU0FBUyxFQUFFLFlBQVksVUFBYSxFQUFFLFVBQVUsR0FBRztBQUN0RSxlQUFPO0FBQUEsTUFDWDtBQUVBLFVBQUksS0FBSyxTQUFTLEVBQUUsU0FBUztBQUN6QixlQUFPO0FBQUEsTUFDWDtBQU1BLFVBQUksQ0FBQyxpQkFBaUI7QUFDbEIsVUFBRSxlQUFlO0FBQUEsTUFDckI7QUFDQSxRQUFFLFlBQVksRUFBRSxPQUFPLFFBQVEsR0FBRztBQUVsQyxlQUFTLEdBQUcsSUFBSTtBQUNoQjtBQUFBLElBQ0o7QUFDQSxRQUFJLFVBQVUsQ0FBQztBQUVmLFdBQU8sTUFBTSxHQUFHLEVBQUUsUUFBUSxTQUFVLFdBQVc7QUFDM0MsY0FBUSxpQkFBaUIsV0FBVyxRQUFRLGtCQUFrQixFQUFFLFNBQVMsS0FBSyxJQUFJLEtBQUs7QUFDdkYsY0FBUSxLQUFLLENBQUMsV0FBVyxNQUFNLENBQUM7QUFBQSxJQUNwQyxDQUFDO0FBQ0QsV0FBTztBQUFBLEVBQ1g7QUFFQSxXQUFTLFNBQVMsR0FBRyxZQUFZLGFBQWE7QUFJMUMsUUFBSSxRQUFRLEVBQUUsS0FBSyxRQUFRLE9BQU8sTUFBTTtBQUN4QyxRQUFJLFFBQVEsRUFBRSxLQUFLLFFBQVEsT0FBTyxNQUFNO0FBQ3hDLFFBQUksVUFBVSxFQUFFLEtBQUssUUFBUSxTQUFTLE1BQU07QUFDNUMsUUFBSSxJQUFJO0FBQ1IsUUFBSSxJQUFJO0FBRVIsUUFBSSxFQUFFLEtBQUssUUFBUSxXQUFXLE1BQU0sR0FBRztBQUNuQyxnQkFBVTtBQUFBLElBQ2Q7QUFJQSxRQUFJLEVBQUUsU0FBUyxlQUFlLENBQUMsRUFBRSxXQUFXLENBQUMsRUFBRSxTQUFTO0FBQ3BELGFBQU87QUFBQSxJQUNYO0FBRUEsUUFBSSxPQUFPO0FBRVAsVUFBSSxrQkFBa0IsU0FBVSxZQUFZO0FBQ3hDLFlBQUlFLFVBQVMsV0FBVztBQUN4QixlQUFRQSxZQUFXLGVBQ2YsWUFBWSxTQUFTQSxPQUFNLEtBQzFCLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU07QUFBQSxNQUNwRDtBQUdBLFVBQUksRUFBRSxTQUFTLGNBQWM7QUFDekIsWUFBSSxnQkFBZ0IsTUFBTSxVQUFVLE9BQU8sS0FBSyxFQUFFLFNBQVMsZUFBZTtBQUUxRSxZQUFJLGNBQWMsU0FBUyxHQUFHO0FBQzFCLGlCQUFPO0FBQUEsUUFDWDtBQUNBLFlBQUksY0FBYyxDQUFDLEVBQUU7QUFDckIsWUFBSSxjQUFjLENBQUMsRUFBRTtBQUFBLE1BQ3pCLE9BQ0s7QUFFRCxZQUFJLGNBQWMsTUFBTSxVQUFVLEtBQUssS0FBSyxFQUFFLGdCQUFnQixlQUFlO0FBRTdFLFlBQUksQ0FBQyxhQUFhO0FBQ2QsaUJBQU87QUFBQSxRQUNYO0FBQ0EsWUFBSSxZQUFZO0FBQ2hCLFlBQUksWUFBWTtBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUNBLGlCQUFhLGNBQWMsY0FBYyxjQUFjO0FBQ3ZELFFBQUksU0FBUyxTQUFTO0FBQ2xCLFVBQUksRUFBRSxVQUFVLFdBQVc7QUFDM0IsVUFBSSxFQUFFLFVBQVUsV0FBVztBQUFBLElBQy9CO0FBQ0EsTUFBRSxhQUFhO0FBQ2YsTUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDO0FBQ2hCLE1BQUUsU0FBUyxTQUFTO0FBQ3BCLFdBQU87QUFBQSxFQUNYO0FBRUEsV0FBUyxzQkFBc0IsV0FBVztBQUN0QyxRQUFJLFdBQVcsWUFBWSxPQUFPLFlBQVksUUFBUSxHQUFHO0FBQ3pELFFBQUksV0FBWSxXQUFXLE1BQU8sU0FBUztBQUkzQyxlQUFXLE1BQU0sUUFBUTtBQUN6QixXQUFPLFFBQVEsTUFBTSxNQUFNLFdBQVc7QUFBQSxFQUMxQztBQUVBLFdBQVMsaUJBQWlCLGlCQUFpQjtBQUN2QyxRQUFJLHFCQUFxQjtBQUN6QixRQUFJLGVBQWU7QUFDbkIsa0JBQWMsUUFBUSxTQUFVLFFBQVEsT0FBTztBQUUzQyxVQUFJLGlCQUFpQixLQUFLLEdBQUc7QUFDekI7QUFBQSxNQUNKO0FBQ0EsVUFBSSxpQkFBaUIsZ0JBQWdCLEtBQUs7QUFDMUMsVUFBSSwyQkFBMkIsS0FBSyxJQUFJLGlCQUFpQixlQUFlO0FBRXhFLFVBQUksY0FBYyw2QkFBNkIsT0FBTyx1QkFBdUI7QUFFN0UsVUFBSSxXQUFXLDJCQUEyQjtBQUMxQyxVQUFJLGdCQUFnQiw0QkFBNEIsc0JBQXNCLGtCQUFrQjtBQUN4RixVQUFJLFlBQVksaUJBQWlCLGFBQWE7QUFDMUMsdUJBQWU7QUFDZiw2QkFBcUI7QUFBQSxNQUN6QjtBQUFBLElBQ0osQ0FBQztBQUNELFdBQU87QUFBQSxFQUNYO0FBRUEsV0FBUyxjQUFjLE9BQU8sTUFBTTtBQUNoQyxRQUFJLE1BQU0sU0FBUyxjQUNmLE1BQU0sT0FBTyxhQUFhLFVBQzFCLE1BQU0sa0JBQWtCLE1BQU07QUFDOUIsZUFBUyxPQUFPLElBQUk7QUFBQSxJQUN4QjtBQUFBLEVBQ0o7QUFFQSxXQUFTLFVBQVUsT0FBTyxNQUFNO0FBTTVCLFFBQUksVUFBVSxXQUFXLFFBQVEsUUFBUSxNQUFNLE1BQU0sTUFBTSxZQUFZLEtBQUssS0FBSyxvQkFBb0IsR0FBRztBQUNwRyxhQUFPLFNBQVMsT0FBTyxJQUFJO0FBQUEsSUFDL0I7QUFFQSxRQUFJLFlBQVksUUFBUSxNQUFNLEtBQUssTUFBTSxNQUFNLFlBQVksS0FBSztBQUVoRSxRQUFJLFdBQVksV0FBVyxNQUFPLEtBQUs7QUFDdkMsZ0JBQVksV0FBVyxHQUFHLFVBQVUsS0FBSyxXQUFXLEtBQUssZUFBZSxLQUFLLE9BQU87QUFBQSxFQUN4RjtBQUVBLFdBQVMsU0FBUyxPQUFPLE1BQU07QUFFM0IsUUFBSSxLQUFLLFFBQVE7QUFDYixrQkFBWSxLQUFLLFFBQVEsUUFBUSxXQUFXLE1BQU07QUFDbEQsa0NBQTRCO0FBQUEsSUFDaEM7QUFFQSxTQUFLLFVBQVUsUUFBUSxTQUFVLEdBQUc7QUFDaEMsNEJBQXNCLG9CQUFvQixFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUFBLElBQ3hELENBQUM7QUFDRCxRQUFJLDZCQUE2QixHQUFHO0FBRWhDLGtCQUFZLGNBQWMsUUFBUSxXQUFXLElBQUk7QUFDakQsZ0JBQVU7QUFFVixVQUFJLE1BQU0sUUFBUTtBQUNkLG1CQUFXLE1BQU0sU0FBUztBQUMxQixtQkFBVyxvQkFBb0IsZUFBZSxjQUFjO0FBQUEsTUFDaEU7QUFBQSxJQUNKO0FBQ0EsUUFBSSxRQUFRLE9BQU8sYUFBYTtBQUM1QixXQUFLLGNBQWMsUUFBUSxTQUFVLGNBQWM7QUFDL0Msa0JBQVUsY0FBYyxnQkFBZ0IsWUFBWSxHQUFHLE1BQU0sTUFBTSxPQUFPLEtBQUs7QUFBQSxNQUNuRixDQUFDO0FBQ0QsV0FBSyxjQUFjLFFBQVEsU0FBVSxjQUFjO0FBQy9DLGtCQUFVLFVBQVUsWUFBWTtBQUFBLE1BQ3BDLENBQUM7QUFBQSxJQUNMO0FBQ0EsU0FBSyxjQUFjLFFBQVEsU0FBVSxjQUFjO0FBQy9DLGdCQUFVLFVBQVUsWUFBWTtBQUNoQyxnQkFBVSxPQUFPLFlBQVk7QUFDN0IsZ0JBQVUsT0FBTyxZQUFZO0FBQUEsSUFDakMsQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLFdBQVcsT0FBTyxNQUFNO0FBRTdCLFFBQUksS0FBSyxjQUFjLEtBQUssZ0JBQWdCLEdBQUc7QUFDM0M7QUFBQSxJQUNKO0FBQ0EsUUFBSTtBQUNKLFFBQUksS0FBSyxjQUFjLFdBQVcsR0FBRztBQUNqQyxVQUFJLGVBQWUsY0FBYyxLQUFLLGNBQWMsQ0FBQyxDQUFDO0FBQ3RELGVBQVMsYUFBYSxTQUFTLENBQUM7QUFDaEMsa0NBQTRCO0FBRTVCLGVBQVMsUUFBUSxRQUFRLFdBQVcsTUFBTTtBQUFBLElBQzlDO0FBRUEsVUFBTSxnQkFBZ0I7QUFFdEIsUUFBSSxZQUFZLENBQUM7QUFFakIsUUFBSSxZQUFZLFlBQVksUUFBUSxNQUFNLHVCQUF1QixXQUFXO0FBQUE7QUFBQTtBQUFBLE1BR3hFLFFBQVEsTUFBTTtBQUFBLE1BQ2Q7QUFBQSxNQUNBLFNBQVMsS0FBSztBQUFBLE1BQ2Q7QUFBQSxNQUNBLGdCQUFnQixNQUFNO0FBQUEsTUFDdEIsVUFBVSxTQUFTO0FBQUEsTUFDbkIsWUFBWSxNQUFNO0FBQUEsTUFDbEIsZUFBZSxLQUFLO0FBQUEsTUFDcEIsaUJBQWlCLE1BQU07QUFBQSxNQUN2QixXQUFXLGdCQUFnQixNQUFNO0FBQUEsSUFDckMsQ0FBQztBQUNELFFBQUksV0FBVyxZQUFZLFFBQVEsS0FBSyx1QkFBdUIsVUFBVTtBQUFBLE1BQ3JFLFFBQVEsTUFBTTtBQUFBLE1BQ2Q7QUFBQSxNQUNBO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixlQUFlLEtBQUs7QUFBQSxJQUN4QixDQUFDO0FBQ0QsUUFBSSxXQUFXLFlBQVksWUFBWSx1QkFBdUIsZUFBZTtBQUFBLE1BQ3pFLFFBQVEsTUFBTTtBQUFBLE1BQ2Q7QUFBQSxNQUNBO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixlQUFlLEtBQUs7QUFBQSxJQUN4QixDQUFDO0FBR0QsY0FBVSxLQUFLLE1BQU0sV0FBVyxVQUFVLE9BQU8sVUFBVSxRQUFRLENBQUM7QUFHcEUsUUFBSSxNQUFNLFFBQVE7QUFFZCxpQkFBVyxNQUFNLFNBQVMsaUJBQWlCLE1BQU0sTUFBTSxFQUFFO0FBRXpELFVBQUksY0FBYyxTQUFTLEdBQUc7QUFDMUIsaUJBQVMsY0FBYyxRQUFRLFdBQVcsSUFBSTtBQUFBLE1BQ2xEO0FBT0EsaUJBQVcsaUJBQWlCLGVBQWUsZ0JBQWdCLEtBQUs7QUFBQSxJQUNwRTtBQUNBLFNBQUssY0FBYyxRQUFRLFNBQVUsY0FBYztBQUMvQyxnQkFBVSxTQUFTLFlBQVk7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDTDtBQUVBLFdBQVMsU0FBUyxPQUFPO0FBRXJCLFVBQU0sZ0JBQWdCO0FBQ3RCLFFBQUksV0FBVyxzQkFBc0IsTUFBTSxTQUFTO0FBQ3BELFFBQUksZUFBZSxpQkFBaUIsUUFBUTtBQUU1QyxRQUFJLGlCQUFpQixPQUFPO0FBQ3hCO0FBQUEsSUFDSjtBQUdBLFFBQUksQ0FBQyxRQUFRLE9BQU8sTUFBTTtBQUN0QixrQkFBWSxjQUFjLFFBQVEsV0FBVyxLQUFLLFFBQVEsaUJBQWlCO0FBQUEsSUFDL0U7QUFDQSxjQUFVLGNBQWMsVUFBVSxNQUFNLElBQUk7QUFDNUMsY0FBVTtBQUNWLGNBQVUsU0FBUyxjQUFjLElBQUk7QUFDckMsY0FBVSxVQUFVLGNBQWMsSUFBSTtBQUN0QyxRQUFJLENBQUMsUUFBUSxPQUFPLE1BQU07QUFDdEIsZ0JBQVUsVUFBVSxjQUFjLElBQUk7QUFDdEMsZ0JBQVUsT0FBTyxjQUFjLElBQUk7QUFBQSxJQUN2QyxPQUNLO0FBQ0QsaUJBQVcsT0FBTyxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUFBLElBQ3ZEO0FBQUEsRUFDSjtBQUVBLFdBQVMsV0FBVyxPQUFPO0FBQ3ZCLFFBQUksV0FBVyxzQkFBc0IsTUFBTSxTQUFTO0FBQ3BELFFBQUksS0FBSyxlQUFlLFFBQVEsUUFBUTtBQUN4QyxRQUFJLFFBQVEsZUFBZSxhQUFhLEVBQUU7QUFDMUMsV0FBTyxLQUFLLFlBQVksRUFBRSxRQUFRLFNBQVUsYUFBYTtBQUNyRCxVQUFJLFlBQVksWUFBWSxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDdkMscUJBQWEsV0FBVyxFQUFFLFFBQVEsU0FBVSxVQUFVO0FBQ2xELG1CQUFTLEtBQUssWUFBWSxLQUFLO0FBQUEsUUFDbkMsQ0FBQztBQUFBLE1BQ0w7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBR0EsV0FBUyxhQUFhLE9BQU8sY0FBYztBQUN2QyxRQUFJLGlCQUFpQixLQUFLLGlCQUFpQixZQUFZLEdBQUc7QUFDdEQsYUFBTztBQUFBLElBQ1g7QUFDQSxRQUFJLGlCQUFpQixDQUFDLFFBQVEsT0FBTztBQUNyQyxRQUFJLGVBQWUsQ0FBQyxRQUFRLElBQUk7QUFDaEMsUUFBSSxnQkFBZ0IsQ0FBQyxZQUFZLFFBQVE7QUFDekMsUUFBSSxXQUFXLENBQUMsUUFBUSxLQUFLO0FBQzdCLFFBQUksUUFBUSxPQUFPLENBQUMsUUFBUSxLQUFLO0FBRTdCLHFCQUFlLFFBQVE7QUFBQSxJQUMzQixXQUNTLFFBQVEsT0FBTyxDQUFDLFFBQVEsS0FBSztBQUVsQyxtQkFBYSxRQUFRO0FBQ3JCLG9CQUFjLFFBQVE7QUFBQSxJQUMxQjtBQUVBLFFBQUksTUFBTSxNQUFNLElBQUksUUFBUSxTQUFTLEVBQUU7QUFDdkMsUUFBSSxjQUFjLFFBQVEsY0FBYyxDQUFDO0FBQ3pDLFFBQUksWUFBWSxRQUFRLGNBQWMsQ0FBQztBQUN2QyxRQUFJLFNBQVMsUUFBUSxhQUFhLENBQUMsS0FBSyxRQUFRLGVBQWUsQ0FBQyxLQUFLO0FBQ3JFLFFBQUksT0FBTyxRQUFRLGFBQWEsQ0FBQyxLQUFLLFFBQVEsZUFBZSxDQUFDLEtBQUs7QUFDbkUsUUFBSSxRQUFRLFFBQVEsU0FBUyxDQUFDO0FBQzlCLFFBQUksUUFBUSxRQUFRLFNBQVMsQ0FBQztBQUM5QixRQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTztBQUN0QyxhQUFPO0FBQUEsSUFDWDtBQUNBLFVBQU0sZUFBZTtBQUNyQixRQUFJO0FBQ0osUUFBSSxRQUFRLFFBQVE7QUFDaEIsVUFBSSxZQUFZLFNBQVMsSUFBSTtBQUM3QixVQUFJLFFBQVEsc0JBQXNCLFlBQVk7QUFDOUMsVUFBSSxPQUFPLE1BQU0sU0FBUztBQUUxQixVQUFJLFNBQVMsTUFBTTtBQUNmLGVBQU87QUFBQSxNQUNYO0FBRUEsVUFBSSxTQUFTLE9BQU87QUFDaEIsZUFBTyxlQUFlLGVBQWUsZ0JBQWdCLFlBQVksR0FBRyxRQUFRLFFBQVEsbUJBQW1CO0FBQUEsTUFDM0c7QUFDQSxVQUFJLGFBQWEsYUFBYTtBQUMxQixnQkFBUSxRQUFRO0FBQUEsTUFDcEIsT0FDSztBQUNELGdCQUFRLFFBQVE7QUFBQSxNQUNwQjtBQUVBLGFBQU8sS0FBSyxJQUFJLE1BQU0sSUFBUztBQUUvQixjQUFRLFNBQVMsS0FBSyxLQUFLO0FBQzNCLFdBQUssYUFBYSxZQUFZLElBQUk7QUFBQSxJQUN0QyxXQUNTLE9BQU87QUFFWixXQUFLLFFBQVEsU0FBUyxLQUFLLFFBQVEsU0FBUyxLQUFLLFNBQVMsQ0FBQztBQUFBLElBQy9ELE9BQ0s7QUFFRCxXQUFLLFFBQVEsU0FBUyxLQUFLLENBQUM7QUFBQSxJQUNoQztBQUNBLGNBQVUsY0FBYyxlQUFlLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBSTtBQUNqRSxjQUFVLFNBQVMsWUFBWTtBQUMvQixjQUFVLFVBQVUsWUFBWTtBQUNoQyxjQUFVLFVBQVUsWUFBWTtBQUNoQyxjQUFVLE9BQU8sWUFBWTtBQUM3QixXQUFPO0FBQUEsRUFDWDtBQUVBLFdBQVMsaUJBQWlCLFdBQVc7QUFFakMsUUFBSSxDQUFDLFVBQVUsT0FBTztBQUNsQixvQkFBYyxRQUFRLFNBQVUsUUFBUSxPQUFPO0FBRzNDLG9CQUFZLFFBQVEsT0FBTyxPQUFPLFNBQVMsQ0FBQyxHQUFHLFlBQVk7QUFBQSxVQUN2RCxlQUFlLENBQUMsS0FBSztBQUFBLFFBQ3pCLENBQUM7QUFBQSxNQUNMLENBQUM7QUFBQSxJQUNMO0FBRUEsUUFBSSxVQUFVLEtBQUs7QUFDZixrQkFBWSxRQUFRLE9BQU8sWUFBWSxVQUFVLENBQUMsQ0FBQztBQUFBLElBQ3ZEO0FBRUEsUUFBSSxVQUFVLE9BQU87QUFDakIsa0JBQVksUUFBUSxNQUFNLFlBQVksWUFBWTtBQUFBLFFBQzlDLE9BQU87QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNMO0FBRUEsUUFBSSxVQUFVLE1BQU07QUFDaEIscUJBQWUsUUFBUSxTQUFVLFNBQVMsT0FBTztBQUM3QyxZQUFJLFlBQVksU0FBUyxVQUFVLEtBQUssVUFBVSxlQUFlLFNBQVMsR0FBRztBQUN6RTtBQUFBLFFBQ0o7QUFDQSxZQUFJLGVBQWUsY0FBYyxRQUFRLENBQUM7QUFDMUMsWUFBSSxjQUFjLGNBQWMsS0FBSztBQUNyQyxZQUFJLGVBQWUsQ0FBQyxPQUFPO0FBQzNCLFlBQUksZ0JBQWdCLENBQUMsY0FBYyxXQUFXO0FBQzlDLFlBQUksc0JBQXNCLENBQUMsUUFBUSxHQUFHLEtBQUs7QUFDM0MsaUJBQVMsU0FBUyxRQUFRLFdBQVcsU0FBUztBQUs5QyxZQUFJLFVBQVUsT0FBTztBQUNqQix1QkFBYSxLQUFLLGFBQWEsU0FBUyxDQUFDLENBQUM7QUFDMUMsdUJBQWEsS0FBSyxZQUFZLFNBQVMsQ0FBQyxDQUFDO0FBQUEsUUFDN0M7QUFDQSxZQUFJLFVBQVUsU0FBUztBQUNuQiwwQkFBZ0I7QUFDaEIsZ0NBQXNCO0FBQUEsUUFDMUI7QUFDQSxxQkFBYSxRQUFRLFNBQVUsYUFBYTtBQUN4QyxzQkFBWSxRQUFRLE9BQU8sYUFBYSxZQUFZO0FBQUEsWUFDaEQsU0FBUztBQUFBLFlBQ1QsZUFBZTtBQUFBLFlBQ2Y7QUFBQSxVQUNKLENBQUM7QUFBQSxRQUNMLENBQUM7QUFBQSxNQUNMLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUVBLFdBQVMsVUFBVSxpQkFBaUIsVUFBVTtBQUMxQyxpQkFBYSxlQUFlLElBQUksYUFBYSxlQUFlLEtBQUssQ0FBQztBQUNsRSxpQkFBYSxlQUFlLEVBQUUsS0FBSyxRQUFRO0FBRTNDLFFBQUksZ0JBQWdCLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxVQUFVO0FBQzVDLG9CQUFjLFFBQVEsU0FBVSxHQUFHLE9BQU87QUFDdEMsa0JBQVUsVUFBVSxLQUFLO0FBQUEsTUFDN0IsQ0FBQztBQUFBLElBQ0w7QUFBQSxFQUNKO0FBQ0EsV0FBUyxvQkFBb0IsV0FBVztBQUNwQyxXQUFPLGNBQWMsa0JBQWtCLFFBQVEsY0FBYyxrQkFBa0I7QUFBQSxFQUNuRjtBQUVBLFdBQVMsWUFBWSxpQkFBaUI7QUFDbEMsUUFBSSxRQUFRLG1CQUFtQixnQkFBZ0IsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUMzRCxRQUFJLFlBQVksUUFBUSxnQkFBZ0IsVUFBVSxNQUFNLE1BQU0sSUFBSTtBQUNsRSxXQUFPLEtBQUssWUFBWSxFQUFFLFFBQVEsU0FBVSxNQUFNO0FBQzlDLFVBQUksU0FBUyxLQUFLLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDOUIsVUFBSSxhQUFhLEtBQUssVUFBVSxPQUFPLE1BQU07QUFDN0MsV0FBSyxDQUFDLFNBQVMsVUFBVSxZQUFZLENBQUMsYUFBYSxjQUFjLGFBQWE7QUFFMUUsWUFBSSxDQUFDLG9CQUFvQixVQUFVLEtBQUssY0FBYyxZQUFZO0FBQzlELGlCQUFPLGFBQWEsSUFBSTtBQUFBLFFBQzVCO0FBQUEsTUFDSjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLFVBQVUsV0FBVyxjQUFjLEtBQUs7QUFDN0MsV0FBTyxLQUFLLFlBQVksRUFBRSxRQUFRLFNBQVUsYUFBYTtBQUNyRCxVQUFJLFlBQVksWUFBWSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3hDLFVBQUksY0FBYyxXQUFXO0FBQ3pCLHFCQUFhLFdBQVcsRUFBRSxRQUFRLFNBQVUsVUFBVTtBQUNsRCxtQkFBUztBQUFBO0FBQUEsWUFFVDtBQUFBO0FBQUEsWUFFQSxhQUFhLElBQUksUUFBUSxPQUFPLEVBQUU7QUFBQTtBQUFBLFlBRWxDO0FBQUE7QUFBQSxZQUVBLGFBQWEsTUFBTTtBQUFBO0FBQUEsWUFFbkIsT0FBTztBQUFBO0FBQUEsWUFFUCxnQkFBZ0IsTUFBTTtBQUFBO0FBQUEsWUFFdEI7QUFBQSxVQUFVO0FBQUEsUUFDZCxDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLG9CQUFvQixXQUFXLGNBQWMsSUFBSSxjQUFjLGFBQWEsVUFBVSxhQUFhO0FBQ3hHLFFBQUk7QUFHSixRQUFJLGNBQWMsU0FBUyxLQUFLLENBQUMsUUFBUSxPQUFPLGVBQWU7QUFDM0QsVUFBSSxnQkFBZ0IsZUFBZSxHQUFHO0FBQ2xDLG1CQUFXLGVBQWUsb0JBQW9CLFVBQVUsZUFBZSxDQUFDLEdBQUcsUUFBUSxRQUFRLEtBQUs7QUFDaEcsYUFBSyxLQUFLLElBQUksSUFBSSxRQUFRO0FBQUEsTUFDOUI7QUFDQSxVQUFJLGVBQWUsZUFBZSxjQUFjLFNBQVMsR0FBRztBQUN4RCxtQkFBVyxlQUFlLG9CQUFvQixVQUFVLGVBQWUsQ0FBQyxHQUFHLFFBQVEsUUFBUSxJQUFJO0FBQy9GLGFBQUssS0FBSyxJQUFJLElBQUksUUFBUTtBQUFBLE1BQzlCO0FBQUEsSUFDSjtBQUlBLFFBQUksY0FBYyxTQUFTLEtBQUssUUFBUSxPQUFPO0FBQzNDLFVBQUksZ0JBQWdCLGVBQWUsR0FBRztBQUNsQyxtQkFBVyxlQUFlLG9CQUFvQixVQUFVLGVBQWUsQ0FBQyxHQUFHLFFBQVEsT0FBTyxLQUFLO0FBQy9GLGFBQUssS0FBSyxJQUFJLElBQUksUUFBUTtBQUFBLE1BQzlCO0FBQ0EsVUFBSSxlQUFlLGVBQWUsY0FBYyxTQUFTLEdBQUc7QUFDeEQsbUJBQVcsZUFBZSxvQkFBb0IsVUFBVSxlQUFlLENBQUMsR0FBRyxRQUFRLE9BQU8sSUFBSTtBQUM5RixhQUFLLEtBQUssSUFBSSxJQUFJLFFBQVE7QUFBQSxNQUM5QjtBQUFBLElBQ0o7QUFHQSxRQUFJLFFBQVEsU0FBUztBQUNqQixVQUFJLGlCQUFpQixHQUFHO0FBQ3BCLG1CQUFXLGVBQWUsb0JBQW9CLEdBQUcsUUFBUSxRQUFRLENBQUMsR0FBRyxLQUFLO0FBQzFFLGFBQUssS0FBSyxJQUFJLElBQUksUUFBUTtBQUFBLE1BQzlCO0FBQ0EsVUFBSSxpQkFBaUIsY0FBYyxTQUFTLEdBQUc7QUFDM0MsbUJBQVcsZUFBZSxvQkFBb0IsS0FBSyxRQUFRLFFBQVEsQ0FBQyxHQUFHLElBQUk7QUFDM0UsYUFBSyxLQUFLLElBQUksSUFBSSxRQUFRO0FBQUEsTUFDOUI7QUFBQSxJQUNKO0FBQ0EsUUFBSSxDQUFDLGFBQWE7QUFDZCxXQUFLLGVBQWUsUUFBUSxFQUFFO0FBQUEsSUFDbEM7QUFFQSxTQUFLLE1BQU0sRUFBRTtBQUViLFFBQUksT0FBTyxVQUFVLFlBQVksS0FBSyxDQUFDLFVBQVU7QUFDN0MsYUFBTztBQUFBLElBQ1g7QUFDQSxXQUFPO0FBQUEsRUFDWDtBQUVBLFdBQVMsWUFBWSxHQUFHLEdBQUc7QUFDdkIsUUFBSSxJQUFJLFFBQVE7QUFDaEIsWUFBUSxJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSTtBQUFBLEVBQ3pDO0FBR0EsV0FBUyxZQUFZLFFBQVEsVUFBVSxXQUFXLGVBQWUsU0FBUztBQUN0RSxRQUFJLFlBQVksVUFBVSxNQUFNO0FBRWhDLFFBQUksY0FBYyxjQUFjLENBQUM7QUFDakMsUUFBSSxjQUFjLFFBQVEsT0FBTztBQUNqQyxRQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsTUFBTTtBQUN4QixRQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtBQUV4QixvQkFBZ0IsY0FBYyxNQUFNO0FBR3BDLFFBQUksUUFBUTtBQUNSLG9CQUFjLFFBQVE7QUFBQSxJQUMxQjtBQUVBLFFBQUksY0FBYyxTQUFTLEdBQUc7QUFDMUIsb0JBQWMsUUFBUSxTQUFVLGNBQWMsR0FBRztBQUM3QyxZQUFJLEtBQUssb0JBQW9CLFdBQVcsY0FBYyxVQUFVLFlBQVksSUFBSSxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLE9BQU8sV0FBVztBQUV4SCxZQUFJLE9BQU8sT0FBTztBQUNkLHFCQUFXO0FBQUEsUUFDZixPQUNLO0FBQ0QscUJBQVcsS0FBSyxVQUFVLFlBQVk7QUFDdEMsb0JBQVUsWUFBWSxJQUFJO0FBQUEsUUFDOUI7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMLE9BRUs7QUFDRCxVQUFJLElBQUksQ0FBQyxJQUFJO0FBQUEsSUFDakI7QUFDQSxRQUFJLFFBQVE7QUFFWixrQkFBYyxRQUFRLFNBQVUsY0FBYyxHQUFHO0FBQzdDLGNBQ0ksVUFBVSxjQUFjLFVBQVUsWUFBWSxJQUFJLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsT0FBTyxXQUFXLEtBQUs7QUFBQSxJQUN2RyxDQUFDO0FBRUQsUUFBSSxPQUFPO0FBQ1Asb0JBQWMsUUFBUSxTQUFVLGNBQWM7QUFDMUMsa0JBQVUsVUFBVSxZQUFZO0FBQ2hDLGtCQUFVLFNBQVMsWUFBWTtBQUFBLE1BQ25DLENBQUM7QUFFRCxVQUFJLFdBQVcsUUFBVztBQUN0QixrQkFBVSxRQUFRLFdBQVc7QUFBQSxNQUNqQztBQUFBLElBQ0o7QUFBQSxFQUNKO0FBS0EsV0FBUyxtQkFBbUIsR0FBRyxHQUFHO0FBQzlCLFdBQU8sUUFBUSxNQUFNLE1BQU0sSUFBSSxJQUFJO0FBQUEsRUFDdkM7QUFFQSxXQUFTLHFCQUFxQixjQUFjLElBQUk7QUFFNUMsb0JBQWdCLFlBQVksSUFBSTtBQUVoQyxpQkFBYSxZQUFZLElBQUksZUFBZSxhQUFhLEVBQUU7QUFDM0QsUUFBSSxjQUFjLG1CQUFtQixJQUFJLENBQUMsSUFBSTtBQUM5QyxRQUFJLGdCQUFnQixlQUFlLFlBQVksY0FBYyxLQUFLLEdBQUcsSUFBSTtBQUN6RSxrQkFBYyxZQUFZLEVBQUUsTUFBTSxRQUFRLGFBQWEsSUFBSTtBQUUzRCxRQUFJLFFBQVEsT0FBTyxrQkFBa0IsZ0JBQWdCLFNBQVMsR0FBRztBQUU3RCxVQUFJLG9CQUFvQixnQkFBZ0IsTUFBTSxTQUFVLFVBQVUsT0FBTyxXQUFXO0FBQ2hGLGVBQU8sVUFBVSxLQUFLLFlBQVksVUFBVSxRQUFRLENBQUM7QUFBQSxNQUN6RCxDQUFDO0FBQ0QsVUFBSSwyQkFBMkIsQ0FBQyxtQkFBbUI7QUFFL0MsdUJBQWU7QUFFZjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQ0Esa0JBQWMsWUFBWTtBQUMxQixrQkFBYyxlQUFlLENBQUM7QUFDOUIsUUFBSSx3QkFBd0I7QUFFeEIsb0JBQWMsZUFBZSxDQUFDO0FBQzlCLG9CQUFjLGVBQWUsQ0FBQztBQUFBLElBQ2xDO0FBQUEsRUFDSjtBQUlBLFdBQVMsWUFBWTtBQUNqQix3QkFBb0IsUUFBUSxTQUFVLGNBQWM7QUFDaEQsVUFBSSxNQUFNLGdCQUFnQixZQUFZLElBQUksS0FBSyxLQUFLO0FBQ3BELFVBQUksU0FBUyxLQUFLLGNBQWMsU0FBUyxNQUFNO0FBQy9DLG9CQUFjLFlBQVksRUFBRSxNQUFNLFNBQVMsT0FBTyxNQUFNO0FBQUEsSUFDNUQsQ0FBQztBQUFBLEVBQ0w7QUFHQSxXQUFTLFVBQVUsY0FBYyxJQUFJLGNBQWMsYUFBYSxZQUFZLGFBQWE7QUFDckYsUUFBSSxDQUFDLFlBQVk7QUFDYixXQUFLLG9CQUFvQixpQkFBaUIsY0FBYyxJQUFJLGNBQWMsYUFBYSxPQUFPLFdBQVc7QUFBQSxJQUM3RztBQUNBLFFBQUksT0FBTyxPQUFPO0FBQ2QsYUFBTztBQUFBLElBQ1g7QUFDQSx5QkFBcUIsY0FBYyxFQUFFO0FBQ3JDLFdBQU87QUFBQSxFQUNYO0FBRUEsV0FBUyxjQUFjLE9BQU87QUFFMUIsUUFBSSxDQUFDLGVBQWUsS0FBSyxHQUFHO0FBQ3hCO0FBQUEsSUFDSjtBQUVBLFFBQUksWUFBWSxnQkFBZ0IsTUFBTTtBQUN0QyxRQUFJLHdCQUF3QjtBQUN4QixnQkFBVSxLQUFLLFNBQVUsR0FBRyxHQUFHO0FBQzNCLGVBQU8sSUFBSTtBQUFBLE1BQ2YsQ0FBQztBQUFBLElBQ0w7QUFDQSxRQUFJLElBQUk7QUFDUixRQUFJLElBQUk7QUFDUixRQUFJLFVBQVUsR0FBRztBQUNiLFVBQUksVUFBVSxRQUFRLENBQUM7QUFBQSxJQUMzQjtBQUNBLFFBQUksVUFBVSxlQUFlLFNBQVMsR0FBRztBQUNyQyxVQUFJLFVBQVUsS0FBSztBQUFBLElBQ3ZCO0FBS0EsUUFBSSxlQUFlLElBQUk7QUFDdkIsUUFBSSxnQkFBZ0IsZUFBZSxZQUFZLG1CQUFtQixHQUFHLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSTtBQUNqRyxRQUFJLFlBQVksV0FBVyxZQUFZLGVBQWUsS0FBSyxHQUFHLElBQUk7QUFDbEUsbUJBQWUsS0FBSyxFQUFFLE1BQU0sUUFBUSxhQUFhLElBQzdDLGdCQUFnQixNQUFNO0FBQUEsRUFDOUI7QUFFQSxXQUFTLGVBQWUsSUFBSSxjQUFjO0FBR3RDLFFBQUksT0FBTyxRQUFRLE9BQU8sU0FBUyxPQUFPLFFBQVc7QUFDakQsYUFBTyxnQkFBZ0IsWUFBWTtBQUFBLElBQ3ZDO0FBRUEsUUFBSSxPQUFPLE9BQU8sVUFBVTtBQUN4QixXQUFLLE9BQU8sRUFBRTtBQUFBLElBQ2xCO0FBQ0EsU0FBSyxRQUFRLE9BQU8sS0FBSyxFQUFFO0FBQzNCLFFBQUksT0FBTyxPQUFPO0FBQ2QsV0FBSyxlQUFlLFdBQVcsRUFBRTtBQUFBLElBQ3JDO0FBRUEsUUFBSSxPQUFPLFNBQVMsTUFBTSxFQUFFLEdBQUc7QUFDM0IsYUFBTyxnQkFBZ0IsWUFBWTtBQUFBLElBQ3ZDO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFFQSxXQUFTLFNBQVMsT0FBTyxjQUFjLFlBQVk7QUFDL0MsUUFBSSxTQUFTLFFBQVEsS0FBSztBQUMxQixRQUFJLFNBQVMsZ0JBQWdCLENBQUMsTUFBTTtBQUVwQyxtQkFBZSxpQkFBaUIsU0FBWSxPQUFPO0FBR25ELFFBQUksUUFBUSxXQUFXLENBQUMsUUFBUTtBQUM1QixrQkFBWSxjQUFjLFFBQVEsV0FBVyxLQUFLLFFBQVEsaUJBQWlCO0FBQUEsSUFDL0U7QUFFQSx3QkFBb0IsUUFBUSxTQUFVLGNBQWM7QUFDaEQsZ0JBQVUsY0FBYyxlQUFlLE9BQU8sWUFBWSxHQUFHLFlBQVksR0FBRyxNQUFNLE9BQU8sVUFBVTtBQUFBLElBQ3ZHLENBQUM7QUFDRCxRQUFJLElBQUksb0JBQW9CLFdBQVcsSUFBSSxJQUFJO0FBRS9DLFFBQUksVUFBVSxlQUFlLFVBQVUsR0FBRztBQUN0QyxtQkFBYTtBQUNiLHNCQUFnQixDQUFDLElBQUk7QUFDckIsVUFBSSxvQkFBb0IsU0FBUyxHQUFHO0FBQ2hDLFlBQUksVUFBVSxPQUFPLG9CQUFvQixTQUFTO0FBQ2xELDRCQUFvQixRQUFRLFNBQVUsY0FBYztBQUNoRCwwQkFBZ0IsWUFBWSxJQUFJLGVBQWU7QUFBQSxRQUNuRCxDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0o7QUFHQSxXQUFPLElBQUksb0JBQW9CLFFBQVEsRUFBRSxHQUFHO0FBQ3hDLDBCQUFvQixRQUFRLFNBQVUsY0FBYztBQUNoRCxrQkFBVSxjQUFjLGdCQUFnQixZQUFZLEdBQUcsTUFBTSxNQUFNLFVBQVU7QUFBQSxNQUNqRixDQUFDO0FBQUEsSUFDTDtBQUNBLGNBQVU7QUFDVix3QkFBb0IsUUFBUSxTQUFVLGNBQWM7QUFDaEQsZ0JBQVUsVUFBVSxZQUFZO0FBRWhDLFVBQUksT0FBTyxZQUFZLE1BQU0sUUFBUSxjQUFjO0FBQy9DLGtCQUFVLE9BQU8sWUFBWTtBQUFBLE1BQ2pDO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTDtBQUVBLFdBQVMsV0FBVyxjQUFjO0FBQzlCLGFBQVMsUUFBUSxPQUFPLFlBQVk7QUFBQSxFQUN4QztBQUVBLFdBQVMsZUFBZSxjQUFjLE9BQU8sY0FBYyxZQUFZO0FBRW5FLG1CQUFlLE9BQU8sWUFBWTtBQUNsQyxRQUFJLEVBQUUsZ0JBQWdCLEtBQUssZUFBZSxvQkFBb0IsU0FBUztBQUNuRSxZQUFNLElBQUksTUFBTSw2Q0FBNkMsWUFBWTtBQUFBLElBQzdFO0FBR0EsY0FBVSxjQUFjLGVBQWUsT0FBTyxZQUFZLEdBQUcsTUFBTSxNQUFNLFVBQVU7QUFDbkYsY0FBVSxVQUFVLFlBQVk7QUFDaEMsUUFBSSxjQUFjO0FBQ2QsZ0JBQVUsT0FBTyxZQUFZO0FBQUEsSUFDakM7QUFBQSxFQUNKO0FBRUEsV0FBUyxTQUFTLFdBQVc7QUFDekIsUUFBSSxjQUFjLFFBQVE7QUFBRSxrQkFBWTtBQUFBLElBQU87QUFDL0MsUUFBSSxXQUFXO0FBRVgsYUFBTyxhQUFhLFdBQVcsSUFBSSxhQUFhLENBQUMsSUFBSSxhQUFhLE1BQU0sQ0FBQztBQUFBLElBQzdFO0FBQ0EsUUFBSSxTQUFTLGFBQWEsSUFBSSxRQUFRLE9BQU8sRUFBRTtBQUUvQyxRQUFJLE9BQU8sV0FBVyxHQUFHO0FBQ3JCLGFBQU8sT0FBTyxDQUFDO0FBQUEsSUFDbkI7QUFDQSxXQUFPO0FBQUEsRUFDWDtBQUVBLFdBQVMsVUFBVTtBQUVmLGdCQUFZLGtCQUFrQixJQUFJO0FBQ2xDLGdCQUFZLGtCQUFrQixRQUFRO0FBQ3RDLFdBQU8sS0FBSyxRQUFRLFVBQVUsRUFBRSxRQUFRLFNBQVUsS0FBSztBQUNuRCxrQkFBWSxjQUFjLFFBQVEsV0FBVyxHQUFHLENBQUM7QUFBQSxJQUNyRCxDQUFDO0FBQ0QsV0FBTyxhQUFhLFlBQVk7QUFDNUIsbUJBQWEsWUFBWSxhQUFhLFVBQVU7QUFBQSxJQUNwRDtBQUNBLFdBQU8sYUFBYTtBQUFBLEVBQ3hCO0FBQ0EsV0FBUyxzQkFBc0IsY0FBYztBQUN6QyxRQUFJLFdBQVcsZ0JBQWdCLFlBQVk7QUFDM0MsUUFBSSxjQUFjLGVBQWUsZUFBZSxRQUFRO0FBQ3hELFFBQUksUUFBUSxhQUFhLFlBQVk7QUFDckMsUUFBSSxZQUFZLFlBQVksU0FBUztBQUNyQyxRQUFJLFlBQVk7QUFFaEIsUUFBSSxRQUFRLE1BQU07QUFDZCxhQUFPO0FBQUEsUUFDSCxRQUFRLFlBQVksV0FBVyxjQUFjO0FBQUEsUUFDN0MsWUFBWSxVQUFVLGFBQWEsU0FBUztBQUFBLE1BQ2hEO0FBQUEsSUFDSjtBQUdBLFFBQUksY0FBYyxPQUFPO0FBQ3JCLFVBQUksUUFBUSxZQUFZLFlBQVksVUFBVSxZQUFZO0FBQ3RELG9CQUFZLFlBQVksVUFBVSxhQUFhO0FBQUEsTUFDbkQ7QUFBQSxJQUNKO0FBRUEsUUFBSSxRQUFRLFlBQVksU0FBUyxZQUFZO0FBQ3pDLGtCQUFZLFlBQVksU0FBUztBQUFBLElBQ3JDLFdBQ1MsWUFBWSxXQUFXLFNBQVMsT0FBTztBQUM1QyxrQkFBWTtBQUFBLElBQ2hCLE9BRUs7QUFDRCxrQkFBWSxRQUFRLFlBQVksV0FBVztBQUFBLElBQy9DO0FBRUEsUUFBSSxhQUFhLEtBQUs7QUFDbEIsa0JBQVk7QUFBQSxJQUNoQixXQUNTLGFBQWEsR0FBRztBQUNyQixrQkFBWTtBQUFBLElBQ2hCO0FBRUEsUUFBSSxlQUFlLGVBQWUsa0JBQWtCO0FBRXBELFFBQUksY0FBYyxRQUFRLGNBQWMsT0FBTztBQUMzQyxrQkFBWSxPQUFPLFVBQVUsUUFBUSxZQUFZLENBQUM7QUFBQSxJQUN0RDtBQUNBLFFBQUksY0FBYyxRQUFRLGNBQWMsT0FBTztBQUMzQyxrQkFBWSxPQUFPLFVBQVUsUUFBUSxZQUFZLENBQUM7QUFBQSxJQUN0RDtBQUNBLFdBQU8sQ0FBQyxXQUFXLFNBQVM7QUFBQSxFQUNoQztBQUVBLFdBQVMsZUFBZTtBQUNwQixXQUFPLG9CQUFvQixJQUFJLHFCQUFxQjtBQUFBLEVBQ3hEO0FBRUEsV0FBUyxjQUFjLGlCQUFpQixjQUFjO0FBSWxELFFBQUksSUFBSSxTQUFTO0FBQ2pCLFFBQUksYUFBYTtBQUFBLE1BQ2I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDSjtBQUVBLGVBQVcsUUFBUSxTQUFVLE1BQU07QUFFL0IsVUFBSSxnQkFBZ0IsSUFBSSxNQUFNLFFBQVc7QUFDckMsd0JBQWdCLElBQUksSUFBSSxnQkFBZ0IsSUFBSTtBQUFBLE1BQ2hEO0FBQUEsSUFDSixDQUFDO0FBQ0QsUUFBSSxhQUFhLFlBQVksZUFBZTtBQUU1QyxlQUFXLFFBQVEsU0FBVSxNQUFNO0FBQy9CLFVBQUksZ0JBQWdCLElBQUksTUFBTSxRQUFXO0FBQ3JDLGdCQUFRLElBQUksSUFBSSxXQUFXLElBQUk7QUFBQSxNQUNuQztBQUFBLElBQ0osQ0FBQztBQUNELHFCQUFpQixXQUFXO0FBRTVCLFlBQVEsU0FBUyxXQUFXO0FBQzVCLFlBQVEsUUFBUSxXQUFXO0FBQzNCLFlBQVEsVUFBVSxXQUFXO0FBRTdCLFFBQUksUUFBUSxNQUFNO0FBQ2QsV0FBSyxRQUFRLElBQUk7QUFBQSxJQUNyQixPQUNLO0FBQ0QsaUJBQVc7QUFBQSxJQUNmO0FBRUEsUUFBSSxRQUFRLFVBQVU7QUFDbEIsZUFBUztBQUFBLElBQ2IsT0FDSztBQUNELHFCQUFlO0FBQUEsSUFDbkI7QUFFQSxzQkFBa0IsQ0FBQztBQUNuQixhQUFTLE1BQU0sZ0JBQWdCLEtBQUssSUFBSSxnQkFBZ0IsUUFBUSxHQUFHLFlBQVk7QUFFL0UsUUFBSSxnQkFBZ0IsU0FBUztBQUN6QiwwQkFBb0I7QUFBQSxJQUN4QjtBQUFBLEVBQ0o7QUFDQSxXQUFTLHNCQUFzQjtBQUUzQixXQUFPLGtCQUFrQixZQUFZO0FBQ2pDLHdCQUFrQixZQUFZLGtCQUFrQixVQUFVO0FBQUEsSUFDOUQ7QUFFQSxhQUFTLElBQUksR0FBRyxLQUFLLFFBQVEsU0FBUyxLQUFLO0FBQ3ZDLHFCQUFlLENBQUMsSUFBSSxXQUFXLG1CQUFtQixRQUFRLFFBQVEsQ0FBQyxDQUFDO0FBQ3BFLG9CQUFjLENBQUM7QUFBQSxJQUNuQjtBQUdBLHFCQUFpQixFQUFFLE1BQU0sUUFBUSxPQUFPLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFBQSxFQUMvRDtBQUVBLFdBQVMsaUJBQWlCO0FBQ3RCLDZCQUF5QixDQUFDO0FBQzFCO0FBQUEsTUFBWTtBQUFBO0FBQUEsTUFFWixRQUFRLFFBQVEsSUFBSSxTQUFVLEdBQUc7QUFBRSxlQUFPLENBQUM7QUFBQSxNQUFHLENBQUM7QUFBQSxJQUFDO0FBQ2hELHdCQUFvQjtBQUFBLEVBQ3hCO0FBRUEsV0FBUyxjQUFjO0FBR25CLGlCQUFhLFVBQVUsWUFBWTtBQUNuQyxnQkFBWSxRQUFRLFNBQVMsVUFBVTtBQUV2QyxxQkFBaUIsUUFBUSxNQUFNO0FBRS9CLGFBQVMsUUFBUSxLQUFLO0FBQ3RCLFFBQUksUUFBUSxNQUFNO0FBQ2QsV0FBSyxRQUFRLElBQUk7QUFBQSxJQUNyQjtBQUNBLFFBQUksUUFBUSxVQUFVO0FBQ2xCLGVBQVM7QUFBQSxJQUNiO0FBQ0EsU0FBSztBQUFBLEVBQ1Q7QUFDQSxjQUFZO0FBQ1osTUFBSSxhQUFhO0FBQUEsSUFDYjtBQUFBLElBQ0EsT0FBTztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsT0FBTztBQUFBLElBQ1A7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUVBLGVBQWUsU0FBVSxRQUFRLFVBQVUsZUFBZTtBQUN0RCxrQkFBWSxRQUFRLFVBQVUsaUJBQWlCLGFBQWE7QUFBQSxJQUNoRTtBQUFBLElBQ0EsU0FBUztBQUFBLElBQ1Q7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0EsY0FBYyxXQUFZO0FBQ3RCLGFBQU8sZ0JBQWdCLE1BQU07QUFBQSxJQUNqQztBQUFBLElBQ0EsYUFBYSxXQUFZO0FBQ3JCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFDQSxZQUFZLFdBQVk7QUFDcEIsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNKO0FBQ0EsU0FBTztBQUNYO0FBRUEsU0FBUyxXQUFXLFFBQVEsaUJBQWlCO0FBQ3pDLE1BQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxVQUFVO0FBQzdCLFVBQU0sSUFBSSxNQUFNLHdEQUF3RCxNQUFNO0FBQUEsRUFDbEY7QUFFQSxNQUFJLE9BQU8sWUFBWTtBQUNuQixVQUFNLElBQUksTUFBTSw2Q0FBNkM7QUFBQSxFQUNqRTtBQUVBLE1BQUksVUFBVSxZQUFZLGVBQWU7QUFDekMsTUFBSSxNQUFNLE1BQU0sUUFBUSxTQUFTLGVBQWU7QUFDaEQsU0FBTyxhQUFhO0FBQ3BCLFNBQU87QUFDWDtBQUdBLElBQU8scUJBQVE7QUFBQTtBQUFBLEVBRVgsWUFBWTtBQUFBO0FBQUE7QUFBQSxFQUdaO0FBQUEsRUFDQSxRQUFRO0FBQ1o7OztBQ3Z4RWUsU0FBUixPQUF3QjtBQUFBLEVBQzdCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBLFFBQVEsRUFBRSxLQUFLLEdBQUcsS0FBSyxHQUFHO0FBQUEsRUFDMUIsUUFBUSxDQUFDO0FBQUEsRUFDVDtBQUFBLEVBQ0E7QUFBQSxFQUNBLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFNBQVM7QUFBQSxFQUNULFdBQVcsTUFBTTtBQUFBLEVBQUM7QUFDcEIsR0FBRztBQUNELFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFFVixPQUFPO0FBQ0wsV0FBSyxZQUFZLFNBQVMsZUFBZSxLQUFLLE9BQU87QUFDckQsVUFBSSxDQUFDLEtBQUssVUFBVztBQUVyQixXQUFLLFVBQVUsVUFBVSxJQUFJLGNBQWM7QUFFM0MsWUFBTSxNQUFNLENBQUMsTUFDWCxPQUFPLFVBQVUsT0FBTyxPQUFPLE9BQU8sUUFBUSxhQUFhLE9BQU8sT0FBTyxJQUFJLENBQUMsSUFBSTtBQUVwRixXQUFLLFNBQVMsbUJBQVcsT0FBTyxLQUFLLFdBQVc7QUFBQSxRQUM5QyxPQUFPLElBQUksS0FBSyxLQUFLO0FBQUEsUUFDckIsU0FBUyxJQUFJLEtBQUssT0FBTztBQUFBLFFBQ3pCLE9BQU8sSUFBSSxLQUFLLEtBQUs7QUFBQSxRQUNyQixVQUFVLEtBQUs7QUFBQSxRQUNmLE1BQU0sSUFBSSxLQUFLLElBQUk7QUFBQSxRQUNuQixXQUFXLElBQUksS0FBSyxTQUFTO0FBQUEsUUFDN0IsTUFBTSxJQUFJLEtBQUssSUFBSTtBQUFBLFFBQ25CLFFBQVEsS0FBSztBQUFBLE1BQ2YsQ0FBQztBQUdELFdBQUssV0FBVyxDQUFDLFFBQVEsUUFBUSxXQUFXLEtBQUssY0FBYztBQUM3RCxjQUFNLFNBQVMsTUFBTSxRQUFRLEtBQUssS0FBSyxJQUFJLEtBQUssUUFBUSxDQUFDO0FBQ3pELGlCQUFTLEtBQUssTUFBTSxRQUFRLFFBQVEsV0FBVyxLQUFLLFdBQVcsTUFBTTtBQUFBLE1BQ3ZFO0FBRUEsV0FBSyxPQUFPLEdBQUcsVUFBVSxLQUFLLFFBQVE7QUFBQSxJQUN4QztBQUFBLElBRUEsVUFBVTtBQUNSLFVBQUksS0FBSyxRQUFRO0FBQ2YsWUFBSSxLQUFLLFVBQVU7QUFDakIsZUFBSyxPQUFPLElBQUksVUFBVSxLQUFLLFFBQVE7QUFBQSxRQUN6QztBQUNBLGFBQUssT0FBTyxRQUFRO0FBQ3BCLGFBQUssU0FBUztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFsiUGlwc01vZGUiLCAiUGlwc1R5cGUiLCAiU3BlY3RydW0iLCAiaW5kZXgiLCAicGlwcyIsICJvZmZzZXQiLCAidGFyZ2V0Il0KfQo=
