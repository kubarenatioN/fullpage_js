let isScrolling = false;

const ACTIVE_SLIDE = 'pr-fp-active';
const Z_INDEX_ABOVE = 2;
const Z_INDEX_BELOW = 1;

function initContainer(fp) {
  console.log(fp);
  const container = document.querySelectorAll('.fp-section');

  container.forEach((el, i) => {
    el.classList.add('pr-fp-hidden')
    if (i === 0) {
      el.classList.add(ACTIVE_SLIDE)
    }
  })  
}

const fp = new fullpage("#main-page-fp", {
	autoScrolling: true,
	scrollHorizontally: true,
	anchors: ['one', 'two', 'three', 'four', 'footer'],
  sectionsColor: ['bisque', 'aquamarine', 'blueviolet', 'brown', '#dedede'],
  scrollingSpeed: 400,
  navigation: true,
  afterRender: () => {
    requestTimeout(() => {
      isReady = true;
    }, 200)
  },
  onLeave: (origin, dest, dir) => {
    if (isScrolling) {
      return false;
    }

    isScrolling = true;

    slideLeave(origin, dest, dir);

    const id = dest.anchor;

    fp.moveTo(id);
  }
})

initContainer(fp);

function slideLeave(origin, dest, dir) {
  const currentSlide = origin.item;
  const nextSlide = dest.item;

  let animIn = '';
  let animOut = '';

  if (dir === 'up') {
    animIn = 'moveFromTop';
  } else {
    animIn = 'moveFromBottom';
  }
  animOut = animIn + 'Out'


  nextSlide.classList.add('pr-animating-in', ACTIVE_SLIDE);
  nextSlide.style.animationName = animIn;
  nextSlide.style.zIndex = Z_INDEX_ABOVE;

  nextSlide.onanimationend = (event) => {
    const { animationName } = event

    if (animationName === animIn) {
      currentSlide.classList.remove(ACTIVE_SLIDE);

      // reset animations for both items after next slide animation complete
      currentSlide.style.animationName = '';
      nextSlide.style.animationName = '';

      onAnimationPhaseEnd();
    }
  };

  currentSlide.classList.add('pr-animating-out');
  currentSlide.style.animationName = animOut;
  nextSlide.style.zIndex = Z_INDEX_BELOW;

  currentSlide.onanimationend = () => {
    // ...
  };
}

function onAnimationPhaseEnd() {
  requestTimeout(() => {
    isScrolling = false;
  }, 100);
}

function requestTimeout(fn, delay) {
  const start = new Date().getTime();
  let rafId = null;

  const cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const loop = () => {
    const delta = new Date().getTime() - start;

    if (delta >= delay) {
      fn();
      cancel(); // Automatically cancel after the function is executed
      return;
    }

    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);

  return cancel;
};
