// Contenido estatico: instrucciones paso a paso para el CLIENTE.
// Perspectiva del cliente (no del equipo REE).
// Se usa en onboarding-renderer.ts.

export interface ClientGuideSection {
  id: string;
  titulo: string;
  pasos: string[];
}

export const CREAR_FACEBOOK_PAGE: ClientGuideSection = {
  id: "crear-facebook-page",
  titulo: "Crear tu Facebook Page",
  pasos: [
    "Entra a facebook.com con tu cuenta personal.",
    "En el menu lateral, anda a Pages (Paginas) y hace clic en 'Crear nueva pagina'.",
    "Nombre: usa el nombre de tu marca (ej: 'Defu - The Tofu Co.').",
    "Categoria: elegi la que mejor describa tu negocio.",
    "Completa la info basica: descripcion, direccion, telefono, sitio web.",
    "Subi tu logo como foto de perfil y una imagen representativa como foto de portada.",
    "Publica al menos 1 post para que la pagina quede activa.",
    "Agrega a growth@reecreativos.com como administrador: Configuracion > Roles de la pagina > Agregar.",
  ],
};

export const VINCULAR_INSTAGRAM: ClientGuideSection = {
  id: "vincular-instagram",
  titulo: "Vincular Instagram a tu Page",
  pasos: [
    "Abri Instagram y anda a Configuracion > Cuenta.",
    "Si tu cuenta es Personal, convertila a Profesional (Business): Configuracion > Cuenta > Cambiar a cuenta profesional.",
    "Una vez que sea Business, anda a Cuentas vinculadas > Facebook.",
    "Selecciona la Facebook Page que acabas de crear y vinculala.",
  ],
};

export const TARJETA_DE_PAGO: ClientGuideSection = {
  id: "tarjeta-de-pago",
  titulo: "Tu tarjeta de pago",
  pasos: [
    "Meta te va a pedir una tarjeta de credito o debito cuando configuremos tu cuenta publicitaria.",
    "Si tu tarjeta es en pesos argentinos, Meta cobra impuesto PAIS (~30% adicional sobre el gasto en USD).",
    "Recomendamos usar una tarjeta internacional en USD para evitar ese recargo.",
    "El gasto de pauta se debita directo de tu cuenta. REE no maneja tu plata de ads.",
    "Podes ver cuanto se gasto en cualquier momento desde el dashboard de Meta.",
  ],
};

export const CLIENT_GUIDES = [CREAR_FACEBOOK_PAGE, VINCULAR_INSTAGRAM, TARJETA_DE_PAGO] as const;
