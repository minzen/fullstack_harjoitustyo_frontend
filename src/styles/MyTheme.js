import { createMuiTheme } from '@material-ui/core/styles'

const MyTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ff4400'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00'
    }
    // Use defaults for error
    // error: {
    //   light: '#FF3333',
    //   main: '#CC3300'
    // }
  }
})
export default MyTheme
