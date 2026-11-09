import { describe, expect, it } from 'vitest';
import { CheckboxFormatter, CheckmarkFormatter, PercentCompleteBarFormatter } from '../slick.formatters';

describe('formatter accessible values', () => {
  it('exposes visual percentage and boolean values as text alternatives', () => {
    const container = document.createElement('div');
    container.innerHTML = PercentCompleteBarFormatter(0, 0, 35, {} as any, {}, {} as any) as string;
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('35%');
    container.innerHTML = CheckboxFormatter(0, 0, false, {} as any, {}, {} as any) as string;
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('No');
    container.innerHTML = CheckmarkFormatter(0, 0, true, {} as any, {}, {} as any) as string;
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('Yes');
    container.innerHTML = CheckmarkFormatter(0, 0, false, {} as any, {}, {} as any) as string;
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('No');
  });
});
