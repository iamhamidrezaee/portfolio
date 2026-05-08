/* eslint-disable no-control-regex */
/* global process */
import { Buffer } from 'node:buffer';
import { Resend } from 'resend';

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const DEFAULT_FROM = 'The Exhibition <hamid@iamhamidrezaee.com>';
const DATA_URL_PATTERN = /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=\r\n]+)$/;

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8') || '{}');
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

const cleanString = (value, maxLength) =>
  String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizeQuestions = (body) => {
  const rawQuestions = Array.isArray(body.questions)
    ? body.questions
    : [body.Q1, body.Q2, body.Q3];

  const questions = rawQuestions
    .map((question) => cleanString(question, 220))
    .filter(Boolean)
    .slice(0, 3);

  if (questions.length !== 3) {
    throw new Error('Three questions are required.');
  }

  return questions;
};

const parseImage = (stripDataUrl) => {
  const match = DATA_URL_PATTERN.exec(String(stripDataUrl || ''));
  if (!match) {
    throw new Error('A PNG, JPEG, or WEBP data URL is required.');
  }

  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  const content = match[2].replace(/\s/g, '');
  const bytes = Buffer.from(content, 'base64');

  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) {
    throw new Error('Image attachment is missing or too large.');
  }

  return { content, extension };
};

const buildHtml = ({ fullName, questions }) => {
  const rows = questions
    .map(
      (question, index) =>
        `<p style="margin:0 0 16px;"><strong>Q${index + 1}</strong><br>${escapeHtml(question)}</p>`,
    )
    .join('');

  return `
    <div style="background:#050505;color:#f7f4ee;font-family:Arial,sans-serif;padding:28px;">
      <p style="margin:0 0 20px;color:#bdb5a8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Nosy photo booth</p>
      <h1 style="margin:0 0 18px;font-size:30px;line-height:1;">${escapeHtml(fullName || 'Your photo strip')}</h1>
      <p style="margin:0 0 24px;color:#d8d0c3;">Your strip is attached. The booth printed these questions.</p>
      ${rows}
    </div>
  `;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    sendJson(res, 503, { error: 'Email is unavailable.' });
    return;
  }

  let body;
  try {
    body = await parseBody(req);
  } catch (_err) {
    sendJson(res, 400, { error: 'Invalid request.' });
    return;
  }

  try {
    const fullName = cleanString(body.fullName, 90);
    const email = cleanString(body.email, 254).toLowerCase();
    const sessionId = cleanString(body.sessionId, 120).replace(/[^a-z0-9_-]/gi, '').slice(0, 64);
    const questions = normalizeQuestions(body);
    const image = parseImage(body.stripDataUrl);

    if (fullName.length < 2 || !isEmail(email) || sessionId.length < 8) {
      sendJson(res, 400, { error: 'Invalid request.' });
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to: [email],
      subject: 'Your Nosy photo strip',
      html: buildHtml({ fullName, questions }),
      attachments: [
        {
          content: image.content,
          filename: `nosy-strip-${sessionId || Date.now()}.${image.extension}`,
        },
      ],
    });

    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[nosy-email] resend error', { message: error.message, name: error.name });
      }
      sendJson(res, 502, { error: 'Email could not be sent.' });
      return;
    }

    sendJson(res, 200, { ok: true });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[nosy-email] rejected request', { message: err.message });
    }
    sendJson(res, 400, { error: 'Invalid request.' });
  }
}
