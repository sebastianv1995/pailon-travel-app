import { useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { IconButton } from "react-native-paper";
import { forEach } from "lodash";
import DateTimePicker from "@react-native-community/datetimepicker";
import { productCtrl } from "../../api";
import { Layout } from "../../layouts";
import { LoadingScreen, Separator } from "../../components/Shared";
import { Product } from "../../components/Product";
import TimeSlotSelector from "./TimeSlotSelector";
import { styles } from "./ProductScreen.styles";

// conf calendario en español
const locale = {
  name: "es",
  config: {
    months:
      "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
        "_"
      ),
    monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
    weekdays: "Domingo_Lunes_Martes_MiÃ©rcoles_Jueves_Viernes_SÃ¡bado".split(
      "_"
    ),
    weekdaysShort: "Dom_Lun_Mar_MiÃ©_Jue_Vie_SÃ¡b".split("_"),
  },
};

export function ProductScreen(props) {
  const {
    route: { params },
  } = props;
  const productId = params.productId;

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({
    date: false,
    time: false,
  });

  // Estados para validación
  const [isReservationValid, setIsReservationValid] = useState(false);
  const [hasSelectedTimeSlot, setHasSelectedTimeSlot] = useState(false);

  useEffect(() => {
    getProduct();
  }, [productId]);

  // useEffect para validar cuando cambien los datos relevantes
  useEffect(() => {
    validateReservation();
  }, [selectedDateTime, hasSelectedTimeSlot, schedule]);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = locale.config.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  // 🔧 FUNCIÓN CORREGIDA PARA CREAR FECHA LOCAL SIN TIMEZONE ISSUES
  const createLocalDateTimeString = (dateTime) => {
    // ✅ Crear string en formato local sin conversión UTC
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    
    // ✅ Formato: YYYY-MM-DDTHH:mm:ss (sin timezone)
    const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    
    console.log('📅 Creando fecha local:', {
      original: dateTime.toLocaleString(),
      localString: localDateTimeString,
      isoString: dateTime.toISOString()
    });
    
    return localDateTimeString;
  };

  // 🔧 FUNCIÓN MEJORADA PARA VALIDAR RESERVA
  const validateReservation = () => {
    const now = new Date();
    const selectedDate = new Date(selectedDateTime);

    // ✅ Validar que la fecha sea futura (considerando zona horaria local)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    const isFutureDate = selectedDateOnly >= today;

    // ✅ Para el día actual, validar que la hora también sea futura
    const isSameDay = selectedDateOnly.getTime() === today.getTime();
    const isFutureTime = isSameDay ? selectedDate > now : true;

    const hasScheduleData = schedule && schedule.length > 0;
    const hasTimeSlotSelected = hasSelectedTimeSlot;

    const isValid = isFutureDate && isFutureTime && hasScheduleData && hasTimeSlotSelected;

    console.log('✅ Validación de reserva:', {
      isFutureDate,
      isFutureTime,
      hasScheduleData,
      hasTimeSlotSelected,
      isValid,
      selectedDateTime: selectedDateTime.toLocaleString(),
      now: now.toLocaleString()
    });

    setIsReservationValid(isValid);
    return isValid;
  };

  // 🔧 FUNCIÓN CORREGIDA PARA MANEJAR CAMBIO DE FECHA EN DateTimePicker
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      console.log('📅 Fecha seleccionada del picker:', date.toLocaleString());
      
      // ✅ Crear nueva fecha manteniendo la hora previamente seleccionada
      const newDate = new Date(date);
      newDate.setHours(
        selectedDateTime.getHours(),
        selectedDateTime.getMinutes(),
        0,
        0
      );
      
      console.log('🕐 Nueva fecha con hora preservada:', newDate.toLocaleString());
      
      setSelectedDateTime(newDate);
      updateAvailableTimeSlots(newDate);
      
      // Reset time selection cuando cambia la fecha
      setHasSelectedTimeSlot(false);
    }
  };

  // 🔧 FUNCIÓN CORREGIDA PARA EL TimeSlotSelector
  const handleTimeSelection = (newDateTime) => {
    console.log('🎯 Hora seleccionada desde TimeSlotSelector:', {
      newDateTime: newDateTime.toLocaleString(),
      hours: newDateTime.getHours(),
      minutes: newDateTime.getMinutes()
    });
    
    setSelectedDateTime(newDateTime);
    setHasSelectedTimeSlot(true);
    validateDateTime();
  };

  const getProduct = async () => {
    try {
      const response = await productCtrl.getById(productId);
      const productData = response.data.attributes;
      setProduct({ ...response.data.attributes, id: response.data.id });

      const mainImage = response.data.attributes.main_image.data.attributes.url;
      const images = response.data.attributes.images.data;

      const arrayImages = [mainImage];
      forEach(images, (image) => {
        arrayImages.push(image.attributes.url);
      });
      setImages(arrayImages);

      //configuracion de horarios
      if (productData.schedule?.schedule) {
        setSchedule(productData.schedule.schedule);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función simplificada para actualizar horarios disponibles
  const updateAvailableTimeSlots = (selectedDateTime) => {
    const currentDate = new Date();

    if (new Date(selectedDateTime) < currentDate.setHours(0, 0, 0, 0)) {
      Alert.alert("Error", "No se puede seleccionar una fecha pasada.");
      setIsReservationValid(false);
      setHasSelectedTimeSlot(false);
      return;
    }

    // Simplificar: usar todos los horarios del schedule para la fecha seleccionada
    if (schedule && schedule.length > 0) {
      setAvailableTimeSlots(schedule);
    } else {
      setAvailableTimeSlots([]);
    }

    // Reset time selection when date changes
    setHasSelectedTimeSlot(false);
  };

  const validateDateTime = () => {
    let isValid = true;
    const newErrors = { date: false, time: false };
    const currentDate = new Date();

    if (selectedDateTime < new Date().setHours(0, 0, 0, 0)) {
      newErrors.date = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const renderDateTimePickers = () => (
    <View style={styles.dateTimeContainer}>
      <View style={styles.headerSection}>
        <IconButton
          icon="calendar-clock"
          size={24}
          iconColor="#0098d3"
          style={styles.headerIcon}
        />
        <Text style={styles.scheduleTitle}>Reserva tu aventura</Text>
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.sectionLabel}>Fecha del tour:</Text>
        <Pressable
          style={[
            styles.datePickerButton,
            errors.date && styles.datePickerButtonError,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <IconButton icon="calendar" size={20} iconColor="#0098d3" />
          <Text style={[styles.dateTimeText, errors.date && styles.errorText]}>
            {formatDate(selectedDateTime)}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDateTime}
            mode="date"
            onChange={handleDateChange} // ✅ Usar función corregida
            minimumDate={new Date()}
            locale="es-ES"
            textColor="black"
            display={Platform.OS === "ios" ? "spinner" : "default"}
          />
        )}

        <Text style={styles.sectionLabel}>Horarios disponibles:</Text>
        <TimeSlotSelector
          schedule={schedule}
          selectedDateTime={selectedDateTime}
          onTimeSelected={handleTimeSelection} // ✅ Usar función corregida
        />

        {/* Indicador visual de estado de validación */}
        {schedule && schedule.length > 0 && (
          <View style={styles.validationContainer}>
            {isReservationValid ? (
              <View style={styles.validationSuccess}>
                <IconButton icon="check-circle" size={20} iconColor="#4caf50" />
                <Text style={styles.validationSuccessText}>
                  ¡Reserva seleccionada para {formatDate(selectedDateTime)}!
                </Text>
              </View>
            ) : (
              <View style={styles.validationWarning}>
                <IconButton icon="clock-alert" size={20} iconColor="#ff9800" />
                <Text style={styles.validationWarningText}>
                  {!hasSelectedTimeSlot
                    ? "Selecciona un horario específico"
                    : "Selecciona fecha y horario válidos"}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Mensaje cuando no hay horarios en el schedule */}
        {(!schedule || schedule.length === 0) && (
          <View style={styles.validationWarning}>
            <IconButton icon="calendar-remove" size={20} iconColor="#ff5722" />
            <Text style={styles.validationWarningText}>
              No hay horarios configurados para este tour
            </Text>
          </View>
        )}
      </View>

      {errors.date && (
        <View style={styles.errorContainer}>
          <IconButton icon="alert-circle" size={20} iconColor="#ff4444" />
          <Text style={styles.errorMessage}>
            Por favor selecciona una fecha y hora válida
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Layout.Basic>
        {!product ? (
          <Text>test loading screen</Text>
        ) : (
          <ScrollView style={styles.mainContainer}>
            <Product.Title text={product.title} />
            <Product.CarouselImages images={images} />
            <View style={styles.container}>
              <View style={styles.priceSection}>
                <Product.Price
                  price={product.price}
                  discount={product.discount}
                />
              </View>
              <Separator height={20} />
              <View style={styles.characteristicsSection}>
                <View style={styles.headerSection}>
                  <IconButton
                    icon="information"
                    size={24}
                    iconColor="#0098d3"
                    style={styles.headerIcon}
                  />
                  <Text style={styles.sectionTitle}>Detalles del tour</Text>
                </View>
                <Product.Characteristics text={product.characteristics} />
              </View>
              <Separator height={20} />
              {renderDateTimePickers()}
              <Separator height={30} />
            </View>
          </ScrollView>
        )}
      </Layout.Basic>
      {product && (
        <Product.BottomBar
          productId={productId}
          data={{
            productId,
            date: createLocalDateTimeString(selectedDateTime), // ✅ Usar función sin timezone
          }}
          isValid={isReservationValid}
        />
      )}
    </>
  );
}
