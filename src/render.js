/* TODO: 
	1. When clicking hard / audio / flip, something goes wrong at reset

	Feature:
		- Choose to only get pinyin, or produce audio: 
			if 1 line, then full translate, if 2 lines, get pinyin + audio, if 3 lines get audio
		- Revamp the CSS look

	BUG:
*/

// A. Import functions_________________
const electron = require('electron');
const ipc = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');

// A.1 Add python IPC

function py_translate(py_df) {
	let options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: path.join(__dirname, '../py/'),
		args: [py_df],
	};
	// 1. Translate function
	let trans = new PythonShell('1b. translate.py', options);
	// test.end(function (err, code, message) {
	// 	console.log('Py script Error:' + err);
	// 	console.log('Py script finished:' + code + message);
	// });
	console.log('Starting translation...' + py_df);
	trans.on('message', function (message) {
		console.log(message);
		let py_audio = new PythonShell('2. audio.py', options);
		console.log('Generating audio...');
		py_audio.on('message', function (message) {
			console.log(message);
		});
	});
	// 2. Generate audio
}
const menu_create = document.getElementById('menu_create');
menu_create.addEventListener('click', (event) => {
	ipc.send('browse-create-file');
});

//  Receiver from Main
menu_create.addEventListener('click', () => {
	ipc.on('selected-create-file', function (event, path) {
		var temp1 = path.split('\\').slice(-1)[0]; //get filename
		var temp2 = temp1.split('.')[0];

		console.log('File selected: ' + temp2);
		var py_file = temp2;
		py_translate(py_file);
	});
});

// Global functions:
// a. randomize list
function shuffle(array) {
	var currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
// b. Function to check if .mp3 file exists
function file_check(filename) {
	try {
		fs.accessSync(
			path.join(
				__dirname,
				`../data/audio/${filename}-${audio_index[english[count]]}.mp3`
			)
		);
		return true;
	} catch {
		return false;
	}
}
// B. IPC Main functions
// 1. Browse files IPC
// var filename;

const deck_browse = document.getElementById('deck_browse');
deck_browse.addEventListener('click', (event) => {
	ipc.send('browse-file');
});
//  Receiver from Main
ipc.on('selected-file', function (event, path) {
	var temp1 = path.split('\\').slice(-1)[0]; //get filename
	var temp2 = temp1.split('.')[0];

	console.log('File selected: ' + temp2);
	filename = temp2;
	reset();
	load_data();
});

// C. Load in data and global variables________________
// C.1 Get saved decks
const dir = './data/deck/';

// __________
const saved_deck = [];
var temp_deck = fs.readdirSync(dir);
temp_deck.sort(function (a, b) {
	return (
		fs.statSync(dir + b).mtime.getTime() -
		fs.statSync(dir + a).mtime.getTime()
	);
});
temp_deck.forEach((i) => {
	var temp3 = i.split('.')[0];
	saved_deck.push(temp3);
});

// Global variables
var filename = saved_deck[0];
var data; // main data file
var english; // L2 flash set
var audio_index = {}; // track audio file when shuffling
var df1; //Level 1 df
var df2; //constant L2
var df3; // level 3
var temp = []; //holder for english items
var text_input = [];
let fname = '';

// Switch variables
var deck_size = 10;
var count = -1;
var cycle = 0;
var flip_count = 0;
var flip_on = 'off';
var hard_count = 0;
var hard_on = 'off';
var audio_count = 0;
var audio_on = 'off';

// x. Load data function

// C. Function variables________________
// 1. Function id
const btn_show = document.getElementById('btn_show');
const btn_audio = document.getElementById('btn_audio');
const btn_reset = document.getElementById('btn_reset');
const btn_flip = document.getElementById('btn_flip');
const btn_hard = document.getElementById('btn_hard');
const btn_l3 = document.getElementById('btn_l3');
const btn_easy = document.getElementById('btn_easy');
const btn_add = document.getElementById('btn_add');
const btn_audio_on = document.getElementById('btn_audio_on');
const menu_stats = document.getElementById('menu_stats');
const menu_write_file = document.getElementById('menu_write_file');
const deck_item1 = document.getElementById('deck_item1');
const deck_item2 = document.getElementById('deck_item2');
const deck_item3 = document.getElementById('deck_item3');
// fill in last made decks
deck_item1.innerHTML = saved_deck[0];
deck_item2.innerHTML = saved_deck[1];
deck_item3.innerHTML = saved_deck[2];

// 2. Response
const front = document.getElementById('lab_front');
const back = document.getElementById('lab_back');
const pinyin = document.getElementById('lab_pin');
const num_flash = document.getElementById('num_flash');
const icon_flip = document.getElementById('icon_flip');
const icon_hard = document.getElementById('icon_hard');
const icon_audio = document.getElementById('icon_audio');
const lab_feed = document.getElementById('lab_feed');
const audio = document.getElementById('myAudio');

// b. Sync method
function load_data() {
	try {
		data = JSON.parse(
			fs.readFileSync(`./data/deck/${filename}.json`, 'utf8')
		); // File path is done by main.js?
		df2 = Object.keys(data);
		for (var i = -1; i < df2.length; i++) {
			audio_index[df2[i]] = i;
		}
		console.log(`${filename}.json successfully loaded`);
	} catch (err) {
		console.log(`${filename}.json failed to load` + err);
	}
	// Add function here to load L1 and L3, and remove L1 from df2
	try {
		df1 = JSON.parse(
			fs.readFileSync(`./data/sets/${filename}_L1.json`, 'utf8')
		);
	} catch (err) {
		console.log('L1 failed to load ' + err);
		// df1 = [];
	}

	try {
		df3 = JSON.parse(
			fs.readFileSync(`./data/sets/${filename}_L3.json`, 'utf8')
		);
	} catch (err) {
		console.log('L3 failed to load ' + err);
		// df3 = [];
	}
	english = []; //empty list to fill
	temp = [];
	try {
		df2.forEach(function (i) {
			if (df1.includes(i) === false) {
				temp.push(i);
			}
		});
	} catch (err) {
		temp = df2;
	}

	// temp = shuffle(temp); // Randomize full deck
	english = temp.slice(0, deck_size);
	english = shuffle(english); // Ordered deck
	lab_feed.innerHTML = `Deck: '${filename}'`;
	setTimeout(() => {
		lab_feed.innerHTML = '';
	}, 5000);
}

load_data();
// D. Functions__________________
// 1. Show flashcard
function show_flash() {
	// ipc.send('btn_show', 'Show card');
	if (english.length == 0) {
		front.innerHTML = 'No cards in deck';
	} else {
		cycle++;
		// var english = shuffle(english); // Randomize deck
		if (cycle % 2 == 0) {
			//show front card
			// front.innerHTML = english[count];
			if (audio_on === 'on') {
				// Audio mode on
				front.innerHTML = `${english[count]}`;
				pinyin.innerHTML = `${data[english[count]][0]}`;
				back.innerHTML = data[english[count]][1];

				audio.play();
			} else {
				// Audio mode off
				front.innerHTML = `${english[count]}`;
				pinyin.innerHTML = `${data[english[count]][0]}`;

				audio.play();
			}
		} else {
			// Show back card: this is starting point
			if (count == english.length - 1) {
				reset();
			} else {
				count++;

				if (audio_on === 'on') {
					// audio mode on
					num_flash.innerHTML = `(${count + 1}/${english.length})`;
					front.innerHTML = '';
					pinyin.innerHTML = '';
					back.innerHTML = '';
				} else {
					// audio mode off
					num_flash.innerHTML = `(${count + 1}/${english.length})`;
					front.innerHTML = '';
					pinyin.innerHTML = '';
					back.innerHTML = data[english[count]][1];
				}

				if (
					// First check if the file is .mp3, if not then .wav
					file_check(filename) == true
				) {
					// console.log('mp3 file is found');
					audio.src = `../data/audio/${filename}-${
						audio_index[english[count]]
					}.mp3`;
				} else {
					try {
						// console.log('No .mp3 found, using .wav');
						audio.src = `../data/audio/${filename}-${
							audio_index[english[count]]
						}.wav`;
					} catch (err) {
						console.log(err);
					}
				}
				if (audio_on === 'on') {
					audio.play();
				}
			}
		}
	}
}
// Link
btn_show.addEventListener('click', function () {
	if (flip_on === 'off') {
		// load_data();
		show_flash();
	} else {
		flip_show();
	}
});

// 2. Reset function
function reset() {
	update_deck(); //!Turn this off if shit breaks
	load_data();

	english = shuffle(english);
	num_flash.innerHTML = `(0/${english.length})`;

	front.innerHTML = '';
	back.innerHTML = '';
	pinyin.innerHTML = '';
	count = -1;
	cycle = 0;
}
btn_reset.addEventListener('click', function () {
	ipc.send('btn_reset', 'Reset cards');
	// update_deck();
	// load_data();
	reset();
});

// 3. Play audio
function play_audio() {
	try {
		audio.play();
	} catch (err) {
		console.log(`Error reading file from disk: ${err}`);
	}
}
btn_audio.addEventListener('click', function () {
	ipc.send('btn_audio', 'Play audio');
	play_audio();
});

// 4. Flip deck, reverse
function flip() {
	reset();
	flip_count++;
	if (flip_count % 2 == 0) {
		flip_on = 'off';
		lab_feed.innerHTML = '';
		icon_flip.style.fill = 'var(--mainText)';
		icon_flip.style.stroke = 'var(--mainText)';
	} else {
		flip_on = 'on';
		lab_feed.innerHTML = 'Reverse mode active';
		setTimeout(() => {
			lab_feed.innerHTML = '';
		}, 3000);
		icon_flip.style.fill = 'var(--btnColor)';
		icon_flip.style.stroke = 'var(--btnColor)';
	}
}
btn_flip.addEventListener('click', function () {
	ipc.send('btn_flip');
	flip();
});

// // 4.b Flip show
function flip_show() {
	cycle++;
	if (cycle % 2 != 0) {
		if (count == english.length - 1) {
			reset();
		} else {
			count++;
			num_flash.innerHTML = `(${count + 1}/${english.length})`;
			front.innerHTML = english[count];
			back.innerHTML = '';
			pinyin.innerHTML = '';
			if (
				// First check if the file is .mp3, if not then .wav
				file_check(filename) == true
			) {
				console.log('mp3 file is found');
				audio.src = `../data/audio/${filename}-${
					audio_index[english[count]]
				}.mp3`;
			} else {
				try {
					console.log('No .mp3 found, using .wav');
					audio.src = `../data/audio/${filename}-${
						audio_index[english[count]]
					}.wav`;
				} catch (err) {
					console.log(err);
				}
			}
		}
	} else {
		back.innerHTML = data[english[count]][1];
		pinyin.innerHTML = `${data[english[count]][0]}`;
		front.innerHTML = `${english[count]}`;
		// audio = new Audio(
		// 	`../data/audio/${filename}-${audio_index[english[count]]}.wav`
		// );
		audio.play();
	}
}

// 5. Activate hardmode
function hard_flash() {
	reset();
	hard_count++;
	if (hard_count % 2 == 0) {
		// Deactivate hard mode
		hard_on = 'off';
		console.log('Normal mode active');
		lab_feed.innerHTML = '';
		english = temp.slice(0, deck_size);
		english = shuffle(english);
		num_flash.innerHTML = `(0/${english.length})`;
		icon_hard.style.fill = 'var(--mainText)';
		icon_hard.style.stroke = 'var(--mainText)';
	} else {
		// Hard mode activate
		hard_on = 'on';
		lab_feed.innerHTML = 'Hard mode ON';
		setTimeout(() => {
			lab_feed.innerHTML = '';
		}, 3000);
		icon_hard.style.fill = 'var(--btnColor)';
		icon_hard.style.stroke = 'var(--btnColor)';
		english = shuffle(df3);
		num_flash.innerHTML = `(0/${english.length})`;
		console.log('Hard mode active');
	}
}

btn_hard.addEventListener('click', function () {
	hard_flash();
});

// 6. Item to level 1
function to_easy() {
	if (hard_on == 'on') {
		df3.splice(df3.indexOf(english[count]), 1);
		console.log('L3 size is now:' + df3.length);
		if (flip_on == 'off') {
			show_flash();
		} else {
			flip_show();
		}
	}
	// Normal mode
	else {
		if (df1.includes(english[count])) {
			console.log('this word is already in L1');
			if (flip_on == 'off') {
				show_flash();
			} else {
				flip_show();
			}
		} else {
			df1.push(english[count]);
			console.log(`"${english[count]}" was too easy.`);
			if (flip_on == 'off') {
				show_flash();
			} else {
				flip_show();
			}
		}
	}
}
btn_easy.addEventListener('click', function () {
	ipc.send('btn_Easy');
	to_easy();
});

// 7. Item to level 3
function to_hard() {
	if (df3.includes(english[count])) {
		console.log('this word is already in L3');
		if (flip_on == 'off') {
			show_flash();
		} else {
			flip_show();
		}
	} else {
		df3.push(english[count]);
		console.log(`"${english[count]}" was too difficult.`);
		if (flip_on == 'off') {
			show_flash();
		} else {
			flip_show();
		}
	}
}
btn_l3.addEventListener('click', function () {
	ipc.send('btn_l3');
	to_hard();
});

// 8. Add 10 cards
function add_10() {
	if (deck_size < temp.length) {
		deck_size = deck_size + 10;
	} else {
		deck_size = temp.length;
	}
	console.log(deck_size);
	english = temp.slice(0, deck_size);
	// console.log('10 cards added!');
	num_flash.innerHTML = `(${count + 1}/${english.length})`;
}

btn_add.addEventListener('click', function () {
	add_10();
});

// 9. Update
function update_deck() {
	// convert JSON object to a string
	var json_df1 = JSON.stringify(df1);

	// Write L1 file
	// Sync
	try {
		fs.writeFileSync(`./data/sets/${filename}_L1.json`, json_df1);
		console.log('L1 updated!');
	} catch {
		let temp = [];
		json_df1 = JSON.stringify(temp);
		fs.writeFileSync(`./data/sets/${filename}_L1.json`, json_df1);
	}

	// Async
	// fs.writeFile(`./data/${filename}_L1.json`, json_df1, 'utf8', (err) => {
	// 	if (err) {
	// 		console.log(`Error writing file: ${err}`);
	// 	} else {
	// 		console.log(`L1 json is updated successfully!`);
	// 	}
	// });

	let json_df3 = JSON.stringify(df3);

	// Write L3 file
	try {
		fs.writeFileSync(`./data/sets/${filename}_L3.json`, json_df3);
		console.log('L3 updated!');
	} catch {
		let temp = [];
		json_df3 = JSON.stringify(temp);
		fs.writeFileSync(`./data/sets/${filename}_L3.json`, json_df3);
	}

	// fs.writeFile(`./data/${filename}_L3.json`, json_df3, 'utf8', (err) => {
	// 	if (err) {
	// 		console.log(`Error writing file: ${err}`);
	// 	} else {
	// 		console.log(`L3 is updated successfully!`);
	// 	}
	// });
}

// 10. Audio mode
function audio_mode() {
	reset();
	audio_count++;
	if (audio_count % 2 == 0) {
		audio_on = 'off';
		lab_feed.innerHTML = '';
		icon_audio.style.fill = 'var(--mainText)';
		icon_audio.style.stroke = 'var(--mainText)';
	} else {
		audio_on = 'on';
		lab_feed.innerHTML = 'Audio mode ON';
		setTimeout(() => {
			lab_feed.innerHTML = '';
		}, 3000);
		icon_audio.style.fill = 'var(--btnColor)';
		icon_audio.style.stroke = 'var(--btnColor)';
	}
}

btn_audio_on.addEventListener('click', function () {
	audio_mode();
});

// 11. Menu stats function
function get_stats() {
	lab_feed.innerHTML = `Total of ${temp.length} cards left in main deck.`;
	setTimeout(() => {
		lab_feed.innerHTML = '';
	}, 5000);
}
menu_stats.addEventListener('click', function () {
	get_stats();
});

// 12. Saved deck
function deck_select1() {
	filename = deck_item1.innerHTML;
	load_data();
	reset();
}
deck_item1.addEventListener('click', function () {
	deck_select1();
});

function deck_select2() {
	filename = deck_item2.innerHTML;
	load_data();
	reset();
}
deck_item2.addEventListener('click', function () {
	deck_select2();
});

function deck_select3() {
	filename = deck_item3.innerHTML;
	load_data();
	reset();
}
deck_item3.addEventListener('click', function () {
	deck_select3();
});

// 13. Create a deck file
// 13.a Create button function
menu_write_file.addEventListener('click', (event) => {
	ipc.send('create-file');
	console.log('Write a new file');
});

// 13.b Get text from txt_area
function create_file() {
	try {
		// Convert Array to TSV
		let x;
		text_input.forEach((i) => {
			x = `${x}\n${i}`;
		});

		fs.writeFileSync(`./data/${fname}.txt`, x);
		console.log(`${fname}.txt is created!`);
	} catch (err) {
		console.log('Something went wrong: ' + err);
	}
}

ipc.on('sending-data-text', (event, data, title) => {
	text_input = data.split(/\r?\n/);
	fname = title;
	create_file();
});

// 14. Delete decks
let deck_del = document.getElementById('deck_del');
let del_file;
const dir_sets = './data/sets';
const dir_audio = './data/audio';

deck_del.addEventListener('click', () => {
	ipc.send('del-browse-file');
});
//  Receiver from Main
ipc.on('selected-del-file', function (event, path) {
	var temp1 = path.split('\\').slice(-1)[0]; //get filename
	del_file = temp1.split('.')[0];
	del_deck();
});

function del_deck() {
	// a. Delete deck
	fs.unlink(`./data/deck/${del_file}.json`, function (err) {
		if (err) {
			console.log(err);
		}
		// if no error, file has been deleted successfully
	});
	fs.unlink(`./data/${del_file}.txt`, function (err) {
		if (err) {
			console.log(err);
		}
	});
	// b. Delete sets
	fs.readdir(dir_sets, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			if (file.includes(del_file) === true) {
				fs.unlink(path.join(dir_sets, file), (err) => {
					if (err) throw err;
				});
			}
		}
	});
	// c. Delete Audio
	fs.readdir(dir_audio, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			if (file.includes(del_file) === true) {
				fs.unlink(path.join(dir_audio, file), (err) => {
					if (err) throw err;
				});
			}
		}
		console.log(`Files for ${del_file} deleted!`);
		reset();
	});
}

// 15. Reset deck L1 and L2
const deck_res = document.getElementById('deck_res');

deck_res.addEventListener('click', () => {
	df1 = [];
	df3 = [];
	reset();
	update_deck();
	load_data();
});
