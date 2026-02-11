# 3D Word Cloud Project

This project generates an interactive 3D word cloud using **React Three Fiber** on the frontend and **FastAPI** on the backend. Words are sized and colored based on their weight, float dynamically, and are arranged in an oval shape.  

---

## **Features**

- 3D word cloud using `@react-three/fiber` and `@react-three/drei`  
- Floating, rotating words for a dynamic effect  
- Word size and color reflect weight  

---

## **Tech Stack / Libraries**

**Frontend (React + TypeScript):**
- React 19
- Vite
- TypeScript
- @react-three/fiber
- @react-three/drei
- three.js  

**Backend (Python):**
- FastAPI
- Uvicorn
- Requests
- BeautifulSoup4
- scikit-learn

---

## **Setup and Running**

1. Clone the repository:

git clone <repo-url>
cd 3D-Word-Cloud-Elijah

2. Ensure python3 and npm are installed

3. Run the setup script:

node setup.js

4. Change the environment variable in .env in the frontend.
    When deploying the backend pay attention to uvicorns running url.
    Change the env variable VITE_API_URL to your Uvicorn url.