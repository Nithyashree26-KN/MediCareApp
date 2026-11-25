package com.hospital.patient.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("status", "ok");
        body.put("message", "MediCare API is running");
        body.put("patients", "/api/patients");
        return body;
    }
}
