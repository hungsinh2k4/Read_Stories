import React, { useState } from 'react';
import { testFirebaseConnection } from '../services/testFirebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const FirebaseTest: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const result = await testFirebaseConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const result = await testFirebaseConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    const result = await testFirebaseConnection();
    setTestResult(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Firebase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
          
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter password"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Login & Test'}
            </button>
            
            <button
              onClick={handleRegister}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Register & Test'}
            </button>
            
            <button
              onClick={handleTest}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Current User'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`rounded-lg shadow p-6 ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            <h3 className={`text-lg font-semibold mb-4 ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              Test Result: {testResult.success ? '✅ Success' : '❌ Failed'}
            </h3>
            
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
            
            {!testResult.success && testResult.error?.includes('permission') && (
              <div className="mt-4 p-4 bg-yellow-100 border-yellow-200 border rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">🔧 Cần cập nhật Firebase Security Rules:</h4>
                <p className="text-yellow-700 text-sm mb-2">
                  Hãy xem file <code>FIREBASE_SETUP.md</code> để biết cách cấu hình Security Rules đúng cách.
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-yellow-800 font-medium">Xem Security Rules mẫu</summary>
                  <pre className="mt-2 text-xs bg-white p-2 rounded border">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest;
