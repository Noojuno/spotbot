const commands = [];
const commandRegex = /(\/|!)(\w+) (.+)/;
const argsRegex = /[^\s"]+|"([^"]*)"/gi;

const parse = async message => {
  const res = commandRegex.exec(message);
  const commandData = {
    full: res[0],
    command: res[2],
    argString: res[3],
    args: parseArguments(res[3])
  };

  const args = parseArguments(res[3]);

  const command = commands.find(e => e.command == res[2]);

  let data = { message, args };

  await command.fn(data);

  return data;
};

// FROM https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
const parseArguments = argsString => {
  let args = [];

  do {
    //Each call to exec returns the next regex match as an array
    var match = argsRegex.exec(argsString);
    if (match != null) {
      //Index 1 in the array is the captured group if it exists
      //Index 0 is the matched text, which we use if no captured group exists
      args.push(match[1] || match[0]);
    }
  } while (match != null);

  return args;
};

const defaultParse = message => {
  return { command: "create", args: ["Test"] };
};

const add = (command, fn) => {
  commands.push({ command: command, fn: fn });
};

module.exports = { parse, add };
