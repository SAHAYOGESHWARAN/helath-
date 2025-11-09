import Stripe from 'stripe';
import { Claim, BillingInvoice } from '@/types';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export const getClaims = async (): Promise<Claim[]> => {
  try {
    // const response = await stripe.claims.list();
    // return response.data as Claim[];
    console.log('Simulating fetching claims from Stripe');
    return Promise.resolve([]);
  } catch (error) {
    console.error('Error fetching claims from Stripe:', error);
    return [];
  }
};

export const getInvoices = async (): Promise<BillingInvoice[]> => {
  try {
    // const response = await stripe.invoices.list();
    // return response.data as BillingInvoice[];
    console.log('Simulating fetching invoices from Stripe');
    return Promise.resolve([]);
  } catch (error) {
    console.error('Error fetching invoices from Stripe:', error);
    return [];
  }
};

export const addClaim = async (claim: Omit<Claim, 'id'>): Promise<Claim> => {
  try {
    // const response = await stripe.claims.create(claim);
    // return response as Claim;
    console.log('Simulating adding claim through Stripe:', claim);
    const newClaim: Claim = { ...claim, id: `CLM${Date.now()}` };
    return Promise.resolve(newClaim);
  } catch (error) {
    console.error('Error adding claim through Stripe:', error);
    throw error;
  }
};

export const addInvoice = async (invoice: Omit<BillingInvoice, 'id'>): Promise<BillingInvoice> => {
  try {
    // const response = await stripe.invoices.create(invoice);
    // return response as BillingInvoice;
    console.log('Simulating adding invoice through Stripe:', invoice);
    const newInvoice: BillingInvoice = { ...invoice, id: `inv_${Date.now()}` };
    return Promise.resolve(newInvoice);
  } catch (error) {
    console.error('Error adding invoice through Stripe:', error);
    throw error;
  }
};

export const makePayment = async (invoiceId: string, amount: number): Promise<BillingInvoice> => {
  try {
    // const response = await stripe.invoices.pay(invoiceId);
    // return response as BillingInvoice;
    console.log('Simulating making payment through Stripe:', invoiceId, amount);
    const updatedInvoice: BillingInvoice = {
      id: invoiceId,
      patientId: 'pat1',
      date: '2024-08-01',
      dueDate: '2024-09-01',
      totalAmount: 25,
      amountDue: 0,
      status: 'Paid',
      description: 'Co-pay for lab work'
    };
    return Promise.resolve(updatedInvoice);
  } catch (error) {
    console.error('Error making payment through Stripe:', error);
    throw error;
  }
};
