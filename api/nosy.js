/* eslint-env node */
/* eslint-disable no-control-regex */

const XAI_ENDPOINT = 'https://api.x.ai/v1/responses';
const XAI_MODEL = 'grok-4.20-0309-non-reasoning';
const REQUEST_TIMEOUT_MS = 25000;
const LOW_CONFIDENCE_THRESHOLD = 0.48;
const MAX_OUTPUT_TOKENS = 650;

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['Q1', 'Q2', 'Q3', 'confidence'],
  properties: {
    Q1: { type: 'string', minLength: 12, maxLength: 180 },
    Q2: { type: 'string', minLength: 12, maxLength: 180 },
    Q3: { type: 'string', minLength: 12, maxLength: 180 },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
  },
};

const SENSITIVE_PATTERN = /\b(afghan|afghanistan|apartment|asylum|bank|birthdate|child|children|citizenship|country of origin|credit|debt|diagnos\w*|disability|ethnic\w*|financial|home country|immigration|income|insurance|iranian?|medication|minor|mortgage|national origin|net worth|phone|pregnan\w*|refugee|salary|ssn|tax|therapy|visa)\b|\b(health|medical) (condition|history|record|records|diagnosis|status|treatment|information)\b|\b(home|street|mailing|residential|private) address\b|\b(personal|mobile|cell) phone\b|\b(political affiliation|sexual orientation|protected class|race|religion|nationality|citizenship status|gender identity)\b/i;

const FALLBACKS = {
  missing_key: [
    'How much did the booth need before you decided it was allowed to ask back?',
    'Which part felt harmless: the name, the email, the camera, or the way they arrived together?',
    'If the machine cannot find you, does that make the exchange feel better or just unfinished?',
  ],
  timeout: [
    'How long would you wait for a machine that already has your face on the screen?',
    'When the booth pauses, do you trust it more or start wondering what it is doing?',
    'What made this feel like a game before the questions appeared?',
  ],
  low_confidence: [
    'What did you think would happen after giving a stranger booth your name?',
    'Why did a camera make the form feel less like a form?',
    'Where did the fun end and the permission begin?',
  ],
  sensitive: [
    'What should a booth refuse to make entertaining?',
    'Which details become dangerous when they are turned into a performance?',
    'What kind of question would make you leave the room?',
  ],
  unavailable: [
    'What did the booth promise without saying it out loud?',
    'How quickly did the portrait make the machine feel personal?',
    'If nothing specific appears, why does the exchange still feel nosy?',
  ],
};

const SAFE_QUESTION_REPLACEMENTS = [
  'Which public-facing trace made the booth connect your name to your work so quickly?',
  'Which old project title feels different when a stranger asks about it here?',
  'What did you expect this booth to keep as play before it answered back?',
];

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

const fallback = (reason) => {
  const [Q1, Q2, Q3] = FALLBACKS[reason] || FALLBACKS.unavailable;
  return { Q1, Q2, Q3, confidence: 0, sourceCount: 0 };
};

const publicQuestions = ({ Q1, Q2, Q3 }) => ({ Q1, Q2, Q3 });

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

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const extractText = (responseBody) => {
  if (typeof responseBody?.output_text === 'string') return responseBody.output_text;

  const output = Array.isArray(responseBody?.output) ? responseBody.output : [];
  for (const item of output) {
    if (!Array.isArray(item.content)) continue;
    const textPart = item.content.find((part) => part.type === 'output_text' && part.text);
    if (textPart) return textPart.text;
  }

  return '';
};

const collectSourceMetadata = (responseBody) => {
  const sources = new Map();
  const output = Array.isArray(responseBody?.output) ? responseBody.output : [];

  for (const item of output) {
    if (Array.isArray(item.content)) {
      for (const part of item.content) {
        const annotations = Array.isArray(part.annotations) ? part.annotations : [];
        for (const annotation of annotations) {
          if (annotation.url) {
            sources.set(annotation.url, {
              url: annotation.url,
              title: annotation.title || '',
              type: annotation.type || 'url_citation',
            });
          }
        }
      }
    }

    const actionSources = Array.isArray(item.action?.sources) ? item.action.sources : [];
    for (const source of actionSources) {
      if (source.url) {
        sources.set(source.url, {
          url: source.url,
          title: source.title || '',
          type: source.type || 'search_source',
        });
      }
    }

    if (item.action?.url) {
      sources.set(item.action.url, {
        url: item.action.url,
        title: '',
        type: item.action.type || 'open_page',
      });
    }
  }

  return [...sources.values()];
};

const normalizeQuestion = (value) => {
  const cleaned = cleanString(value, 180);
  if (!cleaned) return '';
  if (cleaned.endsWith('?')) return cleaned;

  const question = `${cleaned.replace(/[.!,;:]+$/, '')}?`;
  return question.length > 180 ? `${question.slice(0, 179).trimEnd()}?` : question;
};

const sanitizeResult = (candidate, sourceCount) => {
  const questions = [candidate.Q1, candidate.Q2, candidate.Q3].map(normalizeQuestion);
  const confidence = Math.max(0, Math.min(1, Number(candidate.confidence) || 0));

  if (questions.some((question) => question.length < 12)) {
    return fallback('low_confidence');
  }

  if (confidence < LOW_CONFIDENCE_THRESHOLD || sourceCount < 1) {
    return fallback('low_confidence');
  }

  const protectedQuestions = questions.map((question, index) =>
    SENSITIVE_PATTERN.test(question) ? SAFE_QUESTION_REPLACEMENTS[index] : question,
  );
  const replacementCount = protectedQuestions.filter((question, index) => question !== questions[index]).length;

  return {
    Q1: protectedQuestions[0],
    Q2: protectedQuestions[1],
    Q3: protectedQuestions[2],
    confidence: replacementCount ? Math.min(confidence, 0.62) : confidence,
    sourceCount,
  };
};

const buildXaiRequest = ({ fullName, email, sessionId }) => {
  const responseFormat = {
    type: 'json_schema',
    name: 'nosy_questions',
    strict: true,
    schema: RESPONSE_SCHEMA,
  };

  return {
    model: XAI_MODEL,
    store: false,
    temperature: 0.25,
    max_output_tokens: MAX_OUTPUT_TOKENS,
    max_turns: 3,
    parallel_tool_calls: true,
    tool_choice: 'required',
    tools: [
      { type: 'web_search' },
      { type: 'x_search' },
    ],
    text: {
      format: responseFormat,
    },
    input: [
      {
        role: 'system',
        content: [
          'You are Nosy, a constrained public-data art booth.',
          'Use web_search and x_search to find only public traces associated with the submitted full name and email.',
          'Generate exactly three unsettling but safe questions, not claims.',
          'Questions may reference public work, posts, projects, writing, talks, usernames, organizations, or artifacts if the evidence is strong.',
          'Never include home address, phone number, personal health or medical history, financial information, protected-class claims, national origin, immigration details, private family details, minors, doxxing material, or source URLs.',
          'Public organization names, healthcare company names, and public work domains may be used when they are clearly professional context rather than private attributes.',
          'If a private category would be necessary for a question, ask about the public trace or project instead.',
          'If evidence is weak, return low confidence and generic questions that clearly admit uncertainty.',
          'Use plain English only.',
          'Output only JSON matching the schema.',
        ].join(' '),
      },
      {
        role: 'user',
        content: JSON.stringify({
          fullName,
          email,
          sessionId,
          photoPolicy: 'No photo was provided. Do not infer from images.',
        }),
      },
    ],
  };
};

const callXai = async (payload) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(XAI_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    const body = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = body?.error?.message || body?.message || `xAI request failed with ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return body;
  } finally {
    clearTimeout(timeout);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  let body;
  try {
    body = await parseBody(req);
  } catch (_err) {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  if (body.photo || body.image || body.file || body.capture) {
    sendJson(res, 400, {
      error: 'Photos are intentionally not accepted by this endpoint.',
      ...fallback('sensitive'),
    });
    return;
  }

  const fullName = cleanString(body.fullName, 90);
  const email = cleanString(body.email, 254).toLowerCase();
  const sessionId = cleanString(body.sessionId, 120);

  if (fullName.length < 2 || !isEmail(email) || sessionId.length < 8) {
    sendJson(res, 400, { error: 'fullName, email, and sessionId are required.' });
    return;
  }

  if (!process.env.XAI_API_KEY) {
    sendJson(res, 200, publicQuestions(fallback('missing_key')));
    return;
  }

  try {
    const xaiResponse = await callXai(buildXaiRequest({ fullName, email, sessionId }));
    const sourceMetadata = collectSourceMetadata(xaiResponse);
    const sourceCount = sourceMetadata.length;

    if (process.env.NODE_ENV !== 'production') {
      console.info('[nosy] source metadata', {
        sessionId,
        sourceCount,
        sources: sourceMetadata,
      });
    }

    const outputText = extractText(xaiResponse);
    const parsed = JSON.parse(outputText);
    sendJson(res, 200, publicQuestions(sanitizeResult(parsed, sourceCount)));
  } catch (err) {
    const reason = err.name === 'AbortError' ? 'timeout' : 'unavailable';
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[nosy] fallback', {
        sessionId,
        reason,
        message: err.message,
      });
    }
    sendJson(res, 200, publicQuestions(fallback(reason)));
  }
}
