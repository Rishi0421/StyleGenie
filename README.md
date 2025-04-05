# 👕 AR Virtual Try-On with AI-Powered Size Recommendation

This project integrates **Augmented Reality (AR)** for virtual t-shirt try-on with an AI-based body analysis system that automatically recommends the most suitable clothing size for the user based on their body proportions.

---

## 📸 Feature Overview

- **Live Camera Feed:** Users can view how a t-shirt looks on them in real-time.
- **Capture Image & Analyze:** Users click a **"Capture Image"** button to take a photo using their webcam.
- **AI Body Analysis:** The system uses **MediaPipe Pose** to detect key body landmarks and measure proportions like shoulder width and torso length.
- **Size Recommendation:** Based on the analysis, the system recommends a clothing size (S, M, L, XL) without requiring manual measurements.
- **Non-intrusive Integration:** This feature is implemented without modifying any existing API endpoints.

---

## 🧠 Technologies Used

| Tool/Library      | Purpose                          |
|-------------------|----------------------------------|
| React.js          | Frontend Framework               |
| Lens Studio       | Body landmark detection          |
| WebRTC            | Accessing webcam in-browser      |
| Node.js      | Backend    |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rishi0421/StyleGenie.git
cd client
cd admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
npm run dev
```

---

## 🧪 How It Works

1. User enables their webcam and stands in view.
2. On clicking **Capture Image**, the system:
   - Captures a frame.
   - Analyzes the image using **Gemini** to get body keypoints.
   - Estimates shoulder width and torso size.
3. The algorithm compares the measurements to preset thresholds and returns the best-suited clothing size.
4. The result is shown on-screen with suggestions like:
   - ✅ "Your Recommended Size: M"
   - 🔁 "Try standing straight for accurate size estimation."

---

## 📁 Project Structure

```
/src
  ├── components
  │     └── ARViewer.jsx           # Virtual try-on viewer
  │     └── SizeAnalyzer.jsx       # Image capture + size suggestion
  ├── assets
  │     └── t-shirts/              # Sample t-shirt overlays
  ├── App.jsx
  └── index.js
```

---

## 📦 Future Scope

- 📱 Mobile compatibility with camera flipping
- 📏 Precise fitting with 3D mesh estimation
- 👗 Support for other clothing types (tshirt, jackets,shirts etc.)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change or improve.

---
