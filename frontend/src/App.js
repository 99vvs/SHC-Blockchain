import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";

const healthcareContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const healthcareAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "DoctorAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileCID",
        "type": "string"
      }
    ],
    "name": "MedicalRecordAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "PatientAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "addDoctor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "diagnosis",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "treatment",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileCID",
        "type": "string"
      }
    ],
    "name": "addMedicalRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "addPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "isDoctor",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "isPatient",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "viewMedicalRecords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "diagnosis",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "treatment",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "date",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "doctor",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "fileCID",
            "type": "string"
          }
        ],
        "internalType": "struct HealthcareSystem.MedicalRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const provider = useRef(null);
  const signer = useRef(null);
  const healthcareContract = useRef(null);

  const [userAddress, setUserAddress] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [patientAddress, setPatientAddress] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [file, setFile] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const pinataApiKey = "dfccdbaf4733b81be743";
  const pinataSecretApiKey = "a0fcb7f0aabf2f78b519fbc32f3a4131d9e669b1780174ae740268cbefaad8fa";

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          provider.current = new ethers.BrowserProvider(window.ethereum);
          signer.current = await provider.current.getSigner();

          const address = await signer.current.getAddress();
          setUserAddress(address);

          healthcareContract.current = new ethers.Contract(
            healthcareContractAddress,
            healthcareAbi,
            signer.current
          );

          const doctorStatus = await healthcareContract.current.isDoctor(address);
          setIsDoctor(doctorStatus);
        } catch (error) {
          console.error("Error loading blockchain data:", error);
        }
      } else {
        alert("MetaMask is not installed.");
      }
    };

    loadBlockchainData();
  }, []);

  const uploadToIPFS = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
      return response.data.IpfsHash; // Return CID
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Failed to upload file to IPFS.");
    }
  };

  const addMedicalRecord = async () => {
    if (!ethers.isAddress(patientAddress)) {
      alert("Please enter a valid Ethereum address for the patient.");
      return;
    }
    if (!diagnosis || !treatment || !file) {
      alert("All fields and a file upload are required.");
      return;
    }

    if (isDoctor) {
      try {
        setLoading(true);
        const fileCID = await uploadToIPFS();
        if (!fileCID) {
          alert("Failed to upload file.");
          return;
        }

        const tx = await healthcareContract.current.addMedicalRecord(
          patientAddress,
          diagnosis,
          treatment,
          fileCID
        );
        await tx.wait();
        alert("Record added successfully!");
        setPatientAddress("");
        setDiagnosis("");
        setTreatment("");
        setFile(null);
      } catch (error) {
        console.error("Error adding record:", error);
        alert("Error adding record.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("You must be a doctor to add records.");
    }
  };

  const fetchMyRecords = async () => {
    try {
      setLoading(true);
      const records = await healthcareContract.current.viewMedicalRecords(userAddress);
      setFetchedRecords(records);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Error fetching records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Secured-HealthChain</h1>
      <h2>User Address: {userAddress}</h2>
      <h2>{isDoctor ? "You are a doctor" : "You are not a doctor"}</h2>

      {isDoctor && (
        <div>
          <h3>Add Patient Record</h3>
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            placeholder="Patient Address"
          />
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Diagnosis"
          />
          <input
            type="text"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Treatment"
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={addMedicalRecord} disabled={loading}>
            {loading ? "Adding..." : "Add Record"}
          </button>
        </div>
      )}

      <div>
        <h3>Your Records</h3>
        <button onClick={fetchMyRecords} disabled={loading}>
          {loading ? "Fetching..." : "Fetch My Records"}
        </button>
        {fetchedRecords.length > 0 ? (
          <ul>
            {fetchedRecords.map((record, index) => (
              <li key={index}>
                <strong>Diagnosis:</strong> {record.diagnosis} <br />
                <strong>Treatment:</strong> {record.treatment} <br />
                <strong>Date:</strong>{" "}
                {new Date(Number(record.date) * 1000).toLocaleString()} <br />
                <strong>Doctor:</strong> {record.doctor} <br />
                <strong>File:</strong>{" "}
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${record.fileCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
