import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    children?: React.ReactNode;
    style?: ViewStyle;
    isLuxe?: boolean;
    className?: string; // Add this for NativeWind support
}

import { cssInterop } from 'nativewind';

const StyledLinearGradient = cssInterop(LinearGradient, {
    className: 'style'
});

export const UrkioGradient = ({ children, style, isLuxe }: Props) => {
    const calmColors = ['#f8f9ff', '#e0e7ff', '#f8f9ff'] as const;
    const luxeColors = ['#0a0a24', '#1a1a40', '#0a0a24'] as const;

    return (
        <StyledLinearGradient
            colors={isLuxe ? luxeColors : calmColors}
            style={[
                styles.container,
                style,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Aurora Effects */}
            <View style={styles.auroraContainer}>
                <View style={[styles.aurora, { top: '-10%', left: '-10%', backgroundColor: '#d946ef', transform: [{ scale: 2 }], opacity: isLuxe ? 0.08 : 0.05 }]} />
                <View style={[styles.aurora, { bottom: '-10%', right: '-10%', backgroundColor: '#135bec', transform: [{ scale: 2 }], opacity: isLuxe ? 0.08 : 0.05 }]} />
            </View>
            {children}
        </StyledLinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    auroraContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    aurora: {
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: 300,
        filter: 'blur(100px)', // Uses CSS blur on web
    },
});

export default UrkioGradient;
