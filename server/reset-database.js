import db from './config/database.js';

const BCRYPT_HASHES = {
  root: '$2a$12$8JiE36Px34K7nznPkpSBguClSXoggNlPMsQyBmKTqYjPli5mFzNrW',
  admin: '$2a$12$KU1tShqj33t/G82jOshZs.0pKeujIhivq5Xx5Mcgfu0WY0kRIDKQ.',
  manager: '$2a$12$Wn3m7X1Y8CqZkL2fA5hBnOsT6uM4vP9rE2dJ8cK4iH7sX0wZ1qB2m',
  hr: '$2a$12$Q5rT8Y2Z9DkNmL3gA6iCoPtU7vN5wQ0sF3eK9dL5jI8tY1xZ2aB3n',
  teamlead: '$2a$12$R6sU9Z3A0ElOoM4hB7jDpQuV8wO6xR1tG4fL0eM6kJ9uI2vZ3bC4o',
  developer: '$2a$12$yYe1pXlIifZVF5OLReDpnu4UwuRZuAAjy8wU8jXIsbK08WJuSXPdy',
};

const USERS = [
  { email: 'mrnobody@elegance.com', name: 'Mr.Nobody', role: 'root', password: 'mrnobody009', employee_id: 'EJB2026001', department: 'IT', designation: 'Administrator' },
  { email: 'admin@elegance.com', name: 'Admin User', role: 'admin', password: 'admin123', employee_id: 'EJB2026002', department: 'Administration', designation: 'System Admin' },
  { email: 'manager@elegance.com', name: 'Manager User', role: 'manager', password: 'manager123', employee_id: 'EJB2026003', department: 'Management', designation: 'Department Manager' },
  { email: 'hr@elegance.com', name: 'HR User', role: 'hr', password: 'hr123456', employee_id: 'EJB2026004', department: 'Human Resources', designation: 'HR Specialist' },
  { email: 'teamlead@elegance.com', name: 'Team Lead', role: 'teamlead', password: 'teamlead123', employee_id: 'EJB2026005', department: 'Development', designation: 'Team Lead' },
  { email: 'developer@elegance.com', name: 'Developer User', role: 'developer', password: 'dev123456', employee_id: 'EJB2026006', department: 'Development', designation: 'Software Developer' },
];

async function resetDatabase() {
  console.log('🔄 Starting database reset...\n');
  
  try {
    console.log('📊 Truncating all tables except users...');
    
    const tables = [
      'chat_messages',
      'chat_groups',
      'notifications',
      'activity_logs',
      'leave_balances',
      'leaves',
      'attendance',
      'checkin_checkout',
      'holidays',
      'announcements',
      'documents',
      'login_logs',
      'login_attempts',
      'password_history',
      'user_preferences',
    ];
    
    for (const table of tables) {
      try {
        await db(table).del();
        console.log(`  ✅ Cleared: ${table}`);
      } catch (err) {
        if (err.message.includes('does not exist') || err.message.includes('no such table')) {
          console.log(`  ⚠️  Skipped: ${table} (does not exist)`);
        } else {
          console.log(`  ⚠️  Skipped: ${table} (${err.message.substring(0, 50)}...)`);
        }
      }
    }
    
    console.log('\n👥 Managing users...');
    
    await db('users').del();
    console.log('  ✅ Cleared all users');
    
    for (const user of USERS) {
      try {
        await db('users').insert({
          name: user.name,
          email: user.email,
          password: BCRYPT_HASHES[user.role],
          role: user.role,
          employee_id: user.employee_id,
          department: user.department,
          designation: user.designation,
          created_at: new Date(),
          updated_at: new Date(),
          is_active: 1,
          failed_attempts: 0,
        });
        console.log(`  ✅ Created ${user.role} user: ${user.email} (${user.employee_id})`);
      } catch (err) {
        console.log(`  ❌ Failed to create ${user.role}: ${err.message}`);
      }
    }
    
    console.log('\n📋 Final database state:');
    const users = await db('users').select('employee_id', 'email', 'name', 'role');
    console.table(users);
    
    console.log('\n📊 Table record counts:');
    for (const table of tables) {
      try {
        const result = await db(table).count('* as count').first();
        console.log(`   ${table}: ${result.count}`);
      } catch {
        console.log(`   ${table}: 0`);
      }
    }
    
    console.log('\n✅ Database reset complete!');
    console.log('\n🔑 Login credentials:');
    console.log('   ┌─────────────────────────┬────────────┬───────────────┬────────────────┐');
    console.log('   │ Role                    │ Email      │ Password      │ Employee ID    │');
    console.log('   ├─────────────────────────┼────────────┼───────────────┼────────────────┤');
    for (const user of USERS) {
      console.log(`   │ ${user.role.padEnd(22)} │ ${user.email.padEnd(10)} │ ${user.password.padEnd(12)} │ ${user.employee_id.padEnd(14)} │`);
    }
    console.log('   └─────────────────────────┴────────────┴───────────────┴────────────────┘');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    process.exit(1);
  }
}

resetDatabase();
