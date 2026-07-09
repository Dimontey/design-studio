console.log("SERVER VERSION 2"); 

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'html')));

// 🔹 Підключення до БД
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bd_diplom_nastya',
  password: '1111',
  port: 5432,
});

// 🔹 ТЕСТ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});


// =====================================================
// 🔹 USERS
// =====================================================

// Реєстрація
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    await pool.query(
      'INSERT INTO users(name, email, password, role) VALUES($1,$2,$3,$4)',
      [name, email, password, role]
    );

    res.send('User created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

// Отримати всіх користувачів
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error');
  }
});

// Логін (простий)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1 AND password=$2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error');
  }
});


// =====================================================
// 🔹 REQUESTS (заявки)
// =====================================================

// Створити заявку (клієнт)
app.post('/requests', async (req, res) => {
  try {
    const { client_id, title, description } = req.body;

    await pool.query(
  'INSERT INTO requests(client_id, title, description) VALUES($1,$2,$3)',
  [client_id, title, description]
);

    res.send('Request created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating request');
  }
});

// 🔹 отримати всі заявки (для дизайнера)
app.get('/requests', async (req, res) => {
  try {

    const result = await pool.query(`

      SELECT 
        r.*,
        u.email,
        d.name AS designer_name

      FROM requests r

      JOIN users u 
      ON r.client_id = u.id

      LEFT JOIN users d
      ON r.designer_id = d.id

    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Призначити дизайнера (адмін)
app.put('/requests/assign', async (req, res) => {
  try {
    const { request_id, designer_id } = req.body;

    await pool.query(
      'UPDATE requests SET designer_id=$1 WHERE id=$2',
      [designer_id, request_id]
    );

    res.send('Designer assigned');
  } catch (err) {
    res.status(500).send('Error');
  }
});

// Оновити статус (дизайнер)
app.put('/requests/status', async (req, res) => {
  try {
    const { request_id, status } = req.body;

    await pool.query(
      'UPDATE requests SET status=$1 WHERE id=$2',
      [status, request_id]
    );

    res.send('Status updated');
  } catch (err) {
    res.status(500).send('Error');
  }
});


app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

app.put('/requests/pay', async (req, res) => {
  try {
    const { request_id } = req.body;

    await pool.query(
      'UPDATE requests SET payment_status=$1 WHERE id=$2',
      ['paid', request_id]
    );

    res.send('Payment successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.put('/requests/price', async (req, res) => {
  console.log("PRICE HIT"); 

  try {
    const { request_id, price } = req.body;

    await pool.query(
      'UPDATE requests SET price=$1 WHERE id=$2',
      [price, request_id]
    );

    res.send('Price updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.put('/requests/comment', async (req, res) => {

  try {

    const { request_id, comment } = req.body;

    await pool.query(
      'UPDATE requests SET comment=$1 WHERE id=$2',
      [comment, request_id]
    );

    res.send('Comment updated');

  } catch (err) {

    console.error(err);
    res.status(500).send('Error');

  }

});

// отримати заявки конкретного клієнта
app.get('/requests/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const result = await pool.query(
      'SELECT * FROM requests WHERE client_id = $1',
      [clientId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});
// =====================================================
// 🔹 ЗАПУСК
// =====================================================

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});



