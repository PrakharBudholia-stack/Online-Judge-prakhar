const Question = require('../models/Question');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Submission = require('../models/Submission');
const { compileCode } = require('./compileController');

exports.compileCode = async (req, res) => {
  const { questionId, code, language } = req.body;
  const userId = req.user.userId;

  console.log('Compile request received:', { questionId, userId, language });

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      console.log('Question not found:', questionId);
      return res.status(404).send('Question not found');
    }

    const testCases = question.testCases;
    const results = [];
    let allPassed = true;

    const uniqueId = uuidv4();
    const userDir = path.join(__dirname, 'temp', uniqueId);
    fs.mkdirSync(userDir, { recursive: true });

    const fileName = `temp.${getFileExtension(language)}`;
    const filePath = path.join(userDir, fileName);

    console.log(`Writing code to file: ${filePath}`);
    fs.writeFileSync(filePath, code);

    const compileCommand = getCompileCommand(language, filePath);
    if (compileCommand) {
      await executeCommand(compileCommand);
    }

    let testCasesPassed = 0;
    let testCasesFailed = 0;

    for (const testCase of testCases) {
      const { input, output: expectedOutput } = testCase;
      console.log('Running test case:', { input, expectedOutput });
      const actualOutput = await executeCode(language, filePath, input);
      const passed = actualOutput.trim() === expectedOutput;
      if (!passed) {
        allPassed = false;
        testCasesFailed++;
      }else{
        testCasesPassed++;
      }
      console.log('Test case result:', { input, expectedOutput, actualOutput, passed });
      results.push({
        input,
        expectedOutput,
        actualOutput,
        passed
      });
    }

    fs.rmdirSync(userDir, { recursive: true });
    console.log(`Temporary directory deleted: ${userDir}`);

    const finalResult = allPassed ? 'Accepted' : 'Rejected';
    console.log('All test cases executed. Final result:', finalResult);
    res.json({ results, finalResult, testCasesPassed, testCasesFailed });
  } catch (error) {
    console.error('Error during code compilation:', error.message);
    res.status(500).send(error.message);
  }
};

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error during command execution:', error.message);
        return reject(error);
      }
      if (stderr) {
        console.error('Stderr during command execution:', stderr);
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const executeCode = (language, filePath, input) => {
  return new Promise((resolve, reject) => {
    const command = getExecuteCommand(language, filePath);
    console.log('Running command:', command);

    const cmd = spawn(command, { shell: true });

    let stdout = '';
    let stderr = '';

    if (input) {
      cmd.stdin.write(input);
      cmd.stdin.end();
    }

    cmd.stdin.on('error', err => {
      reject({ msg: 'on stdin error', error: `${err}` });
    });

    cmd.stdout.on('data', (data) => {
      stdout += `${data}`;
    });

    cmd.stderr.on('data', (data) => {
      stderr += `${data}`;
    });

    cmd.on('error', (error) => reject(error));

    cmd.on('close', (code) => {
      if (code !== 0) {
        reject(`${stderr}`);
      } else {
        resolve(`${stdout}`.trim());
      }

      if (language === 'cpp') {
        const outFile = `${filePath}.out`;
        if (fs.existsSync(outFile)) {
          fs.unlinkSync(outFile);
          console.log(`Temporary .out file deleted: ${outFile}`);
        }
      }
    });
  });
};

const getFileExtension = (language) => {
  console.log(`Getting file extension for language: ${language}`);
  switch (language) {
    case 'python': return 'py';
    case 'javascript': return 'js';
    case 'cpp': return 'cpp';
    default: 
      console.error('Unsupported language:', language);
      throw new Error('Unsupported language');
  }
};

const getCompileCommand = (language, filePath) => {
  console.log(`Getting compile command for language: ${language}`);
  switch (language) {
    case 'cpp': return `g++ ${filePath} -o ${filePath}.out`;
    default: return null;
  }
};

const getExecuteCommand = (language, filePath) => {
  console.log(`Getting execute command for language: ${language}`);
  switch (language) {
    case 'python': return `python3 ${filePath}`;
    case 'javascript': return `node ${filePath}`;
    case 'cpp': return `${filePath}.out`;
    default: 
      console.error('Unsupported language:', language);
      throw new Error('Unsupported language');
  }
};

exports.submitSolution = async (req, res) => {
  const { userId, questionId, code } = req.body;

  try {
    // Assume getTestCases is a function that retrieves test cases for the question
    const testCases = await getTestCases(questionId); // Assume this function exists

    const { testCasesPassed, testCasesFailed } = await compileCode(code, testCases);

    const submission = new Submission({
      userId,
      questionId,
      code,
      testCasesPassed,
      testCasesFailed
    });

    await submission.save();

    res.status(201).json({ message: 'Submission successful', submission });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ message: 'Error submitting solution', error });
  }
};