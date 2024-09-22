package com.customs.customClearance.service;

import org.springframework.stereotype.Component;

@Component
public class PhysicalEntity {
    double clearanceCost = 0;

    double upTo3Years(double volume, double cost) {
        clearanceCost = (cost <= 8500) ?
            0.54 * cost > 2.5 * volume ? 0.54 * cost : 2.5 * volume
            : (cost <= 16700) ?
            0.48 * cost > 3.5 * volume ? 0.48 * cost : 3.5 * volume
            : (cost <= 42300) ?
            0.48 * cost > 5.5 * volume ? 0.48 * cost : 5.5 * volume
            : (cost <= 84500) ?
            0.48 * cost > 7.5 * volume ? 0.48 * cost : 7.5 * volume
            : (cost <= 169000) ?
            0.48 * cost > 15 * volume ? 0.48 * cost : 15 * volume
            : 0.48 * cost > 20 * volume ? 0.48 * cost : 20 * volume;
        
        return clearanceCost;
    }

    double from3To5Years(double volume) {
        clearanceCost = (volume <= 1000) ? 1.5 * volume
            : (volume <= 1500) ? 1.7 * volume
            : (volume <= 1800) ? 2.5 * volume
            : (volume <= 2300) ? 2.7 * volume
            : (volume <= 3000) ? 3.0 * volume
            : volume * 3.6;

        return clearanceCost;
    }

    double after5Years(double volume) {
        clearanceCost = (volume <= 1000) ? 3.0 * volume
            : (volume <= 1500) ? 3.2 * volume
            : (volume <= 1800) ? 3.5 * volume
            : (volume <= 2300) ? 4.8 * volume
            : (volume <= 3000) ? 5.0 * volume
            : volume * 5.7;

        return clearanceCost;
    }
}
