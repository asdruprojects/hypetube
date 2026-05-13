import * as path from 'path';

// Forzamos el fixture controlado ANTES de que cualquier spec importe AppModule:
// ConfigModule lee process.env durante el compile, así que esta ruta debe
// existir en process.env desde el primer momento.
process.env.MOCK_VIDEOS_PATH = path.resolve(__dirname, 'fixtures/videos-fixture.json');
process.env.NODE_ENV = 'test';

// Bootstrap de Nest + compilación de ts-jest puede tardar en frío;
// 30s da margen sin enmascarar bugs reales.
jest.setTimeout(30000);
