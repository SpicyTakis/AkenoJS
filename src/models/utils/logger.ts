// logging.js
import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.printf((options) => {
                // you can pass any custom variable in options by calling
                // logger.log({level: 'debug', message: 'hi', moduleName: 'my_module' })
                return `[${options.moduleName}/${options.level}] - ${options.message}`;
            }),
        }),

        new winston.transports.File({
            filename: '../../logs/latest.log',
        }),
    ],
});

export default function (name: string) {
    // set the default moduleName of the child
    return logger.child({ moduleName: name });
}
