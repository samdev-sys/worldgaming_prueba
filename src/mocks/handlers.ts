import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock para autenticación
  http.post('https://localhost:7082/api/Auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'admin'
        }
      },
      message: 'Login exitoso'
    });
  }),

  // Mock para obtener equipos
  http.get('https://localhost:7082/api/Teams/search', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test Team',
          description: 'Test team description',
          tag: 'TEST',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      totalRecords: 1,
      pageNumber: 1,
      pageSize: 6
    });
  }),

  // Mock para obtener torneos
  http.get('https://localhost:7082/api/Tournaments/search', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test Tournament',
          description: 'Test tournament description',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      totalRecords: 1,
      pageNumber: 1,
      pageSize: 6
    });
  }),

  // Mock para obtener juegos
  http.get('https://localhost:7082/api/Games/search', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          name: 'League of Legends',
          description: 'MOBA game',
          categoryId: '1',
          isActive: true
        }
      ],
      totalRecords: 1,
      pageNumber: 1,
      pageSize: 6
    });
  }),

  // Mock para errores de red
  http.get('https://localhost:7082/api/error', () => {
    return HttpResponse.json(
      { success: false, message: 'Error de red simulado' },
      { status: 500 }
    );
  })
];
