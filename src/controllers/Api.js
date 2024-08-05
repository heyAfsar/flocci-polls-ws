import { pool } from "../db.js"

const insertData = async (body ,pollid)=>{

try {
        const votes = body
        const result = await pool.query(`SELECT username FROM pollrecord WHERE poll_id = $1`, [pollid])
    
        const schema = result.rows[0].username
        for (let table in votes){
            let data = await pool.query(`SELECT * FROM ${schema}.${table}`)
            let updatedValue = 0;
            if (votes[table]) 
                {
                    if(!data.rowCount)
                        {
                            updatedValue = 1
                            await pool.query(`INSERT INTO ${schema}.${table} VALUES ($1)`, [updatedValue])
                        }
                    else {
                        updatedValue = data.rows[0].value
                        updatedValue++
                        await pool.query(`UPDATE ${schema}.${table} SET value = $1`,[updatedValue])
                    }
                }
            else{
                if(!data.rowCount)
                    {
                        updatedValue = 0
                        await pool.query(`INSERT INTO ${schema}.${table} VALUES ($1)`, [updatedValue])
                    }
                else {
                    updatedValue = data.rows[0].value
                    updatedValue--
                    await pool.query(`UPDATE ${schema}.${table} SET value = $1`,[updatedValue])
                }
            }
        }
} catch (error) {
    console.log(error)
}
}


const readData = async(body)=>{
 try{
    const result = await pool.query(`SELECT * FROM pollrecord WHERE user_id = $1`,[body])
    const schema = result.rows[0].username
    const table  = result.rows[0].pollname
    const data = await pool.query(`SELECT * FROM ${schema}.${table}`) 
    const {poll_id , ...fields} = data.rows[0]
    const filtered = Object.fromEntries(
        Object.entries(fields).filter(([key, value]) => value !== null)
      );
     const resobject = []
    for(let field in filtered ){
         const res = await pool.query(`SELECT * FROM ${schema}.${filtered[field]}`)
         if(!res.rowCount){
            resobject.push ({[filtered[field]] : 0})
         }
         else{
            resobject.push ({[filtered[field]] : res.rows[0].value}) 
         }
    }
    return resobject
  }
  catch(error){
    console.log(error)
  } 
}

export {insertData , readData}