const express = require("express");
const eventRouter = express.Router();
const db = require("../config/database")

eventRouter.post("/create/event", async(req,res)=>{
    try{
        const {title,datetime,location,capacity} = req.body;

        if(!(capacity>0 && capacity <= 1000)){
            return res.status(400).json({error:"Capacity is between 0 to 1000"});
        }

        const data = await db.query(
        `INSERT  INTO events(title,datetime,location,capacity) VALUES($1,$2,$3,$4) RETURNING id`,
        [title,datetime,location,capacity]
        );

        res.status(200).json({message: " Events created", data: "Event Id is "+data.rows[0].id});

    }catch(err){
        res.status(404).json({error : "Event not created"});
    }
})

module.exports = {eventRouter};