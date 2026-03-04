// ========================================
// DOM - Common DOM Utilities
// ========================================

/**
 * Get element by ID
 */
export const $ = (id) => document.getElementById(id);

/**
 * Query selector
 */
export const $$ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Query selector all
 */
export const $$$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/**
 * Toggle class
 */
export function toggleClass(selector, className, force) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.classList.toggle(className, force);
}

/**
 * Add class
 */
export function addClass(selector, className) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.classList.add(className);
}

/**
 * Remove class
 */
export function removeClass(selector, className) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.classList.remove(className);
}

/**
 * Show element
 */
export function show(selector) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.style.display = '';
}

/**
 * Hide element
 */
export function hide(selector) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.style.display = 'none';
}

/**
 * Check if element exists
 */
export function exists(selector) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  return !!el;
}

/**
 * Get value from select/input
 */
export function getValue(id) {
  const el = $(id);
  return el ? el.value : '';
}

/**
 * Set value to select/input
 */
export function setValue(id, value) {
  const el = $(id);
  if (el) el.value = value;
}

/**
 * Add event listener with auto-cleanup
 */
export function on(element, event, handler, options) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) el.addEventListener(event, handler, options);
}

/**
 * Debounced resize handler
 */
export function onResize(callback, delay = 250) {
  let timeout;
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  });
}

/**
 * Check if mobile view
 */
export function isMobile(breakpoint = 768) {
  return window.innerWidth < breakpoint;
}

/**
 * Insert HTML after begin
 */
export function prependHTML(selector, html) {
  const el = $(selector);
  if (el) el.insertAdjacentHTML('afterbegin', html);
}

/**
 * Insert HTML before end
 */
export function appendHTML(selector, html) {
  const el = $(selector);
  if (el) el.insertAdjacentHTML('beforeend', html);
}

/**
 * Set HTML
 */
export function html(selector, html) {
  const el = $(selector);
  if (el) el.innerHTML = html;
}

/**
 * Get data attribute
 */
export function data(selector, key) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  return el ? el.dataset[key] : null;
}

/**
 * Set data attribute
 */
export function setData(selector, key, value) {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.dataset[key] = value;
}
