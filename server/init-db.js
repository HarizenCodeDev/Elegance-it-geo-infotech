import knex from "knex";

const db = knex({
  client: "better-sqlite3",
  connection: "./data/elegance.db",
  useNullAsDefault: true,
});

const BCRYPT_HASHES = {
  root: '$2a$12$CIaQgvHRMTtq9qE1PYV/Gebj2z4w0bMOeAVXNjmt7OQaDS2TdcdC2',
  admin: '$2a$12$TlqhnqegdkoekAl1z8XhDO9S9bDWWsuCKEOFmpbcWpeYiRuE.d9By',
  manager: '$2a$12$PBQCthWt.tPci6zxbqJ.X.InJlTSh2VFFNpKc9JjliUQT7KBVHtBK',
  hr: '$2a$12$Rxabl6In7G70YS18Vt7PSO0xjIxcyeQApmhTrkcJf9Oc4yoTXk7pW',
  teamlead: '$2a$12$Pfeb7k27.wo27RwU6Eviq.Eaz7/kKRwQbcxppXeP4ujW2/l2sYsdC',
  developer: '$2a$12$eZmmEKyB9B7xOPvwKCiTF.IdMyNGXRayJSBF.yrPi7mEXJapAt1Q.',
};

const USERS = [
  { email: 'mrnobody@elegance.com', name: 'Mr.Nobody', role: 'root', password: 'mrnobody009', employee_id: 'EJB2026001', department: 'IT', designation: 'Administrator' },
  { email: 'admin@elegance.com', name: 'Admin User', role: 'admin', password: 'admin123', employee_id: 'EJB2026002', department: 'Administration', designation: 'System Admin' },
  { email: 'manager@elegance.com', name: 'Manager User', role: 'manager', password: 'manager123', employee_id: 'EJB2026003', department: 'Management', designation: 'Department Manager' },
  { email: 'hr@elegance.com', name: 'HR User', role: 'hr', password: 'hr123456', employee_id: 'EJB2026004', department: 'Human Resources', designation: 'HR Specialist' },
  { email: 'teamlead@elegance.com', name: 'Team Lead', role: 'teamlead', password: 'teamlead123', employee_id: 'EJB2026005', department: 'Development', designation: 'Team Lead' },
  { email: 'developer@elegance.com', name: 'Developer User', role: 'developer', password: 'dev123456', employee_id: 'EJB2026006', department: 'Development', designation: 'Software Developer' },
];

async function initDatabase() {
  console.log('🔄 Initializing SQLite database...\n');

  try {
    // Users table
    console.log('📋 Creating users table...');
    await db.schema.createTable("users", (table) => {
      table.string("id", 36).primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.string("role").notNullable().defaultTo("developer");
      table.string("employee_id").unique();
      table.date("dob");
      table.string("gender");
      table.string("marital_status");
      table.string("designation");
      table.string("department");
      table.decimal("salary", 12, 2);
      table.string("profile_image");
      table.string("avatar");
      table.string("attendance_status").defaultTo("Pending");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
      table.timestamp("last_login_at").nullable();
      table.integer("login_count").defaultTo(0);
      table.boolean("is_active").defaultTo(true);
      table.boolean("must_change_password").defaultTo(false);
      table.timestamp("password_expires_at").nullable();
      table.string("preferred_language", 10).defaultTo("en");
      table.integer("failed_attempts").defaultTo(0);
      table.timestamp("locked_until").nullable();
      table.string("secret_question", 500).nullable();
      table.string("secret_answer_hash", 255).nullable();
      table.text("login_security").nullable();
    });
    console.log('  ✅ Created users table');

    // Attendance table
    console.log('📋 Creating attendance table...');
    await db.schema.createTable("attendance", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.date("date").notNullable();
      table.string("status").notNullable();
      table.timestamp("check_in_at");
      table.timestamp("check_out_at");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
      table.unique(["user_id", "date"]);
    });
    console.log('  ✅ Created attendance table');

    // Leave table
    console.log('📋 Creating leaves table...');
    await db.schema.createTable("leaves", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("type").notNullable();
      table.date("from_date").notNullable();
      table.date("to_date").notNullable();
      table.text("description");
      table.string("status").defaultTo("Pending");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created leaves table');

    // Announcements table
    console.log('📋 Creating announcements table...');
    await db.schema.createTable("announcements", (table) => {
      table.string("id", 36).primary();
      table.string("title").notNullable();
      table.text("message").notNullable();
      table.text("audience_roles").defaultTo("all");
      table.text("audience_departments").defaultTo("{}");
      table.string("created_by");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created announcements table');

    // Chat messages table
    console.log('📋 Creating chat_messages table...');
    await db.schema.createTable("chat_messages", (table) => {
      table.string("id", 36).primary();
      table.string("from_user");
      table.string("to_user");
      table.string("to_group");
      table.text("text").notNullable();
      table.timestamp("ts").defaultTo(db.fn.now());
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created chat_messages table');

    // Checkin/Checkout logs table
    console.log('📋 Creating checkin_checkout table...');
    await db.schema.createTable("checkin_checkout", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("parent_id");
      table.string("type").notNullable();
      table.string("ip_address");
      table.text("location");
      table.text("note");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created checkin_checkout table');

    // Login logs table
    console.log('📋 Creating login_logs table...');
    await db.schema.createTable("login_logs", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("ip_address");
      table.text("user_agent");
      table.string("status");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created login_logs table');

    // Leave balances table
    console.log('📋 Creating leave_balances table...');
    await db.schema.createTable("leave_balances", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("leave_type").notNullable();
      table.integer("total_days").notNullable().defaultTo(0);
      table.integer("used_days").notNullable().defaultTo(0);
      table.integer("pending_days").notNullable().defaultTo(0);
      table.integer("year").notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
      table.unique(["user_id", "leave_type", "year"]);
    });
    console.log('  ✅ Created leave_balances table');

    // Notifications table
    console.log('📋 Creating notifications table...');
    await db.schema.createTable("notifications", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("title").notNullable();
      table.text("message").notNullable();
      table.string("type").defaultTo("info");
      table.boolean("is_read").defaultTo(false);
      table.string("link");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created notifications table');

    // Holidays table
    console.log('📋 Creating holidays table...');
    await db.schema.createTable("holidays", (table) => {
      table.string("id", 36).primary();
      table.string("name").notNullable();
      table.date("date").notNullable();
      table.string("type").defaultTo("public");
      table.text("description");
      table.integer("year").notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created holidays table');

    // Documents table
    console.log('📋 Creating documents table...');
    await db.schema.createTable("documents", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("name").notNullable();
      table.string("type").notNullable();
      table.string("file_url").notNullable();
      table.text("description");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created documents table');

    // Activity logs table
    console.log('📋 Creating activity_logs table...');
    await db.schema.createTable("activity_logs", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("action").notNullable();
      table.string("module").notNullable();
      table.string("target_id");
      table.text("details");
      table.string("ip_address");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created activity_logs table');

    // User preferences table
    console.log('📋 Creating user_preferences table...');
    await db.schema.createTable("user_preferences", (table) => {
      table.string("id", 36).primary();
      table.string("user_id").unique();
      table.string("theme", 20).defaultTo("dark");
      table.string("language", 10).defaultTo("en");
      table.string("timezone", 50).defaultTo("Asia/Kolkata");
      table.string("date_format", 20).defaultTo("DD/MM/YYYY");
      table.string("time_format", 10).defaultTo("12h");
      table.boolean("email_notifications").defaultTo(true);
      table.boolean("push_notifications").defaultTo(true);
      table.boolean("desktop_notifications").defaultTo(false);
      table.text("dashboard_layout").defaultTo('{"showStats":true,"showCharts":true,"showCalendar":true}');
      table.text("quick_actions").defaultTo('[]');
      table.string("sidebar_collapsed", 5).defaultTo("false");
      table.string("items_per_page", 10).defaultTo("25");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created user_preferences table');

    // Password history table
    console.log('📋 Creating password_history table...');
    await db.schema.createTable("password_history", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("reset_by");
      table.string("password_hash", 255).notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created password_history table');

    // Login attempts table
    console.log('📋 Creating login_attempts table...');
    await db.schema.createTable("login_attempts", (table) => {
      table.string("id", 36).primary();
      table.string("email", 255);
      table.string("ip_address", 50).notNullable();
      table.string("user_agent", 500);
      table.string("attempt_type", 20).defaultTo("password");
      table.boolean("success").defaultTo(false);
      table.string("failure_reason", 100);
      table.string("location", 255);
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created login_attempts table');

    // Login sessions table
    console.log('📋 Creating login_sessions table...');
    await db.schema.createTable("login_sessions", (table) => {
      table.string("id", 36).primary();
      table.string("user_id");
      table.string("token_hash", 500).notNullable();
      table.string("ip_address", 50);
      table.string("user_agent", 500);
      table.string("device_type", 50);
      table.string("location", 255);
      table.timestamp("login_at").defaultTo(db.fn.now());
      table.timestamp("last_active_at").defaultTo(db.fn.now());
      table.timestamp("expires_at").notNullable();
      table.boolean("is_active").defaultTo(true);
      table.boolean("remember_me").defaultTo(false);
    });
    console.log('  ✅ Created login_sessions table');

    // Token blacklist table
    console.log('📋 Creating token_blacklist table...');
    await db.schema.createTable("token_blacklist", (table) => {
      table.increments("id").primary();
      table.string("token_hash").notNullable().unique();
      table.timestamp("expires_at").notNullable();
      table.timestamp("blacklisted_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created token_blacklist table');

    // Chat groups table
    console.log('📋 Creating chat_groups table...');
    await db.schema.createTable("chat_groups", (table) => {
      table.string("id", 36).primary();
      table.string("name").notNullable();
      table.text("members");
      table.string("created_by");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log('  ✅ Created chat_groups table');

    // Create indexes
    console.log('\n📊 Creating indexes...');
    await db.raw("CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_leaves_user_status ON leaves(user_id, status)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_leaves_dates ON leaves(from_date, to_date)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(from_user, to_user)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_chat_messages_group ON chat_messages(to_group, ts)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_users_department ON users(department)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_login_logs_user ON login_logs(user_id, created_at)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_checkin_user_date ON checkin_checkout(user_id, created_at)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id, created_at)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_password_history_user ON password_history(user_id)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address)");
    await db.raw("CREATE INDEX IF NOT EXISTS idx_login_sessions_user ON login_sessions(user_id)");
    console.log('  ✅ Created indexes');

    // Insert test users
    console.log('\n👥 Creating test users...');
    for (const user of USERS) {
      try {
        await db("users").insert({
          id: user.employee_id,
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
          login_count: 0,
        });
        console.log(`  ✅ Created ${user.role} user: ${user.email} (${user.employee_id})`);
      } catch (err) {
        console.log(`  ❌ Failed to create ${user.role}: ${err.message}`);
      }
    }

    console.log('\n📋 Final database state:');
    const users = await db("users").select("employee_id", "email", "name", "role");
    console.table(users);

    console.log('\n✅ Database initialization complete!');
    console.log('\n🔑 Login credentials:');
    console.log('   ┌─────────────────────────┬────────────┬───────────────┬────────────────┐');
    console.log('   │ Role                    │ Email      │ Password      │ Employee ID    │');
    console.log('   ├─────────────────────────┼────────────┼───────────────┼────────────────┤');
    for (const user of USERS) {
      console.log(`   │ ${user.role.padEnd(22)} │ ${user.email.padEnd(10)} │ ${user.password.padEnd(12)} │ ${user.employee_id.padEnd(14)} │`);
    }
    console.log('   └─────────────────────────┴────────────┴───────────────┴────────────────┘');

    await db.destroy();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    console.error(error.stack);
    await db.destroy();
    process.exit(1);
  }
}

initDatabase();
