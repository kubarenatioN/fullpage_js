let canMove = false;
let isReady = false;
let firstLoad = true;
let blockWheel = false;

document.addEventListener('wheel', controlWheel, { passive: false });


const fp = new fullpage("#main-page-fp", {
	autoScrolling: true,
	scrollHorizontally: true,
	anchors: ['one', 'two', 'three', 'four', 'footer'],
  sectionsColor: ['bisque', 'aquamarine', 'blueviolet', 'brown', '#333'],
  scrollingSpeed: 400,
  navigation: true,
  afterRender: () => {
    requestTimeout(() => {
      isReady = true;
    }, 200)
  },
  beforeLeave: (origin, destination) => {
    if (!isReady) {
      return true;
    }

    // console.log('canMove', canMove);
    
    if (!canMove) {
      fp.setMouseWheelScrolling(false);
      // fp.setAllowScrolling(false);
      blockWheel = true;

      requestTimeout(() => {
        const id = destination.anchor
        // console.log('moveTo', id);

        canMove = true;
        fp.silentMoveTo(id);
      }, 600);

      return false;
    }

    return true;
  },
  afterLoad: () => {
    if (!isReady) {
      return true;
    }

    if (firstLoad) {
      firstLoad = false;
      return true;
    }

    // console.log('afterLoad');

    canMove = false;
    requestTimeout(() => {
      blockWheel = false;
      // fp.setAllowScrolling(true);
      fp.setMouseWheelScrolling(true);
      console.log('ALLOW');
    }, 800)
  }
})

console.log(fp)

// setTimeout(() => {
//   fp.moveTo('two');
// }, 500);

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


// document.addEventListener('wheel', controlWheel, { passive: false })

function controlWheel(e) {
  if (blockWheel) {
    // console.log('block');
    
    e.preventDefault();
    e.stopImmediatePropagation();
  
    return false;
  };
}