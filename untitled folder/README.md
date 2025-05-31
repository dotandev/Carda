# Carda

This project implements a blockchain-based prescription system using **Aiken**, **Cardano**, and **Lucid**. The system is designed to manage the creation and approval of prescriptions, ensuring a secure and transparent process. The smart contracts govern prescription data validation, user authorization, and the minting of tokens related to prescription actions.

The project is divided into several modules, each focusing on a specific aspect of the system, including appointments, prescriptions, data access, and shared utilities. Additionally, the project includes TypeScript scripts for deploying the contracts on the **Cardano blockchain**.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Modules](#modules)
  - [Prescription](#prescription)
  - [Appointment](#appointment)
  - [Consent](#consent)
  - [Data Access](#data-access)
  - [Shared Utilities](#shared-utilities)
- [Deployment](#deployment)
- [Testing](#testing)
- [Running Locally](#running-locally)
- [License](#license)

## Introduction

**Carda** is a smart contract-based application designed to manage prescriptions on the **Cardano blockchain**. The system aims to automate the process of prescription approval, ensuring it is secure, transparent, and auditable. The system includes contracts for prescription creation, approval, and associated validation rules. 

The contract is built using the **Aiken** programming language, which is specifically designed for writing smart contracts on the Cardano blockchain. Additionally, the project leverages **Lucid** for deploying and interacting with the contracts.

## Project Structure

```bash

prescription-system/
├── contracts/
│ ├── appointment/
│ │ ├── types.ak
│ │ ├── validator.ak
│ │ └── test.ak
│ ├── prescription/
│ │ ├── types.ak
│ │ ├── minting_policy.ak
│ │ ├── redeemer.ak
│ │ └── test.ak
│ ├── access/
│ │ ├── types.ak
│ │ ├── validator.ak
│ │ └── test.ak
│ └── shared/
│ └── utils.ak
├── scripts/
│ ├── compile_contracts.sh
│ ├── export_plutus.sh
│ └── lucid/
│ ├── deploy.ts
│ ├── consent.ts
│ ├── appointment.ts
│ ├── prescription.ts
│ └── access.ts
├── aiken.toml
├── README.md

```



## Modules

### Prescription

The **Prescription** module is responsible for handling prescription creation, approval, and validation. It includes:

- **types.ak**: Defines the data structure for a prescription.
- **minting_policy.ak**: Defines the minting policy for tokens related to prescriptions.
- **redeemer.ak**: Includes logic for redeeming tokens and handling prescription-related actions.
- **validator.ak**: The core contract logic that validates prescription creation and approval.
- **test.ak**: Tests for the **Prescription** module to verify functionality.

Key features:
- Validates prescription ID format (e.g., starts with "RX").
- Ensures required fields are filled.
- Approves prescriptions based on doctor authorization.
- Ensures secure minting and redeeming of tokens.

### Appointment

The **Appointment** module handles the creation and validation of appointments, linking them to prescriptions. It includes:
- **types.ak**: Data types for appointments.
- **validator.ak**: Contract logic for validating appointments.
- **test.ak**: Tests for the **Appointment** module.

### Consent

The **Consent** module is used to manage patient consent for prescription actions. It includes:
- **types.ak**: Data types for consent management.
- **validator.ak**: Contract logic for validating and handling consent.
- **test.ak**: Tests for the **Consent** module.

### Data Access

The **Data Access** module manages access control for prescription and patient data. It includes:
- **types.ak**: Data types for managing access and user roles.
- **validator.ak**: Logic for validating access to data.
- **test.ak**: Tests for the **Data Access** module.

### Shared Utilities

The **Shared Utilities** module includes utility functions used across multiple modules to avoid redundancy. These utilities include:
- String validation functions.
- Date validation.
- List containment checks.
- Logging and tracing functions.
- Option unwrapping functions.

### `aiken.toml`

The `aiken.toml` file contains the configuration settings for the **Aiken** compiler, specifying details for the contract compilation process.

## Deployment

### Compilation and Export

To compile the Aiken contracts and export the Plutus scripts for deployment to the **Cardano** network, use the following scripts:

- `compile_contracts.sh`: Compiles all Aiken contracts into Plutus scripts.
- `export_plutus.sh`: Exports the compiled Plutus scripts for deployment.

### Lucid Scripts

The **Lucid** TypeScript scripts handle the deployment and interaction with the smart contracts. These scripts include:
- **deploy.ts**: Deploys contracts to the Cardano network.
- **consent.ts**: Interacts with the **Consent** contract.
- **appointment.ts**: Interacts with the **Appointment** contract.
- **prescription.ts**: Interacts with the **Prescription** contract.
- **data_access.ts**: Manages data access interactions.

To deploy and interact with the contracts, you need to install **Lucid** and have a working **Cardano** environment set up.

## Testing

Each module includes a `test.ak` file that tests the contract's functionality. These tests include validating contract logic for different actions like prescription creation, approval, and appointment management.

Run the tests using the **Aiken** test framework, which checks for correctness and ensures the contract logic behaves as expected.

Example command to run tests:


```bash

aiken test contracts/prescription/test.ak

```


## Running Locally

1. **Install Aiken**: Follow the [Aiken installation guide](https://aiken-lang.org/) to install the compiler.

2. **Install Lucid**: Follow the [Lucid documentation](https://github.com/obsidiansystems/lucid) to install the necessary dependencies.

3. **Set up a local Cardano network**: Use **Cardano-node** to set up a local testnet or use the **Preprod** network.

4. **Deploy the contracts**: Run the `deploy.ts` scripts to deploy the contracts to the Cardano network.

5. **Interact with contracts**: Use the provided Lucid scripts (e.g., `prescription.ts`, `appointment.ts`) to interact with the deployed contracts.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.
