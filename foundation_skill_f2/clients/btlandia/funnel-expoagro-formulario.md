# BTLandia — Funnel Expo Agro 2027 con Formulario Instantáneo

> Rehace el funnel de la campaña `BTLandia_B2B_ExpoAgro`: el destino pasa de **WhatsApp Business** a **Formulario instantáneo de Meta**, con los leads cayendo en **Google Sheets** por integración nativa.
> Estado al 04/11/2026. Audiencia ya armada en Meta + 2 videos aprobados.

---

## 1. ¿Se puede nativo desde Meta? Sí

Meta tiene conector nativo de **Formularios instantáneos → Google Sheets**. Gratis, sin Zapier ni Make.

**Ruta:** Meta Business Suite → **Todas las herramientas** → **Formularios instantáneos** → pestaña **Configuración de CRM** (*CRM setup*) → **Google Sheets** → *Iniciar sesión con Google* → elegir planilla + formulario → guardar.

**Lo que hay que tener en cuenta:**

| Punto | Detalle |
|---|---|
| Granularidad | **Una integración por formulario, y cada una escribe en una sola hoja.** Si mañana hay un segundo formulario (ej. Kickoff), es otra integración. |
| Histórico | Entran **solo los leads nuevos** desde que se conecta. Lo anterior se baja por CSV desde el Centro de clientes potenciales. |
| Cuenta de Google | Usar **info@btlandia.com.ar**, igual que el criterio de HubSpot: la planilla no puede depender de la cuenta personal de nadie. |
| Permisos | Hace falta rol en la Página con **acceso a clientes potenciales** (*Lead Access*) además del permiso sobre la cuenta publicitaria. |
| Verificación | La ruta de menús la confirman varias fuentes de terceros (ene-2026 y dic-2024), **no la pude verificar contra la doc oficial de Meta** (la página de ayuda no renderiza por fetch). La UI en español puede nombrar distinto el menú. **Confirmar en pantalla al momento de configurar.** |

**Red de seguridad obligatoria:** mandar un **lead de prueba** y ver la fila aparecer antes de poner presupuesto. Y dejar siempre el CSV del Centro de clientes potenciales como respaldo: si la conexión se rompe (se renombra la planilla, se borra la pestaña, se revoca el acceso de Google), los leads **no se recuperan solos** en la hoja.

### Sheets y HubSpot no compiten

HubSpot Free ya está en el plan de BTLandia (alta con info@btlandia.com.ar, integración nativa con Meta Ads, USD 150 one-time ya facturado). La recomendación es **conectar los dos**:

- **Google Sheets** → la lista operativa del día. Celes la abre, llama, anota. Cero friccion.
- **HubSpot** → el pipeline. Negocios, etapas, valor estimado, los KPIs de `Tasa de conversión lead > propuesta` y `Pipeline generado` que ya están definidos en el Foundation.

Si hay que elegir uno solo para salir ya: **Sheets**, y HubSpot se engancha cuando el bot con Marce esté listo.

---

## 2. Estructura de la campaña

```
BTLandia_B2B_ExpoAgro_Leads                    ← Campaña · Objetivo: Clientes potenciales
└── Conjunto_Decisores_Agro                    ← Ad set · audiencia YA ARMADA
    ├── Anuncio_Video_EventoMasImportante_V1   ← aprobado
    └── Anuncio_Video_AlturaGrandesMarcas_V1   ← aprobado
```

### Campaña
- **Objetivo:** Clientes potenciales (*Lead generation*).
- **Ubicación del cliente potencial:** **Formularios instantáneos**. No "sitio web", no "WhatsApp", no "Messenger".
- **Presupuesto:** se mantiene USD $11,6/día (≈ USD $350/mes). Con un solo conjunto, presupuesto a nivel conjunto (ABO).
- **Nomenclatura UTM / naming:** `ree_btlandia_meta_leadgen_expoagro` (ya está en el estándar del Foundation).

### Conjunto de anuncios
- **Audiencia:** la guardada que ya está armada (cargos de decisor + tamaño de empresa + ciudades agro-ganaderas). **No rearmar.**
- **Advantage+ / expansión de segmentación:** **apagar** lo que se pueda apagar. Con USD 11,6/día y una audiencia B2B por cargo, la expansión se come la precisión y trae al productor agropecuario en vez del decisor de la empresa proveedora.
- **Ubicaciones:** manuales. Feed de Facebook e Instagram, Reels, Historias. **Excluir Audience Network** — es la fuente número uno de leads basura en formularios.
- **Optimización:** `Clientes potenciales`.

### Anuncios
- Los 2 videos aprobados, mismo conjunto, para que Meta reparta entre ellos.
- **Botón de CTA:** `Obtener presupuesto`. Es el que mejor matchea con "definimos espacio, diseño y presupuesto".
- **Copy:** hay que reescribir los `copyAnuncio`. Hoy los dos cierran con *"Escribinos por WhatsApp"* y el destino ya no es WhatsApp. Ver sección 4.

---

## 3. El formulario instantáneo

**Nombre:** `FORM_ExpoAgro2027_Presupuesto_Stand_v1`

**Tipo: Mayor intención** (*Higher intent*), no "Más volumen". Agrega una pantalla de revisión antes de enviar. Baja el volumen y sube la calidad — que es exactamente lo que necesita un ticket de stand en Expo Agro.

### Pantalla de introducción
> **Tu marca en Expo Agro 2027**
> Contanos de tu empresa y te armamos una propuesta de stand con espacio, diseño y presupuesto. Producimos en el agro desde 2003.
> *Si hay detalle, está BTLandia.*

### Preguntas

Orden: **primero las de calificación, después los datos de contacto.** Al revés, el que solo curiosea manda los datos y corta.

1. **¿Qué vende tu empresa al campo?**
   - Maquinaria e implementos
   - Semillas, fertilizantes y fitosanitarios
   - Agtech, software o drones
   - Servicios (logística, financieros, seguros)
   - Otro

2. **¿Ya expusieron en Expo Agro antes?**
   - Sí, con stand propio
   - Sí, compartido o dentro del stand de un tercero
   - No, sería la primera vez

3. **¿Qué tamaño de espacio tienen en mente?**
   - Hasta 50 m²
   - Entre 50 y 100 m²
   - Más de 100 m²
   - No sé, necesito asesoramiento

   > *Variante agresiva:* reemplazar por rango de presupuesto (`Menos de USD 15.000 / USD 15.000–40.000 / Más de USD 40.000 / Necesito orientación`). Califica más fuerte pero tira abajo la tasa de completado. Arrancar con m² y evaluar en la semana 2.

4. **¿Para cuándo necesitan definir el stand?**
   - Este mes
   - Antes de fin de año
   - Primer trimestre 2027
   - Todavía no sabemos

5. **¿Cuál es tu rol en la empresa?**
   - Dueño o socio
   - Director o Gerente de Marketing
   - Gerente Comercial
   - Brand Manager
   - Otro

6. **Datos de contacto** (Meta los prellena):
   - Nombre y apellido
   - Email corporativo
   - Teléfono / WhatsApp
   - **Nombre de la empresa** (respuesta corta, no la prellena Meta)

### Pantalla de agradecimiento
> **Recibimos tu consulta.**
> Te escribimos por WhatsApp dentro de las próximas 24 horas hábiles con los próximos pasos.
>
> **Botón: "Hablar ahora por WhatsApp"** → link `wa.me` de BTLandia

Ese botón es la jugada importante: **recupera el funnel de WhatsApp arriba del formulario.** El lead tibio queda en la planilla para que Celes lo trabaje; el lead caliente se abre WhatsApp solo y entra directo a la conversación.

### Requisitos que hay que tener listos antes de publicar
- **URL de política de privacidad de BTLandia.** Meta no deja publicar un formulario sin eso. Si no existe, hay que crear la página — es bloqueante.
- **Parámetros de seguimiento** del formulario: `campana=expoagro2027`. Sirve para separar si después hay un segundo formulario escribiendo a otra hoja.
- **Idioma:** español.

---

## 4. Copies a reescribir

Los dos videos aprobados cierran en voz en off con *"contactanos que te ayudamos"*, que es agnóstico de canal — eso se puede dejar. Lo que hay que cambiar es el **copy del anuncio**, que hoy dice explícitamente WhatsApp.

**Anuncio_Video_EventoMasImportante_V1**
```
Se viene el evento más importante del 2027, Expo Agro 🌾

🤔 ¿Querés que tu marca esté ahí pero no sabés por dónde empezar?
✅ Hacemos stands en Expo Agro desde el 2003.
🤝 Te acompañamos desde el inicio hasta el final del evento.

👉 Completá el formulario y te armamos la propuesta: espacio, diseño y presupuesto.

Si hay detalle, está BTLandia.
```

**Anuncio_Video_AlturaGrandesMarcas_V1**
```
¿Tu empresa se dedica al rubro Agro? 🌾

👥 Tu público te espera en Expo Agro 2027.
🏆 Es el evento de las grandes marcas... y para estar ahí, tu stand tiene que estar a la altura.
📐 Definimos juntos el espacio, el diseño y el presupuesto.

👉 Completá el formulario y te mandamos la propuesta para tu marca.

Si hay detalle, está BTLandia.
```

### ⚠️ A verificar en los masters aprobados
Los guiones de los dos videos marcan en el tramo de CTA una *"placa con texto grande y **botón de WhatsApp**"*. Si los videos renderizados muestran ese botón en pantalla, hay contradicción con el destino formulario. Dos salidas:

- **A —** Re-exportar solo los últimos 2 segundos con placa "Completá el formulario". Es un cambio de placa, no de edición.
- **B —** Dejar la placa de WhatsApp como está y apoyarse en el botón de WhatsApp de la pantalla de agradecimiento. El usuario ve WhatsApp en el video, completa el formulario y termina en WhatsApp igual. Coherente, y no toca los masters.

**Recomendación: B** para salir ya, y A cuando se produzca la siguiente tanda.

---

## 5. Configuración de la planilla

1. Crear la planilla **"BTLandia — Leads Expo Agro 2027"** desde `info@btlandia.com.ar`.
2. Conectar por `Configuración de CRM` (sección 1).
3. **Mandar un lead de prueba y confirmar la fila.** Antes de gastar un peso.
4. **Dos pestañas, no una:**
   - `leads_meta` → la que escribe Meta. **Nadie la toca.** No renombrar la pestaña, no reordenar ni renombrar los encabezados, no insertar columnas en el medio. Cualquiera de esas cosas rompe la ingesta.
   - `trabajo` → la vista de Celes, con `=QUERY(leads_meta!A:Z; ...)` más sus columnas propias: `Estado` (Nuevo / Contactado / Calificado / No califica / Propuesta enviada), `Notas`, `Fecha de contacto`.
5. **Aviso por lead nuevo:** en la planilla, `Herramientas → Configuración de notificaciones → Se realizan cambios → Al instante`. Celes recibe un mail por cada lead sin depender de abrir nada.

---

## 6. KPIs y reglas de operación

| KPI | Objetivo | Fuente |
|---|---|---|
| Leads (formularios completados) | a validar semana 1 | Ads Manager |
| **CPL** | USD 6–12 (banda a validar) | Ads Manager |
| **Leads calificados** | 50%+ de los leads totales | Planilla, columna `Estado` |
| Tasa de completado del formulario | 15%+ de clics en el anuncio | Ads Manager |
| CTR | a validar semana 1 | Ads Manager |

> La banda de CPL es una estimación para calibrar, **no un compromiso**. Se cierra con los datos reales de la primera semana. El KPI que manda no es el lead crudo: es el **lead calificado**. Un formulario instantáneo siempre trae más volumen y menos calidad que WhatsApp — por eso el tipo "Mayor intención" y las 5 preguntas de calificación.

**Reglas de operación:**
- **SLA de respuesta: menos de 24 h hábiles, idealmente menos de 1 h.** El lead de formulario se enfría mucho más rápido que el que escribe por WhatsApp: no eligió hablar, solo dejó el dato.
- **Revisión semanal** de la columna `Estado`. Si los no-calificados pasan el 50%, sumar fricción: activar la variante de presupuesto en la pregunta 3, o endurecer la segmentación.
- **No editar el formulario después del primer lead.** Si hay que cambiar preguntas, duplicarlo como `_v2`, conectar la integración nueva y pausar el anterior.

---

## 7. Checklist de salida

- [ ] URL de política de privacidad de BTLandia disponible *(bloqueante)*
- [ ] Verificar si los masters aprobados muestran el botón de WhatsApp en pantalla → decidir A o B
- [ ] Planilla creada desde info@btlandia.com.ar con las dos pestañas
- [ ] Formulario `FORM_ExpoAgro2027_Presupuesto_Stand_v1` armado, tipo Mayor intención
- [ ] Integración Configuración de CRM → Google Sheets conectada
- [ ] **Lead de prueba enviado y fila confirmada en la planilla**
- [ ] Notificaciones al instante activadas en la planilla
- [ ] Campaña creada con ubicación = Formularios instantáneos
- [ ] Audience Network excluida
- [ ] Expansión de segmentación apagada
- [ ] Los 2 videos subidos con CTA `Obtener presupuesto` y los copies nuevos
- [ ] Acceso a clientes potenciales (Lead Access) confirmado para el equipo REE
- [ ] Decidido si HubSpot se conecta ahora o después del bot

---

## Fuentes

La integración nativa Instant Forms → Google Sheets está documentada en:
- [Meta Ads Instant Forms now has a native integration with Google Sheets — Tactic Lab](https://tacticlab.com.au/knowledge-base/meta-ads-instant-forms-now-has-a-native-integration-with-google-sheets)
- [Meta Introduces Direct Google Sheets Integration for Instant Forms — Marketing Auditor](https://www.marketingauditor.com/blog/meta-introduces-direct-google-sheets-integration-for-instant-forms-241695)
- [Facebook Lead Ads to Google Sheets: The Complete 2026 Guide — AdsUploader](https://adsuploader.com/blog/facebook-lead-ads-google-sheets)
- [Facebook Lead Ads Google Sheets Integration: 3 Ways — LeadSync](https://leadsync.me/blog/facebook-lead-ads-google-sheets/)
- [Meta enhances Instant Forms with Google Sheets integration — SwipeInsight](https://web.swipeinsight.app/posts/meta-enhances-instant-forms-with-google-sheets-integration-for-automated-lead-collection-13189)
- [Descarga o recupera los datos de tus clientes potenciales desde Meta — Centro de ayuda de Meta](https://www.facebook.com/business/help/734933888443065) *(no renderizó por fetch; confirmar la ruta de menús en pantalla)*
