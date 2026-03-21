import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import { mapApiError } from '../../api/apiClient';
import {
  applyGrantSelection,
  loadDraft,
  MAX_GRANT_PREFERENCES,
  saveDraft,
} from '../../features/application/applicationDraft';
import GrantFilters from '../../features/catalog/GrantFilters';
import { catalogService } from '../../features/catalog/catalogData';
import type {
  CatalogFiltersState,
  CatalogProgram,
} from '../../features/catalog/catalog.types';
import UniversityCard from '../../features/catalog/UniversityCard';
import { useAppSelector } from '../../store/hooks';

const initialFilters: CatalogFiltersState = {
  search: '',
  selectedRegions: [],
  entProfile: 'all',
  maxPassingScore: 140,
};

const GrantsCatalogPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [filters, setFilters] = useState<CatalogFiltersState>(initialFilters);
  const [draft, setDraft] = useState(() => loadDraft(user));
  const [programs, setPrograms] = useState<CatalogProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setDraft(loadDraft(user));
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const loadPrograms = async () => {
      setIsLoading(true);
      setError('');

      try {
        const nextPrograms = await catalogService.listPrograms();

        if (isMounted) {
          setPrograms(nextPrograms);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(mapApiError(loadError).message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProgramIds = useMemo(
    () =>
      new Set(
        draft.grants
          .filter((grant) => grant.program)
          .map((grant) => grant.program),
      ),
    [draft.grants],
  );

  const selectedDirectionsCount = draft.grants.filter(
    (grant) => grant.region && grant.university && grant.program,
  ).length;

  const filteredPrograms = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesSearch =
        !search ||
        `${program.programCode} ${program.programName} ${program.universityName} ${program.city}`
          .toLowerCase()
          .includes(search);

      const matchesRegion =
        filters.selectedRegions.length === 0 ||
        filters.selectedRegions.includes(program.region);

      const matchesProfile =
        filters.entProfile === 'all' || program.entProfile === filters.entProfile;

      const matchesScore = program.passingScore <= filters.maxPassingScore;

      return matchesSearch && matchesRegion && matchesProfile && matchesScore;
    });
  }, [filters, programs]);

  const updateFilters = (patch: Partial<CatalogFiltersState>) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...patch }));
  };

  const handleSelectProgram = (program: CatalogProgram) => {
    const selectionResult = applyGrantSelection(loadDraft(user), {
      region: program.region,
      university: program.universityId,
      program: program.id,
    });

    setDraft(selectionResult.draft);
    saveDraft(selectionResult.draft);

    if (selectionResult.status === 'limit_reached') {
      setFeedback(
        `В заявке уже ${MAX_GRANT_PREFERENCES} приоритета. Удали один из них в мастере заявки, чтобы добавить новый.`,
      );
      return;
    }

    if (selectionResult.status === 'already_exists') {
      setFeedback('Эта программа уже есть в вашей заявке.');
      return;
    }

    setFeedback(
      'Программа добавлена в заявку. Можно продолжить выбор или открыть мастер заявки.',
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Box
        sx={{
          width: 300,
          backgroundColor: '#fff',
          borderRight: '1px solid #E2E8F0',
          p: 4,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <GrantFilters
          filters={filters}
          onRegionsChange={(selectedRegions) => updateFilters({ selectedRegions })}
          onEntProfileChange={(entProfile) => updateFilters({ entProfile })}
          onMaxPassingScoreChange={(maxPassingScore) =>
            updateFilters({ maxPassingScore })
          }
          onReset={() => setFilters(initialFilters)}
        />
      </Box>

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}>
              Каталог грантов и ВУЗов
            </Typography>
            <Typography sx={{ color: '#718096' }}>
              В заявке уже выбрано {selectedDirectionsCount} из{' '}
              {MAX_GRANT_PREFERENCES} направлений.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/apply')}
            sx={{
              backgroundColor: '#1A2B56',
              '&:hover': { backgroundColor: '#111D3D' },
              textTransform: 'none',
            }}
          >
            Открыть заявку
          </Button>
        </Box>

        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            display: { xs: 'block', md: 'none' },
          }}
        >
          <Box sx={{ p: 3 }}>
            <GrantFilters
              filters={filters}
              onRegionsChange={(selectedRegions) => updateFilters({ selectedRegions })}
              onEntProfileChange={(entProfile) => updateFilters({ entProfile })}
              onMaxPassingScoreChange={(maxPassingScore) =>
                updateFilters({ maxPassingScore })
              }
              onReset={() => setFilters(initialFilters)}
            />
          </Box>
        </Card>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Найти специальность или ВУЗ..."
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          sx={{ mb: 4, backgroundColor: '#fff', borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#A0AEC0' }} />
              </InputAdornment>
            ),
          }}
        />

        {feedback ? (
          <Alert
            severity={
              feedback.includes('уже') || feedback.includes('Удали')
                ? 'warning'
                : 'success'
            }
            sx={{ mb: 3 }}
            onClose={() => setFeedback('')}
          >
            {feedback}
          </Alert>
        ) : null}

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}

        <Typography sx={{ color: '#4A5568', mb: 3 }}>
          Найдено: {filteredPrograms.length} программ
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress sx={{ color: '#1A2B56' }} />
          </Box>
        ) : filteredPrograms.length === 0 ? (
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Box sx={{ p: 4 }}>
              <Typography sx={{ color: '#1A2B56', fontWeight: 700, mb: 1 }}>
                Ничего не найдено
              </Typography>
              <Typography sx={{ color: '#718096' }}>
                Попробуй расширить фильтры или изменить поисковый запрос.
              </Typography>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredPrograms.map((program) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={program.id}>
                <UniversityCard
                  program={program}
                  isSelected={selectedProgramIds.has(program.id)}
                  isDisabled={
                    !selectedProgramIds.has(program.id) &&
                    selectedDirectionsCount >= MAX_GRANT_PREFERENCES
                  }
                  onSelect={() => handleSelectProgram(program)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default GrantsCatalogPage;
