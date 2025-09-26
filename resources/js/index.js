import noUiSlider from 'nouislider';

export default function slider({
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
  onChange = () => {},
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

      this.component.classList.add('range-slider');

      const raw = (v) =>
        window.Alpine && typeof window.Alpine.raw === 'function' ? window.Alpine.raw(v) : v;

      this.slider = noUiSlider.create(this.component, {
        start: raw(this.start),
        connect: raw(this.connect),
        range: raw(this.range),
        tooltips: this.tooltips,
        step: raw(this.step),
        behaviour: raw(this.behaviour),
        snap: raw(this.snap),
        format: this.format,
      });

      // Bind Alpine component context so `this.state` works inside the provided onChange
      this._handler = (values, handle, unencoded, tap, positions) => {
        const states = Array.isArray(this.state) ? this.state : [];
        onChange.call(this, values, handle, unencoded, tap, positions, states);
      };

      this.slider.on('change', this._handler);
    },

    destroy() {
      if (this.slider) {
        if (this._handler) {
          this.slider.off('change', this._handler);
        }
        this.slider.destroy();
        this.slider = null;
      }
    },
  };
}
