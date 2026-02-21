import { createTheme } from '@mui/material/styles';
import { Orbitron } from 'next/font/google';

export const orbitron = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const theme = createTheme({
  palette: {
    primary: {
      main: '#39fcfcff',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: orbitron.style.fontFamily,
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '3rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.4rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '2.8rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '2.2rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.4rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.6rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1.8rem',
      },
    },
    h5: {
      fontSize: '1.1rem',
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.4rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1rem',
      '@media (min-width:600px)': {
        fontSize: '1.1rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.15rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1.2rem',
      },
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "rgba(0, 249, 241, 1)",
          fontWeight: 700,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 249, 241, 1)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 249, 241, 1)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 249, 241, 1)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(0, 249, 241, 0.7)",
          "&.Mui-focused": {
            color: "rgba(0, 249, 241, 1)",
          },
        },
      },
    },
  },
});