import { View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useFormik } from "formik";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";
import { userCtrl } from "../../../api";
import { useAuth } from "../../../hooks";
import { globalStyles } from "../../../styles";
import { ENV } from "../../../utils";
import { initialValues, validationSchema } from "./ChangeNameScreen.form";
import { styles } from "./ChangeNameScreen.styles";

export function ChangeNameScreen() {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(user.firstname, user.lastname),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      const startTime = Date.now();
      
      try {

        
        // Llamada al servidor
        const response = await userCtrl.update(user.id, formValue);
        
        // 🔍 LOG 4: Respuesta exitosa del servidor
        const endTime = Date.now();
        
        // Actualizar el estado local
        updateUser("firstname", formValue.firstname);
        updateUser("lastname", formValue.lastname);

        
        // Mostrar toast de éxito
        Toast.show("Nombre actualizado correctamente", {
          position: Toast.positions.CENTER,
          backgroundColor: "#4CAF50"
        });
        
        navigation.goBack();
        
      } catch (error) {
        // 🔍 LOG 5: Error detallado
        const endTime = Date.now();

        
        // Log específico del error de response
        if (error.status) {

          
          // Intentar leer el body del error
          try {
            const errorBody = await error.text();
            
            // Intentar parsear como JSON
            try {
              const errorJson = JSON.parse(errorBody);
            } catch (parseError) {
            }
          } catch (bodyError) {
          }
        }
        
        // Mostrar toast de error
        Toast.show("Error al actualizar los datos", {
          position: Toast.positions.CENTER,
          backgroundColor: "#F44336"
        });
        
      }
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        label="Nombre"
        style={globalStyles.form.input}
        onChangeText={(text) => {
          formik.setFieldValue("firstname", text);
        }}
        value={formik.values.firstname}
        error={formik.errors.firstname}
      />
      <TextInput
        label="Apellidos"
        style={globalStyles.form.input}
        onChangeText={(text) => {
          formik.setFieldValue("lastname", text);
        }}
        value={formik.values.lastname}
        error={formik.errors.lastname}
      />

      <Button
        mode="contained"
        style={globalStyles.form.btnSubmit}
        onPress={() => {
          formik.handleSubmit();
        }}
        loading={formik.isSubmitting}
      >
        Cambiar nombre y apellidos
      </Button>
    </View>
  );
}