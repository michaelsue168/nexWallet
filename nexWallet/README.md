# nexWallet Frontend

## 🔨 Project Setup

```sh
npm install
```

### Change to your backend url

```javascript
// services/APIServer.js
const APIServer = axios.create({
    baseURL: 'https://...', //Your Backend URL
    ...
  });
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
## 📂 Frontend Folder structure

```plaintext
/frontend

├── /src
│   ├── /assets             //Images, css
│   ├── /components         //Web page components
│   ├── /handlers           //Handle interactions with the backend
│   ├── /router             //router setting
│   ├── /services
│       ├── /APIServer.js   //HTTP client instance
│   ├── /views              //Web page
│   ├── /App.vue            //Page entry file
│   ├── /main.js            //Initialize vue,define global components
...
```

