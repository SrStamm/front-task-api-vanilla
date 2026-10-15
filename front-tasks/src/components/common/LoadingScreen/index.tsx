import "./LoadingScreen.css";

/**
 * Pantalla de carga a viewport completo, centrada en ambos ejes.
 * Se usa fuera de DashboardLayout/AuthLayout, cuando aún no existe
 * ningún contenedor con ancho de pantalla.
 */
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <p>Cargando...</p>
    </div>
  );
}

export default LoadingScreen;
