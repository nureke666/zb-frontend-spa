import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ENT_SUBJECT_OPTIONS } from '../application.constants';
import type {
  EducationInfo,
  EducationInfoErrors,
} from '../application.types';

interface Step2EducationProps {
  value: EducationInfo;
  errors: EducationInfoErrors;
  onChange: <Field extends keyof EducationInfo>(
    field: Field,
    fieldValue: EducationInfo[Field],
  ) => void;
}

const Step2Education = ({ value, errors, onChange }: Step2EducationProps) => (
  <>
    <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}>
      Шаг 2: Образование и ЕНТ
    </Typography>
    <Typography sx={{ color: '#4A5568', mb: 4 }}>
      Укажите учебное заведение и результаты ЕНТ. Эти данные нужны для подбора
      доступных программ и приоритизации заявки.
    </Typography>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Школа / колледж"
          value={value.schoolName}
          onChange={(event) => onChange('schoolName', event.target.value)}
          error={Boolean(errors.schoolName)}
          helperText={errors.schoolName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Год выпуска"
          value={value.graduationYear}
          onChange={(event) => onChange('graduationYear', event.target.value)}
          error={Boolean(errors.graduationYear)}
          helperText={errors.graduationYear}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Балл ЕНТ"
          value={value.entScore}
          onChange={(event) => onChange('entScore', event.target.value)}
          error={Boolean(errors.entScore)}
          helperText={errors.entScore}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Средний балл (GPA)"
          value={value.gpa}
          onChange={(event) => onChange('gpa', event.target.value)}
          helperText="Необязательно"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth error={Boolean(errors.primarySubject)}>
          <InputLabel>Профильный предмет 1</InputLabel>
          <Select
            label="Профильный предмет 1"
            value={value.primarySubject}
            onChange={(event) => onChange('primarySubject', event.target.value)}
          >
            {ENT_SUBJECT_OPTIONS.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.primarySubject ? (
          <Typography variant="caption" sx={{ color: '#D32F2F', mt: 0.5, display: 'block' }}>
            {errors.primarySubject}
          </Typography>
        ) : null}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth error={Boolean(errors.secondarySubject)}>
          <InputLabel>Профильный предмет 2</InputLabel>
          <Select
            label="Профильный предмет 2"
            value={value.secondarySubject}
            onChange={(event) => onChange('secondarySubject', event.target.value)}
          >
            {ENT_SUBJECT_OPTIONS.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.secondarySubject ? (
          <Typography variant="caption" sx={{ color: '#D32F2F', mt: 0.5, display: 'block' }}>
            {errors.secondarySubject}
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  </>
);

export default Step2Education;
