import { createApiClient, createVideosService } from '@hypetube/services';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const apiClient = createApiClient({ baseUrl });

export const videosService = createVideosService(apiClient);
