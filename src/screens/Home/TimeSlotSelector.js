import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const TimeSlotSelector = ({ 
  schedule,
  selectedDateTime,
  onTimeSelected 
}) => {
  const getButtonStyle = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':');
    const isSelected = 
      selectedDateTime.getHours() === parseInt(hours) &&
      selectedDateTime.getMinutes() === parseInt(minutes);

    return {
      ...styles.timeButton,
      backgroundColor: isSelected ? '#3498db' : '#ffffff',
    };
  };

  const getTextStyle = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':');
    const isSelected = 
      selectedDateTime.getHours() === parseInt(hours) &&
      selectedDateTime.getMinutes() === parseInt(minutes);

    return {
      ...styles.timeText,
      color: isSelected ? '#ffffff' : '#000000',
    };
  };

  const handleTimeSelection = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(':');
    const newDate = new Date(selectedDateTime);
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    onTimeSelected(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horarios disponibles:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.buttonContainer}>
          {schedule.map((timeSlot, index) => (
            <TouchableOpacity
              key={index}
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
  },
  scrollView: {
    flexGrow: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default TimeSlotSelector;