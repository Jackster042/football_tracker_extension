/**
 * Country Selection Modal Component
 * Bottom sheet modal for selecting countries
 * Based on design reference feed-video.png (middle screen)
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { theme } from '../../theme';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CountrySelectionModalProps {
  visible: boolean;
  selectedCountry?: string;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

const COUNTRIES: Country[] = [
  { code: 'GB-ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
];

export const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({
  visible,
  selectedCountry,
  onSelect,
  onClose,
}) => {
  const searchQuery = '';

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    onSelect(country);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>CHOOSE A COUNTRY</Text>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Country List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {filteredCountries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryItem,
                  selectedCountry === country.name && styles.countryItemSelected,
                ]}
                onPress={() => handleCountrySelect(country)}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.countryName}>{country.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay.heavy,
  },
  modalContent: {
    backgroundColor: theme.colors.background.elevated,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: theme.spacing[6],
    maxHeight: height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  title: {
    ...theme.typography.styles.h3,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  cancelButton: {
    padding: theme.spacing[2],
  },
  cancelText: {
    ...theme.typography.styles.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    gap: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  countryItemSelected: {
    backgroundColor: theme.colors.background.card,
  },
  flag: {
    fontSize: 24,
    width: 32,
  },
  countryName: {
    ...theme.typography.styles.body,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
});
