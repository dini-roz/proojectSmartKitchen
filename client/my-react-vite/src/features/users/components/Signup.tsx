import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router'; 
import { z } from 'zod';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';
import {useCreateUserMutation} from '../api/userApi'
import {SignupSchema,SignupFormData } from '../schema/schemaUser'
import { useAppDispatch } from '../../../app/hooks/useAppDispatch';
import { setCredentials } from '../api/authSlice';
const Signup: React.FC = () => {
       const navigate = useNavigate();
        const dispatch = useAppDispatch(); 
 const [createUser, error ] = useCreateUserMutation();
 const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema), 
  });
    const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
        try {
            console.log("Submitting data:", data);
            const userDataToSend = {
                username: data.username,
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                paymentDetails: {
                    cardNumber: data.cardNumber,
                    expiryDate: data.expiryDate,
                    CVV: data.CVV,
                },
           };
            const result=  await createUser(userDataToSend).unwrap();
            console.log("r",result.username)         
               console.log('User created successfully');
                    dispatch(
                       setCredentials({
                         password: result.password, 
                         username: result.username, 
                         userid: result.userid,  
                       })
                );
              
               navigate(`/${data.username}`);
        } catch (err) {
            console.error('Failed to create user: ',err);
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px', background: '#f5f5f5' }}>
                <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2 }}>
                    הרשמה
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid >
                            <TextField
                                {...register('username')}
                                variant="outlined"
                                fullWidth
                                label="שם משתמש"
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                {...register('name')}
                                variant="outlined"
                                fullWidth
                                label="שם"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid >
                            <TextField
                                {...register('email')}
                                variant="outlined"
                                fullWidth
                                label="אימייל"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                {...register('password')}
                                variant="outlined"
                                type="password"
                                fullWidth
                                label="סיסמה"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid >
                            <TextField
                                {...register('phone')}
                                variant="outlined"
                                fullWidth
                                label="טלפון"
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                        <Grid >
                            <TextField
                                {...register('cardNumber')}
                                variant="outlined"
                                fullWidth
                                label="מספר כרטיס"
                                error={!!errors.cardNumber}
                                helperText={errors.cardNumber?.message}
                            />
                        </Grid>
                        <Grid >
                            <TextField
                                {...register('expiryDate')}
                                variant="outlined"
                                fullWidth
                                label="תאריך תפוגה"
                                error={!!errors.expiryDate}
                                helperText={errors.expiryDate?.message}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                {...register('CVV')}
                                variant="outlined"
                                fullWidth
                                label="CVV"
                                error={!!errors.CVV}
                                helperText={errors.CVV?.message}
                            />
                        </Grid>
                         <Grid >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                            > הרשמה
                          </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Grid>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        כבר יש לך חשבון? התחבר כאן
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
};
export default Signup;
