import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
// import { z } from 'zod';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';
 import { useLoginMutation } from '../api/userApi'; 
import { LoginSchema, LoginFormData } from '../schema/LoginSchema'
import {useAppDispatch} from '../../../app/hooks/useAppDispatch'
import { selectCurrentUserName, setCredentials } from "../api/authSlice"
import { useAppSelector } from '../../../app/hooks/useAppSelector';
const Login: React.FC = () => {
   const [login,{error,isLoading}] = useLoginMutation();
  // const [getUser,] =useGetUserQuery();
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });
  console.log('האם נטען?', isLoading); 
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
   
  console.log('נתוני התחברות לפני שליחה:', data);
     try {
          
       const result = await login(data).unwrap();
       console.log("ggggggggggg")
          console.log(isLoading, result);
        
          console.log("resalte",result)
        
             dispatch(
              setCredentials({
                    profilePicture:result.user.profilePicture,
               user_id: result.user.user_id,
               username:result.user.username,
               name: result.user.name,
               password:result.user.password,
               paymentDetails:result.user.paymentDetails,
               email:result.user.email,
               phone: result.user.phone,
               kitchenItems:result.user.kitchenItems,
               shoppingList:result.user.shoppingList, 
               food:result.user.food,                      
    })
      );
     console.log('האם נטען אחרי?', isLoading, result);
      
                   navigate(`/${result.user.username}`);
     console.log('האם נטען אחרי?', isLoading, result);
       
    
     
    } catch (err) {
     console.error('התחברות נכשלה:', err);
        console.error('התחברות נכשלה:', err);
     console.log('נתוני שגיאה מהשרת:', err);
     }
    
  
  
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px', background: '#f5f5f5' }}>
        <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2 }}>
          התחברות
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
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
            <Grid >
              <TextField
                {...register('password')}
                variant="outlined"
                fullWidth
                name="password"
                label="סיסמה"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                התחבר
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Grid >
          <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
            אין לך חשבון? הירשם כאן
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;