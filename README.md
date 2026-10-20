# Verbalia

App móvil (iOS y Android) para ampliar vocabulario en inglés, español y francés con tarjetas, repetición espaciada y rachas diarias.

## Qué incluye esta primera versión

- Elección de idioma propio, idioma a aprender y nivel (A1, A2, B1). La interfaz se muestra en el idioma propio.
- 132 palabras de muestra con frase de ejemplo en los tres idiomas, en 10 temas.
- Sesión diaria: repasos pendientes y 7 palabras nuevas (ajustable), con cuatro tipos de ejercicio: presentación de la palabra, opción múltiple en ambos sentidos, escuchar y elegir, y escribir la palabra.
- Repetición espaciada basada en SM-2: un acierto aleja el próximo repaso y un error lo trae de vuelta al día siguiente. Una palabra se considera dominada cuando su repaso queda a 21 días o más.
- Rachas con protectores: se gana uno cada 7 días seguidos (máximo 2) y cada uno cubre un día perdido.
- Pantallas de progreso por nivel y tema, y de ajustes.
- Todo funciona sin conexión; el progreso se guarda en el teléfono.

Pendiente: anuncios (AdMob) y compra Pro de por vida (RevenueCat) están preparados en `src/monetization` pero no conectados, porque requieren las cuentas de Apple, Google y AdMob.

## Cómo probarla

Requisitos: Node 22 y la app Expo Go en el teléfono.

```bash
npm install
npx expo start
```

Escanea el código QR con Expo Go (Android) o con la cámara (iPhone).

## Comprobaciones

```bash
npm test           # lógica: repetición espaciada, rachas, respuestas, sesiones
npm run typecheck
```

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/app` | Pantallas (Expo Router): inicio, configuración inicial, sesión, niveles, ajustes |
| `src/content` | Modelo de contenido y palabras. Un concepto existe una vez; cada idioma añade su palabra |
| `src/srs` | Repetición espaciada y rachas |
| `src/exercises` | Armado de sesiones y corrección de respuestas |
| `src/i18n` | Textos de la interfaz en cada idioma |
| `src/state` | Estado de la app y guardado en el teléfono |
| `src/monetization` | Anuncios y compra Pro (por conectar) |

Para añadir un idioma: agregar su código en `src/content/types.ts`, su columna en `src/content/concepts.ts` y sus textos en `src/i18n/strings.ts`. TypeScript señala lo que falte.
