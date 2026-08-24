import winston from "winston";

const logger = winston.createLogger({

  level: "info",

  format: winston.format.combine(

    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),

    winston.format.errors({ stack: true }),

    winston.format.printf(
      ({ level, message, timestamp, stack }) => {

        return `${timestamp} ${level}: ${stack || message}`;
      }
    )
  ),

  transports: [

    /*
    |--------------------------------------------------------------------------
    | Console Logs
    |--------------------------------------------------------------------------
    */

    new winston.transports.Console({

      format: winston.format.combine(

        winston.format.colorize({
          all: true
        }),

        winston.format.timestamp({
          format: "HH:mm:ss"
        }),

        winston.format.printf(
          ({ level, message, timestamp, stack }) => {

            return `[${timestamp}] ${level} → ${stack || message}`;
          }
        )
      )
    }),

    /*
    |--------------------------------------------------------------------------
    | Error Logs
    |--------------------------------------------------------------------------
    */

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),

    /*
    |--------------------------------------------------------------------------
    | Combined Logs
    |--------------------------------------------------------------------------
    */

    new winston.transports.File({
      filename: "logs/combined.log"
    })
  ]
});

export default logger;