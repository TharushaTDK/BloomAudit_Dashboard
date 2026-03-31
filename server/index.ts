import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('BloomAudit Backend (TS v1) is running!');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/db-test', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connection established.', 
      data: result.rows[0] 
    });
  } catch (err: any) {
    console.error('DB Connection Error:', err.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to the database.' 
    });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { 
      name, email, password, company_type, no_of_users, package_name 
    } = req.body;

    // Default configuration based on package
    let package_price = 49.99;
    let plan_type = 'monthly';
    
    if (package_name === 'Pro') {
      package_price = 99.99;
      plan_type = 'annual';
    } else if (package_name === 'Enterprise') {
      package_price = 249.99;
      plan_type = 'annual';
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO users (
        name, email, password_hash, role, 
        company_type, package_name, package_price, 
        no_of_users, plan_type, account_status,
        package_status, purchase_date
      ) VALUES (
        $1, $2, $3, 'customer',
        $4, $5, $6, 
        $7, $8, 'active',
        'active', CURRENT_DATE
      ) RETURNING id, name, email, role, created_at;
    `;

    const result = await pool.query(insertQuery, [
      name, email, password_hash, company_type, 
      package_name || 'Basic', package_price, 
      no_of_users || 1, plan_type
    ]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: result.rows[0],
    });
  } catch (err: any) {
    console.error('Registration error:', err.message);
    // Check for unique constraint violation (code 23505)
    if (err.code === '23505') {
       return res.status(400).json({ success: false, error: 'Email already exists.' });
    }
    res.status(500).json({ success: false, error: 'Failed to register user.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'bloomaudit_super_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        account_status: user.account_status,
        package_name: user.package_name,
        package_status: user.package_status,
        purchase_date: user.purchase_date
      }
    });
  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to login.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server navigating at http://localhost:${PORT}`);
});
