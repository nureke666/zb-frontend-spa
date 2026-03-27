import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { CatalogProgram } from './catalog.types';

interface UniversityCardProps {
  program: CatalogProgram;
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: () => void;
}

const UniversityCard = ({
  program,
  isSelected,
  isDisabled = false,
  onSelect,
}: UniversityCardProps) => (
  <Card
    sx={{
      borderRadius: 2,
      border: isSelected ? '2px solid #00B64F' : '1px solid #E0E7FF',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        borderColor: '#00B64F',
      },
      ...(isDisabled && {
        opacity: 0.6,
        pointerEvents: 'none',
      }),
    }}
  >
    {isSelected && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #00B64F 0%, #00A844 100%)',
        }}
      />
    )}

    <CardContent sx={{ p: 3, flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #E8F8F0 0%, #E8F0F7 100%)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #E0E7FF',
            transition: 'all 0.3s ease',
          }}
        >
          <SchoolIcon sx={{ color: '#003366', fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ 
              color: '#003366', 
              fontWeight: 700, 
              lineHeight: 1.3, 
              mb: 0.5,
              fontSize: '16px',
            }}
          >
            {program.programCode}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#003366', 
              lineHeight: 1.3,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {program.programName}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#718096',
              fontSize: '13px',
            }}
          >
            {program.universityName}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.6,
            backgroundColor: '#F0F9FF',
            padding: '6px 12px',
            borderRadius: 1.5,
          }}
        >
          <LocationOnIcon sx={{ fontSize: 16, color: '#003366' }} />
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#003366', 
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {program.city}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.6,
            backgroundColor: '#F0FDF4',
            padding: '6px 12px',
            borderRadius: 1.5,
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 16, color: '#00B64F' }} />
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#00A844', 
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {program.duration}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#718096', 
            display: 'block',
            mb: 0.5,
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          Языки обучения
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {program.languages.map((lang) => (
            <Chip
              key={lang}
              label={lang}
              size="small"
              sx={{
                backgroundColor: lang === 'KZ' ? '#E8F8F0' : lang === 'RU' ? '#E8F0F7' : '#F0F9FF',
                color: lang === 'KZ' ? '#00B64F' : lang === 'RU' ? '#003366' : '#0284C7',
                fontWeight: 700,
                fontSize: '11px',
                height: 24,
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#718096', 
              display: 'block',
              mb: 0.5,
              fontWeight: 600,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Проходной балл
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#003366', 
              fontWeight: 800,
              fontSize: '24px',
            }}
          >
            {program.passingScore}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#718096', 
              display: 'block',
              mb: 0.5,
              fontWeight: 600,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Доступно грантов
          </Typography>
          <Chip
            label={`${program.grantCount}`}
            sx={{
              background: 'linear-gradient(135deg, #E8F8F0 0%, #F0FDF4 100%)',
              color: '#00B64F',
              fontWeight: 800,
              borderRadius: 1.5,
              fontSize: '18px',
              height: 'auto',
              padding: '4px 12px',
              border: '1px solid #B7E4C7',
            }}
          />
        </Box>
      </Box>
    </CardContent>

    <Box sx={{ p: 3, pt: 0 }}>
      <Button
        fullWidth
        variant={isSelected ? 'outlined' : 'contained'}
        disabled={isDisabled}
        onClick={onSelect}
        sx={{
          background: isSelected 
            ? 'transparent'
            : 'linear-gradient(135deg, #00B64F 0%, #00A844 100%)',
          color: isSelected ? '#003366' : '#fff',
          borderColor: isSelected ? '#00B64F' : undefined,
          borderWidth: isSelected ? 2 : 0,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '15px',
          py: 1.25,
          borderRadius: 1.5,
          transition: 'all 0.3s ease',
          boxShadow: isSelected 
            ? 'none'
            : '0px 4px 12px rgba(0, 182, 79, 0.15)',
          '&:hover': {
            background: isSelected 
              ? '#E8F8F0'
              : 'linear-gradient(135deg, #00A844 0%, #009036 100%)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {isSelected ? '✓ Добавлено в заявку' : 'Добавить в заявку'}
      </Button>
    </Box>
  </Card>
);

export default UniversityCard;
