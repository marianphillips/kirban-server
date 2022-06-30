import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import prisma from "@prisma/client"
import validator from 'email-validator'

const dbClient = new prisma.PrismaClient()

export const createUser = async (req : Request, res : Response) => {
    // console.log(req)
    const passwordHash = await bcrypt.hash(req.body.password, 8)
  
    try {
      const existingUser = await dbClient.user.findUnique({
        where: {
          email: req.body.email
        },
    })
  
      if (existingUser) {
        return res.status(400).json({
            status: 'fail, email already in use',
          })
      }

      if (!validator.validate(req.body.email)) {
        return res.status(400).json({
            status: 'fail, invalid email address',
          })
      }

     const createdUser = await dbClient.user.create({
      data: {
        email: req.body.email,
        password: passwordHash,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }})
  
      return res.status(200).json({
        status: 'success',
        data: createdUser
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'fail, server error',
      })
    }
  }