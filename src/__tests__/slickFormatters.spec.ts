import { describe, expect, it } from 'vitest';
import { CheckboxFormatter, CheckmarkFormatter, PercentCompleteBarFormatter, PercentCompleteFormatter, YesNoFormatter } from '../slick.formatters';

const format = (formatter: any, value: unknown) => formatter(0, 0, value, {}, {}, {});

describe('SlickGrid formatters', () => {
  it.each([null, undefined, ''])('renders missing progress %s as a dash or empty bar', (value) => {
    expect(format(PercentCompleteFormatter, value)).toBe('-');
    expect(format(PercentCompleteBarFormatter, value)).toBe('');
  });

  it.each([[0, 'red'], [29, 'red'], [30, 'silver'], [69, 'silver'], [70, 'green'], [100, 'green']])(
    'renders the progress bar at %i with %s color', (value, color) => {
      expect(format(PercentCompleteBarFormatter, value)).toContain(`background:${color};width:${value}%`);
    }
  );

  it('renders the percentage threshold and boolean values', () => {
    expect(format(PercentCompleteFormatter, 49)).toContain('color:red');
    expect(format(PercentCompleteFormatter, 50)).toContain('color:green');
    expect(format(YesNoFormatter, true)).toBe('Yes');
    expect(format(YesNoFormatter, false)).toBe('No');
    expect(format(CheckboxFormatter, true)).toContain('sgi-checkbox-intermediate');
    expect(format(CheckboxFormatter, false)).toContain('sgi-checkbox-blank-outline');
    expect(format(CheckmarkFormatter, true)).toContain('sgi-check');
    expect(format(CheckmarkFormatter, false)).toBe('');
  });
});
