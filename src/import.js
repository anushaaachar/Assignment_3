const {myFileWriter,myFileReader,myFileUpdater,myFileDeleter} = require('/index');
myFileWriter("myfile");
myFileReader("myfile");
myFileUpdater("myfile","and Iam the updated content!!!");
myFileDeleter("myfile");