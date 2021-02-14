import { FormEl } from '../types/forms';

export function getAllFieldsWithValidity(rootEl: HTMLElement) {
  const nodeList = rootEl.querySelectorAll('*[name]') as NodeListOf<HTMLElement>;
  const withValidity: FormEl[] = Array.from(nodeList).filter((el) => (el as any).checkValidity) as FormEl[];
  return withValidity;
}
