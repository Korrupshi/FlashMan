const fs = require('fs');
const { readFile } = require('fs').promises;

// const getSortedFiles = async (dir) => {
// 	const files = await fs.promises.readdir(dir);

// 	return files
// 		.map((fileName) => ({
// 			name: fileName,
// 			time: fs.statSync(`${dir}/${fileName}`).mtime.getTime(),
// 		}))
// 		.sort((a, b) => a.time - b.time)
// 		.map((file) => file.name);
// };

// Promise.resolve()
// 	.then(() => getSortedFiles(dir))
// 	.then(console.log)
// 	.catch(console.error);

// Async data load
var file;
async function hello() {
	var test = await readFile('./test/data.json', 'utf-8');

	return test;
}
hello();

const getFruit = async () => {
	const a = hello();
	return a;
};

hello().then((val) => console.log(val));
