import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Trusted Contacts',
    description: 'Add your closest friends and family to your emergency network.',
    icon: 'account-multiple-plus',
    color: '#E53935',
  },
  {
    id: '2',
    title: 'Instant SOS',
    description: 'One tap to send emergency alerts with your precise location.',
    icon: 'bullseye-arrow',
    color: '#FFC107',
  },
  {
    id: '3',
    title: 'Works Offline',
    description: 'Safety features and medical info are available without internet.',
    icon: 'wifi-off',
    color: '#4CAF50',
  },
];

export default function OnboardingScreen({ navigation }) {
  const theme = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex !== slides.length) {
      const offset = nextSlideIndex * width;
      flatListRef?.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    navigation.replace('Register');
  };

  const Slide = ({ item }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={item.icon} size={140} color={item.color} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="headlineLarge" style={styles.title}>{item.title}</Text>
          <Text variant="bodyLarge" style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled={true}
        data={slides}
        contentContainerStyle={{ height: height * 0.75 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Slide item={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index ? {
                  backgroundColor: theme.colors.primary,
                  width: 30,
                } : null,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentSlideIndex === slides.length - 1 ? (
            <Button
              mode="contained"
              onPress={skip}
              style={styles.getStartedButton}
              labelStyle={styles.buttonLabel}
            >
              Get Started
            </Button>
          ) : (
            <View style={styles.row}>
              <Button mode="text" onPress={skip} textColor={theme.colors.outline}>
                Skip
              </Button>
              <Button mode="contained" onPress={goNextSlide} style={styles.nextButton}>
                Next
              </Button>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    color: '#757575',
    lineHeight: 24,
  },
  footer: {
    height: height * 0.25,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 8,
    width: 10,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedButton: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 16,
  },
  nextButton: {
    height: 56,
    width: 120,
    justifyContent: 'center',
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
