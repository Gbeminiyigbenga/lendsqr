# Lendsqr Wallet Service (Demo Credit App)

 Overview

This project is a wallet microservice MVP built for the Lendsqr backend engineering assessment. It simulates the wallet functionality required in a mobile lending app, where users can:

- Create a wallet account  
- Fund their account  
- Transfer money to other users  
- Withdraw from their wallet  

 Users listed on the Lendsqr Adjutor Karma Blacklist are blocked from creating accounts.



## 🚀 Tech Stack

Language: Node.js (LTS) + TypeScript  
API Framework: Express  
ORM: Knex.js  
Database: MySQL  
Testing: Jest  
Deployment: Render  
Authentication: Faux token-based auth

 Faux Authentication

No full authentication system was implemented. A simple token (user ID in the header) is used to simulate authenticated requests.

To simulate login, use:  
Authorization: Bearer <user_id>



Hosted URL

The API is live and deployed at:  
https://lendsqr-0a3t.onrender.com


 Features

✅ User Onboarding  
- Creates a new user and wallet in one step.  
- Validates user is not on the Karma Blacklist via a mock external API call.

✅ Wallet Funding  
- Users can fund their wallet using the `/wallet/fund` endpoint.

✅ Funds Transfer  
- Users can transfer money to other wallets using `/wallet/transfer`.  
- Ensures atomicity and uses transaction scoping to maintain balance integrity.

Withdrawal  
- Allows users to withdraw from their wallet.  
- Validates balance and uses transactions to prevent double-spending.

Testing

Tests written using Jest cover positive and negative scenarios including:  
- Account creation  
- Invalid account creation (blacklisted user)  
- Insufficient balance on withdrawal  
- Transfer to invalid wallet ID  

Run tests with:  
npm test

 Design Decisions

- KnexJS used for clean, migration-based DB handling  
- Faux Auth avoids the overhead of a full auth system, while keeping testing realistic  
- Transaction Scoping used to avoid partial wallet updates  
- Blacklist Simulation: The Adjutor Karma service is mocked to simulate blocking logic. In production, this would be a real API call with proper KYC data.

---

## 🧬 ER Diagram

The database schema includes the following tables:  
- users  
- wallets  
- transactions  

Project Structure

src/  
├── controllers/  
├── db/  
├── middlewares/  
├── models/  
├── routes/  
├── services/  
├── utils/  
└── index.ts  

Root Files:  
├── knexfile.ts  
├── .env  
├── package.json  
└── tsconfig.json  

---

## 🧪 Sample API Usage

Create Account  
POST /api/v1/users  
Body:  
{  
  "name": "Jane Doe",  
  "email": "jane@example.com"  
}

Fund Wallet  
POST /api/v1/wallet/fund  
Headers: Authorization: Bearer 1  
Body:  
{  
  "amount": 1000  
}

Transfer Funds  
POST /api/v1/wallet/transfer  
Headers: Authorization: Bearer 1  
Body:  
{  
  "receiverWalletId": "wallet_002",  
  "amount": 200  
}

Withdraw Funds  
POST /api/v1/wallet/withdraw  
Headers: Authorization: Bearer 1  
Body:  
{  
  "amount": 500  
}


 Additional Notes

- The blacklist logic is mocked due to lack of access to Lendsqr’s real Adjutor API.  
- Sample data is seeded using Knex seed files for local testing.  
- Real payment gateway or KYC integrations are omitted for simplicity.


Submission Links

✅ GitHub Repository: https://github.com/Gbeminiyigbenga/lendsqr  
✅ Live API: https://lendsqr-0a3t.onrender.com  




Gbemininiyi Gbenga-Olusanya  


