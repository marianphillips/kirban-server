import express, { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from "@prisma/client"
import * as fs from 'fs';
import * as path from 'path';


const secret = fs.readFileSync(path.join(__dirname, '../../private.key'));

const dbClient = new prisma.PrismaClient()

export const login = async (req : Request, res : Response) => {

  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({
        status: 'fail',
      })
  }

  try {
    const foundUser = await dbClient.user.findUnique({
        where: {
          email: email
        },
      })

      if (!foundUser) {
        return res.status(401).json({
          status: 'fail',
          message: "User not found"
        })
      }
  
    const areCredentialsValid = await validateCredentials(password, foundUser)

    if (!areCredentialsValid) {
      return res.status(401).json({
        status: 'fail',
        message: "Incorrect details"
      })
    }

    const token = generateJwt(foundUser.id)

    return res.status(200).json({
        status: 'success'
      })

  } catch (e) {
    // console.error('error processing login', e.message)
    return res.status(500).json({
        status: 'fail',
        message: "500 bad request"
      })
  }
}

function generateJwt(userId: number) {
  return jwt.sign({ userId }, secret, { expiresIn: process.env.JWT_EXPIRY })
}

async function validateCredentials(password : string, user : prisma.User) {
  if (!user) {
    return false
  }

  if (!password) {
    return false
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return false
  }

  return true
}
