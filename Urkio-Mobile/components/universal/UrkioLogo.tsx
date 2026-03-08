import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G, Filter, FeGaussianBlur, FeOffset, FeColorMatrix } from 'react-native-svg';

interface UrkioLogoProps {
    size?: number;
    variant?: 'calm' | 'luxe';
}

export const UrkioLogo: React.FC<UrkioLogoProps> = ({ size = 100, variant = 'calm' }) => {
    const primaryColor = variant === 'luxe' ? '#A855F7' : '#6366F1';
    const secondaryColor = variant === 'luxe' ? '#6366F1' : '#A855F7';

    return (
        <View style={[styles.container, { width: size, height: size * 1.2 }]}>
            <Svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none">
                <Defs>
                    <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={primaryColor} />
                        <Stop offset="100%" stopColor={secondaryColor} />
                    </LinearGradient>

                    <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="white" stopOpacity="0.8" />
                        <Stop offset="50%" stopColor="white" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="white" stopOpacity="0.4" />
                    </LinearGradient>

                    {/* Shadow/Glow Filter */}
                    <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <FeGaussianBlur in="SourceAlpha" stdDeviation="5" />
                        <FeOffset dx="0" dy="4" result="offsetblur" />
                        <FeColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.3 0" />
                    </Filter>
                </Defs>

                {/* Outer Glow / Shadow */}
                <G filter="url(#shadow)">
                    <Path
                        d="M25 20V80C25 93.8071 36.1929 105 50 105C63.8071 105 75 93.8071 75 80V20"
                        stroke="url(#logoGrad)"
                        strokeWidth="28"
                        strokeLinecap="round"
                    />
                </G>

                {/* Standard Base Path */}
                <Path
                    d="M25 20V80C25 93.8071 36.1929 105 50 105C63.8071 105 75 93.8071 75 80V20"
                    stroke="url(#logoGrad)"
                    strokeWidth="24"
                    strokeLinecap="round"
                />

                {/* Glass Effect Overlay */}
                <Path
                    d="M25 20V80C25 93.8071 36.1929 105 50 105C63.8071 105 75 93.8071 75 80V20"
                    stroke="url(#glassGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                />

                {/* Inner Highlight (The 3D feel) */}
                <Path
                    d="M38 25V80C38 86.6274 43.3726 92 50 92C56.6274 92 62 86.6274 62 80V25"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeOpacity="0.3"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
});
