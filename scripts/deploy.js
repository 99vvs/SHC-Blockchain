const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const HealthcareSystem = await ethers.getContractFactory("HealthcareSystem");

  console.log("Deploying HealthcareSystem contract...");

  // Deploy the contract
  const healthcareSystem = await HealthcareSystem.deploy(); // Deploy the contract

  console.log("Waiting for deployment to complete...");
  await healthcareSystem.waitForDeployment(); // Wait for the deployment to complete (Ethers.js v6)

  // Get the deployed address
  const contractAddress = await healthcareSystem.getAddress(); // Fetch the deployed contract address

  console.log("Contract deployed successfully!");
  console.log("HealthcareSystem contract address:", contractAddress);

  // Example signers
  const [admin, doctor, patient] = await ethers.getSigners();

  console.log("Adding a doctor...");
  await healthcareSystem.addDoctor(doctor.address);
  console.log(`Doctor added: ${doctor.address}`);

  console.log("Adding a patient...");
  await healthcareSystem.addPatient(patient.address);
  console.log(`Patient added: ${patient.address}`);
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  });
