async function main() {
    const HealthcareSystem = await ethers.getContractAt(
      "HealthcareSystem",
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
  
    // Verify the admin address
    const adminAddress = await HealthcareSystem.admin();
    console.log("Admin Address:", adminAddress);
  
    // Verify if an address is a doctor
    const doctorAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const isDoctor = await HealthcareSystem.isDoctor(doctorAddress);
    console.log(`Is ${doctorAddress} a doctor?:`, isDoctor);
  
    // Verify if an address is a patient
    const patientAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    const isPatient = await HealthcareSystem.isPatient(patientAddress);
    console.log(`Is ${patientAddress} a patient?:`, isPatient);
  }
  
  // Handle errors
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error executing the script:", error);
      process.exit(1);
    });
  