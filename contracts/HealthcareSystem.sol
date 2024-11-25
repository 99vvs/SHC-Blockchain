// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareSystem {
    struct MedicalRecord {
        string diagnosis;
        string treatment;
        uint256 date;
        address doctor;
        string fileCID; // Add fileCID to store the IPFS CID
    }

    address public admin;
    mapping(address => bool) private doctors;
    mapping(address => bool) private patients;
    mapping(address => MedicalRecord[]) private medicalRecords;

    // Events
    event DoctorAdded(address indexed doctor);
    event PatientAdded(address indexed patient);
    event MedicalRecordAdded(address indexed patient, address indexed doctor, string fileCID);

    constructor() {
        admin = msg.sender; // Set the contract deployer as the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(doctors[msg.sender], "Only doctors can perform this action");
        _;
    }

    modifier onlyAuthorized(address patient) {
        require(
            msg.sender == patient || doctors[msg.sender],
            "Unauthorized access"
        );
        _;
    }

    function addDoctor(address doctor) public onlyAdmin {
        doctors[doctor] = true;
        emit DoctorAdded(doctor);
    }

    function addPatient(address patient) public onlyAdmin {
        patients[patient] = true;
        emit PatientAdded(patient);
    }

    function addMedicalRecord(
        address patient,
        string memory diagnosis,
        string memory treatment,
        string memory fileCID
    ) public onlyDoctor {
        require(patients[patient], "Patient not registered");
        medicalRecords[patient].push(
            MedicalRecord(diagnosis, treatment, block.timestamp, msg.sender, fileCID)
        );
        emit MedicalRecordAdded(patient, msg.sender, fileCID);
    }

    function viewMedicalRecords(address patient)
        public
        view
        onlyAuthorized(patient)
        returns (MedicalRecord[] memory)
    {
        return medicalRecords[patient];
    }

    function isDoctor(address doctor) public view returns (bool) {
        return doctors[doctor];
    }

    function isPatient(address patient) public view returns (bool) {
        return patients[patient];
    }
}
