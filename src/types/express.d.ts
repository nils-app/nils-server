import { User as AppUser } from '../middleware/auth';

declare global {
  namespace Express {
    export interface User extends AppUser {}
  }
}
