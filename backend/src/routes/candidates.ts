import { Router } from 'express';
import { createCandidate } from '../services/candidateService';
import { uploadCandidateCv } from '../middleware/uploadCandidateCv';
import { validateCandidateInput } from '../validators/candidateValidator';

const router = Router();

router.post('/', uploadCandidateCv.single('cv'), async (req, res, next) => {
  try {
    const input = validateCandidateInput(req.body);
    const candidate = await createCandidate(input, req.file);

    res.status(201).json({
      candidate,
      message: 'Candidate created successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
