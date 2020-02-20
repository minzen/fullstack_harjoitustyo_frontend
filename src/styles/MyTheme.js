import { createMuiTheme } from '@material-ui/core/styles'

const MyTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#424242',
      //main: '#455a64'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      error: '#ff3700'
    },
    secondary: {
      // light: will be calculated from palette.secondary.main
      main: '#d32f2f',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      error: '#ff3700'
    }
  },
  spacing: 5
})
export default MyTheme
