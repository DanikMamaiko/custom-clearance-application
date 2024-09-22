package com.customs.customClearance.controller;

import com.customs.customClearance.service.ClearanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/api")
public class ClearanceController {

    private final ClearanceService clearanceService;

    @CrossOrigin(origins = "http://localhost:5174")
    @PostMapping("/calculate")
    public double calculateClearance(@RequestParam String age,
                                     @RequestParam String engineType,
                                     @RequestParam double volume,
                                     @RequestParam double cost,
                                     @RequestParam String entity,
                                     @RequestParam boolean withPrivileges,
                                     @RequestParam boolean planToSell) {

        double customClearance = clearanceService.calculateClearance(age, engineType, volume, cost,
            entity, withPrivileges, planToSell);

        return customClearance;
    }
}
