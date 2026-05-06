import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'

/**
 * Toggle switch component for settings with optional "coming soon" label
 */
const SettingToggle = ({
    label,
    value,
    onValueChange,
    disabled = false,
    comingSoon = false,
}) => {
    return (
        <View style={styles.optionRow}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
                {comingSoon && (
                    <Text style={styles.comingSoonLabel}>Coming Soon</Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={disabled ? () => {} : onValueChange}
                trackColor={{ false: '#E0E0E0', true: '#C4DCF2' }}
                thumbColor={
                    disabled ? '#BBBBBB' : value ? '#3D5CFF' : '#F5F5F5'
                }
                ios_backgroundColor="#E0E0E0"
                disabled={disabled}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#333333',
    },
    comingSoonLabel: {
        fontSize: 10,
        color: '#FF9500',
        fontWeight: '600',
        backgroundColor: '#FFF4E5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
        overflow: 'hidden',
    },
})

export default SettingToggle
