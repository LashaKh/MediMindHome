import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Landing } from './components/Landing';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { ChatLayout } from './components/Chat/ChatLayout';
import { NotesLayout } from './components/Notes/NotesLayout';
import { NoteEditor } from './components/Notes/NoteEditor';
import { PatientDetails } from './components/Patients/PatientDetails';
import { PatientTable } from './components/Patients/PatientTable';
import { ABGAnalysis } from './components/ABG/ABGAnalysis';
import ABGHistoryPage from './components/ABG/ABGHistoryPage';
import { ECGAnalysis } from './components/ECG/ECGAnalysis';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { LanguageProvider } from './contexts/LanguageContext';
import { MediVoiceTranscriber } from './components/MediVoice/MediVoiceTranscriber';
import { MyPatientsPage } from './components/Patients/MyPatients/MyPatientsPage';
import { MyPatientDetails } from './components/Patients/MyPatients/MyPatientDetails';
import MediSearchPage from './components/MediSearch/MediSearchPage';
import { SimpleTest } from './components/MediSearch';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/chat/*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="/" element={<ChatLayout />} />
                    <Route path=":conversationId" element={<ChatLayout />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <PrivateRoute>
                  <NotesLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<div className="flex-1 flex items-center justify-center text-gray-500">
                Select a note or create a new one
              </div>} />
              <Route 
                path=":noteId" 
                element={
                  <NoteEditor 
                    onToggleSidebar={() => {}} 
                  />
                } 
              />
            </Route>
            <Route
              path="/patients"
              element={
                <PrivateRoute>
                  <PatientTable />
                </PrivateRoute>
              }
            />
            <Route path="/patients/:patientId" element={
              <PrivateRoute>
                <PatientDetails />
              </PrivateRoute>
            } />
            <Route path="/my-patients" element={
              <PrivateRoute>
                <MyPatientsPage />
              </PrivateRoute>
            } />
            <Route path="/my-patients/:patientId" element={
              <PrivateRoute>
                <MyPatientDetails />
              </PrivateRoute>
            } />
            <Route
              path="/bg-analysis"
              element={
                <PrivateRoute>
                  <ABGAnalysis />
                </PrivateRoute>
              }
            />
            <Route
              path="/bg-history"
              element={
                <PrivateRoute>
                  <ABGHistoryPage />
                </PrivateRoute>
              }
            />
            <Route path="/ecg-analysis" element={
              <PrivateRoute><ECGAnalysis /></PrivateRoute>
            } />
            <Route path="/medivoice-transcriber" element={
              <PrivateRoute><MediVoiceTranscriber /></PrivateRoute>
            } />
            <Route path="/medisearch" element={
              <PrivateRoute><MediSearchPage /></PrivateRoute>
            } />
            <Route path="/simple-test" element={<SimpleTest />} />
          </Routes>
        </MainLayout>
      </LanguageProvider>
    </Router>
  );
}

export default App;