// Contenido estatico: instrucciones paso a paso para Meta Business setup.
// Se embebe en el HTML cuando los checklist items estan en "pendiente".
// NO es generado por Claude cada vez.

export interface GuideSection {
  id: string;
  titulo: string;
  pasos: string[];
}

export const META_BUSINESS_GUIDE: GuideSection[] = [
  {
    id: "business-portfolio",
    titulo: "Business Portfolio",
    pasos: [
      "Iniciar sesion en business.facebook.com con growth@reecreativos.com.",
      "Ir a Configuracion del negocio > Informacion del negocio.",
      "Si no existe un Business Portfolio, crear uno con nombre: 'REE Growth'.",
      "Completar datos de empresa: razon social, direccion, sitio web de REE.",
      "Verificar dominio si Meta lo solicita (DNS TXT record).",
      "Agregar miembros del equipo REE como administradores del portfolio.",
    ],
  },
  {
    id: "facebook-page-sin-page",
    titulo: "Facebook Page (cliente SIN Page existente)",
    pasos: [
      "Desde el Business Portfolio de growth@reecreativos.com, crear una nueva Facebook Page.",
      "Nombre de la Page: usar el nombre comercial del cliente (ej: 'Defu - The Tofu Co.').",
      "Categoria: seleccionar la mas relevante para la industria del cliente.",
      "Completar informacion basica: descripcion, direccion, telefono, sitio web del cliente.",
      "Subir foto de perfil (logo del cliente) y foto de portada (brand asset del cliente).",
      "Agregar al cliente como editor o administrador de la Page segun corresponda.",
      "Publicar al menos 1 post inicial para que la Page quede activa antes de lanzar ads.",
    ],
  },
  {
    id: "facebook-page-con-page",
    titulo: "Facebook Page (cliente CON Page existente)",
    pasos: [
      "Solicitar al cliente acceso de administrador a su Facebook Page existente.",
      "El cliente debe ir a su Page > Configuracion > Roles de la pagina > Agregar growth@reecreativos.com como administrador.",
      "Una vez aceptada la invitacion, vincular la Page al Business Portfolio de growth@.",
      "Ir a Configuracion del negocio > Cuentas > Pages > Agregar > Solicitar acceso a una Page.",
      "Verificar que la Page aparezca bajo el portfolio de growth@ con permisos completos.",
    ],
  },
  {
    id: "instagram-business",
    titulo: "Instagram Business",
    pasos: [
      "Verificar que la cuenta de Instagram del cliente sea de tipo Business o Creator.",
      "Si es cuenta Personal, el cliente debe convertirla: Configuracion > Cuenta > Cambiar a cuenta profesional.",
      "Vincular la cuenta de Instagram a la Facebook Page del cliente (desde la app de Instagram: Configuracion > Cuenta > Cuentas vinculadas > Facebook).",
      "Desde el Business Portfolio de growth@, ir a Cuentas > Instagram > Agregar > Vincular cuenta de Instagram.",
      "Verificar que la cuenta de Instagram aparezca vinculada en el portfolio.",
    ],
  },
  {
    id: "ad-account",
    titulo: "Ad Account (Cuenta Publicitaria)",
    pasos: [
      "Desde el Business Portfolio de growth@, ir a Cuentas > Cuentas publicitarias > Agregar > Crear nueva cuenta.",
      "Nombre de la cuenta: '{NombreCliente} - Ad Account' (ej: 'Defu - Ad Account').",
      "Timezone: seleccionar la zona horaria del cliente (ej: America/Buenos_Aires).",
      "Moneda: seleccionar la moneda local del cliente (ej: ARS).",
      "Metodo de pago: agregar la tarjeta de credito/debito del CLIENTE directamente en Meta.",
      "La pauta se paga con la tarjeta del cliente directo en Meta. REE no cobra porcentaje sobre ad spend.",
      "Asignar la Facebook Page y la cuenta de Instagram a la cuenta publicitaria.",
      "Agregar miembros del equipo REE con rol de Anunciante en la cuenta.",
    ],
  },
  {
    id: "pixel",
    titulo: "Pixel de Meta",
    pasos: [
      "Desde el Business Portfolio de growth@, ir a Origenes de datos > Pixeles > Agregar.",
      "Nombre del Pixel: '{NombreCliente} - Pixel' (ej: 'Defu - Pixel').",
      "Copiar el codigo base del Pixel.",
      "Instalar el Pixel en el sitio web del cliente (en el <head> de todas las paginas).",
      "Si el cliente usa Tienda Nube, WordPress, Shopify u otra plataforma, buscar la integracion nativa.",
      "Configurar eventos estandar: PageView (automatico), ViewContent, AddToCart, Purchase, Lead.",
      "Usar la extension 'Meta Pixel Helper' en Chrome para verificar que los eventos disparen correctamente.",
      "Enviar trafico de prueba y verificar en Events Manager que los eventos lleguen.",
    ],
  },
  {
    id: "capi",
    titulo: "Conversions API (CAPI)",
    pasos: [
      "Ir a Events Manager > Origenes de datos > seleccionar el Pixel del cliente.",
      "Ir a Configuracion > Conversions API.",
      "Si la plataforma del cliente tiene integracion nativa (Shopify, WooCommerce), activarla desde ahi.",
      "Si no hay integracion nativa, configurar CAPI via Gateway o integracion server-side custom.",
      "Verificar deduplicacion de eventos: el event_id debe coincidir entre Pixel (browser) y CAPI (server).",
      "Testear con la herramienta de Test Events en Events Manager.",
      "Verificar que el Event Match Quality score sea al menos 'Good' (6+/10).",
    ],
  },
];

export const NOTA_PAUTA = "La pauta se paga con la tarjeta del cliente directo en Meta. REE no cobra porcentaje sobre ad spend.";
