import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import {
  clearAuthError,
  registerUser,
} from '../../features/auth/authSlice';
import { authService } from '../../features/auth/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getPasswordMismatchError,
  isValidEmail,
  isValidIin,
} from '../../utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, status, user } = useAppSelector(
    (state) => state.auth,
  );
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    iin: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');

  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(authService.getDefaultRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const passwordMismatchError = useMemo(
    () => getPasswordMismatchError(formData.password, formData.confirmPassword),
    [formData.confirmPassword, formData.password],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      dispatch(clearAuthError());
    }

    if (formError) {
      setFormError('');
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidIin(formData.iin)) {
      setFormError('ИИН должен состоять из 12 цифр.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFormError('Введите корректный email.');
      return;
    }

    if (passwordMismatchError) {
      setFormError(passwordMismatchError);
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    try {
      const session = await dispatch(
        registerUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          patronymic: formData.patronymic.trim(),
          iin: formData.iin.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      ).unwrap();

      navigate(authService.getDefaultRoute(session.user.role), { replace: true });
    } catch {
      // Ошибка уже сохранена в store и показана в UI.
    }
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
            {formError || error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {formError || error}
              </Alert>
            ) : null}

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>Имя</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Введите имя" name="firstName"
              value={formData.firstName} onChange={handleChange} sx={{ mb: 3 }} required
            />

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>Фамилия</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Введите фамилию" name="lastName"
              value={formData.lastName} onChange={handleChange} sx={{ mb: 3 }} required
            />

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>Отчество</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Введите отчество (необязательно)" name="patronymic"
              value={formData.patronymic} onChange={handleChange} sx={{ mb: 3 }}
            />

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

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>Подтвердите пароль</Typography>
            <TextField
              fullWidth variant="outlined" type="password" placeholder="Повторите пароль" name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 4 }}
              error={Boolean(passwordMismatchError)}
              helperText={passwordMismatchError || ' '}
              required
            />

            <Button
              type="submit" fullWidth variant="contained" disabled={isLoading}
              sx={{ backgroundColor: '#00C853', py: 1.5, borderRadius: 2, fontSize: '1rem', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#00A844' } }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
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
