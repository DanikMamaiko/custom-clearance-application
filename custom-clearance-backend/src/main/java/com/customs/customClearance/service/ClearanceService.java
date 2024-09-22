package com.customs.customClearance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClearanceService {

    private final BasicClearance basicClearance;

    public double calculateClearance(String age, String engineType, double volume, double cost,
                                   String entity, boolean withPrivileges, boolean planToSell) {

        if (engineType == "Электро") {
            if (planToSell) {
                return cost * 0.15;
            }
            return 0;
        }

        double basicClearanceCost = basicClearance.calculateBasicClearance(volume, cost, entity, engineType, age);

        if (withPrivileges && !entity.equals("Юр.лицо")) {
            return basicClearanceCost / 2;
        }

        return basicClearanceCost;
    }
}
