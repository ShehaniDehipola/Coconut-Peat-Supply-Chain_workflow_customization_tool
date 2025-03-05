// Start parsing from the list of commands
Start
  = Command+

Command
  = ActionCommand
  / ConditionalCommand
  / LoopCommand
  / TimeDelayCommand
  / UnsupportedCommand

// Action commands like wash, process, dry
ActionCommand
  = action:Action _ object:Word _ preposition:Word? _ context:Word+ {
      return `${action}(${context.join(" ")});`;
    }

// Conditional statements such as if EC level <= 200 or sensor readings
ConditionalCommand
  = "If" _ condition:Condition {
      return `if ${condition} {`;
    }
  / "else" {
      return "} else {";
    }
  / "endif" {
      return "}";
    }

// Condition based on sensor reading or EC level
Condition
  = "sensor" _ sensorType:Word _ comparator:Comparator _ value:Number {
      return `readSensor("${sensorType}") ${comparator} ${value}`;
    }
  / "EC level" _ comparator:Comparator _ value:Number {
      return `ecLevel ${comparator} ${value}`;
    }

// Loop commands such as loop 5 times
LoopCommand
  = "loop" _ times:Number {
      return `for i := 0; i < ${times}; i++ {`;
    }

// Time delay such as wait X hours
TimeDelayCommand
  = "wait" _ hours:Number _ "hours" {
      return `time.Sleep(${hours} * time.Hour);`;
    }

// For commands we do not support, return a comment
UnsupportedCommand
  = .* {
      return `// Unsupported command: ${text()}`;
    }

// Define allowed actions
Action
  = "wash" / "process" / "dry" / "cut"

// A word is any sequence of letters
Word
  = chars:[a-zA-Z]+ { return chars.join(""); }

// A number is any sequence of digits
Number
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

// Comparators for conditions (<=, >=, etc.)
Comparator
  = "<=" / ">=" / "==" / "!=" / "<" / ">"
  
// Optional whitespace handling
_ = [ \t]*
