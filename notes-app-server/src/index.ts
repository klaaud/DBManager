import express from "express";
import cors from "cors";
import pgPromise from 'pg-promise';

const router = express.Router();

const app = express();

app.use(express.json());
app.use(cors());

const dbConfig = {
  host: 'your_database_host',
  port: 5432,
  database: 'your_database_name',
  user: 'your_database_user',
  //password: 'your_database_password',
};

const pgp = pgPromise();
const db = pgp(dbConfig);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

app.post("/api/createTable", async(req,res) =>{
  const { tableName, tableColumns, dbName, dbPassword, primaryKey} = req.body;
    // Validate inputs
    if (!tableName || !tableColumns) {
      return res.status(400).json({ success: false, error: 'Invalid input' });
    }
  
    try {

      if(!primaryKey){
        const createTableQuery = `CREATE TABLE ${tableName} (${tableColumns})`;
        const dbConnection = pgp({
          host: 'localhost',
          port: 5432,
          database: dbName,
          user: 'klaudiazalewska',
          password: '2',
    
        });
        await dbConnection.query(createTableQuery);
        console.log(createTableQuery);
        console.log('tableName: ' + tableName+'dbname: '+dbName +' PASS'+dbPassword);
       
      }
      else{
        const createTableQuery = `CREATE TABLE ${tableName} (${tableColumns},PRIMARY KEY (${primaryKey}))`;
        const dbConnection = pgp({
          host: 'localhost',
          port: 5432,
          database: dbName,
          user: 'klaudiazalewska',
          password: '2',
    
        });
        console.log(createTableQuery);
        console.log('tableName: ' + tableName+'dbname: '+dbName +' PASS'+dbPassword);
  
        await dbConnection.query(createTableQuery);
          
      }  
      res.json({ success: true });
    } catch (error) {
      console.error('Error creating table:',error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
 // res.json({message:"api/tables runns"});
  
});
app.get("/api/notes", async (req, res) => {
  res.json({ message: "success!" });
});

app.listen(5001, () => {
  console.log("server running on localhost:5001");
});