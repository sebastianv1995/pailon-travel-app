import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AccountScreen,
  ChangeNameScreen,
  ChangeEmailScreen,
  ChangeUsernameScreen,
  ChangePasswordScreen,
  OrderScreen,
  OrdersScreen,
} from "../../screens/Account";
import { screensName } from "../../utils";
import { globalHeaderOptions, modalHeaderOptions } from "../headerConfig";

const Stack = createNativeStackNavigator();

export function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={globalHeaderOptions} // ✅ Aplicar estilos globales
    >
      <Stack.Screen
        name={screensName.account.account}
        component={AccountScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={screensName.account.changeName}
        component={ChangeNameScreen}
        options={{ 
          title: "Cambiar nombre y apellido",
        }}
      />

      <Stack.Screen
        name={screensName.account.changeEmail}
        component={ChangeEmailScreen}
        options={{ 
          title: "Cambiar correo electrónico",
        }}
      />

      <Stack.Screen
        name={screensName.account.changeUsername}
        component={ChangeUsernameScreen}
        options={{ 
          title: "Cambiar nombre de usuario",
        }}
      />

      <Stack.Screen
        name={screensName.account.changePassword}
        component={ChangePasswordScreen}
        options={{ 
          title: "Cambiar contraseña",
        }}
      />

      <Stack.Screen
        name={screensName.account.orders}
        component={OrdersScreen}
        options={{ 
          title: "Mis Reservas",
        }}
      />

      <Stack.Screen
        name={screensName.account.order}
        component={OrderScreen}
        options={{ 
          ...modalHeaderOptions, // ✅ Usar configuración de modal
          title: "Detalles de la Reserva",
        }}
      />
    </Stack.Navigator>
  );
}