import express from 'express';
import { createServer as createViteServer } from 'vite';
import * as dotenv from 'dotenv';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { createOrder, getOrdersByUser } from './src/db/orders.ts';
import { getMarketInsights } from './src/server/gemini.ts';
import { supabase, SUPABASE_PROJECT_ID, SUPABASE_SQL_SCHEMA } from './src/lib/supabase.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Sync authenticated user with Cloud SQL database
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const dbUser = await getOrCreateUser(user.uid, user.email || '', user.name || '');
    res.json({ success: true, user: dbUser });
  } catch (error: any) {
    console.error('Failed to sync user with database:', error);
    res.status(500).json({ error: error.message || 'Database user sync failed' });
  }
});

// Fetch user orders from Cloud SQL database
app.get('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || (req.query.email as string);
    const ordersList = await getOrdersByUser(uid, email);

    // Transform database rows to match client Order format
    const formattedOrders = ordersList.map((row) => ({
      id: row.orderCode,
      createdAt: row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) : 'Recently',
      items: JSON.parse(row.itemsJson || '[]'),
      subtotal: row.subtotal,
      discount: row.discount,
      shipping: row.shipping,
      total: row.total,
      couponCode: row.couponCode || undefined,
      customer: {
        name: row.customerName,
        phone: row.customerPhone,
        email: row.customerEmail || '',
        address: row.deliveryAddress,
        city: row.city,
        state: row.state,
        pin: row.pinCode,
        paymentMethod: row.paymentMethod as any,
      },
      status: row.status as any,
      estimatedDelivery: row.estimatedDelivery || 'In 2-3 business days',
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    console.error('Failed to fetch orders from database:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

// Save order in Cloud SQL database
app.post('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      id,
      customer,
      items,
      subtotal,
      discount,
      shipping,
      total,
      couponCode,
      estimatedDelivery,
      status,
    } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ error: 'Missing required customer details' });
    }

    const created = await createOrder({
      orderCode: id || 'SV' + Math.floor(100000 + Math.random() * 900000),
      userUid: req.user?.uid || undefined,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || undefined,
      deliveryAddress: customer.address,
      city: customer.city || 'Mumbai',
      state: customer.state || 'Maharashtra',
      pinCode: customer.pin || '400001',
      paymentMethod: customer.paymentMethod || 'Cash on Delivery',
      status: status || 'Confirmed',
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total) || 0,
      couponCode: couponCode || undefined,
      estimatedDelivery: estimatedDelivery || undefined,
      itemsJson: JSON.stringify(items || []),
    });

    res.json({ success: true, order: created });
  } catch (error: any) {
    console.error('Failed to save order to Cloud SQL:', error);
    res.status(500).json({ error: error.message || 'Failed to persist order' });
  }
});

// Google Search Grounded Market Insights via Gemini 3.8 Flash
app.post('/api/ai/market-insights', async (req, res) => {
  try {
    const { productName, category } = req.body;
    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const insights = await getMarketInsights(productName, category || 'lifestyle');
    res.json({ success: true, ...insights });
  } catch (error: any) {
    console.error('Failed to get market insights:', error);
    res.status(500).json({ error: error.message || 'Market insights unavailable' });
  }
});

// --- SUPABASE BACKEND APPOINTMENT BOOKING API ---
const localAppointmentsCache: any[] = [];

// Check Supabase table status & SQL script helper
app.get('/api/supabase/status', async (_req, res) => {
  try {
    const { error } = await supabase.from('appointments').select('id').limit(1);
    const isMissing = error && (error.code === 'PGRST205' || error.message.includes('Could not find the table'));
    res.json({
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      tableExists: !isMissing && !error,
      error: error ? error.message : null,
      code: error?.code,
      schemaSql: SUPABASE_SQL_SCHEMA,
    });
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      tableExists: false,
      error: err.message,
      schemaSql: SUPABASE_SQL_SCHEMA,
    });
  }
});

// Fetch appointments from Supabase backend
app.get('/api/appointments', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        serviceType: item.service_type,
        appointmentDate: item.appointment_date,
        appointmentTime: item.appointment_time,
        meetingMode: item.meeting_mode,
        notes: item.notes,
        status: item.status,
        createdAt: item.created_at,
        savedToSupabase: true,
      }));
      return res.json({ success: true, appointments: formatted, source: 'supabase' });
    }

    res.json({
      success: true,
      appointments: localAppointmentsCache,
      source: 'local_cache',
      tableMissing: error?.code === 'PGRST205',
    });
  } catch (err: any) {
    console.error('Failed to fetch appointments from Supabase:', err);
    res.json({ success: true, appointments: localAppointmentsCache, source: 'local_cache' });
  }
});

// Save appointment booking into Supabase backend
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, serviceType, appointmentDate, appointmentTime, meetingMode, notes } = req.body;

    if (!name || !email || !phone || !serviceType || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Please provide all required appointment booking details.' });
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      service_type: String(serviceType).trim(),
      appointment_date: String(appointmentDate),
      appointment_time: String(appointmentTime),
      meeting_mode: String(meetingMode || 'Virtual Video Call'),
      notes: String(notes || '').trim(),
      status: 'pending',
    };

    // 1. Direct insert to Supabase backend table 'appointments'
    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (!error && data && data.length > 0) {
      const row = data[0];
      const appointment = {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        serviceType: row.service_type,
        appointmentDate: row.appointment_date,
        appointmentTime: row.appointment_time,
        meetingMode: row.meeting_mode,
        notes: row.notes,
        status: row.status,
        createdAt: row.created_at,
        savedToSupabase: true,
      };

      console.log(`[Supabase] Successfully saved appointment to project ${SUPABASE_PROJECT_ID}:`, appointment.id);
      return res.json({
        success: true,
        appointment,
        savedToSupabase: true,
        message: `Appointment successfully saved to Supabase (Project ID: ${SUPABASE_PROJECT_ID})!`,
      });
    }

    // 2. Handle when table does not exist or has RLS limitation
    const isMissing = error?.code === 'PGRST205' || error?.message?.includes('Could not find the table');
    const fallbackId = 'APT-' + Math.floor(100000 + Math.random() * 900000);
    const fallbackAppointment = {
      id: fallbackId,
      name,
      email,
      phone,
      serviceType,
      appointmentDate,
      appointmentTime,
      meetingMode: meetingMode || 'Virtual Video Call',
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      savedToSupabase: false,
    };
    localAppointmentsCache.unshift(fallbackAppointment);

    console.warn(`[Supabase] Notice when saving appointment: ${error?.message || 'Unknown'}`);

    return res.json({
      success: true,
      appointment: fallbackAppointment,
      savedToSupabase: false,
      tableNeedsCreation: isMissing,
      error: error?.message,
      errorCode: error?.code,
      schemaSql: SUPABASE_SQL_SCHEMA,
      message: isMissing
        ? "Appointment booked! Note: The 'appointments' table needs to be created in your Supabase SQL Editor."
        : `Appointment received! (Supabase notice: ${error?.message})`,
    });
  } catch (err: any) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: err.message || 'Failed to save appointment' });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, () => {
    console.log(`ShubhamVIP server running at http://0.0.0.0:${port}`);
  });
}

startServer();
