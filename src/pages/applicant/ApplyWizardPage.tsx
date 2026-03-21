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
        backgroundColor: '#F5F7FA',
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
          sx={{ justifyContent: 'space-between', mb: 4 }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>
              Заявка на грант
            </Typography>
            <Typography sx={{ color: '#718096', mt: 1 }}>
              Черновик сохраняется автоматически и готов к подключению backend API.
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
              sx={{ fontWeight: 700 }}
            />
            <Button
              variant="outlined"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSaveDraft}
              sx={{ color: '#1A2B56', borderColor: '#CBD5E0' }}
            >
              Сохранить
            </Button>
          </Stack>
        </Stack>

        {isJustSaved ? (
          <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ mb: 3 }}>
            Черновик сохранен.
          </Alert>
        ) : null}

        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: 'none',
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

        <Card sx={{ borderRadius: 3, boxShadow: '0px 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {draft.currentStep !== 2 && stepError ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {stepError}
              </Alert>
            ) : null}

            {renderCurrentStep()}

            <Divider sx={{ my: 4 }} />

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
                sx={{ color: '#4A5568', fontWeight: 600 }}
              >
                ← Назад
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  backgroundColor: '#00C853',
                  px: 4,
                  py: 1.5,
                  '&:hover': { backgroundColor: '#00A844' },
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
