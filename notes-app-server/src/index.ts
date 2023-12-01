import express from 'express';
import cors from 'cors';
import pgPromise from 'pg-promise';

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

interface Column {
  name: string;
  type: string;
}

app.post('/api/createTable', async (req, res) => {
  const { tableName, columns, dbName, dbPassword,primaryKey }: { tableName: string; columns: Column[],dbName:string,dbPassword:string,primaryKey:string } = req.body;

  // Validate inputs
  if (!tableName || !columns || columns.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  try {
    // Extract column names and types
    console.log(columns);
    const columnDefinitions = columns.map((column) => `${column.name} ${column.type}`).join(', ');

    // Example with raw SQL (make sure to handle SQL injection properly)
    const createTableQuery = `CREATE TABLE ${tableName} (${columnDefinitions} , PRIMARY KEY (${primaryKey}))`;
    console.log('createTableQuery:', createTableQuery);
    console.log('DBname and Pass:', dbName,' ',dbPassword);
    // Connect to the specified database
    const dbConnection = pgPromise()({
      // Your database options here, use known properties
      host: 'localhost',
      port: 5432,
      database: dbName,
      user: 'klaudiazalewska',
      password: dbPassword,
    });

    // Execute the query using the connected database
    await dbConnection.none(createTableQuery);

    res.json({ success: true });
  } catch (error) {
    console.error('Error creating table:', error as Error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
