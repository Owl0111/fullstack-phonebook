const express = require('express')
const morgan = require('morgan')
const app = express()
const unkownEndpoint = (req, res) => {
    res.status(404).send(
        {
            error: 'This path does not exist',
        }
    )
}
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
});

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`Phonebook has info for ${persons.length} people`)
    console.log(date.getDay(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds);
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const maxId = () => {
        const id = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;
        return id + 1;
    }
    const isUnique = person => {
        for (let a of persons) {
            if (person.name === a.name) {
                return false;
            }
        }
        return true;
    }
    const body = request.body;
    const newPerson = {
        "name": body.name,
        "number": body.number,
        "id": maxId(),
    }
    if (!newPerson.number) {
        console.log("woot")
        return response.status(400).json({
            "error": "number does not exist",
        })
    }
    if (!newPerson.name) {
        console.log("woot")
        return response.status(400).json({
            "error": "name does not exist",
        })
    }
    if (!(isUnique(newPerson))) {
        return response.status(400).json({
            "error": "This person already exists",
        })
    }
    response.json(newPerson);
    persons = persons.concat(newPerson);
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})
app.use(unkownEndpoint);
const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})