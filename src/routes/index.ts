import { Router } from 'express';
import { login, register } from '../controllers/AuthController';
import { getPets, getPetById, createPet, updatePet, deletePet, getStatistics } from '../controllers/PetController';
import { getAdoptions, createAdoption, processAdoptionsBatch } from '../controllers/AdoptionController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

// Auth
router.post('/login', login);
router.post('/register', register);

// Pets
router.get('/pets', getPets);
router.get('/pets/statistics', authMiddleware, getStatistics);
router.get('/pets/:id', getPetById);
router.post('/pets', authMiddleware, upload.single('photo'), createPet);
router.put('/pets/:id', authMiddleware, upload.single('photo'), updatePet);
router.delete('/pets/:id', authMiddleware, deletePet);

// Adoptions
router.get('/adoptions', authMiddleware, getAdoptions);
router.post('/adoptions', authMiddleware, createAdoption);
router.put('/adoptions/batch', authMiddleware, processAdoptionsBatch);

export default router;
