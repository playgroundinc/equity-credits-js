import debounce from 'lodash.debounce';
import ScrollMagic from 'scrollmagic';

import { Window } from './window';

export class MagicTime extends Window {
  CONTROLLER: any;

  SCENES: any[];

  SECTIONS: Element[];

  constructor() {
    super();
    this.SECTIONS = [];
    this.SCENES = [];
  }

  init = (sections: Element[]) => {
    this.CONTROLLER = new ScrollMagic.Controller();
    this.SECTIONS = sections;

    this.setImageWidths();
    this.scrollSections();
    this.windowResizeListener();
  }

  /**
  * Tracks width of columns and updates width attribute of image.
  * */
  private setImageWidths(): void {
    const images = document.querySelectorAll('.pin-me img');
    let width = 0;
    if ((this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm')) {
      width = (document.querySelector('li[data-media-section]')?.clientWidth || 0) - 100;
    }
    images.forEach((elem) => {
      if (elem instanceof HTMLElement) {
        const element = elem;
        element.style.width = width > 0 ? `${width}px` : '';
      } else {
        throw new Error('element #test not in document');
      }
    });
  }

  /**
  * Returns aspect ratio of an element
  * @param pin    element to get dimensions of
  * @returns number
  * */
  private getAspect(pin: Element): number {
    const breakpoint = this.breakpoint.name;
    const height = Number(pin?.getAttribute(`data-${breakpoint}-height`));
    const width = Number(pin?.getAttribute(`data-${breakpoint}-width`));
    let aspect = 1.6;
    if (height && width) {
      aspect = width / height;
    }

    return aspect;
  }

  /**
  * Initializes ScrollMagic for all sections provided to the class
  * */
  private scrollSections = (): void => {
    if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
      this.SECTIONS.forEach((section) => {
        // this.SECTION.forEach((section, index) => {
        const wrapper = section.querySelector('[data-section-wrap]')!;

        if (wrapper) {
          const { top } = wrapper.getBoundingClientRect();
          // Check if wrapper has images
          const pin = wrapper.querySelector('.pin-me')!;
          const stopper = wrapper.querySelector('li[data-layout]')!;

          const aspect = this.getAspect(pin);
          const image = section.querySelector('img');
          let imageHeight = 0;

          if (image) {
            imageHeight = Number(image.style.width.replace('px', '')) / aspect;
          }

          if (pin && stopper) {
            const stopTop = stopper.getBoundingClientRect().top;

            const distance = stopTop - top - imageHeight;


            if (distance > 0) {
              const scene = new ScrollMagic.Scene({
                triggerElement: section,
                duration: distance,
                triggerHook: 0.3,
                reverse: false,
              })
                .setPin(pin, { pushFollowers: false })
                .addTo(this.CONTROLLER);
              this.SCENES.push(scene);
            }
          } else if (pin) {
            const { height } = section.getBoundingClientRect();


            const distance = height - imageHeight;

            if (distance > 50) {
              const scene = new ScrollMagic.Scene({
                triggerElement: section,
                duration: distance,
                triggerHook: 0.2,
                reverse: false,
              })
                .setPin(pin, { pushFollowers: false })
                .addTo(this.CONTROLLER);
              this.SCENES.push(scene);
            }
          }
        }
      });
    }
  }

  /**
  * Iterates through this.SCENES and resets scrollMagic scenes for each.
  * */
  private resetScenes = (shouldRefreshPositioning = false): void => {
    this.SCENES.forEach((scene) => {
      scene.removePin(true);
      if (shouldRefreshPositioning) {
        scene.refresh();
      }
    });
  }

  /**
  * Adds a window resize listener to the window to update image sizes
  * and reset scrollmagic settings
  * */
  private windowResizeListener = (): void => {
    window.addEventListener('resize', debounce(() => {
      this.setImageWidths();

      if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
        this.resetScenes(true);
        this.scrollSections();
      } else {
        this.resetScenes();
      }
    }, 500));
  }
}
