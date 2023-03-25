"use strict";

const currentDate = new Date();
const offsetMonths = parseInt(document.getElementById("start-offset").value);
const offsetYears = Math.floor((currentDate.getMonth() + offsetMonths) / 12);
const startingDate = new Date(currentDate.getFullYear() + offsetYears, (currentDate.getMonth() + offsetMonths) % 12, 1);
const numberOfMonths = parseInt(document.getElementById("number-of-months").value);
const numberOfYears = Math.floor((startingDate.getMonth() + numberOfMonths) / 12);
const endingDate = new Date(startingDate.getFullYear() + numberOfYears, ((startingDate.getMonth() + numberOfMonths) % 12) + 1, 0);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
	newWindow.document.head.innerHTML = '';
	newWindow.document.body.innerHTML = '';
	newWindow.document.write(`<!DOCTYPE html>
	<html>
		<head>
			<title>${title}</title>
			<link rel="stylesheet" href="planner.css">
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

function drawCalendar(window, year, month) {
	const date = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = date.getDay();
	const lastDay = new Date(year, month, daysInMonth).getDay();
	const monthName = monthNames[month];

	window.document.write(`<div class="calendar">
		<h2>${monthName}</h2>
		<table>
			<tr>
				<th>Sun</th>
				<th>Mon</th>
				<th>Tue</th>
				<th>Wed</th>
				<th>Thu</th>
				<th>Fri</th>
				<th>Sat</th>
			</tr>`);
	let dayOfMonth = 1;
	let dayOfWeek = firstDay;
	for (let week = 0; week < 5; week++) {
		window.document.write(`<tr>`);
		for (let i = 0; i < dayOfWeek; i++) {
			window.document.write(`<td></td>`);
		}
		for (; dayOfWeek < 7; dayOfWeek++) {
			if (dayOfMonth <= daysInMonth) {
				window.document.write(`<td>${dayOfMonth++}</td>`);
			} else {
				window.document.write(`<td></td>`);
			}
		}
		window.document.write(`</tr>`);
		dayOfWeek = 0;
	}
	window.document.write(`</table></div>`);
	insertPageBreak(window);
}

function insertPageBreak(window) {
	window.document.write(`<div class="footer">Page ${page++} of <span class="total-pages"></span></div></div><div class="page">`);
}
