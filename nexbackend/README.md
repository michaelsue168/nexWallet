# nexWallet Backend

## 🔨 Project Setup

```sh
npm install
```

### Created MongoDB atlas
This project uses mongoDB atlas as the database, so you need to [register](https://www.mongodb.com/cloud/atlas/register) an account first, and then create the database and collection.


### Change the .env file
1. Change the file name ~~example~~ .env
2. Fill in the SESSION_SECRET, MONGODB_URI, DBName, FRONTEND_URL


### Compile for Development

```sh
npm run dev
```

## 📂 Backend Folder structure

```plaintext
/backend

├── /src
│   ├── /handlers           //Handle frontend requests and send back responses
│   ├── index.mjs           //Page entry file
├── .env                    //Set environment variables
```

