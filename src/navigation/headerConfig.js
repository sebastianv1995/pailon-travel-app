// ✅ Configuración global de headers para mantener consistencia visual

export const globalHeaderOptions = {
  headerStyle: {
    backgroundColor: '#16222b', // ✅ Mismo color que SearchInput
    elevation: 0, // ✅ Sin sombra en Android
    shadowOpacity: 0, // ✅ Sin sombra en iOS
  },
  headerTintColor: '#fff', // ✅ Color del texto y iconos
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff', // ✅ Asegurar que el título sea blanco
  },
  headerBackTitleVisible: false, // ✅ Ocultar "Back" en iOS
  headerTitleAlign: 'center', // ✅ Centrar título
};

// ✅ Para casos específicos donde necesites un header diferente:
export const transparentHeaderOptions = {
  ...globalHeaderOptions,
  headerStyle: {
    ...globalHeaderOptions.headerStyle,
    backgroundColor: 'transparent',
  },
  headerTransparent: true,
};

// ✅ Para modals:
export const modalHeaderOptions = {
  ...globalHeaderOptions,
  presentation: 'modal',
  headerLeft: () => null, // ✅ Sin botón de back en modals
};