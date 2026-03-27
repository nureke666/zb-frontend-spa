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
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #F5F7FA 0%, #E8F0F7 100%)' }}>
      {/* ФИЛЬТРЫ САЙДБАР */}
      <Box
        sx={{
          width: 300,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRight: '1px solid rgba(0, 182, 79, 0.1)',
          p: 4,
          display: { xs: 'none', md: 'block' },
          boxShadow: '2px 0 12px rgba(0, 0, 0, 0.05)',
          overflow: 'auto',
          maxHeight: '100vh'
        }}
      >
        <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 3 }}>Фильтры</Typography>
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

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, overflow: 'auto', maxHeight: '100vh' }}>
        {/* ЗАГОЛОВОК */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 4,
            animation: 'slideInDown 0.6s ease'
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1, fontSize: '2rem' }}>
              Каталог грантов и ВУЗов
            </Typography>
            <Typography sx={{ color: '#718096', fontSize: '1rem' }}>
              В заявке уже выбрано <span style={{ fontWeight: 700, color: '#00B64F' }}>{selectedDirectionsCount}</span> из{' '}
              <span style={{ fontWeight: 700, color: '#0095D9' }}>{MAX_GRANT_PREFERENCES}</span> направлений.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/apply')}
            sx={{
              background: 'linear-gradient(135deg, #1A2B56 0%, #0F1B35 100%)',
              boxShadow: '0 4px 12px rgba(26, 43, 86, 0.3)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(26, 43, 86, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Открыть заявку
          </Button>
        </Box>

        {/* МОБИЛЬНЫЕ ФИЛЬТРЫ */}
        <Card
          sx={{
            mb: 3,
            borderRadius: '16px',
            border: '1px solid rgba(0, 182, 79, 0.2)',
            display: { xs: 'block', md: 'none' },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
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

        {/* ПОИСК */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Найти специальность или ВУЗ..."
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          sx={{
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 182, 79, 0.1)'
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 20px rgba(0, 182, 79, 0.2)',
                '& fieldset': {
                  borderColor: '#00B64F'
                }
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#00B64F', fontSize: 24 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* FEEDBACK ALERTS */}
        {feedback ? (
          <Alert
            severity={
              feedback.includes('уже') || feedback.includes('Удали')
                ? 'warning'
                : 'success'
            }
            sx={{
              mb: 3,
              background: feedback.includes('уже') 
                ? 'linear-gradient(135deg, rgba(253, 193, 27, 0.1) 0%, rgba(251, 188, 5, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
              border: feedback.includes('уже')
                ? '1px solid rgba(253, 193, 27, 0.3)'
                : '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '12px',
              animation: 'slideInDown 0.4s ease'
            }}
            onClose={() => setFeedback('')}
          >
            {feedback}
          </Alert>
        ) : null}

        {error ? (
          <Alert severity="error" sx={{
            mb: 3,
            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            animation: 'slideInDown 0.4s ease'
          }}>
            {error}
          </Alert>
        ) : null}

        {/* РЕЗУЛЬТАТЫ */}
        <Typography sx={{ color: '#4A5568', mb: 3, fontWeight: 600 }}>
          Найдено: <span style={{ fontSize: '1.2rem', color: '#00B64F', fontWeight: 700 }}>{filteredPrograms.length}</span> программ
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
            <CircularProgress sx={{ color: '#00B64F' }} size={50} />
          </Box>
        ) : filteredPrograms.length === 0 ? (
          <Card sx={{
            borderRadius: '16px',
            border: '2px dashed rgba(0, 182, 79, 0.2)',
            background: 'linear-gradient(135deg, rgba(0, 182, 79, 0.05) 0%, rgba(0, 182, 79, 0.02) 100%)',
            boxShadow: 'none'
          }}>
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: '#CBD5E0', mb: 2 }} />
              <Typography sx={{ color: '#1A2B56', fontWeight: 700, mb: 1, fontSize: '1.2rem' }}>
                Ничего не найдено
              </Typography>
              <Typography sx={{ color: '#718096' }}>
                Попробуй расширить фильтры или изменить поисковый запрос.
              </Typography>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3} sx={{ animation: 'slideInUp 0.6s ease' }}>
            {filteredPrograms.map((program, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={program.id} sx={{
                animation: `slideInUp 0.6s ease ${index * 0.05}s both`
              }}>
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
