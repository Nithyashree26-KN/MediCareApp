package com.hospital.patient.repository;

import com.hospital.patient.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Filter patients by ward, department, doctor, and/or name search.
     * Passing null for any parameter skips that filter.
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "(:ward IS NULL OR p.ward = :ward) AND " +
           "(:department IS NULL OR p.department = :department) AND " +
           "(:doctor IS NULL OR p.doctor = :doctor) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Patient> findByFilters(
            @Param("ward") String ward,
            @Param("department") String department,
            @Param("doctor") String doctor,
            @Param("search") String search
    );
}
