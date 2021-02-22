import { FormEl } from '../../types';

/**
 * Go up from the current element to the parent to find the group container, but never go further than the current
 * group or form
 * @param el
 */
function getRadioGroupParent(el: HTMLElement) {
  const isContainer = Array.from(el.querySelectorAll(':scope input[type=radio]')).length > 1;
  if (!isContainer) {
    if (el.parentElement.dataset?.beakerGroup || el.parentElement.dataset?.beakerForm) {
      return undefined;
    }
    return getRadioGroupParent(el.parentElement);
  }
  return el;
}

/**
 * Sets the ARIA role based on the input type
 * @param el
 * @param elements
 */
export function setAriaRole(el: FormEl, elements: FormEl[]) {
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
 * @param el
 * @param elGroup
 */
export function setAriaValue(el: FormEl, elGroup: FormEl[]) {
  if (el.type === 'radio') {
    elGroup.forEach((el) => el.removeAttribute('aria-checked'));
  }
  if ((el as any).checked) {
    el.setAttribute('aria-checked', 'checked');
  } else {
    el.removeAttribute('aria-checked');
  }
}

/**
 * Set the container
 * @param container
 * @param isGroup
 */
export function setAriaContainer(container: HTMLElement, isGroup: boolean) {
  container.setAttribute('aria-role', isGroup ? 'row' : 'form');
}

export function setAriaButtons(container: HTMLElement) {
  Array.from(container.querySelectorAll('button')).forEach((el) => el.setAttribute('aria-role', 'button'));
}
