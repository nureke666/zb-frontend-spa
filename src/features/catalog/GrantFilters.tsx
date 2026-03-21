import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from '@mui/material';
import { REGION_OPTIONS } from '../application/application.constants';
import type { CatalogEntProfile, CatalogFiltersState } from './catalog.types';

interface GrantFiltersProps {
  filters: CatalogFiltersState;
  onRegionsChange: (regions: string[]) => void;
  onEntProfileChange: (profile: CatalogEntProfile) => void;
  onMaxPassingScoreChange: (score: number) => void;
  onReset: () => void;
}

const profileOptions: Array<{ value: CatalogEntProfile; label: string }> = [
  { value: 'all', label: 'Все профили' },
  { value: 'fizmat', label: 'Физ-Мат' },
  { value: 'biohim', label: 'Био-Хим' },
  { value: 'humanities', label: 'Гуманитарный' },
];

const GrantFilters = ({
  filters,
  onRegionsChange,
  onEntProfileChange,
  onMaxPassingScoreChange,
  onReset,
}: GrantFiltersProps) => (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
      <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 800 }}>
        Фильтры
      </Typography>
      <Button
        size="small"
        onClick={onReset}
        sx={{ color: '#718096', textTransform: 'none', fontWeight: 600 }}
      >
        Сбросить
      </Button>
    </Box>

    <Typography sx={{ fontWeight: 700, color: '#4A5568', mb: 2 }}>
      Регион
    </Typography>
    {REGION_OPTIONS.map((region) => (
      <FormControlLabel
        key={region.value}
        control={
          <Checkbox
            checked={filters.selectedRegions.includes(region.value)}
            onChange={(event) =>
              onRegionsChange(
                event.target.checked
                  ? [...filters.selectedRegions, region.value]
                  : filters.selectedRegions.filter((value) => value !== region.value),
              )
            }
            sx={{
              color: '#00C853',
              '&.Mui-checked': { color: '#00C853' },
            }}
          />
        }
        label={region.label}
      />
    ))}

    <Typography sx={{ fontWeight: 700, color: '#4A5568', mt: 4, mb: 2 }}>
      Профиль ЕНТ
    </Typography>
    <RadioGroup
      value={filters.entProfile}
      onChange={(event) =>
        onEntProfileChange(event.target.value as CatalogEntProfile)
      }
    >
      {profileOptions.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio sx={{ '&.Mui-checked': { color: '#00C853' } }} />}
          label={option.label}
        />
      ))}
    </RadioGroup>

    <Typography sx={{ fontWeight: 700, color: '#4A5568', mt: 4, mb: 2 }}>
      Максимальный проходной балл
    </Typography>
    <Slider
      value={filters.maxPassingScore}
      onChange={(_, value) => onMaxPassingScoreChange(value as number)}
      min={50}
      max={140}
      valueLabelDisplay="on"
      sx={{ color: '#00C853' }}
    />
  </>
);

export default GrantFilters;
