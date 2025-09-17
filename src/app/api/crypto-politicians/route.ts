import { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

type CsvRow = {
	Name: string;
	'Stance on crypto': string;
	Role: string;
	State: string;
	Party: string;
};

type Row = {
	id: string;
	name: string;
	stance?: string;
	role?: string;
	state?: string;
	party?: string;
};

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const query = (searchParams.get('query') || '').toLowerCase();
		const stateParam = (searchParams.get('state') || '').trim();
		const zipParam = (searchParams.get('zip') || '').trim();
	const party = (searchParams.get('party') || '').toLowerCase();
		const page = parseInt(searchParams.get('page') || '1', 10);
	const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
		const roleParam = (searchParams.get('role') || '').trim().toLowerCase();
		const stanceParam = (searchParams.get('stance') || '').trim().toLowerCase();

	try {
		const filePath = path.join(process.cwd(), 'public', 'Standwithcryptopoliticians.csv');
		const csvText = await readFile(filePath, 'utf8');
		const rows = parseCsv(csvText);

			let data: Row[] = rows.map(r => {
				const stateCode = toStateCode(r.State?.trim());
				return {
					id: slugify(r.Name + '-' + (stateCode || '')),
					name: r.Name?.trim() || '-',
					stance: r['Stance on crypto']?.trim() || undefined,
					role: r.Role?.trim() || undefined,
					state: stateCode, // display normalized 2-letter code when available
					party: r.Party?.trim() || undefined,
				};
			});

			if (query) data = data.filter(i => i.name.toLowerCase().includes(query));

			// Resolve desired state code from zip first, else from state param
			let desiredStateCode: string | undefined;
			if (zipParam) desiredStateCode = zipToState(zipParam);
			if (!desiredStateCode && stateParam) desiredStateCode = toStateCode(stateParam);

			if (desiredStateCode) {
				data = data.filter(i => (i.state || '').toUpperCase() === desiredStateCode);
			}

			if (party) data = data.filter(i => (i.party || '').toLowerCase().includes(party));
			if (roleParam) data = data.filter(i => (i.role || '').toLowerCase().includes(roleParam));
			if (stanceParam) data = data.filter(i => (i.stance || '').toLowerCase().includes(stanceParam));

		const total = data.length;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));
		const safePage = Math.min(Math.max(1, page), totalPages);
		const start = (safePage - 1) * pageSize;
		const pageData = data.slice(start, start + pageSize);

		return new Response(JSON.stringify({ data: pageData, total, page: safePage, pageSize, totalPages }), {
			status: 200,
			headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
		});
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : 'Failed to read CSV';
			return new Response(JSON.stringify({ error: message }), { status: 500 });
	}
}

function parseCsv(text: string): CsvRow[] {
	const lines = text.split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return [];
	const header = lines[0].split(',');
		const rows: CsvRow[] = [];
	for (let i = 1; i < lines.length; i++) {
		const cols = splitCsvLine(lines[i]);
		if (!cols.length) continue;
			const obj: Record<string, string> = {};
		header.forEach((h, idx) => {
			obj[h.trim()] = (cols[idx] ?? '').trim();
		});
		rows.push(obj as CsvRow);
	}
	return rows;
}

// Handles quoted fields with commas
function splitCsvLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') { // escaped quote
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === ',' && !inQuotes) {
			result.push(current);
			current = '';
		} else {
			current += ch;
		}
	}
	result.push(current);
	return result;
}

function slugify(str: string): string {
	return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// State normalization: accepts full name or 2-letter code; returns 2-letter uppercase code
function toStateCode(input?: string): string | undefined {
	if (!input) return undefined;
	const s = input.trim();
	if (!s || s === '-' || s.toLowerCase() === 'na') return undefined;
	const up = s.toUpperCase();
	if (STATE_NAME_TO_CODE[up]) return STATE_NAME_TO_CODE[up];
	if (US_STATES.has(up)) return up;
	// Try title-case name
	const title = s.replace(/\b\w/g, c => c.toUpperCase());
	if (STATE_NAME_TO_CODE[title]) return STATE_NAME_TO_CODE[title];
	return undefined;
}

// ZIP to state mapping via range table (inclusive)
function zipToState(zip: string): string | undefined {
	const z = zip.trim();
	const m = z.match(/^(\d{5})/);
	if (!m) return undefined;
	const n = parseInt(m[1], 10);
	for (const r of ZIP_RANGES) {
		if (n >= r.start && n <= r.end) return r.code;
	}
	return undefined;
}

const US_STATES = new Set([
	'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','PR','VI','GU','AS','MP'
]);

const STATE_NAME_TO_CODE: Record<string, string> = {
	'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA', 'COLORADO': 'CO',
	'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI', 'IDAHO': 'ID',
	'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA',
	'MAINE': 'ME', 'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS',
	'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ',
	'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH', 'OKLAHOMA': 'OK',
	'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC', 'SOUTH DAKOTA': 'SD',
	'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA',
	'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY', 'DISTRICT OF COLUMBIA': 'DC', 'WASHINGTON, DC': 'DC',
	'PUERTO RICO': 'PR', 'VIRGIN ISLANDS': 'VI', 'GUAM': 'GU', 'AMERICAN SAMOA': 'AS', 'NORTHERN MARIANA ISLANDS': 'MP',
	'CNMI': 'MP', 'MP': 'MP'
};

const ZIP_RANGES: { start: number; end: number; code: string }[] = [
	{ start: 35000, end: 36999, code: 'AL' },
	{ start: 99500, end: 99999, code: 'AK' },
	{ start: 85000, end: 86999, code: 'AZ' },
	{ start: 71600, end: 72999, code: 'AR' },
	{ start: 90000, end: 96199, code: 'CA' },
	{ start: 80000, end: 81699, code: 'CO' },
	{ start: 6000, end: 6999, code: 'CT' },
	{ start: 19700, end: 19999, code: 'DE' },
	{ start: 32000, end: 34999, code: 'FL' },
	{ start: 30000, end: 31999, code: 'GA' },
	{ start: 96700, end: 96999, code: 'HI' },
	{ start: 83200, end: 83999, code: 'ID' },
	{ start: 60000, end: 62999, code: 'IL' },
	{ start: 46000, end: 47999, code: 'IN' },
	{ start: 50000, end: 52999, code: 'IA' },
	{ start: 66000, end: 67999, code: 'KS' },
	{ start: 40000, end: 42799, code: 'KY' },
	{ start: 70000, end: 71599, code: 'LA' },
	{ start: 3900, end: 4999, code: 'ME' },
	{ start: 20600, end: 21999, code: 'MD' },
	{ start: 1000, end: 2799, code: 'MA' },
	{ start: 48000, end: 49999, code: 'MI' },
	{ start: 55000, end: 56799, code: 'MN' },
	{ start: 38600, end: 39999, code: 'MS' },
	{ start: 63000, end: 65999, code: 'MO' },
	{ start: 59000, end: 59999, code: 'MT' },
	{ start: 68000, end: 69399, code: 'NE' },
	{ start: 88900, end: 89899, code: 'NV' },
	{ start: 3000, end: 3899, code: 'NH' },
	{ start: 7000, end: 8999, code: 'NJ' },
	{ start: 87000, end: 88499, code: 'NM' },
	{ start: 10000, end: 14999, code: 'NY' },
	{ start: 27000, end: 28999, code: 'NC' },
	{ start: 58000, end: 58899, code: 'ND' },
	{ start: 43000, end: 45999, code: 'OH' },
	{ start: 73000, end: 74999, code: 'OK' },
	{ start: 97000, end: 97999, code: 'OR' },
	{ start: 15000, end: 19699, code: 'PA' },
	{ start: 2800, end: 2999, code: 'RI' },
	{ start: 29000, end: 29999, code: 'SC' },
	{ start: 57000, end: 57799, code: 'SD' },
	{ start: 37000, end: 38599, code: 'TN' },
	{ start: 75000, end: 79999, code: 'TX' }, { start: 88500, end: 88599, code: 'TX' },
	{ start: 84000, end: 84799, code: 'UT' },
	{ start: 500, end: 599, code: 'VT' }, { start: 5600, end: 5999, code: 'VT' },
	{ start: 20100, end: 20199, code: 'VA' }, { start: 22000, end: 24699, code: 'VA' },
	{ start: 98000, end: 99499, code: 'WA' },
	{ start: 24700, end: 26899, code: 'WV' },
	{ start: 53000, end: 54999, code: 'WI' },
	{ start: 82000, end: 83199, code: 'WY' },
	{ start: 20000, end: 20599, code: 'DC' }, { start: 56900, end: 56999, code: 'DC' },
	{ start: 600, end: 799, code: 'PR' }, { start: 900, end: 999, code: 'PR' }, { start: 6000, end: 7999, code: 'PR' }, // 006-009xx
	{ start: 800, end: 899, code: 'VI' }, // 008xx
	{ start: 96799, end: 96799, code: 'AS' },
	{ start: 96910, end: 96932, code: 'GU' },
	{ start: 96950, end: 96952, code: 'MP' },
];
