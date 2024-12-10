import { json } from '@sveltejs/kit';
import fs from 'fs';

// src/routes/[lessonId]/+server.js
export function GET({ params }: { params: { lessonId: string } }) {
	const { lessonId } = params;
	const data = JSON.parse(fs.readFileSync(`src/lib/data/lessons/${lessonId}.json`, 'utf-8'));
	return json(data);
}
