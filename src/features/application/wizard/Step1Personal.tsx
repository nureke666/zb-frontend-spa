import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { REGION_OPTIONS } from '../application.constants';
import type { PersonalInfo, PersonalInfoErrors } from '../application.types';

interface Step1PersonalProps {
  value: PersonalInfo;
  errors: PersonalInfoErrors;
  onChange: <Field extends keyof PersonalInfo>(
    field: Field,
    fieldValue: PersonalInfo[Field],
  ) => void;
}

const Step1Personal = ({ value, errors, onChange }: Step1PersonalProps) => (
  <>
    <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}>
      Шаг 1: Личные данные
    </Typography>
    <Typography sx={{ color: '#4A5568', mb: 4 }}>
      Заполните базовую информацию об абитуриенте. Эти данные используются для
      формирования заявки и последующей проверки.
    </Typography>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Имя"
          value={value.firstName}
          onChange={(event) => onChange('firstName', event.target.value)}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Фамилия"
          value={value.lastName}
          onChange={(event) => onChange('lastName', event.target.value)}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Отчество"
          value={value.patronymic}
          onChange={(event) => onChange('patronymic', event.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="ИИН"
          value={value.iin}
          onChange={(event) => onChange('iin', event.target.value)}
          error={Boolean(errors.iin)}
          helperText={errors.iin}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={value.email}
          onChange={(event) => onChange('email', event.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Телефон"
          value={value.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          error={Boolean(errors.phone)}
          helperText={errors.phone || 'Например: +7 700 000 00 00'}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Дата рождения"
          type="date"
          value={value.birthDate}
          onChange={(event) => onChange('birthDate', event.target.value)}
          error={Boolean(errors.birthDate)}
          helperText={errors.birthDate}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth error={Boolean(errors.region)}>
          <InputLabel>Регион проживания</InputLabel>
          <Select
            label="Регион проживания"
            value={value.region}
            onChange={(event) => onChange('region', event.target.value)}
          >
            {REGION_OPTIONS.map((region) => (
              <MenuItem key={region.value} value={region.value}>
                {region.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.region ? (
          <Typography variant="caption" sx={{ color: '#D32F2F', mt: 0.5, display: 'block' }}>
            {errors.region}
          </Typography>
        ) : null}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Город / населенный пункт"
          value={value.city}
          onChange={(event) => onChange('city', event.target.value)}
          error={Boolean(errors.city)}
          helperText={errors.city}
        />
      </Grid>
    </Grid>
  </>
);

export default Step1Personal;
