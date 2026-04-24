/**
 * Servicio para manejar la navegación de manera centralizada
 */
class NavigationService {
  private navigateFunction: ((path: string) => void) | null = null;

  /**
   * Establece la función de navegación
   * @param navigate - Función de navigate de react-router-dom
   */
  setNavigate(navigate: (path: string) => void) {
    this.navigateFunction = navigate;
  }

  /**
   * Navega a una ruta específica
   * @param path - Ruta de destino
   */
  navigate(path: string) {
    if (this.navigateFunction) {
      this.navigateFunction(path);
    } else {
      // Fallback a window.location si navigate no está disponible
      window.location.href = path;
    }
  }

  /**
   * Navega al inicio
   */
  navigateToHome() {
    this.navigate('/');
  }

  /**
   * Navega al login
   */
  navigateToLogin() {
    this.navigate('/login');
  }
}

// Instancia singleton del servicio
export const navigationService = new NavigationService();
