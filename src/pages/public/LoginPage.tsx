import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import {
  clearAuthError,
  loginUser,
} from '../../features/auth/authSlice';
import { authService } from '../../features/auth/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, status, user } = useAppSelector(
    (state) => state.auth,
  );

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(authService.getDefaultRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(clearAuthError());

    try {
      const session = await dispatch(
        loginUser({
          identifier: identifier.trim(),
          password,
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
            Вход в кабинет
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              color: '#718096', 
              mb: 5,
              fontSize: '14px',
            }}
          >
            Введите ваши учетные данные для входа
          </Typography>

          <form onSubmit={handleLogin}>
            {error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1,
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                }}
              >
                {error}
              </Alert>
            ) : null}

            <Typography variant="body2" sx={{ mb: 1.5, color: '#4A5568', fontWeight: 600 }}>
              ИИН или Email
            </Typography>
            <TextField
              fullWidth 
              variant="outlined" 
              placeholder="Введите ИИН или Email"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) {
                  dispatch(clearAuthError());
                }
              }}
              sx={{ mb: 3 }}
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>
                Пароль
              </Typography>
              <Link 
                href="#" 
                underline="none" 
                sx={{ 
                  fontSize: '0.875rem', 
                  color: '#00B64F', 
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#00A844',
                  }
                }}
              >
                Забыли пароль?
              </Link>
            </Box>
            <TextField
              fullWidth 
              variant="outlined" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) {
                  dispatch(clearAuthError());
                }
              }}
              sx={{ mb: 4 }}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#00B64F',
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </Button>
          </form>

          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #E0E7FF', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#718096', mr: 0.5 }}>
              Новый пользователь?
            </Typography>
            <Link 
              component="button"
              type="button"
              onClick={() => navigate('/register')}
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
              Создать аккаунт
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
