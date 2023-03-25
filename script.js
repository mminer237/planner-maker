"use strict";

const currentDate = new Date();
const offsetMonths = parseInt(document.getElementById("start-offset").value);
const offsetYears = Math.floor((currentDate.getMonth() + offsetMonths) / 12);
const startingDate = new Date(currentDate.getFullYear() + offsetYears, (currentDate.getMonth() + offsetMonths) % 12, 1);
const numberOfMonths = parseInt(document.getElementById("number-of-months").value);
const numberOfYears = Math.floor((startingDate.getMonth() + numberOfMonths) / 12);
const endingDate = new Date(startingDate.getFullYear() + numberOfYears, ((startingDate.getMonth() + numberOfMonths) % 12) + 1, 0);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let page = 1;

document.getElementById("generate").onclick = generate;
function generate() {
	const newWindow = window.open(undefined, "print-planner");

	const startingYear = startingDate.getFullYear();
	const endingYear = endingDate.getFullYear();
	const title = startingYear + (startingYear !== endingYear ? ' – ' + endingYear : '') + ' Planner';
	
	newWindow.onload = function() {
		newWindow.print();
	};
	/* Draw title page */
	newWindow.document.head.innerHTML = `<title>${title}</title>
	<link rel="stylesheet" href="planner.css">`;
	newWindow.document.body.innerHTML = '';
	newWindow.document.write(`<!DOCTYPE html>
	<html>
		<head>
		</head>
		<body>
			<div class="page">
				<h1>${title}</h1>
				<div class="author">
					<p>By</p>
					<p>Matthew &amp; Samantha Miner</p>
				</div>`);
	insertPageBreak(newWindow);

	/* Create header */
	newWindow.document.write(`<header>${title}</header>`);

	/* Draw calendar pages */
	let calendarMonth = startingDate.getMonth();
	for (let year = startingYear; year <= endingYear; year++) {
		for (
			;
			(year !== endingYear && calendarMonth < 12) ||
			(year === endingYear && calendarMonth < endingDate.getMonth());
			calendarMonth++
		) {
			drawCalendar(newWindow, year, calendarMonth);
		}
		calendarMonth = 0;
	}

	newWindow.document.write(`</div></body></html>`);

	/* Set total page count */
	newWindow.document.querySelectorAll(".total-pages").forEach(x => x.innerHTML = page - 1);

	// newWindow.print();
	// newWindow.close();
}
generate(); // For testing

function drawCalendar(window, year, month) { // TODO: Split across two pages
	const date = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = date.getDay();
	const lastDay = new Date(year, month, daysInMonth).getDay();
	const monthName = monthNames[month];

	window.document.write(`<div class="calendar">
		<h2>${monthName}</h2>`);
	drawHalfCalendar(window, year, month, 0, 4);
	window.document.write('</div>');
	insertPageBreak(window);
	window.document.write('<div class="calendar">');
	drawHalfCalendar(window, year, month, 4, 7);
	window.document.write('</div>');
	insertPageBreak(window);
}

function drawHalfCalendar(window, year, month, startDay, endDay) {
	const date = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = date.getDay();
	const lastDay = new Date(year, month, daysInMonth).getDay();
	const monthName = monthNames[month];

	window.document.write('<table><tr>');
	for (let i = startDay; i < endDay; i++) {
		window.document.write(`<th>${weekdayAbbreviations[i]}</th>`);
	}
	window.document.write('</tr>');
	let dayOfMonth = Math.max(1, 1 - firstDay + startDay);
	let dayOfWeek = Math.max(firstDay, startDay);
	for (let week = 0; week < 6; week++) {
		window.document.write(`<tr>`);
		for (let i = startDay; i < dayOfWeek && i < endDay; i++) {
			window.document.write(`<td>&nbsp;</td>`);
		}
		for (; dayOfWeek < endDay; dayOfWeek++) {
			if (dayOfMonth <= daysInMonth) {
				window.document.write(`<td>${dayOfMonth++}</td>`);
			} else {
				window.document.write(`<td>&nbsp;</td>`);
			}
		}
		window.document.write(`</tr>`);
		dayOfMonth += 7 - dayOfWeek + startDay;
		dayOfWeek = startDay;
	}
	window.document.write(`</table>`);
}

function insertPageBreak(window) {
	window.document.write(`<div class="footer">Page ${page++} of <span class="total-pages"></span></div></div><div class="page">`);
}
