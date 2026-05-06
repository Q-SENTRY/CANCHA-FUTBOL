USE canchafutbol;

-- Garantiza que ON DUPLICATE KEY UPDATE funcione correctamente en tokens_recuperacion.
-- Sin esta restricción, cada solicitud de recuperación acumulaba filas y el token
-- anterior no quedaba invalidado.
ALTER TABLE tokens_recuperacion
  ADD UNIQUE KEY uq_usuario (usuario_id);
