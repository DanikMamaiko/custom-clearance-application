package com.customs.customClearance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BasicClearance {

    private final PhysicalEntity physicalEntity;
    private final LegalEntityDiesel legalEntityDiesel;
    private final LegalEntityPetrol legalEntityPetrol;

    double clearanceCost = 0;

    public double calculateBasicClearance(double volume, double cost, String entity, String engineType, String age) {
        if (entity.equals("Физ.лицо")) {
            if(age.equals("До 3-ёх лет")){
                clearanceCost = physicalEntity.upTo3Years(volume, cost);
            } else if(age.equals("От 3-ёх до 5-ти лет")) {
                clearanceCost = physicalEntity.from3To5Years(volume);
            } else {
                clearanceCost = physicalEntity.after5Years(volume);
            }
        } else {
            if(engineType.equals("Бензин")){
                if(age.equals("До 3-ёх лет")) {
                    clearanceCost = legalEntityPetrol.upTo3Years(volume, cost);
                } else if(age.equals("От 3-ёх до 5-ти лет")) {
                    clearanceCost = legalEntityPetrol.from3To5Years(volume, cost);
                } else {
                    clearanceCost = legalEntityPetrol.after5Years(volume);
                }
            } else { // if Disel
                if(age.equals("До 3-ёх лет")) {
                    clearanceCost = legalEntityDiesel.upTo3Years(volume, cost);
                } else if (age.equals("От 3-ёх до 5-ти лет")) {
                    clearanceCost = legalEntityDiesel.from3To5Years(volume, cost);
                } else {
                    clearanceCost = legalEntityDiesel.after5Years(volume);
                }
            }
        }

        return clearanceCost;
    }
}
