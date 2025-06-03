import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const TimeSlotSelector = ({ 
  schedule,
  selectedDateTime,
  onTimeSelected 
}) => {
  
  // 🔍 FUNCIÓN PARA CREAR FECHA SIN TIMEZONE ISSUES
  const createLocalDateTime = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    
    // ✅ Crear fecha base en la zona horaria local
    const newDate = new Date(selectedDateTime);
    
    // ✅ Establecer hora específica sin conversión UTC
    newDate.setHours(hours, minutes, 0, 0);
    
    console.log('🕐 Horario seleccionado:', {
      timeSlot,
      localDate: newDate.toLocaleString(),
      hours: newDate.getHours(),
      minutes: newDate.getMinutes(),
      isoString: newDate.toISOString()
    });
    
    return newDate;
  };

  const getButtonStyle = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const isSelected = 
      selectedDateTime.getHours() === hours &&
      selectedDateTime.getMinutes() === minutes;

    return {
      ...styles.timeButton,
      backgroundColor: isSelected ? '#3498db' : '#ffffff',
      borderColor: isSelected ? '#3498db' : '#e0e0e0',
      borderWidth: 2,
    };
  };

  const getTextStyle = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const isSelected = 
      selectedDateTime.getHours() === hours &&
      selectedDateTime.getMinutes() === minutes;

    return {
      ...styles.timeText,
      color: isSelected ? '#ffffff' : '#000000',
      fontWeight: isSelected ? 'bold' : '500',
    };
  };

  const handleTimeSelection = (timeSlot) => {
    console.log('🎯 Seleccionando horario:', timeSlot);
    
    const newDateTime = createLocalDateTime(timeSlot);
    
    console.log('📅 Nueva fecha y hora:', {
      original: selectedDateTime.toLocaleString(),
      new: newDateTime.toLocaleString(),
      timeSlot
    });
    
    onTimeSelected(newDateTime);
  };

  // 🔍 LOG para debugging
  console.log('⏰ TimeSlotSelector - Estado actual:', {
    scheduleCount: schedule?.length || 0,
    selectedHour: selectedDateTime.getHours(),
    selectedMinute: selectedDateTime.getMinutes(),
    selectedDateString: selectedDateTime.toLocaleString()
  });

  if (!schedule || schedule.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Horarios disponibles:</Text>
        <View style={styles.noScheduleContainer}>
          <Text style={styles.noScheduleText}>
            No hay horarios disponibles para esta fecha
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horarios disponibles:</Text>
      
      {/* 🔍 DEBUG INFO (remover en producción) */}
      <Text style={styles.debugText}>
        Fecha seleccionada: {selectedDateTime.toLocaleDateString()} - 
        Hora actual: {selectedDateTime.getHours()}:{selectedDateTime.getMinutes().toString().padStart(2, '0')}
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.buttonContainer}>
          {schedule.map((timeSlot, index) => (
            <TouchableOpacity
              key={`${timeSlot}-${index}`}
              style={getButtonStyle(timeSlot)}
              onPress={() => handleTimeSelection(timeSlot)}
            >
              <Text style={getTextStyle(timeSlot)}>
                {timeSlot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noScheduleContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  noScheduleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});

export default TimeSlotSelector;