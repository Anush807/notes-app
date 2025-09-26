import { Hono } from 'hono';
import { authRoute } from './routes/authRoute';
import { notesRoute } from './routes/notesRoute';


const app = new Hono();

app.route("/api/v1/auth", authRoute);
app.route("/api/v1/notes",notesRoute);

export default app;