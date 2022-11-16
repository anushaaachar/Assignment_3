const fs = require('fs/promises')

const myFileWriter = async (fileName, fileContent) => {
	// write code here
	// dont chnage function name
	try{
	await fs.WriteFile(fileName,fileContent);
	}
		catch(error){
			console.log(error);
		}
	}


const myFileReader = async (fileName) => {
	// write code here
	// dont chnage function name

	try{
		const data = await fs.readFile(fileName,'utf8')
		console.log(data)
		}
			catch(error){
				console.log(error);
			}
		}


const myFileUpdater = async (fileName, fileContent) => {
	// write code here
	// dont chnage function name
	try{
		await fs.appendFile(fileName,fileContent);
		}
			catch(error){
				console.log(error);
			}
		}


const myFileDeleter = async (fileName) => {
	// write code here
	// dont chnage function name
	try{
		await fs.unlink(fileName);
		}
			catch(err){
				console.log(err);
			}
		}
module.exports = { myFileWriter, myFileUpdater, myFileReader, myFileDeleter }