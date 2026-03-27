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
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #FAFBFC 0%, #F5F7FA 100%)',
        py: 4,
      }}
    >
      
      {/* Логотип */}
      <Box 
        onClick={() => navigate('/')} 
        sx={{ 
          position: 'absolute', 
          top: 28, 
          left: 32, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(-4px)',
          }
        }}
      >
        <SchoolIcon sx={{ color: '#003366', fontSize: 36, fontWeight: 700 }} />
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
          Zharqyn Bolashaq
        </Typography>
      </Box>

      <Card 
        sx={{ 
          width: '100%', 
          maxWidth: 440, 
          borderRadius: 2,
          border: '1px solid #E0E7FF',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              textAlign: 'center', 
              color: '#003366', 
              fontWeight: 700, 
              mb: 1,
              fontSize: '28px',
            }}
          >
            Регистрация
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              color: '#718096', 
              mb: 4,
              fontSize: '14px',
            }}
          >
            Создайте аккаунт абитуриента
          </Typography>

          <form onSubmit={handleRegister}>
            {formError || error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1,
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                }}
              >
                {formError || error}
              </Alert>
            ) : null}

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              Имя
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              placeholder="Введите имя" 
              name="firstName"
              value={formData.firstName} 
              onChange={handleChange} 
              sx={{ mb: 2.5 }} 
              required
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              Фамилия
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              placeholder="Введите фамилию" 
              name="lastName"
              value={formData.lastName} 
              onChange={handleChange} 
              sx={{ mb: 2.5 }} 
              required
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              Отчество (необязательно)
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              placeholder="Введите отчество" 
              name="patronymic"
              value={formData.patronymic} 
              onChange={handleChange} 
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              ИИН (12 цифр)
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              placeholder="Введите ваш ИИН" 
              name="iin"
              value={formData.iin} 
              onChange={handleChange} 
              sx={{ mb: 2.5 }} 
              required
              inputProps={{
                maxLength: 12,
                style: {
                  fontSize: '16px',
                }
              }}
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              Email
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              type="email" 
              placeholder="example@mail.com" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              sx={{ mb: 2.5 }} 
              required
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              Пароль (мин. 6 символов)
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              type="password" 
              placeholder="Придумайте пароль" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              sx={{ mb: 2.5 }} 
              required
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              Подтвердите пароль
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              type="password" 
              placeholder="Повторите пароль" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 4 }}
              error={Boolean(passwordMismatchError)}
              helperText={passwordMismatchError || ' '}
              required
              slotProps={{
                input: {
                  style: {
                    fontSize: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />

            <Button
              type="submit" 
              fullWidth 
              variant="contained" 
              disabled={isLoading}
              sx={{ 
                background: 'linear-gradient(135deg, #00B64F 0%, #00A844 100%)',
                py: 1.5, 
                borderRadius: 1,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0px 4px 12px rgba(0, 182, 79, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 8px 24px rgba(0, 182, 79, 0.25)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
            </Button>
          </form>

          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #E0E7FF', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#718096', mr: 0.5 }}>
              Уже есть аккаунт?
            </Typography>
            <Link 
              component="button"
              type="button"
              onClick={() => navigate('/login')}
              underline="none"
              sx={{ 
                color: '#00B64F', 
                fontWeight: 700,
                fontSize: '14px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  color: '#00A844',
                }
              }}
            >
              Войти в аккаунт
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
