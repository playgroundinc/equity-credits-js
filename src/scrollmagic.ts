import { Section } from './shared/interface';
const ScrollMagic = require('scrollmagic');

export class MagicTime {
  controller: any;
  scene: any;

  init = (section: any) => {

    this.controller = new ScrollMagic.Controller();

    const top = section.getBoundingClientRect().top;
    // Check if section has images
    const pin = section.querySelector('.pin-me');

    if (pin) {

      const stopper = section.querySelector('li[data-layout]');
      const stopTop = stopper.getBoundingClientRect().top;

      const distance = stopTop - top - 262;

      this.scene = new ScrollMagic.Scene({
        triggerElement: section,
        duration: distance,
        triggerHook: 0.4,
        reverse: false,
      })
      .setPin(pin, {pushFollowers: false})
      .addTo(this.controller);
    }

  }
}