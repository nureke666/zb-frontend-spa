import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ iin: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration logic here', formData);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7FA', py: 4 }}>
      
      {/* Логотип */}
      <Box 
        onClick={() => navigate('/')} 
        sx={{ position: 'absolute', top: 24, left: 32, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
      >
        <SchoolIcon sx={{ color: '#1A2B56', fontSize: 32 }} />
        <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700 }}>Zharqyn Bolashaq</Typography>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3, boxShadow: '0px 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', color: '#1A2B56', fontWeight: 700, mb: 4 }}>
            Регистрация<br/>абитуриента
          </Typography>

          <form onSubmit={handleRegister}>
            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>ИИН</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Введите ваш ИИН" name="iin"
              value={formData.iin} onChange={handleChange} sx={{ mb: 3 }} required
            />

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>Email</Typography>
            <TextField
              fullWidth variant="outlined" type="email" placeholder="example@mail.com" name="email"
              value={formData.email} onChange={handleChange} sx={{ mb: 3 }} required
            />

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>Пароль</Typography>
            <TextField
              fullWidth variant="outlined" type="password" placeholder="Придумайте пароль" name="password"
              value={formData.password} onChange={handleChange} sx={{ mb: 4 }} required
            />

            <Button
              type="submit" fullWidth variant="contained"
              sx={{ backgroundColor: '#00C853', py: 1.5, borderRadius: 2, fontSize: '1rem', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#00A844' } }}
            >
              Зарегистрироваться
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#4A5568' }}>
            Уже есть аккаунт?{' '}
            <Link component="button" onClick={() => navigate('/login')} underline="hover" sx={{ color: '#1A2B56', fontWeight: 700, fontSize: '1rem' }}>
              Войти
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;