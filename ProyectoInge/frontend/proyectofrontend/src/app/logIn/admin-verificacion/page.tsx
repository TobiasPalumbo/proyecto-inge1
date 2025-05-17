import VerificacionCodigo from "../../../components/verificacion-admin";

export default function VerificacionAdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <VerificacionCodigo />
      </div>
    </div>
  );
}