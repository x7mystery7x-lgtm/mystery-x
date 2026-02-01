async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    const loginData = {
      email: 'admin-account@gmail.com',
      password: 'admin123'
    };

    const loginResponse = await fetch('http://localhost:5000/api/public/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log('Admin login response:', loginResult);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminLogin();