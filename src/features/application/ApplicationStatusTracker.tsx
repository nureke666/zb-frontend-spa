import { Step, StepLabel, Stepper, Typography } from '@mui/material';

interface ApplicationStatusTrackerProps {
  labels: string[];
  completedSteps: number[];
  activeStep: number;
}

const ApplicationStatusTracker = ({
  labels,
  completedSteps,
  activeStep,
}: ApplicationStatusTrackerProps) => (
  <Stepper activeStep={activeStep} alternativeLabel>
    {labels.map((label, index) => (
      <Step key={label} completed={completedSteps.includes(index)}>
        <StepLabel
          StepIconProps={{
            sx: {
              '&.Mui-active': { color: '#1A2B56' },
              '&.Mui-completed': { color: '#00C853' },
            },
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
        </StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default ApplicationStatusTracker;
