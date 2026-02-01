import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('Testing admin login...');

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        email: 'admin@mystery-x.com',
        password: 'Admin123!'
      })
    });

    const data = await response.json();
    console.log('Login response status:', response.status);
    console.log('Login response data:', data);

    if (data.success && data.data?.accessToken) {
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

async function testProtectedRoute(token) {
  console.log('Testing protected route with token...');

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    console.log('Protected route response status:', response.status);
    console.log('Protected route response data:', data);

    if (data.success) {
      console.log('✅ Protected route accessible!');
    } else {
      console.log('❌ Protected route failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Protected route test failed:', error.message);
  }
}

async function testPublicRoute() {
  console.log('Testing public route...');

  try {
    const response = await fetch(`${BASE_URL}/public/info`);
    const data = await response.json();
    console.log('Public route response status:', response.status);
    console.log('Public route response data:', data);

    if (data.company) {
      console.log('✅ Public route working!');
    } else {
      console.log('❌ Public route failed');
    }
  } catch (error) {
    console.error('❌ Public route test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testPublicRoute();
  const token = await testLogin();

  if (token) {
    await testProtectedRoute(token);
    console.log('🎉 Authentication system working correctly!');
  } else {
    console.log('⚠️ Authentication tests failed. Check backend logs.');
  }
}

runTests();