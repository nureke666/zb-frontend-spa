import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import ApplicationStatusTracker from '../../features/application/ApplicationStatusTracker';
import { WIZARD_STEP_LABELS } from '../../features/application/application.constants';
import {
  createEmptyPreference,
  getCompletedStepIndexes,
  getLifecycleStatus,
  loadDraft,
  MAX_GRANT_PREFERENCES,
  resetSubmittedState,
  saveDraft,
  submitDraft,
  validateStep,
} from '../../features/application/applicationDraft';
import Step1Personal from '../../features/application/wizard/Step1Personal';
import Step2Education from '../../features/application/wizard/Step2Education';
import Step3Grants from '../../features/application/wizard/Step3Grants';
import Step4Documents from '../../features/application/wizard/Step4Documents';
import type {
  ApplicationDraft,
  EducationInfoErrors,
  GrantPreference,
  PersonalInfoErrors,
} from '../../features/application/application.types';

const ApplyWizardPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [draft, setDraft] = useState<ApplicationDraft>(() => loadDraft(user));
  const [personalErrors, setPersonalErrors] = useState<PersonalInfoErrors>({});
  const [educationErrors, setEducationErrors] = useState<EducationInfoErrors>({});
  const [stepError, setStepError] = useState('');
  const [isJustSaved, setIsJustSaved] = useState(false);

  useEffect(() => {
    setDraft(loadDraft(user));
  }, [user]);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  useEffect(() => {
    if (!isJustSaved) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setIsJustSaved(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [isJustSaved]);

  const completedSteps = useMemo(() => getCompletedStepIndexes(draft), [draft]);
  const lifecycleStatus = useMemo(() => getLifecycleStatus(draft), [draft]);
  const isLastStep = draft.currentStep === WIZARD_STEP_LABELS.length - 1;

  const updateDraft = (
    updater: (currentDraft: ApplicationDraft) => ApplicationDraft,
  ) => {
    setDraft((currentDraft) => ({
      ...updater(resetSubmittedState(currentDraft)),
      updatedAt: new Date().toISOString(),
    }));
    setStepError('');
  };

  const handleSaveDraft = () => {
    saveDraft(draft);
    setIsJustSaved(true);
  };

  const handleNext = () => {
    const validation = validateStep(draft, draft.currentStep);

    setPersonalErrors(validation.personalErrors ?? {});
    setEducationErrors(validation.educationErrors ?? {});

    if (!validation.isValid) {
      setStepError(validation.message ?? 'Проверьте заполнение текущего шага.');
      return;
    }

    setStepError('');

    if (isLastStep) {
      const submittedDraft = submitDraft(draft);
      setDraft(submittedDraft);
      saveDraft(submittedDraft);
      setIsJustSaved(true);
      navigate('/dashboard');
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: Math.min(
        currentDraft.currentStep + 1,
        WIZARD_STEP_LABELS.length - 1,
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleBack = () => {
    if (draft.currentStep === 0) {
      navigate(-1);
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      currentStep: currentDraft.currentStep - 1,
    }));
  };

  const handlePreferenceChange = (
    preferenceId: string,
    field: keyof Omit<GrantPreference, 'id'>,
    value: string,
  ) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      grants: currentDraft.grants.map((preference) => {
        if (preference.id !== preferenceId) {
          return preference;
        }

        if (field === 'region') {
          return {
            ...preference,
            region: value,
            university: '',
            program: '',
          };
        }

        if (field === 'university') {
          return {
            ...preference,
            university: value,
            program: '',
          };
        }

        return {
          ...preference,
          [field]: value,
        };
      }),
    }));
  };

  const renderCurrentStep = () => {
    switch (draft.currentStep) {
      case 0:
        return (
          <Step1Personal
            value={draft.personal}
            errors={personalErrors}
            onChange={(field, value) =>
              updateDraft((currentDraft) => ({
                ...currentDraft,
                personal: {
                  ...currentDraft.personal,
                  [field]: value,
                },
              }))
            }
          />
        );
      case 1:
        return (
          <Step2Education
            value={draft.education}
            errors={educationErrors}
            onChange={(field, value) =>
              updateDraft((currentDraft) => ({
                ...currentDraft,
                education: {
                  ...currentDraft.education,
                  [field]: value,
                },
              }))
            }
          />
        );
      case 2:
        return (
          <Step3Grants
            preferences={draft.grants}
            error={stepError}
            canAddMore={draft.grants.length < MAX_GRANT_PREFERENCES}
            onAdd={() =>
              updateDraft((currentDraft) => ({
                ...currentDraft,
                grants:
                  currentDraft.grants.length >= MAX_GRANT_PREFERENCES
                    ? currentDraft.grants
                    : [...currentDraft.grants, createEmptyPreference()],
              }))
            }
            onRemove={(preferenceId) =>
              updateDraft((currentDraft) => ({
                ...currentDraft,
                grants:
                  currentDraft.grants.length === 1
                    ? currentDraft.grants
                    : currentDraft.grants.filter(
                        (preference) => preference.id !== preferenceId,
                      ),
              }))
            }
            onChange={handlePreferenceChange}
          />
        );
      case 3:
        return (
          <Step4Documents
            documents={draft.documents}
            error={stepError}
            onUpload={(documentType, file) => {
              if (!file) {
                return;
              }

              updateDraft((currentDraft) => ({
                ...currentDraft,
                documents: [
                  ...currentDraft.documents.filter(
                    (document) => document.type !== documentType,
                  ),
                  {
                    id: `${documentType}-${Date.now()}`,
                    type: documentType,
                    fileName: file.name,
                    sizeKb: Math.max(1, Math.round(file.size / 1024)),
                    uploadedAt: new Date().toISOString(),
                  },
                ],
              }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E8F0F7 100%)',
        py: 6,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 960 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', mb: 4, animation: 'slideInDown 0.6s ease' }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, fontSize: '2rem' }}>
              Заявка на грант
            </Typography>
            <Typography sx={{ color: '#718096', mt: 1, fontSize: '1rem' }}>
              Заполните все этапы заявки и отправьте на рассмотрение
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Chip
              label={
                lifecycleStatus === 'SUBMITTED'
                  ? 'Заявка отправлена'
                  : lifecycleStatus === 'READY_TO_SUBMIT'
                    ? 'Готово к отправке'
                    : lifecycleStatus === 'DRAFT'
                      ? 'Черновик'
                      : 'Не начато'
              }
              color={
                lifecycleStatus === 'SUBMITTED'
                  ? 'success'
                  : lifecycleStatus === 'READY_TO_SUBMIT'
                    ? 'warning'
                    : 'default'
              }
              sx={{
                fontWeight: 700,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSaveDraft}
              sx={{
                color: '#1A2B56',
                borderColor: '#00B64F',
                borderWidth: '2px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 182, 79, 0.08)',
                  borderColor: '#00B64F',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 182, 79, 0.2)'
                }
              }}
            >
              Сохранить
            </Button>
          </Stack>
        </Stack>

        {isJustSaved ? (
          <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{
            mb: 3,
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '12px',
            animation: 'slideInDown 0.4s ease'
          }}>
            Черновик сохранен. Изменения синхронизированы.
          </Alert>
        ) : null}

        <Card
          sx={{
            mb: 4,
            borderRadius: '16px',
            border: '1px solid rgba(0, 182, 79, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            animation: 'slideInUp 0.6s ease 0.1s both',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-4px)'
            }
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <ApplicationStatusTracker
              labels={[...WIZARD_STEP_LABELS]}
              completedSteps={completedSteps}
              activeStep={draft.currentStep}
            />
          </CardContent>
        </Card>

        <Card sx={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          animation: 'slideInUp 0.6s ease 0.2s both',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)'
          }
        }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {draft.currentStep !== 2 && stepError ? (
              <Alert severity="error" sx={{
                mb: 3,
                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: '12px',
                animation: 'slideInDown 0.4s ease'
              }}>
                {stepError}
              </Alert>
            ) : null}

            {renderCurrentStep()}

            <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                onClick={handleBack}
                sx={{
                  color: '#4A5568',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#1A2B56',
                    backgroundColor: 'rgba(0, 182, 79, 0.08)'
                  }
                }}
              >
                ← Назад
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: 'linear-gradient(135deg, #00B64F 0%, #00A844 100%)',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0, 182, 79, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 182, 79, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {isLastStep ? 'Отправить заявку' : 'Сохранить и продолжить'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ApplyWizardPage;
