<p align="center">
  <img src="public/logo.png" alt="MedicusAI Logo" width="200"/>
</p>

# MediceusAI
https://devpost.com/software/mediceusai

### Summary
🚨 **The Problem:** Surgeons and medical teams should be fully focused on their patients—not distracted by manual documentation. However, current surgical workflows require them to track medications, procedures, and complications while operating, leading to inefficiencies and potential errors.

✅ **The Solution:** MediceusAI is an AI-powered surgical assistant that listens, documents, and organizes every critical moment of surgery in real time. Using advanced AI powered by Elevenlabs, MediceusAI ensures that every administered medication, anesthetic, and procedure is accurately recorded—allowing doctors to focus entirely on saving lives.

By eliminating the burden of manual documentation, MediceusAI enhances surgical efficiency, improves patient safety, and ensures compliance with medical reporting standards. It’s not just a tool—it’s a revolution in surgical precision. 🚀


### ✨ What MediceusAI Does:
- **Digitalization of medical documentation** – Converts paper-based medical records into digital format.  
- **Monitoring the use of narcotic drugs such as fentanyl** – Tracks and records the administration of controlled substances.  
- **Ensures strict authorization control** – Prevents unauthorized access to sensitive medical data.  
- **Allows medical personnel to focus on the patient by eliminating manual note-taking** – Reduces administrative workload, enabling doctors to concentrate on patient care.  
- Captures and documents all surgical actions, medications, and procedures in real-time.  
- Generates a structured post-surgery report with key events.  
- Organizes and manages patient records and operating room data for seamless hospital workflow.  


### 🛠 How We Built It:
- **Repository:** [MediceusAI GitHub](https://github.com/Krzychu-Z/mediceus-ai)
- **ElevenLabs** - Conversational AI for real-time voice interaction.
- **Vercel** - Web page template.
- **Next.js** - Frontend framework for the user dashboard.
- **Python Flask** - Backend for AI processing and API integrations.
- **SQLite** - SQLite database for operations and events storage.

### 📈 Future Potential & Expansion:
The project was inspired by a real-world problem faced by doctors all around Poland and beyond. As one of the hospitals has already expressed interest in our solution, we plan to cooperate with them and deliver a production-grade service, further expanding to private hospitals and clinics before onboarding other healthcare institutions.

#### Upcoming Features:
- **Voice Diarization** – Distinguishes different speakers, improving accuracy in documentation.
- **EHR Integration** – Seamless connection with hospital electronic health record (EHR) systems.
- **AI-Powered Data Insights** – Advanced analytics on surgical procedures for premium users.
- **Hardware Partnerships** – Potential collaboration with AI-powered microphones & OR devices.
- **Warehouse of narcotic drugs** – Integration with narcotic drug inventory management.


### Our Team:
- **[Aleksander Mazur](https://www.linkedin.com/in/aleksander-mazur/)** - SWE @ Google. Managing and interacting with ElevenLabs AI Agent.
- **[Jakub Niećko](https://www.linkedin.com/in/jakub-nie%C4%87ko/)** - SWE @ Motorola Solutions. Responsible for the organization and development of both frontend, backend and database components.
- **[Krzysztof Żerebecki](https://www.linkedin.com/in/krzysztof-%C5%BCerebecki-b32780226/)** - AWS Cloud Engineer @ Accenture. Responsible for the API communications, testing and debugging.
- **[Marcin Retajczyk](https://www.linkedin.com/in/marcin-retajczyk/)** - Account Cloud Engineer @ Oracle Corporation. Focusing on development frontend and backend.


### Example local deployment
- Download this repository to some location on your computer
- Tools required: Python 3.9>=, npm, npx, pip
#### Start backend server
`Inside backends folder`
```
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
python3 api.py
```
Your backend server has created a SQLite database file and is running at localhost:5000
#### Start frontend server
`Inside repo root folder`
```
npm install
npm run build
npm run start
```
You have now deployed working version of MediceusAI on localhost:3000
