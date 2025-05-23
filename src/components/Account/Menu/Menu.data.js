import { screensName } from "../../../utils";

export const accountMenu = [
  {
    title: "Cambiar nombre y apellidos",
    description: "Cambiar nombre de tu cuenta",
    leftIcon: "emoticon-excited-outline",
    screen: screensName.account.changeName,
  },
  {
    title: "Cambiar nombre de usuario",
    description: "Cambiar nombre de usuario de tu cuenta",
    leftIcon: "card-account-details-outline",
    screen: screensName.account.changeUsername,
  },
  {
    title: "Cambiar contraseña",
    description: "Cambiar la contraseña de tu cuenta",
    leftIcon: "key-outline",
    screen: screensName.account.changePassword,
  },
];

export const apptMenu = [
  {
    title: "Lista de reservas",
    description: "Lista de todas tus reservas",
    leftIcon: "order-bool-descending-variant",
    screen: screensName.account.orders,
  },
];
