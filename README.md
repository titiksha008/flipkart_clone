# 🛒 Flipkart Clone — Full Stack E-Commerce Application

A full-stack e-commerce web application inspired by Flipkart, built using React.js, Node.js, Express, MySQL, and Sequelize.  
It supports product browsing, cart management, authentication, order placement, and more.

---

## 🔗 Live Links

- **Frontend (Vercel):** https://flipkart-clone-eta-woad.vercel.app  
- **Backend API (Render):** [https://flipkart-clone-backend-1e7n.onrender.com/api ](https://flipkart-clone-backend-1e7n.onrender.com/) 

---

## 🧰 Tech Stack

| Layer            | Technology |
|------------------|------------|
| Frontend         | React.js (Vite), React Router |
| State Management | Redux Toolkit |
| Styling          | Tailwind CSS |
| Backend          | Node.js, Express.js |
| Database         | MySQL (Aiven Cloud) |
| ORM              | Sequelize |
| Authentication   | JWT |
| Email Service    | Nodemailer |
| Deployment       | Vercel + Render |

---

## ✨ Features

- 🛍️ Product listing with search & category filter  
- 📄 Product detail page with images and pricing  
- 🛒 Add to cart, update quantity, remove items  
- ❤️ Wishlist functionality  
- 🚚 Checkout and order placement  
- 📦 Order history page  
- 📧 Email confirmation after order placement  
- 📱 Fully responsive design  

---

## 📁 Project Structure
```

flipkart-clone/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.jsx
│   └── .env
│
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed/
│   ├── certs/
│   ├── index.js
│   └── .env
│
└── README.md

````

---

## ⚙️ How to Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/titiksha008/flipkart_clone.git
cd flipkart-clone
````

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

## 🌐 API Configuration

Frontend uses this API base URL:

```
https://flipkart-clone-backend-1e7n.onrender.com/api
```

Axios is configured with:

* Base URL
* JSON headers
* JWT token interceptor

---

## 🔐 Authentication

- This project uses a **default user setup** for demo purposes  
- No login or signup is required to use the application  
- All actions (cart, orders, wishlist) are performed using a predefined user  

> Note: JWT-based authentication can be integrated in future versions.

---

## 🗄️ Database

* MySQL hosted on Aiven Cloud
* Managed using Sequelize ORM
* Auto table sync on server start

---

## 🚀 Deployment

### Frontend

* Hosted on **Vercel**

### Backend

* Hosted on **Render**

### Database

* Hosted on **Aiven MySQL**

---

## ⚠️ Notes

* Backend may take a few seconds to respond initially (Render free tier cold start)
* Payment system is simulated (no real payment gateway)
* SSL is used for secure database connection

---

## 👩‍💻 Author

**Titiksha Chugh**

---

## 📄 License

This project is built for learning and portfolio purposes.
It is not affiliated with or endorsed by Flipkart.

````

