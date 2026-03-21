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
import { formatLanguages } from '../../utils/formatters';
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
      borderRadius: 3,
      border: '1px solid #E2E8F0',
      boxShadow: 'none',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ p: 3, flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            backgroundColor: '#F5F7FA',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SchoolIcon sx={{ color: '#1A2B56' }} />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: '#1A2B56', fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}
          >
            {program.programCode} - {program.programName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.2 }}>
            {program.universityName}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#A0AEC0' }} />
          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>
            {program.city}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: '#A0AEC0' }} />
          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>
            {program.duration}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>
          • {formatLanguages(program.languages)}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
        Профиль: {program.profileSubjects.join(', ')}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#A0AEC0', display: 'block' }}>
            Проходной балл
          </Typography>
          <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 800 }}>
            {program.passingScore}
          </Typography>
        </Box>
        <Chip
          label={`${program.grantCount} грантов`}
          sx={{
            backgroundColor: 'rgba(0,200,83,0.1)',
            color: '#00C853',
            fontWeight: 700,
            borderRadius: 1,
          }}
        />
      </Box>
    </CardContent>

    <Box sx={{ p: 3, pt: 0 }}>
      <Button
        fullWidth
        variant={isSelected ? 'outlined' : 'contained'}
        disabled={isDisabled}
        onClick={onSelect}
        sx={{
          backgroundColor: isSelected ? 'transparent' : '#00C853',
          color: isSelected ? '#1A2B56' : '#fff',
          borderColor: isSelected ? '#CBD5E0' : undefined,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: isSelected ? '#F8FAFC' : '#00A844',
          },
        }}
      >
        {isSelected ? 'Уже в заявке' : 'Добавить в заявку'}
      </Button>
    </Box>
  </Card>
);

export default UniversityCard;
