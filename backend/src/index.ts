import { Hono } from 'hono';
import { authRoute } from './routes/authRoute';
import { notesRoute } from './routes/notesRoute';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/api/*', cors())
app.route("/api/v1/auth", authRoute);
app.route("/api/v1/notes",notesRoute);

export default app;