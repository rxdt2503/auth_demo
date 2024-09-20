import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Ensure you have this in your .env.local
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {

    console.log('DEVELOPMENT')
    // In development mode, use a global variable so the MongoClient instance is not constantly refreshed.
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {

    console.log('PROD ')
    // In production mode, create a new client for every request.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
