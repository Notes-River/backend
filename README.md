## Server for Notes River

for setup this server in local Follow These instructions.

```bash
    git clone https://github.com/Notes-River/backend.git
```

```bash 
    cd backend
```

```bash
    npm install
```

After that you have to start local redis-server and mongodb server. If you don't have mongodb then you can use mongodb atlas but in case you are using mongodb Atlas then you have to make little update in Connection.js file. 

```
const run = async () => {
    await mongoose.connect('mongodb://127.0.0.1/notes', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
}
```

Update 
```bash
    mongodb://127.0.0.1/notes
```
to 

``bash
    <your mongodb atlas url>
```

## API Documentation

Follow this url for api docs for this server
see documentation [here](https://documenter.getpostman.com/view/11583515/UzQvsQjs)