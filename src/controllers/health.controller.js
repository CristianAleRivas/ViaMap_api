import { healthService } from '../services/health.service.js';

export const healthController = (req, res, next) => {
  try {
    const mensaje = healthService();
    res.json({ message: mensaje });
  } catch (error) {
    next(error);
  }
};
