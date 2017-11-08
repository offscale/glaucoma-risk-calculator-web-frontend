import * as math from 'mathjs';

export interface IString2String {
  [str: string]: string
}

export const colours: IString2String = Object.freeze({
  indigo: '#14143e',
  pink: '#fd1c49',
  orange: '#ff6e00',
  yellow: '#f0c800',
  mint: '#00efab',
  cyan: '#05d1ff',
  purple: '#841386',
  white: '#fff',
  darkgrey: 'darkgrey',
  teal: '#5AA454',
  darkred: '#A10A28',
  gold: '#C7B42C',
  grey: '#AAAAAA'
});

export const numToColour = (num: number): string => {
  if (math.compare(num, 5) < 1)
    return colours.darkgrey;
  else if (math.compare(num, 25) < 1)
    return colours.cyan;
  else if (math.compare(num, 50) < 1)
    return colours.mint;
  else if (math.compare(num, 75) < 1)
    return colours.orange;
  return colours.pink;
};
