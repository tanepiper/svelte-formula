import { FormEl } from '../../types';

/**
 * Go up from the current element to the parent to find the group container, but never go further than the current
 * group or form
 * @param el
 */
function getRadioGroupParent(el?: HTMLElement) {
  if (!el) {
    return undefined;
  }
  const isContainer = Array.from(el.querySelectorAll(':scope input[type=radio]')).length > 1;
  if (!isContainer) {
    if (!el.parentElement) {
      return undefined;
    }
    if (el.parentElement.dataset?.beakerGroup || el.parentElement.dataset?.formulaForm) {
      return undefined;
    }
    return getRadioGroupParent(el?.parentElement);
  }
  return el;
}

/**
 * Sets the ARIA role based on the input type
 * @param el
 * @param elements
 */
export function setAriaRole(el: FormEl, elements: FormEl[]) {
  if (el.hasAttribute('aria-role')) {
    return;
  }
  if (el.type === 'radio') {
    if (elements.length < 2) {
      el.parentElement.setAttribute('aria-role', 'radiogroup');
    } else {
      const radioGroup = getRadioGroupParent(el.parentElement);
      if (radioGroup) radioGroup.setAttribute('aria-role', 'radiogroup');
    }
    el.setAttribute('aria-role', 'radio');
  } else {
    el.setAttribute(
      'aria-role',
      (() => {
        switch (el.type) {
          case 'select-one':
          case 'select-multiple':
          case 'checkbox': {
            return el.type;
          }
          case 'file': {
            return 'file-upload';
          }
          case 'textarea': {
            return 'textbox';
          }
          default:
            return `input-${el.type}`;
        }
      })(),
    );
  }
}

/**
 * Sets ARIA states based on attributes on the form
 * @param el
 */
export function setAriaStates(el: FormEl) {
  if (el.hasAttribute('required')) {
    el.setAttribute('aria-required', 'required');
  }
}

/**
 * Sets ARIA attributes based on the current value
 * @param element
 * @param elGroup
 */
export function setAriaValue(element: FormEl, elGroup: FormEl[]): void {
  if (element.type === 'radio') {
    for (const el of elGroup) {
      el.removeAttribute('aria-checked');
    }
  }
  if ((element as HTMLInputElement).checked) {
    element.setAttribute('aria-checked', 'checked');
  } else {
    element.removeAttribute('aria-checked');
  }
}

/**
 * Set the container
 * @param container
 * @param isGroup
 */
export function setAriaContainer(container: HTMLElement, isGroup: boolean) {
  if (!container.hasAttribute('aria-role')) {
    container.setAttribute('aria-role', isGroup ? 'row' : 'form');
  }
}

/**
 * Add the ARIA button role to all buttons contained in the form that don't already have an ARIA role
 * @param container
 */
export function setAriaButtons(container: HTMLElement) {
  const nonAriaButtons = Array.from(container.querySelectorAll('button:not([aria-role])'));
  for (const el of nonAriaButtons) {
    el.setAttribute('aria-role', 'button');
  }
}
