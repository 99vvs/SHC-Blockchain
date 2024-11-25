# **SecuredHealth-Chain - Blockchain Project**

## **Overview**
This project implements a decentralized healthcare system using blockchain technology. It allows doctors to add and upload patient medical records, including files to IPFS, and enables patients to view their own records securely. The system leverages smart contracts for role-based access control and integrates Pinata for IPFS-based file storage.

---

## **Features**
- **Role Management**:
  - Admin can add doctors and patients.
  - Doctors can upload medical records.
  - Patients can view their own medical records.
- **Secure Data Storage**: Medical records and files are securely stored on the blockchain and IPFS.
- **Decentralization**: Removes central control for better security and transparency.
- **File Uploading**: Supports uploading files (e.g., PDFs, images) to IPFS via Pinata integration.
- **Interactive Frontend**: A React-based user interface for seamless interaction.

---

## **Motivation**
Traditional healthcare systems rely on centralized storage, which makes them prone to data breaches, loss, or unauthorized access. By utilizing blockchain, this project ensures security, transparency, and privacy in managing sensitive healthcare data.

---

## **Technologies Used**
- **Blockchain**: Hardhat for Ethereum smart contract development.
- **Frontend**: React.js for the user interface.
- **IPFS**: Pinata for decentralized file storage.
- **MetaMask**: For wallet integration and transaction signing.

---

## **Prerequisites**
1. Node.js and npm installed.
2. MetaMask browser extension.
3. Pinata account with API keys.
4. Hardhat installed globally.

---

## **Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/healthcare-blockchain.git
   cd healthcare-blockchain
2. **Install dependencies**:
   ```bash
   npm install
   cd frontend
   npm install

  
3. **Configure environment variables**:
   ```bash
   PINATA_API_KEY=your_pinata_api_key
   PINATA_API_SECRET=your_pinata_api_secret

## **Running the Project**

1. **Start Local Blockchain**:
   ```bash
   npx hardhat node

2. **Deploy Smart Contracts**:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost

3. **Run Frontend**:
   ```bash
     cd frontend
     npm start

4. **Open your browser at http://localhost:3000 and interact with the app**:

## **Usage**
1. **Admin**:
   Add doctors and patients by entering their Ethereum Address
2. **Doctor**:
   Upload medical records and files for patients
   Use the pinata integration to store files on IPFS
3.**Patient**:
   View their medical records, including IPFS-hosted files, securely.
  
 
2. **Project Structure**:
- contracts/
  - HealthcareSystem.sol  # Solidity smart contract
- frontend/
  - src/
    - App.js             # React application logic
    - components/        # UI components
- scripts/
  - deploy.js            # Script to deploy the smart contract
- test/
  - HealthcareSystem.js  # Test cases
