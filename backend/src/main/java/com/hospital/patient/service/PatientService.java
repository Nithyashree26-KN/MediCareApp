package com.hospital.patient.service;

import com.hospital.patient.exception.ResourceNotFoundException;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    // ---- Valid option lists (backend enum validation) ----
    private static final List<String> VALID_GENDERS =
            Arrays.asList("Male", "Female", "Other");

    private static final List<String> VALID_WARDS =
            Arrays.asList("General", "ICU", "Pediatric", "Maternity", "Surgical", "Orthopedic");

    private static final List<String> VALID_DEPARTMENTS =
            Arrays.asList("Cardiology", "Neurology", "Orthopedics", "Pediatrics",
                          "General Medicine", "Oncology", "Gynecology");

    private static final List<String> VALID_DOCTORS =
            Arrays.asList("Dr. Arjun Mehta", "Dr. Priya Sharma", "Dr. Rahul Nair",
                          "Dr. Sunita Rao", "Dr. Vikram Das");

    private static final List<String> VALID_STATUSES =
            Arrays.asList("Admitted", "Discharged");

    // ---- Get all with optional filters ----
    public List<Patient> getAllPatients(String ward, String department, String doctor, String search) {
        String w = (ward      != null && !ward.isBlank())       ? ward       : null;
        String d = (department != null && !department.isBlank()) ? department : null;
        String dr = (doctor    != null && !doctor.isBlank())    ? doctor     : null;
        String s = (search     != null && !search.isBlank())    ? search     : null;
        return patientRepository.findByFilters(w, d, dr, s);
    }

    // ---- Get single patient ----
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    // ---- Create patient ----
    public Patient createPatient(Patient patient) {
        validateEnumFields(patient);
        patient.setStatus("Admitted"); // Always start as Admitted
        return patientRepository.save(patient);
    }

    // ---- Update patient ----
    public Patient updatePatient(Long id, Patient details) {
        Patient existing = getPatientById(id);
        validateEnumFields(details);

        existing.setName(details.getName());
        existing.setAge(details.getAge());
        existing.setGender(details.getGender());
        existing.setWard(details.getWard());
        existing.setDepartment(details.getDepartment());
        existing.setDoctor(details.getDoctor());
        existing.setAdmissionDate(details.getAdmissionDate());
        existing.setStatus(details.getStatus() != null ? details.getStatus() : existing.getStatus());

        return patientRepository.save(existing);
    }

    // ---- Delete patient ----
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }

    // ---- Mark as discharged ----
    public Patient dischargePatient(Long id) {
        Patient patient = getPatientById(id);
        patient.setStatus("Discharged");
        return patientRepository.save(patient);
    }

    // ---- Backend enum validation ----
    private void validateEnumFields(Patient patient) {
        if (!VALID_GENDERS.contains(patient.getGender())) {
            throw new IllegalArgumentException(
                "Invalid gender '" + patient.getGender() + "'. Allowed: " + VALID_GENDERS);
        }
        if (!VALID_WARDS.contains(patient.getWard())) {
            throw new IllegalArgumentException(
                "Invalid ward '" + patient.getWard() + "'. Allowed: " + VALID_WARDS);
        }
        if (!VALID_DEPARTMENTS.contains(patient.getDepartment())) {
            throw new IllegalArgumentException(
                "Invalid department '" + patient.getDepartment() + "'. Allowed: " + VALID_DEPARTMENTS);
        }
        if (!VALID_DOCTORS.contains(patient.getDoctor())) {
            throw new IllegalArgumentException(
                "Invalid doctor '" + patient.getDoctor() + "'. Allowed: " + VALID_DOCTORS);
        }
        if (patient.getStatus() != null && !VALID_STATUSES.contains(patient.getStatus())) {
            throw new IllegalArgumentException(
                "Invalid status '" + patient.getStatus() + "'. Allowed: " + VALID_STATUSES);
        }
    }
}
