import db from './config/database.js';

async function setup() {
  try {
    // Delete all existing users
    await db('users').del();
    console.log('All users deleted');
    
    await db('login_logs').del();
    console.log('All login logs deleted');
    
    // bcrypt hash for 'mrnobody009' (generated with bcryptjs)
    const hash = '$2a$12$o3daPWWMfqTYlDfYcmPgr.anYasGwD/vyl0KILuyTfDg4QVWda9Ta';
    
    // Insert new admin user
    await db('users').insert({
      id: '8989c978-d628-4dbf-a986-6d562befa027',
      name: 'Mr.Nobody',
      email: 'mrnobody@elegance.com',
      password: hash,
      role: 'root',
      department: 'IT',
      designation: 'Administrator',
      employee_id: 'EJB001',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('✅ New admin user created!');
    console.log('   Email: mrnobody@elegance.com');
    console.log('   Password: mrnobody009');
    console.log('   Employee ID: EJB001 (Bangalore Branch)');
    console.log('   Role: root');
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

setup();
