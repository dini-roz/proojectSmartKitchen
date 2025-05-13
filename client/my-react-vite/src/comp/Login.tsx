

// import React, { useState } from 'react';
// import { TextField, Button, Typography, Container, Paper, Grid, IconButton } from "@mui/material";
// import { AccountCircle } from "@mui/icons-material";
// import axios from 'axios';

// const Login: React.FC = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [email, setEmail] = useState('');
//     const [error, setError] = useState('');

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');

//         try {
//             const response = await axios.post('http://localhost:3001', { username, password });
//             console.log('Login successful', response.data);
//         } catch (err) {
//             setError('Login failed. Invalid credentials.');
//         }
//     };

//     return (
//         <Container component="main" maxWidth="xs">
//             <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px', background: 'linear-gradient(135deg, #f5f5f5 30%, #e0e0e0 90%)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
//                 <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2, color: '#3f51b5', fontWeight: 'bold' }}>
//                     התחברות
//                 </Typography>
//                 <form onSubmit={handleLogin}>
//                     <Grid container spacing={2}>
//                         <Grid>
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 label="שם משתמש"
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                                 required
//                                 InputProps={{
//                                     startAdornment: (
//                                         <IconButton>
//                                             <AccountCircle />
//                                         </IconButton>
//                                     ),
//                                 }}
//                             />
//                         </Grid>
//                         <Grid >
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 label="אימייל"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </Grid>
//                         <Grid >
//                             <TextField
//                                 variant="outlined"
//                                 type="password"
//                                 fullWidth
//                                 label="סיסמה"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                             />
//                         </Grid>
//                         {error && (
//                             <Grid >
//                                 <Typography color="error" align="center">
//                                     {error}
//                                 </Typography>
//                             </Grid>
//                         )}
//                         <Grid >
//                             <Button 
//                                 type="submit" 
//                                 fullWidth 
//                                 variant="contained" 
//                                 color="primary" 
//                                 sx={{ marginTop: 2, '&:hover': { backgroundColor: '#303f9f' } }}
//                             >
//                                 התחבר
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 </form>
//             </Paper>
//         </Container>
//     );
// };

// export default Login;