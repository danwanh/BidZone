# BidZone - Online Auction Web Platform

BidZone is a modern AI-powered online auction platform designed to provide a secure, transparent, and user-friendly bidding experience. The project is built using the MERN stack (MongoDB, Express, React, Node.js) along with the latest web technologies.

## Key Features

### Account System & Security
- **Authentication**: Supports traditional email/password login and social login (Google, Facebook, GitHub) using Passport.js.
- **OTP Verification**: Enhances security via One-Time Passwords sent to the user's email.
- **User Roles**: 
  - **Bidder**: Participate in auctions, manage watchlists, and place bids.
  - **Seller**: Post products for auction and manage active listings.
  - **Admin**: Oversee users, categories, and system configurations.
- **Role Upgrade**: Bidders can submit requests to become Sellers.

### Auctions & Products
- **Real-time Bidding**: Competitive bidding mechanism with instant updates.
- **Auto-bidding**: Users can set a maximum price, and the system automatically places bids on their behalf.
- **Product Management**: Detailed product descriptions with TinyMCE rich text editor and image hosting via Cloudinary.
- **Watchlist**: Track favorite products and receive status updates.
- **Bidding History**: Detailed logs of all previous bids for each product.
- **Smart Recommendation (AI-Powered)**: Content-based recommendation based on popularity, demand, price, and category relevance.

### Automation & Notifications
- **Cron Jobs**: Automatically ends auctions, determines winners, and handles Seller role expiration.
- **Messaging System**: Direct chat between buyers and sellers.
- **Toast Notifications**: Real-time feedback for auction status and user interactions.

## Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Flowbite React
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React + React Icons
- **Libraries**: Swiper, TinyMCE, React Hot Toast, Axios.

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Passport.js (Google, FB, GitHub)
- **Utilities**: Node-cron, Nodemailer, Cloudinary API, Bcryptjs.

## Directory Structure

```text
BidZone/
├── backend/            # Express Server, API routes, Models, Controllers
├── frontend/           # React App (Vite)
├── db_dump/            # Sample data / DB exports
└── package.json        # Root package configuration
```

## Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- Cloudinary account (for image storage)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set the API base URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

