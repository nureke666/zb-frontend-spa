import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { REQUIRED_DOCUMENTS } from '../application.constants';
import type {
  DocumentType,
  UploadedDocument,
} from '../application.types';

interface Step4DocumentsProps {
  documents: UploadedDocument[];
  error?: string;
  onUpload: (documentType: DocumentType, file: File | null) => void;
}

const Step4Documents = ({
  documents,
  error,
  onUpload,
}: Step4DocumentsProps) => (
  <>
    <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}>
      Шаг 4: Документы
    </Typography>
    <Typography sx={{ color: '#4A5568', mb: 4 }}>
      Загрузите обязательные документы. На текущем этапе фронт сохраняет метаданные
      файлов в черновик, чтобы потом безболезненно подключить реальный backend upload.
    </Typography>

    <Stack spacing={3}>
      {REQUIRED_DOCUMENTS.map((document) => {
        const uploadedDocument = documents.find(
          (item) => item.type === document.type,
        );

        return (
          <Card
            key={document.type}
            sx={{
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
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box>
                  <Typography sx={{ color: '#1A2B56', fontWeight: 700, mb: 0.5 }}>
                    {document.label}
                  </Typography>
                  <Typography sx={{ color: '#718096' }}>
                    {document.description}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{
                    color: '#00C853',
                    borderColor: '#00C853',
                    alignSelf: 'flex-start',
                  }}
                >
                  {uploadedDocument ? 'Заменить файл' : 'Загрузить'}
                  <input
                    hidden
                    type="file"
                    onChange={(event) =>
                      onUpload(document.type, event.target.files?.[0] ?? null)
                    }
                  />
                </Button>
              </Box>

              {uploadedDocument ? (
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DescriptionIcon sx={{ color: '#1A2B56' }} />
                    <Box>
                      <Typography sx={{ color: '#1A2B56', fontWeight: 600 }}>
                        {uploadedDocument.fileName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#718096' }}>
                        {uploadedDocument.sizeKb} KB
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="Загружено"
                    sx={{
                      backgroundColor: 'rgba(0,200,83,0.12)',
                      color: '#00A844',
                      fontWeight: 700,
                    }}
                  />
                </Box>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </Stack>

    {error ? (
      <Typography sx={{ color: '#D32F2F', mt: 3, fontWeight: 600 }}>
        {error}
      </Typography>
    ) : null}
  </>
);

export default Step4Documents;
