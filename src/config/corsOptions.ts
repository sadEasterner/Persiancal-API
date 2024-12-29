import { ALLOWED_ORIGINS } from './parameters/allowed-origins';
type OriginType = string; // Change this to the appropriate type for origin
type CallbackType = (...args: any[]) => void;
import { CorsOptions } from 'cors';
export const corsOption: CorsOptions = {
    origin: (origin, callback) => {
        if ( !origin || ALLOWED_ORIGINS.indexOf(origin) !== -1 ) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
    credentials: true,
};
