import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import {
  PROGRAM_OPTIONS,
  REGION_OPTIONS,
  UNIVERSITY_OPTIONS,
} from '../application.constants';
import type { GrantPreference } from '../application.types';

interface Step3GrantsProps {
  preferences: GrantPreference[];
  error?: string;
  canAddMore: boolean;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (
    preferenceId: string,
    field: keyof Omit<GrantPreference, 'id'>,
    value: string,
  ) => void;
}

const Step3Grants = ({
  preferences,
  error,
  canAddMore,
  onAdd,
  onRemove,
  onChange,
}: Step3GrantsProps) => (
  <>
    <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}>
      Шаг 3: Выбор гранта
    </Typography>
    <Typography sx={{ color: '#4A5568', mb: 4 }}>
      Выберите до 4 направлений в порядке приоритета. Чем выше приоритет, тем
      раньше программа будет участвовать в распределении.
    </Typography>

    {preferences.map((preference, index) => {
      const availableUniversities = UNIVERSITY_OPTIONS.filter(
        (university) =>
          !preference.region || university.region === preference.region,
      );
      const availablePrograms = PROGRAM_OPTIONS.filter(
        (program) =>
          !preference.university || program.university === preference.university,
      );

      return (
        <Card
          key={preference.id}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography sx={{ color: '#1A2B56', fontWeight: 700 }}>
                Приоритет {index + 1}
              </Typography>
              {preferences.length > 1 ? (
                <Button
                  color="inherit"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => onRemove(preference.id)}
                  sx={{ color: '#718096' }}
                >
                  Удалить
                </Button>
              ) : null}
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Регион обучения</InputLabel>
                  <Select
                    label="Регион обучения"
                    value={preference.region}
                    onChange={(event) =>
                      onChange(preference.id, 'region', event.target.value)
                    }
                  >
                    {REGION_OPTIONS.map((region) => (
                      <MenuItem key={region.value} value={region.value}>
                        {region.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Университет</InputLabel>
                  <Select
                    label="Университет"
                    value={preference.university}
                    onChange={(event) =>
                      onChange(preference.id, 'university', event.target.value)
                    }
                  >
                    {availableUniversities.map((university) => (
                      <MenuItem key={university.value} value={university.value}>
                        {university.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Программа</InputLabel>
                  <Select
                    label="Программа"
                    value={preference.program}
                    onChange={(event) =>
                      onChange(preference.id, 'program', event.target.value)
                    }
                  >
                    {availablePrograms.map((program) => (
                      <MenuItem key={program.value} value={program.value}>
                        {program.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    })}

    <Divider sx={{ mb: 3 }} />

    {error ? (
      <Typography sx={{ color: '#D32F2F', mb: 3, fontWeight: 600 }}>
        {error}
      </Typography>
    ) : null}

    <Button
      variant="outlined"
      fullWidth
      startIcon={<AddIcon />}
      onClick={onAdd}
      disabled={!canAddMore}
      sx={{
        color: '#00C853',
        borderColor: '#00C853',
        py: 1.5,
        '&:hover': {
          borderColor: '#00A844',
          backgroundColor: 'rgba(0,200,83,0.05)',
        },
      }}
    >
      {canAddMore
        ? 'Добавить еще одно направление'
        : 'Достигнут лимит из 4 направлений'}
    </Button>
  </>
);

export default Step3Grants;
