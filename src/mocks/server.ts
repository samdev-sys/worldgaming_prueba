import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configurar MSW server con handlers
export const server = setupServer(...handlers);
