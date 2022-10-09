import { createTheme } from "@mui/material/styles";
import { heIL } from '@mui/material/locale';
export const theme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        h1: {
            fontSize: '3rem',
        },
        h2: {
            fontSize: '1.6rem'
        }
    },

}, heIL);