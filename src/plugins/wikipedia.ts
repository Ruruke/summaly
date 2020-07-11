import * as URL from 'url';
import fetch from 'node-fetch';
import { httpAgent, httpsAgent } from '../utils/agent';
import * as debug from 'debug';
import summary from '../summary';
import clip from './../utils/clip';

const log = debug('summaly:plugins:wikipedia');

export function test(url: URL.Url): boolean {
	return /\.wikipedia\.org$/.test(url.hostname);
}

export async function summarize(url: URL.Url): Promise<summary> {
	const lang = url.host.split('.')[0];
	const title = url.pathname.split('/')[2];
	const endpoint = `https://${lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}`;

	log(`lang is ${lang}`);
	log(`title is ${title}`);
	log(`endpoint is ${endpoint}`);

	const body = await fetch(new URL.URL(endpoint).href, {
		timeout: 10 * 1000,
		agent: u => u.protocol == 'http:' ? httpAgent : httpsAgent
	}).then(res => {
		if (!res.ok) {
			throw `${res.status} ${res.statusText}`;
		} else {
			return res.json();
		}
	});

	log(body);

	if (!('query' in body) || !('pages' in body.query)) {
		throw 'fetch failed';
	}

	const info = body.query.pages[Object.keys(body.query.pages)[0]];

	return {
		title: info.title,
		icon: 'https://wikipedia.org/static/favicon/wikipedia.ico',
		description: clip(info.extract, 300),
		thumbnail: `https://wikipedia.org/static/images/project-logos/${lang}wiki.png`,
		player: {
			url: null,
			width: null,
			height: null
		},
		sitename: 'Wikipedia'
	};
}
