import Typography from 'typography';
import grandViewTheme from 'typography-theme-grand-view';

grandViewTheme.bodyFontFamily = ['Montserrat', 'sans-serif'];
grandViewTheme.googleFonts = [
  {
    name: 'Montserrat',
    styles: ['200', '400', '700'],
  },
];

const typography = Typography(grandViewTheme);

export const { scale, rhythm, options } = typography;
export default typography;
