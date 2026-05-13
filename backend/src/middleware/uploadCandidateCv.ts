import multer from 'multer';

export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_CV_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

export const uploadCandidateCv = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_CV_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (ALLOWED_CV_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error('INVALID_CV_FILE_TYPE'));
  },
});
