import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const MyTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#455a64'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: will be calculated from palette.secondary.main
      main: '#d32f2f'
      // dark: will be calculated from palette.secondary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    error: red
  },
  spacing: 5
})
export default MyTheme
