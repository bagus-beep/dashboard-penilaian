// ========================================
// ANIMATION - Animation Utilities
// ========================================

/**
 * Animate number count-up with easing
 */
export function animateCount(element, start, end, duration = 1000) {
  if (!element) return;
  
  const startTimestamp = performance.now();
  
  function step(timestamp) {
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    element.textContent = current.toLocaleString("id-ID");
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }
  
  window.requestAnimationFrame(step);
}

/**
 * Staggered animation for multiple elements
 */
export function staggerAnimate(elements, animateFn, staggerDelay = 150) {
  elements.forEach((el, index) => {
    setTimeout(() => animateFn(el), index * staggerDelay);
  });
}

/**
 * Fade in element
 */
export function fadeIn(selector, duration = 300) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  
  el.style.opacity = '0';
  el.style.display = '';
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    el.style.opacity = Math.min(progress / duration, 1);
    
    if (progress < duration) {
      window.requestAnimationFrame(animate);
    }
  }
  window.requestAnimationFrame(animate);
}

/**
 * Fade out element
 */
export function fadeOut(selector, duration = 300) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  
  const startOpacity = parseFloat(getComputedStyle(el).opacity) || 1;
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    el.style.opacity = Math.max(startOpacity * (1 - progress / duration), 0);
    
    if (progress < duration) {
      window.requestAnimationFrame(animate);
    } else {
      el.style.display = 'none';
    }
  }
  window.requestAnimationFrame(animate);
}

/**
 * Slide in from right
 */
export function slideInRight(selector, duration = 300) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  
  el.style.transform = 'translateX(100%)';
  el.style.opacity = '0';
  el.style.display = '';
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    const easeOut = 1 - Math.pow(1 - percent, 3);
    
    el.style.transform = `translateX(${100 - (100 * easeOut)}%)`;
    el.style.opacity = easeOut;
    
    if (progress < duration) {
      window.requestAnimationFrame(animate);
    }
  }
  window.requestAnimationFrame(animate);
}

/**
 * Slide out to right
 */
export function slideOutRight(selector, duration = 300) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    const easeOut = 1 - Math.pow(1 - percent, 3);
    
    el.style.transform = `translateX(${100 * easeOut}%)`;
    el.style.opacity = 1 - easeOut;
    
    if (progress < duration) {
      window.requestAnimationFrame(animate);
    } else {
      el.style.display = 'none';
    }
  }
  window.requestAnimationFrame(animate);
}

/**
 * Scale animation
 */
export function scaleIn(selector, duration = 300) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  
  el.style.transform = 'scale(0)';
  el.style.opacity = '0';
  el.style.display = '';
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    const easeOut = 1 - Math.pow(1 - percent, 3);
    
    el.style.transform = `scale(${easeOut})`;
    el.style.opacity = easeOut;
    
    if (progress < duration) {
      window.requestAnimationFrame(animate);
    }
  }
  window.requestAnimationFrame(animate);
}
