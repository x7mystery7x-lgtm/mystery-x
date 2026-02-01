import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('Testing admin login...');

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mystery-x.com',
        password: 'Admin123!'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (data.success) {
      console.log('✅ Admin login successful!');
      return data.data.accessToken;
    } else {
      console.log('❌ Admin login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return null;
  }
}

async function testPublicRoutes() {
  try {
    console.log('Testing public routes...');

    const response = await fetch(`${BASE_URL}/public/services`);
    const data = await response.json();
    console.log('Services response:', data);

    if (data.success) {
      console.log('✅ Public routes working!');
    } else {
      console.log('❌ Public routes failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Public routes test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testPublicRoutes();
  const token = await testAuth();

  if (token) {
    console.log('🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the backend logs.');
  }
}

runTests();