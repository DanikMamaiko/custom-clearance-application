package com.customs.customClearance.service;

import org.springframework.stereotype.Component;

@Component
public class LegalEntityPetrol {
    double clearanceCost = 0;

    double upTo3Years(double volume, double cost) {
        clearanceCost = (volume <= 1000) ?
            0.3 * cost > 1.2 * volume ? 0.3 * cost : 1.2 * volume
            : (volume <= 1500) ?
            0.3 * cost > 1.45 * volume ? 0.3 * cost : 1.45 * volume
            : (volume <= 1800) ?
            0.3 * cost > 1.5 * volume ? 0.3 * cost : 1.5 * volume
            : (volume <= 3000) ?
            0.3 * cost > 2.15 * volume ? 0.3 * cost : 2.15 * volume
            : 0.3 * cost > 2.8 * volume ? 0.3 * cost : 2.8 * volume;

        return clearanceCost;
    }

    double from3To5Years(double volume, double cost) {
        clearanceCost = (volume <= 1000) ?
            0.35 * cost > 1.2 * volume ? 0.35 * cost : 1.2 * volume
            : (volume <= 1500) ?
            0.35 * cost > 1.45 * volume ? 0.35 * cost : 1.45 * volume
            : (volume <= 1800) ?
            0.35 * cost > 1.5 * volume ? 0.35 * cost : 1.5 * volume
            : (volume <= 3000) ?
            0.35 * cost > 2.15 * volume ? 0.35 * cost : 2.15 * volume
            : 0.35 * cost > 2.8 * volume ? 0.35 * cost : 2.8 * volume;

        return clearanceCost;
    }

    double after5Years(double volume) {
        clearanceCost = (volume <= 1000) ? 2.5 * volume
            : (volume <= 1500) ? 2.7 * volume
            : (volume <= 1800) ? 2.9 * volume
            : (volume <= 3000) ? 4.0 * volume
            : 5.8 * volume;

        return clearanceCost;
    }
}
