import { Routes, Route, Navigate } from 'react-router-dom';
import SubscriptionForm from './components/SubscriptionForm';
import Success from './components/Success';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/form" replace />} />
      <Route path="/form" element={<SubscriptionForm />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;
