import { Request, Response } from 'express';
import { Users, Doctors, Orgs, Pharmas } from '../models';
import nodemailer from 'nodemailer';
import { JWTController } from '../utils';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const jwtController = new JWTController()

let MAGIC_LINK_BASE_URL = 'http://localhost:9999';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.google.com';
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER || 'jesuswrites20043@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'xqzeesjyxpzwnht';

// Email setup
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

class AuthController {
    private async sendMagicLink(email: string, walletAddress: string, role: 'doctor' | 'pharmacist' | 'patient' | 'org', id: string): Promise<void> {
        const token = jwtController.signAccessToken({ walletAddress, role, email, id });
      
        const magicLink = `${MAGIC_LINK_BASE_URL}?token=${token}`;
      
        await transporter.sendMail({
          from: `"Your App Name" <${SMTP_USER}>`,
          to: email,
          subject: 'Your Magic Login Link',
          html: `
            <p>Hello,</p>
            <p>Click the link below to login:</p>
            <a href="${magicLink}">${magicLink}</a>
            <p>This link will expire in 72 hours.</p>
          `,
        });
      }
      

  // --- USER ---
  async createUser(req: Request, res: Response): Promise<void> {
    const { walletAddress, username, role, email } = req.body;

    try {
      const existing = await Users.findOne({ walletAddress });
      if (existing)  res.status(200).json(existing);

      const user = await Users.create({ walletAddress, username, role, email });
      await this.sendMagicLink(email, walletAddress, user.role, user._id);
      res.status(201).json({ message: 'User created and magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'User creation failed', details: err });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.body;

    try {
      const user = await Users.findOne({ walletAddress });
      if (!user)  res.status(404).json({ error: 'User not found' });

      await this.sendMagicLink(user.email, walletAddress, user.role, user._id);
      res.status(200).json({ message: 'Magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'User login failed', details: err });
    }
  }

  // --- DOCTOR ---
  async createDoctor(req: Request, res: Response): Promise<void> {
    const { walletAddress, username, role, name, orgId, email } = req.body;

    try {
      const existing = await Doctors.findOne({ walletAddress });
      if (existing)  res.status(200).json(existing);

      const doctor = await Doctors.create({ walletAddress, username, role, name, orgId, email });
      await this.sendMagicLink(email, walletAddress, role, doctor._id);
      res.status(201).json({ message: 'Doctor created and magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Doctor creation failed', details: err });
    }
  }

  async loginDoctor(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.body;

    try {
      const doctor = await Doctors.findOne({ walletAddress });
      if (!doctor)  res.status(404).json({ error: 'Doctor not found' });

      await this.sendMagicLink(doctor.email, walletAddress, doctor.role, doctor._id);
      res.status(200).json({ message: 'Magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Doctor login failed', details: err });
    }
  }

  // --- ORG ---
  async createOrg(req: Request, res: Response): Promise<void> {
    const { walletAddress, username, role, name, email } = req.body;

    try {
      const existing = await Orgs.findOne({ walletAddress });
      if (existing)  res.status(200).json(existing);

      const org = await Orgs.create({ walletAddress, username, role, name, email });
      await this.sendMagicLink(email, walletAddress, role, org._id);
      res.status(201).json({ message: 'Organization created and magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Organization creation failed', details: err });
    }
  }

  async loginOrg(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.body;

    try {
      const org = await Orgs.findOne({ walletAddress });
      if (!org)  res.status(404).json({ error: 'Organization not found' });

      await this.sendMagicLink(org.email, walletAddress, org.role, org._id);
      res.status(200).json({ message: 'Magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Organization login failed', details: err });
    }
  }

  // --- PHARMACIST ---
  async createPharmacist(req: Request, res: Response): Promise<void> {
    const { walletAddress, username, role, name, orgId, email } = req.body;

    try {
      const existing = await Pharmas.findOne({ walletAddress });
      if (existing)  res.status(200).json(existing);

      const pharmacist = await Pharmas.create({ walletAddress, username, role, name, orgId, email });
      await this.sendMagicLink(email, walletAddress, role, pharmacist._id);
      res.status(201).json({ message: 'Pharmacist created and magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Pharmacist creation failed', details: err });
    }
  }

  async loginPharmacist(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.body;

    try {
      const pharma = await Pharmas.findOne({ walletAddress });
      if (!pharma)  res.status(404).json({ error: 'Pharmacist not found' });

      await this.sendMagicLink(pharma.email, walletAddress, pharma.role, pharma._id);
      res.status(200).json({ message: 'Magic link sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Pharmacist login failed', details: err });
    }
  }
}

export const authController = new AuthController();
