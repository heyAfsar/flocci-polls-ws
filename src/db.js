import pg from "pg";
import 'dotenv/config'

const {Pool} = pg

const pool = new Pool({
    
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: {
      rejectUnauthorized: false
    }
})

const dbConnect = async ()=>{
try{
    await pool.connect()
    console.log('Database Connected Sucessfully');
  }
  catch(error){
    console.log(error);
  }
}

export {dbConnect , pool}
