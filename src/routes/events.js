const express = require("express");
const eventRouter = express.Router();
const db = require("../config/database");
const { parse } = require("dotenv");

eventRouter.post("/create/user", async(req,res)=>{
    try{
        const {name,email} = req.body;

        const isUser = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if(isUser.rows.length>0){
            res.status(400).json({error:"User already exists"})
        }

        const data = await db.query(
        `INSERT  INTO users(name,email) VALUES($1,$2) RETURNING id`,
        [name,email]
        );

        res.status(200).json({message: "User created", User_Id:data.rows[0].id});

    }catch(err){
        res.status(404).json({error : "User not created"});
    }
})
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
eventRouter.get("/event/:eventId", async(req,res)=>{
    try{
        const {eventId} = req.params;
        
        const eventData = await db.query(
        `SELECT * FROM events WHERE id = $1`,[eventId]
        );

        if(eventData.rows.length ===0){
            return res.status(404).json({error:"Event not found"});
        }

        const registeredUser = await db.query(
        `SELECT * FROM registrations WHERE event_id = $1`,
        [eventId]
        );

        const numberOfRegisterdUser = registeredUser.rows.length === 0? 0: registeredUser.rows.length;

        res.status(200).json({message: " Events found",
             event: eventData.rows,
             RegisteredUser :numberOfRegisterdUser
        });

    }catch(err){
        res.status(404).json({error : "Event not found"});
    }
})

eventRouter.post("/event/:eventId/register", async(req,res)=>{
    try{
        const userId = req.body.id;
        const {eventId} = req.params;

        const isUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if(isUser.rows.length ===0){
          return  res.status(400).json({error:"User not found"});
        }

        const isAlreadyRegistered = await db.query(
            `SELECT * FROM registrations WHERE user_id=$1 AND event_id = $2`,
            [userId,eventId]
        )

        if(isAlreadyRegistered.rows.length >0){
          return  res.status(400).json({error:"User is already registered for this event"});
        }

        const registeredUser = await db.query(
        `SELECT COUNT(*) AS cnt FROM registrations WHERE event_id = $1`,
        [eventId]
        );
        const eventDetail = await db.query(
        `SELECT datetime,capacity FROM events WHERE id = $1`,
        [eventId]
        );
        if(eventDetail.rows.length === 0){
          return   res.status(404).json({error:"Event not found"})
        }

        const event = eventDetail.rows[0];

        if(new Date(event.datetime)< new Date()) {
          return  res.status(400).json({error:"Registration cannot be done for past event"})
        }

        if(parseInt(registeredUser.rows[0].cnt) >= event.capacity) {
          return  res.status(400).json({error:"Event is full"})
        }

        const registeredData = await db.query(
            `INSERT INTO registrations(user_id,event_id) VALUES($1,$2) RETURNING *`,
            [userId,eventId]
        )

        res.status(201).json({message:"User Registered for this event",
            data : registeredData.rows[0]
        })

    }catch(err){
        res.status(500).json({error : err.message});
    }
})

eventRouter.delete("/event/:eventId/cancle", async(req,res)=>{
    try{
        const userId = req.body.id;
        const {eventId} = req.params;

        const isUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if(isUser.rows.length ===0){
          return  res.status(404).json({error:"User not found"});
        }

        const isUserRegistered = await db.query(
            `SELECT * FROM registrations WHERE user_id=$1 AND event_id = $2`,
            [userId,eventId]
        )

        if(isUserRegistered.rows.length ===0){
          return  res.status(400).json({error:"User not registered for this event"});
        }

        const cancleRegistration = await db.query(
            `DELETE FROM registrations WHERE user_id=$1 AND event_id=$2`,
            [userId,eventId]
        )   
        console.log(cancleRegistration);
        
        res.status(200).json({message:"User Registeration for this event is cancled"})

    }catch(err){
        res.status(500).json({error : err.message});
    }
})



module.exports = {eventRouter};